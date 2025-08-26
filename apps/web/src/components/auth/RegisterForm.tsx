'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuthStore } from '../../stores/auth'
import { registerSchema, RegisterFormData } from '../../lib/validations'

interface RegisterFormProps {
  onToggleMode?: () => void
  onSuccess?: () => void
}

export function RegisterForm({ onToggleMode, onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError()
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = data
      await registerUser(userData)
      onSuccess?.()
      router.refresh()
    } catch (error) {
      // Error is handled by the store
      console.error('Register error:', error)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">¡Únete a TIX!</h2>
        <p className="mt-2 text-gray-600">Crea tu cuenta y descubre eventos increíbles</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre y Apellido en una fila */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              {...register('firstName')}
              type="text"
              placeholder="Nombre"
              className="pl-10"
              error={errors.firstName?.message}
              autoComplete="given-name"
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              {...register('lastName')}
              type="text"
              placeholder="Apellido"
              className="pl-10"
              error={errors.lastName?.message}
              autoComplete="family-name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            {...register('email')}
            type="email"
            placeholder="tu@email.com"
            className="pl-10"
            error={errors.email?.message}
            autoComplete="email"
          />
        </div>

        {/* Teléfono */}
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            {...register('phone')}
            type="tel"
            placeholder="Tu teléfono (opcional)"
            className="pl-10"
            error={errors.phone?.message}
            autoComplete="tel"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Crea una contraseña"
            className="pl-10 pr-10"
            error={errors.password?.message}
            autoComplete="new-password"
            helperText="Mínimo 8 caracteres, con mayúscula, minúscula y número"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirma tu contraseña"
            className="pl-10 pr-10"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Terms and Privacy */}
        <div className="text-xs text-gray-600 leading-relaxed">
          Al registrarte, aceptas nuestros{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">
            Política de Privacidad
          </a>
          .
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading || isSubmitting}
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>

        {/* Toggle to Login */}
        {onToggleMode && (
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  )
}