'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Globe, 
  Users, 
  FileText,
  Info
} from 'lucide-react'
import { Button } from '../ui/Button'

export interface BusinessInfo {
  companyName: string
  rnc: string
  industry: string
  website: string
  size: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'
}

interface BusinessInfoFormProps {
  onComplete: (businessData: any) => void
  onBack: () => void
}

const industries = [
  { value: 'entertainment', label: 'Entretenimiento y Eventos' },
  { value: 'technology', label: 'Tecnología' },
  { value: 'education', label: 'Educación' },
  { value: 'healthcare', label: 'Salud' },
  { value: 'finance', label: 'Finanzas' },
  { value: 'retail', label: 'Retail y Comercio' },
  { value: 'hospitality', label: 'Turismo y Hospitalidad' },
  { value: 'nonprofit', label: 'Organizaciones sin fines de lucro' },
  { value: 'government', label: 'Gobierno' },
  { value: 'other', label: 'Otro' }
]

const companySizes = [
  { value: '1-10', label: '1-10 empleados', description: 'Startup o pequeña empresa' },
  { value: '11-50', label: '11-50 empleados', description: 'Pequeña empresa' },
  { value: '51-200', label: '51-200 empleados', description: 'Mediana empresa' },
  { value: '201-1000', label: '201-1000 empleados', description: 'Gran empresa' },
  { value: '1000+', label: '1000+ empleados', description: 'Corporación' }
]

export const BusinessInfoForm = ({ onComplete, onBack }: BusinessInfoFormProps) => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    companyName: '',
    rnc: '',
    industry: '',
    website: '',
    size: '1-10'
  })
  const [errors, setErrors] = useState<Partial<BusinessInfo>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<BusinessInfo> = {}

    if (!businessInfo.companyName.trim()) {
      newErrors.companyName = 'El nombre de la empresa es requerido'
    }

    if (!businessInfo.rnc.trim()) {
      newErrors.rnc = 'El RNC es requerido'
    } else if (!/^\d{9}$|^\d{11}$/.test(businessInfo.rnc.replace(/-/g, ''))) {
      newErrors.rnc = 'El RNC debe tener 9 u 11 dígitos'
    }

    if (!businessInfo.industry) {
      newErrors.industry = 'Selecciona una industria'
    }

    if (businessInfo.website && !/^https?:\/\/.+/.test(businessInfo.website)) {
      newErrors.website = 'El sitio web debe comenzar con http:// o https://'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Transform businessInfo to match API expectations
      const companyInfo = {
        name: businessInfo.companyName,
        rnc: businessInfo.rnc,
        industry: businessInfo.industry,
        website: businessInfo.website || undefined,
        size: businessInfo.size
      }
      
      onComplete(companyInfo)
    } catch (error) {
      console.error('Business info submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Información de tu Empresa
        </h3>
        <p className="text-sm text-gray-600">
          Estos datos nos ayudan a personalizar tu experiencia corporativa
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Company Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Empresa *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={businessInfo.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Ej: Eventos Premium RD"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.companyName 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                } bg-white text-gray-900`}
              />
            </div>
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
            )}
          </div>

          {/* RNC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RNC *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={businessInfo.rnc}
                onChange={(e) => handleChange('rnc', e.target.value)}
                placeholder="123456789"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.rnc 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                } bg-white text-gray-900`}
              />
            </div>
            {errors.rnc && (
              <p className="mt-1 text-sm text-red-600">{errors.rnc}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Registro Nacional de Contribuyentes
            </p>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sitio Web (Opcional)
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={businessInfo.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://tuempresa.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.website 
                    ? 'border-red-300' 
                    : 'border-gray-300'
                } bg-white text-gray-900`}
              />
            </div>
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industria *
            </label>
            <select
              value={businessInfo.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.industry 
                  ? 'border-red-300' 
                  : 'border-gray-300'
              } bg-white text-gray-900`}
            >
              <option value="">Selecciona una industria</option>
              {industries.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
            )}
          </div>

          {/* Company Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de la Empresa *
            </label>
            <select
              value={businessInfo.size}
              onChange={(e) => handleChange('size', e.target.value as BusinessInfo['size'])}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900"
            >
              {companySizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            {businessInfo.size && (
              <p className="mt-1 text-xs text-gray-500">
                {companySizes.find(s => s.value === businessInfo.size)?.description}
              </p>
            )}
          </div>
        </div>

        {/* Enterprise Features Preview */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-purple-900 mb-2">
                ✨ Características Empresariales Incluidas
              </h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-purple-800">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Gestión de equipos y roles
                </div>
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Dashboard corporativo
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Reportes avanzados
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  API y integraciones
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={onBack}
            disabled={isSubmitting}
          >
            ← Atrás
          </Button>
          
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta Empresarial'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}