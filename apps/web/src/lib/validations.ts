import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email es requerido')
    .email('Email debe ser válido'),
  password: z
    .string()
    .min(1, 'Contraseña es requerida')
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email es requerido')
    .email('Email debe ser válido'),
  password: z
    .string()
    .min(8, 'Contraseña debe tener al menos 8 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Contraseña debe tener al menos una minúscula, una mayúscula y un número'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Confirmación de contraseña es requerida'),
  firstName: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(50, 'Nombre no puede exceder 50 caracteres'),
  lastName: z
    .string()
    .min(2, 'Apellido debe tener al menos 2 caracteres')
    .max(50, 'Apellido no puede exceder 50 caracteres'),
  phone: z
    .string()
    .regex(/^[+]?[\d\s-()]*$/, 'Teléfono debe ser válido')
    .optional()
    .or(z.literal(''))
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

export const businessInfoSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre de empresa debe tener al menos 2 caracteres')
    .max(100, 'Nombre de empresa no puede exceder 100 caracteres'),
  rnc: z
    .string()
    .regex(/^\d{9}$|^\d{11}$/, 'RNC debe tener 9 u 11 dígitos')
    .optional(),
  industry: z
    .string()
    .min(1, 'Selecciona una industria'),
  website: z
    .string()
    .url('Sitio web debe ser una URL válida')
    .optional()
    .or(z.literal('')),
  size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+'])
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type BusinessInfoData = z.infer<typeof businessInfoSchema>