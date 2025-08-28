'use client'

import { createContext, useContext, ReactNode } from 'react'
import { usePermissionHook } from '@/hooks/usePermissions'
import { RoleType, Permission, Organization, Team } from '@/types/api'

interface PermissionContextType {
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

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

interface PermissionProviderProps {
  children: ReactNode
  userId?: string
}

export const PermissionProvider = ({ children, userId }: PermissionProviderProps) => {
  const permissionData = usePermissionHook(userId)

  return (
    <PermissionContext.Provider value={permissionData}>
      {children}
    </PermissionContext.Provider>
  )
}

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider')
  }
  return context
}

// Componente para proteger rutas basado en permisos
interface PermissionGuardProps {
  children: ReactNode
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAll?: boolean
  fallback?: ReactNode
  role?: RoleType[]
}

export const PermissionGuard = ({ 
  children, 
  requiredPermission,
  requiredPermissions = [],
  requireAll = false,
  fallback = null,
  role = []
}: PermissionGuardProps) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, currentRole } = usePermissions()

  // Verificar rol si se especifica
  if (role.length > 0 && currentRole && !role.includes(currentRole)) {
    return <>{fallback}</>
  }

  // Verificar permiso individual
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>
  }

  // Verificar múltiples permisos
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions)
    
    if (!hasAccess) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

// Hook para componentes que necesitan verificar permisos
export const usePermissionCheck = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, currentRole } = usePermissions()

  return {
    // Permisos específicos
    canCreateEvents: hasPermission('events:create'),
    canEditEvents: hasPermission('events:edit'),
    canDeleteEvents: hasPermission('events:delete'),
    canPublishEvents: hasPermission('events:publish'),
    canViewAnalytics: hasPermission('analytics:view'),
    canExportAnalytics: hasPermission('analytics:export'),
    canInviteUsers: hasPermission('users:invite'),
    canManageUsers: hasPermission('users:manage'),
    canViewBilling: hasPermission('billing:view'),
    canManageBilling: hasPermission('billing:manage'),
    canViewSettings: hasPermission('settings:view'),
    canManageSettings: hasPermission('settings:manage'),
    
    // Verificaciones combinadas
    canManageEvents: hasAnyPermission(['events:create', 'events:edit', 'events:delete']),
    isAdmin: hasAnyPermission(['users:manage', 'settings:manage']) || currentRole === 'organization_admin',
    isSuperAdmin: currentRole === 'super_admin',
    hasAnalyticsAccess: hasAnyPermission(['analytics:view', 'analytics:export']),
    
    // Métodos para verificaciones dinámicas
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    currentRole
  }
}