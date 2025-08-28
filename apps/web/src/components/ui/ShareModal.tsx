'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Copy, 
  Check, 
  Share,
  MessageCircle,
  Send,
  Mail,
  ExternalLink
} from 'lucide-react'
import { useShare, getSocialShareUrls } from '@/hooks/useShare'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    id: string
    title: string
    description: string
    slug: string
    startDateTime: string
    venue: string
  }
}

export const ShareModal = ({ isOpen, onClose, event }: ShareModalProps) => {
  const { share, copyToClipboard, shareSupported, isSharing } = useShare()
  const [copied, setCopied] = useState(false)
  
  const eventUrl = `${window.location.origin}/eventos/${event.slug}`
  const shareText = `¡Mira este evento increíble! ${event.title} - ${event.venue}`
  
  const socialUrls = getSocialShareUrls(eventUrl, event.title, shareText)

  const handleNativeShare = async () => {
    await share({
      title: event.title,
      text: shareText,
      url: eventUrl
    })
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(eventUrl)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSocialShare = (url: string, platform?: string) => {
    if (platform === 'instagram') {
      // Instagram doesn't have direct share URL, so we copy the text and open Instagram
      copyToClipboard(`${shareText} ${eventUrl}`)
      window.open('https://www.instagram.com/', '_blank')
      // Show a message about copying
      alert('Texto copiado al portapapeles. Pégalo en tu historia o post de Instagram!')
    } else {
      window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
    }
  }

  const socialOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      url: socialUrls.whatsapp,
      platform: 'whatsapp'
    },
    {
      name: 'Facebook',
      icon: ExternalLink,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: socialUrls.facebook,
      platform: 'facebook'
    },
    {
      name: 'Twitter',
      icon: ExternalLink,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: socialUrls.twitter,
      platform: 'twitter'
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-blue-500 hover:bg-blue-600',
      url: socialUrls.telegram,
      platform: 'telegram'
    },
    {
      name: 'Instagram',
      icon: ExternalLink,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      url: socialUrls.instagram,
      platform: 'instagram'
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: socialUrls.email,
      platform: 'email'
    }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Compartir Evento
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Event Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
              {event.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {new Date(event.startDateTime).toLocaleDateString('es-DO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {event.venue}
            </p>
          </div>

          {/* Share Options */}
          <div className="p-6">
            {/* Native Share (if supported) */}
            {shareSupported && (
              <button
                onClick={handleNativeShare}
                disabled={isSharing}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors mb-4"
              >
                <Share className="w-5 h-5" />
                <span>{isSharing ? 'Compartiendo...' : 'Compartir'}</span>
              </button>
            )}

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors mb-6"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span>¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copiar enlace</span>
                </>
              )}
            </button>

            {/* Social Media Options */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Compartir en redes sociales
              </p>
              <div className="grid grid-cols-3 gap-3">
                {socialOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => handleSocialShare(option.url, option.platform)}
                    className={`flex flex-col items-center p-3 rounded-lg text-white transition-colors ${option.color}`}
                  >
                    <option.icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Event URL Preview */}
            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Enlace del evento:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 break-all">
                {eventUrl}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}