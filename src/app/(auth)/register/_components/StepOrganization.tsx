'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { stepOrganizationSchema, type StepOrganizationData } from '@/lib/validations/auth'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import type { StepOrganizationProps } from '@/types/register/StepOrganizationProps'

export function StepOrganization({ onNext }: StepOrganizationProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<StepOrganizationData>({
    resolver: zodResolver(stepOrganizationSchema),
  })

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const slug = e.target.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    setValue('slug', slug, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <FormField
        label="Nombre del restaurante"
        id="org_name"
        required
        error={errors.org_name?.message}
        {...register('org_name', { onChange: handleNameChange })}
      />
      <FormField
        label="Identificador"
        id="slug"
        required
        error={errors.slug?.message}
        {...register('slug')}
      />
      <Button type="submit">Continuar</Button>
    </form>
  )
}
