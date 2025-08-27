import { useAuthStore } from '@/stores/auth'

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading: loading, 
    login, 
    logout, 
    register, 
    checkAuth,
    updateUser 
  } = useAuthStore()
  
  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    checkAuth,
    updateUser
  }
}