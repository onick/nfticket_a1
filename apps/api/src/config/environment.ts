import { config as dotenvConfig } from 'dotenv'
import path from 'path'

// Load environment variables
dotenvConfig({ 
  path: [
    path.resolve(__dirname, '../../../../.env'),
    path.resolve(__dirname, '../../../.env'),
    path.resolve(process.cwd(), '.env')
  ]
})

interface Config {
  NODE_ENV: string
  PORT: number
  HOST: string
  
  // Database
  DATABASE_URL: string
  REDIS_URL: string
  
  // JWT
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  
  // External APIs
  STRIPE_SECRET_KEY: string
  STRIPE_PUBLISHABLE_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
  
  // Email
  SMTP_HOST: string
  SMTP_PORT: number
  SMTP_USER: string
  SMTP_PASS: string
  
  // Rate Limiting
  RATE_LIMIT_MAX: number
  RATE_LIMIT_WINDOW: string
  
  // CORS
  CORS_ORIGIN: string[]
  
  // File Upload
  MAX_FILE_SIZE: number
  ALLOWED_FILE_TYPES: string[]
  
  // Frontend
  FRONTEND_URL: string
}

export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  HOST: process.env.HOST || '0.0.0.0',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/tix_dev',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  
  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  
  // Rate Limiting
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || '15 minutes',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'application/pdf'
  ],
  
  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
}

// Validate required environment variables
const requiredVars = [
  'JWT_SECRET',
  'DATABASE_URL'
]

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
}