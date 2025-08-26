import { User, IUser } from '../models/User'
import { hashPassword, comparePassword } from '../utils/auth'

export interface CreateUserInput {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface LoginInput {
  email: string
  password: string
}

export class UserService {
  async createUser(input: CreateUserInput): Promise<IUser> {
    const { email, password, firstName, lastName, phone } = input

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new Error('El usuario ya existe con este email')
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = new User({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      phone
    })

    await user.save()
    return user
  }

  async loginUser(input: LoginInput): Promise<IUser | null> {
    const { email, password } = input

    // Find user by email
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user) {
      return null
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return null
    }

    // Update last login
    user.lastLoginAt = new Date()
    await user.save()

    // Return user without password
    const userObject = user.toJSON()
    return userObject as IUser
  }

  async getUserById(id: string): Promise<IUser | null> {
    const user = await User.findById(id)
    return user
  }

  async updateUser(id: string, updates: Partial<CreateUserInput>): Promise<IUser | null> {
    const updateData: any = { ...updates }

    // Hash password if provided
    if (updates.password) {
      updateData.passwordHash = await hashPassword(updates.password)
      delete updateData.password
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    return user
  }

  async getUserProfile(id: string): Promise<any> {
    const user = await User.findById(id)
    if (!user) {
      return null
    }

    // For now, return basic profile with mock counts
    // Later we'll populate with real data from other collections
    const userProfile = user.toJSON()
    return {
      ...userProfile,
      tickets: [], // TODO: populate from tickets collection
      _count: {
        tickets: 0, // TODO: count from tickets collection
        reviews: 0  // TODO: count from reviews collection
      }
    }
  }
}