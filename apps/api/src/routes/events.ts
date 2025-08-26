import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { EventService, CreateEventInput } from '../services/event.service'
import { validateBody, createEventSchema } from '../utils/validation'
import { authenticate } from '../utils/auth'
import { logger } from '../utils/logger'

const eventService = new EventService()

export async function eventRoutes(fastify: FastifyInstance) {
  
  // Get all events (public)
  fastify.get('/events', {
    schema: {
      tags: ['Events'],
      description: 'Get paginated list of events',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100 },
          category: { type: 'string' },
          search: { type: 'string' },
          upcoming: { type: 'boolean' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as any
      const page = parseInt(query.page) || 1
      const limit = parseInt(query.limit) || 10
      
      const result = await eventService.getEvents(page, limit, {
        category: query.category,
        search: query.search,
        upcoming: query.upcoming
      })

      return reply.send({
        success: true,
        data: result
      })

    } catch (error: any) {
      logger.error('Get events error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Get featured events (public)
  fastify.get('/events/featured', {
    schema: {
      tags: ['Events'],
      description: 'Get featured events',
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', minimum: 1, maximum: 20 }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as any
      const limit = parseInt(query.limit) || 6

      const events = await eventService.getFeaturedEvents(limit)

      return reply.send({
        success: true,
        data: events
      })

    } catch (error: any) {
      logger.error('Get featured events error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Get event by ID or slug (public)
  fastify.get('/events/:identifier', {
    schema: {
      tags: ['Events'],
      description: 'Get event by ID or slug',
      params: {
        type: 'object',
        properties: {
          identifier: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { identifier } = request.params as any
      
      let event
      // Check if identifier looks like MongoDB ObjectId (24 hex chars)
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        event = await eventService.getEventById(identifier)
      } else {
        event = await eventService.getEventBySlug(identifier)
      }

      if (!event) {
        return reply.status(404).send({
          success: false,
          message: 'Evento no encontrado'
        })
      }

      return reply.send({
        success: true,
        data: event
      })

    } catch (error: any) {
      logger.error('Get event error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Create new event (protected)
  fastify.post('/events', {
    preHandler: [authenticate, validateBody(createEventSchema)],
    schema: {
      tags: ['Events'],
      description: 'Create a new event',
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['title', 'description', 'startDateTime', 'category', 'ticketTypes'],
        properties: {
          title: { type: 'string', minLength: 3, maxLength: 200 },
          description: { type: 'string', minLength: 10, maxLength: 5000 },
          longDescription: { type: 'string', maxLength: 20000 },
          startDateTime: { type: 'string', format: 'date-time' },
          endDateTime: { type: 'string', format: 'date-time' },
          venue: { type: 'string' },
          isOnline: { type: 'boolean' },
          onlineUrl: { type: 'string' },
          category: { type: 'string', enum: ['music', 'sports', 'technology', 'business', 'arts', 'food', 'health', 'education'] },
          tags: { type: 'array', items: { type: 'string' } },
          coverImage: { type: 'string' },
          maxCapacity: { type: 'number', minimum: 1 },
          ticketTypes: {
            type: 'array',
            items: {
              type: 'object',
              required: ['name', 'price'],
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                price: { type: 'number', minimum: 0 },
                totalQuantity: { type: 'number', minimum: 1 },
                maxQuantityPerOrder: { type: 'number', minimum: 1 }
              }
            }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: 'No autenticado'
        })
      }

      const eventData = request.validatedBody as CreateEventInput

      logger.info(`Creating event: ${eventData.title} for user: ${request.user.id}`)

      const event = await eventService.createEvent(eventData, request.user.id)

      return reply.status(201).send({
        success: true,
        message: 'Evento creado exitosamente',
        data: event
      })

    } catch (error: any) {
      logger.error('Create event error:', error)
      return reply.status(400).send({
        success: false,
        message: error.message || 'Error al crear evento'
      })
    }
  })

  // Update event (protected)
  fastify.put('/events/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Events'],
      description: 'Update an event',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: 'No autenticado'
        })
      }

      const { id } = request.params as any
      const updates = request.body as Partial<CreateEventInput>

      const event = await eventService.updateEvent(id, updates, request.user.id)

      if (!event) {
        return reply.status(404).send({
          success: false,
          message: 'Evento no encontrado o no autorizado'
        })
      }

      return reply.send({
        success: true,
        message: 'Evento actualizado exitosamente',
        data: event
      })

    } catch (error: any) {
      logger.error('Update event error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Publish event (protected)
  fastify.patch('/events/:id/publish', {
    preHandler: [authenticate],
    schema: {
      tags: ['Events'],
      description: 'Publish an event',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: 'No autenticado'
        })
      }

      const { id } = request.params as any

      const event = await eventService.publishEvent(id, request.user.id)

      if (!event) {
        return reply.status(404).send({
          success: false,
          message: 'Evento no encontrado o no autorizado'
        })
      }

      return reply.send({
        success: true,
        message: 'Evento publicado exitosamente',
        data: event
      })

    } catch (error: any) {
      logger.error('Publish event error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Delete event (protected)
  fastify.delete('/events/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Events'],
      description: 'Delete an event',
      security: [{ Bearer: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: 'No autenticado'
        })
      }

      const { id } = request.params as any

      const deleted = await eventService.deleteEvent(id, request.user.id)

      if (!deleted) {
        return reply.status(404).send({
          success: false,
          message: 'Evento no encontrado o no autorizado'
        })
      }

      return reply.send({
        success: true,
        message: 'Evento eliminado exitosamente'
      })

    } catch (error: any) {
      logger.error('Delete event error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Get my events (protected)
  fastify.get('/events/my/events', {
    preHandler: [authenticate],
    schema: {
      tags: ['Events'],
      description: 'Get events created by current user',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100 }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: 'No autenticado'
        })
      }

      const query = request.query as any
      const page = parseInt(query.page) || 1
      const limit = parseInt(query.limit) || 10

      const result = await eventService.getEventsByOrganizer(request.user.id, page, limit)

      return reply.send({
        success: true,
        data: result
      })

    } catch (error: any) {
      logger.error('Get my events error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Get event statistics (protected)
  fastify.get('/events/my/stats', {
    preHandler: [authenticate],
    schema: {
      tags: ['Events'],
      description: 'Get event statistics for current user',
      security: [{ Bearer: [] }]
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: 'No autenticado'
        })
      }

      const stats = await eventService.getEventStats(request.user.id)

      return reply.send({
        success: true,
        data: stats
      })

    } catch (error: any) {
      logger.error('Get event stats error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Get categories (public)
  fastify.get('/categories', {
    schema: {
      tags: ['Events'],
      description: 'Get event categories'
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const categories = await eventService.getCategories()

      return reply.send({
        success: true,
        data: categories
      })

    } catch (error: any) {
      logger.error('Get categories error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })
}