import Joi from 'joi'

// User validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email debe ser válido',
    'any.required': 'Email es requerido'
  }),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')).required().messages({
    'string.min': 'Contraseña debe tener al menos 8 caracteres',
    'string.pattern.base': 'Contraseña debe tener al menos una minúscula, una mayúscula y un número',
    'any.required': 'Contraseña es requerida'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Nombre debe tener al menos 2 caracteres',
    'string.max': 'Nombre no puede exceder 50 caracteres',
    'any.required': 'Nombre es requerido'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Apellido debe tener al menos 2 caracteres',
    'string.max': 'Apellido no puede exceder 50 caracteres',
    'any.required': 'Apellido es requerido'
  }),
  phone: Joi.string().pattern(/^[+]?[\d\s-()]+$/).optional().messages({
    'string.pattern.base': 'Teléfono debe ser válido'
  })
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email debe ser válido',
    'any.required': 'Email es requerido'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Contraseña es requerida'
  })
})

// Event validation schemas  
export const createEventSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(10).max(5000).required(),
  longDescription: Joi.string().max(20000).optional(),
  startDateTime: Joi.date().greater('now').required(),
  endDateTime: Joi.date().greater(Joi.ref('startDateTime')).optional(),
  venue: Joi.string().min(5).max(500).optional(),
  isOnline: Joi.boolean().optional(),
  onlineUrl: Joi.string().uri().optional(),
  category: Joi.string().valid('music', 'sports', 'technology', 'business', 'arts', 'food', 'health', 'education').required(),
  tags: Joi.array().items(Joi.string()).max(10).optional(),
  coverImage: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  maxCapacity: Joi.number().integer().min(1).max(100000).optional(),
  ticketTypes: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      description: Joi.string().optional(),
      price: Joi.number().min(0).required(),
      totalQuantity: Joi.number().integer().min(1).optional(),
      maxQuantityPerOrder: Joi.number().integer().min(1).max(50).optional(),
      salesStartAt: Joi.date().optional(),
      salesEndAt: Joi.date().optional()
    })
  ).min(1).required()
})

// Generic validation helper
export const validateBody = (schema: Joi.ObjectSchema) => {
  return async (request: any, reply: any) => {
    try {
      const { error, value } = schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true
      })
      
      if (error) {
        return reply.status(400).send({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        })
      }
      
      request.validatedBody = value
    } catch (err) {
      return reply.status(500).send({
        success: false,
        message: 'Error interno del servidor'
      })
    }
  }
}