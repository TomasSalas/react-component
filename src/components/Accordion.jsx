import React, { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useId } from '../hooks/useId'

const VARIANT_CLASSES = {
  primary: { icon: 'rui:text-[var(--primary-bg)]', focusRing: 'rui:focus-visible:ring-[var(--primary-focus)]' },
  success: { icon: 'rui:text-[var(--success-bg)]', focusRing: 'rui:focus-visible:ring-[var(--success-focus)]' },
  warning: { icon: 'rui:text-[var(--warning-active)]', focusRing: 'rui:focus-visible:ring-[var(--warning-focus)]' },
  error: { icon: 'rui:text-[var(--error-bg)]', focusRing: 'rui:focus-visible:ring-[var(--error-focus)]' }
}

/**
 * Accordion — WAI-ARIA accordion pattern: each header is a real <button>
 * (native Enter/Space for free), ArrowUp/ArrowDown rove focus between
 * headers, Home/End jump to the first/last. Panels use the CSS Grid
 * 0fr→1fr trick for a smooth open/close with no JS height measurement.
 */
const Accordion = ({
  items = [],
  value: controlledValue,
  defaultValue = [],
  onChange,
  allowMultiple = false,
  variant = 'primary',
  className = ''
}) => {
  const id = useId()
  const headerRefs = useRef({})
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const openKeys = isControlled ? controlledValue : internalValue

  const styles = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary

  const setOpenKeys = (keys) => {
    if (!isControlled) setInternalValue(keys)
    if (onChange) onChange(keys)
  }

  const toggle = (key) => {
    const isOpen = openKeys.includes(key)
    if (allowMultiple) {
      setOpenKeys(isOpen ? openKeys.filter((k) => k !== key) : [...openKeys, key])
    } else {
      setOpenKeys(isOpen ? [] : [key])
    }
  }

  const enabledIndexes = items.reduce((acc, item, i) => {
    if (!item.disabled) acc.push(i)
    return acc
  }, [])

  const onHeaderKeyDown = (e, currentIndex) => {
    const pos = enabledIndexes.indexOf(currentIndex)
    if (pos === -1) return

    let nextPos = null
    switch (e.key) {
      case 'ArrowDown':
        nextPos = (pos + 1) % enabledIndexes.length
        break
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
    headerRefs.current[items[nextIndex].key]?.focus()
  }

  return (
    <div className={clsx('rui:w-full rui:border rui:border-gray-200 rui:rounded-lg rui:divide-y rui:divide-gray-200 rui:overflow-hidden', className)}>
      {items.map((item, index) => {
        const isOpen = openKeys.includes(item.key)
        const headerId = `${id}-header-${item.key}`
        const panelId = `${id}-panel-${item.key}`
        return (
          <div key={item.key}>
            <h3 className='rui:m-0'>
              <button
                ref={(node) => { headerRefs.current[item.key] = node }}
                id={headerId}
                type='button'
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-disabled={item.disabled || undefined}
                disabled={item.disabled}
                onClick={() => toggle(item.key)}
                onKeyDown={(e) => onHeaderKeyDown(e, index)}
                className={clsx(
                  'rui:flex rui:items-center rui:justify-between rui:gap-3 rui:w-full rui:px-4 rui:py-3 rui:text-left',
                  'rui:font-medium rui:text-sm rui:outline-none rui:transition-colors rui:duration-150',
                  'rui:focus-visible:ring-2 rui:focus-visible:ring-inset',
                  styles.focusRing,
                  item.disabled
                    ? 'rui:text-gray-300 rui:cursor-not-allowed'
                    : 'rui:text-gray-900 rui:hover:bg-gray-50 rui:cursor-pointer'
                )}
              >
                <span className='rui:flex rui:items-center rui:gap-2'>
                  {item.icon && <span className='rui:shrink-0 rui:inline-flex'>{item.icon}</span>}
                  {item.title}
                </span>
                <ChevronDown
                  className={clsx('rui:w-4 rui:h-4 rui:shrink-0 rui:transition-transform rui:duration-200', styles.icon, { 'rui:rotate-180': isOpen })}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role='region'
              aria-labelledby={headerId}
              className='rui-accordion-panel'
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className='rui:overflow-hidden'>
                <div className='rui:px-4 rui:pb-4 rui:text-sm rui:text-gray-600 rui:leading-relaxed'>
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

Accordion.displayName = 'Accordion'

export default Accordion
