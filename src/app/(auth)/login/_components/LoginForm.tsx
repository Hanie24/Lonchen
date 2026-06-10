'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginData } from '@/lib/validations/auth'
import { loginAction } from '@/lib/actions/auth'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'

export function LoginForm() {
  const [error, setError] = useState<string | undefined>(undefined)
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  function onSubmit(data: LoginData) {
    setError(undefined)
    startTransition(async () => {
      const result = await loginAction(data)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      {error && <p role="alert">{error}</p>}
      <Button type="submit" loading={isPending}>Iniciar sesión</Button>
    </form>
  )
}
