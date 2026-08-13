import React, { useRef, useState } from 'react'
import clsx from 'clsx'
import { useId } from '../hooks/useId'
import { CONTROL_FONT_SIZES } from '../utils/sizes'

const VARIANT_CLASSES = {
  primary: {
    activeText: 'rui:text-[var(--primary-bg)]',
    activeBorder: 'rui:border-[var(--primary-bg)]',
    focusRing: 'rui:focus-visible:ring-[var(--primary-focus)]'
  },
  success: {
    activeText: 'rui:text-[var(--success-bg)]',
    activeBorder: 'rui:border-[var(--success-bg)]',
    focusRing: 'rui:focus-visible:ring-[var(--success-focus)]'
  },
  warning: {
    activeText: 'rui:text-[var(--warning-active)]',
    activeBorder: 'rui:border-[var(--warning-active)]',
    focusRing: 'rui:focus-visible:ring-[var(--warning-focus)]'
  },
  error: {
    activeText: 'rui:text-[var(--error-bg)]',
    activeBorder: 'rui:border-[var(--error-bg)]',
    focusRing: 'rui:focus-visible:ring-[var(--error-focus)]'
  }
}

const SIZE_PADDING = {
  small: 'rui:px-3 rui:py-2',
  medium: 'rui:px-4 rui:py-2.5',
  large: 'rui:px-5 rui:py-3'
}

/**
 * Tabs — WAI-ARIA tabs pattern (automatic activation): arrow keys move focus
 * and selection together, Home/End jump to the first/last enabled tab.
 * Panels are always in the DOM (visually hidden when inactive) so content
 * inside them keeps its state across switches.
 */
const Tabs = ({
  items = [],
  value: controlledValue,
  defaultValue,
  onChange,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = ''
}) => {
  const id = useId()
  const tabRefs = useRef({})

  const firstEnabledKey = items.find((item) => !item.disabled)?.key
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabledKey)
  const isControlled = controlledValue !== undefined
  const activeKey = isControlled ? controlledValue : internalValue

  const styles = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary
  const fontSize = CONTROL_FONT_SIZES[size] || CONTROL_FONT_SIZES.medium
  const padding = SIZE_PADDING[size] || SIZE_PADDING.medium

  const selectTab = (key) => {
    if (!isControlled) setInternalValue(key)
    if (onChange) onChange(key)
  }

  const focusTab = (key) => {
    tabRefs.current[key]?.focus()
    selectTab(key)
  }

  const enabledIndexes = items.reduce((acc, item, i) => {
    if (!item.disabled) acc.push(i)
    return acc
  }, [])

  const onTabKeyDown = (e, currentIndex) => {
    const pos = enabledIndexes.indexOf(currentIndex)
    if (pos === -1) return

    let nextPos = null
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextPos = (pos + 1) % enabledIndexes.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        nextPos = (pos - 1 + enabledIndexes.length) % enabledIndexes.length
        break
      case 'Home':
        nextPos = 0
        break
      case 'End':
        nextPos = enabledIndexes.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    const nextIndex = enabledIndexes[nextPos]
    focusTab(items[nextIndex].key)
  }

  return (
    <div className={clsx('rui:w-full', className)}>
      <div
        role='tablist'
        aria-orientation='horizontal'
        className={clsx('rui:flex rui:border-b rui:border-gray-200 rui:gap-1', { 'rui:w-full': fullWidth })}
      >
        {items.map((item, index) => {
          const isActive = item.key === activeKey
          const tabId = `${id}-tab-${item.key}`
          const panelId = `${id}-panel-${item.key}`
          return (
            <button
              key={item.key}
              ref={(node) => { tabRefs.current[item.key] = node }}
              id={tabId}
              type='button'
              role='tab'
              aria-selected={isActive}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              tabIndex={isActive ? 0 : -1}
              disabled={item.disabled}
              onClick={() => selectTab(item.key)}
              onKeyDown={(e) => onTabKeyDown(e, index)}
              className={clsx(
                'rui:relative rui:flex rui:items-center rui:gap-2 rui:font-medium rui:whitespace-nowrap rui:outline-none',
                'rui:border-b-2 rui:-mb-px rui:transition-colors rui:duration-150',
                'rui:focus-visible:ring-2 rui:focus-visible:ring-offset-2 rui:rounded-t-md',
                fontSize,
                padding,
                styles.focusRing,
                fullWidth ? 'rui:flex-1 rui:justify-center' : '',
                item.disabled
                  ? 'rui:text-gray-300 rui:border-transparent rui:cursor-not-allowed'
                  : isActive
                    ? clsx(styles.activeText, styles.activeBorder, 'rui:cursor-pointer')
                    : 'rui:text-gray-500 rui:border-transparent rui:hover:text-gray-700 rui:hover:border-gray-300 rui:cursor-pointer'
              )}
            >
              {item.icon && <span className='rui:shrink-0 rui:inline-flex'>{item.icon}</span>}
              {item.label}
            </button>
          )
        })}
      </div>

      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <div
            key={item.key}
            id={`${id}-panel-${item.key}`}
            role='tabpanel'
            aria-labelledby={`${id}-tab-${item.key}`}
            hidden={!isActive}
            tabIndex={0}
            className='rui:pt-4 rui:outline-none'
          >
            {item.content}
          </div>
        )
      })}
    </div>
  )
}

Tabs.displayName = 'Tabs'

export default Tabs
