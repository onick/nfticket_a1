import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'event' | 'profile'
  author?: string
  publishedDate?: string
  modifiedDate?: string
  schema?: object
  noIndex?: boolean
}

const defaultSEO = {
  title: 'TIX 2.0 - Plataforma de Venta de Tickets para Eventos',
  description: 'Descubre y compra tickets para los mejores eventos en República Dominicana. Conciertos, conferencias, deportes y más. ¡Experiencias inolvidables te esperan!',
  keywords: [
    'tickets', 'eventos', 'conciertos', 'república dominicana', 'santo domingo',
    'espectáculos', 'entretenimiento', 'cultura', 'deportes', 'conferencias'
  ],
  image: '/images/og-image.jpg',
  url: 'https://tix.do',
  type: 'website' as const,
  author: 'TIX 2.0'
}

export const SEOHead = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author,
  publishedDate,
  modifiedDate,
  schema,
  noIndex = false
}: SEOHeadProps) => {
  const seo = {
    title: title ? `${title} | TIX 2.0` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: [...defaultSEO.keywords, ...keywords],
    image: image || defaultSEO.image,
    url: url || defaultSEO.url,
    type,
    author: author || defaultSEO.author
  }

  // Ensure absolute URL for image
  const absoluteImage = seo.image.startsWith('http') 
    ? seo.image 
    : `${defaultSEO.url}${seo.image}`

  // Ensure absolute URL for page
  const absoluteUrl = seo.url.startsWith('http') 
    ? seo.url 
    : `${defaultSEO.url}${seo.url}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <meta name="author" content={seo.author} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={absoluteUrl} />
      
      {/* Dates */}
      {publishedDate && <meta name="article:published_time" content={publishedDate} />}
      {modifiedDate && <meta name="article:modified_time" content={modifiedDate} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.type} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={absoluteUrl} />
      <meta property="og:site_name" content="TIX 2.0" />
      <meta property="og:locale" content="es_DO" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:site" content="@tix_do" />
      <meta name="twitter:creator" content="@tix_do" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      
      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Schema.org structured data */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      
      {/* Default structured data for the website */}
      {!schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TIX 2.0",
              "description": defaultSEO.description,
              "url": defaultSEO.url,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${defaultSEO.url}/buscar?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://facebook.com/tixdo",
                "https://instagram.com/tixdo",
                "https://twitter.com/tix_do"
              ]
            })
          }}
        />
      )}
    </Head>
  )
}

// Utility functions for generating schema
export const generateEventSchema = (event: any) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.title,
  "description": event.description,
  "startDate": event.startDateTime,
  "endDate": event.endDateTime,
  "location": event.isOnline ? {
    "@type": "VirtualLocation",
    "url": event.onlineLink || "https://tix.do"
  } : {
    "@type": "Place",
    "name": event.venue,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Santo Domingo",
      "addressCountry": "DO"
    }
  },
  "image": event.coverImage || "/images/og-image.jpg",
  "organizer": {
    "@type": "Organization",
    "name": `${event.organizerId?.firstName} ${event.organizerId?.lastName}`,
    "url": "https://tix.do"
  },
  "offers": event.ticketTypes?.map((ticket: any) => ({
    "@type": "Offer",
    "name": ticket.name,
    "description": ticket.description,
    "price": ticket.price,
    "priceCurrency": ticket.currency,
    "availability": ticket.availableQuantity > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    "url": `https://tix.do/eventos/${event.slug}`,
    "validFrom": ticket.salesStartAt,
    "validThrough": ticket.salesEndAt
  })),
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": event.isOnline 
    ? "https://schema.org/OnlineEventAttendanceMode" 
    : "https://schema.org/OfflineEventAttendanceMode"
})

export const generateArticleSchema = (article: any) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "publisher": {
    "@type": "Organization",
    "name": "TIX 2.0",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tix.do/logo.png"
    }
  },
  "datePublished": article.publishedDate,
  "dateModified": article.modifiedDate || article.publishedDate
})

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})