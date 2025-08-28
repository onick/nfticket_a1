'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth'

interface BusinessAccountGuardProps {
  children: React.ReactNode
}

export function BusinessAccountGuard({ children }: BusinessAccountGuardProps) {
  const router = useRouter()
  const { user, isAuthenticated, canAccessCorporateDashboard } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/auth/login?redirect=/dashboard/corporate')
      return
    }

    if (!canAccessCorporateDashboard()) {
      // Redirect to individual dashboard if not a business account
      router.push('/dashboard')
      return
    }
  }, [isAuthenticated, user, router, canAccessCorporateDashboard])

  // Show loading state while checking authentication
  if (!isAuthenticated || !canAccessCorporateDashboard()) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}