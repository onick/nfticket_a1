import Fastify from 'fastify'
import { config } from './config/environment'
import { registerPlugins } from './plugins'
import { registerRoutes } from './routes'
import { logger } from './utils/logger'
import { connectDB } from './utils/mongodb'

async function buildServer() {
  const fastify = Fastify({
    logger: config.NODE_ENV === 'development',
    trustProxy: true,
  })

  // Register plugins
  await registerPlugins(fastify)

  // Register routes
  await registerRoutes(fastify)

  return fastify
}

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB()
    
    const server = await buildServer()

    // Graceful shutdown
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, shutting down gracefully...`)
        await server.close()
        process.exit(0)
      })
    })

    // Start server
    await server.listen({
      port: config.PORT,
      host: config.HOST
    })

    logger.info(`🚀 TIX API Server running on http://${config.HOST}:${config.PORT}`)
    logger.info(`📚 API Documentation: http://${config.HOST}:${config.PORT}/docs`)
    logger.info(`🌍 Environment: ${config.NODE_ENV}`)

  } catch (error) {
    logger.error('Error starting server:', error)
    process.exit(1)
  }
}

// Start server if this file is run directly
if (require.main === module) {
  startServer()
}

export { buildServer, startServer }