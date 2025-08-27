'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Star,
  Users,
  CreditCard,
  Ticket,
  Settings,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
}

interface HelpCategory {
  id: string
  name: string
  icon: React.ElementType
  description: string
  color: string
  faqs: FAQ[]
}

const helpCategories: HelpCategory[] = [
  {
    id: 'tickets',
    name: 'Tickets y Compras',
    icon: Ticket,
    description: 'Información sobre compra, reembolsos y tickets',
    color: 'bg-blue-500',
    faqs: [
      {
        id: '1',
        question: '¿Cómo compro tickets para un evento?',
        answer: 'Para comprar tickets: 1) Busca el evento que te interesa, 2) Selecciona el tipo de ticket y cantidad, 3) Agrega al carrito, 4) Procede al checkout y completa el pago. Recibirás tu ticket por email inmediatamente.',
        category: 'tickets',
        helpful: 45,
        notHelpful: 2
      },
      {
        id: '2',
        question: '¿Puedo cancelar o cambiar mis tickets?',
        answer: 'Las políticas de cancelación dependen de cada organizador. Generalmente tienes hasta 24 horas antes del evento para cancelar. Revisa los términos específicos en tu ticket o contacta al organizador.',
        category: 'tickets',
        helpful: 32,
        notHelpful: 5
      },
      {
        id: '3',
        question: '¿Cómo descargo o imprimo mis tickets?',
        answer: 'Ve a tu dashboard > Mis Tickets. Desde ahí puedes ver, descargar o compartir tus tickets. También los recibirás por email al momento de la compra.',
        category: 'tickets',
        helpful: 28,
        notHelpful: 1
      }
    ]
  },
  {
    id: 'account',
    name: 'Cuenta y Perfil',
    icon: Users,
    description: 'Gestión de cuenta, perfil y configuración',
    color: 'bg-green-500',
    faqs: [
      {
        id: '4',
        question: '¿Cómo creo una cuenta en TIX?',
        answer: 'Haz clic en "Registrarse" en la esquina superior derecha. Completa el formulario con tu información básica y verifica tu email. ¡Es gratis y toma menos de 2 minutos!',
        category: 'account',
        helpful: 67,
        notHelpful: 3
      },
      {
        id: '5',
        question: '¿Cómo cambio mi contraseña?',
        answer: 'Ve a tu perfil > Seguridad > Cambiar contraseña. Necesitarás tu contraseña actual y la nueva. Si olvidaste tu contraseña, usa "Recuperar contraseña" en el login.',
        category: 'account',
        helpful: 41,
        notHelpful: 2
      }
    ]
  },
  {
    id: 'payments',
    name: 'Pagos y Facturación',
    icon: CreditCard,
    description: 'Métodos de pago, facturación y reembolsos',
    color: 'bg-purple-500',
    faqs: [
      {
        id: '6',
        question: '¿Qué métodos de pago aceptan?',
        answer: 'Aceptamos todas las tarjetas de crédito y débito (Visa, MasterCard, American Express), transferencias bancarias y pagos móviles. Todos los pagos son procesados de forma segura.',
        category: 'payments',
        helpful: 39,
        notHelpful: 1
      },
      {
        id: '7',
        question: '¿Cuándo se procesa mi pago?',
        answer: 'Los pagos se procesan inmediatamente al confirmar la compra. Recibirás una confirmación por email y tus tickets estarán disponibles al instante.',
        category: 'payments',
        helpful: 25,
        notHelpful: 0
      }
    ]
  },
  {
    id: 'events',
    name: 'Eventos',
    icon: BookOpen,
    description: 'Información sobre eventos y organizadores',
    color: 'bg-orange-500',
    faqs: [
      {
        id: '8',
        question: '¿Cómo encuentro eventos cerca de mí?',
        answer: 'Usa el buscador en la página principal o ve a "Eventos". Puedes filtrar por ubicación, fecha, categoría y precio para encontrar exactamente lo que buscas.',
        category: 'events',
        helpful: 52,
        notHelpful: 4
      },
      {
        id: '9',
        question: '¿Puedo crear mi propio evento?',
        answer: 'Sí! Haz clic en "Crear Evento" en tu dashboard. Completa la información del evento, configura los tickets y publica. Es gratuito crear eventos básicos.',
        category: 'events',
        helpful: 33,
        notHelpful: 2
      }
    ]
  },
  {
    id: 'security',
    name: 'Seguridad',
    icon: Shield,
    description: 'Privacidad, seguridad y protección de datos',
    color: 'bg-red-500',
    faqs: [
      {
        id: '10',
        question: '¿Es seguro comprar en TIX?',
        answer: 'Absolutamente. Usamos encriptación SSL, procesamiento seguro de pagos y cumplimos con los más altos estándares de seguridad. Tu información está protegida.',
        category: 'security',
        helpful: 78,
        notHelpful: 1
      }
    ]
  }
]

