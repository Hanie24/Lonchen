'use client'

import type { ButtonProps } from '@/types/ui/Button'

export function Button({ loading, variant = 'primary', disabled, children, ...props }: ButtonProps) {
  return (
    <button disabled={disabled || loading} data-variant={variant} {...props}>
      {loading ? 'Cargando...' : children}
    </button>
  )
}
