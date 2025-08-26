import { Event, IEvent, ITicketType } from '../models/Event'
import { redisUtils } from '../utils/redis'

export interface CreateEventInput {
  title: string
  description: string
  longDescription?: string
  startDateTime: Date
  endDateTime?: Date
  venue?: string
  isOnline?: boolean
  onlineUrl?: string
  category: string
  tags?: string[]
  coverImage?: string
  images?: string[]
  maxCapacity?: number
  ticketTypes: TicketTypeInput[]
}

export interface TicketTypeInput {
  name: string
  description?: string
  price: number
  totalQuantity?: number
  maxQuantityPerOrder?: number
  salesStartAt?: Date
  salesEndAt?: Date
}

export class EventService {
  
  // Helper to generate slug from title
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
      + `-${Date.now()}`
  }

  async createEvent(input: CreateEventInput, organizerId: string): Promise<IEvent> {
    const ticketTypes: ITicketType[] = input.ticketTypes.map(tt => ({
      ...tt,
      currency: 'DOP',
      availableQuantity: tt.totalQuantity,
      maxQuantityPerOrder: tt.maxQuantityPerOrder || 10
    }))

    const event = new Event({
      ...input,
      slug: this.generateSlug(input.title),
      organizerId,
      ticketTypes,
      isOnline: input.isOnline || false,
      tags: input.tags || [],
      images: input.images || (input.coverImage ? [input.coverImage] : []),
      viewCount: 0,
      shareCount: 0
    })

    await event.save()

    // Cache in Redis
    await redisUtils.setJsonEx(`event:${event.id}`, event.toJSON(), 3600)

    return event
  }

  async getEvents(page = 1, limit = 10, filters: {
    category?: string
    search?: string
    status?: string
    upcoming?: boolean
  } = {}): Promise<{
    events: IEvent[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const query: any = {}

    // Filter by status (default to published)
    query.status = filters.status || 'PUBLISHED'

    // Filter by category
    if (filters.category) {
      query.category = filters.category
    }

    // Filter upcoming events
    if (filters.upcoming) {
      query.startDateTime = { $gte: new Date() }
    }

    // Build search query
    let events
    if (filters.search) {
      events = Event.find({
        ...query,
        $text: { $search: filters.search }
      })
    } else {
      events = Event.find(query)
    }

    // Count total documents
    const total = await Event.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Execute paginated query
    const result = await events
      .populate('organizerId', 'firstName lastName avatar')
      .sort({ startDateTime: 1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return {
      events: result,
      total,
      page,
      limit,
      totalPages
    }
  }

  async getEventById(id: string): Promise<IEvent | null> {
    // Try from cache first
    const cached = await redisUtils.getJson(`event:${id}`)
    if (cached) {
      return cached
    }

    const event = await Event.findById(id)
      .populate('organizerId', 'firstName lastName avatar email')

    if (event) {
      // Increment view count
      await Event.findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
      
      // Cache it
      await redisUtils.setJsonEx(`event:${id}`, event.toJSON(), 3600)
    }

    return event
  }

  async getEventBySlug(slug: string): Promise<IEvent | null> {
    const event = await Event.findOne({ slug })
      .populate('organizerId', 'firstName lastName avatar email')

    if (event) {
      // Increment view count
      await Event.findByIdAndUpdate(event.id, { $inc: { viewCount: 1 } })
      
      // Cache it
      await redisUtils.setJsonEx(`event:${event.id}`, event.toJSON(), 3600)
    }

    return event
  }

  async updateEvent(id: string, updates: Partial<CreateEventInput>, organizerId: string): Promise<IEvent | null> {
    const updateData: any = { ...updates }

    if (updates.title) {
      updateData.slug = this.generateSlug(updates.title)
    }

    if (updates.ticketTypes) {
      updateData.ticketTypes = updates.ticketTypes.map(tt => ({
        ...tt,
        currency: 'DOP',
        availableQuantity: tt.totalQuantity,
        maxQuantityPerOrder: tt.maxQuantityPerOrder || 10
      }))
    }

    const event = await Event.findOneAndUpdate(
      { _id: id, organizerId },
      updateData,
      { new: true, runValidators: true }
    ).populate('organizerId', 'firstName lastName avatar')

    if (event) {
      // Update cache
      await redisUtils.setJsonEx(`event:${id}`, event.toJSON(), 3600)
    }

    return event
  }

  async deleteEvent(id: string, organizerId: string): Promise<boolean> {
    const result = await Event.findOneAndDelete({ _id: id, organizerId })
    
    if (result) {
      // Remove from cache
      await redisUtils.del(`event:${id}`)
      return true
    }

    return false
  }

  async publishEvent(id: string, organizerId: string): Promise<IEvent | null> {
    const event = await Event.findOneAndUpdate(
      { _id: id, organizerId },
      { 
        status: 'PUBLISHED',
        publishedAt: new Date()
      },
      { new: true }
    ).populate('organizerId', 'firstName lastName avatar')

    if (event) {
      // Update cache
      await redisUtils.setJsonEx(`event:${id}`, event.toJSON(), 3600)
    }

    return event
  }

  async getEventsByOrganizer(organizerId: string, page = 1, limit = 10): Promise<{
    events: IEvent[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const total = await Event.countDocuments({ organizerId })
    const totalPages = Math.ceil(total / limit)

    const events = await Event.find({ organizerId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return {
      events,
      total,
      page,
      limit,
      totalPages
    }
  }

  async getFeaturedEvents(limit = 6): Promise<IEvent[]> {
    return await Event.find({
      status: 'PUBLISHED',
      startDateTime: { $gte: new Date() }
    })
      .populate('organizerId', 'firstName lastName avatar')
      .sort({ viewCount: -1, startDateTime: 1 })
      .limit(limit)
  }

  async getCategories(): Promise<any[]> {
    // Return static categories for now
    return [
      { id: 'music', name: 'Música', icon: '🎵', color: '#FF6B6B' },
      { id: 'sports', name: 'Deportes', icon: '⚽', color: '#4ECDC4' },
      { id: 'technology', name: 'Tecnología', icon: '💻', color: '#45B7D1' },
      { id: 'business', name: 'Negocios', icon: '💼', color: '#96CEB4' },
      { id: 'arts', name: 'Arte', icon: '🎨', color: '#FFEAA7' },
      { id: 'food', name: 'Gastronomía', icon: '🍽️', color: '#FD79A8' },
      { id: 'health', name: 'Salud', icon: '💪', color: '#6C5CE7' },
      { id: 'education', name: 'Educación', icon: '📚', color: '#A29BFE' }
    ]
  }

  async getEventStats(organizerId: string): Promise<any> {
    const stats = await Event.aggregate([
      { $match: { organizerId } },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          publishedEvents: {
            $sum: { $cond: [{ $eq: ['$status', 'PUBLISHED'] }, 1, 0] }
          },
          totalViews: { $sum: '$viewCount' },
          totalShares: { $sum: '$shareCount' },
          upcomingEvents: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$status', 'PUBLISHED'] },
                    { $gte: ['$startDateTime', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ])

    return stats[0] || {
      totalEvents: 0,
      publishedEvents: 0,
      totalViews: 0,
      totalShares: 0,
      upcomingEvents: 0
    }
  }

  // Initialize some sample data for development
  async initializeSampleData(): Promise<void> {
    const eventCount = await Event.countDocuments()
    if (eventCount > 0) return // Already has data

    const sampleEvents = [
      {
        title: "Concierto de Merengue en Vivo - Los Hermanos Rosario",
        description: "Una noche increíble con los mejores artistas de merengue dominicano. Los Hermanos Rosario presentan sus mejores éxitos en una velada que no podrás olvidar.",
        startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
        venue: "Teatro Nacional Eduardo Brito",
        category: "music",
        tags: ["merengue", "musica-dominicana", "concierto"],
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        maxCapacity: 2000,
        ticketTypes: [
          { name: "General", price: 1500, totalQuantity: 1500 },
          { name: "VIP", price: 3000, totalQuantity: 500 }
        ]
      },
      {
        title: "Conferencia Tech RD 2025 - El Futuro de la Tecnología",
        description: "El evento tecnológico más importante de República Dominicana. Charlas magistrales, workshops y networking con los mejores profesionales del sector tech.",
        startDateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDateTime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
        isOnline: true,
        onlineUrl: "https://zoom.us/techrd2025",
        category: "technology",
        tags: ["tecnologia", "programacion", "ia", "desarrollo"],
        coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        maxCapacity: 1000,
        ticketTypes: [
          { name: "Acceso Completo", price: 2500, totalQuantity: 800 },
          { name: "Estudiante", price: 1000, totalQuantity: 200 }
        ]
      }
    ]

    for (const eventData of sampleEvents) {
      const event = await this.createEvent(eventData as CreateEventInput, "507f1f77bcf86cd799439011") // Mock organizer ID
      await this.publishEvent(event.id, "507f1f77bcf86cd799439011")
    }
  }
}