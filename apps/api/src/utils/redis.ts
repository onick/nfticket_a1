import { createClient } from 'redis'
import { config } from '../config/environment'
import { logger } from './logger'

const redis = createClient({
  url: config.REDIS_URL
})

redis.on('error', (error) => {
  logger.error('❌ Redis connection error:', error)
})

redis.on('connect', () => {
  logger.info('✅ Redis connected successfully')
})

redis.on('ready', () => {
  logger.info('🚀 Redis is ready to accept commands')
})

redis.on('end', () => {
  logger.info('📦 Redis connection ended')
})

// Connect to Redis
redis.connect().catch((error) => {
  logger.error('❌ Failed to connect to Redis:', error)
  logger.warn('⚠️  Continuing without Redis for development')
})

// Graceful shutdown
process.on('beforeExit', async () => {
  if (redis.isOpen) {
    await redis.disconnect()
    logger.info('📦 Redis disconnected')
  }
})

export { redis }

// Utility functions for common operations
export const redisUtils = {
  // Set with expiration
  async setEx(key: string, value: string, seconds: number): Promise<void> {
    try {
      await redis.setEx(key, seconds, value)
    } catch (error) {
      logger.error('Redis setEx error:', error)
    }
  },

  // Get value
  async get(key: string): Promise<string | null> {
    try {
      return await redis.get(key)
    } catch (error) {
      logger.error('Redis get error:', error)
      return null
    }
  },

  // Delete key
  async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      logger.error('Redis del error:', error)
    }
  },

  // Set JSON with expiration
  async setJsonEx(key: string, value: any, seconds: number): Promise<void> {
    try {
      await redis.setEx(key, seconds, JSON.stringify(value))
    } catch (error) {
      logger.error('Redis setJsonEx error:', error)
    }
  },

  // Get JSON
  async getJson(key: string): Promise<any> {
    try {
      const value = await redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      logger.error('Redis getJson error:', error)
      return null
    }
  },

  // Increment counter
  async incr(key: string): Promise<number> {
    try {
      return await redis.incr(key)
    } catch (error) {
      logger.error('Redis incr error:', error)
      return 0
    }
  },

  // Set key with expiration if not exists
  async setNxEx(key: string, value: string, seconds: number): Promise<boolean> {
    try {
      const result = await redis.set(key, value, {
        NX: true,
        EX: seconds
      })
      return result === 'OK'
    } catch (error) {
      logger.error('Redis setNxEx error:', error)
      return false
    }
  }
}