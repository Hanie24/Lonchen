import type { Role } from '@/types/database'

export const roleRedirect: Record<Role, string> = {
  owner:   '/settings',
  manager: '/settings',
  waiter:  '/waiter',
  kitchen: '/kitchen',
}
