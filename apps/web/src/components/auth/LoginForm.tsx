'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuthStore } from '../../stores/auth'
import { loginSchema, LoginFormData } from '../../lib/validations'

interface LoginFormProps {
  onToggleMode?: () => void
  onSuccess?: () => void
}

export function LoginForm({ onToggleMode, onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login, isLoading, error, clearError, getRedirectPath } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError()
      await login(data)
      onSuccess?.()
      
      // Redirect based on account type
      const redirectPath = getRedirectPath()
      router.push(redirectPath)
    } catch (error) {
      // Error is handled by the store
      console.error('Login error:', error)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">¡Bienvenido de vuelta!</h2>
        <p className="mt-2 text-gray-600">Inicia sesión en tu cuenta TIX</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Tu contraseña"
            className="pl-10 pr-10"
            error={errors.password?.message}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading || isSubmitting}
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Toggle to Register */}
        {onToggleMode && (
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Regístrate gratis
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  )
}