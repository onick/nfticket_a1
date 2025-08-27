'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search,
  Filter,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  ChevronDown,
  Clock,
  Star
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EventCard } from '@/components/events/EventCard'
import { apiClient } from '@/lib/api'
import Link from 'next/link'

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
  coverImage?: string
  maxCapacity: number
  viewCount: number
  shareCount: number
  status: string
  organizerId: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  ticketTypes: Array<{
    _id: string
    name: string
    description: string
    price: number
    currency: string
    totalQuantity: number
    availableQuantity: number
  }>
}

interface FilterOptions {
  category: string
  dateRange: string
  priceRange: [number, number]
  location: 'all' | 'online' | 'presencial'
  sortBy: 'date' | 'price' | 'popularity' | 'alphabetical'
  sortOrder: 'asc' | 'desc'
}

const categories = [
  { id: 'all', name: 'Todas las categorías', icon: '🎫' },
  { id: 'music', name: 'Música', icon: '🎵' },
  { id: 'sports', name: 'Deportes', icon: '⚽' },
  { id: 'technology', name: 'Tecnología', icon: '💻' },
  { id: 'business', name: 'Negocios', icon: '💼' },
  { id: 'arts', name: 'Arte', icon: '🎨' },
  { id: 'food', name: 'Gastronomía', icon: '🍽️' }
]

const dateRanges = [
  { id: 'all', name: 'Cualquier fecha' },
  { id: 'today', name: 'Hoy' },
  { id: 'tomorrow', name: 'Mañana' },
  { id: 'week', name: 'Esta semana' },
  { id: 'month', name: 'Este mes' },
  { id: 'custom', name: 'Fechas personalizadas' }
]

const sortOptions = [
  { id: 'date', name: 'Fecha', icon: Calendar },
  { id: 'price', name: 'Precio', icon: DollarSign },
  { id: 'popularity', name: 'Popularidad', icon: Star },
  { id: 'alphabetical', name: 'Alfabético', icon: ArrowUpDown }
]

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'all',
    dateRange: 'all',
    priceRange: [0, 10000],
    location: 'all',
    sortBy: 'date',
    sortOrder: 'asc'
  })

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const response = await apiClient.getEvents({ 
          limit: 50,
          search: searchQuery,
          category: filters.category !== 'all' ? filters.category : undefined
        })
        
        if (response.success && response.data) {
          setEvents(response.data.events)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [searchQuery, filters.category])

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...events]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.startDateTime)
        
        switch (filters.dateRange) {
          case 'today':
            return eventDate >= today && eventDate < tomorrow
          case 'tomorrow':
            return eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)
          case 'week':
            return eventDate >= today && eventDate < nextWeek
          case 'month':
            return eventDate >= today && eventDate < nextMonth
          default:
            return true
        }
      })
    }

    // Filter by location type
    if (filters.location !== 'all') {
      filtered = filtered.filter(event => {
        if (filters.location === 'online') return event.isOnline
        if (filters.location === 'presencial') return !event.isOnline
        return true
      })
    }

    // Filter by price range
    filtered = filtered.filter(event => {
      const minPrice = Math.min(...event.ticketTypes.map(t => t.price))
      return minPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1]
    })

    // Sort events
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
          break
        case 'price':
          const aPrice = Math.min(...a.ticketTypes.map(t => t.price))
          const bPrice = Math.min(...b.ticketTypes.map(t => t.price))
          comparison = aPrice - bPrice
          break
        case 'popularity':
          comparison = (b.viewCount + b.shareCount) - (a.viewCount + a.shareCount)
          break
        case 'alphabetical':
          comparison = a.title.localeCompare(b.title)
          break
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }, [events, searchQuery, filters])

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      dateRange: 'all',
      priceRange: [0, 10000],
      location: 'all',
      sortBy: 'date',
      sortOrder: 'asc'
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`)
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'all' && value !== 'asc' && JSON.stringify(value) !== JSON.stringify([0, 10000])
  ).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        {/* Search Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar eventos por nombre, categoría, lugar..."
                    className="input w-full pl-12 pr-4 text-lg h-14"
                  />
                  <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
                </div>
              </form>

              {/* Quick Filters & Controls */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`btn-secondary flex items-center space-x-2 ${
                      activeFiltersCount > 0 ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filtros</span>
                    {activeFiltersCount > 0 && (
                      <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  {searchQuery && (
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">{filteredEvents.length}</span> eventos encontrados para "{searchQuery}"
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={`${filters.sortBy}-${filters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-')
                        updateFilter('sortBy', sortBy as FilterOptions['sortBy'])
                        updateFilter('sortOrder', sortOrder as FilterOptions['sortOrder'])
                      }}
                      className="input pr-8"
                    >
                      {sortOptions.map(option => (
                        <React.Fragment key={option.id}>
                          <option value={`${option.id}-asc`}>{option.name} ↑</option>
                          <option value={`${option.id}-desc`}>{option.name} ↓</option>
                        </React.Fragment>
                      ))}
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${
                        viewMode === 'list'
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Filtros de Búsqueda
                    </h3>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      Limpiar filtros
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categoría
                      </label>
                      <select
                        value={filters.category}
                        onChange={(e) => updateFilter('category', e.target.value)}
                        className="input w-full"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fecha
                      </label>
                      <select
                        value={filters.dateRange}
                        onChange={(e) => updateFilter('dateRange', e.target.value)}
                        className="input w-full"
                      >
                        {dateRanges.map(range => (
                          <option key={range.id} value={range.id}>
                            {range.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo de Evento
                      </label>
                      <select
                        value={filters.location}
                        onChange={(e) => updateFilter('location', e.target.value as FilterOptions['location'])}
                        className="input w-full"
                      >
                        <option value="all">Todos los tipos</option>
                        <option value="presencial">Presencial</option>
                        <option value="online">Virtual</option>
                      </select>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Rango de Precio (RD$)
                      </label>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          step="100"
                          value={filters.priceRange[1]}
                          onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                          className="w-full"
                        />
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Hasta RD$ {filters.priceRange[1].toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No se encontraron eventos
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchQuery 
                    ? `No hay eventos que coincidan con "${searchQuery}"`
                    : 'Prueba ajustando los filtros de búsqueda'
                  }
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => setSearchQuery('')}
                    className="btn-secondary"
                  >
                    Limpiar búsqueda
                  </button>
                  <button
                    onClick={clearFilters}
                    className="btn-secondary"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {searchQuery ? `Resultados para "${searchQuery}"` : 'Todos los Eventos'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <EventCard event={event} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="flex">
                          <div className="w-48 h-32 flex-shrink-0">
                            {event.coverImage ? (
                              <img 
                                src={event.coverImage} 
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                <Calendar className="w-8 h-8 text-primary-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 hover:text-primary-600 dark:hover:text-primary-400">
                                  <Link href={`/eventos/${event.slug}`}>
                                    {event.title}
                                  </Link>
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                                  {event.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(event.startDateTime).toLocaleDateString('es-DO')}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.isOnline ? 'Virtual' : event.venue}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  RD$ {Math.min(...event.ticketTypes.map(t => t.price)).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  desde
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}