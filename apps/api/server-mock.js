// Servidor mock mejorado para TIX 2.0
const fastify = require('fastify')({ logger: true })

// Register CORS
fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:3000'],
  credentials: true
})

// Mock data
const mockEvents = [
  {
    id: 'event_1',
    title: 'Concierto de Merengue - Los Hermanos Rosario',
    slug: 'concierto-merengue-hermanos-rosario',
    description: 'Una noche increíble con los mejores artistas de merengue dominicano. Los Hermanos Rosario presentan sus mejores éxitos en una velada que no podrás olvidar.',
    longDescription: 'Este concierto promete ser uno de los eventos musicales más importantes del año. Los Hermanos Rosario, íconos del merengue dominicano, presentarán sus clásicos más queridos junto con nuevas composiciones que han conquistado corazones en toda Latinoamérica. El evento incluirá un espectáculo de luces de última generación y la participación especial de artistas invitados.',
    startDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    venue: 'Teatro Nacional Eduardo Brito',
    isOnline: false,
    category: 'music',
    tags: ['merengue', 'musica-dominicana', 'concierto', 'teatro-nacional'],
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
    ],
    maxCapacity: 2000,
    viewCount: 156,
    shareCount: 23,
    status: 'PUBLISHED',
    organizerId: {
      id: 'org_1',
      firstName: 'Carlos',
      lastName: 'Organizador',
      email: 'organizador@tix.com'
    },
    ticketTypes: [
      {
        _id: 'ticket_type_1',
        name: 'General',
        description: 'Acceso general al evento',
        price: 1500,
        currency: 'DOP',
        totalQuantity: 1500,
        availableQuantity: 1500,
        maxQuantityPerOrder: 6,
        salesStartAt: new Date().toISOString(),
        salesEndAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: 'ticket_type_2', 
        name: 'VIP',
        description: 'Acceso VIP con los mejores asientos y bebidas incluidas',
        price: 3000,
        currency: 'DOP',
        totalQuantity: 500,
        availableQuantity: 500,
        maxQuantityPerOrder: 4,
        salesStartAt: new Date().toISOString(),
        salesEndAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'event_2',
    title: 'Conferencia Tech RD 2025 - El Futuro de la Tecnología',
    slug: 'conferencia-tech-rd-2025',
    description: 'El evento tecnológico más importante de República Dominicana. Charlas magistrales, workshops y networking.',
    longDescription: 'Tech RD 2025 reúne a los líderes tecnológicos más influyentes de la región. Durante tres días intensos, participarás en conferencias sobre inteligencia artificial, blockchain, desarrollo móvil, y las últimas tendencias en transformación digital.',
    startDateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDateTime: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
    venue: 'Centro de Convenciones Hotel Embajador',
    isOnline: false,
    category: 'technology',
    tags: ['tecnologia', 'programacion', 'ia', 'desarrollo', 'networking'],
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    maxCapacity: 1000,
    viewCount: 89,
    shareCount: 12,
    status: 'PUBLISHED',
    organizerId: {
      id: 'org_2',
      firstName: 'Ana',
      lastName: 'Tech',
      email: 'ana@techrd.com'
    },
    ticketTypes: [
      {
        _id: 'ticket_type_3',
        name: 'Acceso Completo',
        description: 'Acceso a todas las conferencias y workshops',
        price: 2500,
        currency: 'DOP',
        totalQuantity: 800,
        availableQuantity: 800,
        maxQuantityPerOrder: 5
      },
      {
        _id: 'ticket_type_4',
        name: 'Estudiante',
        description: 'Precio especial para estudiantes (requiere ID)',
        price: 1000,
        currency: 'DOP',
        totalQuantity: 200,
        availableQuantity: 200,
        maxQuantityPerOrder: 2
      }
    ]
  }
]

const mockUsers = [
  {
    id: 'user_1',
    email: 'organizador@tix.com',
    firstName: 'Carlos',
    lastName: 'Organizador',
    avatar: null,
    role: 'ORGANIZER'
  },
  {
    id: 'user_2',
    email: 'usuario@tix.com',
    firstName: 'María',
    lastName: 'Usuario',
    avatar: null,
    role: 'USER'
  }
]

// Health check
fastify.get('/health', async (request, reply) => {
  return { 
    success: true, 
    message: 'TIX API is running!',
    timestamp: new Date().toISOString()
  }
})

// Auth routes
fastify.post('/api/v1/auth/register', async (request, reply) => {
  const { email, password, firstName, lastName } = request.body
  
  const mockUser = {
    id: 'user_' + Date.now(),
    email,
    firstName,
    lastName,
    avatar: null,
    preferredLanguage: 'es',
    timezone: 'America/Santo_Domingo',
    marketingOptIn: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const mockToken = 'mock_jwt_token_' + Date.now()

  return {
    success: true,
    message: 'Usuario registrado exitosamente',
    data: {
      user: mockUser,
      token: mockToken
    }
  }
})

fastify.post('/api/v1/auth/login', async (request, reply) => {
  const { email, password } = request.body
  
  const mockUser = mockUsers.find(u => u.email === email) || {
    id: 'user_12345',
    email,
    firstName: 'Usuario',
    lastName: 'Demo',
    avatar: null,
    preferredLanguage: 'es',
    timezone: 'America/Santo_Domingo',
    marketingOptIn: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  }

  const mockToken = 'mock_jwt_token_' + Date.now()

  return {
    success: true,
    message: 'Login exitoso',
    data: {
      user: mockUser,
      token: mockToken
    }
  }
})

// Get current user
fastify.get('/api/v1/auth/me', async (request, reply) => {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      message: 'No autenticado'
    })
  }

  return {
    success: true,
    data: {
      id: 'user_12345',
      email: 'usuario@tix.com',
      firstName: 'Usuario',
      lastName: 'Demo',
      phone: '809-555-0123',
      avatar: null,
      preferredLanguage: 'es',
      timezone: 'America/Santo_Domingo',
      marketingOptIn: false,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date().toISOString()
    }
  }
})

