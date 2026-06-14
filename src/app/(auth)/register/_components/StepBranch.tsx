'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { stepBranchSchema, type StepBranchData } from '@/lib/validations/auth'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import type { StepBranchProps } from '@/types/register/StepBranchProps'

export function StepBranch({ onNext, isLoading, error }: StepBranchProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<StepBranchData>({
    resolver: zodResolver(stepBranchSchema),
  })

  return (
    <form onSubmit={handleSubmit(onNext)} className="step-form">
      <FormField
        label="Nombre de la sucursal"
        id="branch_name"
        placeholder="Sucursal Centro"
        error={errors.branch_name?.message}
        {...register('branch_name')}
      />
      <FormField
        label="Dirección"
        id="address"
        placeholder="Calle, número, colonia (opcional)"
        hint="Opcional — puedes agregarla después desde el panel."
        error={errors.address?.message}
        {...register('address')}
      />
      {error && (
        <p role="alert" className="form-error">{error}</p>
      )}
      <div className="step-actions">
        <Button type="submit" loading={isLoading}>
          Crear cuenta
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.7"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </div>
    </form>
  )
}
