# Schema — Lonchen

Decisiones de diseño de base de datos tabla por tabla.

---

## organizations

Representa a cada restaurante (tenant). Todo lo demás cuelga de esta tabla.

```sql
create table organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  plan       text not null default 'free',
  created_at timestamptz not null default now()
);
```

**Decisiones:**
- `slug` es único y se usará en URLs del menú QR (ej. `lonchen.app/mi-restaurante`)
- `plan` acepta: `free`, `starter`, `pro`, `enterprise`
- Sin `updated_at` por ahora — se agrega cuando haya lógica que lo requiera

---

## branches

Una organización puede tener una o varias sucursales según su plan.

```sql
create table branches (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  address         text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);
```

**Decisiones:**
- `address` es opcional — no todos los restaurantes necesitan mostrarla
- `is_active` permite desactivar sucursales al bajar de plan sin perder datos históricos
- `on delete cascade` — si se elimina la organización, se eliminan sus sucursales

---

## profiles

Extiende `auth.users` de Supabase con información propia del negocio. Comparten el mismo `id`.

```sql
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  branch_id       uuid references branches(id) on delete set null,
  full_name       text not null,
  role            text not null,
  pin_hash        text,
  created_at      timestamptz not null default now()
);
```

**Decisiones:**
- `role` acepta: `owner`, `manager`, `waiter`, `kitchen`
- `branch_id` es nullable — `owner` y `manager` pueden pertenecer a la organización completa
- `pin_hash` es nullable — pero la app exige PIN para roles `waiter` y `kitchen`
- PIN nunca se guarda en texto plano, solo su hash
- `on delete set null` en `branch_id` — si se elimina una sucursal, el perfil no se borra

---

## tables

Mesas físicas del restaurante. Cada mesa tiene un QR único que los comensales escanean.

```sql
create table tables (
  id         uuid primary key default gen_random_uuid(),
  branch_id  uuid not null references branches(id) on delete cascade,
  name       text not null,
  capacity   int,
  status     text not null default 'available',
  qr_token   text not null unique default gen_random_uuid()::text,
  created_at timestamptz not null default now()
);
```

**Decisiones:**
- `status` acepta: `available`, `occupied`, `reserved`
- `qr_token` es independiente del `id` para no exponer IDs internos en URLs públicas
- El QR solo permite ordenar cuando `status = 'occupied'` — el mesero debe abrir la mesa primero
- Si el comensal tiene el QR guardado y la mesa está `available`, solo puede ver el menú pero no ordenar
- `capacity` es opcional — no todos los restaurantes necesitan controlar aforo

---

## menu_categories

Agrupa los platillos del menú (Entradas, Tacos, Bebidas, Postres, etc.)

```sql
create table menu_categories (
  id         uuid primary key default gen_random_uuid(),
  branch_id  uuid not null references branches(id) on delete cascade,
  name       text not null,
  sort_order int not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);
```

**Decisiones:**
- `sort_order` permite al restaurante definir el orden de las categorías manualmente
- `is_active` permite ocultar una categoría completa sin borrarla

---

## menu_items

Platillos individuales dentro de una categoría.

```sql
create table menu_items (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references menu_categories(id) on delete cascade,
  name        text not null,
  description text,
  price       numeric(10,2) not null,
  image_url   text,
  is_available boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
```

**Decisiones:**
- `is_available` permite marcar un platillo como agotado sin eliminarlo del menú
- El comensal ve el platillo desactivado en tiempo real
- `description` e `image_url` son opcionales
- `owner`, `manager` y `kitchen` pueden modificar `is_available`
- `availability_changed_by` y `availability_changed_at` registran quién hizo el último cambio — el manager puede ver "Cocina marcó la Arrachera como agotada a las 2:34pm"

---

## menu_option_groups

Agrupa las opciones de un platillo. Maneja tanto variantes (elige uno) como modificadores (elige varios).

```sql
create table menu_option_groups (
  id           uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  name         text not null,
  type         text not null,
  is_required  boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
```

**Decisiones:**
- `type` acepta: `single` (elige uno — variante) o `multiple` (elige varios — modificador)
- `is_required` define si el comensal debe elegir obligatoriamente antes de ordenar
- Ejemplo variante: grupo "Sabor" (`single`, `required`) en un helado
- Ejemplo modificador: grupo "Extras" (`multiple`, `optional`) en una hamburguesa

---

## menu_options

Opciones individuales dentro de un grupo.

```sql
create table menu_options (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references menu_option_groups(id) on delete cascade,
  name         text not null,
  price_delta  numeric(10,2) not null default 0,
  is_available boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
```

**Decisiones:**
- `price_delta` es el costo adicional — `0` si la opción no tiene costo extra
- Puede ser negativo si una opción quita un ingrediente que reduce el precio (poco común pero posible)
- Las opciones seleccionadas en cada orden se guardan en `order_item_options` (ver más adelante)

---

## orders

Cuenta abierta en una mesa. Una mesa puede tener solo una orden `open` a la vez.

```sql
create table orders (
  id         uuid primary key default gen_random_uuid(),
  branch_id  uuid not null references branches(id) on delete cascade,
  table_id   uuid not null references tables(id) on delete cascade,
  opened_by  uuid not null references profiles(id) on delete cascade,
  status     text not null default 'open',
  created_at timestamptz not null default now(),
  closed_at  timestamptz
);
```

**Decisiones:**
- `status` acepta: `open`, `paid`, `cancelled`
- `paid` significa que la cuenta fue cobrada — la mesa puede seguir ocupada
- La mesa se libera (`available`) cuando el mesero la limpia, independiente del pago
- `closed_at` se llena cuando el status cambia a `paid` o `cancelled`

---

## order_items

Cada platillo dentro de una orden.

```sql
create table order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references orders(id) on delete cascade,
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  quantity     int not null default 1,
  unit_price   numeric(10,2) not null,
  notes        text,
  status       text not null default 'pending',
  created_at   timestamptz not null default now()
);
```

**Decisiones:**
- `unit_price` es un snapshot del precio al momento de ordenar — si el precio cambia después, la orden conserva el original
- `notes` es para instrucciones libres del comensal que no están en los modificadores (ej. "no ocupen pimienta")
- `status` acepta: `pending`, `preparing`, `ready`, `served`
- Este status es el que maneja la vista de cocina (KDS) en tiempo real

---

## order_item_options

Opciones elegidas por el comensal para cada platillo (variantes y modificadores).

```sql
create table order_item_options (
  id             uuid primary key default gen_random_uuid(),
  order_item_id  uuid not null references order_items(id) on delete cascade,
  menu_option_id uuid not null references menu_options(id) on delete cascade,
  price_delta    numeric(10,2) not null default 0
);
```

**Decisiones:**
- `price_delta` es un snapshot del costo extra al momento de ordenar
- Junto con `unit_price` de `order_items` permite recalcular el total exacto de cualquier orden histórica

---
