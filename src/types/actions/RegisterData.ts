import type { StepPersonalData, StepOrganizationData, StepBranchData } from '@/lib/validations/auth'

export interface RegisterData {
  personal: StepPersonalData
  organization: StepOrganizationData
  branch: StepBranchData
}
