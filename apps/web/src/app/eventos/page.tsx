'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Grid3X3, 
  List,
  Heart,
  Share2,
  Star,
  Users,
  Ticket
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ShareModal } from '@/components/ui/ShareModal'
import { useFavorites } from '@/hooks/useFavorites'
import { apiClient } from '@/lib/api'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  startDateTime: string
  endDateTime: string
  venue: string
  isOnline: boolean
  category: string
  tags: string[]
  coverImage: string
  viewCount: number
  shareCount: number
  ticketTypes: {
    _id: string
    name: string
    price: number
    currency: string
    availableQuantity: number
  }[]
}

const categories = [
  { id: 'all', name: 'Todos', count: 0 },
  { id: 'music', name: 'Música', count: 0 },
  { id: 'sports', name: 'Deportes', count: 0 },
  { id: 'technology', name: 'Tecnología', count: 0 },
  { id: 'business', name: 'Negocios', count: 0 },
  { id: 'arts', name: 'Arte', count: 0 },
  { id: 'food', name: 'Gastronomía', count: 0 },
  { id: 'education', name: 'Educación', count: 0 },
  { id: 'health', name: 'Salud', count: 0 },
  { id: 'entertainment', name: 'Entretenimiento', count: 0 }
]

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [eventToShare, setEventToShare] = useState<Event | null>(null)
  
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getEvents()
      if (response.success && response.data) {
        // La API devuelve un objeto con events array y paginación
        setEvents(response.data.events || response.data || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([]) // Asegurar que events sea siempre un array
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = Array.isArray(events) ? events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }) : []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-DO', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getLowestPrice = (ticketTypes: Event['ticketTypes']) => {
    if (!ticketTypes.length) return null
    const availableTickets = ticketTypes.filter(t => t.availableQuantity > 0)
    if (!availableTickets.length) return null
    return Math.min(...availableTickets.map(t => t.price))
  }

  const handleShareEvent = (event: Event) => {
    setEventToShare(event)
    setShareModalOpen(true)
  }

  const closeShareModal = () => {
    setShareModalOpen(false)
    setEventToShare(null)
  }

  const handleToggleFavorite = (event: Event) => {
    toggleFavorite({
      id: event.id,
      title: event.title,
      slug: event.slug,
      startDateTime: event.startDateTime,
      venue: event.venue,
      coverImage: event.coverImage
    })
  }

  const EventCard = ({ event, isListView = false }: { event: Event, isListView?: boolean }) => {
    const lowestPrice = getLowestPrice(event.ticketTypes)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
          isListView ? 'flex' : ''
        }`}
      >
        <div className={`relative ${isListView ? 'w-48 flex-shrink-0' : 'aspect-video'}`}>
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3 flex space-x-2">
            <button 
              onClick={() => handleToggleFavorite(event)}
              className={`p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 ${
                isFavorite(event.id) ? 'text-red-500 scale-110' : 'text-gray-600'
              }`}
            >
              <Heart 
                className={`w-4 h-4 transition-all duration-200 ${
                  isFavorite(event.id) ? 'fill-current' : ''
                }`} 
              />
            </button>
            <button 
              onClick={() => handleShareEvent(event)}
              className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          {lowestPrice && (
            <div className="absolute bottom-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Desde RD$ {lowestPrice.toLocaleString()}
            </div>
          )}
        </div>

        <div className={`p-4 ${isListView ? 'flex-1' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full capitalize">
              {event.category}
            </span>
            <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400 text-sm">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{event.viewCount}</span>
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
              </div>
            </div>
          </div>

          <Link href={`/eventos/${event.slug}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
              {event.title}
            </h3>
          </Link>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(event.startDateTime)} • {formatTime(event.startDateTime)}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{event.isOnline ? 'Evento Virtual' : event.venue}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {event.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                  +{event.tags.length - 2}
                </span>
              )}
            </div>
            <Link
              href={`/eventos/${event.slug}`}
              className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors"
            >
              <Ticket className="w-4 h-4" />
              <span>Ver Tickets</span>
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Descubre Eventos Increíbles
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                Encuentra los mejores eventos en República Dominicana. Música, teatro, deportes y más.
              </p>
              
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar eventos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border-0 focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filtros</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Categorías
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        {category.id === 'all' ? (
                          <span className="text-sm text-gray-500">{filteredEvents.length}</span>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {Array.isArray(events) ? events.filter(e => e.category === category.id).length : 0}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Events Content */}
            <div className="flex-1">
              {/* View Mode Toggle & Results Count */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{filteredEvents.length}</span> eventos encontrados
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Events Grid/List */}
              {filteredEvents.length > 0 ? (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isListView={viewMode === 'list'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No se encontraron eventos
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Intenta ajustar tu búsqueda o filtros para encontrar más eventos.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="btn-primary"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Share Modal */}
      {eventToShare && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={closeShareModal}
          event={eventToShare}
        />
      )}
    </div>
  )
}