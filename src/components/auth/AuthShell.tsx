import type { AuthShellProps } from '@/types/auth/AuthShell'

export function AuthShell({ caption, children }: AuthShellProps) {
  return (
    <div className="auth-shell">

      {/* Panel de marca — solo desktop */}
      <div className="auth-brand-panel">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="auth-logo-icon">
            <span className="font-cond font-800 text-navy text-xl leading-none">L</span>
          </div>
          <span className="auth-logo-text">LONCHEN</span>
        </div>

        {/* Tagline */}
        <div className="max-w-md mt-8">
          <div className="auth-headline">
            ORDEN<br />
            <span className="text-mint">CON</span><br />
            PERSONA-<br />LIDAD.
          </div>
          <p className="auth-caption">{caption}</p>
        </div>
      </div>

      {/* Columna del formulario */}
      <div className="auth-form-col">
        <div className="auth-form-inner">
          {children}
        </div>
      </div>

    </div>
  )
}
