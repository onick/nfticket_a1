'use client'

import { useState, useEffect } from 'react'

export interface FavoriteEvent {
  id: string
  title: string
  slug: string
  startDateTime: string
  venue: string
  coverImage: string
  addedAt: number
}

interface UseFavoritesReturn {
  favorites: FavoriteEvent[]
  isFavorite: (eventId: string) => boolean
  toggleFavorite: (event: Omit<FavoriteEvent, 'addedAt'>) => void
  removeFavorite: (eventId: string) => void
  clearFavorites: () => void
  favoritesCount: number
}

const FAVORITES_STORAGE_KEY = 'nfticket_favorites'

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites)
          setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : [])
        }
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error)
        setFavorites([])
      }
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
    }
  }, [favorites])

  const isFavorite = (eventId: string): boolean => {
    return favorites.some(fav => fav.id === eventId)
  }

  const toggleFavorite = (event: Omit<FavoriteEvent, 'addedAt'>): void => {
    setFavorites(prevFavorites => {
      const existingIndex = prevFavorites.findIndex(fav => fav.id === event.id)
      
      if (existingIndex >= 0) {
        // Remove from favorites
        return prevFavorites.filter(fav => fav.id !== event.id)
      } else {
        // Add to favorites
        const newFavorite: FavoriteEvent = {
          ...event,
          addedAt: Date.now()
        }
        return [newFavorite, ...prevFavorites]
      }
    })
  }

  const removeFavorite = (eventId: string): void => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(fav => fav.id !== eventId)
    )
  }

  const clearFavorites = (): void => {
    setFavorites([])
  }

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  }
}

// Hook para obtener estadísticas de favoritos
export const useFavoriteStats = () => {
  const { favorites } = useFavorites()

  const upcomingFavorites = favorites.filter(fav => 
    new Date(fav.startDateTime) > new Date()
  )

  const pastFavorites = favorites.filter(fav => 
    new Date(fav.startDateTime) <= new Date()
  )

  const favoritesByMonth = favorites.reduce((acc, fav) => {
    const month = new Date(fav.startDateTime).toLocaleDateString('es-DO', { 
      year: 'numeric', 
      month: 'long' 
    })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    total: favorites.length,
    upcoming: upcomingFavorites.length,
    past: pastFavorites.length,
    favoritesByMonth,
    recentlyAdded: favorites
      .sort((a, b) => b.addedAt - a.addedAt)
      .slice(0, 5)
  }
}