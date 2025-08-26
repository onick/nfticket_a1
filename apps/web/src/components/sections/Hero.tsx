'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Play, Star, MapPin, Calendar, Users } from 'lucide-react'

const heroEvents = [
  {
    id: 1,
    title: 'Festival de Jazz Santo Domingo',
    date: '15 Dic 2024',
    venue: 'Teatro Nacional',
    price: 'RD$1,500',
    image: '/api/placeholder/300/200',
    rating: 4.8,
    attendees: 1200
  },
  {
    id: 2, 
    title: 'Concierto Sinfónico',
    date: '20 Dic 2024',
    venue: 'Palacio de Bellas Artes',
    price: 'RD$2,800',
    image: '/api/placeholder/300/200',
    rating: 4.9,
    attendees: 800
  },
  {
    id: 3,
    title: 'Stand Up Comedy Night',
    date: '22 Dic 2024', 
    venue: 'Teatro La Fiesta',
    price: 'RD$875',
    image: '/api/placeholder/300/200',
    rating: 4.7,
    attendees: 450
  }
]

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentEventIndex, setCurrentEventIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % heroEvents.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const currentEvent = heroEvents[currentEventIndex]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 gradient-primary opacity-90" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-7xl font-bold font-display mb-6 leading-tight">
                Descubre los mejores{' '}
                <span className="text-yellow-300">eventos</span>{' '}
                en RD
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
                La plataforma más completa para encontrar, crear y gestionar eventos 
                increíbles en República Dominicana.
              </p>

              {/* Search Bar */}
              <div className="mb-8">
                <form className="relative max-w-lg">
                  <input
                    type="text"
                    placeholder="¿Qué evento buscas?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 text-lg rounded-2xl border-0 focus:ring-4 focus:ring-white/30 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-600"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 p-2 bg-primary-600 hover:bg-primary-700 rounded-xl text-white transition-colors"
                  >
                    <Search className="w-6 h-6" />
                  </button>
                </form>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold shadow-lg">
                  Ver Eventos
                </button>
                <button className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4 rounded-xl font-semibold transition-all">
                  <Play className="w-5 h-5 mr-2" />
                  Ver Demo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">2.5K+</div>
                  <div className="text-blue-100">Eventos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">85K+</div>
                  <div className="text-blue-100">Usuarios</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-300">950+</div>
                  <div className="text-blue-100">Organizadores</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Featured Event Card */}
          <div className="relative">
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
            >
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white bg-primary-600 rounded-full p-4" />
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {currentEvent.title}
                </h3>

                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{currentEvent.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{currentEvent.venue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{currentEvent.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{currentEvent.attendees}+ van</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Desde</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {currentEvent.price}
                    </div>
                  </div>
                </div>

                <button className="w-full btn-primary text-lg py-3 rounded-xl">
                  Comprar Tickets
                </button>
              </div>
            </motion.div>

            {/* Event Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {heroEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEventIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentEventIndex 
                      ? 'bg-white shadow-lg' 
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </motion.div>
      </div>
    </section>
  )
}