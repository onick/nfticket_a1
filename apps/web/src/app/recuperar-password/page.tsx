'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  Lock,
  Key
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

type Step = 'request' | 'sent' | 'reset' | 'success'

export default function PasswordResetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [currentStep, setCurrentStep] = useState<Step>(token ? 'reset' : 'request')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      alert('Por favor ingresa tu email')
      return
    }

    setLoading(true)
    try {
      // In a real app, this would call the password reset request API
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCurrentStep('sent')
    } catch (error) {
      alert('Error al enviar el email de recuperación')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      alert('Por favor completa todos los campos')
      return
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    if (password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)
    try {
      // In a real app, this would call the password reset API
      await new Promise(resolve => setTimeout(resolve, 2000))
      setCurrentStep('success')
    } catch (error) {
      alert('Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'request':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Recuperar Contraseña
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
            </p>

            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input w-full pl-10"
                    placeholder="tu@email.com"
                    required
                  />
                  <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Enviar Enlace de Recuperación</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/auth/login"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                ¿Recordaste tu contraseña? Iniciar Sesión
              </Link>
            </div>
          </motion.div>
        )

      case 'sent':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Email Enviado
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
              Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setCurrentStep('request')}
                className="btn-secondary w-full"
              >
                Enviar a otro email
              </button>
              
              <Link href="/auth/login" className="btn-ghost w-full">
                Volver al Inicio de Sesión
              </Link>
            </div>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>¿No recibiste el email?</strong><br />
                Verifica tu carpeta de spam o espera unos minutos e intenta de nuevo.
              </p>
            </div>
          </motion.div>
        )

      case 'reset':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Key className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Nueva Contraseña
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input w-full pr-10"
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input w-full pr-10"
                    placeholder="Repite la contraseña"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Requisitos de la contraseña:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li className={`flex items-center space-x-2 ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <span className={`w-4 h-4 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'} flex-shrink-0`}></span>
                    <span>Al menos 8 caracteres</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <span className={`w-4 h-4 rounded-full ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'} flex-shrink-0`}></span>
                    <span>Mayúsculas y minúsculas</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${/\d/.test(password) ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <span className={`w-4 h-4 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-300'} flex-shrink-0`}></span>
                    <span>Al menos un número</span>
                  </li>
                  <li className={`flex items-center space-x-2 ${password === confirmPassword && password !== '' ? 'text-green-600 dark:text-green-400' : ''}`}>
                    <span className={`w-4 h-4 rounded-full ${password === confirmPassword && password !== '' ? 'bg-green-500' : 'bg-gray-300'} flex-shrink-0`}></span>
                    <span>Las contraseñas coinciden</span>
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Cambiar Contraseña</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Contraseña Cambiada!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Tu contraseña ha sido actualizada exitosamente. 
              Ya puedes iniciar sesión con tu nueva contraseña.
            </p>

            <Link href="/auth/login" className="btn-primary w-full">
              Iniciar Sesión
            </Link>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Link 
              href="/auth/login" 
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Inicio de Sesión</span>
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              {renderStep()}
            </div>

            {/* Help Section */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                ¿Necesitas ayuda?
              </p>
              <div className="space-x-4">
                <Link 
                  href="/ayuda" 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Centro de Ayuda
                </Link>
                <Link 
                  href="/contacto" 
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Contactar Soporte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}