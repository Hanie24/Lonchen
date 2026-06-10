'use client'

import type { LabelProps } from '@/types/ui/Label'

export function Label({ required, children, ...props }: LabelProps) {
  return (
    <label {...props}>
      {children}
      {required && <span aria-hidden="true"> *</span>}
    </label>
  )
}
