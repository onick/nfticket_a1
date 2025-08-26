import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  dateOfBirth?: Date
  preferredLanguage: string
  timezone: string
  marketingOptIn: boolean
  emailVerifiedAt?: Date
  phoneVerifiedAt?: Date
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    sparse: true // Allows multiple null values
  },
  avatar: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  preferredLanguage: {
    type: String,
    default: 'es'
  },
  timezone: {
    type: String,
    default: 'America/Santo_Domingo'
  },
  marketingOptIn: {
    type: Boolean,
    default: true
  },
  emailVerifiedAt: {
    type: Date
  },
  phoneVerifiedAt: {
    type: Date
  },
  lastLoginAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.passwordHash
      return ret
    }
  }
})

// Index for performance
UserSchema.index({ email: 1 })
UserSchema.index({ phone: 1 })
UserSchema.index({ createdAt: -1 })

export const User = model<IUser>('User', UserSchema)