'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Plus,
  Filter,
  Download,
  MoreVertical,
  UserPlus,
  Settings,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OrganizationSelector } from '@/components/corporate/OrganizationSelector'
import { PermissionGuard, usePermissionCheck } from '@/contexts/PermissionContext'
import { BusinessAccountGuard } from '@/components/auth/BusinessAccountGuard'

// Mock data para el dashboard
const mockStats = {
  totalEvents: 24,
  activeEvents: 8,
  totalAttendees: 3420,
  revenue: 125000,
  teamMembers: 12,
  pendingApprovals: 3
}

const mockRecentEvents = [
  {
    id: '1',
    title: 'Conferencia Tech RD 2024',
    date: '2024-02-15',
    status: 'active',
    attendees: 450,
    revenue: 25000,
    organizer: 'María González',
    team: 'Marketing'
  },
  {
    id: '2',
    title: 'Workshop de Emprendimiento',
    date: '2024-02-20',
    status: 'draft',
    attendees: 120,
    revenue: 8500,
    organizer: 'Carlos Martínez',
    team: 'Producción'
  },
  {
    id: '3',
    title: 'Networking Night',
    date: '2024-02-25',
    status: 'pending',
    attendees: 200,
    revenue: 12000,
    organizer: 'Ana Rodríguez',
    team: 'Marketing'
  }
]

const mockTeamActivity = [
  {
    id: '1',
    user: 'María González',
    action: 'Creó el evento',
    target: 'Conferencia Tech RD 2024',
    timestamp: '2024-02-01T10:30:00Z',
    team: 'Marketing'
  },
  {
    id: '2',
    user: 'Carlos Martínez',
    action: 'Actualizó el evento',
    target: 'Workshop de Emprendimiento',
    timestamp: '2024-02-01T09:15:00Z',
    team: 'Producción'
  },
  {
    id: '3',
    user: 'Ana Rodríguez',
    action: 'Invitó a un colaborador',
    target: 'Pedro Santos',
    timestamp: '2024-02-01T08:45:00Z',
    team: 'Marketing'
  }
]

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }
  return colors[status] || colors.draft
}

const getStatusIcon = (status: string) => {
  const icons = {
    active: CheckCircle,
    draft: Clock,
    pending: AlertCircle,
    cancelled: AlertCircle
  }
  return icons[status] || Clock
}

export default function CorporateDashboardPage() {
  const { 
    canCreateEvents, 
    canManageUsers, 
    canViewAnalytics,
    canManageEvents,
    isAdmin
  } = usePermissionCheck()

  const [timeRange, setTimeRange] = useState('30d')

  return (
    <BusinessAccountGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <main className="pt-16">
        {/* Dashboard Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Organization Info */}
              <div className="flex items-center space-x-4">
                <OrganizationSelector />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                <PermissionGuard requiredPermission="analytics:export">
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Exportar</span>
                  </button>
                </PermissionGuard>

                <PermissionGuard requiredPermission="users:invite">
                  <button className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    <UserPlus className="w-4 h-4" />
                    <span>Invitar Usuario</span>
                  </button>
                </PermissionGuard>

                <PermissionGuard requiredPermission="events:create">
                  <Link 
                    href="/crear-evento"
                    className="flex items-center space-x-2 px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear Evento</span>
                  </Link>
                </PermissionGuard>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <PermissionGuard requiredPermission="analytics:view">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Eventos Totales
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {mockStats.totalEvents}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs mes anterior</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Asistentes
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {mockStats.totalAttendees.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+8%</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs mes anterior</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Ingresos
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      RD$ {mockStats.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+15%</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs mes anterior</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Equipo
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {mockStats.teamMembers}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-orange-600 font-medium">{mockStats.pendingApprovals} pendientes</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">por aprobar</span>
                </div>
              </motion.div>
            </div>
          </PermissionGuard>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Events */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Eventos Recientes
                    </h2>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Filter className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {mockRecentEvents.map((event) => {
                    const StatusIcon = getStatusIcon(event.status)
                    return (
                      <div key={event.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {event.title}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {event.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                              <span>{new Date(event.date).toLocaleDateString('es-DO')}</span>
                              <span>{event.attendees} asistentes</span>
                              <span>RD$ {event.revenue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-600 dark:text-gray-300">
                                Por {event.organizer}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-blue-600 dark:text-blue-400">
                                Equipo {event.team}
                              </span>
                            </div>
                          </div>
                          
                          <PermissionGuard requiredPermission="events:edit">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </PermissionGuard>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    href="/eventos"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Ver todos los eventos →
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Team Activity */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Actividad del Equipo
                  </h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {mockTeamActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white">
                            <span className="font-medium">{activity.user}</span>
                            {' '}{activity.action}{' '}
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(activity.timestamp).toLocaleTimeString('es-DO', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                              {activity.team}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Acciones Rápidas
                  </h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-3">
                    <PermissionGuard requiredPermission="analytics:view">
                      <button className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span>Ver Analytics</span>
                      </button>
                    </PermissionGuard>

                    <PermissionGuard requiredPermission="users:manage">
                      <button className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span>Gestionar Equipo</span>
                      </button>
                    </PermissionGuard>

                    <PermissionGuard requiredPermission="settings:view">
                      <button className="flex items-center space-x-3 w-full p-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span>Configuración</span>
                      </button>
                    </PermissionGuard>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </BusinessAccountGuard>
  )
}