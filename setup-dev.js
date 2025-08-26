#!/usr/bin/env node

/**
 * Development setup script for TIX 2.0
 * Initializes the database with sample data
 */

const mongoose = require('mongoose');

// MongoDB connection URL
const MONGODB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/tix_dev';

// Sample user data
const sampleUsers = [
  {
    email: 'organizador@tix.com',
    passwordHash: '$2b$10$8K1p2aWlQ4R7lqK9Hf8oqOX9EK5oL8p3R7Q9K1aWlQ4R7lqK9Hf8oq', // password: "123456789"
    firstName: 'Carlos',
    lastName: 'Organizador',
    role: 'ORGANIZER',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    preferredLanguage: 'es',
    timezone: 'America/Santo_Domingo'
  },
  {
    email: 'usuario@tix.com', 
    passwordHash: '$2b$10$8K1p2aWlQ4R7lqK9Hf8oqOX9EK5oL8p3R7Q9K1aWlQ4R7lqK9Hf8oq', // password: "123456789"
    firstName: 'Maria',
    lastName: 'Usuario',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    preferredLanguage: 'es',
    timezone: 'America/Santo_Domingo'
  }
];

// Sample event data
const sampleEvents = [
  {
    title: "Concierto de Merengue - Los Hermanos Rosario",
    slug: "concierto-merengue-hermanos-rosario-" + Date.now(),
    description: "Una noche increíble con los mejores artistas de merengue dominicano. Los Hermanos Rosario presentan sus mejores éxitos en una velada que no podrás olvidar.",
    longDescription: "Este concierto promete ser uno de los eventos musicales más importantes del año. Los Hermanos Rosario, íconos del merengue dominicano, presentarán sus clásicos más queridos junto con nuevas composiciones que han conquistado corazones en toda Latinoamérica.",
    startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 hours later
    venue: "Teatro Nacional Eduardo Brito",
    category: "music",
    tags: ["merengue", "musica-dominicana", "concierto", "teatro-nacional"],
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop"
    ],
    maxCapacity: 2000,
    status: "PUBLISHED",
    publishedAt: new Date(),
    viewCount: 156,
    shareCount: 23,
    ticketTypes: [
      {
        name: "General",
        description: "Acceso general al evento",
        price: 1500,
        currency: "DOP",
        totalQuantity: 1500,
        availableQuantity: 1500,
        maxQuantityPerOrder: 6,
        salesStartAt: new Date(),
        salesEndAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
      },
      {
        name: "VIP",
        description: "Acceso VIP con los mejores asientos",
        price: 3000,
        currency: "DOP",
        totalQuantity: 500,
        availableQuantity: 500,
        maxQuantityPerOrder: 4,
        salesStartAt: new Date(),
        salesEndAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    title: "Conferencia Tech RD 2025 - El Futuro de la Tecnología",
    slug: "conferencia-tech-rd-2025-" + Date.now(),
    description: "El evento tecnológico más importante de República Dominicana. Charlas magistrales, workshops y networking con los mejores profesionales del sector tech.",
    longDescription: "Tech RD 2025 reúne a los líderes tecnológicos más influyentes de la región. Durante tres días intensos, participarás en conferencias sobre inteligencia artificial, blockchain, desarrollo móvil, y las últimas tendencias en transformación digital que están revolucionando las empresas dominicanas.",
    startDateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDateTime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    venue: "Centro de Convenciones Hotel Embajador",
    isOnline: false,
    category: "technology",
    tags: ["tecnologia", "programacion", "ia", "desarrollo", "networking"],
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=400&fit=crop"
    ],
    maxCapacity: 1000,
    status: "PUBLISHED",
    publishedAt: new Date(),
    viewCount: 89,
    shareCount: 12,
    ticketTypes: [
      {
        name: "Acceso Completo",
        description: "Acceso a todas las conferencias y workshops",
        price: 2500,
        currency: "DOP",
        totalQuantity: 800,
        availableQuantity: 800,
        maxQuantityPerOrder: 5
      },
      {
        name: "Estudiante",
        description: "Precio especial para estudiantes (requiere ID)",
        price: 1000,
        currency: "DOP",
        totalQuantity: 200,
        availableQuantity: 200,
        maxQuantityPerOrder: 2
      }
    ]
  },
  {
    title: "Festival de Comida Dominicana - Sabores de Quisqueya",
    slug: "festival-comida-dominicana-" + Date.now(),
    description: "Celebra los sabores auténticos de la República Dominicana en este festival gastronómico único. Los mejores chefs del país presentan platos tradicionales e innovaciones culinarias.",
    startDateTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    endDateTime: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    venue: "Plaza de Armas, Zona Colonial",
    category: "food",
    tags: ["gastronomia", "comida-dominicana", "festival", "zona-colonial"],
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop",
    maxCapacity: 5000,
    status: "PUBLISHED",
    publishedAt: new Date(),
    viewCount: 234,
    shareCount: 45,
    ticketTypes: [
      {
        name: "Pase de Degustación",
        description: "Acceso al festival + 10 degustaciones",
        price: 800,
        currency: "DOP",
        totalQuantity: 4000,
        availableQuantity: 4000,
        maxQuantityPerOrder: 8
      },
      {
        name: "Pase Gourmet",
        description: "Todo incluido + masterclass de cocina",
        price: 1500,
        currency: "DOP",
        totalQuantity: 1000,
        availableQuantity: 1000,
        maxQuantityPerOrder: 4
      }
    ]
  }
];

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function createSchemas() {
  // User Schema
  const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true, select: false },
    firstName: String,
    lastName: String,
    avatar: String,
    role: { type: String, enum: ['USER', 'ORGANIZER', 'ADMIN'], default: 'USER' },
    preferredLanguage: { type: String, default: 'es' },
    timezone: { type: String, default: 'America/Santo_Domingo' },
    marketingOptIn: { type: Boolean, default: false },
    lastLoginAt: Date
  }, { timestamps: true });

  // Event Schema
  const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    longDescription: String,
    startDateTime: { type: Date, required: true },
    endDateTime: Date,
    venue: String,
    isOnline: { type: Boolean, default: false },
    onlineUrl: String,
    category: { 
      type: String, 
      enum: ['music', 'sports', 'technology', 'business', 'arts', 'food', 'health', 'education'],
      required: true 
    },
    tags: [String],
    coverImage: String,
    images: [String],
    maxCapacity: Number,
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['DRAFT', 'PUBLISHED', 'CANCELLED'], 
      default: 'DRAFT' 
    },
    publishedAt: Date,
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    ticketTypes: [{
      name: String,
      description: String,
      price: Number,
      currency: { type: String, default: 'DOP' },
      totalQuantity: Number,
      availableQuantity: Number,
      maxQuantityPerOrder: { type: Number, default: 10 },
      salesStartAt: Date,
      salesEndAt: Date
    }]
  }, { timestamps: true });

  // Create indexes for better performance
  eventSchema.index({ status: 1, startDateTime: 1 });
  eventSchema.index({ category: 1 });
  eventSchema.index({ organizerId: 1 });
  eventSchema.index({ '$**': 'text' }); // Text search index

  const User = mongoose.model('User', userSchema);
  const Event = mongoose.model('Event', eventSchema);

  return { User, Event };
}

async function seedDatabase() {
  const { User, Event } = await createSchemas();

  console.log('🌱 Seeding database...');

  // Clear existing data
  await User.deleteMany({});
  await Event.deleteMany({});
  console.log('🧹 Cleared existing data');

  // Create users
  const users = await User.insertMany(sampleUsers);
  console.log('👥 Created sample users');

  // Create events with organizer
  const organizerId = users[0]._id; // First user as organizer
  const eventsWithOrganizer = sampleEvents.map(event => ({
    ...event,
    organizerId
  }));

  await Event.insertMany(eventsWithOrganizer);
  console.log('🎫 Created sample events');

  console.log('✅ Database seeded successfully!');
}

async function main() {
  try {
    console.log('🚀 Setting up TIX development environment...');
    
    await connectDatabase();
    await seedDatabase();
    
    console.log('\n🎉 Development setup completed!');
    console.log('\nSample accounts:');
    console.log('📧 Organizer: organizador@tix.com | Password: 123456789');
    console.log('📧 User: usuario@tix.com | Password: 123456789');
    console.log('\n🌐 You can now start the development server:');
    console.log('   npm run dev:api    (API Server)');
    console.log('   npm run dev:web    (Frontend)');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();