'use client'

import { motion } from 'framer-motion'
import { 
  Music, 
  Mic, 
  Palette, 
  Trophy, 
  GraduationCap, 
  Heart, 
  Users, 
  Briefcase 
} from 'lucide-react'

const categories = [
  {
    id: 'musica',
    name: 'Música',
    icon: Music,
    count: 425,
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Conciertos, festivales y eventos musicales'
  },
  {
    id: 'comedia',
    name: 'Comedia',
    icon: Mic,
    count: 138,
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-red-500',
    description: 'Stand up, shows de humor y espectáculos'
  },
  {
    id: 'arte',
    name: 'Arte y Cultura',
    icon: Palette,
    count: 267,
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Teatro, exposiciones y eventos culturales'
  },
  {
    id: 'deportes',
    name: 'Deportes',
    icon: Trophy,
    count: 189,
    color: 'bg-green-500',
    gradient: 'from-green-500 to-emerald-500',
    description: 'Eventos deportivos y competiciones'
  },
  {
    id: 'educacion',
    name: 'Educación',
    icon: GraduationCap,
    count: 312,
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-purple-500',
    description: 'Workshops, seminarios y conferencias'
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: Heart,
    count: 94,
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-rose-500',
    description: 'Yoga, meditación y bienestar'
  },
  {
    id: 'social',
    name: 'Social',
    icon: Users,
    count: 201,
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-amber-500',
    description: 'Fiestas, networking y eventos sociales'
  },
  {
    id: 'negocios',
    name: 'Negocios',
    icon: Briefcase,
    count: 156,
    color: 'bg-gray-600',
    gradient: 'from-gray-600 to-slate-600',
    description: 'Conferencias, talleres empresariales'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
}

export function Categories() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
          Explora por Categorías
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Encuentra exactamente lo que buscas. Desde música y arte hasta deportes y educación, 
          tenemos eventos para todos los gustos.
        </p>
      </div>

      {/* Categories Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6"
      >
        {categories.map((category, index) => {
          const Icon = category.icon
          return (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer"
            >
              <div className="card text-center space-y-4 h-full border-2 border-transparent group-hover:border-primary-200 dark:group-hover:border-primary-400 transition-all duration-300">
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Category Name */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {category.description}
                  </p>
                </div>

                {/* Event Count */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-600">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {category.count}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Eventos
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Call to Action */}
      <div className="text-center pt-8">
        <button className="btn-outline">
          Ver Todas las Categorías
        </button>
      </div>
    </div>
  )
}