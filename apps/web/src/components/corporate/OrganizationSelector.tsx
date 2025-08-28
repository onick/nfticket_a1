'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  ChevronDown, 
  Users, 
  Settings, 
  Crown,
  Shield,
  Eye,
  UserCheck,
  Zap
} from 'lucide-react'
import { usePermissions } from '@/contexts/PermissionContext'
import { RoleType } from '@/types/api'

const getRoleIcon = (role: RoleType) => {
  const icons = {
    super_admin: Crown,
    organization_admin: Shield,
    organizer: Zap,
    collaborator: UserCheck,
    viewer: Eye
  }
  return icons[role]
}

const getRoleColor = (role: RoleType) => {
  const colors = {
    super_admin: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400',
    organization_admin: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
    organizer: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400',
    collaborator: 'text-violet-600 bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400',
    viewer: 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400'
  }
  return colors[role]
}

const getRoleDisplayName = (role: RoleType) => {
  const names = {
    super_admin: 'Super Admin',
    organization_admin: 'Administrador',
    organizer: 'Organizador',
    collaborator: 'Colaborador',
    viewer: 'Visualizador'
  }
  return names[role]
}

export const OrganizationSelector = () => {
  const { 
    currentOrganization, 
    currentRole, 
    teams, 
    switchOrganization,
    isLoading 
  } = usePermissions()
  
  const [isOpen, setIsOpen] = useState(false)

  if (!currentOrganization || !currentRole) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Building2 className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Sin organización</span>
      </div>
    )
  }

  const RoleIcon = getRoleIcon(currentRole)
  const roleColorClass = getRoleColor(currentRole)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 min-w-[280px]"
      >
        {/* Organization Logo/Icon */}
        <div className="flex-shrink-0">
          {currentOrganization.logo ? (
            <img 
              src={currentOrganization.logo} 
              alt={currentOrganization.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {currentOrganization.name}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleColorClass}`}>
              <RoleIcon className="w-3 h-3 mr-1" />
              {getRoleDisplayName(currentRole)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              Plan {currentOrganization.plan}
            </span>
            {teams.length > 0 && (
              <>
                <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {teams.length} equipo{teams.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4">
              {/* Current Organization Info */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                  Organización Actual
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Usuarios</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentOrganization.settings.maxUsers} máximo
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Eventos</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentOrganization.settings.maxEvents} por mes
                    </span>
                  </div>
                </div>
              </div>

              {/* Teams */}
              {teams.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                    Mis Equipos
                  </h3>
                  <div className="space-y-1">
                    {teams.map((team) => (
                      <div key={team.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: team.color || '#6B7280' }}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {team.name}
                          </span>
                          {team.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {team.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-1">
                <button className="w-full flex items-center space-x-2 p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Configuración</span>
                </button>
                
                <button className="w-full flex items-center space-x-2 p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Users className="w-4 h-4" />
                  <span>Gestionar Equipos</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Componente compacto para la barra superior
export const OrganizationSelectorCompact = () => {
  const { currentOrganization, currentRole } = usePermissions()

  if (!currentOrganization || !currentRole) {
    return null
  }

  const RoleIcon = getRoleIcon(currentRole)
  const roleColorClass = getRoleColor(currentRole)

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-shrink-0">
        {currentOrganization.logo ? (
          <img 
            src={currentOrganization.logo} 
            alt={currentOrganization.name}
            className="w-6 h-6 rounded object-cover"
          />
        ) : (
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <Building2 className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {currentOrganization.name}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleColorClass}`}>
          <RoleIcon className="w-3 h-3 mr-1" />
          {getRoleDisplayName(currentRole)}
        </span>
      </div>
    </div>
  )
}