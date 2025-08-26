'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Clock, 
  Smartphone, 
  CreditCard, 
  BarChart3, 
  Users,
  Star
} from 'lucide-react'

const features = [
  {
    id: 1,
    icon: Shield,
    title: 'Compra Segura',
    description: 'Transacciones 100% seguras con encriptación de nivel bancario. Tu dinero y datos están protegidos.',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    id: 2,
    icon: Clock,
    title: 'Entrega Instantánea',
    description: 'Recibe tus tickets al instante en tu email y móvil. Sin esperas, sin complicaciones.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    id: 3,
    icon: Smartphone,
    title: 'App Móvil',
    description: 'Lleva todos tus eventos en el bolsillo. Funciona offline y con reconocimiento QR avanzado.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    id: 4,
    icon: CreditCard,
    title: 'Múltiples Pagos',
    description: 'Paga con tarjeta, transferencia, PayPal o efectivo en puntos autorizados.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
  },
  {
    id: 5,
    icon: BarChart3,
    title: 'Analytics Avanzados',
    description: 'Para organizadores: reportes en tiempo real, insights de audiencia y predicciones de ventas.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  {
    id: 6,
    icon: Users,
    title: 'Comunidad Activa',
    description: 'Conecta con otros fanáticos, comparte experiencias y descubre eventos recomendados.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20'
  }
]

const testimonials = [
  {
    id: 1,
    name: 'María González',
    role: 'Organizadora de Eventos',
    avatar: '/api/placeholder/60/60',
    quote: 'TIX revolucionó cómo manejo mis eventos. Las ventas aumentaron 40% y ahora tengo tiempo para lo que realmente importa: crear experiencias increíbles.',
    rating: 5
  },
  {
    id: 2,
    name: 'Carlos Hernández',
    role: 'Fan de Conciertos',
    avatar: '/api/placeholder/60/60',
    quote: 'Nunca más perdí un evento importante. Las notificaciones personalizadas y la compra rápida hacen toda la diferencia.',
    rating: 5
  },
  {
    id: 3,
    name: 'Ana Martínez',
    role: 'Teatro Nacional',
    avatar: '/api/placeholder/60/60',
    quote: 'Como venue, la integración con TIX nos simplificó todo el proceso. Mejor control de aforo y experiencia premium para nuestros visitantes.',
    rating: 5
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100
    }
  }
}

export function WhyChooseTix() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
        >
          ¿Por Qué Elegir TIX?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          No somos solo otra plataforma de tickets. Somos el ecosistema completo 
          que transforma cómo vives y creas experiencias inolvidables.
        </motion.p>
      </div>

      {/* Features Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="card h-full border-2 border-transparent group-hover:border-primary-200 transition-all duration-300">
                {/* Icon */}
                <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Testimonials */}
      <div className="space-y-8">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl lg:text-3xl font-bold text-center text-gray-900 dark:text-white"
        >
          Lo Que Dicen Nuestros Usuarios
        </motion.h3>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6 space-y-4"
            >
              {/* Stars */}
              <div className="flex space-x-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-100 dark:border-gray-600">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-soft border border-primary-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Listo para Vivir la Experiencia TIX?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
            Únete a miles de usuarios que ya disfrutan de la mejor forma 
            de descubrir y crear eventos increíbles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Explorar Eventos
            </button>
            <button className="btn-outline">
              Crear mi Primer Evento
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}