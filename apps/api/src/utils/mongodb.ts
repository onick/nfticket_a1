import mongoose from 'mongoose'
import { config } from '../config/environment'
import { logger } from './logger'

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.DATABASE_URL)
    logger.info(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error)
    logger.warn('⚠️  Continuing without database connection for development')
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close()
    logger.info('📦 MongoDB disconnected through app termination')
    process.exit(0)
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error)
    process.exit(1)
  }
})

export { connectDB, mongoose }