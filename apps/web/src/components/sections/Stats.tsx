'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Calendar, Users, Star, MapPin } from 'lucide-react'

const stats = [
  {
    id: 1,
    icon: Calendar,
    value: 2547,
    suffix: '+',
    label: 'Eventos Realizados',
    description: 'En los últimos 12 meses',
    color: 'text-blue-600'
  },
  {
    id: 2,
    icon: Users,
    value: 85000,
    suffix: '+',
    label: 'Usuarios Activos',
    description: 'Comunidad creciente',
    color: 'text-green-600'
  },
  {
    id: 3,
    icon: Star,
    value: 4.8,
    suffix: '/5',
    label: 'Calificación Promedio',
    description: 'Basado en +15K reseñas',
    color: 'text-yellow-600'
  },
  {
    id: 4,
    icon: MapPin,
    value: 45,
    suffix: '+',
    label: 'Ciudades',
    description: 'En todo el país',
    color: 'text-purple-600'
  }
]

// Hook para animar números
function useCountUp(end: number, duration: number = 2000, shouldStart: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) return

    let startTime: number
    let animationFrame: number

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount)
      }
    }

    animationFrame = requestAnimationFrame(updateCount)

    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, shouldStart])

  return count
}

// StatCard component to properly use hooks
function StatCard({ stat, index, isInView }: { stat: typeof stats[0], index: number, isInView: boolean }) {
  const Icon = stat.icon
  const animatedValue = useCountUp(stat.value, 2000, isInView)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1 + 0.2,
        type: "spring",
        stiffness: 100
      }}
      className="text-center space-y-4"
    >
      {/* Icon */}
      <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center group-hover:bg-white dark:group-hover:bg-gray-600 transition-colors">
        <Icon className={`w-8 h-8 ${stat.color}`} />
      </div>

      {/* Value */}
      <div>
        <div className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-1">
          {stat.value === 4.8 ? 
            `${animatedValue === 0 ? '0.0' : (animatedValue / 10).toFixed(1)}${stat.suffix}` :
            `${animatedValue.toLocaleString()}${stat.suffix}`
          }
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
          {stat.label}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {stat.description}
        </p>
      </div>
    </motion.div>
  )
}

export function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
        >
          Números que Hablan por Sí Solos
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          La confianza de miles de usuarios y organizadores respalda nuestra plataforma 
          como la mejor opción para eventos en República Dominicana.
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} isInView={isInView} />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center pt-8"
      >
        <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
          <span className="text-gray-600 dark:text-gray-300">¿Listo para ser parte de estas estadísticas?</span>
          <button className="btn-primary">
            Crear tu Primer Evento
          </button>
        </div>
      </motion.div>
    </div>
  )
}