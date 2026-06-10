import { z } from 'zod'
import { safeString } from './utils'

// ── Paso 1: datos personales ──────────────────────────────────
export const stepPersonalSchema = z.object({
  full_name: safeString.pipe(z.string().min(2, 'El nombre debe tener al menos 2 caracteres')),
  email:     z.string().email('Email inválido'),
  password:  z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

// ── Paso 2: datos de la organización ─────────────────────────
export const stepOrganizationSchema = z.object({
  org_name: safeString.pipe(z.string().min(2, 'El nombre debe tener al menos 2 caracteres')),
  slug: z
    .string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .max(50, 'El slug no puede tener más de 50 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
})

// ── Paso 3: primera sucursal ──────────────────────────────────
export const stepBranchSchema = z.object({
  branch_name: safeString.pipe(z.string().min(2, 'El nombre debe tener al menos 2 caracteres')),
  address:     safeString.pipe(z.string()).optional(),
})

// ── Login ─────────────────────────────────────────────────────
export const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

// ── Tipos inferidos ───────────────────────────────────────────
export type StepPersonalData    = z.infer<typeof stepPersonalSchema>
export type StepOrganizationData = z.infer<typeof stepOrganizationSchema>
export type StepBranchData      = z.infer<typeof stepBranchSchema>
export type LoginData           = z.infer<typeof loginSchema>
