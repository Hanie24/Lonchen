import type { StepPersonalData } from '@/lib/validations/auth'

export interface StepPersonalProps {
  onNext: (data: StepPersonalData) => void
}
