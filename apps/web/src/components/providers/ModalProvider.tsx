'use client'

import { AuthModal } from '../auth/AuthModal'
import { useAuthModal } from '../../hooks/useAuthModal'

export function ModalProvider() {
  const { isOpen, mode, close } = useAuthModal()

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={close}
      initialMode={mode}
    />
  )
}