// Update user profile
fastify.put('/api/v1/auth/me', async (request, reply) => {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      message: 'No autenticado'
    })
  }

  const updates = request.body

  // Mock updated user data
  const updatedUser = {
    id: 'user_12345',
    email: 'usuario@tix.com',
    firstName: updates.firstName || 'Usuario',
    lastName: updates.lastName || 'Demo',
    phone: updates.phone || '809-555-0123',
    avatar: updates.avatar || null,
    preferredLanguage: updates.preferredLanguage || 'es',
    timezone: updates.timezone || 'America/Santo_Domingo',
    marketingOptIn: updates.marketingOptIn || false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastLoginAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return {
    success: true,
    message: 'Perfil actualizado exitosamente',
    data: updatedUser
  }
})

// Events routes
fastify.get('/api/v1/events', async (request, reply) => {
  const { page = 1, limit = 10, category, search } = request.query

  let filteredEvents = [...mockEvents]

  if (category) {
    filteredEvents = filteredEvents.filter(e => e.category === category)
  }

  if (search) {
    filteredEvents = filteredEvents.filter(e => 
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
    )
  }

  return {
    success: true,
    data: {
      events: filteredEvents,
      total: filteredEvents.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredEvents.length / limit)
    }
  }
})

// Get event by ID or slug
fastify.get('/api/v1/events/:identifier', async (request, reply) => {
  const { identifier } = request.params
  
  const event = mockEvents.find(e => e.id === identifier || e.slug === identifier)
  
  if (!event) {
    return reply.status(404).send({
      success: false,
      message: 'Evento no encontrado'
    })
  }

  return {
    success: true,
    data: event
  }
})

// Featured events
fastify.get('/api/v1/events/featured', async (request, reply) => {
  return {
    success: true,
    data: mockEvents
  }
})

// Categories
fastify.get('/api/v1/categories', async (request, reply) => {
  return {
    success: true,
    data: [
      { id: 'music', name: 'Música', icon: '🎵', color: '#FF6B6B' },
      { id: 'sports', name: 'Deportes', icon: '⚽', color: '#4ECDC4' },
      { id: 'technology', name: 'Tecnología', icon: '💻', color: '#45B7D1' },
      { id: 'business', name: 'Negocios', icon: '💼', color: '#96CEB4' },
      { id: 'arts', name: 'Arte', icon: '🎨', color: '#FFEAA7' },
      { id: 'food', name: 'Gastronomía', icon: '🍽️', color: '#FD79A8' }
    ]
  }
})

