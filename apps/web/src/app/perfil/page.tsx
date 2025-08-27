'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Save,
  Eye,
  EyeOff,
  Camera,
  ArrowLeft,
  Shield,
  Bell,
  CreditCard,
  Trash2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  dateOfBirth?: string
  address?: string
  city?: string
  country?: string
  preferredLanguage: string
  timezone: string
  marketingOptIn: boolean
  twoFactorEnabled: boolean
  emailVerified: boolean
  createdAt: string
  lastLoginAt?: string
}

interface PasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const languages = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' }
]

const timezones = [
  { value: 'America/Santo_Domingo', name: 'República Dominicana (UTC-4)' },
  { value: 'America/New_York', name: 'New York (UTC-5)' },
  { value: 'America/Los_Angeles', name: 'Los Angeles (UTC-8)' },
  { value: 'Europe/Madrid', name: 'Madrid (UTC+1)' }
]

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'billing'>('profile')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile>({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    avatar: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: 'DO',
    preferredLanguage: 'es',
    timezone: 'America/Santo_Domingo',
    marketingOptIn: false,
    twoFactorEnabled: false,
    emailVerified: true,
    createdAt: '',
    lastLoginAt: ''
  })

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }
    
    if (user) {
      setProfileData({
        ...user,
        phone: user.phone || '',
        avatar: user.avatar || '',
        dateOfBirth: '',
        address: '',
        city: '',
        country: 'DO',
        twoFactorEnabled: false,
        emailVerified: true
      })
    }
  }, [authLoading, isAuthenticated, user, router])

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const updatePasswordField = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const updates = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        preferredLanguage: profileData.preferredLanguage,
        timezone: profileData.timezone,
        marketingOptIn: profileData.marketingOptIn
      }

      const response = await apiClient.updateProfile(updates)
      
      if (response.success && response.data) {
        updateUser(response.data)
        alert('Perfil actualizado exitosamente')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error al actualizar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    if (passwordData.newPassword.length < 8) {
      alert('La nueva contraseña debe tener al menos 8 caracteres')
      return
    }

    setSaving(true)
    try {
      // In a real app, this would call the change password API
      console.log('Changing password...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      alert('Contraseña actualizada exitosamente')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Error al cambiar la contraseña')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would upload to a CDN
      const reader = new FileReader()
      reader.onload = (event) => {
        updateProfileField('avatar', event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible'
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Dashboard</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mi Perfil
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'profile', label: 'Información Personal', icon: User },
                  { key: 'security', label: 'Seguridad', icon: Shield },
                  { key: 'preferences', label: 'Preferencias', icon: Bell },
                  { key: 'billing', label: 'Facturación', icon: CreditCard }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === key
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {profileData.avatar ? (
                        <img 
                          src={profileData.avatar} 
                          alt="Avatar" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`
                      )}
                    </div>
                    <label 
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <Camera className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {profileData.email}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        profileData.emailVerified
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {profileData.emailVerified ? 'Email Verificado' : 'Email No Verificado'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => updateProfileField('firstName', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => updateProfileField('lastName', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="input w-full opacity-60 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Para cambiar tu email, contacta soporte
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone || ''}
                      onChange={(e) => updateProfileField('phone', e.target.value)}
                      className="input w-full"
                      placeholder="(809) 555-0123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      value={profileData.dateOfBirth || ''}
                      onChange={(e) => updateProfileField('dateOfBirth', e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={profileData.city || ''}
                      onChange={(e) => updateProfileField('city', e.target.value)}
                      className="input w-full"
                      placeholder="Santo Domingo"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Información de Cuenta
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Miembro desde:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatDate(profileData.createdAt)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-300">Último acceso:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatDate(profileData.lastLoginAt || '')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-8">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {saving ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="p-6 space-y-8">
                {/* Change Password */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Cambiar Contraseña
                  </h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contraseña Actual
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => updatePasswordField('currentPassword', e.target.value)}
                          className="input w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nueva Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => updatePasswordField('newPassword', e.target.value)}
                          className="input w-full pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => updatePasswordField('confirmPassword', e.target.value)}
                        className="input w-full"
                      />
                    </div>
                    <button
                      onClick={handleChangePassword}
                      disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? <LoadingSpinner size="sm" /> : 'Cambiar Contraseña'}
                    </button>
                  </div>
                </div>

                {/* Two Factor Authentication */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Autenticación de Dos Factores
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        2FA {profileData.twoFactorEnabled ? 'Activado' : 'Desactivado'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {profileData.twoFactorEnabled 
                          ? 'Tu cuenta está protegida con 2FA'
                          : 'Agrega una capa extra de seguridad'
                        }
                      </div>
                    </div>
                    <button
                      onClick={() => updateProfileField('twoFactorEnabled', !profileData.twoFactorEnabled)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        profileData.twoFactorEnabled
                          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                      }`}
                    >
                      {profileData.twoFactorEnabled ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>

                {/* Login Sessions */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Sesiones Activas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Sesión Actual
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            macOS • Chrome • Santo Domingo, DO
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        Ahora
                      </span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-red-200 dark:border-red-800 pt-8">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                    Zona de Peligro
                  </h3>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900 dark:text-red-100">
                          Eliminar Cuenta
                        </h4>
                        <p className="text-sm text-red-700 dark:text-red-200 mt-1 mb-4">
                          Una vez eliminada tu cuenta, no podrás recuperar tus datos. Esta acción es permanente.
                        </p>
                        <button className="btn-secondary text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 flex items-center space-x-2">
                          <Trash2 className="w-4 h-4" />
                          <span>Eliminar Cuenta</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Idioma y Región
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Idioma Preferido
                      </label>
                      <select
                        value={profileData.preferredLanguage}
                        onChange={(e) => updateProfileField('preferredLanguage', e.target.value)}
                        className="input w-full"
                      >
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Zona Horaria
                      </label>
                      <select
                        value={profileData.timezone}
                        onChange={(e) => updateProfileField('timezone', e.target.value)}
                        className="input w-full"
                      >
                        {timezones.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Notificaciones
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Marketing y Promociones
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Recibir emails sobre eventos, ofertas especiales y noticias
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.marketingOptIn}
                          onChange={(e) => updateProfileField('marketingOptIn', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {saving ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar Preferencias</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="p-6">
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Información de Facturación
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Gestiona tus métodos de pago y historial de facturación
                  </p>
                  <div className="space-y-3 max-w-sm mx-auto">
                    <button className="btn-primary w-full">
                      Agregar Método de Pago
                    </button>
                    <button className="btn-secondary w-full">
                      Ver Historial de Facturación
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}