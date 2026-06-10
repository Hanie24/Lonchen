'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { stepPersonalSchema, type StepPersonalData } from '@/lib/validations/auth'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import type { StepPersonalProps } from '@/types/register/StepPersonalProps'

export function StepPersonal({ onNext }: StepPersonalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<StepPersonalData>({
    resolver: zodResolver(stepPersonalSchema),
  })

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <FormField
        label="Nombre completo"
        id="full_name"
        required
        error={errors.full_name?.message}
        {...register('full_name')}
      />
      <FormField
        label="Email"
        id="email"
        type="email"
        required
        error={errors.email?.message}
        {...register('email')}
      />
      <FormField
        label="Contraseña"
        id="password"
        type="password"
        required
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit">Continuar</Button>
    </form>
  )
}
