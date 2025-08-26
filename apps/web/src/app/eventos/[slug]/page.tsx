'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Share2, 
  Heart, 
  Star, 
  ArrowLeft 
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TicketSelector } from '@/components/events/TicketSelector'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { CartSidebar } from '@/components/cart/CartSidebar'
import { apiClient } from '@/lib/api'
import { Event } from '@/types/api'

export default function EventDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchEvent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // For now, we'll fetch from the events list and find by slug
        // Later we can implement a direct GET /events/:slug endpoint
        const response = await apiClient.getEvents({ limit: 50 })
        
        if (response.success && response.data) {
          const foundEvent = response.data.events.find(e => 
            e.slug === slug || e.id === slug
          )
          
          if (foundEvent) {
            setEvent(foundEvent)
          } else {
            setError('Evento no encontrado')
          }
        } else {
          setError('Error al cargar el evento')
        }
      } catch (err) {
        console.error('Error fetching event:', err)
        setError('Error al cargar el evento')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [slug])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.toLocaleDateString('es-DO', { weekday: 'long' }),
      date: date.toLocaleDateString('es-DO', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('es-DO', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Evento no encontrado'}
            </h1>
            <Link href="/" className="btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const eventDate = formatDate(event.startDateTime)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a eventos</span>
          </Link>
        </div>

        {/* Event Header */}
        <section className="bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Event Image */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="aspect-video rounded-2xl overflow-hidden mb-6"
                >
                  {event.coverImage ? (
                    <img 
                      src={event.coverImage} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                      <Calendar className="w-20 h-20 text-primary-500" />
                    </div>
                  )}
                </motion.div>

                {/* Event Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  {/* Title and Actions */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {event.title}
                      </h1>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                          {event.category}
                        </span>
                        {event.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button className="btn-ghost p-2">
                        <Heart className="w-5 h-5" />
                      </button>
                      <button className="btn-ghost p-2">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Event Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {eventDate.day}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {eventDate.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {eventDate.time}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Hora de República Dominicana
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {event.venue}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {event.isOnline ? 'Evento virtual' : 'Evento presencial'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {event.maxCapacity} personas
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Capacidad máxima
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      Descripción del Evento
                    </h2>
                    <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {event.description}
                    </div>
                  </div>

                  {/* Organizer Info */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Organizado por
                    </h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                        {event.organizerId.firstName.charAt(0)}{event.organizerId.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {event.organizerId.firstName} {event.organizerId.lastName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Organizador de eventos
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Ticket Selection Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="sticky top-24"
                >
                  <TicketSelector event={event} />
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartSidebar />
    </div>
  )
}