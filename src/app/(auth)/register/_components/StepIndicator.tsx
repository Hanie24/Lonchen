import type { StepIndicatorProps } from '@/types/register/StepIndicatorProps'

const STEPS = ['Tu cuenta', 'Restaurante', 'Sucursal']

export function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="step-counter">Paso {step} de 3</span>
        <span className="step-name">{STEPS[step - 1]}</span>
      </div>
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <div key={i} className="step-bar-track">
            <div className={`step-bar-fill ${i + 1 <= step ? 'bg-mint w-full' : 'w-0'}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
