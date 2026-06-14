'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { StepPersonal } from './StepPersonal'
import { StepOrganization } from './StepOrganization'
import { StepBranch } from './StepBranch'
import { StepIndicator } from './StepIndicator'
import { registerAction } from '@/lib/actions/auth'
import type { StepPersonalData, StepOrganizationData, StepBranchData } from '@/lib/validations/auth'
import { AuthShell } from '@/components/auth/AuthShell'
import { MobileLogo } from '@/components/auth/MobileLogo'

export function RegisterForm() {
  const [step, setStep]               = useState(1)
  const [personal, setPersonal]       = useState<StepPersonalData | null>(null)
  const [organization, setOrganization] = useState<StepOrganizationData | null>(null)
  const [error, setError]             = useState<string | undefined>(undefined)
  const [isPending, startTransition]  = useTransition()
  const router = useRouter()

  function back() {
    if (step === 1) router.push('/login')
    else setStep(s => s - 1)
  }

  function handlePersonalNext(data: StepPersonalData) {
    setPersonal(data)
    setStep(2)
  }

  function handleOrganizationNext(data: StepOrganizationData) {
    setOrganization(data)
    setStep(3)
  }

  function handleBranchNext(data: StepBranchData) {
    if (!personal || !organization) return
    startTransition(async () => {
      const result = await registerAction({ personal, organization, branch: data })
      if (result?.error) setError(result.error)
    })
  }

  return (
    <AuthShell caption="Crea tu cuenta en menos de un minuto. Sin tarjeta, sin hardware. Empieza con hasta 12 mesas gratis.">
      <div className="fadein">
        <MobileLogo />

        {/* Título + botón volver */}
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={back} className="auth-back-btn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="auth-title-sm">CREAR CUENTA</div>
        </div>

        <StepIndicator step={step} />

        {step === 1 && <StepPersonal onNext={handlePersonalNext} />}
        {step === 2 && <StepOrganization onNext={handleOrganizationNext} />}
        {step === 3 && <StepBranch onNext={handleBranchNext} isLoading={isPending} error={error} />}

        <p className="text-center text-sm text-fg-sub mt-7">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="auth-link">Inicia sesión</Link>
        </p>
      </div>
    </AuthShell>
  )
}
