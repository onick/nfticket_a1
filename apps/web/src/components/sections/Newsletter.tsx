'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Check } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSubscribed(true)
    setEmail('')
    
    // Reset después de 3 segundos
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <div className="text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-3xl lg:text-4xl font-bold text-white">
          Nunca Te Pierdas los Mejores Eventos
        </h2>
        
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Suscríbete a nuestro newsletter y recibe recomendaciones personalizadas, 
          ofertas exclusivas y acceso anticipado a eventos populares.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-md mx-auto"
      >
        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full btn bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Suscribirme Gratis</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-500 rounded-xl p-6 text-white"
          >
            <Check className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-xl font-bold mb-1">¡Suscripción Exitosa!</h3>
            <p>Revisa tu email para confirmar tu suscripción.</p>
          </motion.div>
        )}

        <p className="text-gray-400 text-sm mt-4">
          Sin spam, solo los mejores eventos. Puedes cancelar cuando quieras.
        </p>
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid md:grid-cols-3 gap-8 pt-8"
      >
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">📧</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Newsletter Semanal</h3>
          <p className="text-gray-400 text-sm">Los eventos más hot de la semana</p>
        </div>

        <div className="text-center">
          <div className="w-8 h-8 bg-secondary-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">🎟️</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Ofertas Exclusivas</h3>
          <p className="text-gray-400 text-sm">Descuentos solo para suscriptores</p>
        </div>

        <div className="text-center">
          <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold">⚡</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Acceso Anticipado</h3>
          <p className="text-gray-400 text-sm">Compra antes que nadie</p>
        </div>
      </motion.div>
    </div>
  )
}