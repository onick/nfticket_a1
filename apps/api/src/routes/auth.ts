import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { UserService, CreateUserInput, LoginInput } from '../services/user.service'
import { validateBody, registerSchema, loginSchema } from '../utils/validation'
import { authenticate } from '../utils/auth'
import { logger } from '../utils/logger'

const userService = new UserService()

export async function authRoutes(fastify: FastifyInstance) {
  // Register user
  fastify.post('/auth/register', {
    preHandler: validateBody(registerSchema),
    schema: {
      tags: ['Authentication'],
      description: 'Register a new user',
      body: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          firstName: { type: 'string', minLength: 2 },
          lastName: { type: 'string', minLength: 2 },
          phone: { type: 'string' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                token: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userData = request.validatedBody as CreateUserInput

      logger.info(`Attempting to register user: ${userData.email}`)

      const user = await userService.createUser(userData)

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email
      })

      logger.info(`User registered successfully: ${user.id}`)

      return reply.status(201).send({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user,
          token
        }
      })

    } catch (error: any) {
      logger.error('Registration error:', error)

      return reply.status(400).send({
        success: false,
        message: error.message || 'Error al registrar usuario'
      })
    }
  })

  // Login user
  fastify.post('/auth/login', {
    preHandler: validateBody(loginSchema),
    schema: {
      tags: ['Authentication'],
      description: 'Login user',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const loginData = request.validatedBody as LoginInput

      logger.info(`Login attempt for: ${loginData.email}`)

      const user = await userService.loginUser(loginData)

      if (!user) {
        return reply.status(401).send({
          success: false,
          message: 'Email o contraseña incorrectos'
        })
      }

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email
      })

      logger.info(`User logged in successfully: ${user.id}`)

      return reply.send({
        success: true,
        message: 'Login exitoso',
        data: {
          user,
          token
        }
      })

    } catch (error: any) {
      logger.error('Login error:', error)

      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Get current user profile
  fastify.get('/auth/me', {
    preHandler: [authenticate],
    schema: {
      tags: ['Authentication'],
      description: 'Get current user profile',
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

      const userProfile = await userService.getUserProfile(request.user.id)

      if (!userProfile) {
        return reply.status(404).send({
          success: false,
          message: 'Usuario no encontrado'
        })
      }

      return reply.send({
        success: true,
        data: userProfile
      })

    } catch (error: any) {
      logger.error('Get profile error:', error)

      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Update user profile
  fastify.put('/auth/me', {
    preHandler: [authenticate],
    schema: {
      tags: ['Authentication'],
      description: 'Update current user profile',
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string', minLength: 2 },
          lastName: { type: 'string', minLength: 2 },
          phone: { type: 'string' },
          avatar: { type: 'string' },
          preferredLanguage: { type: 'string', enum: ['es', 'en'] },
          timezone: { type: 'string' },
          marketingOptIn: { type: 'boolean' }
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

      const updates = request.body as any

      const updatedUser = await userService.updateUser(request.user.id, updates)

      if (!updatedUser) {
        return reply.status(404).send({
          success: false,
          message: 'Usuario no encontrado'
        })
      }

      return reply.send({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: updatedUser
      })

    } catch (error: any) {
      logger.error('Update profile error:', error)

      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  })

  // Refresh token
  fastify.post('/auth/refresh', {
    preHandler: [authenticate],
    schema: {
      tags: ['Authentication'],
      description: 'Refresh JWT token',
      security: [{ Bearer: [] }]
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        return reply.status(401).send({
          success: false,
          message: 'Token inválido'
        })
      }

      // Generate new token
      const newToken = fastify.jwt.sign({
        id: request.user.id,
        email: request.user.email
      })

      return reply.send({
        success: true,
        message: 'Token renovado exitosamente',
        data: {
          token: newToken
        }
      })

    } catch (error: any) {
      logger.error('Token refresh error:', error)

      return reply.status(500).send({
        success: false,
        message: 'Error al renovar token'
      })
    }
  })
}