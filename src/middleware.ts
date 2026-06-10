import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { roleRedirect } from '@/lib/utils/roleRedirect'
import type { Role } from '@/types/database'

const authRoutes = ['/login', '/register', '/verify-email']

const routePermissions: Record<string, Role[]> = {
  '/settings': ['owner', 'manager'],
  '/kitchen':  ['kitchen', 'owner', 'manager'],
  '/waiter':   ['waiter', 'owner', 'manager'],
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAuthRoute      = authRoutes.some((r) => path.startsWith(r))
  const matchedRoute     = Object.keys(routePermissions).find((r) => path.startsWith(r))
  const isProtectedRoute = !!matchedRoute

  // Sin sesión intentando acceder a ruta protegida → login
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Con sesión → necesitamos el perfil para verificar el rol
  if (user && (isAuthRoute || isProtectedRoute)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const role = profile.role as Role

    // Con sesión en página de auth → redirigir a su dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(roleRedirect[role], request.url))
    }

    // Con sesión en ruta protegida pero sin permiso → redirigir a su dashboard
    if (isProtectedRoute && !routePermissions[matchedRoute!].includes(role)) {
      return NextResponse.redirect(new URL(roleRedirect[role], request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
