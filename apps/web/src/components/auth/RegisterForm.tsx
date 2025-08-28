'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, ChevronDown } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useAuthStore } from '../../stores/auth'
import { registerSchema, RegisterFormData } from '../../lib/validations'
import { BusinessInfoForm } from './BusinessInfoForm'
import { AccountType } from '../../types/api'

interface RegisterFormProps {
  onToggleMode?: () => void
  onSuccess?: () => void
}

export function RegisterForm({ onToggleMode, onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [accountType, setAccountType] = useState<AccountType>('individual')
  const [showDropdown, setShowDropdown] = useState(false)
  const [companyInfo, setCompanyInfo] = useState(null)
  const [personalData, setPersonalData] = useState<RegisterFormData | null>(null)
  const [step, setStep] = useState<'personal-info' | 'business-info'>('personal-info')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const accountTypeOptions = [
    {
      value: 'individual' as AccountType,
      label: 'Cuenta Personal',
      description: 'Para asistentes y amantes de eventos',
      icon: User
    },
    {
      value: 'business' as AccountType,
      label: 'Cuenta Empresarial',
      description: 'Para organizadores y empresas',
      icon: Building2
    }
  ]

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const handlePersonalInfoComplete = (data: RegisterFormData) => {
    setPersonalData(data)
    if (accountType === 'business') {
      setStep('business-info')
    } else {
      onSubmit(data)
    }
  }

  const handleBusinessInfoComplete = (businessData: any) => {
    setCompanyInfo(businessData)
    if (personalData) {
      onSubmit(personalData)
    }
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError()
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = data
      
      // Add account type and company info if applicable
      const registrationData = {
        ...userData,
        accountType,
        ...(companyInfo && { companyInfo })
      }
      
      await registerUser(registrationData)
      onSuccess?.()
      
      // Redirect based on account type
      if (accountType === 'business') {
        router.push('/dashboard/corporate')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      // Error is handled by the store
      console.error('Register error:', error)
    }
  }

  // Render based on current step
  if (step === 'business-info') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Información de tu empresa</h2>
          <p className="mt-2 text-gray-600">Cuéntanos sobre tu organización</p>
        </div>
        <BusinessInfoForm 
          onComplete={handleBusinessInfoComplete}
          onBack={() => setStep('personal-info')}
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {accountType === 'business' ? 'Información personal' : '¡Únete a TIX!'}
        </h2>
        <p className="mt-2 text-gray-600">
          {accountType === 'business' 
            ? 'Completa tu información personal' 
            : 'Crea tu cuenta y descubre eventos increíbles'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(accountType === 'business' ? handlePersonalInfoComplete : onSubmit)} className="space-y-4">
        {/* Account Type Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Cuenta
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-xl hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <div className="flex items-center space-x-3">
                {(() => {
                  const selectedOption = accountTypeOptions.find(option => option.value === accountType)!
                  const Icon = selectedOption.icon
                  return (
                    <>
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{selectedOption.label}</div>
                        <div className="text-sm text-gray-500">{selectedOption.description}</div>
                      </div>
                    </>
                  )
                })()}
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                {accountTypeOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = option.value === accountType
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setAccountType(option.value)
                        setShowDropdown(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isSelected 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                          : 'bg-gray-200'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          isSelected ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left flex-1">
                        <div className={`font-medium ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-sm ${
                          isSelected ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

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

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Back Button for business flow */}
          {accountType === 'business' && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => setStep('personal-info')}
            >
              ← Volver
            </Button>
          )}
          
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading || isSubmitting}
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting 
              ? 'Procesando...' 
              : accountType === 'business' 
                ? 'Continuar →' 
                : 'Crear Cuenta'
            }
          </Button>
        </div>

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