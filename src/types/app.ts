// Tipos propios de la aplicación
// Para datos combinados, estados de UI, respuestas de queries, etc.

import type { MenuItem, MenuOption, MenuOptionGroup } from './database'

// Platillo con sus grupos de opciones y opciones anidadas
export interface MenuItemWithOptions extends MenuItem {
  option_groups: (MenuOptionGroup & {
    options: MenuOption[]
  })[]
}
