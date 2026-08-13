import React, { useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import clsx from 'clsx'
import { useId } from '../hooks/useId'

const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  placement = 'right',
  size = 'md',
  closeOnOverlayClick = true,
  overflowY = true,
  className = ''
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const drawerRef = useRef(null)
  const previousFocusRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement
      setShouldRender(true)
      const timer = setTimeout(() => setIsMounted(true), 10)
      return () => clearTimeout(timer)
    } else {
      setIsMounted(false)
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const getFocusableElements = () => {
    if (!drawerRef.current) return []
    return Array.from(
      drawerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    )
  }

  const handleKeyDown = useCallback((event) => {
    if (!isOpen) return

    if (event.key === 'Escape') {
      onClose()
      return
    }

    if (event.key === 'Tab') {
      const focusable = getFocusableElements()
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
      drawerRef.current?.focus({ preventScroll: true })
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus?.({ preventScroll: true })
    }
  }, [isOpen, handleKeyDown])

  if (typeof document === 'undefined' || !shouldRender) return null

  const sizeClasses = {
    md: placement === 'left' || placement === 'right' ? 'rui:max-w-md' : 'rui:max-h-[30vh]',
    lg: placement === 'left' || placement === 'right' ? 'rui:max-w-lg' : 'rui:max-h-[40vh]',
    xl: placement === 'left' || placement === 'right' ? 'rui:max-w-xl' : 'rui:max-h-[50vh]',
    '2xl': placement === 'left' || placement === 'right' ? 'rui:max-w-2xl' : 'rui:max-h-[60vh]',
    '3xl': placement === 'left' || placement === 'right' ? 'rui:max-w-3xl' : 'rui:max-h-[70vh]',
    '4xl': placement === 'left' || placement === 'right' ? 'rui:max-w-4xl' : 'rui:max-h-[80vh]',
    '5xl': placement === 'left' || placement === 'right' ? 'rui:max-w-5xl' : 'rui:max-h-[90vh]',
    full: placement === 'left' || placement === 'right' ? 'rui:max-w-full' : 'rui:max-h-full'
  }

  const placementClasses = {
    right: 'rui:right-0 rui:top-0 rui:h-full',
    left: 'rui:left-0 rui:top-0 rui:h-full',
    top: 'rui:top-0 rui:left-0 rui:w-full',
    bottom: 'rui:bottom-0 rui:left-0 rui:w-full'
  }

  const transitionClasses = {
    right: isMounted ? 'rui:translate-x-0' : 'rui:translate-x-full',
    left: isMounted ? 'rui:translate-x-0' : 'rui:-translate-x-full',
    top: isMounted ? 'rui:translate-y-0' : 'rui:-translate-y-full',
    bottom: isMounted ? 'rui:translate-y-0' : 'rui:translate-y-full'
  }

  return createPortal(
    <div className='rui:fixed rui:inset-0 rui:z-[9999] rui:flex rui:overflow-hidden rui:select-none'>
      {/* Fondo oscuro (Backdrop) */}
      <div
        className={clsx(
          'rui:fixed rui:inset-0 rui:bg-black/50 rui:backdrop-blur-sm rui:transition-opacity rui:duration-300',
          isMounted ? 'rui:opacity-100' : 'rui:opacity-0',
          // Cambiamos el cursor según si es cliqueable o no
          closeOnOverlayClick ? 'rui:cursor-pointer' : 'rui:cursor-default'
        )}
        onClick={() => {
          if (closeOnOverlayClick) onClose()
        }}
      />

      {/* Panel del Drawer */}
      <div
        ref={drawerRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx(
          'rui:fixed rui:bg-white rui:shadow-2xl rui:transition-transform rui:duration-300 rui:ease-in-out rui:flex rui:flex-col rui:w-full rui:focus:outline-none',
          placementClasses[placement],
          sizeClasses[size],
          transitionClasses[placement],
          className
        )}
      >
        <div className='rui:flex rui:items-center rui:justify-between rui:px-4 rui:py-1.5 rui:border-b rui:border-gray-100'>
          <h3 id={titleId} className='rui:text-lg rui:font-semibold rui:text-gray-900 rui:truncate'>
            {title}
          </h3>
          <button
            onClick={onClose}
            className='rui:p-2 rui:rounded-full rui:hover:bg-gray-100 rui:active:scale-90 rui:text-gray-500 rui:transition-[background-color,transform] rui:duration-150 rui:cursor-pointer'
            aria-label='Cerrar'
          >
            <X className='rui:w-5 rui:h-5' />
          </button>
        </div>

        <div className={clsx('rui:flex-1 rui:p-4', { 'rui:overflow-y-auto': overflowY })}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

Drawer.displayName = 'Drawer'
export default Drawer
