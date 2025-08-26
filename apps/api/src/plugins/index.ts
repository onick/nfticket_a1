import { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import multipart from '@fastify/multipart'
import { config } from '../config/environment'
import { logger } from '../utils/logger'

export async function registerPlugins(fastify: FastifyInstance) {
  // Security plugins
  await fastify.register(helmet)
  
  await fastify.register(cors, {
    origin: config.CORS_ORIGIN,
    credentials: true
  })

  await fastify.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_WINDOW
  })

  // JWT
  await fastify.register(jwt, {
    secret: config.JWT_SECRET,
    sign: {
      expiresIn: config.JWT_EXPIRES_IN
    }
  })

  // Multipart for file uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: config.MAX_FILE_SIZE
    }
  })

  // Swagger documentation
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'TIX API',
        description: 'TIX 2.0 Event Platform API',
        version: '2.0.0'
      },
      host: `${config.HOST}:${config.PORT}`,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  })

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  })

  logger.info('✅ All plugins registered successfully')
}