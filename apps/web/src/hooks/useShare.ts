'use client'

import { useState } from 'react'

interface ShareData {
  title: string
  text?: string
  url: string
}

interface UseShareReturn {
  shareSupported: boolean
  share: (data: ShareData) => Promise<void>
  copyToClipboard: (text: string) => Promise<boolean>
  isSharing: boolean
}

export const useShare = (): UseShareReturn => {
  const [isSharing, setIsSharing] = useState(false)
  
  // Check if Web Share API is supported
  const shareSupported = typeof window !== 'undefined' && 'share' in navigator

  const share = async (data: ShareData): Promise<void> => {
    setIsSharing(true)
    
    try {
      if (shareSupported) {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: data.url
        })
      } else {
        // Fallback: copy to clipboard
        await copyToClipboard(data.url)
        // You could show a toast notification here
        alert('¡Enlace copiado al portapapeles!')
      }
    } catch (error) {
      // User cancelled share or other error
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error)
        // Fallback to clipboard
        try {
          await copyToClipboard(data.url)
          alert('¡Enlace copiado al portapapeles!')
        } catch (clipboardError) {
          console.error('Error copying to clipboard:', clipboardError)
          alert('No se pudo compartir el evento')
        }
      }
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const result = document.execCommand('copy')
        textArea.remove()
        
        return result
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      return false
    }
  }

  return {
    shareSupported,
    share,
    copyToClipboard,
    isSharing
  }
}

// Social media share URLs
export const getSocialShareUrls = (url: string, title: string, text?: string) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(text || title)

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    instagram: `https://www.instagram.com/`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`
  }
}