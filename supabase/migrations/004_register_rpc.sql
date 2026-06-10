-- ============================================================
-- Lonchen — RPC de registro
-- Crea organización + sucursal + perfil en una sola transacción.
-- Si cualquier paso falla, todo se revierte automáticamente.
-- ============================================================

create or replace function public.register_organization(
  p_user_id     uuid,
  p_full_name   text,
  p_org_name    text,
  p_slug        text,
  p_branch_name text,
  p_address     text default null
)
returns uuid  -- retorna el id de la organización creada
language plpgsql security definer
as $$
declare
  v_org_id uuid;
begin
  -- 1. Crear organización
  insert into organizations (name, slug)
  values (p_org_name, p_slug)
  returning id into v_org_id;

  -- 2. Crear primera sucursal
  insert into branches (organization_id, name, address)
  values (v_org_id, p_branch_name, p_address);

  -- 3. Crear perfil del owner
  -- branch_id es null: el owner pertenece a la organización completa
  insert into profiles (id, organization_id, branch_id, full_name, role)
  values (p_user_id, v_org_id, null, p_full_name, 'owner');

  return v_org_id;
end;
$$;
