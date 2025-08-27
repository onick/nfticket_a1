'use client'

import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            {/* 404 Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="text-9xl font-bold text-primary-500 dark:text-primary-400 mb-4">
                404
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                ¡Oops! Página no encontrada
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
                La página que buscas no existe o ha sido movida.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Pero no te preocupes, tenemos muchos eventos increíbles esperándote.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <Home className="w-5 h-5" />
                  <span>Volver al Inicio</span>
                </Link>
                <Link
                  href="/eventos"
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Explorar Eventos</span>
                </Link>
              </div>

              {/* Helpful Links */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enlaces útiles:
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Link
                    href="/categorias"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Categorías
                  </Link>
                  <Link
                    href="/ayuda"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Centro de Ayuda
                  </Link>
                  <Link
                    href="/contacto"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Contacto
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20"></div>
            <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-secondary-200 dark:bg-secondary-800 rounded-full opacity-20"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent-200 dark:bg-accent-800 rounded-full opacity-20"></div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}