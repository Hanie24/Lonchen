'use client'

import { forwardRef } from 'react'
import type { InputProps } from '@/types/ui/Input'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, ...props }, ref) => {
    return <input ref={ref} data-error={error} {...props} />
  }
)

Input.displayName = 'Input'

export { Input }
