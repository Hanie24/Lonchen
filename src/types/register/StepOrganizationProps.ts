import type { StepOrganizationData } from '@/lib/validations/auth'

export interface StepOrganizationProps {
  onNext: (data: StepOrganizationData) => void
}
