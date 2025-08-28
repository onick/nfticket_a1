'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2,
  Users,
  BarChart3,
  Shield,
  Zap,
  HeadphonesIcon,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Globe,
  Phone,
  Mail,
  Clock,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const features = [
  {
    icon: Users,
    title: 'Gestión Multi-Usuario',
    description: 'Administra tu equipo con roles y permisos personalizados. Colaboración en tiempo real.',
    highlight: 'Equipos ilimitados'
  },
  {
    icon: BarChart3,
    title: 'Analytics Avanzados',
    description: 'Reportes detallados, métricas de ROI y dashboards personalizables para tomar decisiones.',
    highlight: 'Datos en tiempo real'
  },
  {
    icon: Shield,
    title: 'Seguridad Enterprise',
    description: 'Certificaciones de seguridad, backup automático y cumplimiento de normativas.',
    highlight: 'SOC 2 Compliance'
  },
  {
    icon: Zap,
    title: 'API & Integraciones',
    description: 'Conecta con tu CRM, ERP y herramientas existentes. API REST completa.',
    highlight: '99.9% Uptime'
  },
  {
    icon: Building2,
    title: 'White Label',
    description: 'Personaliza completamente la plataforma con tu marca, colores y dominio.',
    highlight: 'Tu marca, nuestra tecnología'
  },
  {
    icon: HeadphonesIcon,
    title: 'Soporte Dedicado',
    description: 'Account manager asignado, soporte prioritario 24/7 y onboarding personalizado.',
    highlight: 'Respuesta < 1 hora'
  }
]

const plans = [
  {
    name: 'Profesional',
    price: 299,
    period: '/mes',
    description: 'Perfecto para empresas en crecimiento',
    features: [
      'Hasta 10 usuarios',
      '50 eventos por mes',
      'Analytics básicos',
      'Soporte por email',
      'Integraciones básicas'
    ],
    cta: 'Comenzar Prueba',
    popular: false
  },
  {
    name: 'Enterprise',
    price: 799,
    period: '/mes',
    description: 'Para organizaciones que necesitan escalabilidad',
    features: [
      'Usuarios ilimitados',
      'Eventos ilimitados',
      'Analytics avanzados',
      'Account manager',
      'API completa',
      'White label disponible'
    ],
    cta: 'Solicitar Demo',
    popular: true
  },
  {
    name: 'Custom',
    price: 'Personalizado',
    period: '',
    description: 'Solución a medida para grandes corporaciones',
    features: [
      'Todo lo anterior',
      'Desarrollo personalizado',
      'SLA garantizado',
      'Soporte on-site',
      'Múltiples marcas'
    ],
    cta: 'Contactar',
    popular: false
  }
]

const testimonials = [
  {
    company: 'TechCorp RD',
    logo: '🏢',
    quote: 'NFTicket transformó completamente cómo organizamos nuestros eventos corporativos. La plataforma es intuitiva y los reportes nos ayudan a optimizar cada evento.',
    author: 'María González',
    role: 'Directora de Marketing',
    metrics: { events: 150, attendance: '25K+', satisfaction: '4.8/5' }
  },
  {
    company: 'Banco Popular',
    logo: '🏦',
    quote: 'La integración con nuestros sistemas existentes fue perfecta. El equipo de soporte nos acompañó en cada paso del proceso.',
    author: 'Carlos Martínez',
    role: 'Gerente de Eventos',
    metrics: { events: 200, attendance: '50K+', satisfaction: '4.9/5' }
  },
  {
    company: 'Universidad APEC',
    logo: '🎓',
    quote: 'Desde conferencias académicas hasta eventos estudiantiles, NFTicket nos permite gestionar todo desde una sola plataforma.',
    author: 'Ana Rodríguez',
    role: 'Coordinadora de Eventos',
    metrics: { events: 300, attendance: '75K+', satisfaction: '4.7/5' }
  }
]

const stats = [
  { label: 'Empresas Activas', value: '500+', icon: Building2 },
  { label: 'Eventos Organizados', value: '15K+', icon: Calendar },
  { label: 'Asistentes Procesados', value: '2M+', icon: Users },
  { label: 'Satisfacción Cliente', value: '4.8/5', icon: Star }
]

