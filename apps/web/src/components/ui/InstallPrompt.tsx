'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  X, 
  Smartphone, 
  Monitor,
  ArrowUp,
  Share,
  Plus
} from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

interface InstallPromptProps {
  onInstall?: () => void
  onDismiss?: () => void
}

export const InstallPrompt = ({ onInstall, onDismiss }: InstallPromptProps) => {
  const { isInstallable, isInstalled, showInstallPrompt, installationStatus } = usePWA()
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false)
  const [isIOSSafari, setIsIOSSafari] = useState(false)

  useEffect(() => {
    // Check if we're on iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
    setIsIOSSafari(isIOS && isSafari)

    // Show prompt after a delay if installable and not dismissed
    if (isInstallable && !isInstalled && !hasBeenDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 5000) // Show after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled, hasBeenDismissed])

  // Check if user has dismissed the prompt before
  useEffect(() => {
    const dismissed = localStorage.getItem('install-prompt-dismissed')
    if (dismissed === 'true') {
      setHasBeenDismissed(true)
    }
  }, [])

  const handleInstall = async () => {
    if (isIOSSafari) {
      setIsVisible(true) // Show iOS instructions
      return
    }

    try {
      await showInstallPrompt()
      onInstall?.()
    } catch (error) {
      console.error('Install failed:', error)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setHasBeenDismissed(true)
    localStorage.setItem('install-prompt-dismissed', 'true')
    onDismiss?.()
  }

  const handleRemindLater = () => {
    setIsVisible(false)
    // Don't set as permanently dismissed, just hide for this session
  }

  if (isInstalled || (!isInstallable && !isIOSSafari) || hasBeenDismissed) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleRemindLater}
          />

          {/* Install Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6">
              {isIOSSafari ? (
                // iOS Safari Instructions
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Instalar TIX
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    Para instalar TIX en tu iPhone:
                  </p>

                  <div className="space-y-4 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white font-medium mb-1">
                          Toca el botón compartir
                        </p>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <Share className="w-4 h-4" />
                          <span>En la barra de navegación</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">2</span>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-white font-medium mb-1">
                          Selecciona "Agregar a inicio"
                        </p>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                          <Plus className="w-4 h-4" />
                          <span>En el menú de opciones</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={handleDismiss}
                      className="flex-1 btn-secondary text-sm"
                    >
                      No ahora
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="flex-1 btn-primary text-sm"
                    >
                      Entendido
                    </button>
                  </div>
                </div>
              ) : (
                // Standard PWA Install Prompt
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Instalar TIX
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                    Instala TIX en tu dispositivo para un acceso más rápido y funciones offline.
                  </p>

                  <div className="flex items-center justify-center space-x-6 mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4" />
                      <span>Acceso rápido</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Funciona offline</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleRemindLater}
                      className="flex-1 btn-ghost text-sm"
                    >
                      Recordar después
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="flex-1 btn-secondary text-sm"
                    >
                      No gracias
                    </button>
                    <button
                      onClick={handleInstall}
                      disabled={installationStatus === 'prompting'}
                      className="flex-1 btn-primary text-sm flex items-center justify-center space-x-2"
                    >
                      {installationStatus === 'prompting' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Instalar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Floating install button for header or footer
export const InstallButton = () => {
  const { isInstallable, isInstalled, showInstallPrompt } = usePWA()
  const [isLoading, setIsLoading] = useState(false)

  if (isInstalled || !isInstallable) return null

  const handleInstall = async () => {
    setIsLoading(true)
    try {
      await showInstallPrompt()
    } catch (error) {
      console.error('Install failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleInstall}
      disabled={isLoading}
      className="btn-ghost flex items-center space-x-2 text-sm"
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span>Instalar App</span>
    </button>
  )
}