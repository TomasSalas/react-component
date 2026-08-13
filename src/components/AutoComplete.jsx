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

const Autocomplete = forwardRef(
  (
    {
      value: controlledValue,
      onChange: controlledOnChange = () => { },
      options = [],
      placeholder = 'Escribe algo...',
      noOptionsText = 'No hay opciones disponibles',
      className = '',
      variant = 'primary',
      size = 'medium',
      multiSelect = false,
      isClearable = false,
      disabled = false,
      errorMessage = '',
      colorMessage = 'error',
      name = '',
      onBlur: externalOnBlur,
      label = '',
      fullWidth = false,
      freeSolo = false,
      loading = false,
      defaultValue = null,
      iconLeft,
      maxVisibleChips = 3,
      ...rest
    },
    ref
  ) => {
    const id = useId()
    const errorId = `${id}-error`
    const listboxId = `${id}-listbox`
    const [showAllChips, setShowAllChips] = useState(false)

    const [internalValue, setInternalValue] = useState(
      multiSelect ? (defaultValue || []) : (defaultValue || null)
    )
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue
    const isClearingRef = useRef(false)
    const [inputValue, setInputValue] = useState('')
    const [filteredOptions, setFilteredOptions] = useState(options)
    const [showDropdown, setShowDropdown] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [dropdownPosition, setDropdownPosition] = useState({
      top: 0,
      left: 0,
      width: 0,
      placement: 'bottom'
    })
    const [isPositioned, setIsPositioned] = useState(false)
    const wrapperRef = useRef(null)
    const inputRef = useRef(null)
    const dropdownRef = useRef(null)
    const isSelectingRef = useRef(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

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
      }

      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', updatePosition)
      }
    }, [showDropdown])

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      getValue: () => value
    }), [value])

    const sizes = {
      small: { fontSize: CONTROL_FONT_SIZES.small, padding: 'rui:px-3 rui:py-2', borderRadius: 'rui:rounded-md', iconSize: CONTROL_ICON_SIZES.small, chipPadding: 'rui:px-1 rui:py-0.5', dropdownFontSize: CONTROL_FONT_SIZES.small, height: CONTROL_HEIGHTS.small },
      medium: { fontSize: CONTROL_FONT_SIZES.medium, padding: 'rui:px-3 rui:py-2', borderRadius: 'rui:rounded-lg', iconSize: CONTROL_ICON_SIZES.medium, chipPadding: 'rui:px-1.5 rui:py-0.5', dropdownFontSize: CONTROL_FONT_SIZES.medium, height: CONTROL_HEIGHTS.medium },
      large: { fontSize: CONTROL_FONT_SIZES.large, padding: 'rui:px-3 rui:py-2', borderRadius: 'rui:rounded-lg', iconSize: CONTROL_ICON_SIZES.large, chipPadding: 'rui:px-2 rui:py-1', dropdownFontSize: CONTROL_FONT_SIZES.large, height: CONTROL_HEIGHTS.large }
    }

    const currentSize = sizes[size] || sizes.medium

    useEffect(() => {
      setFilteredOptions(options)
    }, [options])

    useEffect(() => {
      if (!multiSelect) {
        if (value && typeof value === 'object' && 'label' in value) {
          setInputValue(value.label)
        } else if (freeSolo && typeof value === 'string') {
          setInputValue(value)
        } else if (value === null) {
          setInputValue('')
        }
      }
    }, [value, multiSelect, freeSolo])

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (!showDropdown) return
        const inputContainer = wrapperRef.current?.querySelector('.autocomplete-input-container')
        if (!inputContainer?.contains(event.target) && !dropdownRef.current?.contains(event.target)) {
          setShowDropdown(false)
          handleBlur()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showDropdown])

    const dropdownItemClasses = (isSelected, isActive) => {
      const baseClasses = 'rui:m-1 rui:px-3 rui:py-2 rui:cursor-pointer rui:transition-all rui:duration-150 rui:rounded-md rui:flex rui:items-center rui:justify-between ' + currentSize.dropdownFontSize

      return clsx(baseClasses, {
        'rui:bg-[var(--primary-bg)] rui:text-white': isSelected && variant === 'primary',
        'rui:bg-[var(--success-bg)] rui:text-white': isSelected && variant === 'success',
        'rui:bg-[var(--warning-bg)] rui:text-white': isSelected && variant === 'warning',
        'rui:bg-[var(--error-bg)] rui:text-white': isSelected && variant === 'error',

        'rui:brightness-[1.1]': isSelected && isActive,

        'rui:bg-[var(--primary-selected-bg)] rui:text-[var(--primary-selected-text)]': !isSelected && isActive && variant === 'primary',
        'rui:bg-[var(--success-selected-bg)] rui:text-[var(--success-selected-text)]': !isSelected && isActive && variant === 'success',
        'rui:bg-[var(--warning-selected-bg)] rui:text-[var(--warning-selected-text)]': !isSelected && isActive && variant === 'warning',
        'rui:bg-[var(--error-selected-bg)] rui:text-[var(--error-selected-text)]': !isSelected && isActive && variant === 'error',

        'rui:text-gray-700': !isSelected && !isActive
      })
    }

    const updateValue = (newValue) => {
      const isSame = multiSelect
        ? JSON.stringify(newValue) === JSON.stringify(value)
        : newValue?.value === value?.value

      if (isSame) return

      if (!isControlled) setInternalValue(newValue)
      controlledOnChange(newValue)
    }

    const handleBlur = () => {
      if (isSelectingRef.current || isClearingRef.current) return

      if (!multiSelect) {
        const matchedOption = options.find(
          (o) => o.label.toLowerCase() === inputValue.toLowerCase()
        )

        if (matchedOption) {
          if (matchedOption.value !== value?.value) {
            updateValue(matchedOption)
          }
        } else if (freeSolo && inputValue.trim()) {
          if (inputValue.trim() !== value) {
            updateValue({ value: null, label: inputValue.trim() })
          }
        } else if (!freeSolo && inputValue === '') {
          if (value !== null) {
            updateValue(null)
          }
        } else if (value && value.label) {
          setInputValue(value.label)
        }
      }

      setFilteredOptions(options)
      setActiveIndex(-1)
      if (externalOnBlur) externalOnBlur({ target: { name, value: inputValue } })
    }

    const handleInputChange = (e) => {
      if (disabled) return
      const newText = e.target.value
      setInputValue(newText)
      const filtered = newText.trim() === ''
        ? options
        : options.filter((o) => o.label.toLowerCase().includes(newText.toLowerCase()))
      setFilteredOptions(filtered)
      if (!showDropdown) setShowDropdown(true)
      setActiveIndex(-1)
    }

    const handleSelectOption = (option) => {
      if (disabled) return
      isSelectingRef.current = true

      if (multiSelect) {
        const currentArr = Array.isArray(value) ? value : []

        if (option.value === null || option.label.toUpperCase() === 'TODOS') {
          updateValue([option])
          setInputValue('')
          setShowDropdown(false)
        } else {
          const filteredPrev = currentArr.filter(v => v.value !== null && v.label.toUpperCase() !== 'TODOS')

          const isSelected = filteredPrev.some((v) => v.value === option.value)
          const newValue = isSelected
            ? filteredPrev.filter((v) => v.value !== option.value)
            : [...filteredPrev, option]

          updateValue(newValue)
          setInputValue('')
        }
      } else {
        updateValue(option)
        setInputValue(option.label)
        setShowDropdown(false)
      }

      setTimeout(() => { isSelectingRef.current = false }, 150)
    }

    const handleClear = (e) => {
      e.stopPropagation()
      isClearingRef.current = true

      updateValue(multiSelect ? [] : null)
      setInputValue('')
      setShowDropdown(false)

      setTimeout(() => {
        isClearingRef.current = false
      }, 100)
    }

    const handleRemoveChip = (option, e) => {
      e.stopPropagation()
      if (disabled) return
      const newValue = value.filter((v) => v.value !== option.value)
      updateValue(newValue)
    }

    const handleKeyDown = (e) => {
      if (disabled) return
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          if (!showDropdown) setShowDropdown(true)
          setActiveIndex((p) => (p < filteredOptions.length - 1 ? p + 1 : p))
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((p) => (p > 0 ? p - 1 : 0))
          break
        case 'Enter':
          e.preventDefault()
          if (showDropdown && activeIndex >= 0) handleSelectOption(filteredOptions[activeIndex])
          break
        case 'Escape':
          setShowDropdown(false)
          break
      }
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
          {filteredOptions.length > 0
            ? (
                filteredOptions.map((option, index) => {
                  const isFirstInGroup = index === 0 || option.group !== filteredOptions[index - 1].group

                  const isSelected = multiSelect
                    ? Array.isArray(value) && value.some((v) => v.value === option.value)
                    : value?.value === option.value

                  return (
                    <React.Fragment key={option.value}>
                      {option.group && isFirstInGroup && (
                        <li className='rui:px-3 rui:py-2 rui:text-[10px] rui:font-bold rui:text-gray-400 rui:uppercase rui:tracking-wider rui:bg-gray-50 rui:select-none'>
                          {option.group}
                        </li>
                      )}

                      <li
                        id={`${listboxId}-option-${index}`}
                        role='option'
                        aria-selected={isSelected}
                        onMouseDown={(e) => { e.preventDefault(); handleSelectOption(option) }}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={dropdownItemClasses(isSelected, index === activeIndex)}
                      >
                        <span className='rui:flex-1 rui:truncate'>{option.label}</span>
                        {isSelected && <span className='rui:text-xs'>✓</span>}
                      </li>
                    </React.Fragment>
                  )
                })
              )
            : (
              <li className='rui:px-3 rui:py-2 rui:text-sm rui:text-gray-500'>{noOptionsText}</li>
              )}
        </ul>
      </div>
    )

    return (
      <div className={clsx(className, { 'rui:w-full': fullWidth, 'rui:cursor-not-allowed': disabled }, 'rui:relative')}>
        {label && <label htmlFor={id} className='rui:block rui:mb-1 rui:text-sm rui:font-medium rui:text-gray-700'>{label}</label>}
        <div ref={wrapperRef} className='rui:relative'>
          <div
            className={clsx(
              'autocomplete-input-container rui:flex rui:items-center rui:bg-white rui:border rui:transition-all rui:px-2 rui:gap-2',
              currentSize.borderRadius,
              disabled ? 'rui:bg-gray-50 rui:cursor-not-allowed rui:border-gray-200' : 'rui:cursor-text',
              !disabled && !errorMessage && {
                'rui:focus-within:ring-1 rui:border-gray-300': true,
                'rui:focus-within:ring-(--primary-bg) rui:focus-within:border-(--primary-bg)': variant === 'primary',
                'rui:focus-within:ring-(--success-bg) rui:focus-within:border-(--success-bg)': variant === 'success',
                'rui:focus-within:ring-(--warning-bg) rui:focus-within:border-(--warning-bg)': variant === 'warning'
              },
              errorMessage ? 'rui:border-(--error-bg) rui:focus-within:ring-1 rui:focus-within:ring-(--error-bg)' : '',
              'rui:min-h-9 rui:h-auto rui:py-1'
            )}
            onClick={() => !disabled && inputRef.current?.focus()}
          >
            {iconLeft && (
              <div className='rui:text-gray-400 rui:shrink-0 rui:flex rui:items-center rui:pl-1'>
                {React.cloneElement(iconLeft, { size: currentSize.iconSize })}
              </div>
            )}

            <div className='rui:flex rui:flex-wrap rui:items-center rui:gap-1 rui:flex-1 rui:min-w-0'>
              {multiSelect && Array.isArray(value) && (
                showAllChips ? value : value.slice(0, maxVisibleChips)
              ).map((option) => (
                <span
                  key={option.value}
                  className={clsx(
                    'rui:inline-flex rui:items-center rui:gap-1 rui:rounded rui:text-xs rui:font-medium rui:px-1.5 rui:py-0.5 rui:bg-gray-200 rui:text-gray-800',
                    disabled && 'rui:pointer-events-none'
                  )}
                >
                  <span className='rui:flex-1 rui:truncate'>{option.label}</span>
                  {!disabled && (
                    <button type='button' onClick={(e) => handleRemoveChip(option, e)} aria-label={`Quitar ${option.label}`}>
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
              {multiSelect && Array.isArray(value) && !showAllChips && value.length > maxVisibleChips && (
                <button
                  type='button'
                  onClick={(e) => { e.stopPropagation(); setShowAllChips(true) }}
                  title={value.slice(maxVisibleChips).map((o) => o.label).join(', ')}
                  className='rui:inline-flex rui:items-center rui:rounded rui:text-xs rui:font-medium rui:px-1.5 rui:py-0.5 rui:bg-gray-100 rui:text-gray-600 rui:hover:bg-gray-200 rui:shrink-0'
                >
                  +{value.length - maxVisibleChips} más
                </button>
              )}
              {multiSelect && Array.isArray(value) && showAllChips && value.length > maxVisibleChips && (
                <button
                  type='button'
                  onClick={(e) => { e.stopPropagation(); setShowAllChips(false) }}
                  className='rui:inline-flex rui:items-center rui:rounded rui:text-xs rui:font-medium rui:px-1.5 rui:py-0.5 rui:bg-gray-100 rui:text-gray-600 rui:hover:bg-gray-200 rui:shrink-0'
                >
                  Mostrar menos
                </button>
              )}
              <input
                ref={inputRef}
                id={id}
                type='text'
                role='combobox'
                aria-autocomplete='list'
                aria-haspopup='listbox'
                aria-expanded={showDropdown}
                aria-controls={listboxId}
                aria-invalid={!!errorMessage}
                aria-describedby={errorMessage ? errorId : undefined}
                aria-activedescendant={showDropdown && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                onFocus={() => !disabled && setShowDropdown(true)}
                placeholder={multiSelect && value?.length > 0 ? '' : placeholder}
                disabled={disabled}
                className={clsx(
                  'rui:flex-1 rui:bg-transparent rui:outline-none rui:text-sm rui:min-w-12.5',
                  disabled && 'rui:cursor-not-allowed'
                )}
                autoComplete='off'
                {...rest}
              />
            </div>
            <div className='rui:flex rui:items-center rui:pr-1'>
              {isClearable && value && !disabled && (
                <button
                  type='button'
                  onClick={handleClear}
                  aria-label='Limpiar selección'
                  className='rui:text-gray-400 rui:hover:text-gray-600 rui:focus:outline-none'
                >
                  <X className='rui:w-4 rui:h-4' />
                </button>
              )}
              {loading ? <Loader2 className='rui:w-4 rui:h-4 rui:animate-spin rui:text-gray-400' /> : <ChevronDown className='rui:w-4 rui:h-4 rui:text-gray-400' />}
            </div>
          </div>
          {mounted && createPortal(dropdownContent, document.body)}
        </div>
        <p id={errorId} className={clsx('rui:absolute rui:text-xs rui:mt-1 rui:h-4 rui:text-(--error-text)')}>
          {errorMessage}
        </p>
      </div>
    )
  }
)

Autocomplete.displayName = 'Autocomplete'
export default Autocomplete
