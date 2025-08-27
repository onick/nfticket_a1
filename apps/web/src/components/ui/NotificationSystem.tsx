'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  X, 
  Bell,
  Gift,
  Ticket,
  Calendar
} from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'promotional' | 'event'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  persistent?: boolean
  timestamp?: number
}

interface NotificationSystemProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5" />
    case 'error':
      return <XCircle className="w-5 h-5" />
    case 'warning':
      return <AlertCircle className="w-5 h-5" />
    case 'info':
      return <Info className="w-5 h-5" />
    case 'promotional':
      return <Gift className="w-5 h-5" />
    case 'event':
      return <Calendar className="w-5 h-5" />
    default:
      return <Bell className="w-5 h-5" />
  }
}

const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
    case 'promotional':
      return 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-200'
    case 'event':
      return 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-200'
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200'
  }
}

const getIconColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
      return 'text-blue-500'
    case 'promotional':
      return 'text-purple-500'
    case 'event':
      return 'text-indigo-500'
    default:
      return 'text-gray-500'
  }
}

const NotificationItem = ({ 
  notification, 
  onDismiss 
}: { 
  notification: Notification
  onDismiss: (id: string) => void 
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!notification.persistent && notification.duration !== 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onDismiss(notification.id), 300)
      }, notification.duration || 5000)

      return () => clearTimeout(timer)
    }
  }, [notification, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss(notification.id), 300)
  }

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return ''
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `hace ${days} día${days > 1 ? 's' : ''}`
    if (hours > 0) return `hace ${hours} hora${hours > 1 ? 's' : ''}`
    if (minutes > 0) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    return 'hace un momento'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        x: isVisible ? 0 : 300, 
        scale: isVisible ? 1 : 0.9 
      }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      className={`
        relative max-w-sm w-full border rounded-lg shadow-lg p-4 mb-4
        ${getNotificationStyles(notification.type)}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 ${getIconColor(notification.type)}`}>
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm leading-5">
            {notification.title}
          </h4>
          <p className="text-sm opacity-90 mt-1 leading-5">
            {notification.message}
          </p>
          
          {notification.timestamp && (
            <p className="text-xs opacity-70 mt-2">
              {formatTimestamp(notification.timestamp)}
            </p>
          )}
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="text-sm font-medium underline hover:no-underline mt-2"
            >
              {notification.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export const NotificationSystem = ({ 
  notifications, 
  onDismiss 
}: NotificationSystemProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-h-screen overflow-hidden">
      <AnimatePresence>
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now()
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Convenience methods
  const success = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'success', title, message })
  }

  const error = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'error', title, message })
  }

  const warning = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'warning', title, message })
  }

  const info = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'info', title, message })
  }

  const promotional = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'promotional', title, message })
  }

  const eventNotification = (title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ ...options, type: 'event', title, message })
  }

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
    promotional,
    eventNotification
  }
}