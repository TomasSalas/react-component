import React, { forwardRef, useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import { useId } from '../hooks/useId'
import { X } from 'lucide-react'
import { CONTROL_HEIGHTS, CONTROL_FONT_SIZES, CONTROL_ICON_SIZES } from '../utils/sizes'

const InputText = forwardRef((props, ref) => {
  const {
    type = 'text',
    placeholder = '',
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    className = '',
    label = '',
    errorMessage = '',
    iconLeft,
    iconRight,
    isClearable = false,
    onChange,
    ...rest
  } = props

  const id = useId()
  const errorId = `${id}-error`
  const localInputRef = useRef(null)

  const [internalValue, setInternalValue] = useState(rest.value || rest.defaultValue || '')

  useEffect(() => {
    if (rest.value !== undefined) {
      setInternalValue(rest.value)
    }
  }, [rest.value])

  const setRefs = (node) => {
    localInputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const activeVariant = errorMessage ? 'error' : variant

  const sizes = {
    small: { fontSize: CONTROL_FONT_SIZES.small, padding: 'rui:px-3 rui:py-2', height: CONTROL_HEIGHTS.small, iconSize: CONTROL_ICON_SIZES.small },
    medium: { fontSize: CONTROL_FONT_SIZES.medium, padding: 'rui:px-3 rui:py-2', height: CONTROL_HEIGHTS.medium, iconSize: CONTROL_ICON_SIZES.medium },
    large: { fontSize: CONTROL_FONT_SIZES.large, padding: 'rui:px-3 rui:py-2', height: CONTROL_HEIGHTS.large, iconSize: CONTROL_ICON_SIZES.large }
  }

  const validSize = sizes[size] ? size : 'medium'
  const showClear = isClearable && internalValue && internalValue.length > 0 && !rest.disabled

  const inputClasses = clsx(
    'rui:border rui:text-gray-900 rui:rounded-lg',
    'rui:block rui:w-full rui:transition-[border-color,box-shadow,background-color] rui:duration-150 rui:focus:outline-none rui:focus-visible:ring-1',
    sizes[validSize].padding,
    sizes[validSize].fontSize,
    sizes[validSize].height,
    {
      'rui:border-gray-300 rui:focus-visible:ring-[var(--primary-focus)] rui:focus-visible:border-[var(--primary-border)]': activeVariant === 'primary',
      'rui:border-gray-300 rui:focus-visible:ring-[var(--success-focus)] rui:focus-visible:border-[var(--success-border)]': activeVariant === 'success',
      'rui:border-gray-300 rui:focus-visible:ring-[var(--warning-focus)] rui:focus-visible:border-[var(--warning-border)]': activeVariant === 'warning',
      'rui:border-[var(--error-border)] rui:text-[var(--error-text)] rui:focus-visible:ring-[var(--error-focus)] rui:focus-visible:border-[var(--error-border)]':
        activeVariant === 'error',
      'rui:pl-10': !!iconLeft,
      'rui:pr-10': (showClear && !iconRight) || (iconRight && !showClear),
      'rui:pr-16': showClear && iconRight,
      'rui:opacity-50 rui:cursor-not-allowed rui:bg-gray-100': rest.disabled
    }
  )

  const handleInputChange = (e) => {
    setInternalValue(e.target.value)
    if (onChange) onChange(e)
  }

  const handleClear = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setInternalValue('')

    if (onChange) {
      onChange({ target: { name: rest.name, value: '' } })
    }

    if (localInputRef.current) {
      localInputRef.current.value = ''
      localInputRef.current.focus()
    }
  }

  return (
    <div className={clsx('rui:relative', className, { 'rui:w-full': fullWidth })}>
      {label && (
        <label htmlFor={id} className='rui:block rui:mb-1 rui:text-sm rui:font-medium rui:text-gray-900'>
          {label}
        </label>
      )}

      <div className='rui:relative rui:w-full rui:flex rui:items-center'>
        {iconLeft && (
          <div className='rui:absolute rui:left-3 rui:text-gray-400 rui:z-10 rui:pointer-events-none'>
            {React.cloneElement(iconLeft, { size: sizes[validSize].iconSize })}
          </div>
        )}

        <input
          {...rest}
          ref={setRefs}
          id={id}
          type={type}
          value={rest.value !== undefined ? rest.value : internalValue}
          onChange={handleInputChange}
          className={inputClasses}
          placeholder={placeholder}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? errorId : undefined}
        />

        <div className='rui:absolute rui:right-3 rui:flex rui:items-center rui:gap-2 rui:z-20'>
          {showClear && (
            <button
              type='button'
              onClick={handleClear}
              className='rui:text-gray-400 rui:hover:text-gray-600 rui:active:scale-90 rui:focus:outline-none rui:p-0.5 rui:rounded-full rui:hover:bg-gray-200 rui:transition-[background-color,color,transform] rui:duration-150'
              aria-label='Limpiar campo'
            >
              <X size={sizes[validSize].iconSize} />
            </button>
          )}
          {iconRight && (
            <div className='rui:text-gray-400 rui:pointer-events-none'>
              {React.cloneElement(iconRight, { size: sizes[validSize].iconSize })}
            </div>
          )}
        </div>
      </div>
      <p id={errorId} className={clsx('rui:absolute rui:text-xs rui:mt-1 rui:h-4 rui:text-(--error-text)')}>
        {errorMessage}
      </p>
    </div>
  )
})

InputText.displayName = 'InputText'
export default InputText
