import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient
}

let db: PrismaClient

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient()
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient({
      log: ['warn', 'error'],
    })
  }
  db = global.__db__
}

// Test database connection
db.$connect()
  .then(() => {
    logger.info('✅ Database connected successfully')
  })
  .catch((error) => {
    logger.error('❌ Database connection failed:', error)
    logger.warn('⚠️  Continuing without database connection for development')
  })

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect()
  logger.info('📦 Database disconnected')
})

export { db }