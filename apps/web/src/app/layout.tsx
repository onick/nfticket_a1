import './globals.css'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'NFTicket - Plataforma de Eventos NFT República Dominicana',
  description: 'La plataforma más avanzada para descubrir, crear y gestionar eventos con tickets NFT en República Dominicana. Experiencias únicas y comunidad en un solo lugar.',
  keywords: ['eventos', 'tickets', 'nft', 'blockchain', 'conciertos', 'teatro', 'republica dominicana', 'santo domingo'],
  authors: [{ name: 'NFTicket Team', url: 'https://nfticket.do' }],
  creator: 'NFTicket',
  publisher: 'NFTicket',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nfticket.do'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'NFTicket - Eventos NFT en República Dominicana',
    description: 'Descubre los mejores eventos en RD. Compra tickets NFT de forma segura y rápida.',
    url: 'https://nfticket.do',
    siteName: 'NFTicket',
    locale: 'es_DO',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NFTicket - Eventos NFT RD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NFTicket - Eventos NFT República Dominicana',
    description: 'La mejor plataforma de eventos NFT en RD',
    images: ['/twitter-image.jpg'],
    creator: '@NFTicketDO',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-code',
    yandex: 'yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}