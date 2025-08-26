'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Calendar, MapPin, Clock, Mail } from 'lucide-react'
import { apiClient } from '../../../lib/api'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'
import { useCartStore } from '../../../stores/cart'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setError('Sesión de pago no encontrada')
      setLoading(false)
      return
    }

    const confirmPayment = async () => {
      try {
        setLoading(true)
        setError(null)

        // Confirm payment with our API
        const response = await apiClient.confirmPayment(sessionId)
        
        if (response.success && response.data) {
          setOrder(response.data)
          // Clear the cart since payment is successful
          clearCart()
        } else {
          setError(response.message || 'Error al confirmar el pago')
        }
      } catch (err: any) {
        console.error('Payment confirmation error:', err)
        setError(err.message || 'Error al procesar el pago')
      } finally {
        setLoading(false)
      }
    }

    confirmPayment()
  }, [searchParams, clearCart])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-DO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Confirmando tu pago...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error en el Pago
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Pago Exitoso!
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tu compra se ha procesado correctamente. Recibirás un email con tus tickets.
          </p>
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
          >
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Detalles de la Orden
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Orden #{order.orderNumber}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Información del Comprador
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p>{order.attendeeInfo.firstName} {order.attendeeInfo.lastName}</p>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{order.attendeeInfo.email}</span>
                  </div>
                  {order.attendeeInfo.phone && (
                    <p>{order.attendeeInfo.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Resumen de Pago
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-semibold">
                      {order.currency === 'DOP' ? 'RD$' : order.currency}
                      {order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Método de Pago:</span>
                    <span>Tarjeta de Crédito</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Pagado
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Tickets Comprados ({order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)})
              </h3>
              
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.eventTitle}
                      </h4>
                      <span className="text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                        {item.quantity}x {item.ticketTypeName}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Próximamente</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.currency === 'DOP' ? 'RD$' : item.currency}
                        {item.price.toLocaleString()} c/u
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.currency === 'DOP' ? 'RD$' : item.currency}
                        {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center space-y-4"
        >
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
              <Mail className="w-5 h-5" />
              <span className="font-medium">Revisa tu email</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Hemos enviado tus tickets digitales a {order?.attendeeInfo.email}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/mis-tickets')}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Ver Mis Tickets</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="btn-outline"
            >
              Volver al Inicio
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}