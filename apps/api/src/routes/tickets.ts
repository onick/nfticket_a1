import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { Ticket } from '../models/Ticket'
import { authenticate } from '../utils/auth'
import { logger } from '../utils/logger'

export async function ticketRoutes(fastify: FastifyInstance) {
  
  // Get user tickets
  fastify.get('/tickets', {
    preHandler: [authenticate],
    schema: {
      tags: ['Tickets'],
      description: 'Get user tickets',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          eventId: { type: 'string' },
          status: { type: 'string', enum: ['VALID', 'USED', 'CANCELLED', 'REFUNDED'] },
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

      const filter: any = { userId: request.user.id }
      if (query.eventId) filter.eventId = query.eventId
      if (query.status) filter.status = query.status

      const total = await Ticket.countDocuments(filter)
      const totalPages = Math.ceil(total / limit)

      const tickets = await Ticket.find(filter)
        .populate('eventId', 'title startDateTime venue coverImage')
        .populate('orderId', 'orderNumber totalAmount')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)

      return reply.send({
        success: true,
        data: {
          tickets,
          total,
          page,
          limit,
          totalPages
        }
      })

    } catch (error: any) {
      logger.error('Get tickets error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Get ticket by ID with QR code
  fastify.get('/tickets/:id', {
    preHandler: [authenticate],
    schema: {
      tags: ['Tickets'],
      description: 'Get ticket by ID',
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

      const ticket = await Ticket.findOne({ _id: id, userId: request.user.id })
        .populate('eventId', 'title startDateTime endDateTime venue address coverImage organizerId')
        .populate('orderId', 'orderNumber totalAmount paidAt')

      if (!ticket) {
        return reply.status(404).send({
          success: false,
          message: 'Ticket no encontrado'
        })
      }

      // Generate QR code URL if not exists
      if (!ticket.qrCodeUrl) {
        await ticket.generateQRCodeUrl()
      }

      return reply.send({
        success: true,
        data: ticket
      })

    } catch (error: any) {
      logger.error('Get ticket error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Validate ticket (for event organizers/staff)
  fastify.post('/tickets/validate', {
    preHandler: [authenticate],
    schema: {
      tags: ['Tickets'],
      description: 'Validate ticket by QR code or ticket number',
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        properties: {
          ticketNumber: { type: 'string' },
          qrCode: { type: 'string' },
          eventId: { type: 'string' }
        },
        anyOf: [
          { required: ['ticketNumber'] },
          { required: ['qrCode'] }
        ]
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

      const { ticketNumber, qrCode, eventId } = request.body as any

      let ticket
      if (ticketNumber) {
        ticket = await Ticket.findOne({ ticketNumber })
      } else if (qrCode) {
        ticket = await Ticket.findOne({ qrCode })
      }

      if (!ticket) {
        return reply.status(404).send({
          success: false,
          message: 'Ticket no encontrado'
        })
      }

      // Verify event if provided
      if (eventId && ticket.eventId.toString() !== eventId) {
        return reply.status(400).send({
          success: false,
          message: 'Ticket no válido para este evento'
        })
      }

      // Check ticket status
      if (ticket.status === 'CANCELLED') {
        return reply.status(400).send({
          success: false,
          message: 'Ticket cancelado'
        })
      }

      if (ticket.status === 'REFUNDED') {
        return reply.status(400).send({
          success: false,
          message: 'Ticket reembolsado'
        })
      }

      if (ticket.status === 'USED') {
        return reply.status(400).send({
          success: false,
          message: 'Ticket ya utilizado',
          data: {
            ticket,
            usedAt: ticket.usedAt,
            usedBy: ticket.usedBy
          }
        })
      }

      // Mark ticket as used
      ticket.status = 'USED'
      ticket.usedAt = new Date()
      ticket.usedBy = request.user.email
      await ticket.save()

      const populatedTicket = await Ticket.findById(ticket.id)
        .populate('eventId', 'title startDateTime venue')
        .populate('userId', 'firstName lastName email')

      return reply.send({
        success: true,
        message: 'Ticket validado exitosamente',
        data: populatedTicket
      })

    } catch (error: any) {
      logger.error('Validate ticket error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Get ticket statistics
  fastify.get('/tickets/stats', {
    preHandler: [authenticate],
    schema: {
      tags: ['Tickets'],
      description: 'Get ticket statistics',
      security: [{ Bearer: [] }],
      querystring: {
        type: 'object',
        properties: {
          eventId: { type: 'string' }
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

      const { eventId } = request.query as any

      const matchFilter: any = { userId: request.user.id }
      if (eventId) matchFilter.eventId = eventId

      const stats = await Ticket.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: null,
            totalTickets: { $sum: 1 },
            validTickets: {
              $sum: { $cond: [{ $eq: ['$status', 'VALID'] }, 1, 0] }
            },
            usedTickets: {
              $sum: { $cond: [{ $eq: ['$status', 'USED'] }, 1, 0] }
            },
            cancelledTickets: {
              $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] }
            },
            refundedTickets: {
              $sum: { $cond: [{ $eq: ['$status', 'REFUNDED'] }, 1, 0] }
            }
          }
        }
      ])

      return reply.send({
        success: true,
        data: stats[0] || {
          totalTickets: 0,
          validTickets: 0,
          usedTickets: 0,
          cancelledTickets: 0,
          refundedTickets: 0
        }
      })

    } catch (error: any) {
      logger.error('Get ticket stats error:', error)
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })
}