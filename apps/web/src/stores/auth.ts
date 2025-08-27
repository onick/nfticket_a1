import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient, User, LoginData, RegisterData } from '../lib/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (credentials: LoginData) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
  checkAuth: () => Promise<void>
  refreshToken: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.login(credentials)
          if (response.success && response.data) {
            const { user, token } = response.data
            apiClient.setToken(token)
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } else {
            throw new Error(response.message || 'Login failed')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiClient.register(userData)
          if (response.success && response.data) {
            const { user, token } = response.data
            apiClient.setToken(token)
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } else {
            throw new Error(response.message || 'Registration failed')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed'
          set({
            isLoading: false,
            error: errorMessage
          })
          throw error
        }
      },

      logout: () => {
        apiClient.setToken(null)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        })
      },

      clearError: () => {
        set({ error: null })
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          return
        }

        try {
          set({ isLoading: true })
          const response = await apiClient.getProfile()
          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            // Token is invalid
            get().logout()
          }
        } catch (error) {
          // Token is invalid or expired
          get().logout()
        } finally {
          set({ isLoading: false })
        }
      },

      refreshToken: async () => {
        try {
          const response = await apiClient.refreshToken()
          if (response.success && response.data) {
            const { token } = response.data
            apiClient.setToken(token)
            set({ token })
          } else {
            get().logout()
          }
        } catch (error) {
          get().logout()
        }
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },
    }),
    {
      name: 'tix-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token)
        }
      },
    }
  )
)