export default function EmpresasPage() {
  const [selectedPlan, setSelectedPlan] = useState(1)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    employees: '1-50'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', contactForm)
    // Aquí se enviaría el formulario al backend
    alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header variant="overlay" />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full text-blue-200 text-sm mb-6">
                <Award className="w-4 h-4 mr-2" />
                Solución #1 para Eventos Corporativos en RD
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Potencia tus eventos
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {" "}corporativos
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                La plataforma empresarial que necesitas para gestionar eventos profesionales. 
                Desde conferencias hasta team building, todo en un solo lugar.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Solicitar Demo Gratuita
                </button>
                <button className="border-2 border-blue-400 text-blue-300 px-8 py-4 rounded-lg font-semibold hover:bg-blue-400/10 transition-colors">
                  Ver Casos de Éxito
                </button>
              </div>

              <div className="text-sm text-blue-200">
                ✅ Setup gratuito • ✅ Prueba de 30 días • ✅ Soporte dedicado
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-semibold mb-6">Dashboard Empresarial</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span>Eventos Activos</span>
                    <span className="text-green-400 font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span>Asistentes Confirmados</span>
                    <span className="text-blue-400 font-bold">2,847</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span>ROI Promedio</span>
                    <span className="text-yellow-400 font-bold">+145%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para eventos profesionales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas empresariales diseñadas para escalar con tu organización
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="inline-flex items-center text-sm font-medium text-blue-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {feature.highlight}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Planes diseñados para cada empresa
            </h2>
            <p className="text-xl text-gray-600">
              Desde startups hasta grandes corporaciones
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-8 shadow-sm border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-500 ring-4 ring-blue-100' 
                    : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                {plan.popular && (
                  <div className="text-center mb-4">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                    </span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  {typeof plan.price === 'number' && (
                    <div className="text-sm text-gray-500 mt-1">USD + impuestos</div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="text-3xl mr-4">{testimonial.logo}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.company}</div>
                    <div className="text-sm text-gray-500">{testimonial.author} • {testimonial.role}</div>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{testimonial.metrics.events}</div>
                    <div className="text-xs text-gray-500">Eventos</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{testimonial.metrics.attendance}</div>
                    <div className="text-xs text-gray-500">Asistentes</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-yellow-600">{testimonial.metrics.satisfaction}</div>
                    <div className="text-xs text-gray-500">Satisfacción</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                ¿Listo para transformar tus eventos?
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Agenda una demo personalizada y descubre cómo NFTicket puede impulsar tus eventos corporativos.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-blue-400 mr-4" />
                  <div>
                    <div className="font-semibold">Demo de 30 minutos</div>
                    <div className="text-blue-200">Conoce todas las funcionalidades</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Target className="w-6 h-6 text-blue-400 mr-4" />
                  <div>
                    <div className="font-semibold">Consultoría gratuita</div>
                    <div className="text-blue-200">Analizamos tus necesidades específicas</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Award className="w-6 h-6 text-blue-400 mr-4" />
                  <div>
                    <div className="font-semibold">Setup sin costo</div>
                    <div className="text-blue-200">Te ayudamos con la implementación</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Solicita tu demo</h3>
                  <p className="text-gray-600">Nos contactaremos en menos de 24 horas</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email corporativo *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="tu@empresa.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.company}
                      onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="+1 (809) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño de empresa
                  </label>
                  <select
                    value={contactForm.employees}
                    onChange={(e) => setContactForm(prev => ({ ...prev, employees: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="1-50">1-50 empleados</option>
                    <option value="51-200">51-200 empleados</option>
                    <option value="201-1000">201-1000 empleados</option>
                    <option value="1000+">1000+ empleados</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuéntanos sobre tus eventos
                  </label>
                  <textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="¿Qué tipo de eventos organizas? ¿Cuántos por año? ¿Qué desafíos enfrentas?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Solicitar Demo Gratuita
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Al enviar este formulario, aceptas que NFTicket se ponga en contacto contigo.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}