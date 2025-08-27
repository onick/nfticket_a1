'use client'

import { createContext, useContext, ReactNode } from 'react'
import { NotificationSystem, useNotifications } from '@/components/ui/NotificationSystem'

type NotificationContextType = ReturnType<typeof useNotifications>

const NotificationContext = createContext<NotificationContextType | null>(null)

export const useNotificationContext = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const notificationMethods = useNotifications()

  return (
    <NotificationContext.Provider value={notificationMethods}>
      {children}
      <NotificationSystem 
        notifications={notificationMethods.notifications}
        onDismiss={notificationMethods.dismissNotification}
      />
    </NotificationContext.Provider>
  )
}