'use client'

import Link from 'next/link'
import { 
  Ticket, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  Download
} from 'lucide-react'

const navigation = {
  eventos: [
    { name: 'Explorar Eventos', href: '/eventos' },
    { name: 'Música', href: '/categoria/musica' },
    { name: 'Comedia', href: '/categoria/comedia' },
    { name: 'Teatro', href: '/categoria/teatro' },
    { name: 'Deportes', href: '/categoria/deportes' },
  ],
  organizadores: [
    { name: 'Crear Evento', href: '/crear-evento' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Precios', href: '/precios' },
    { name: 'Recursos', href: '/recursos' },
    { name: 'API', href: '/api-docs' },
  ],
  empresa: [
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Carreras', href: '/carreras' },
    { name: 'Prensa', href: '/prensa' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contacto', href: '/contacto' },
  ],
  soporte: [
    { name: 'Centro de Ayuda', href: '/ayuda' },
    { name: 'Preguntas Frecuentes', href: '/faq' },
    { name: 'Términos de Uso', href: '/terminos' },
    { name: 'Política de Privacidad', href: '/privacidad' },
    { name: 'Política de Reembolso', href: '/reembolso' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/tixdo' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/tixdo' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/tixdo' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/tixdo' },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">TIX</span>
            </Link>
            
            <p className="text-gray-400 leading-relaxed max-w-sm">
              La plataforma más completa para descubrir, crear y gestionar eventos 
              increíbles en República Dominicana.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Virgilio Díaz Ordóñez 201, Santo Domingo, RD</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (809) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@tix.do</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-white font-bold mb-4">Eventos</h3>
            <ul className="space-y-3">
              {navigation.eventos.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Organizadores</h3>
            <ul className="space-y-3">
              {navigation.organizadores.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Empresa</h3>
            <ul className="space-y-3">
              {navigation.empresa.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Soporte</h3>
            <ul className="space-y-3">
              {navigation.soporte.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Download Section */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">Descarga Nuestra App</h3>
              <p className="text-gray-400">
                Lleva TIX contigo y nunca te pierdas un evento increíble
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Descargar para</div>
                  <div className="font-semibold">iOS</div>
                </div>
              </button>
              
              <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl transition-colors">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-400">Descargar para</div>
                  <div className="font-semibold">Android</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <span>© 2024 TIX. Todos los derechos reservados.</span>
              <div className="flex items-center space-x-2">
                <span>🌱</span>
                <span>Somos Carbon-Neutral</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400 text-sm mt-4 md:mt-0">
              <span>🔒 Sitio 100% Seguro</span>
              <span>🛡️ PCI Compliant</span>
              <span>🇩🇴 Hecho en RD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}