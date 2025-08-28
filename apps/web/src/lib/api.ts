const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  preferredLanguage: string
  timezone: string
  marketingOptIn: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    // Try to get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('nfticket_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('nfticket_token', token)
      } else {
        localStorage.removeItem('nfticket_token')
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}/api/v1${endpoint}`
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      defaultHeaders.Authorization = `Bearer ${this.token}`
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Request failed')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // Auth methods
  async login(credentials: LoginData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me')
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    })
  }

  // Events methods
  async getEvents(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    upcoming?: boolean
  }): Promise<ApiResponse<{
    events: any[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.upcoming) searchParams.set('upcoming', 'true')

    const query = searchParams.toString()
    return this.request(`/events${query ? `?${query}` : ''}`)
  }

  async getFeaturedEvents(limit = 6): Promise<ApiResponse<any[]>> {
    return this.request(`/events/featured?limit=${limit}`)
  }

  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.request('/categories')
  }

  async getEvent(identifier: string): Promise<ApiResponse<any>> {
    return this.request(`/events/${identifier}`)
  }

  async createEvent(eventData: any): Promise<ApiResponse<any>> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    })
  }

  async updateEvent(id: string, eventData: any): Promise<ApiResponse<any>> {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    })
  }

  async publishEvent(id: string): Promise<ApiResponse<any>> {
    return this.request(`/events/${id}/publish`, {
      method: 'PATCH',
    })
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    return this.request(`/events/${id}`, {
      method: 'DELETE',
    })
  }

  async getMyEvents(params?: {
    page?: number
    limit?: number
  }): Promise<ApiResponse<{
    events: any[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const query = searchParams.toString()
    return this.request(`/events/my/events${query ? `?${query}` : ''}`)
  }

  async getEventStats(): Promise<ApiResponse<any>> {
    return this.request('/events/my/stats')
  }

  // Orders methods
  async createOrder(orderData: {
    items: any[]
    attendeeInfo: {
      firstName: string
      lastName: string
      email: string
      phone?: string
    }
    paymentMethod: string
  }): Promise<ApiResponse<any>> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async createCheckoutSession(orderId: string): Promise<ApiResponse<{
    sessionId: string
    url: string
  }>> {
    return this.request(`/orders/${orderId}/checkout`, {
      method: 'POST',
    })
  }

  async confirmPayment(sessionId: string): Promise<ApiResponse<any>> {
    return this.request('/orders/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    })
  }

  async getOrder(orderId: string): Promise<ApiResponse<any>> {
    return this.request(`/orders/${orderId}`)
  }

  async getUserOrders(params?: {
    page?: number
    limit?: number
  }): Promise<ApiResponse<{
    orders: any[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const query = searchParams.toString()
    return this.request(`/orders${query ? `?${query}` : ''}`)
  }

  async cancelOrder(orderId: string): Promise<ApiResponse<any>> {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'PATCH',
    })
  }

  // Tickets methods
  async getUserTickets(params?: {
    eventId?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{
    tickets: any[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>> {
    const searchParams = new URLSearchParams()
    if (params?.eventId) searchParams.set('eventId', params.eventId)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const query = searchParams.toString()
    return this.request(`/tickets${query ? `?${query}` : ''}`)
  }

  async getTicket(ticketId: string): Promise<ApiResponse<any>> {
    return this.request(`/tickets/${ticketId}`)
  }

  async validateTicket(data: {
    ticketNumber?: string
    qrCode?: string
    eventId?: string
  }): Promise<ApiResponse<any>> {
    return this.request('/tickets/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

// Singleton instance
export const apiClient = new ApiClient()