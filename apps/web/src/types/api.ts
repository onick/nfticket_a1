export interface TicketType {
  _id: string
  name: string
  description: string
  price: number
  currency: string
  totalQuantity: number
  availableQuantity: number
  maxQuantityPerOrder: number
}

export interface Organizer {
  id: string
  firstName: string
  lastName: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string
  startDateTime: string
  endDateTime: string
  timezone: string
  venue: string
  isOnline: boolean
  category: string
  tags: string[]
  coverImage: string
  images: string[]
  ticketTypes: TicketType[]
  maxCapacity: number
  status: string
  organizerId: Organizer
  viewCount: number
  shareCount: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface EventsResponse {
  success: boolean
  data: {
    events: Event[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Roles y permisos del sistema multi-usuario
export type RoleType = 'super_admin' | 'organization_admin' | 'organizer' | 'collaborator' | 'viewer'
export type Permission = 
  | 'events:create' 
  | 'events:edit' 
  | 'events:delete' 
  | 'events:view'
  | 'events:publish'
  | 'analytics:view'
  | 'analytics:export'
  | 'users:invite'
  | 'users:manage'
  | 'billing:view'
  | 'billing:manage'
  | 'settings:view'
  | 'settings:manage'

export interface Organization {
  id: string
  name: string
  slug: string
  domain?: string // Para white label
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  plan: 'free' | 'professional' | 'enterprise' | 'custom'
  settings: {
    whiteLabel: boolean
    customDomain: boolean
    maxUsers: number
    maxEvents: number
  }
  createdAt: string
  updatedAt: string
}

export interface Team {
  id: string
  organizationId: string
  name: string
  description?: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface UserRole {
  id: string
  userId: string
  organizationId: string
  teamId?: string
  role: RoleType
  permissions: Permission[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type AccountType = 'individual' | 'business'

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  isEmailVerified: boolean
  
  // Tipo de cuenta
  accountType: AccountType
  
  // Campos específicos para cuentas empresariales
  companyInfo?: {
    name: string
    rnc?: string // Registro Nacional de Contribuyentes (RD)
    industry?: string
    website?: string
    size: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'
  }
  
  // Nuevos campos para sistema multi-usuario
  currentOrganizationId?: string
  organizations: {
    organization: Organization
    role: RoleType
    permissions: Permission[]
    teams: Team[]
  }[]
  
  preferences: {
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    marketing: {
      email: boolean
      sms: boolean
    }
  }
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: AuthUser
    tokens: {
      access: string
      refresh: string
    }
  }
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}