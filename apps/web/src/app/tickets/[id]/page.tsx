'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  User,
  Ticket,
  Download,
  Share2,
  QrCode,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

interface TicketDetail {
  id: string
  ticketNumber: string
  eventTitle: string
  eventId: string
  ticketTypeName: string
  attendeeName: string
  attendeeEmail: string
  isUsed: boolean
  usedAt?: string
  qrCode: string
  orderNumber: string
  orderStatus: string
  eventStartDate: string
  eventEndDate?: string
  eventVenue?: string
  eventDescription?: string
}

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const ticketId = params.id as string

  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (!ticketId || !isAuthenticated) return

    const fetchTicket = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get ticket from tickets list (mock implementation)
        const response = await apiClient.getUserTickets({ limit: 100 })
        
        if (response.success && response.data) {
          const foundTicket = response.data.tickets.find(t => t.id === ticketId)
          
          if (foundTicket) {
            // Get additional event details
            const eventResponse = await apiClient.getEvent(foundTicket.eventId)
            
            const ticketWithEventDetails = {
              ...foundTicket,
              eventEndDate: eventResponse.data?.endDateTime,
              eventVenue: eventResponse.data?.venue,
              eventDescription: eventResponse.data?.description
            }
            
            setTicket(ticketWithEventDetails)
          } else {
            setError('Ticket no encontrado')
          }
        } else {
          setError('Error al cargar el ticket')
        }
      } catch (err) {
        console.error('Error fetching ticket:', err)
        setError('Error al cargar el ticket')
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [ticketId, isAuthenticated])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('es-DO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('es-DO', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const handleDownload = () => {
    if (!ticket) return
    
    // Create a simple ticket download (in a real app, this would generate a PDF)
    const ticketData = `
      TICKET TIX 2.0
      ===============
      
      Evento: ${ticket.eventTitle}
      Ticket: ${ticket.ticketNumber}
      Tipo: ${ticket.ticketTypeName}
      Titular: ${ticket.attendeeName}
      
      Fecha: ${formatDate(ticket.eventStartDate).date}
      Hora: ${formatDate(ticket.eventStartDate).time}
      Lugar: ${ticket.eventVenue || 'Por confirmar'}
      
      Estado: ${ticket.isUsed ? 'USADO' : 'VÁLIDO'}
      
      Orden: ${ticket.orderNumber}
    `
    
    const blob = new Blob([ticketData], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ticket-${ticket.ticketNumber}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleShare = async () => {
    if (!ticket) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket para ${ticket.eventTitle}`,
          text: `Mi ticket para ${ticket.eventTitle}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  if (authLoading || loading) {
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

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Ticket no encontrado'}
            </h1>
            <Link href="/dashboard" className="btn-primary">
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const eventDate = formatDate(ticket.eventStartDate)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Link 
            href="/dashboard" 
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Dashboard</span>
          </Link>

          {/* Ticket Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8"
          >
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Ticket className="w-6 h-6" />
                    <span className="text-sm font-medium opacity-90">TIX 2.0</span>
                  </div>
                  <h1 className="text-2xl font-bold">{ticket.eventTitle}</h1>
                  <p className="opacity-90 text-lg">{ticket.ticketTypeName}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                    ticket.isUsed 
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {ticket.isUsed ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>USADO</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>VÁLIDO</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Ticket Info */}
                <div className="space-y-6">
                  {/* Event Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Detalles del Evento
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {eventDate.date}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {eventDate.time}
                          </div>
                        </div>
                      </div>

                      {ticket.eventVenue && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          <div className="font-medium text-gray-900 dark:text-white">
                            {ticket.eventVenue}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {ticket.attendeeName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {ticket.attendeeEmail}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Información del Ticket
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Número de Ticket:</span>
                        <span className="font-mono text-gray-900 dark:text-white">{ticket.ticketNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Orden:</span>
                        <span className="font-mono text-gray-900 dark:text-white">{ticket.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Estado de la Orden:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ticket.orderStatus === 'COMPLETED' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {ticket.orderStatus}
                        </span>
                      </div>
                      {ticket.isUsed && ticket.usedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Usado en:</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatDate(ticket.usedAt).date}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                      Código QR
                    </h3>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200 dark:border-gray-600">
                      {ticket.qrCode ? (
                        <img 
                          src={ticket.qrCode} 
                          alt="QR Code" 
                          className="w-48 h-48 object-contain"
                        />
                      ) : (
                        <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-3">
                      Presenta este código QR en la entrada del evento
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDownload}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="btn-ghost flex items-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Compartir</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Ticket emitido por TIX 2.0
                </span>
                <Link
                  href={`/eventos/${ticket.eventId}`}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                >
                  Ver detalles del evento
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
          >
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Instrucciones Importantes
            </h4>
            <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
              <li>• Llega al evento con al menos 30 minutos de anticipación</li>
              <li>• Presenta tu ticket en formato digital o impreso</li>
              <li>• Trae una identificación válida que coincida con el nombre del ticket</li>
              <li>• Este ticket es personal e intransferible</li>
              <li>• En caso de problemas, contacta al organizador del evento</li>
            </ul>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}