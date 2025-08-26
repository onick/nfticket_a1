'use client'

import { useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Initialize theme on client side
    setTheme(theme)
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const store = useTheme.getState()
      if (store.theme === 'system') {
        const newSystemTheme = e.matches ? 'dark' : 'light'
        store.setTheme('system') // This will trigger the resolved theme update
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme, setTheme])

  return <>{children}</>
}