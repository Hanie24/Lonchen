-- ============================================================
-- Lonchen — RLS Policies
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================


-- ------------------------------------------------------------
-- Función auxiliar: devuelve el perfil del usuario actual
-- Vive en el schema public (auth está reservado para Supabase)
-- security definer = corre con permisos elevados para poder
-- leer profiles sin restricciones de RLS
-- ------------------------------------------------------------
create or replace function public.get_my_profile()
returns profiles
language sql security definer stable
as $$
  select * from profiles where id = auth.uid()
$$;


-- ------------------------------------------------------------
-- organizations
-- ------------------------------------------------------------

create policy "members can view own organization"
on organizations for select to authenticated
using (id = (get_my_profile()).organization_id);

create policy "owner can update organization"
on organizations for update to authenticated
using (
  (get_my_profile()).role = 'owner'
  and id = (get_my_profile()).organization_id
)
with check (
  (get_my_profile()).role = 'owner'
  and id = (get_my_profile()).organization_id
);


-- ------------------------------------------------------------
-- branches
-- ------------------------------------------------------------

create policy "members can view branches"
on branches for select to authenticated
using (organization_id = (get_my_profile()).organization_id);

create policy "owner can insert branches"
on branches for insert to authenticated
with check (
  (get_my_profile()).role = 'owner'
  and organization_id = (get_my_profile()).organization_id
);

create policy "owner and manager can update branches"
on branches for update to authenticated
using (
  (get_my_profile()).role in ('owner', 'manager')
  and organization_id = (get_my_profile()).organization_id
)
with check (
  (get_my_profile()).role in ('owner', 'manager')
  and organization_id = (get_my_profile()).organization_id
);

create policy "owner can delete branches"
on branches for delete to authenticated
using (
  (get_my_profile()).role = 'owner'
  and organization_id = (get_my_profile()).organization_id
);


-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------

create policy "members can view profiles"
on profiles for select to authenticated
using (organization_id = (get_my_profile()).organization_id);

create policy "owner and manager can insert profiles"
on profiles for insert to authenticated
with check (
  (get_my_profile()).role in ('owner', 'manager')
  and organization_id = (get_my_profile()).organization_id
);

create policy "users can update profiles"
on profiles for update to authenticated
using (
  id = auth.uid()
  or (
    (get_my_profile()).role in ('owner', 'manager')
    and organization_id = (get_my_profile()).organization_id
  )
)
with check (
  id = auth.uid()
  or (
    (get_my_profile()).role in ('owner', 'manager')
    and organization_id = (get_my_profile()).organization_id
  )
);

create policy "owner can delete profiles"
on profiles for delete to authenticated
using (
  (get_my_profile()).role = 'owner'
  and organization_id = (get_my_profile()).organization_id
  and id != auth.uid()
);


-- ------------------------------------------------------------
-- tables (mesas)
-- ------------------------------------------------------------

create policy "staff can view tables"
on tables for select to authenticated
using (
  branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
    and (
      (get_my_profile()).branch_id is null
      or id = (get_my_profile()).branch_id
    )
  )
);

create policy "owner and manager can insert tables"
on tables for insert to authenticated
with check (
  (get_my_profile()).role in ('owner', 'manager')
  and branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
  )
);

create policy "owner manager waiter can update tables"
on tables for update to authenticated
using (
  (get_my_profile()).role in ('owner', 'manager', 'waiter')
  and branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
    and (
      (get_my_profile()).branch_id is null
      or id = (get_my_profile()).branch_id
    )
  )
);

create policy "owner can delete tables"
on tables for delete to authenticated
using (
  (get_my_profile()).role = 'owner'
  and branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
  )
);


-- ------------------------------------------------------------
-- menu_categories
-- ------------------------------------------------------------

create policy "staff can view menu categories"
on menu_categories for select to authenticated
using (
  branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
    and (
      (get_my_profile()).branch_id is null
      or id = (get_my_profile()).branch_id
    )
  )
);

create policy "owner and manager can insert menu categories"
on menu_categories for insert to authenticated
with check (
  (get_my_profile()).role in ('owner', 'manager')
  and branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
  )
);

create policy "owner and manager can update menu categories"
on menu_categories for update to authenticated
using (
  (get_my_profile()).role in ('owner', 'manager')
  and branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
  )
);

create policy "owner and manager can delete menu categories"
on menu_categories for delete to authenticated
using (
  (get_my_profile()).role in ('owner', 'manager')
  and branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
  )
);


-- ------------------------------------------------------------
-- menu_items
-- ------------------------------------------------------------

create policy "staff can view menu items"
on menu_items for select to authenticated
using (
  category_id in (
    select id from menu_categories
    where branch_id in (
      select id from branches
      where organization_id = (get_my_profile()).organization_id
      and (
        (get_my_profile()).branch_id is null
        or id = (get_my_profile()).branch_id
      )
    )
  )
);

create policy "owner and manager can insert menu items"
on menu_items for insert to authenticated
with check (
  (get_my_profile()).role in ('owner', 'manager')
  and category_id in (
    select id from menu_categories
    where branch_id in (
      select id from branches
      where organization_id = (get_my_profile()).organization_id
    )
  )
);

