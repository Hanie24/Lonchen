import { z } from 'zod'

// Campo de texto seguro: rechaza HTML tags y patrones de inyección
export const safeString = z
  .string()
  .transform((val) => val.trim())
  .refine((val) => !/<[^>]*>/g.test(val), {
    message: 'No se permiten etiquetas HTML',
  })
  .refine((val) => !/javascript:/gi.test(val), {
    message: 'Contenido no permitido',
  })
  .refine((val) => !/on\w+\s*=/gi.test(val), {
    message: 'Contenido no permitido',
  })
