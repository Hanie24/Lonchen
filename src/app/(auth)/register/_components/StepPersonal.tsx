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
    <form onSubmit={handleSubmit(onNext)} className="step-form">
      <FormField
        label="Nombre completo"
        id="full_name"
        placeholder="Ana García"
        error={errors.full_name?.message}
        {...register('full_name')}
      />
      <FormField
        label="Email"
        id="email"
        type="email"
        placeholder="ana@turestaurante.mx"
        error={errors.email?.message}
        {...register('email')}
      />
      <FormField
        label="Contraseña"
        id="password"
        type="password"
        placeholder="Mínimo 8 caracteres"
        hint="Usa al menos 8 caracteres con una mayúscula y un número."
        error={errors.password?.message}
        {...register('password')}
      />
      <div className="step-actions">
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  )
}