create policy "owner manager kitchen can update menu items"
on menu_items for update to authenticated
using (
  (get_my_profile()).role in ('owner', 'manager', 'kitchen')
  and category_id in (
    select id from menu_categories
    where branch_id in (
      select id from branches
      where organization_id = (get_my_profile()).organization_id
      and (
        (get_my_profile()).branch_id is null
        or id = (get_my_profile()).branch_id
      )
    )
  )
);

create policy "owner and manager can delete menu items"
on menu_items for delete to authenticated
using (
  (get_my_profile()).role in ('owner', 'manager')
  and category_id in (
    select id from menu_categories
    where branch_id in (
      select id from branches
      where organization_id = (get_my_profile()).organization_id
    )
  )
);


-- ------------------------------------------------------------
-- menu_option_groups
-- ------------------------------------------------------------

create policy "staff can view menu option groups"
on menu_option_groups for select to authenticated
using (
  menu_item_id in (
    select id from menu_items
    where category_id in (
      select id from menu_categories
      where branch_id in (
        select id from branches
        where organization_id = (get_my_profile()).organization_id
      )
    )
  )
);

create policy "owner and manager can manage menu option groups"
on menu_option_groups for all to authenticated
using (
  (get_my_profile()).role in ('owner', 'manager')
  and menu_item_id in (
    select id from menu_items
    where category_id in (
      select id from menu_categories
      where branch_id in (
        select id from branches
        where organization_id = (get_my_profile()).organization_id
      )
    )
  )
);


-- ------------------------------------------------------------
-- menu_options
-- ------------------------------------------------------------

create policy "staff can view menu options"
on menu_options for select to authenticated
using (
  group_id in (
    select id from menu_option_groups
    where menu_item_id in (
      select id from menu_items
      where category_id in (
        select id from menu_categories
        where branch_id in (
          select id from branches
          where organization_id = (get_my_profile()).organization_id
        )
      )
    )
  )
);

create policy "owner and manager can manage menu options"
on menu_options for all to authenticated
using (
  (get_my_profile()).role in ('owner', 'manager')
  and group_id in (
    select id from menu_option_groups
    where menu_item_id in (
      select id from menu_items
      where category_id in (
        select id from menu_categories
        where branch_id in (
          select id from branches
          where organization_id = (get_my_profile()).organization_id
        )
      )
    )
  )
);


-- ------------------------------------------------------------
-- orders
-- ------------------------------------------------------------

create policy "staff can view orders"
on orders for select to authenticated
using (
  branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
    and (
      (get_my_profile()).branch_id is null
      or id = (get_my_profile()).branch_id
    )
  )
);

create policy "owner manager waiter can insert orders"
on orders for insert to authenticated
with check (
  (get_my_profile()).role in ('owner', 'manager', 'waiter')
  and branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
    and (
      (get_my_profile()).branch_id is null
      or id = (get_my_profile()).branch_id
    )
  )
);

create policy "owner manager waiter can update orders"
on orders for update to authenticated
using (
  (get_my_profile()).role in ('owner', 'manager', 'waiter')
  and branch_id in (
    select id from branches
    where organization_id = (get_my_profile()).organization_id
    and (
      (get_my_profile()).branch_id is null
      or id = (get_my_profile()).branch_id
    )
  )
);


-- ------------------------------------------------------------
-- order_items
-- ------------------------------------------------------------

create policy "staff can view order items"
on order_items for select to authenticated
using (
  order_id in (
    select id from orders
    where branch_id in (
      select id from branches
      where organization_id = (get_my_profile()).organization_id
      and (
        (get_my_profile()).branch_id is null
        or id = (get_my_profile()).branch_id
      )
    )
  )
);

create policy "owner manager waiter can insert order items"
on order_items for insert to authenticated
with check (
  (get_my_profile()).role in ('owner', 'manager', 'waiter')
  and order_id in (
    select id from orders
    where branch_id in (
      select id from branches
      where organization_id = (get_my_profile()).organization_id
      and (
        (get_my_profile()).branch_id is null
        or id = (get_my_profile()).branch_id
      )
    )
  )
);

create policy "staff can update order items"
on order_items for update to authenticated
using (
  (get_my_profile()).role in ('owner', 'manager', 'waiter', 'kitchen')
  and order_id in (
    select id from orders
    where branch_id in (
      select id from branches
      where organization_id = (get_my_profile()).organization_id
      and (
        (get_my_profile()).branch_id is null
        or id = (get_my_profile()).branch_id
      )
    )
  )
);


-- ------------------------------------------------------------
-- order_item_options
-- ------------------------------------------------------------

create policy "staff can view order item options"
on order_item_options for select to authenticated
using (
  order_item_id in (
    select id from order_items
    where order_id in (
      select id from orders
      where branch_id in (
        select id from branches
        where organization_id = (get_my_profile()).organization_id
      )
    )
  )
);

create policy "owner manager waiter can insert order item options"
on order_item_options for insert to authenticated
with check (
  order_item_id in (
    select id from order_items
    where order_id in (
      select id from orders
      where branch_id in (
        select id from branches
        where organization_id = (get_my_profile()).organization_id
      )
    )
  )
);
