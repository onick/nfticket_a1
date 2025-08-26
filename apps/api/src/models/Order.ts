import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  eventId: string
  eventTitle: string
  ticketTypeId: string
  ticketTypeName: string
  price: number
  currency: string
  quantity: number
}

export interface IOrder extends Document {
  id: string
  orderNumber: string
  userId: string
  items: IOrderItem[]
  totalAmount: number
  currency: string
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'CANCELLED' | 'REFUNDED'
  paymentMethod: 'STRIPE' | 'PAYPAL' | 'CARDNET' | 'AZUL'
  paymentIntentId?: string
  stripeSessionId?: string
  attendeeInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  tickets: string[] // Array of generated ticket IDs
  createdAt: Date
  updatedAt: Date
  paidAt?: Date
  cancelledAt?: Date
}

const orderItemSchema = new Schema({
  eventId: { type: String, required: true },
  eventTitle: { type: String, required: true },
  ticketTypeId: { type: String, required: true },
  ticketTypeName: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  quantity: { type: Number, required: true }
})

const orderSchema = new Schema({
  orderNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'DOP' },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'PAID', 'CANCELLED', 'REFUNDED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: String,
    enum: ['STRIPE', 'PAYPAL', 'CARDNET', 'AZUL'],
    required: true
  },
  paymentIntentId: String,
  stripeSessionId: String,
  attendeeInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String
  },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  paidAt: Date,
  cancelledAt: Date
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for order ID
orderSchema.virtual('id').get(function() {
  return this._id.toHexString()
})

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 })
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ stripeSessionId: 1 })
orderSchema.index({ paymentIntentId: 1 })

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.orderNumber = `TIX-${timestamp}-${random}`
  }
  next()
})

export const Order = mongoose.model<IOrder>('Order', orderSchema)