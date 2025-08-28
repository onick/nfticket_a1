'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  Image as ImageIcon,
  Type,
  DollarSign,
  Plus,
  X,
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Monitor,
  Music,
  Gamepad2,
  Laptop,
  Briefcase,
  Palette,
  UtensilsCrossed,
  BookOpen,
  Heart,
  Theater,
  UserCheck,
  Ticket
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'

interface TicketType {
  id: string
  name: string
  description: string
  price: number
  currency: string
  totalQuantity: number
  maxQuantityPerOrder: number
  salesStartAt: string
  salesEndAt: string
}

interface EventForm {
  title: string
  description: string
  longDescription: string
  category: string
  tags: string[]
  startDateTime: string
  endDateTime: string
  venue: string
  isOnline: boolean
  onlineLink?: string
  maxCapacity: number
  coverImage?: string
  images: string[]
  ticketTypes: TicketType[]
}

const categories = [
  { id: 'music', name: 'Música', icon: Music },
  { id: 'sports', name: 'Deportes', icon: Gamepad2 },
  { id: 'technology', name: 'Tecnología', icon: Laptop },
  { id: 'business', name: 'Negocios', icon: Briefcase },
  { id: 'arts', name: 'Arte', icon: Palette },
  { id: 'food', name: 'Gastronomía', icon: UtensilsCrossed },
  { id: 'education', name: 'Educación', icon: BookOpen },
  { id: 'health', name: 'Salud', icon: Heart },
  { id: 'entertainment', name: 'Entretenimiento', icon: Theater },
  { id: 'networking', name: 'Networking', icon: UserCheck }
]

