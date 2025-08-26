'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, ShoppingCart, Check, Clock, Users } from 'lucide-react'
import { useCartStore } from '../../stores/cart'
import { Event, TicketType } from '../../types/api'

interface TicketSelectorProps {
  event: Event
  onTicketsSelected?: (totalQuantity: number, totalAmount: number) => void
}

interface TicketSelection {
  [ticketTypeId: string]: number
}

export function TicketSelector({ event, onTicketsSelected }: TicketSelectorProps) {
  const [selections, setSelections] = useState<TicketSelection>({})
  const [isAdding, setIsAdding] = useState<string | null>(null)
  
  const { addTicket, updateTicketQuantity, getTicketQuantity, openCart } = useCartStore()

  // Calculate totals
  const totalQuantity = Object.values(selections).reduce((sum, qty) => sum + qty, 0)
  const totalAmount = event.ticketTypes.reduce((sum, ticket) => {
    const quantity = selections[ticket._id] || 0
    return sum + (ticket.price * quantity)
  }, 0)

  const updateQuantity = (ticketType: TicketType, change: number) => {
    const ticketId = ticketType._id
    const currentQty = selections[ticketId] || 0
    const newQty = Math.max(0, Math.min(currentQty + change, Math.min(ticketType.availableQuantity, ticketType.maxQuantityPerOrder)))
    
    setSelections(prev => ({
      ...prev,
      [ticketId]: newQty
    }))

    onTicketsSelected?.(
      Object.values({ ...selections, [ticketId]: newQty }).reduce((sum, qty) => sum + qty, 0),
      event.ticketTypes.reduce((sum, ticket) => {
        const quantity = ticket._id === ticketId ? newQty : (selections[ticket._id] || 0)
        return sum + (ticket.price * quantity)
      }, 0)
    )
  }

  const addToCart = async (ticketType: TicketType) => {
    const quantity = selections[ticketType._id]
    if (!quantity || quantity <= 0) return

    setIsAdding(ticketType._id)

    try {
      // Add to cart
      addTicket(
        event.id,
        {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.startDateTime,
          eventVenue: event.venue,
          eventImage: event.coverImage
        },
        {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.startDateTime,
          eventVenue: event.venue,
          ticketTypeId: ticketType._id,
          ticketTypeName: ticketType.name,
          price: ticketType.price,
          currency: ticketType.currency,
          quantity: quantity,
          maxQuantity: Math.min(ticketType.availableQuantity, ticketType.maxQuantityPerOrder),
          description: ticketType.description
        }
      )

      // Reset selection for this ticket type
      setSelections(prev => ({
        ...prev,
        [ticketType._id]: 0
      }))

      // Show success feedback
      setTimeout(() => setIsAdding(null), 1000)
      
    } catch (error) {
      console.error('Error adding to cart:', error)
      setIsAdding(null)
    }
  }

  const addAllToCart = async () => {
    for (const ticketType of event.ticketTypes) {
      const quantity = selections[ticketType._id]
      if (quantity && quantity > 0) {
        await addToCart(ticketType)
      }
    }
  }

  if (!event.ticketTypes || event.ticketTypes.length === 0) {
    return (
      <div className="card text-center py-8">
        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Tickets No Disponibles
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Los tickets para este evento aún no están disponibles.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Seleccionar Tickets
        </h3>
        {totalQuantity > 0 && (
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
            <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {event.ticketTypes[0]?.currency === 'DOP' ? 'RD$' : event.ticketTypes[0]?.currency}
              {totalAmount.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {event.ticketTypes.map((ticketType) => {
          const quantity = selections[ticketType._id] || 0
          const inCart = getTicketQuantity(event.id, ticketType._id)
          const isUnavailable = ticketType.availableQuantity <= 0
          const isLoading = isAdding === ticketType._id

          return (
            <motion.div
              key={ticketType._id}
              layout
              className={`card ${isUnavailable ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {ticketType.name}
                    </h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {ticketType.currency === 'DOP' ? 'RD$' : ticketType.currency}
                        {ticketType.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {ticketType.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{ticketType.availableQuantity} disponibles</span>
                      </div>
                      <div>
                        Máx. {ticketType.maxQuantityPerOrder} por pedido
                      </div>
                    </div>

                    {!isUnavailable && (
                      <div className="flex items-center space-x-3">
                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(ticketType, -1)}
                            disabled={quantity <= 0}
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                            {quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(ticketType, 1)}
                            disabled={quantity >= Math.min(ticketType.availableQuantity, ticketType.maxQuantityPerOrder)}
                            className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Add to Cart Button */}
                        <AnimatePresence>
                          {quantity > 0 && (
                            <motion.button
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              onClick={() => addToCart(ticketType)}
                              disabled={isLoading}
                              className="btn-primary text-sm px-3 py-1 flex items-center space-x-1"
                            >
                              {isLoading ? (
                                <>
                                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Agregando...</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-3 h-3" />
                                  <span>Agregar</span>
                                </>
                              )}
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  {inCart > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-400">
                        <Check className="w-4 h-4" />
                        <span>{inCart} en el carrito</span>
                      </div>
                    </motion.div>
                  )}

                  {isUnavailable && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        Tickets agotados
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Add All to Cart Button */}
      {totalQuantity > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {totalQuantity} ticket{totalQuantity > 1 ? 's' : ''} seleccionado{totalQuantity > 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total: {event.ticketTypes[0]?.currency === 'DOP' ? 'RD$' : event.ticketTypes[0]?.currency}
                {totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={addAllToCart}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Agregar Todo al Carrito</span>
            </button>
            
            <button
              onClick={openCart}
              className="btn-outline px-4"
            >
              Ver Carrito
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}