'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { NotificationProvider } from '../providers/NotificationProvider'
import { PermissionProvider } from '../contexts/PermissionContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            gcTime: 10 * 60 * 1000, // 10 minutos
            retry: (failureCount, error: any) => {
              // No reintentar en errores 404 o 403
              if (error?.status === 404 || error?.status === 403) {
                return false
              }
              // Máximo 3 reintentos
              return failureCount < 3
            },
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <PermissionProvider userId="user_1">
          <NotificationProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </NotificationProvider>
        </PermissionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}