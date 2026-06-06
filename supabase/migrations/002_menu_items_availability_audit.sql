-- Agrega auditoría de disponibilidad a menu_items
-- Para rastrear quién marcó un platillo como agotado y cuándo

alter table menu_items
  add column availability_changed_by uuid references profiles(id) on delete set null,
  add column availability_changed_at timestamptz;
