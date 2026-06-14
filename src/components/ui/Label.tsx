'use client'

import type { LabelProps } from '@/types/ui/Label'

export function Label({ required, children, className, ...props }: LabelProps) {
  return (
    <label className={`field-label ${className ?? ''}`} {...props}>
      {children}
      {required && <span aria-hidden="true" className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}
