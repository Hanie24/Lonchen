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
    <form onSubmit={handleSubmit(onNext)}>
      <FormField
        label="Nombre de la sucursal"
        id="branch_name"
        required
        error={errors.branch_name?.message}
        {...register('branch_name')}
      />
      <FormField
        label="Dirección"
        id="address"
        error={errors.address?.message}
        {...register('address')}
      />
      {error && <p role="alert">{error}</p>}
      <Button type="submit" loading={isLoading}>Crear cuenta</Button>
    </form>
  )
}
