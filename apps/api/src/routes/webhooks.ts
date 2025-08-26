import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { OrderService } from '../services/order.service'
import Stripe from 'stripe'
import { config } from '../config/environment'
import { logger } from '../utils/logger'

const stripe = new Stripe(config.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const orderService = new OrderService()

export async function webhookRoutes(fastify: FastifyInstance) {
  
  // Stripe webhook handler
  fastify.post('/webhooks/stripe', {
    config: {
      // Raw body is needed for webhook signature verification
      rawBody: true
    },
    schema: {
      tags: ['Webhooks'],
      description: 'Stripe webhook endpoint',
      consumes: ['application/json'],
      body: {
        type: 'object'
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const sig = request.headers['stripe-signature'] as string
    
    if (!sig) {
      logger.error('Missing Stripe signature')
      return reply.status(400).send('Missing Stripe signature')
    }

    let event: Stripe.Event

    try {
      // Get raw body
      const body = request.rawBody || JSON.stringify(request.body)
      
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        config.STRIPE_WEBHOOK_SECRET
      )
      
      logger.info(`Stripe webhook received: ${event.type}`)

    } catch (err: any) {
      logger.error(`Webhook signature verification failed: ${err.message}`)
      return reply.status(400).send(`Webhook Error: ${err.message}`)
    }

    try {
      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
          break

        case 'checkout.session.expired':
          await handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session)
          break

        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
          break

        case 'payment_intent.payment_failed':
          await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
          break

        case 'invoice.payment_succeeded':
          logger.info('Invoice payment succeeded')
          break

        case 'invoice.payment_failed':
          logger.info('Invoice payment failed')
          break

        default:
          logger.info(`Unhandled event type: ${event.type}`)
      }

      return reply.status(200).send({ received: true })

    } catch (error: any) {
      logger.error('Error processing webhook:', error)
      return reply.status(500).send('Webhook processing failed')
    }
  })

  // Health check for webhooks
  fastify.get('/webhooks/health', async (request, reply) => {
    return reply.send({
      success: true,
      message: 'Webhook endpoint is healthy',
      timestamp: new Date().toISOString()
    })
  })
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    logger.info(`Processing checkout session completed: ${session.id}`)
    
    if (session.payment_status === 'paid') {
      // Confirm the payment in our system
      const order = await orderService.confirmPayment(session.id)
      logger.info(`Order ${order.id} payment confirmed via webhook`)
    }
  } catch (error) {
    logger.error('Error handling checkout session completed:', error)
    throw error
  }
}

async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  try {
    logger.info(`Processing checkout session expired: ${session.id}`)
    
    if (session.metadata?.orderId) {
      // The order will be automatically cleaned up by the cleanup job
      // But we can also manually cancel it here if needed
      logger.info(`Checkout session expired for order: ${session.metadata.orderId}`)
    }
  } catch (error) {
    logger.error('Error handling checkout session expired:', error)
    throw error
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    logger.info(`Processing payment intent succeeded: ${paymentIntent.id}`)
    
    // This is usually handled by checkout.session.completed
    // but we can add additional logic here if needed
    logger.info(`Payment intent ${paymentIntent.id} succeeded`)
  } catch (error) {
    logger.error('Error handling payment intent succeeded:', error)
    throw error
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    logger.info(`Processing payment intent failed: ${paymentIntent.id}`)
    
    // Handle failed payment
    // We might want to update order status or notify the user
    logger.info(`Payment intent ${paymentIntent.id} failed`)
  } catch (error) {
    logger.error('Error handling payment intent failed:', error)
    throw error
  }
}