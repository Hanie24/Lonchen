'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { RegisterData } from '@/types/actions/RegisterData'
import type { RegisterResult } from '@/types/actions/RegisterResult'
import type { LoginResult } from '@/types/actions/LoginResult'
import type { LoginData } from '@/lib/validations/auth'
import { roleRedirect } from '@/lib/utils/roleRedirect'

export async function registerAction(data: RegisterData): Promise<RegisterResult> {
  const supabase = await createClient()

  // 1. Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.personal.email,
    password: data.personal.password,
  })

  if (authError) return { error: authError.message }
  if (!authData.user) return { error: 'No se pudo crear el usuario' }

  // 2. Crear organización + sucursal + perfil en una sola transacción
  const { error: rpcError } = await supabase.rpc('register_organization', {
    p_user_id:     authData.user.id,
    p_full_name:   data.personal.full_name,
    p_org_name:    data.organization.org_name,
    p_slug:        data.organization.slug,
    p_branch_name: data.branch.branch_name,
    p_address:     data.branch.address ?? null,
  })

  if (rpcError) {
    if (rpcError.message.includes('organizations_slug_key')) {
      return { error: 'Ese identificador ya está en uso, elige otro' }
    }
    return { error: 'Error al crear la organización. Intenta de nuevo.' }
  }

  // Si hay sesión activa (confirmación desactivada) → ir directo al dashboard
  // Si no hay sesión (confirmación activada) → pedir que revisen su correo
  redirect(authData.session ? roleRedirect['owner'] : '/verify-email')
}

export async function loginAction(data: LoginData): Promise<LoginResult> {
  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email:    data.email,
    password: data.password,
  })

  if (error) return { error: 'Email o contraseña incorrectos' }
  if (!authData.user) return { error: 'No se pudo iniciar sesión' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  if (!profile) return { error: 'Perfil no encontrado' }

  redirect(roleRedirect[profile.role] ?? '/waiter')
}
