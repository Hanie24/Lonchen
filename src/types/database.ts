// Tipos que reflejan el schema de Supabase
// Generados manualmente — en el futuro se pueden auto-generar con Supabase CLI

export type Plan = 'free' | 'starter' | 'pro' | 'enterprise'
export type Role = 'owner' | 'manager' | 'waiter' | 'kitchen'
export type TableStatus = 'available' | 'occupied' | 'reserved'
export type OrderStatus = 'open' | 'paid' | 'cancelled'
export type OrderItemStatus = 'pending' | 'preparing' | 'ready' | 'served'
export type OptionGroupType = 'single' | 'multiple'

export interface Organization {
  id: string
  name: string
  slug: string
  plan: Plan
  created_at: string
}

export interface Branch {
  id: string
  organization_id: string
  name: string
  address: string | null
  is_active: boolean
  created_at: string
}

export interface Profile {
  id: string
  organization_id: string
  branch_id: string | null
  full_name: string
  role: Role
  pin_hash: string | null
  created_at: string
}

export interface Table {
  id: string
  branch_id: string
  name: string
  capacity: number | null
  status: TableStatus
  qr_token: string
  created_at: string
}

export interface MenuCategory {
  id: string
  branch_id: string
  name: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  sort_order: number
  availability_changed_by: string | null
  availability_changed_at: string | null
  created_at: string
}

export interface MenuOptionGroup {
  id: string
  menu_item_id: string
  name: string
  type: OptionGroupType
  is_required: boolean
  sort_order: number
  created_at: string
}

export interface MenuOption {
  id: string
  group_id: string
  name: string
  price_delta: number
  is_available: boolean
  sort_order: number
  created_at: string
}

export interface Order {
  id: string
  branch_id: string
  table_id: string
  opened_by: string
  status: OrderStatus
  created_at: string
  closed_at: string | null
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  notes: string | null
  status: OrderItemStatus
  created_at: string
}

export interface OrderItemOption {
  id: string
  order_item_id: string
  menu_option_id: string
  price_delta: number
}
