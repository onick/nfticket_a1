'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Mail,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowLeft,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired' | 'already-verified'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  
  const [status, setStatus] = useState<VerificationStatus>('loading')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    // Simulate email verification
    const verifyEmail = async () => {
      try {
        // In a real app, this would call the API
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Mock different scenarios based on token
        if (token === 'expired') {
          setStatus('expired')
        } else if (token === 'already-verified') {
          setStatus('already-verified')
        } else if (token === 'invalid') {
          setStatus('error')
        } else {
          setStatus('success')
        }
      } catch (error) {
        setStatus('error')
      }
    }

    verifyEmail()
  }, [token])

  useEffect(() => {
    if (status === 'expired' || status === 'error') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [status])

  const handleResendVerification = async () => {
    if (!email) return

    setResending(true)
    try {
      // In a real app, this would call the resend verification API
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Email de verificación enviado. Revisa tu bandeja de entrada.')
      setCountdown(60)
      setCanResend(false)
    } catch (error) {
      alert('Error al enviar el email. Por favor intenta de nuevo.')
    } finally {
      setResending(false)
    }
  }

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LoadingSpinner size="lg" className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Verificando tu email...
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Por favor espera mientras verificamos tu dirección de correo electrónico.
            </p>
          </motion.div>
        )

      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ¡Email Verificado!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Tu dirección de correo electrónico ha sido verificada exitosamente. 
              Ahora puedes acceder a todas las funcionalidades de TIX.
            </p>
            <Link href="/dashboard" className="btn-primary">
              Ir al Dashboard
            </Link>
          </motion.div>
        )

      case 'already-verified':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Email ya verificado
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Tu dirección de correo electrónico ya está verificada. 
              Puedes continuar usando TIX normalmente.
            </p>
            <Link href="/dashboard" className="btn-primary">
              Ir al Dashboard
            </Link>
          </motion.div>
        )

      case 'expired':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Enlace Expirado
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              El enlace de verificación ha expirado. Por favor solicita un nuevo 
              enlace de verificación.
            </p>
            <div className="space-y-4">
              {email && (
                <button
                  onClick={handleResendVerification}
                  disabled={!canResend || resending}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {resending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>
                        {canResend 
                          ? 'Reenviar Verificación' 
                          : `Espera ${countdown}s`
                        }
                      </span>
                    </>
                  )}
                </button>
              )}
              <Link href="/auth/login" className="btn-secondary">
                Ir a Iniciar Sesión
              </Link>
            </div>
          </motion.div>
        )

      case 'error':
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Error de Verificación
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              No pudimos verificar tu email. El enlace puede ser inválido o haber expirado.
              Por favor intenta de nuevo o solicita un nuevo enlace.
            </p>
            <div className="space-y-4">
              {email && (
                <button
                  onClick={handleResendVerification}
                  disabled={!canResend || resending}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {resending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>
                        {canResend 
                          ? 'Reenviar Verificación' 
                          : `Espera ${countdown}s`
                        }
                      </span>
                    </>
                  )}
                </button>
              )}
              <Link href="/auth/login" className="btn-secondary">
                Ir a Iniciar Sesión
              </Link>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Inicio</span>
            </Link>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              {renderContent()}
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