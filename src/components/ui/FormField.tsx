'use client'

import { forwardRef } from 'react'
import { Input } from './Input'
import { Label } from './Label'
import type { FormFieldProps } from '@/types/ui/FormField'

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, id, ...props }, ref) => {
    return (
      <div>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        <Input ref={ref} id={id} error={!!error} {...props} />
        {error && <p role="alert">{error}</p>}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export { FormField }
