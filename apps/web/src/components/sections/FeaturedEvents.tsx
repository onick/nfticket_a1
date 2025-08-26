'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Star, 
  Heart, 
  Users, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react'
import { apiClient } from '../../lib/api'
import { Event, EventsResponse } from '../../types/api'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export function FeaturedEvents() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedEvents, setLikedEvents] = useState<string[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getEvents({
          limit: 6,
          upcoming: true
        })
        
        if (response.success && response.data) {
          setEvents(response.data.events)
        } else {
          setError('Failed to load events')
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events')
        // Use fallback mock data if API fails
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const toggleLike = (eventId: string) => {
    setLikedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    )
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(events.length / 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.ceil(events.length / 2) - 1 : prev - 1
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-DO', {
      weekday: 'short',
      month: 'short', 
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

  const getMinPrice = (event: Event) => {
    if (event.ticketTypes.length === 0) return 0
    return Math.min(...event.ticketTypes.map(ticket => ticket.price))
  }

  const getCurrency = (event: Event) => {
    if (event.ticketTypes.length === 0) return 'DOP'
    return event.ticketTypes[0].currency
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          {error || 'No hay eventos disponibles en este momento'}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Eventos Destacados
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Los eventos más populares y mejor valorados de la semana
          </p>
        </div>
        
        <div className="hidden md:flex space-x-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full border border-gray-300 hover:border-primary-500 hover:text-primary-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full border border-gray-300 hover:border-primary-500 hover:text-primary-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex transition-transform duration-300"
          animate={{ x: `${-currentIndex * 100}%` }}
        >
          {Array.from({ length: Math.ceil(events.length / 2) }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid md:grid-cols-2 gap-6">
                {events
                  .slice(slideIndex * 2, slideIndex * 2 + 2)
                  .map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ y: -5 }}
                      className="card group cursor-pointer overflow-hidden"
                    >
                      {/* Image */}
                      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                        {event.coverImage ? (
                          <img 
                            src={event.coverImage} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                            <Calendar className="w-12 h-12 text-primary-500" />
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        
                        {/* Like Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleLike(event.id)
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              likedEvents.includes(event.id)
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-600'
                            }`} 
                          />
                        </button>

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-primary-600 text-white text-sm rounded-full font-medium">
                            {event.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                          {event.description}
                        </p>

                        {/* Date & Location */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(event.startDateTime)} • {formatTime(event.startDateTime)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{event.venue}</span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {event.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={`${event.id}-tag-${index}`}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Users className="w-4 h-4" />
                              <span className="text-sm">{event.maxCapacity} personas</span>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{event.viewCount} vistas</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-gray-500">Desde</div>
                            <div className="text-lg font-bold text-primary-600">
                              {getCurrency(event) === 'DOP' ? 'RD$' : getCurrency(event)}{getMinPrice(event).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button className="w-full btn-primary mt-4">
                          Ver Detalles
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden justify-center space-x-2">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full border border-gray-300 hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full border border-gray-300 hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}