'use client'

import { forwardRef } from 'react'
import type { FormFieldProps } from '@/types/ui/FormField'

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, id, hint, prefix, ...props }, ref) => {
    return (
      <label className="block">
        <span className="field-label">
          {label}
          {required && <span aria-hidden="true" className="text-red-400 ml-0.5">*</span>}
        </span>
        <div className={`field-wrapper ${error ? 'border-red-500/70' : 'border-ink-3'}`}>
          {prefix && (
            <span className="field-prefix">{prefix}</span>
          )}
          <input
            ref={ref}
            id={id}
            required={required}
            className={`field-input ${prefix ? 'pr-3.5' : 'px-3.5'}`}
            {...props}
          />
        </div>
        {hint  && <span className="field-hint">{hint}</span>}
        {error && <p role="alert" className="field-error">{error}</p>}
      </label>
    )
  }
)

FormField.displayName = 'FormField'

export { FormField }
