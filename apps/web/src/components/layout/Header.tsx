'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Heart,
  ShoppingCart,
  Calendar,
  Ticket,
  LogOut,
  Settings,
  Plus,
  Building2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../stores/auth'
import { useAuthModal } from '../../hooks/useAuthModal'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useCartStore } from '../../stores/cart'
import { PermissionGuard, usePermissionCheck } from '../../contexts/PermissionContext'

const navigation = [
  { name: 'Eventos', href: '/eventos' },
  { name: 'Categorías', href: '/categorias' },
  { name: 'Crear Evento', href: '/crear-evento' },
  { name: 'Empresas', href: '/empresas' },
]

interface HeaderProps {
  variant?: 'default' | 'overlay'
}

export function Header({ variant = 'default' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const router = useRouter()
  
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore()
  const { openLogin, openRegister } = useAuthModal()
  const { totalItems, openCart } = useCartStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.refresh()
  }

  // Definir estilos según la variante
  const getHeaderClasses = () => {
    if (variant === 'overlay') {
      return isScrolled 
        ? 'glass-card shadow-lg backdrop-blur-md bg-white/90 dark:bg-gray-800/90' 
        : 'bg-transparent'
    }
    return isScrolled 
      ? 'glass-card shadow-lg backdrop-blur-md dark:bg-gray-800/90 dark:shadow-gray-900/10' 
      : 'bg-transparent'
  }

  const getTextClasses = () => {
    if (variant === 'overlay') {
      return isScrolled 
        ? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
        : 'text-white hover:text-primary-200'
    }
    return 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
  }

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${getHeaderClasses()}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">NFTicket</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Buscar eventos, artistas, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 w-full"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${getTextClasses()} font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <button className="btn-ghost p-2">
                  <Heart className="w-5 h-5" />
                </button>
                <button 
                  onClick={openCart}
                  className="btn-ghost p-2 relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </button>
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="btn-ghost p-2 flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                      >
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Mi Dashboard
                        </Link>
                        <PermissionGuard requiredPermission="analytics:view">
                          <Link
                            href="/dashboard/corporate"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Building2 className="w-4 h-4 mr-3" />
                            Dashboard Corporativo
                          </Link>
                        </PermissionGuard>
                        <Link
                          href="/perfil"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Mi Perfil
                        </Link>
                        <Link
                          href="/mis-eventos"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Calendar className="w-4 h-4 mr-3" />
                          Mis Eventos
                        </Link>
                        <Link
                          href="/configuracion"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Configuración
                        </Link>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Cerrar Sesión
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/crear-evento" className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Crear Evento</span>
                </Link>
              </>
            ) : (
              <>
                <button 
                  onClick={openLogin}
                  className="btn-ghost"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={openRegister}
                  className="btn-primary"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 pr-4 w-full"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-gray-200 pt-4">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <ThemeToggle />
                        <button className="btn-ghost p-2">
                          <Heart className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            openCart()
                            setIsMenuOpen(false)
                          }}
                          className="btn-ghost p-2 relative"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {totalItems}
                            </span>
                          )}
                        </button>
                        <Link href="/dashboard" className="btn-ghost p-2" onClick={() => setIsMenuOpen(false)}>
                          <User className="w-5 h-5" />
                        </Link>
                      </div>

                      <Link
                        href="/crear-evento"
                        className="btn-primary text-center flex items-center justify-center space-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Crear Evento</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="btn-secondary text-center w-full flex items-center justify-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-center pb-3 border-b border-gray-200 dark:border-gray-700">
                        <ThemeToggle />
                      </div>
                      <button
                        onClick={() => {
                          openLogin()
                          setIsMenuOpen(false)
                        }}
                        className="btn-ghost text-center w-full"
                      >
                        Iniciar Sesión
                      </button>
                      <button
                        onClick={() => {
                          openRegister()
                          setIsMenuOpen(false)
                        }}
                        className="btn-primary text-center w-full"
                      >
                        Registrarse
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}