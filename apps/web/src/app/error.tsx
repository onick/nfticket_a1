'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  const handleReport = () => {
    // In a real app, this would send error report to monitoring service
    const errorData = {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    console.log('Error report:', errorData)
    alert('Reporte de error enviado. Gracias por ayudarnos a mejorar.')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                ¡Algo salió mal!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                Ha ocurrido un error inesperado en la aplicación.
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Nuestro equipo ha sido notificado y está trabajando para solucionarlo.
              </p>
              
              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <motion.details
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-left bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
                >
                  <summary className="cursor-pointer font-medium text-red-900 dark:text-red-100 mb-2">
                    Detalles del Error (Desarrollo)
                  </summary>
                  <div className="text-sm text-red-800 dark:text-red-200 font-mono bg-red-100 dark:bg-red-900/40 p-3 rounded border overflow-auto max-h-40">
                    <div className="mb-2">
                      <strong>Mensaje:</strong> {error.message}
                    </div>
                    {error.digest && (
                      <div className="mb-2">
                        <strong>Digest:</strong> {error.digest}
                      </div>
                    )}
                    {error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs mt-1">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.details>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={reset}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Intentar de Nuevo</span>
                </button>
                <Link
                  href="/"
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>Volver al Inicio</span>
                </Link>
              </div>

              <button
                onClick={handleReport}
                className="btn-ghost flex items-center justify-center space-x-2 mx-auto"
              >
                <Bug className="w-4 h-4" />
                <span>Reportar Error</span>
              </button>

              {/* Helpful Information */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Mientras tanto, puedes:
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>• Recargar la página en unos minutos</p>
                  <p>• Verificar tu conexión a internet</p>
                  <p>• Contactar soporte si el problema persiste</p>
                </div>
                
                <div className="mt-6">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ID del Error: {error.digest || 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <div className="absolute top-1/4 left-10 w-20 h-20 bg-red-200 dark:bg-red-800 rounded-full opacity-20"></div>
            <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-orange-200 dark:bg-orange-800 rounded-full opacity-20"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-yellow-200 dark:bg-yellow-800 rounded-full opacity-20"></div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}