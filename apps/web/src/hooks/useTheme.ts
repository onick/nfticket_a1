'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleTheme: () => void
  systemTheme: 'light' | 'dark'
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      systemTheme: 'light',
      
      setTheme: (newTheme) => {
        const systemTheme = getSystemTheme()
        const resolvedTheme = newTheme === 'system' ? systemTheme : newTheme
        
        applyTheme(resolvedTheme)
        
        set({
          theme: newTheme,
          resolvedTheme,
          systemTheme
        })
      },
      
      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        get().setTheme(newTheme)
      }
    }),
    {
      name: 'tix-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Initialize system theme listener
          if (typeof window !== 'undefined') {
            const systemTheme = getSystemTheme()
            const resolvedTheme = state.theme === 'system' ? systemTheme : state.theme
            
            state.systemTheme = systemTheme
            state.resolvedTheme = resolvedTheme
            applyTheme(resolvedTheme)
            
            // Listen for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = (e: MediaQueryListEvent) => {
              const newSystemTheme = e.matches ? 'dark' : 'light'
              if (state.theme === 'system') {
                applyTheme(newSystemTheme)
                state.resolvedTheme = newSystemTheme
              }
              state.systemTheme = newSystemTheme
            }
            
            mediaQuery.addEventListener('change', handleChange)
            
            // Cleanup function - not directly supported in Zustand persist
            // Will be handled by the ThemeProvider component
          }
        }
      }
    }
  )
)