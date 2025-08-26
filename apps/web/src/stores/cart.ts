'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartTicket {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  eventVenue: string
  ticketTypeId: string
  ticketTypeName: string
  price: number
  currency: string
  quantity: number
  maxQuantity: number
  description: string
}

export interface CartItem {
  id: string
  eventId: string
  eventTitle: string
  eventDate: string
  eventVenue: string
  eventImage?: string
  tickets: CartTicket[]
  totalAmount: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  isOpen: boolean
  
  // Actions
  addTicket: (eventId: string, eventData: Omit<CartItem, 'id' | 'tickets' | 'totalAmount'>, ticketData: Omit<CartTicket, 'id'>) => void
  removeTicket: (eventId: string, ticketTypeId: string) => void
  updateTicketQuantity: (eventId: string, ticketTypeId: string, quantity: number) => void
  clearEvent: (eventId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Getters
  getEventItem: (eventId: string) => CartItem | undefined
  getTicketQuantity: (eventId: string, ticketTypeId: string) => number
  isTicketInCart: (eventId: string, ticketTypeId: string) => boolean
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      isOpen: false,

      addTicket: (eventId, eventData, ticketData) => {
        set((state) => {
          const existingEventIndex = state.items.findIndex(item => item.eventId === eventId)
          let updatedItems = [...state.items]

          if (existingEventIndex >= 0) {
            // Event already exists in cart
            const existingEvent = updatedItems[existingEventIndex]
            const existingTicketIndex = existingEvent.tickets.findIndex(
              ticket => ticket.ticketTypeId === ticketData.ticketTypeId
            )

            if (existingTicketIndex >= 0) {
              // Ticket type already exists, update quantity
              const existingTicket = existingEvent.tickets[existingTicketIndex]
              const newQuantity = Math.min(
                existingTicket.quantity + ticketData.quantity,
                ticketData.maxQuantity
              )
              
              existingEvent.tickets[existingTicketIndex] = {
                ...existingTicket,
                quantity: newQuantity
              }
            } else {
              // Add new ticket type to existing event
              existingEvent.tickets.push({
                ...ticketData,
                id: generateId()
              })
            }

            // Recalculate event total
            existingEvent.totalAmount = existingEvent.tickets.reduce(
              (sum, ticket) => sum + (ticket.price * ticket.quantity),
              0
            )
          } else {
            // Add new event to cart
            const newCartItem: CartItem = {
              ...eventData,
              id: generateId(),
              tickets: [{
                ...ticketData,
                id: generateId()
              }],
              totalAmount: ticketData.price * ticketData.quantity
            }
            updatedItems.push(newCartItem)
          }

          // Recalculate totals
          const totals = updatedItems.reduce(
            (acc, item) => ({
              totalItems: acc.totalItems + item.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
              totalAmount: acc.totalAmount + item.totalAmount
            }),
            { totalItems: 0, totalAmount: 0 }
          )

          return {
            items: updatedItems,
            totalItems: totals.totalItems,
            totalAmount: totals.totalAmount
          }
        })
      },

      removeTicket: (eventId, ticketTypeId) => {
        set((state) => {
          const updatedItems = state.items.map(item => {
            if (item.eventId === eventId) {
              const updatedTickets = item.tickets.filter(
                ticket => ticket.ticketTypeId !== ticketTypeId
              )
              
              if (updatedTickets.length === 0) {
                return null // Mark for removal
              }

              return {
                ...item,
                tickets: updatedTickets,
                totalAmount: updatedTickets.reduce(
                  (sum, ticket) => sum + (ticket.price * ticket.quantity),
                  0
                )
              }
            }
            return item
          }).filter(Boolean) as CartItem[]

          const totals = updatedItems.reduce(
            (acc, item) => ({
              totalItems: acc.totalItems + item.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
              totalAmount: acc.totalAmount + item.totalAmount
            }),
            { totalItems: 0, totalAmount: 0 }
          )

          return {
            items: updatedItems,
            totalItems: totals.totalItems,
            totalAmount: totals.totalAmount
          }
        })
      },

      updateTicketQuantity: (eventId, ticketTypeId, quantity) => {
        if (quantity <= 0) {
          get().removeTicket(eventId, ticketTypeId)
          return
        }

        set((state) => {
          const updatedItems = state.items.map(item => {
            if (item.eventId === eventId) {
              const updatedTickets = item.tickets.map(ticket => {
                if (ticket.ticketTypeId === ticketTypeId) {
                  return {
                    ...ticket,
                    quantity: Math.min(quantity, ticket.maxQuantity)
                  }
                }
                return ticket
              })

              return {
                ...item,
                tickets: updatedTickets,
                totalAmount: updatedTickets.reduce(
                  (sum, ticket) => sum + (ticket.price * ticket.quantity),
                  0
                )
              }
            }
            return item
          })

          const totals = updatedItems.reduce(
            (acc, item) => ({
              totalItems: acc.totalItems + item.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
              totalAmount: acc.totalAmount + item.totalAmount
            }),
            { totalItems: 0, totalAmount: 0 }
          )

          return {
            items: updatedItems,
            totalItems: totals.totalItems,
            totalAmount: totals.totalAmount
          }
        })
      },

      clearEvent: (eventId) => {
        set((state) => {
          const updatedItems = state.items.filter(item => item.eventId !== eventId)
          
          const totals = updatedItems.reduce(
            (acc, item) => ({
              totalItems: acc.totalItems + item.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
              totalAmount: acc.totalAmount + item.totalAmount
            }),
            { totalItems: 0, totalAmount: 0 }
          )

          return {
            items: updatedItems,
            totalItems: totals.totalItems,
            totalAmount: totals.totalAmount
          }
        })
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
          isOpen: false
        })
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getEventItem: (eventId) => {
        return get().items.find(item => item.eventId === eventId)
      },

      getTicketQuantity: (eventId, ticketTypeId) => {
        const eventItem = get().getEventItem(eventId)
        if (!eventItem) return 0
        
        const ticket = eventItem.tickets.find(t => t.ticketTypeId === ticketTypeId)
        return ticket?.quantity || 0
      },

      isTicketInCart: (eventId, ticketTypeId) => {
        return get().getTicketQuantity(eventId, ticketTypeId) > 0
      }
    }),
    {
      name: 'tix-cart',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount
      })
    }
  )
)