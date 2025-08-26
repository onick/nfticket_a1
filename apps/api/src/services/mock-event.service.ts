import { redisUtils } from '../utils/redis'

export interface CreateEventInput {
  title: string
  description: string
  startDateTime: Date
  endDateTime?: Date
  venue?: string
  isOnline?: boolean
  onlineUrl?: string
  categoryId: string
  coverImage?: string
  maxCapacity?: number
  ticketTypes: TicketTypeInput[]
}

export interface TicketTypeInput {
  name: string
  description?: string
  price: number
  totalQuantity?: number
  maxQuantityPerOrder?: number
}

export interface MockEvent {
  id: string
  slug: string
  title: string
  description: string
  startDateTime: Date
  endDateTime?: Date
  venue?: string
  isOnline: boolean
  onlineUrl?: string
  categoryId: string
  coverImage?: string
  images: string[]
  maxCapacity?: number
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED'
  organizerId: string
  viewCount: number
  shareCount: number
  createdAt: Date
  updatedAt: Date
}

export interface MockTicketType {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  totalQuantity?: number
  availableQuantity?: number
  maxQuantityPerOrder: number
  eventId: string
  createdAt: Date
  updatedAt: Date
}

// In-memory storage for development
const events: Map<string, MockEvent> = new Map()
const ticketTypes: Map<string, MockTicketType> = new Map()
const categories: Map<string, any> = new Map()
let eventIdCounter = 1
let ticketTypeIdCounter = 1

// Initialize some mock categories
const mockCategories = [
  { id: 'cat_1', slug: 'music', name: 'Música', icon: '🎵' },
  { id: 'cat_2', slug: 'sports', name: 'Deportes', icon: '⚽' },
  { id: 'cat_3', slug: 'technology', name: 'Tecnología', icon: '💻' },
  { id: 'cat_4', slug: 'business', name: 'Negocios', icon: '💼' },
  { id: 'cat_5', slug: 'arts', name: 'Arte', icon: '🎨' }
]

mockCategories.forEach(cat => categories.set(cat.id, cat))

export class MockEventService {
  
