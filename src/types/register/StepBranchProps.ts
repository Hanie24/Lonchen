import type { StepBranchData } from '@/lib/validations/auth'

export interface StepBranchProps {
  onNext: (data: StepBranchData) => void
  isLoading: boolean
  error?: string
}
