'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react'

export default function CheckoutCancelledPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const orderId = searchParams.get('order_id')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Compra Cancelada
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Has cancelado tu compra. No te preocupes, tus tickets seleccionados siguen en tu carrito.
          </p>

          {orderId && (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Orden: <span className="font-mono">{orderId}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Continuar Comprando</span>
            </button>
            
            <button
              onClick={() => router.back()}
              className="btn-outline w-full flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver Atrás</span>
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Tip:</strong> Puedes completar tu compra en cualquier momento desde tu carrito.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}