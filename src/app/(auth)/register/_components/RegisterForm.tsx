'use client'

import { useState, useTransition } from 'react'
import { StepPersonal } from './StepPersonal'
import { StepOrganization } from './StepOrganization'
import { StepBranch } from './StepBranch'
import { registerAction } from '@/lib/actions/auth'
import type { StepPersonalData, StepOrganizationData, StepBranchData } from '@/lib/validations/auth'

export function RegisterForm() {
  const [step, setStep] = useState(1)
  const [personal, setPersonal] = useState<StepPersonalData | null>(null)
  const [organization, setOrganization] = useState<StepOrganizationData | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isPending, startTransition] = useTransition()

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
    <div>
      {step === 1 && <StepPersonal onNext={handlePersonalNext} />}
      {step === 2 && <StepOrganization onNext={handleOrganizationNext} />}
      {step === 3 && <StepBranch onNext={handleBranchNext} isLoading={isPending} error={error} />}
    </div>
  )
}
