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

export interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  isEmailVerified: boolean
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