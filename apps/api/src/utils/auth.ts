import bcrypt from 'bcryptjs'
import { FastifyRequest } from 'fastify'

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

// JWT payload interface
export interface JWTPayload {
  id: string
  email: string
}

// Auth middleware
export const authenticate = async (request: FastifyRequest, reply: any) => {
  try {
    const token = await request.jwtVerify() as JWTPayload
    request.user = token
  } catch (err) {
    return reply.status(401).send({
      success: false,
      message: 'Token inválido o expirado'
    })
  }
}

// Role-based auth middleware
export const authorize = (allowedRoles: string[]) => {
  return async (request: any, reply: any) => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        message: 'No autenticado'
      })
    }

    // For now, we'll implement role checking later when we add roles to the schema
    // This is a placeholder for future role-based authorization
  }
}

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload
    validatedBody?: any
  }
}