const contactMethods = [
  {
    icon: MessageSquare,
    title: 'Chat en Vivo',
    description: 'Respuesta inmediata de 9am a 6pm',
    action: 'Iniciar Chat',
    available: true
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'Respuesta en menos de 24 horas',
    action: 'soporte@tix.com',
    available: true
  },
  {
    icon: Phone,
    title: 'Teléfono',
    description: 'Lun-Vie 9am a 6pm',
    action: '(809) 555-0123',
    available: true
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  // Filter FAQs based on search and category
  const filteredFAQs = helpCategories.flatMap(category => 
    category.faqs.filter(faq => {
      const matchesSearch = searchQuery === '' || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === null || category.id === selectedCategory
      
      return matchesSearch && matchesCategory
    }).map(faq => ({ ...faq, categoryName: category.name, categoryColor: category.color }))
  )

  const handleFeedback = (faqId: string, helpful: boolean) => {
    // In a real app, this would send feedback to the API
    console.log(`FAQ ${faqId} marked as ${helpful ? 'helpful' : 'not helpful'}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-90" />
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  ¿Cómo podemos ayudarte?
                </h1>
                <p className="text-xl opacity-90">
                  Encuentra respuestas rápidas a tus preguntas más frecuentes
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative max-w-2xl mx-auto"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Busca tu pregunta aquí..."
                  className="w-full px-6 py-4 pl-14 text-gray-900 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <Search className="absolute left-5 top-4 w-6 h-6 text-gray-400" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Categories */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Categorías de Ayuda
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {helpCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(
                        selectedCategory === category.id ? null : category.id
                      )}
                      className={`text-left p-6 rounded-xl transition-all hover:scale-105 ${
                        selectedCategory === category.id
                          ? 'bg-white dark:bg-gray-800 shadow-lg ring-2 ring-primary-500'
                          : 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${category.color} text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {category.description}
                          </p>
                          <span className="text-sm text-primary-600 dark:text-primary-400">
                            {category.faqs.length} artículo{category.faqs.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.section>

            {/* FAQ Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedCategory 
                    ? `${helpCategories.find(c => c.id === selectedCategory)?.name}`
                    : searchQuery 
                      ? `Resultados para "${searchQuery}"`
                      : 'Preguntas Frecuentes'
                  }
                </h2>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
                  >
                    Ver todas las categorías
                  </button>
                )}
              </div>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No encontramos resultados
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Intenta con otros términos de búsqueda o contacta a soporte
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            {selectedCategory === null && (
                              <span className={`inline-block w-3 h-3 rounded-full ${faq.categoryColor}`}></span>
                            )}
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {faq.question}
                            </h3>
                          </div>
                          {selectedCategory === null && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {faq.categoryName}
                            </span>
                          )}
                        </div>
                        {expandedFAQ === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-4 border-t border-gray-100 dark:border-gray-700"
                        >
                          <div className="pt-4">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                              {faq.answer}
                            </p>
                            
                            {/* Feedback */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                ¿Te ayudó esta respuesta?
                              </span>
                              <div className="flex items-center space-x-4">
                                <button
                                  onClick={() => handleFeedback(faq.id, true)}
                                  className="flex items-center space-x-1 text-sm text-green-600 hover:text-green-700 dark:text-green-400"
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{faq.helpful}</span>
                                </button>
                                <button
                                  onClick={() => handleFeedback(faq.id, false)}
                                  className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                  <span>{faq.notHelpful}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>

            {/* Contact Support */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  ¿Necesitas más ayuda?
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Nuestro equipo de soporte está aquí para ayudarte
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon
                  return (
                    <div
                      key={index}
                      className="text-center p-6 border border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                    >
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {method.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {method.description}
                      </p>
                      <button className="btn-primary text-sm">
                        {method.action}
                      </button>
                    </div>
                  )
                })}
              </div>

              <div className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Respuesta promedio: 2 horas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>4.9/5 satisfacción</span>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}