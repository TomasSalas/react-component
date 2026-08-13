import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useId } from '../hooks/useId'

const Tooltip = ({
  children,
  content,
  position = 'top',
  variant = 'light',
  delay = 300,
  nowrap = false,
  className = ''
}) => {
  const tooltipId = useId()
  const [isVisible, setIsVisible] = useState(false)
  const [isPositioned, setIsPositioned] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState({})
  const [arrowStyle, setArrowStyle] = useState({}) // NUEVO: Estado para el estilo de la flecha
  const [actualPosition, setActualPosition] = useState(position)
  const timeoutRef = useRef(null)
  const tooltipRef = useRef(null)
  const triggerRef = useRef(null)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      setIsPositioned(false)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
    setIsPositioned(false)
  }

  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current && !isPositioned) {
      const tooltip = tooltipRef.current
      const trigger = triggerRef.current
      const rect = trigger.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      }

      let newPosition = position
      let top = 0
      let left = 0

      if (position === 'top' && rect.top - tooltipRect.height < 10) {
        newPosition = 'bottom'
      } else if (position === 'bottom' && rect.bottom + tooltipRect.height > viewport.height - 10) {
        newPosition = 'top'
      } else if (position === 'left' && rect.left - tooltipRect.width < 10) {
        newPosition = 'right'
      } else if (position === 'right' && rect.right + tooltipRect.width > viewport.width - 10) {
        newPosition = 'left'
      }

      switch (newPosition) {
        case 'top':
          top = rect.top - tooltipRect.height - 8
          left = rect.left + rect.width / 2 - tooltipRect.width / 2
          break
        case 'bottom':
          top = rect.bottom + 8
          left = rect.left + rect.width / 2 - tooltipRect.width / 2
          break
        case 'left':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2
          left = rect.left - tooltipRect.width - 8
          break
        case 'right':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2
          left = rect.right + 8
          break
      }

      const finalLeft = Math.max(10, Math.min(left, viewport.width - tooltipRect.width - 10))
      const finalTop = Math.max(10, Math.min(top, viewport.height - tooltipRect.height - 10))

      setActualPosition(newPosition)
      setTooltipStyle({ top: `${finalTop}px`, left: `${finalLeft}px` })

      let newArrowStyle = {}
      if (newPosition === 'top' || newPosition === 'bottom') {
        const triggerCenterX = rect.left + rect.width / 2
        let arrowLeft = triggerCenterX - finalLeft

        arrowLeft = Math.max(12, Math.min(arrowLeft, tooltipRect.width - 12))
        newArrowStyle = { left: `${arrowLeft}px`, transform: 'translateX(-50%) rotate(45deg)' }
      } else {
        const triggerCenterY = rect.top + rect.height / 2
        let arrowTop = triggerCenterY - finalTop

        arrowTop = Math.max(12, Math.min(arrowTop, tooltipRect.height - 12))
        newArrowStyle = { top: `${arrowTop}px`, transform: 'translateY(-50%) rotate(45deg)' }
      }
      setArrowStyle(newArrowStyle)
      setIsPositioned(true)
    }
  }, [isVisible, position, isPositioned])

  const getTooltipClasses = () => {
    const baseClasses =
      'rui:fixed rui:z-[9999] rui:px-3 rui:py-2 rui:text-sm rui:font-medium rui:rounded-lg rui:transition-opacity rui:duration-150 rui:ease-in-out'

    const variantClasses = {
      light: 'rui:bg-white rui:text-gray-900 rui:shadow-xl rui:border rui:border-gray-200',
      dark: 'rui:bg-gray-900 rui:text-white rui:shadow-xl',
      primary: 'rui:bg-[var(--primary-bg)] rui:text-white rui:shadow-xl',
      success: 'rui:bg-[var(--success-bg)] rui:text-white rui:shadow-xl',
      error: 'rui:bg-[var(--error-bg)] rui:text-white rui:shadow-xl',
      warning: 'rui:bg-[var(--warning-bg)] rui:text-white rui:shadow-xl'
    }

    const visibilityClasses = isVisible && isPositioned ? 'rui:opacity-100' : 'rui:opacity-0 rui:pointer-events-none'

    const selectedVariant = variantClasses[variant] || variantClasses.light

    return `${baseClasses} ${selectedVariant} ${visibilityClasses}`
  }

  const getArrowClasses = () => {
    const arrowBase = 'rui:absolute rui:w-2.5 rui:h-2.5 rui:border-solid'

    const borderPositions = {
      top: 'rui:border-b rui:border-r',
      bottom: 'rui:border-t rui:border-l',
      left: 'rui:border-t rui:border-r',
      right: 'rui:border-b rui:border-l'
    }

    const variantClasses = {
      light: `rui:bg-white rui:border-gray-200 ${borderPositions[actualPosition]}`,
      dark: 'rui:bg-gray-900',
      primary: 'rui:bg-[var(--primary-bg)]',
      success: 'rui:bg-[var(--success-bg)]',
      error: 'rui:bg-[var(--error-bg)]',
      warning: 'rui:bg-[var(--warning-bg)]'
    }

    const positionClasses = {
      top: 'rui:bottom-[-5px]',
      bottom: 'rui:top-[-5px]',
      left: 'rui:right-[-5px]',
      right: 'rui:left-[-5px]'
    }

    const selectedVariant = variantClasses[variant] || variantClasses.light

    return `${arrowBase} ${selectedVariant} ${positionClasses[actualPosition]}`
  }

  const tooltipContent = isVisible && (
    <div
      ref={tooltipRef}
      id={tooltipId}
      className={getTooltipClasses()}
      style={tooltipStyle}
      role='tooltip'
      aria-hidden={!isPositioned}
    >
      <div className={`${nowrap ? 'rui:whitespace-nowrap' : 'rui:max-w-xs'}`}>{content}</div>
      {/* Añadimos el objeto style a la flecha */}
      {isPositioned && <div className={getArrowClasses()} style={arrowStyle} />}
    </div>
  )

  return (
    <div
      ref={triggerRef}
      className={`rui:relative rui:inline-flex rui:w-fit ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      aria-describedby={isVisible && isPositioned ? tooltipId : undefined}
    >
      {children}
      {createPortal(tooltipContent, document.body)}
    </div>
  )
}

Tooltip.displayName = 'Tooltip'

export default Tooltip
