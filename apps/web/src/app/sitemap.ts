import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tix.do'
  
  // Static routes
  const staticRoutes = [
    '',
    '/eventos',
    '/categorias',
    '/buscar',
    '/ayuda',
    '/auth/login',
    '/auth/register',
    '/recuperar-password',
    '/verificar-email',
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }))

  // In a real application, you would fetch these from your database
  const eventRoutes = [
    '/eventos/concierto-merengue-hermanos-rosario',
    '/eventos/conferencia-tech-rd-2025',
  ]

  const eventEntries: MetadataRoute.Sitemap = eventRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Category routes
  const categoryRoutes = [
    '/categorias/music',
    '/categorias/sports',
    '/categorias/technology',
    '/categorias/business',
    '/categorias/arts',
    '/categorias/food',
  ]

  const categoryEntries: MetadataRoute.Sitemap = categoryRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    ...staticEntries,
    ...eventEntries,
    ...categoryEntries,
  ]
}