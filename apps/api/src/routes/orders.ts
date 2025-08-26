import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { OrderService, CreateOrderInput } from '../services/order.service'
import { validateBody } from '../utils/validation'
import { authenticate } from '../utils/auth'
import { logger } from '../utils/logger'

const orderService = new OrderService()

// Validation schemas
const createOrderSchema = {
  type: 'object',
  required: ['items', 'attendeeInfo', 'paymentMethod'],
  properties: {
    items: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['eventId', 'eventTitle', 'ticketTypeId', 'ticketTypeName', 'price', 'currency', 'quantity'],
        properties: {
          eventId: { type: 'string' },
          eventTitle: { type: 'string' },
          ticketTypeId: { type: 'string' },
          ticketTypeName: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          currency: { type: 'string' },
          quantity: { type: 'number', minimum: 1 }
        }
      }
    },
    attendeeInfo: {
      type: 'object',
      required: ['firstName', 'lastName', 'email'],
      properties: {
        firstName: { type: 'string', minLength: 2 },
        lastName: { type: 'string', minLength: 2 },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' }
      }
    },
    paymentMethod: {
      type: 'string',
      enum: ['STRIPE', 'PAYPAL', 'CARDNET', 'AZUL']
    }
  }
}

export async function orderRoutes(fastify: FastifyInstance) {
  
  // Create new order
  fastify.post('/orders', {
    preHandler: [authenticate, validateBody(createOrderSchema)],
    schema: {
      tags: ['Orders'],
      description: 'Create a new order',
      security: [{ Bearer: [] }],
      body: createOrderSchema,
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' }
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

      const orderData = request.validatedBody as CreateOrderInput

      logger.info(`Creating order for user: ${request.user.id}`)

      const order = await orderService.createOrder(orderData, request.user.id)

      return reply.status(201).send({
        success: true,
        message: 'Orden creada exitosamente',
        data: order
      })

    } catch (error: any) {
      logger.error('Create order error:', error)
      return reply.status(400).send({
        success: false,
        message: error.message || 'Error al crear orden'
      })
    }
  })

  // Create Stripe checkout session
  fastify.post('/orders/:id/checkout', {
    preHandler: [authenticate],
    schema: {
      tags: ['Orders'],
      description: 'Create Stripe checkout session for order',
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

      logger.info(`Creating Stripe checkout session for order: ${id}`)

      const session = await orderService.createStripeCheckoutSession(id)

      return reply.send({
        success: true,
        message: 'Sesión de pago creada',
        data: session
      })

    } catch (error: any) {
      logger.error('Create checkout session error:', error)
      return reply.status(400).send({
        success: false,
        message: error.message || 'Error al crear sesión de pago'
      })
    }
  })

  // Confirm payment (webhook or manual)
  fastify.post('/orders/confirm-payment', {
    schema: {
      tags: ['Orders'],
      description: 'Confirm payment for order',
      body: {
        type: 'object',
        required: ['sessionId'],
        properties: {
          sessionId: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { sessionId } = request.body as any

      logger.info(`Confirming payment for session: ${sessionId}`)

      const order = await orderService.confirmPayment(sessionId)

      return reply.send({
        success: true,
        message: 'Pago confirmado exitosamente',
        data: order
      })

    } catch (error: any) {
      logger.error('Confirm payment error:', error)
      return reply.status(400).send({
        success: false,
        message: error.message || 'Error al confirmar pago'
      })
    }
  })

  // Get order by ID
  fastify.get('/orders/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Orders'],
      description: 'Get order by ID',
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

      const order = await orderService.getOrder(id, request.user.id)

      if (!order) {
        return reply.status(404).send({
          success: false,
          message: 'Orden no encontrada'
        })
      }

      return reply.send({
        success: true,
        data: order
      })

    } catch (error: any) {
      logger.error('Get order error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Get user orders
  fastify.get('/orders', {
    preHandler: [authenticate],
    schema: {
      tags: ['Orders'],
      description: 'Get user orders',
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

      const result = await orderService.getUserOrders(request.user.id, page, limit)

      return reply.send({
        success: true,
        data: result
      })

    } catch (error: any) {
      logger.error('Get user orders error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Cancel order
  fastify.patch('/orders/:id/cancel', {
    preHandler: [authenticate],
    schema: {
      tags: ['Orders'],
      description: 'Cancel order',
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

      const order = await orderService.cancelOrder(id, request.user.id)

      return reply.send({
        success: true,
        message: 'Orden cancelada exitosamente',
        data: order
      })

    } catch (error: any) {
      logger.error('Cancel order error:', error)
      return reply.status(400).send({
        success: false,
        message: error.message || 'Error al cancelar orden'
      })
    }
  })

  // Get order statistics
  fastify.get('/orders/stats', {
    preHandler: [authenticate],
    schema: {
      tags: ['Orders'],
      description: 'Get order statistics',
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

      const stats = await orderService.getOrderStats(request.user.id)

      return reply.send({
        success: true,
        data: stats
      })

    } catch (error: any) {
      logger.error('Get order stats error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })
}