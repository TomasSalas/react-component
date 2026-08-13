import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, X, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { useId } from '../hooks/useId'
import { CONTROL_HEIGHTS, CONTROL_FONT_SIZES, CONTROL_ICON_SIZES } from '../utils/sizes'

const Select = forwardRef(
  (props, ref) => {
    const {
      value: controlledValue,
      onChange: controlledOnChange = () => { },
      options = [],
      placeholder = 'Seleccione una opción...',
      className = '',
      variant = 'primary',
      size = 'medium',
      multiSelect = false,
      isClearable = false,
      disabled = false,
      errorMessage = '',
      name = '',
      onBlur: externalOnBlur,
      label = '',
      fullWidth = false,
      loading = false,
      defaultValue = null,
      iconLeft,
      ...domProps
    } = props

    const id = useId()
    const errorId = `${id}-error`
    const listboxId = `${id}-listbox`

    const [internalValue, setInternalValue] = useState(
      multiSelect ? (defaultValue || []) : (defaultValue || null)
    )
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const [showDropdown, setShowDropdown] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, placement: 'bottom' })
    const [isPositioned, setIsPositioned] = useState(false)

    const wrapperRef = useRef(null)
    const dropdownRef = useRef(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    const updatePosition = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const estimatedHeight = 240
        const pickTop = spaceBelow < estimatedHeight && rect.top > spaceBelow

        setDropdownPosition({
          top: pickTop ? rect.top + window.scrollY - 4 : rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
          placement: pickTop ? 'top' : 'bottom'
        })
      }
    }

    useEffect(() => {
      const handleScroll = (event) => {
        if (dropdownRef.current && dropdownRef.current.contains(event.target)) return
        setShowDropdown(false)
      }

      if (showDropdown) {
        updatePosition()
        setIsPositioned(true)
        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('resize', updatePosition)
      } else {
        setIsPositioned(false)
        setActiveIndex(-1)
      }
      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', updatePosition)
      }
    }, [showDropdown])

    useImperativeHandle(ref, () => ({
      focus: () => wrapperRef.current?.focus(),
      getValue: () => value
    }))

    const sizes = {
      small: { fontSize: CONTROL_FONT_SIZES.small, borderRadius: 'rui:rounded-md', height: CONTROL_HEIGHTS.small, iconSize: CONTROL_ICON_SIZES.small },
      medium: { fontSize: CONTROL_FONT_SIZES.medium, borderRadius: 'rui:rounded-lg', height: CONTROL_HEIGHTS.medium, iconSize: CONTROL_ICON_SIZES.medium },
      large: { fontSize: CONTROL_FONT_SIZES.large, borderRadius: 'rui:rounded-lg', height: CONTROL_HEIGHTS.large, iconSize: CONTROL_ICON_SIZES.large }
    }

    const currentSize = sizes[size] || sizes.medium

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!showDropdown) return
        if (!wrapperRef.current?.contains(event.target) && !dropdownRef.current?.contains(event.target)) {
          setShowDropdown(false)
          if (externalOnBlur) externalOnBlur({ target: { name, value } })
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showDropdown, value, name, externalOnBlur])

    const updateValue = (newValue) => {
      if (!isControlled) setInternalValue(newValue)
      controlledOnChange(newValue)
    }

    const handleSelectOption = (option) => {
      if (disabled) return
      if (multiSelect) {
        const currentArr = Array.isArray(value) ? value : []
        const isSelected = currentArr.some((v) => v.value === option.value)
        const newValue = isSelected
          ? currentArr.filter((v) => v.value !== option.value)
          : [...currentArr, option]
        updateValue(newValue)
      } else {
        updateValue(option)
        setShowDropdown(false)
      }
    }

    const handleClear = (e) => {
      e.stopPropagation()
      updateValue(multiSelect ? [] : null)
      setShowDropdown(false)
    }

    const handleKeyDown = (e) => {
      if (disabled) return
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (!showDropdown) {
            setShowDropdown(true)
          } else {
            setActiveIndex((p) => (p < options.length - 1 ? p + 1 : p))
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (showDropdown) setActiveIndex((p) => (p > 0 ? p - 1 : 0))
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (!showDropdown) {
            setShowDropdown(true)
          } else if (activeIndex >= 0 && options[activeIndex]) {
            handleSelectOption(options[activeIndex])
          }
          break
        case 'Escape':
          setShowDropdown(false)
          break
        default:
          break
      }
    }

    const dropdownItemClasses = (isSelected, isActive) => {
      const baseClasses = 'rui:m-1 rui:px-3 rui:py-2 rui:cursor-pointer rui:transition-all rui:duration-150 rui:rounded-md rui:flex rui:items-center rui:justify-between rui:text-sm'
      return clsx(baseClasses, {
        'rui:bg-[var(--primary-bg)] rui:text-white': isSelected && variant === 'primary',
        'rui:bg-[var(--success-bg)] rui:text-white': isSelected && variant === 'success',
        'rui:bg-[var(--warning-bg)] rui:text-white': isSelected && variant === 'warning',
        'rui:bg-[var(--error-bg)] rui:text-white': isSelected && variant === 'error',
        'rui:brightness-[1.1]': isSelected && isActive,
        'rui:bg-[var(--primary-selected-bg)] rui:text-[var(--primary-selected-text)]': !isSelected && isActive && variant === 'primary',
        'rui:text-gray-700': !isSelected && !isActive
      })
    }

    const dropdownContent = showDropdown && mounted && isPositioned && (
      <div
        ref={dropdownRef}
        className='rui-pop-in rui:bg-white rui:border rui:border-gray-300 rui:shadow-lg rui:rounded-lg rui:overflow-hidden'
        style={{
          position: 'absolute',
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 10000,
          transform: dropdownPosition.placement === 'top' ? 'translateY(-100%)' : 'none'
        }}
      >
        <ul id={listboxId} role='listbox' className='rui:max-h-56 rui:overflow-y-auto rui:p-1' onMouseLeave={() => setActiveIndex(-1)}>
          {options.length > 0
            ? (
                options.map((option, index) => {
                  const isFirstInGroup = option.group && (index === 0 || option.group !== options[index - 1].group)

                  const isSelected = multiSelect
                    ? Array.isArray(value) && value.some((v) => v.value === option.value)
                    : value?.value === option.value

                  return (
                    <React.Fragment key={option.value}>
                      {isFirstInGroup && (
                        <li className='rui:px-3 rui:py-2 rui:text-[10px] rui:font-bold rui:text-gray-400 rui:uppercase rui:tracking-wider rui:bg-gray-50 rui:select-none'>
                          {option.group}
                        </li>
                      )}

                      <li
                        id={`${listboxId}-option-${index}`}
                        role='option'
                        aria-selected={isSelected}
                        onMouseDown={(e) => { e.preventDefault(); handleSelectOption(option) }}
                        className={dropdownItemClasses(isSelected, index === activeIndex)}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <span className='rui:flex-1 rui:truncate'>{option.label}</span>
                        {isSelected && <span className='rui:text-xs'>✓</span>}
                      </li>
                    </React.Fragment>
                  )
                })
              )
            : (
              <li className='rui:px-3 rui:py-2 rui:text-sm rui:text-gray-500'>No hay opciones</li>
              )}
        </ul>
      </div>
    )

    return (
      <div
        className={clsx(className, { 'rui:w-full': fullWidth, 'rui:cursor-not-allowed': disabled }, 'rui:relative')}
        {...domProps}
      >
        {label && <label id={`${id}-label`} htmlFor={id} className='rui:block rui:mb-1 rui:text-sm rui:font-medium rui:text-gray-700'>{label}</label>}

        <div
          ref={wrapperRef}
          id={id}
          tabIndex={disabled ? -1 : 0}
          role='combobox'
          aria-haspopup='listbox'
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-labelledby={label ? `${id}-label` : undefined}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? errorId : undefined}
          aria-activedescendant={showDropdown && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          onClick={() => !disabled && setShowDropdown(!showDropdown)}
          onKeyDown={handleKeyDown}
          className={clsx(
            'rui:flex rui:items-center rui:bg-white rui:border rui:transition-all rui:px-3 rui:gap-2 rui:outline-none rui:w-full',
            currentSize.borderRadius,
            disabled ? 'rui:bg-gray-50 rui:cursor-not-allowed rui:border-gray-200' : 'rui:cursor-pointer',

            // Lógica de Borde y Anillo EXACTA al AutoComplete
            !disabled && !errorMessage && {
              'rui:focus-visible:ring-1 rui:border-gray-300': true,
              'rui:focus-visible:ring-(--primary-bg) rui:focus-visible:border-(--primary-bg)': variant === 'primary',
              'rui:focus-visible:ring-(--success-bg) rui:focus-visible:border-(--success-bg)': variant === 'success',
              'rui:focus-visible:ring-(--warning-bg) rui:focus-visible:border-(--warning-bg)': variant === 'warning'
            },

            // Estado de Error corregido
            errorMessage ? 'rui:border-(--error-bg) rui:focus:ring-1 rui:focus:ring-(--error-bg)' : '',

            // Altura y padding
            multiSelect && Array.isArray(value) && value.length > 0 ? 'rui:h-auto rui:min-h-9 rui:py-1' : currentSize.height
          )}
        >
          {iconLeft && (
            <div className='rui:text-gray-400 rui:shrink-0 rui:flex rui:items-center'>
              {React.cloneElement(iconLeft, { size: currentSize.iconSize })}
            </div>
          )}

          <div className='rui:flex rui:items-center rui:gap-1 rui:flex-1 rui:min-w-0 rui:select-none rui:overflow-hidden'>
            <span className={clsx(
              'rui:truncate rui:w-full rui:block rui:outline-none',
              currentSize.fontSize,
              (!value || (multiSelect && value.length === 0)) ? 'rui:text-gray-400' : 'rui:text-gray-900'
            )}
            >
              {multiSelect
                ? (Array.isArray(value) && value.length > 0 ? `${value.length} seleccionados` : placeholder)
                : (value?.label || placeholder)}
            </span>
          </div>

          <div className='rui:flex rui:items-center rui:pr-1 rui:gap-1'>
            {isClearable && value && (Array.isArray(value) ? value.length > 0 : true) && !disabled && (
              <button
                type='button'
                onClick={handleClear}
                aria-label='Limpiar selección'
                className='rui:text-gray-400 rui:hover:text-gray-600 rui:focus:outline-none'
              >
                <X className='rui:w-4 rui:h-4' />
              </button>
            )}
            {loading
              ? (
                <Loader2 className='rui:w-4 rui:h-4 rui:animate-spin rui:text-gray-400' />
                )
              : (
                <ChevronDown className={clsx('rui:w-4 rui:h-4 rui:text-gray-400 rui:transition-transform', showDropdown && 'rui:rotate-180')} />
                )}
          </div>
        </div>

        {mounted && createPortal(dropdownContent, document.body)}

        <p id={errorId} className='rui:absolute rui:text-xs rui:mt-1 rui:h-4 rui:text-(--error-text)'>
          {errorMessage}
        </p>
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select