  // Helper to generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      + `-${Date.now()}`
  }

  async createEvent(input: CreateEventInput, organizerId: string): Promise<MockEvent> {
    const eventId = `event_${eventIdCounter++}`
    const now = new Date()
    
    const event: MockEvent = {
      id: eventId,
      slug: this.generateSlug(input.title),
      title: input.title,
      description: input.description,
      startDateTime: input.startDateTime,
      endDateTime: input.endDateTime,
      venue: input.venue,
      isOnline: input.isOnline || false,
      onlineUrl: input.onlineUrl,
      categoryId: input.categoryId,
      coverImage: input.coverImage,
      images: input.coverImage ? [input.coverImage] : [],
      maxCapacity: input.maxCapacity,
      status: 'DRAFT',
      organizerId,
      viewCount: 0,
      shareCount: 0,
      createdAt: now,
      updatedAt: now
    }

    events.set(eventId, event)

    // Create ticket types
    for (const ticketInput of input.ticketTypes) {
      const ticketTypeId = `ticket_type_${ticketTypeIdCounter++}`
      const ticketType: MockTicketType = {
        id: ticketTypeId,
        name: ticketInput.name,
        description: ticketInput.description,
        price: ticketInput.price,
        currency: 'DOP',
        totalQuantity: ticketInput.totalQuantity,
        availableQuantity: ticketInput.totalQuantity,
        maxQuantityPerOrder: ticketInput.maxQuantityPerOrder || 10,
        eventId: eventId,
        createdAt: now,
        updatedAt: now
      }
      ticketTypes.set(ticketTypeId, ticketType)
    }

    // Cache in Redis
    await redisUtils.setJsonEx(`event:${eventId}`, event, 3600) // 1 hour

    return event
  }

  async getEvents(page = 1, limit = 10, category?: string, search?: string): Promise<{
    events: MockEvent[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    let allEvents = Array.from(events.values())
      .filter(event => event.status === 'PUBLISHED')
      .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())

    // Filter by category
    if (category) {
      allEvents = allEvents.filter(event => event.categoryId === category)
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      allEvents = allEvents.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
      )
    }

    const total = allEvents.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedEvents = allEvents.slice(startIndex, endIndex)

    return {
      events: paginatedEvents,
      total,
      page,
      limit,
      totalPages
    }
  }

  async getEventById(id: string): Promise<MockEvent | null> {
    // Try from cache first
    const cached = await redisUtils.getJson(`event:${id}`)
    if (cached) {
      return cached
    }

    const event = events.get(id)
    if (event) {
      // Cache it
      await redisUtils.setJsonEx(`event:${id}`, event, 3600)
      
      // Increment view count
      event.viewCount++
      events.set(id, event)
    }

    return event || null
  }

  async getEventBySlug(slug: string): Promise<MockEvent | null> {
    const event = Array.from(events.values()).find(e => e.slug === slug)
    if (event) {
      // Increment view count
      event.viewCount++
      events.set(event.id, event)
      
      // Cache it
      await redisUtils.setJsonEx(`event:${event.id}`, event, 3600)
    }
    return event || null
  }

  async updateEvent(id: string, updates: Partial<CreateEventInput>, organizerId: string): Promise<MockEvent | null> {
    const event = events.get(id)
    if (!event || event.organizerId !== organizerId) {
      return null
    }

    const updatedEvent = {
      ...event,
      ...updates,
      updatedAt: new Date()
    }

    if (updates.title) {
      updatedEvent.slug = this.generateSlug(updates.title)
    }

    events.set(id, updatedEvent)

    // Update cache
    await redisUtils.setJsonEx(`event:${id}`, updatedEvent, 3600)

    return updatedEvent
  }

  async deleteEvent(id: string, organizerId: string): Promise<boolean> {
    const event = events.get(id)
    if (!event || event.organizerId !== organizerId) {
      return false
    }

    events.delete(id)
    
    // Remove from cache
    await redisUtils.del(`event:${id}`)
    
    // Delete associated ticket types
    const eventTicketTypes = Array.from(ticketTypes.values())
      .filter(tt => tt.eventId === id)
    
    eventTicketTypes.forEach(tt => ticketTypes.delete(tt.id))

    return true
  }

  async publishEvent(id: string, organizerId: string): Promise<MockEvent | null> {
    const event = events.get(id)
    if (!event || event.organizerId !== organizerId) {
      return null
    }

    event.status = 'PUBLISHED'
    event.updatedAt = new Date()
    events.set(id, event)

    // Update cache
    await redisUtils.setJsonEx(`event:${id}`, event, 3600)

    return event
  }

  async getEventsByOrganizer(organizerId: string): Promise<MockEvent[]> {
    return Array.from(events.values())
      .filter(event => event.organizerId === organizerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getTicketTypesByEvent(eventId: string): Promise<MockTicketType[]> {
    return Array.from(ticketTypes.values())
      .filter(tt => tt.eventId === eventId)
      .sort((a, b) => a.price - b.price)
  }

  async getCategories(): Promise<any[]> {
    return Array.from(categories.values())
  }

  // Add some sample events for testing
  async initializeSampleData(): Promise<void> {
    if (events.size > 0) return // Already initialized

    const sampleEvents = [
      {
        title: "Concierto de Merengue en Vivo",
        description: "Una noche increíble con los mejores artistas de merengue dominicano",
        startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        venue: "Teatro Nacional Eduardo Brito",
        categoryId: "cat_1",
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        maxCapacity: 2000,
        ticketTypes: [
          { name: "General", price: 1500, totalQuantity: 1500 },
          { name: "VIP", price: 3000, totalQuantity: 500 }
        ]
      },
      {
        title: "Conferencia Tech RD 2025",
        description: "El evento tecnológico más importante de República Dominicana",
        startDateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        isOnline: true,
        onlineUrl: "https://zoom.us/techrd2025",
        categoryId: "cat_3",
        coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        maxCapacity: 1000,
        ticketTypes: [
          { name: "Acceso Completo", price: 2500, totalQuantity: 800 },
          { name: "Estudiante", price: 1000, totalQuantity: 200 }
        ]
      }
    ]

    for (const eventData of sampleEvents) {
      await this.createEvent(eventData as CreateEventInput, "user_1")
      // Auto-publish sample events
      const eventId = `event_${eventIdCounter - 1}`
      await this.publishEvent(eventId, "user_1")
    }
  }
}