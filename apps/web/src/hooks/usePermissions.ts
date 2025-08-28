'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { RoleType, Permission, Organization, Team } from '@/types/api'

interface PermissionContext {
  currentOrganization: Organization | null
  currentRole: RoleType | null
  permissions: Permission[]
  teams: Team[]
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
  switchOrganization: (organizationId: string) => void
  isLoading: boolean
}

const PermissionContext = createContext<PermissionContext | undefined>(undefined)

// Definición de permisos por rol
const ROLE_PERMISSIONS: Record<RoleType, Permission[]> = {
  super_admin: [
    'events:create', 'events:edit', 'events:delete', 'events:view', 'events:publish',
    'analytics:view', 'analytics:export',
    'users:invite', 'users:manage',
    'billing:view', 'billing:manage',
    'settings:view', 'settings:manage'
  ],
  organization_admin: [
    'events:create', 'events:edit', 'events:delete', 'events:view', 'events:publish',
    'analytics:view', 'analytics:export',
    'users:invite', 'users:manage',
    'billing:view', 'billing:manage',
    'settings:view', 'settings:manage'
  ],
  organizer: [
    'events:create', 'events:edit', 'events:view', 'events:publish',
    'analytics:view',
    'settings:view'
  ],
  collaborator: [
    'events:view', 'events:edit',
    'analytics:view'
  ],
  viewer: [
    'events:view',
    'analytics:view'
  ]
}

// Esta función se movió al contexto, eliminamos la duplicación

export const usePermissionHook = (userId?: string) => {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [currentRole, setCurrentRole] = useState<RoleType | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      loadUserPermissions(userId)
    }
  }, [userId])

  const loadUserPermissions = async (userId: string) => {
    try {
      setIsLoading(true)
      // TODO: Implementar llamada a API para obtener permisos del usuario
      // Por ahora simulamos datos
      
      const mockOrganization: Organization = {
        id: 'org_1',
        name: 'Mi Organización',
        slug: 'mi-organizacion',
        plan: 'enterprise',
        settings: {
          whiteLabel: true,
          customDomain: true,
          maxUsers: 50,
          maxEvents: 100
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const mockRole: RoleType = 'organization_admin'
      const mockPermissions = ROLE_PERMISSIONS[mockRole]
      const mockTeams: Team[] = [
        {
          id: 'team_1',
          organizationId: 'org_1',
          name: 'Marketing',
          description: 'Equipo de marketing y promoción',
          color: '#3B82F6',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'team_2',
          organizationId: 'org_1',
          name: 'Producción',
          description: 'Equipo de producción de eventos',
          color: '#10B981',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      setCurrentOrganization(mockOrganization)
      setCurrentRole(mockRole)
      setPermissions(mockPermissions)
      setTeams(mockTeams)
    } catch (error) {
      console.error('Error loading user permissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission)
  }

  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(permission => permissions.includes(permission))
  }

  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(permission => permissions.includes(permission))
  }

  const switchOrganization = async (organizationId: string) => {
    try {
      setIsLoading(true)
      // TODO: Implementar llamada a API para cambiar organización
      // Por ahora solo actualizamos el estado local
      console.log('Switching to organization:', organizationId)
    } catch (error) {
      console.error('Error switching organization:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    currentOrganization,
    currentRole,
    permissions,
    teams,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    switchOrganization,
    isLoading
  }
}

// Funciones de utilidad para roles (movidas al contexto)