// Mock orders data
const mockOrders = [
  {
    id: 'order_1',
    orderNumber: 'TIX-20240101001',
    userId: 'user_12345',
    status: 'COMPLETED',
    totalAmount: 4500,
    currency: 'DOP',
    paymentMethod: 'CARD',
    attendeeInfo: {
      firstName: 'María',
      lastName: 'Usuario',
      email: 'usuario@tix.com',
      phone: '809-555-0123'
    },
    items: [
      {
        eventId: 'event_1',
        eventTitle: 'Concierto de Merengue - Los Hermanos Rosario',
        ticketTypeId: 'ticket_type_1',
        ticketTypeName: 'General',
        price: 1500,
        quantity: 2,
        currency: 'DOP'
      },
      {
        eventId: 'event_1',
        eventTitle: 'Concierto de Merengue - Los Hermanos Rosario',
        ticketTypeId: 'ticket_type_2',
        ticketTypeName: 'VIP',
        price: 3000,
        quantity: 1,
        currency: 'DOP'
      }
    ],
    tickets: [
      {
        id: 'ticket_1',
        ticketNumber: 'TIX-20240101001-001',
        eventId: 'event_1',
        eventTitle: 'Concierto de Merengue - Los Hermanos Rosario',
        ticketTypeId: 'ticket_type_1',
        ticketTypeName: 'General',
        attendeeName: 'María Usuario',
        attendeeEmail: 'usuario@tix.com',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        isUsed: false,
        usedAt: null
      },
      {
        id: 'ticket_2',
        ticketNumber: 'TIX-20240101001-002',
        eventId: 'event_1',
        eventTitle: 'Concierto de Merengue - Los Hermanos Rosario',
        ticketTypeId: 'ticket_type_1',
        ticketTypeName: 'General',
        attendeeName: 'María Usuario',
        attendeeEmail: 'usuario@tix.com',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        isUsed: false,
        usedAt: null
      },
      {
        id: 'ticket_3',
        ticketNumber: 'TIX-20240101001-003',
        eventId: 'event_1',
        eventTitle: 'Concierto de Merengue - Los Hermanos Rosario',
        ticketTypeId: 'ticket_type_2',
        ticketTypeName: 'VIP',
        attendeeName: 'María Usuario',
        attendeeEmail: 'usuario@tix.com',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        isUsed: false,
        usedAt: null
      }
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'order_2',
    orderNumber: 'TIX-20240105002',
    userId: 'user_12345',
    status: 'PENDING',
    totalAmount: 2500,
    currency: 'DOP',
    paymentMethod: 'CARD',
    attendeeInfo: {
      firstName: 'María',
      lastName: 'Usuario',
      email: 'usuario@tix.com',
      phone: '809-555-0123'
    },
    items: [
      {
        eventId: 'event_2',
        eventTitle: 'Conferencia Tech RD 2025 - El Futuro de la Tecnología',
        ticketTypeId: 'ticket_type_3',
        ticketTypeName: 'Acceso Completo',
        price: 2500,
        quantity: 1,
        currency: 'DOP'
      }
    ],
    tickets: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Orders (basic mock)
fastify.post('/api/v1/orders', async (request, reply) => {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      message: 'No autenticado'
    })
  }

  const { items, attendeeInfo, paymentMethod } = request.body

  const mockOrder = {
    id: 'order_' + Date.now(),
    orderNumber: 'TIX-' + Date.now(),
    userId: 'user_12345',
    items,
    totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    currency: items[0]?.currency || 'DOP',
    status: 'PENDING',
    paymentMethod,
    attendeeInfo,
    createdAt: new Date().toISOString()
  }

  return {
    success: true,
    message: 'Orden creada exitosamente',
    data: mockOrder
  }
})

// Get user orders
fastify.get('/api/v1/orders', async (request, reply) => {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      message: 'No autenticado'
    })
  }

  const { page = 1, limit = 10, status } = request.query
  let filteredOrders = [...mockOrders]

  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status)
  }

  return {
    success: true,
    data: {
      orders: filteredOrders,
      total: filteredOrders.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredOrders.length / limit)
    }
  }
})

// Get user tickets
fastify.get('/api/v1/tickets', async (request, reply) => {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      message: 'No autenticado'
    })
  }

  const allTickets = mockOrders.reduce((tickets, order) => {
    if (order.tickets && order.tickets.length > 0) {
      return [...tickets, ...order.tickets.map(ticket => ({
        ...ticket,
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        eventStartDate: mockEvents.find(e => e.id === ticket.eventId)?.startDateTime
      }))]
    }
    return tickets
  }, [])

  return {
    success: true,
    data: {
      tickets: allTickets,
      total: allTickets.length
    }
  }
})

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 4000, host: '0.0.0.0' })
    console.log('🚀 TIX Mock API Server running on http://localhost:4000')
    console.log('📚 Mock server with enhanced event data')
    console.log('🎫 Available events:')
    mockEvents.forEach(event => {
      console.log(`  - ${event.title} (/${event.slug})`)
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()