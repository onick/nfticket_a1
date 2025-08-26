import mongoose, { Document, Schema } from 'mongoose';
import { generateQRCode } from '../utils/qr';

export interface ITicket extends Document {
  id: string
  ticketNumber: string
  orderId: string
  userId: string
  eventId: string
  ticketTypeId: string
  ticketTypeName: string
  attendeeInfo: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  price: number
  currency: string
  qrCode: string
  qrCodeUrl?: string
  status: 'VALID' | 'USED' | 'CANCELLED' | 'REFUNDED'
  usedAt?: Date
  usedBy?: string // Staff member who scanned
  createdAt: Date
  updatedAt: Date
}

const ticketSchema = new Schema({
  ticketNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  ticketTypeId: { type: String, required: true },
  ticketTypeName: { type: String, required: true },
  attendeeInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String
  },
  price: { type: Number, required: true },
  currency: { type: String, required: true, default: 'DOP' },
  qrCode: { type: String, required: true },
  qrCodeUrl: String,
  status: {
    type: String,
    enum: ['VALID', 'USED', 'CANCELLED', 'REFUNDED'],
    default: 'VALID'
  },
  usedAt: Date,
  usedBy: String
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for ticket ID
ticketSchema.virtual('id').get(function() {
  return this._id.toHexString()
})

// Indexes for better query performance
ticketSchema.index({ userId: 1, eventId: 1 })
ticketSchema.index({ ticketNumber: 1 })
ticketSchema.index({ orderId: 1 })
ticketSchema.index({ qrCode: 1 })
ticketSchema.index({ status: 1 })

// Generate ticket number and QR code before saving
ticketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.ticketNumber = `TKT-${timestamp}-${random}`
  }
  
  if (!this.qrCode) {
    // Generate QR code data (JSON with ticket info)
    const qrData = {
      ticketId: this._id.toHexString(),
      ticketNumber: this.ticketNumber,
      eventId: this.eventId,
      attendeeName: `${this.attendeeInfo.firstName} ${this.attendeeInfo.lastName}`,
      attendeeEmail: this.attendeeInfo.email,
      ticketType: this.ticketTypeName,
      price: this.price,
      currency: this.currency,
      issuedAt: new Date().toISOString()
    }
    
    this.qrCode = JSON.stringify(qrData)
  }
  
  next()
})

// Method to generate QR code image URL
ticketSchema.methods.generateQRCodeUrl = async function(): Promise<string> {
  if (this.qrCodeUrl) {
    return this.qrCodeUrl
  }
  
  try {
    // Generate QR code as data URL
    this.qrCodeUrl = await generateQRCode(this.qrCode)
    await this.save()
    return this.qrCodeUrl
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`)
  }
}

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema)