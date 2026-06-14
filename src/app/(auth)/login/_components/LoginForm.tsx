'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { loginSchema, type LoginData } from '@/lib/validations/auth'
import { loginAction } from '@/lib/actions/auth'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { AuthShell } from '@/components/auth/AuthShell'
import { MobileLogo } from '@/components/auth/MobileLogo'

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
    <AuthShell caption="El POS web para restaurantes independientes. Toma órdenes, sincroniza la cocina y deja que tus comensales pidan desde su mesa.">
      <div className="fadein">
        <MobileLogo />

        <div className="auth-title">INICIAR SESIÓN</div>
        <p className="text-fg-sub text-sm mt-2 mb-9">
          Entra a tu panel de control.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="hola@turestaurante.mx"
            error={errors.email?.message}
            {...register('email')}
          />
          <div>
            <FormField
              label="Contraseña"
              id="password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="text-right mt-2">
              <a href="#" className="text-[12px] text-fg-sub hover:text-mint transition">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {error && (
            <p role="alert" className="form-error">{error}</p>
          )}

          <Button type="submit" loading={isPending}>
            Iniciar sesión
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </form>

        <div className="flex items-center gap-3 my-7">
          <div className="h-px flex-1 bg-ink-3"></div>
          <span className="text-[11px] text-fg-dim tracking-wider uppercase font-cond">o</span>
          <div className="h-px flex-1 bg-ink-3"></div>
        </div>

        <p className="text-center text-sm text-fg-sub">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="auth-link">Crea una gratis</Link>
        </p>
      </div>
    </AuthShell>
  )
}
