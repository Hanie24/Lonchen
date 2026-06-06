-- ============================================================
-- Lonchen — Schema inicial
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- organizations
-- ------------------------------------------------------------
create table organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  plan       text not null default 'free',
  created_at timestamptz not null default now()
);

alter table organizations enable row level security;


-- ------------------------------------------------------------
-- branches
-- ------------------------------------------------------------
create table branches (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  address         text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

alter table branches enable row level security;

create index branches_organization_id_idx on branches(organization_id);


-- ------------------------------------------------------------
-- profiles (extiende auth.users)
-- ------------------------------------------------------------
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  branch_id       uuid references branches(id) on delete set null,
  full_name       text not null,
  role            text not null,
  pin_hash        text,
  created_at      timestamptz not null default now()
);

alter table profiles enable row level security;

create index profiles_organization_id_idx on profiles(organization_id);
create index profiles_branch_id_idx on profiles(branch_id);


-- ------------------------------------------------------------
-- tables (mesas)
-- ------------------------------------------------------------
create table tables (
  id         uuid primary key default gen_random_uuid(),
  branch_id  uuid not null references branches(id) on delete cascade,
  name       text not null,
  capacity   int,
  status     text not null default 'available',
  qr_token   text not null unique default gen_random_uuid()::text,
  created_at timestamptz not null default now()
);

alter table tables enable row level security;

create index tables_branch_id_idx on tables(branch_id);


-- ------------------------------------------------------------
-- menu_categories
-- ------------------------------------------------------------
create table menu_categories (
  id         uuid primary key default gen_random_uuid(),
  branch_id  uuid not null references branches(id) on delete cascade,
  name       text not null,
  sort_order int not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

alter table menu_categories enable row level security;

create index menu_categories_branch_id_idx on menu_categories(branch_id);


-- ------------------------------------------------------------
-- menu_items
-- ------------------------------------------------------------
create table menu_items (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references menu_categories(id) on delete cascade,
  name         text not null,
  description  text,
  price        numeric(10,2) not null,
  image_url    text,
  is_available boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

alter table menu_items enable row level security;

create index menu_items_category_id_idx on menu_items(category_id);


-- ------------------------------------------------------------
-- menu_option_groups
-- ------------------------------------------------------------
create table menu_option_groups (
  id           uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  name         text not null,
  type         text not null,
  is_required  boolean not null default false,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

alter table menu_option_groups enable row level security;

create index menu_option_groups_menu_item_id_idx on menu_option_groups(menu_item_id);


-- ------------------------------------------------------------
-- menu_options
-- ------------------------------------------------------------
create table menu_options (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references menu_option_groups(id) on delete cascade,
  name         text not null,
  price_delta  numeric(10,2) not null default 0,
  is_available boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

alter table menu_options enable row level security;

create index menu_options_group_id_idx on menu_options(group_id);


-- ------------------------------------------------------------
-- orders
-- ------------------------------------------------------------
create table orders (
  id         uuid primary key default gen_random_uuid(),
  branch_id  uuid not null references branches(id) on delete cascade,
  table_id   uuid not null references tables(id) on delete cascade,
  opened_by  uuid not null references profiles(id) on delete cascade,
  status     text not null default 'open',
  created_at timestamptz not null default now(),
  closed_at  timestamptz
);

alter table orders enable row level security;

create index orders_branch_id_idx on orders(branch_id);
create index orders_table_id_idx on orders(table_id);


-- ------------------------------------------------------------
-- order_items
-- ------------------------------------------------------------
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

alter table order_items enable row level security;

create index order_items_order_id_idx on order_items(order_id);


-- ------------------------------------------------------------
-- order_item_options
-- ------------------------------------------------------------
create table order_item_options (
  id             uuid primary key default gen_random_uuid(),
  order_item_id  uuid not null references order_items(id) on delete cascade,
  menu_option_id uuid not null references menu_options(id) on delete cascade,
  price_delta    numeric(10,2) not null default 0
);

alter table order_item_options enable row level security;

create index order_item_options_order_item_id_idx on order_item_options(order_item_id);