export default function CreateEventPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [newTag, setNewTag] = useState('')
  
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    tags: [],
    startDateTime: '',
    endDateTime: '',
    venue: '',
    isOnline: false,
    onlineLink: '',
    maxCapacity: 100,
    coverImage: '',
    images: [],
    ticketTypes: []
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }
  }, [authLoading, isAuthenticated, router])

  const updateForm = (field: keyof EventForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      updateForm('tags', [...form.tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    updateForm('tags', form.tags.filter(tag => tag !== tagToRemove))
  }

  const addTicketType = () => {
    const newTicketType: TicketType = {
      id: `ticket_${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      currency: 'DOP',
      totalQuantity: 100,
      maxQuantityPerOrder: 5,
      salesStartAt: form.startDateTime || new Date().toISOString().slice(0, 16),
      salesEndAt: form.endDateTime || new Date().toISOString().slice(0, 16)
    }
    updateForm('ticketTypes', [...form.ticketTypes, newTicketType])
  }

  const updateTicketType = (id: string, field: keyof TicketType, value: any) => {
    updateForm('ticketTypes', form.ticketTypes.map(ticket => 
      ticket.id === id ? { ...ticket, [field]: value } : ticket
    ))
  }

  const removeTicketType = (id: string) => {
    updateForm('ticketTypes', form.ticketTypes.filter(ticket => ticket.id !== id))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(form.title && form.description && form.category)
      case 2:
        return !!(form.startDateTime && form.endDateTime && (form.venue || form.isOnline))
      case 3:
        return form.ticketTypes.length > 0 && form.ticketTypes.every(t => t.name && t.price >= 0)
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    setLoading(true)
    try {
      console.log('Creating event:', form)
      
      // Prepare event data for API
      const eventData = {
        title: form.title,
        description: form.description,
        longDescription: form.longDescription,
        category: form.category,
        tags: form.tags,
        startDateTime: form.startDateTime,
        endDateTime: form.endDateTime,
        venue: form.venue,
        isOnline: form.isOnline,
        onlineLink: form.onlineLink,
        maxCapacity: form.maxCapacity,
        coverImage: form.coverImage,
        images: form.images,
        ticketTypes: form.ticketTypes.map(ticket => ({
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          currency: ticket.currency,
          totalQuantity: ticket.totalQuantity,
          maxQuantityPerOrder: ticket.maxQuantityPerOrder,
          salesStartAt: ticket.salesStartAt,
          salesEndAt: ticket.salesEndAt
        }))
      }

      // Call the API
      const response = await apiClient.createEvent(eventData)
      
      if (response.success) {
        alert('¡Evento creado exitosamente!')
        router.push('/dashboard')
      } else {
        throw new Error(response.message || 'Error al crear el evento')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Error al crear el evento. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: 'Información Básica', description: 'Título, descripción y categoría' },
    { number: 2, title: 'Fecha y Lugar', description: 'Cuándo y dónde será el evento' },
    { number: 3, title: 'Tickets', description: 'Tipos de tickets y precios' },
    { number: 4, title: 'Revisión', description: 'Revisa y publica tu evento' }
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link 
                href="/dashboard" 
                className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Dashboard</span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Crear Evento
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Crea y publica tu evento en NFTicket
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.number
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500'
                  }`}>
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-20 h-px transition-colors ${
                      currentStep > step.number
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {steps[currentStep - 1]?.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {steps[currentStep - 1]?.description}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-8"
          >
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Título del Evento *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateForm('title', e.target.value)}
                    className="input w-full"
                    placeholder="Ej: Concierto de Salsa en Vivo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción Corta *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    className="input w-full h-24 resize-none"
                    placeholder="Descripción breve que aparecerá en la lista de eventos..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Descripción Detallada
                  </label>
                  <textarea
                    value={form.longDescription}
                    onChange={(e) => updateForm('longDescription', e.target.value)}
                    className="input w-full h-32 resize-none"
                    placeholder="Descripción completa del evento, incluyendo detalles importantes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Categoría *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => updateForm('category', category.id)}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                          form.category === category.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <category.icon className="w-6 h-6 mb-1" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-primary-500 hover:text-primary-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="input flex-1"
                      placeholder="Agregar tag..."
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="btn-secondary"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Date and Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha y Hora de Inicio *
                    </label>
                    <input
                      type="datetime-local"
                      value={form.startDateTime}
                      onChange={(e) => updateForm('startDateTime', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha y Hora de Fin *
                    </label>
                    <input
                      type="datetime-local"
                      value={form.endDateTime}
                      onChange={(e) => updateForm('endDateTime', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Tipo de Evento
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateForm('isOnline', false)}
                      className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                        !form.isOnline
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <MapPin className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Presencial
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          En una ubicación física
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateForm('isOnline', true)}
                      className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                        form.isOnline
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <Monitor className="w-5 h-5 mr-3 text-primary-600 dark:text-primary-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Virtual
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          En línea
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {!form.isOnline ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Venue/Lugar *
                    </label>
                    <input
                      type="text"
                      value={form.venue}
                      onChange={(e) => updateForm('venue', e.target.value)}
                      className="input w-full"
                      placeholder="Ej: Teatro Nacional Eduardo Brito"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enlace del Evento (Opcional)
                    </label>
                    <input
                      type="url"
                      value={form.onlineLink || ''}
                      onChange={(e) => updateForm('onlineLink', e.target.value)}
                      className="input w-full"
                      placeholder="https://zoom.us/j/1234567890 o similar"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Capacidad Máxima *
                  </label>
                  <input
                    type="number"
                    value={form.maxCapacity}
                    onChange={(e) => updateForm('maxCapacity', parseInt(e.target.value) || 0)}
                    className="input w-full"
                    min="1"
                    placeholder="100"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Ticket Types */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Tipos de Tickets
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Define los diferentes tipos de tickets para tu evento
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addTicketType}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Ticket</span>
                  </button>
                </div>

                {form.ticketTypes.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No hay tipos de tickets
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Agrega al menos un tipo de ticket para tu evento
                    </p>
                    <button
                      type="button"
                      onClick={addTicketType}
                      className="btn-primary"
                    >
                      Crear Primer Ticket
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.ticketTypes.map((ticket, index) => (
                      <div
                        key={ticket.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Ticket {index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeTicketType(ticket.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Nombre *
                            </label>
                            <input
                              type="text"
                              value={ticket.name}
                              onChange={(e) => updateTicketType(ticket.id, 'name', e.target.value)}
                              className="input w-full"
                              placeholder="Ej: General, VIP, Estudiante"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Precio (RD$) *
                            </label>
                            <input
                              type="number"
                              value={ticket.price}
                              onChange={(e) => updateTicketType(ticket.id, 'price', parseFloat(e.target.value) || 0)}
                              className="input w-full"
                              min="0"
                              step="0.01"
                              placeholder="1500"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Descripción
                          </label>
                          <input
                            type="text"
                            value={ticket.description}
                            onChange={(e) => updateTicketType(ticket.id, 'description', e.target.value)}
                            className="input w-full"
                            placeholder="Descripción del tipo de ticket..."
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Cantidad Total *
                            </label>
                            <input
                              type="number"
                              value={ticket.totalQuantity}
                              onChange={(e) => updateTicketType(ticket.id, 'totalQuantity', parseInt(e.target.value) || 0)}
                              className="input w-full"
                              min="1"
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Máx. por Orden
                            </label>
                            <input
                              type="number"
                              value={ticket.maxQuantityPerOrder}
                              onChange={(e) => updateTicketType(ticket.id, 'maxQuantityPerOrder', parseInt(e.target.value) || 0)}
                              className="input w-full"
                              min="1"
                              placeholder="5"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Revisión del Evento
                </h3>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                        Información Básica
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Título:</strong> {form.title}</div>
                        <div><strong>Categoría:</strong> {categories.find(c => c.id === form.category)?.name}</div>
                        <div><strong>Descripción:</strong> {form.description}</div>
                        {form.tags.length > 0 && (
                          <div>
                            <strong>Tags:</strong> {form.tags.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                        Fecha y Ubicación
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Inicio:</strong> {new Date(form.startDateTime).toLocaleString('es-DO')}</div>
                        <div><strong>Fin:</strong> {new Date(form.endDateTime).toLocaleString('es-DO')}</div>
                        <div><strong>Tipo:</strong> {form.isOnline ? 'Virtual' : 'Presencial'}</div>
                        <div><strong>Lugar:</strong> {form.isOnline ? (form.onlineLink || 'Enlace por confirmar') : form.venue}</div>
                        <div><strong>Capacidad:</strong> {form.maxCapacity} personas</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                      Tipos de Tickets
                    </h4>
                    <div className="space-y-3">
                      {form.ticketTypes.map((ticket, index) => (
                        <div key={ticket.id} className="bg-white dark:bg-gray-600 rounded p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{ticket.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {ticket.description}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">RD$ {ticket.price.toLocaleString()}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {ticket.totalQuantity} disponibles
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => {
                  if (validateStep(currentStep)) {
                    setCurrentStep(prev => prev + 1)
                  } else {
                    alert('Por favor completa todos los campos requeridos')
                  }
                }}
                disabled={!validateStep(currentStep)}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Crear Evento</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}