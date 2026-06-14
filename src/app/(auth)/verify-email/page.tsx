import Link from 'next/link'
import { AuthShell } from '@/components/auth/AuthShell'
import { MobileLogo } from '@/components/auth/MobileLogo'
import { Button } from '@/components/ui/Button'

export default function VerifyEmailPage() {
  return (
    <AuthShell caption="Confirma tu correo para activar tu cuenta y empezar a operar.">
      <div className="fadein text-center">
        <MobileLogo />

        {/* Ícono de correo */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-mint/10 border border-mint/25
          flex items-center justify-center mb-7">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <rect x="4" y="7" width="26" height="20" rx="3" stroke="#2AD4AE" strokeWidth="1.8"/>
            <path d="M5 9l12 9 12-9" stroke="#2AD4AE" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="auth-title">REVISA TU CORREO</div>
        <p className="text-fg-sub text-[15px] leading-relaxed mt-4 mb-7">
          Enviamos un enlace de confirmación a tu correo.
          Ábrelo para activar tu cuenta y entrar a Lonchen.
        </p>

        <div className="bg-ink-1/60 border border-ink-3 rounded-lg p-4 text-left mb-7">
          <p className="text-[12px] text-fg-sub leading-relaxed">
            <span className="font-cond font-700 tracking-wide text-fg-sub uppercase text-[11px]">
              ¿No lo ves?{' '}
            </span>
            Revisa tu carpeta de spam o promociones. El enlace expira en 24 horas.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="ghost">
            Reenviar correo de confirmación
          </Button>
          <Link href="/login" className="auth-link-back">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </AuthShell>
  )
}
