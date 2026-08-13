import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

const Icons = {
  success: (
    <svg className='rui:w-5 rui:h-5 rui:text-emerald-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M5 13l4 4L19 7' />
    </svg>
  ),
  error: (
    <svg className='rui:w-5 rui:h-5 rui:text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M6 18L18 6M6 6l12 12' />
    </svg>
  ),
  warning: (
    <svg className='rui:w-5 rui:h-5 rui:text-amber-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
    </svg>
  ),
  info: (
    <svg className='rui:w-5 rui:h-5 rui:text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
    </svg>
  ),
}

let toastId = 0
const toastState = {
  alerts: [],
  listeners: new Set(),
  subscribe (callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  },
  notify () {
    this.listeners.forEach((callback) => callback([...this.alerts]))
  }
}

export const toast = {
  push: (title, subtitle, variant = 'info', duration = 4000) => {
    const id = toastId++
    const newAlert = { id, title, subtitle, variant, duration, createdAt: Date.now() }
    toastState.alerts = [newAlert, ...toastState.alerts].slice(0, 5)
    toastState.notify()
    return id
  },
  success: (title, subtitle, duration) => toast.push(title, subtitle, 'success', duration),
  error: (title, subtitle, duration) => toast.push(title, subtitle, 'error', duration),
  info: (title, subtitle, duration) => toast.push(title, subtitle, 'info', duration),
  warning: (title, subtitle, duration) => toast.push(title, subtitle, 'warning', duration),
  dismiss: (id) => {
    toastState.alerts = toastState.alerts.filter(a => a.id !== id)
    toastState.notify()
  }
}

const ToastInstance = ({ alert, index, onClose, position }) => {
  const [active, setActive] = useState(false)
  const isTop = position.startsWith('top')

  useEffect(() => {
    const activeTimer = setTimeout(() => setActive(true), 10)

    let hideTimer
    if (alert.duration > 0) {
      hideTimer = setTimeout(() => handleDismiss(), alert.duration)
    }

    return () => {
      clearTimeout(activeTimer)
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [alert.duration])

  const handleDismiss = () => {
    setActive(false)
    setTimeout(onClose, 450)
  }

  const scale = active ? (1 - index * 0.05) : 0.8
  const translateY = active ? (isTop ? index * 14 : index * -14) : (isTop ? -40 : 40)
  const opacity = active ? (1 - index * 0.2) : 0

  return (
    <div
      className={clsx(
        'rui:absolute rui:w-90 rui:transition-[transform,opacity,filter] rui:pointer-events-auto rui:select-none',
        'rui:duration-450 rui:ease-[cubic-bezier(0.23,1,0.32,1)]',
        {
          'rui:top-0': isTop,
          'rui:bottom-0': !isTop,
          'rui:right-0': position.endsWith('right'),
          'rui:left-0': position.endsWith('left'),
          'rui:left-1/2 rui:-translate-x-1/2': position.endsWith('center')
        }
      )}
      style={{
        transform: `translateY(${translateY}px) scale(${scale}) ${position.endsWith('center') ? 'translateX(-50%)' : ''}`,
        opacity,
        zIndex: 100 - index,
        filter: index > 0 ? `blur(${index * 0.5}px)` : 'none',
      }}
    >
      <div className='rui:flex rui:items-start rui:gap-4 rui:p-4 rui:rounded-2xl rui:border rui:bg-white/95 rui:backdrop-blur-md rui:shadow-2xl rui:border-gray-100'>
        <div className='rui:shrink-0 rui:pt-0.5 rui:transform rui:scale-110'>
          {Icons[alert.variant] || Icons.info}
        </div>
        <div className='rui:flex-1 rui:min-w-0'>
          <h3 className='rui:text-[14px] rui:font-bold rui:text-gray-900 rui:leading-tight'>
            {alert.title}
          </h3>
          {alert.subtitle && (
            <p className='rui:text-[13px] rui:text-gray-500 rui:mt-1 rui:leading-relaxed rui:font-medium'>
              {alert.subtitle}
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          aria-label='Cerrar notificación'
          className='rui:text-gray-400 rui:hover:text-gray-900 rui:focus:outline-none rui:focus-visible:ring-2 rui:focus-visible:ring-(--primary-focus) rui:rounded-full rui:transition-colors rui:p-1'
        >
          <svg className='rui:w-4 rui:h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      </div>
    </div>
  )
}

export const Toaster = ({ position = 'bottom-right' }) => {
  const [alerts, setAlerts] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return toastState.subscribe(setAlerts)
  }, [])

  if (!mounted || alerts.length === 0) return null

  return createPortal(
    <div
      role='status'
      aria-live='polite'
      aria-atomic='false'
      className={clsx(
        'rui:fixed rui:z-[9999] rui:w-90 rui:pointer-events-none',
        {
          'rui:top-6': position.startsWith('top'),
          'rui:bottom-6': position.startsWith('bottom'),
          'rui:right-6': position.endsWith('right'),
          'rui:left-6': position.endsWith('left'),
          'rui:left-1/2 rui:-translate-x-1/2': position.endsWith('center')
        }
      )}
      style={{ height: '1px' }}
    >
      {alerts.map((alert, index) => (
        <ToastInstance
          key={alert.id}
          alert={alert}
          index={index}
          position={position}
          onClose={() => toast.dismiss(alert.id)}
        />
      ))}
    </div>,
    document.body
  )
}

export default Toaster
