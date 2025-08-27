'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MessageSquare,
  Filter,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  createdAt: string
  updatedAt?: string
  helpful: number
  notHelpful: number
  verified: boolean
  eventAttended?: boolean
}

interface EventReviewsProps {
  eventId: string
  eventTitle: string
}

const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user_1',
    userName: 'María González',
    userAvatar: undefined,
    rating: 5,
    title: '¡Increíble experiencia!',
    comment: 'El evento estuvo espectacular. La organización fue perfecta, el lugar excelente y el artista dio todo en el escenario. Definitivamente recomiendo asistir a eventos de este organizador.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 12,
    notHelpful: 1,
    verified: true,
    eventAttended: true
  },
  {
    id: '2',
    userId: 'user_2',
    userName: 'Carlos Rodríguez',
    userAvatar: undefined,
    rating: 4,
    title: 'Muy buen evento',
    comment: 'Disfruté mucho el concierto. El sonido estuvo bien, aunque creo que pudo haber mejor ventilación en el lugar. Aún así, vale la pena la experiencia.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 8,
    notHelpful: 0,
    verified: true,
    eventAttended: true
  },
  {
    id: '3',
    userId: 'user_3',
    userName: 'Ana Martínez',
    userAvatar: undefined,
    rating: 3,
    title: 'Regular',
    comment: 'El evento estuvo okay, pero esperaba un poco más. El artista llegó tarde y eso afectó un poco la experiencia. Los precios de comida y bebida estaban elevados.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    helpful: 5,
    notHelpful: 3,
    verified: false,
    eventAttended: false
  }
]

export const EventReviews = ({ eventId, eventTitle }: EventReviewsProps) => {
  const { user, isAuthenticated } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful' | 'rating'>('newest')
  const [filterRating, setFilterRating] = useState<number | null>(null)
  
  // New review form state
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: ''
  })

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const totalReviews = reviews.length

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / totalReviews) * 100
  }))

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'helpful':
        return (b.helpful - b.notHelpful) - (a.helpful - a.notHelpful)
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  }).filter(review => filterRating === null || review.rating === filterRating)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated || !user) {
      alert('Debes iniciar sesión para escribir una reseña')
      return
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      alert('Por favor completa todos los campos')
      return
    }

    const review: Review = {
      id: `review_${Date.now()}`,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userAvatar: user.avatar,
      rating: newReview.rating,
      title: newReview.title.trim(),
      comment: newReview.comment.trim(),
      createdAt: new Date().toISOString(),
      helpful: 0,
      notHelpful: 0,
      verified: true, // In real app, this would be based on ticket purchase
      eventAttended: true
    }

    setReviews(prev => [review, ...prev])
    setNewReview({ rating: 5, title: '', comment: '' })
    setShowReviewForm(false)
  }

  const handleHelpful = (reviewId: string, helpful: boolean) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            helpful: helpful ? review.helpful + 1 : review.helpful,
            notHelpful: !helpful ? review.notHelpful + 1 : review.notHelpful
          }
        : review
    ))
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Reseñas y Calificaciones
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {averageRating.toFixed(1)}
              </div>
              <div>
                {renderStars(Math.round(averageRating), 'lg')}
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {totalReviews} reseña{totalReviews !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {rating}
                  </span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 w-8">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        {isAuthenticated && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Escribir reseña</span>
            </button>
          </div>
        )}
      </div>

      {/* Write Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm overflow-hidden"
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Escribe tu reseña
            </h4>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calificación *
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= newReview.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                  className="input w-full"
                  placeholder="Resumen de tu experiencia..."
                  maxLength={100}
                  required
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comentario *
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  className="input w-full h-32 resize-none"
                  placeholder="Comparte tu experiencia detallada del evento..."
                  maxLength={500}
                  required
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {newReview.comment.length}/500 caracteres
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Publicar reseña
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
              className="input text-sm py-2 px-3"
            >
              <option value="">Todas las calificaciones</option>
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>
                  {rating} estrella{rating !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input text-sm py-2 px-3"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="helpful">Más útiles</option>
            <option value="rating">Mejor calificación</option>
          </select>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          Mostrando {sortedReviews.length} de {totalReviews} reseñas
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                  {review.userAvatar ? (
                    <img 
                      src={review.userAvatar} 
                      alt={review.userName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    review.userName.charAt(0)
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {review.userName}
                    </h4>
                    {review.verified && (
                      <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded-full">
                        Verificado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating, 'sm')}
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                <Flag className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                {review.title}
              </h5>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.comment}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleHelpful(review.id, true)}
                  className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.helpful}</span>
                </button>
                <button
                  onClick={() => handleHelpful(review.id, false)}
                  className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <ThumbsDown className="w-4 h-4" />
                  <span>{review.notHelpful}</span>
                </button>
              </div>

              {review.eventAttended && (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  ✓ Asistió al evento
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {sortedReviews.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay reseñas que mostrar
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {filterRating 
              ? `No hay reseñas con ${filterRating} estrella${filterRating !== 1 ? 's' : ''}`
              : 'Sé el primero en escribir una reseña de este evento'
            }
          </p>
        </div>
      )}
    </div>
  )
}