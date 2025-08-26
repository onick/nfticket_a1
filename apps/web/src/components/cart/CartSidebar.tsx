'use client'

import { Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, Calendar, MapPin } from 'lucide-react'
import { useCartStore } from '../../stores/cart'
import { useAuthStore } from '../../stores/auth'
import { apiClient } from '../../lib/api'

export function CartSidebar() {
  const { 
    isOpen, 
    items, 
    totalItems, 
    totalAmount, 
    closeCart, 
    updateTicketQuantity, 
    removeTicket,
    clearEvent,
    clearCart 
  } = useCartStore()
  
  const { user, isAuthenticated } = useAuthStore()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-DO', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      alert('Debes iniciar sesión para realizar una compra')
      return
    }

    if (items.length === 0) {
      return
    }

    try {
      // Prepare order data
      const orderItems = items.flatMap(item => 
        item.tickets.map(ticket => ({
          eventId: ticket.eventId,
          eventTitle: ticket.eventTitle,
          ticketTypeId: ticket.ticketTypeId,
          ticketTypeName: ticket.ticketTypeName,
          price: ticket.price,
          currency: ticket.currency,
          quantity: ticket.quantity
        }))
      )

      const orderData = {
        items: orderItems,
        attendeeInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || undefined
        },
        paymentMethod: 'STRIPE'
      }

      // Create order
      console.log('Creating order...', orderData)
      const orderResponse = await apiClient.createOrder(orderData)
      
      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || 'Error al crear la orden')
      }

      console.log('Order created:', orderResponse.data)

      // Create Stripe checkout session
      const checkoutResponse = await apiClient.createCheckoutSession(orderResponse.data.id)
      
      if (!checkoutResponse.success || !checkoutResponse.data) {
        throw new Error(checkoutResponse.message || 'Error al crear sesión de pago')
      }

      console.log('Checkout session created:', checkoutResponse.data)

      // Redirect to Stripe Checkout
      window.location.href = checkoutResponse.data.url

    } catch (error) {
      console.error('Checkout error:', error)
      alert(`Error en el checkout: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Carrito
                </h2>
                {totalItems > 0 && (
                  <span className="bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full text-sm font-medium">
                    {totalItems}
                  </span>
                )}
              </div>
              
              <button
                onClick={closeCart}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Explora eventos y agrega tickets a tu carrito
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Explorar Eventos
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4"
                    >
                      {/* Event Info */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {item.eventTitle}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(item.eventDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.eventVenue}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tickets */}
                      <div className="space-y-3">
                        {item.tickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                {ticket.ticketTypeName}
                              </h4>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {ticket.currency === 'DOP' ? 'RD$' : ticket.currency}
                                  {ticket.price.toLocaleString()} c/u
                                </span>
                                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                  {ticket.currency === 'DOP' ? 'RD$' : ticket.currency}
                                  {(ticket.price * ticket.quantity).toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => updateTicketQuantity(item.eventId, ticket.ticketTypeId, ticket.quantity - 1)}
                                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                
                                <span className="w-6 text-center text-sm font-medium text-gray-900 dark:text-white">
                                  {ticket.quantity}
                                </span>
                                
                                <button
                                  onClick={() => updateTicketQuantity(item.eventId, ticket.ticketTypeId, ticket.quantity + 1)}
                                  disabled={ticket.quantity >= ticket.maxQuantity}
                                  className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeTicket(item.eventId, ticket.ticketTypeId)}
                                className="w-6 h-6 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Event Total */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Subtotal del evento
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {item.tickets[0]?.currency === 'DOP' ? 'RD$' : item.tickets[0]?.currency}
                          {item.totalAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Remove Event Button */}
                      <button
                        onClick={() => clearEvent(item.eventId)}
                        className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      >
                        Eliminar evento del carrito
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {items[0]?.tickets[0]?.currency === 'DOP' ? 'RD$' : items[0]?.tickets[0]?.currency}
                    {totalAmount.toLocaleString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <span>Proceder al Pago</span>
                    <span>({totalItems} ticket{totalItems > 1 ? 's' : ''})</span>
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={closeCart}
                      className="btn-ghost flex-1"
                    >
                      Seguir Comprando
                    </button>
                    
                    <button
                      onClick={clearCart}
                      className="btn-secondary px-4"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    🔒 Compra segura • 📱 Tickets digitales • ↩️ Garantía de reembolso
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  )
}