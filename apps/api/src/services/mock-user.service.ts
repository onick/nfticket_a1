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

export interface MockUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

// In-memory storage for development
const users: Map<string, MockUser & { passwordHash: string }> = new Map()
let userIdCounter = 1

export class MockUserService {
  async createUser(input: CreateUserInput): Promise<MockUser> {
    const { email, password, firstName, lastName, phone } = input

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email)
    if (existingUser) {
      throw new Error('El usuario ya existe con este email')
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const userId = `user_${userIdCounter++}`
    const now = new Date()
    
    const user = {
      id: userId,
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      phone,
      createdAt: now,
      updatedAt: now
    }

    users.set(userId, user)

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async loginUser(input: LoginInput): Promise<MockUser | null> {
    const { email, password } = input

    // Find user by email
    const user = Array.from(users.values()).find(u => u.email === email)
    if (!user) {
      return null
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return null
    }

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async getUserById(id: string): Promise<MockUser | null> {
    const user = users.get(id)
    if (!user) {
      return null
    }

    const { passwordHash: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async updateUser(id: string, updates: Partial<CreateUserInput>): Promise<MockUser> {
    const user = users.get(id)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }

    const updateData: any = { ...updates }

    // Hash password if provided
    if (updates.password) {
      updateData.passwordHash = await hashPassword(updates.password)
      delete updateData.password
    }

    // Update user
    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date()
    }

    users.set(id, updatedUser)

    const { passwordHash: _, ...userWithoutPassword } = updatedUser
    return userWithoutPassword
  }

  async getUserProfile(id: string): Promise<any> {
    const user = users.get(id)
    if (!user) {
      return null
    }

    const { passwordHash: _, ...userProfile } = user
    return {
      ...userProfile,
      tickets: [], // Mock empty tickets array
      _count: {
        tickets: 0,
        reviews: 0
      }
    }
  }
}