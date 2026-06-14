'use client'

import { forwardRef } from 'react'
import type { InputProps } from '@/types/ui/Input'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-error={error}
        className={`input ${error ? 'border-red-500/70' : 'border-ink-3'} ${className ?? 'px-3.5'}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
