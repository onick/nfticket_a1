import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth'
import { eventRoutes } from './events'
import { orderRoutes } from './orders'
import { ticketRoutes } from './tickets'
import { webhookRoutes } from './webhooks'
import { logger } from '../utils/logger'

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', async (request, reply) => {
    return reply.send({
      success: true,
      message: 'TIX API is running!',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      database: 'MongoDB',
      cache: 'Redis'
    })
  })

  // Webhooks (no prefix, raw routes)
  await fastify.register(webhookRoutes)

  // API v1 routes
  await fastify.register(async function (fastify) {
    await fastify.register(authRoutes)
    await fastify.register(eventRoutes)
    await fastify.register(orderRoutes)
    await fastify.register(ticketRoutes)
  }, { prefix: '/api/v1' })

  logger.info('✅ All routes registered successfully')
}