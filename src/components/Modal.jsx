import React, { useEffect, useRef, useCallback, forwardRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import clsx from 'clsx'
import { useId } from '../hooks/useId'

const Modal = forwardRef(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = 'lg',
      closeOnOverlayClick = true,
      variant = 'primary',
      className = '',
      overflowY = false,
      ...props
    },
    ref
  ) => {
    const [shouldRender, setShouldRender] = useState(isOpen)
    const [isAnimating, setIsAnimating] = useState(false)
    const modalRef = useRef(null)
    const previousFocusRef = useRef(null)
    const titleId = useId()

    useEffect(() => {
      if (isOpen) {
        previousFocusRef.current = document.activeElement
        setShouldRender(true)
        const timer = setTimeout(() => setIsAnimating(true), 10)
        return () => clearTimeout(timer)
      } else {
        setIsAnimating(false)
        const timer = setTimeout(() => setShouldRender(false), 300)
        return () => clearTimeout(timer)
      }
    }, [isOpen])

    const getFocusableElements = () => {
      if (!modalRef.current) return []
      return Array.from(
        modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )
    }

    const handleKeyDown = useCallback((event) => {
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
    }, [onClose])

    useEffect(() => {
      if (!shouldRender || !isOpen) return
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
      modalRef.current?.focus({ preventScroll: true })
      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleKeyDown)
        previousFocusRef.current?.focus?.({ preventScroll: true })
      }
    }, [shouldRender, isOpen, handleKeyDown])

    if (typeof document === 'undefined' || !shouldRender) return null

    const sizeClasses = {
      sm: 'rui:max-w-sm',
      md: 'rui:max-w-md',
      lg: 'rui:max-w-lg',
      xl: 'rui:max-w-xl',
      '2xl': 'rui:max-w-2xl',
      '3xl': 'rui:max-w-3xl',
      '4xl': 'rui:max-w-4xl',
      '5xl': 'rui:max-w-5xl',
      '6xl': 'rui:max-w-6xl',
      '7xl': 'rui:max-w-7xl',
      full: 'rui:max-w-full'
    }

    return createPortal(
      <div className='rui:fixed rui:inset-0 rui:z-[9999] rui:flex rui:items-center rui:justify-center rui:p-8'>

        {/* Overlay con Blur Animado desde el inicio */}
        <div
          className={clsx(
            'rui:fixed rui:inset-0 rui:bg-black/60 rui:backdrop-blur-sm rui:transition-opacity rui:duration-300 rui:ease-in-out',
            isAnimating ? 'rui:opacity-100' : 'rui:opacity-0'
          )}
          onClick={closeOnOverlayClick ? onClose : undefined}
          aria-hidden='true'
        />

        {/* Panel Central con Escala y Opacidad */}
        <div
          ref={modalRef}
          role='dialog'
          aria-modal='true'
          aria-labelledby={titleId}
          tabIndex={-1}
          className={clsx(
            'rui:relative rui:bg-white rui:rounded-lg rui:shadow-xl rui:ring-1 rui:ring-black/5 rui:w-full rui:flex rui:flex-col rui:focus:outline-none',
            'rui:transition-[transform,opacity] rui:duration-300 rui:ease-[cubic-bezier(0.16,1,0.3,1)]',
            'rui:max-h-[90vh]',
            isAnimating ? 'rui:scale-100 rui:opacity-100' : 'rui:scale-95 rui:opacity-0',
            sizeClasses[size] || 'rui:max-w-md',
            className
          )}
          {...props}
        >
          <div className='rui:flex rui:items-center rui:justify-between rui:p-4 rui:border-b rui:border-gray-100'>
            <h3 id={titleId} className='rui:text-xl rui:font-semibold rui:text-gray-900 rui:truncate'>{title}</h3>
            <button
              type='button'
              onClick={onClose}
              aria-label='Cerrar'
              className='rui:shrink-0 rui:p-1 rui:rounded-full rui:hover:bg-gray-100 rui:active:scale-90 rui:text-gray-500 rui:transition-[background-color,transform] rui:duration-150 rui:cursor-pointer'
            >
              <X className='rui:w-5 rui:h-5' />
            </button>
          </div>

          <div className={clsx(
            'rui:p-4 rui:flex-1',
            { 'rui:overflow-y-auto': overflowY }
          )}
          >
            {children}
          </div>
        </div>
      </div>,
      document.body
    )
  }
)

Modal.displayName = 'Modal'

export default Modal
