import { Order, IOrder, IOrderItem } from '../models/Order'
import { Ticket } from '../models/Ticket'
import { Event } from '../models/Event'
import { User } from '../models/User'
import { redisUtils } from '../utils/redis'
import Stripe from 'stripe'
import { config } from '../config/environment'

const stripe = new Stripe(config.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export interface CreateOrderInput {
  items: IOrderItem[]
  attendeeInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  paymentMethod: 'STRIPE' | 'PAYPAL' | 'CARDNET' | 'AZUL'
}

export interface StripeCheckoutSession {
  sessionId: string
  url: string
}

export class OrderService {
  
  async createOrder(input: CreateOrderInput, userId: string): Promise<IOrder> {
    // Validate items and calculate total
    let totalAmount = 0
    const currency = input.items[0]?.currency || 'DOP'
    
    // Verify all events and ticket availability
    for (const item of input.items) {
      const event = await Event.findById(item.eventId)
      if (!event) {
        throw new Error(`Event not found: ${item.eventId}`)
      }
      
      const ticketType = event.ticketTypes.find(tt => tt._id === item.ticketTypeId)
      if (!ticketType) {
        throw new Error(`Ticket type not found: ${item.ticketTypeId}`)
      }
      
      if (ticketType.availableQuantity < item.quantity) {
        throw new Error(`Insufficient tickets available for ${ticketType.name}`)
      }
      
      totalAmount += item.price * item.quantity
    }

    // Create order
    const order = new Order({
      userId,
      items: input.items,
      totalAmount,
      currency,
      paymentMethod: input.paymentMethod,
      attendeeInfo: input.attendeeInfo,
      status: 'PENDING'
    })

    await order.save()

    // Reserve tickets (temporarily reduce availability)
    for (const item of input.items) {
      await Event.updateOne(
        { 
          _id: item.eventId,
          'ticketTypes._id': item.ticketTypeId
        },
        { 
          $inc: { 'ticketTypes.$.availableQuantity': -item.quantity }
        }
      )
    }

    // Cache order for quick access
    await redisUtils.setJsonEx(`order:${order.id}`, order.toJSON(), 3600)

    return order
  }

  async createStripeCheckoutSession(orderId: string): Promise<StripeCheckoutSession> {
    const order = await Order.findById(orderId).populate('userId')
    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== 'PENDING') {
      throw new Error('Order is not pending')
    }

    // Create line items for Stripe
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: order.currency.toLowerCase(),
        product_data: {
          name: `${item.eventTitle} - ${item.ticketTypeName}`,
          description: `Tickets para ${item.eventTitle}`,
          metadata: {
            eventId: item.eventId,
            ticketTypeId: item.ticketTypeId
          }
        },
        unit_amount: Math.round(item.price * 100) // Convert to cents
      },
      quantity: item.quantity
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${config.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.FRONTEND_URL}/checkout/cancelled?order_id=${orderId}`,
      customer_email: order.attendeeInfo.email,
      metadata: {
        orderId: order.id.toString(),
        userId: order.userId.toString()
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes
    })

    // Update order with Stripe session ID
    order.stripeSessionId = session.id
    order.status = 'PROCESSING'
    await order.save()

    // Update cache
    await redisUtils.setJsonEx(`order:${order.id}`, order.toJSON(), 3600)

    return {
      sessionId: session.id,
      url: session.url!
    }
  }

  async confirmPayment(sessionId: string): Promise<IOrder> {
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (!session.metadata?.orderId) {
      throw new Error('Invalid session metadata')
    }

    const order = await Order.findById(session.metadata.orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status === 'PAID') {
      return order // Already processed
    }

    if (session.payment_status === 'paid') {
      // Update order status
      order.status = 'PAID'
      order.paidAt = new Date()
      order.paymentIntentId = session.payment_intent as string
      
      // Generate tickets
      const tickets = []
      for (const item of order.items) {
        for (let i = 0; i < item.quantity; i++) {
          const ticket = new Ticket({
            orderId: order.id,
            userId: order.userId,
            eventId: item.eventId,
            ticketTypeId: item.ticketTypeId,
            ticketTypeName: item.ticketTypeName,
            attendeeInfo: order.attendeeInfo,
            price: item.price,
            currency: item.currency
          })
          
          await ticket.save()
          tickets.push(ticket.id)
        }
      }

      order.tickets = tickets
      await order.save()

      // Update cache
      await redisUtils.setJsonEx(`order:${order.id}`, order.toJSON(), 86400) // Cache for 24 hours
      
      // TODO: Send confirmation email
      
      return order
    }

    throw new Error('Payment not confirmed')
  }

  async getOrder(orderId: string, userId?: string): Promise<IOrder | null> {
    // Try cache first
    const cached = await redisUtils.getJson(`order:${orderId}`)
    if (cached && (!userId || cached.userId === userId)) {
      return cached
    }

    const query: any = { _id: orderId }
    if (userId) {
      query.userId = userId
    }

    const order = await Order.findOne(query)
      .populate('userId', 'firstName lastName email')
      .populate('tickets')

    if (order) {
      await redisUtils.setJsonEx(`order:${orderId}`, order.toJSON(), 3600)
    }

    return order
  }

  async getUserOrders(userId: string, page = 1, limit = 10): Promise<{
    orders: IOrder[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const total = await Order.countDocuments({ userId })
    const totalPages = Math.ceil(total / limit)

    const orders = await Order.find({ userId })
      .populate('tickets')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return {
      orders,
      total,
      page,
      limit,
      totalPages
    }
  }

  async cancelOrder(orderId: string, userId: string): Promise<IOrder> {
    const order = await Order.findOne({ _id: orderId, userId })
    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status === 'PAID') {
      throw new Error('Cannot cancel paid order. Please request refund.')
    }

    if (order.status === 'CANCELLED') {
      return order
    }

    // Release reserved tickets
    for (const item of order.items) {
      await Event.updateOne(
        { 
          _id: item.eventId,
          'ticketTypes._id': item.ticketTypeId
        },
        { 
          $inc: { 'ticketTypes.$.availableQuantity': item.quantity }
        }
      )
    }

    order.status = 'CANCELLED'
    order.cancelledAt = new Date()
    await order.save()

    // Update cache
    await redisUtils.setJsonEx(`order:${orderId}`, order.toJSON(), 3600)

    return order
  }

  async getOrderStats(userId?: string): Promise<any> {
    const matchFilter = userId ? { userId } : {}
    
    const stats = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ['$status', 'PAID'] }, '$totalAmount', 0] }
          },
          paidOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'PAID'] }, 1, 0] }
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] }
          }
        }
      }
    ])

    return stats[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      paidOrders: 0,
      pendingOrders: 0,
      cancelledOrders: 0
    }
  }

  // Cleanup expired pending orders (to be called by cron job)
  async cleanupExpiredOrders(): Promise<number> {
    const expiredTime = new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    
    const expiredOrders = await Order.find({
      status: 'PENDING',
      createdAt: { $lt: expiredTime }
    })

    let cleanedCount = 0
    for (const order of expiredOrders) {
      // Release reserved tickets
      for (const item of order.items) {
        await Event.updateOne(
          { 
            _id: item.eventId,
            'ticketTypes._id': item.ticketTypeId
          },
          { 
            $inc: { 'ticketTypes.$.availableQuantity': item.quantity }
          }
        )
      }

      order.status = 'CANCELLED'
      order.cancelledAt = new Date()
      await order.save()
      cleanedCount++
    }

    return cleanedCount
  }
}