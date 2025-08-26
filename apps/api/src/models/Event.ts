import { Schema, model, Document, Types } from 'mongoose'

export interface ITicketType {
  name: string
  description?: string
  price: number
  currency: string
  totalQuantity?: number
  availableQuantity?: number
  maxQuantityPerOrder: number
  salesStartAt?: Date
  salesEndAt?: Date
}

export interface IEvent extends Document {
  title: string
  slug: string
  description: string
  longDescription?: string
  startDateTime: Date
  endDateTime?: Date
  timezone: string
  venue?: string
  isOnline: boolean
  onlineUrl?: string
  category: string
  tags: string[]
  coverImage?: string
  images: string[]
  ticketTypes: ITicketType[]
  maxCapacity?: number
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'POSTPONED' | 'COMPLETED'
  publishedAt?: Date
  organizerId: Types.ObjectId
  viewCount: number
  shareCount: number
  createdAt: Date
  updatedAt: Date
}

const TicketTypeSchema = new Schema<ITicketType>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'DOP'
  },
  totalQuantity: {
    type: Number,
    min: 0
  },
  availableQuantity: {
    type: Number,
    min: 0
  },
  maxQuantityPerOrder: {
    type: Number,
    default: 10,
    min: 1
  },
  salesStartAt: {
    type: Date
  },
  salesEndAt: {
    type: Date
  }
}, { _id: true })

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  longDescription: {
    type: String,
    maxlength: 20000
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date
  },
  timezone: {
    type: String,
    default: 'America/Santo_Domingo'
  },
  venue: {
    type: String,
    trim: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  onlineUrl: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['music', 'sports', 'technology', 'business', 'arts', 'food', 'health', 'education']
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  coverImage: {
    type: String
  },
  images: [{
    type: String
  }],
  ticketTypes: [TicketTypeSchema],
  maxCapacity: {
    type: Number,
    min: 1
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'POSTPONED', 'COMPLETED'],
    default: 'DRAFT'
  },
  publishedAt: {
    type: Date
  },
  organizerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      return ret
    }
  }
})

// Indexes for performance and search
EventSchema.index({ slug: 1 })
EventSchema.index({ status: 1, startDateTime: 1 })
EventSchema.index({ category: 1, status: 1 })
EventSchema.index({ organizerId: 1, createdAt: -1 })
EventSchema.index({ startDateTime: 1 })
EventSchema.index({ title: 'text', description: 'text' })

// Virtual for calculating available capacity
EventSchema.virtual('availableCapacity').get(function() {
  if (!this.maxCapacity) return null
  return this.maxCapacity - (this.ticketTypes.reduce((sold, tt) => 
    sold + ((tt.totalQuantity || 0) - (tt.availableQuantity || 0)), 0))
})

export const Event = model<IEvent>('Event', EventSchema)