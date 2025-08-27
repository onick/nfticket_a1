'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  WifiOff, 
  RefreshCw, 
  Home, 
  Ticket,
  Calendar,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
      setLastUpdate(new Date().toLocaleTimeString('es-DO'))
    }

    // Check initial status
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload()
    } else {
      alert('Aún no hay conexión a internet. Por favor verifica tu conexión.')
    }
  }

  const cachedRoutes = [
    { name: 'Inicio', path: '/', icon: Home, available: true },
    { name: 'Eventos', path: '/eventos', icon: Calendar, available: true },
    { name: 'Buscar', path: '/buscar', icon: Search, available: false },
    { name: 'Mis Tickets', path: '/dashboard', icon: Ticket, available: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16 flex items-center justify-center min-h-[80vh]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            {/* Status indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
                isOnline 
                  ? 'bg-green-100 dark:bg-green-900/20' 
                  : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {isOnline ? (
                  <RefreshCw className="w-12 h-12 text-green-600 dark:text-green-400" />
                ) : (
                  <WifiOff className="w-12 h-12 text-red-600 dark:text-red-400" />
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {isOnline ? '¡Conexión restaurada!' : 'Sin conexión a internet'}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                {isOnline 
                  ? 'Ya puedes usar todas las funcionalidades de TIX'
                  : 'Algunas funcionalidades están limitadas sin conexión'
                }
              </p>

              {lastUpdate && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                  Última actualización: {lastUpdate}
                </p>
              )}
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 mb-12"
            >
              <button
                onClick={handleRetry}
                className={`btn-primary w-full max-w-xs flex items-center justify-center space-x-2 ${
                  !isOnline && 'opacity-50'
                }`}
                disabled={!isOnline}
              >
                <RefreshCw className="w-5 h-5" />
                <span>
                  {isOnline ? 'Recargar página' : 'Verificar conexión'}
                </span>
              </button>

              <Link href="/" className="btn-secondary w-full max-w-xs">
                Ir al inicio
              </Link>
            </motion.div>

            {/* Available features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {isOnline ? 'Todas las funciones disponibles' : 'Funciones disponibles offline'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {cachedRoutes.map((route) => {
                  const Icon = route.icon
                  const available = isOnline || route.available
                  
                  return (
                    <div
                      key={route.path}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                        available
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                          : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 opacity-60'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${
                        available 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`} />
                      <div className="flex-1 text-left">
                        <div className={`font-medium ${
                          available 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {route.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {available ? 'Disponible' : 'Requiere conexión'}
                        </div>
                      </div>
                      {available && (
                        <Link
                          href={route.path}
                          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                        >
                          Ir
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>

              {!isOnline && (
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    💡 Consejos para usar TIX offline:
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Los eventos visitados recientemente están disponibles offline</li>
                    <li>• Tus tickets descargados se pueden ver sin conexión</li>
                    <li>• Las búsquedas y compras requieren conexión a internet</li>
                    <li>• Los cambios se sincronizarán cuando recuperes la conexión</li>
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Connection tips */}
            {!isOnline && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-left bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6"
              >
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
                  🔧 ¿Problemas de conexión?
                </h3>
                <div className="space-y-3 text-sm text-yellow-800 dark:text-yellow-200">
                  <div>
                    <strong>Para WiFi:</strong>
                    <ul className="mt-1 space-y-1 ml-4">
                      <li>• Verifica que estés conectado a la red correcta</li>
                      <li>• Intenta desconectar y reconectar al WiFi</li>
                      <li>• Reinicia tu router si es necesario</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Para datos móviles:</strong>
                    <ul className="mt-1 space-y-1 ml-4">
                      <li>• Verifica que tengas datos disponibles</li>
                      <li>• Activa y desactiva el modo avión</li>
                      <li>• Muévete a un área con mejor cobertura</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}