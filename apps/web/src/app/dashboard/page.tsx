'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User,
  Ticket, 
  CreditCard, 
  Calendar, 
  MapPin,
  Clock,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalOrders: number
  totalTickets: number
  upcomingEvents: number
  completedOrders: number
}

interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
  totalAmount: number
  currency: string
  createdAt: string
  items: Array<{
    eventId: string
    eventTitle: string
    ticketTypeName: string
    quantity: number
    price: number
  }>
}

interface UserTicket {
  id: string
  ticketNumber: string
  eventTitle: string
  eventId: string
  ticketTypeName: string
  attendeeName: string
  isUsed: boolean
  orderNumber: string
  orderStatus: string
  eventStartDate: string
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'tickets'>('overview')
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalTickets: 0,
    upcomingEvents: 0,
    completedOrders: 0
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch orders and tickets in parallel
        const [ordersResponse, ticketsResponse] = await Promise.all([
          apiClient.getUserOrders({ limit: 50 }),
          apiClient.getUserTickets({ limit: 50 })
        ])

        if (ordersResponse.success && ordersResponse.data) {
          setOrders(ordersResponse.data.orders)
        }

        if (ticketsResponse.success && ticketsResponse.data) {
          setTickets(ticketsResponse.data.tickets)
        }

        // Calculate stats
        const totalOrders = ordersResponse.data?.orders?.length || 0
        const totalTickets = ticketsResponse.data?.tickets?.length || 0
        const completedOrders = ordersResponse.data?.orders?.filter(o => o.status === 'COMPLETED').length || 0
        const upcomingEvents = ticketsResponse.data?.tickets?.filter(t => 
          new Date(t.eventStartDate) > new Date()
        ).length || 0

        setStats({
          totalOrders,
          totalTickets,
          upcomingEvents,
          completedOrders
        })

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [isAuthenticated])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'CANCELLED':
      case 'REFUNDED':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'PENDING':
        return <AlertCircle className="w-4 h-4" />
      case 'CANCELLED':
      case 'REFUNDED':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number, currency = 'DOP') => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: currency === 'DOP' ? 'USD' : currency,
      minimumFractionDigits: 0
    }).format(amount).replace('US$', 'RD$')
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-3 mb-2">
              <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Mi Dashboard
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Bienvenido de vuelta, {user?.firstName}. Aquí puedes ver tus tickets, órdenes y estadísticas.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Órdenes
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalOrders}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Tickets
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalTickets}
                  </p>
                </div>
                <Ticket className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Eventos Próximos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.upcomingEvents}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Órdenes Completadas
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.completedOrders}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'overview', label: 'Resumen', icon: User },
                  { key: 'orders', label: 'Mis Órdenes', icon: CreditCard },
                  { key: 'tickets', label: 'Mis Tickets', icon: Ticket }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === key
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Órdenes Recientes
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                    >
                      Ver todas
                    </button>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(order.totalAmount, order.currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No tienes órdenes aún
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Próximos Eventos
                    </h3>
                    <button
                      onClick={() => setActiveTab('tickets')}
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                    >
                      Ver todos
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tickets
                      .filter(ticket => new Date(ticket.eventStartDate) > new Date())
                      .slice(0, 3)
                      .map((ticket) => (
                        <div
                          key={ticket.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {ticket.eventTitle}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {ticket.ticketTypeName} • {formatDate(ticket.eventStartDate)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              ticket.isUsed 
                                ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                            }`}>
                              {ticket.isUsed ? 'Usado' : 'Válido'}
                            </span>
                            <Link
                              href={`/tickets/${ticket.id}`}
                              className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    {tickets.filter(ticket => new Date(ticket.eventStartDate) > new Date()).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No tienes eventos próximos
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Mis Órdenes
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span>{order.status}</span>
                          </span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(order.totalAmount, order.currency)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">
                              {item.eventTitle} - {item.ticketTypeName}
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {item.quantity}x {formatCurrency(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="p-12 text-center">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No tienes órdenes
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Cuando compres tickets, aparecerán aquí.
                      </p>
                      <Link href="/" className="btn-primary">
                        Explorar Eventos
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Mis Tickets
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white mb-1">
                            {ticket.eventTitle}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <div className="flex items-center space-x-2">
                              <Ticket className="w-4 h-4" />
                              <span>{ticket.ticketTypeName} - {ticket.ticketNumber}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(ticket.eventStartDate)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{ticket.attendeeName}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            ticket.isUsed 
                              ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {ticket.isUsed ? 'Usado' : 'Válido'}
                          </span>
                          <Link
                            href={`/tickets/${ticket.id}`}
                            className="btn-secondary text-sm"
                          >
                            Ver Ticket
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  {tickets.length === 0 && (
                    <div className="p-12 text-center">
                      <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No tienes tickets
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Cuando compres tickets para eventos, aparecerán aquí.
                      </p>
                      <Link href="/" className="btn-primary">
                        Explorar Eventos
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}