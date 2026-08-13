import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

const CheckCircleIcon = () => (
  <svg className='rui:w-5 rui:h-5' fill='currentColor' viewBox='0 0 20 20'>
    <path
      fillRule='evenodd'
      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
      clipRule='evenodd'
    />
  </svg>
)

const ExclamationCircleIcon = () => (
  <svg className='rui:w-5 rui:h-5' fill='currentColor' viewBox='0 0 20 20'>
    <path
      fillRule='evenodd'
      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
      clipRule='evenodd'
    />
  </svg>
)

const InformationCircleIcon = () => (
  <svg className='rui:w-5 rui:h-5' fill='currentColor' viewBox='0 0 20 20'>
    <path
      fillRule='evenodd'
      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 101 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
      clipRule='evenodd'
    />
  </svg>
)

const XIcon = () => (
  <svg className='rui:w-5 rui:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
  </svg>
)

const defaultIcons = {
  success: <CheckCircleIcon />,
  error: <ExclamationCircleIcon />,
  warning: <ExclamationCircleIcon />,
  primary: <InformationCircleIcon />
}

let toastId = 0

const alertState = {
  alerts: [],
  listeners: new Set()
}

const addAlert = (data) => {
  const id = toastId++
  const newAlert = {
    id,
    title: data.title || '',
    subtitle: data.subtitle || data.message || '',
    variant: data.variant || 'primary',
    duration: data.duration ?? 5000,
    position: data.position || 'top-right',
    closable: data.closable ?? true,
    icon: data.icon,
    timestamp: Date.now()
  }

  alertState.alerts = [newAlert, ...alertState.alerts]
  alertState.listeners.forEach((listener) => listener(alertState))

  return id
}

const removeAlert = (id) => {
  alertState.alerts = alertState.alerts.filter((alert) => alert.id !== id)
  alertState.listeners.forEach((listener) => listener(alertState))
}

export const alert = Object.assign((data) => addAlert(data), {
  success: (title, options = {}) => addAlert({ ...options, title, variant: 'success' }),
  error: (title, options = {}) => addAlert({ ...options, title, variant: 'error' }),
  warning: (title, options = {}) => addAlert({ ...options, title, variant: 'warning' }),
  primary: (title, options = {}) => addAlert({ ...options, title, variant: 'primary' }),
  dismiss: (id) => {
    if (id !== undefined) {
      removeAlert(id)
    } else {
      alertState.alerts = []
      alertState.listeners.forEach((listener) => listener(alertState))
    }
  }
})

export const AlertContainer = ({ position = 'top-right' }) => {
  const [alerts, setAlerts] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const listener = (state) => {
      setAlerts([...state.alerts])
    }
    alertState.listeners.add(listener)
    listener(alertState)
    return () => {
      alertState.listeners.delete(listener)
    }
  }, [])

  if (!mounted) return null

  const alertsByPosition = alerts.reduce((acc, alert) => {
    const pos = alert.position || position
    if (!acc[pos]) acc[pos] = []
    acc[pos].push(alert)
    return acc
  }, {})

  return createPortal(
    <>
      {Object.entries(alertsByPosition).map(([pos, positionAlerts]) => (
        <div key={pos}>
          {positionAlerts.map((alertData, index) => (
            <AlertInstance
              key={alertData.id}
              alert={alertData}
              stackIndex={index}
              onClose={() => removeAlert(alertData.id)}
            />
          ))}
        </div>
      ))}
    </>,
    document.body
  )
}

