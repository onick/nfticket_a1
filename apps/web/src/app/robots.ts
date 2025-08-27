import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/perfil',
          '/admin',
          '/api',
          '/crear-evento',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/perfil',
          '/admin',
          '/api',
          '/crear-evento',
        ],
      },
    ],
    sitemap: 'https://tix.do/sitemap.xml',
    host: 'https://tix.do',
  }
}