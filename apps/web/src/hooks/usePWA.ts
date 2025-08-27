'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAHook {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  showInstallPrompt: () => Promise<void>
  isSupported: boolean
  installationStatus: 'idle' | 'prompting' | 'installing' | 'installed' | 'dismissed'
}

export const usePWA = (): PWAHook => {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installationStatus, setInstallationStatus] = useState<PWAHook['installationStatus']>('idle')

  // Check if PWA is supported
  const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator

  useEffect(() => {
    if (!isSupported) return

    // Register service worker
    registerServiceWorker()

    // Check if app is already installed
    checkInstallationStatus()

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    // Listen for app installed
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallationStatus('installed')
      setDeferredPrompt(null)
    }

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial online status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isSupported])

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered successfully:', registration)

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version is available
                console.log('New version available')
                if (confirm('Nueva versión disponible. ¿Deseas actualizarla?')) {
                  window.location.reload()
                }
              }
            })
          }
        })
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  const checkInstallationStatus = () => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = (window.navigator as any).standalone === true
    const isInstalled = isStandalone || isIOSStandalone

    setIsInstalled(isInstalled)
    if (isInstalled) {
      setInstallationStatus('installed')
    }
  }

  const showInstallPrompt = async (): Promise<void> => {
    if (!deferredPrompt) {
      console.log('No install prompt available')
      return
    }

    setInstallationStatus('prompting')

    try {
      // Show the install prompt
      await deferredPrompt.prompt()

      // Wait for user response
      const choiceResult = await deferredPrompt.userChoice
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setInstallationStatus('installing')
      } else {
        console.log('User dismissed the install prompt')
        setInstallationStatus('dismissed')
      }

      // Clear the prompt
      setDeferredPrompt(null)
      setIsInstallable(false)
    } catch (error) {
      console.error('Error showing install prompt:', error)
      setInstallationStatus('idle')
    }
  }

  return {
    isInstallable,
    isInstalled,
    isOnline,
    showInstallPrompt,
    isSupported,
    installationStatus
  }
}

// Hook for notifications permission
export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied'

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return 'denied'
    }
  }

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return

    return new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      ...options
    })
  }

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    isGranted: permission === 'granted'
  }
}