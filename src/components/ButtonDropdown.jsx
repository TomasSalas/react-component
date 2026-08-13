import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import Button from './Button'
import { ChevronDown } from 'lucide-react'

const ButtonDropdown = ({ trigger, children, className = '', position = 'bottom-left' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const [dropdownWidth, setDropdownWidth] = useState('auto')

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev)
  }

  const closeAndRefocusTrigger = () => {
    setIsOpen(false)
    triggerRef.current?.focus?.({ preventScroll: true })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (triggerRef.current && isOpen) {
      const triggerWidth = triggerRef.current.offsetWidth
      setDropdownWidth(`${triggerWidth}px`)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      const firstItem = menuRef.current?.querySelector('[role="menuitem"]')
      firstItem?.focus({ preventScroll: true })
    }
  }, [isOpen])

  const handleMenuKeyDown = (e) => {
    const items = Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') || [])
    const currentIndex = items.indexOf(document.activeElement)

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        closeAndRefocusTrigger()
        break
      case 'ArrowDown':
        e.preventDefault()
        items[(currentIndex + 1) % items.length]?.focus({ preventScroll: true })
        break
      case 'ArrowUp':
        e.preventDefault()
        items[(currentIndex - 1 + items.length) % items.length]?.focus({ preventScroll: true })
        break
      case 'Home':
        e.preventDefault()
        items[0]?.focus({ preventScroll: true })
        break
      case 'End':
        e.preventDefault()
        items[items.length - 1]?.focus({ preventScroll: true })
        break
      default:
        break
    }
  }

  const positionClasses = clsx({
    'rui:origin-top-left rui:left-0 rui:top-full rui:mt-2': position === 'bottom-left',
    'rui:origin-top-right rui:right-0 rui:top-full rui:mt-2': position === 'bottom-right',
    'rui:origin-bottom-left rui:left-0 rui:bottom-full rui:mb-2': position === 'top-left',
    'rui:origin-bottom-right rui:right-0 rui:bottom-full rui:mb-2': position === 'top-right'
  })

  const triggerId = trigger.props?.id || 'button-dropdown-trigger'

  const clonedTrigger = React.isValidElement(trigger)
    ? React.cloneElement(trigger, {
      ref: triggerRef,
      onClick: toggleDropdown,
      'aria-haspopup': 'true',
      'aria-expanded': isOpen,
      endIcon: trigger.props.endIcon || (
        <ChevronDown className={clsx('rui:transition-transform rui:duration-200', { 'rui:rotate-180': isOpen })} />
      ),
      tabIndex: 0,
      id: triggerId
    })
    : (
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className='rui:flex rui:items-center rui:justify-center rui:px-4 rui:py-2 rui:bg-gray-200 rui:rounded-md'
        id={triggerId}
        aria-haspopup='true'
        aria-expanded={isOpen}
      >
        Toggle Dropdown
        <ChevronDown className={clsx('rui:transition-transform rui:duration-200 rui:ml-1', { 'rui:rotate-180': isOpen })} />
      </button>
      )

  const containerClasses = clsx('rui:relative rui:inline-block rui:text-left', { 'rui:w-full': trigger.props?.fullWidth }, className)

  return (
    <div className={containerClasses} ref={dropdownRef}>
      {clonedTrigger}

      <div
        ref={menuRef}
        className={clsx(
          'rui:absolute rui:z-[1000] rui:bg-white rui:rounded-lg rui:shadow-lg rui:p-2 rui:border rui:border-gray-200',
          'rui:transition-[transform,opacity] rui:duration-200 rui:ease-out rui:transform',
          positionClasses,
          {
            'rui:scale-95 rui:opacity-0 rui:invisible': !isOpen,
            'rui:scale-100 rui:opacity-100 rui:visible': isOpen
          }
        )}
        style={{
          minWidth: dropdownWidth,
          maxWidth: trigger.props?.fullWidth ? '100%' : 'auto'
        }}
        role='menu'
        aria-orientation='vertical'
        aria-labelledby={triggerId}
        tabIndex={-1}
        onKeyDown={handleMenuKeyDown}
      >
        <div className='rui:flex rui:flex-col rui:space-y-2' role='none'>
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child) && child.type === Button) {
              return React.cloneElement(child, {
                fullWidth: true,
                role: 'menuitem',
                tabIndex: -1,
                className: clsx(child.props.className, '!rui:justify-start'),
                onClick: (e) => {
                  if (child.props.onClick) {
                    child.props.onClick(e)
                  }
                  closeAndRefocusTrigger()
                },
                key: index
              })
            }
            return child
          })}
        </div>
      </div>
    </div>
  )
}

export default ButtonDropdown