const AlertInstance = ({ alert: alertData, stackIndex, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const alertRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    window.requestAnimationFrame(() => {
      setIsVisible(true)
    })

    if (alertData.duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose()
      }, alertData.duration)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [alertData.duration])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const variants = {
    primary: {
      bg: 'rui:bg-[var(--primary-bg)]',
      text: 'rui:text-[var(--primary-text)]',
      border: 'rui:border-[var(--primary-border)]'
    },
    success: {
      bg: 'rui:bg-[var(--success-bg)]',
      text: 'rui:text-[var(--success-text)]',
      border: 'rui:border-[var(--success-border)]'
    },
    error: {
      bg: 'rui:bg-[var(--error-bg)]',
      text: 'rui:text-white',
      border: 'rui:border-[var(--error-border)]'
    },
    warning: {
      bg: 'rui:bg-[var(--warning-bg)]',
      text: 'rui:text-[var(--warning-text)]',
      border: 'rui:border-[var(--warning-border)]'
    }
  }

  const validVariant = variants[alertData.variant] ? alertData.variant : 'primary'
  const variantClasses = variants[validVariant]
  const displayIcon = alertData.icon !== undefined ? alertData.icon : defaultIcons[validVariant]

  const positionClasses = {
    'top-right': 'rui:right-4',
    'top-left': 'rui:left-4',
    'top-center': 'rui:left-1/2 rui:-translate-x-1/2',
    'bottom-right': 'rui:right-4',
    'bottom-left': 'rui:left-4',
    'bottom-center': 'rui:left-1/2 rui:-translate-x-1/2'
  }

  const MAX_VISIBLE = 3
  const SCALE_FACTOR = 0.05
  const OFFSET_FACTOR = 14

  const getTransformStyle = () => {
    if (stackIndex >= MAX_VISIBLE) {
      return {
        opacity: 0,
        pointerEvents: 'none'
      }
    }

    const scale = 1 - stackIndex * SCALE_FACTOR
    const offset = stackIndex * OFFSET_FACTOR
    const opacity = 1 - stackIndex * 0.15
    const yOffset = -offset

    return {
      transform: `scale(${scale}) translateY(${yOffset}px)`,
      zIndex: 50 - stackIndex,
      opacity: Math.max(opacity, 0.5)
    }
  }

  const getPositionStyle = () => {
    const isTop = alertData.position.includes('top')
    const isBottom = alertData.position.includes('bottom')

    if (isTop) {
      return { top: '16px' }
    } else if (isBottom) {
      return { bottom: '16px' }
    }
    return {}
  }

  const alertClasses = clsx(
    'rui:select-none rui:flex rui:items-start rui:gap-3 rui:p-4 rui:rounded-lg rui:shadow-lg rui:border rui:min-w-[320px] rui:max-w-[480px]',
    'rui:transition-[transform,opacity] rui:duration-300 rui:ease-in-out',
    'rui:fixed rui:origin-bottom',
    positionClasses[alertData.position] || positionClasses['top-right'],
    variantClasses.bg,
    variantClasses.text,
    variantClasses.border,
    {
      'rui:opacity-0 rui:translate-x-full': !isVisible && alertData.position.includes('right'),
      'rui:opacity-0 rui:-translate-x-full': !isVisible && alertData.position.includes('left'),
      'rui:opacity-0 rui:-translate-y-full':
        !isVisible && alertData.position.includes('top') && alertData.position.includes('center'),
      'rui:opacity-0 rui:translate-y-full':
        !isVisible && alertData.position.includes('bottom') && alertData.position.includes('center'),
      'rui:opacity-100 rui:translate-x-0': isVisible
    }
  )

  return (
    <div
      ref={alertRef}
      className={alertClasses}
      style={{ ...getPositionStyle(), ...getTransformStyle() }}
      role='alert'
      aria-live='assertive'
      aria-atomic='true'
    >
      {displayIcon && <div className='rui:shrink-0 rui:mt-0.5'>{displayIcon}</div>}

      <div className='rui:flex-1 rui:min-w-0'>
        {alertData.title && <h3 className='rui:font-semibold rui:text-sm rui:mb-1'>{alertData.title}</h3>}
        {alertData.subtitle && <p className='rui:text-sm rui:opacity-90'>{alertData.subtitle}</p>}
      </div>

      {alertData.closable && (
        <button
          onClick={handleClose}
          className='rui:shrink-0 rui:opacity-70 rui:hover:opacity-100 rui:active:scale-90 rui:transition-[opacity,transform] rui:duration-150'
          aria-label='Cerrar alerta'
        >
          <XIcon />
        </button>
      )}
    </div>
  )
}
