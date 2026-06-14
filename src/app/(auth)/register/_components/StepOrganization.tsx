'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { stepOrganizationSchema, type StepOrganizationData } from '@/lib/validations/auth'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import type { StepOrganizationProps } from '@/types/register/StepOrganizationProps'

function slugify(s: string) {
  return s.toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function StepOrganization({ onNext }: StepOrganizationProps) {
  const [slugTouched, setSlugTouched] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<StepOrganizationData>({
    resolver: zodResolver(stepOrganizationSchema),
  })

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) {
      setValue('slug', slugify(e.target.value), { shouldValidate: true })
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true)
    setValue('slug', slugify(e.target.value), { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="step-form">
      <FormField
        label="Nombre del restaurante"
        id="org_name"
        placeholder="La Lonchería"
        error={errors.org_name?.message}
        {...register('org_name', { onChange: handleNameChange })}
      />
      <FormField
        label="Identificador único"
        id="slug"
        prefix="lonchen.mx/"
        placeholder="la-loncheria"
        hint="Se genera de tu nombre. Puedes editarlo — será tu URL pública."
        error={errors.slug?.message}
        {...register('slug', { onChange: handleSlugChange })}
      />
      <div className="step-actions">
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  )
}
