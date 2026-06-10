# Tests — Lonchen

Documentación de tests manuales. Ejecutar después de cambios en RLS, middleware o flujos de autenticación.

---

## Cómo ejecutar los tests de RLS en Supabase

Los tests de RLS se ejecutan desde **Supabase → SQL Editor** simulando la sesión de un usuario específico:

```sql
set role authenticated;
set request.jwt.claims = '{"sub": "UUID_DEL_USUARIO", "role": "authenticated"}';

-- aquí va la consulta o acción a probar
```

---

## Tests de autenticación y rutas

### T-01 — Mesero redirige a su vista correcta
**Precondición:** usuario con rol `waiter` creado
**Acción:** iniciar sesión con ese usuario
**Resultado esperado:** redirige a `/waiter`
**Última ejecución:** ✅ Semana 1

### T-02 — Mesero no puede acceder a /settings
**Precondición:** sesión activa con rol `waiter`
**Acción:** navegar manualmente a `http://localhost:3000/settings`
**Resultado esperado:** redirige a `/waiter`
**Última ejecución:** ✅ Semana 1

### T-03 — Usuario con sesión activa no ve el formulario de login
**Precondición:** sesión activa con cualquier rol
**Acción:** navegar manualmente a `http://localhost:3000/login`
**Resultado esperado:** redirige al dashboard correspondiente según rol
**Última ejecución:** ✅ Semana 1

### T-04 — Sin sesión no se puede acceder a rutas protegidas
**Precondición:** ninguna sesión activa (ventana privada)
**Acción:** navegar a `http://localhost:3000/settings`
**Resultado esperado:** redirige a `/login`
**Última ejecución:** ✅ Semana 1

---

## Tests de RLS

### T-05 — Mesero no puede crear sucursales
**Precondición:** UUID de un usuario con rol `waiter`
**Acción:** ejecutar en SQL Editor:
```sql
set role authenticated;
set request.jwt.claims = '{"sub": "UUID_DEL_MESERO", "role": "authenticated"}';

insert into branches (organization_id, name)
values ('UUID_DE_LA_ORGANIZACION', 'Sucursal Hackeada');
```
**Resultado esperado:** `ERROR: 42501: new row violates row-level security policy`
**Última ejecución:** ✅ Semana 1

### T-06 — Aislamiento entre organizaciones
**Precondición:** dos organizaciones registradas, UUID del owner de la segunda
**Acción:** ejecutar en SQL Editor:
```sql
set role authenticated;
set request.jwt.claims = '{"sub": "UUID_OWNER_ORG_2", "role": "authenticated"}';

select * from organizations;
```
**Resultado esperado:** solo devuelve la organización propia, no la del otro restaurante
**Última ejecución:** ✅ Semana 1

---

## Tests pendientes (Semana 2+)

- [ ] T-07 — Kitchen puede marcar platillo como agotado
- [ ] T-08 — Kitchen no puede eliminar platillos
- [ ] T-09 — Waiter puede abrir y cerrar mesas
- [ ] T-10 — Waiter no puede modificar el menú
- [ ] T-11 — QR de mesa solo acepta órdenes cuando status = occupied
- [ ] T-12 — Comensal no puede ver datos internos del restaurante
