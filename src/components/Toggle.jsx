import React, { forwardRef } from 'react'
import clsx from 'clsx'
import { useId } from '../hooks/useId'

const Toggle = forwardRef((props, ref) => {
  const {
    label = '',
    labelPosition = 'right',
    checked,
    onChange,
    disabled = false,
    readOnly = false,
    name = '',
    errorMessage = '',
    variant = 'primary',
    size = 'medium', // <-- Nueva prop agregada por defecto en medium
    fullWidth = false,
    className = '',
    ...rest
  } = props

  const id = useId()
  const errorId = `${id}-error`

  const activeVariant = errorMessage ? 'error' : variant

  const variantColors = {
    primary: 'var(--primary-focus)',
    success: 'var(--success-focus)',
    error: 'var(--error-focus)',
    warning: 'var(--warning-focus)'
  }

  // --- CONFIGURACIÓN DE TAMAÑOS ---
  const sizeConfig = {
    small: {
      track: 'rui:w-9 rui:h-5', // 36px x 20px
      knob: 'rui:after:h-4 rui:after:w-4 rui:after:top-[2px] rui:after:start-[2px]', // 16px x 16px
      translate: 'rui:peer-checked:after:translate-x-4 rui:rtl:peer-checked:after:-translate-x-4', // traslada 16px
      label: 'rui:ms-2 rui:text-xs'
    },
    medium: {
      track: 'rui:w-11 rui:h-6', // 44px x 24px (Tu tamaño original)
      knob: 'rui:after:h-5 rui:after:w-5 rui:after:top-[2px] rui:after:start-[2px]', // 20px x 20px
      translate: 'rui:peer-checked:after:translate-x-5 rui:rtl:peer-checked:after:-translate-x-5', // traslada 20px
      label: 'rui:ms-3 rui:text-sm'
    },
    large: {
      track: 'rui:w-14 rui:h-7', // 56px x 28px
      knob: 'rui:after:h-6 rui:after:w-6 rui:after:top-[2px] rui:after:start-[2px]', // 24px x 24px
      translate: 'rui:peer-checked:after:translate-x-7 rui:rtl:peer-checked:after:-translate-x-7', // traslada 28px
      label: 'rui:ms-4 rui:text-base'
    }
  }

  // Si envían un tamaño inválido, forzamos 'medium'
  const currentSize = sizeConfig[size] || sizeConfig.medium

  const currentToggleColor =
    variantColors[activeVariant] || variantColors.primary

  const toggleTrackClasses = clsx(
    'rui:relative rui:rounded-full rui:transition-colors rui:duration-300 rui:ease-in-out',
    currentSize.track, // Aplicamos tamaño del track

    'rui:after:content-[""] rui:after:absolute',
    'rui:after:bg-white rui:after:rounded-full',
    'rui:after:shadow-[0_2px_4px_rgba(0,0,0,0.2)]',
    'rui:after:transition-[transform] rui:after:duration-300 rui:after:ease-[cubic-bezier(0.4,0,0.2,1)]',
    currentSize.knob, // Aplicamos tamaño del círculo blanco (knob)

    currentSize.translate, // Aplicamos la traslación exacta al marcarse

    {
      'rui:bg-gray-200': !checked,
      'rui:opacity-50 rui:cursor-not-allowed': disabled,
      'rui:cursor-not-allowed': readOnly && !disabled
    },
    'rui:peer-focus:outline-none rui:peer-focus-visible:ring-2 rui:peer-focus-visible:ring-offset-2',
    {
      'rui:peer-focus-visible:ring-(--primary-focus)': activeVariant === 'primary',
      'rui:peer-focus-visible:ring-(--success-focus)': activeVariant === 'success',
      'rui:peer-focus-visible:ring-(--warning-focus)': activeVariant === 'warning',
      'rui:peer-focus-visible:ring-(--error-focus)': activeVariant === 'error'
    }
  )

  const labelClasses = clsx('rui:font-medium rui:select-none', currentSize.label, {
    'rui:text-gray-900': !disabled && !readOnly && activeVariant !== 'error',
    'rui:text-gray-500 rui:cursor-not-allowed': disabled || readOnly,
    'rui:text-[var(--error-text)]': activeVariant === 'error'
  })

  const handleChange = (e) => {
    if (readOnly || disabled) {
      e.preventDefault()
      return
    }
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className={clsx(className, { 'rui:w-full': fullWidth })}>
      <label
        className={clsx('rui:inline-flex rui:items-center rui:cursor-pointer', {
          'rui:flex-row-reverse rui:justify-end': labelPosition === 'left',
          'rui:cursor-not-allowed': readOnly || disabled,
          'rui:pointer-events-none': readOnly && !disabled
        })}
      >
        <input
          ref={ref}
          id={id}
          type='checkbox'
          name={name}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className='rui:sr-only rui:peer'
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? errorId : undefined}
          {...rest}
        />

        <div
          className={toggleTrackClasses}
          style={{
            backgroundColor: checked
              ? currentToggleColor
              : activeVariant === 'error' ? variantColors.error : undefined
          }}
        />

        {label && (
          <span className={labelClasses}>
            {label}
          </span>
        )}
      </label>

      <p id={errorId} className='rui:text-(--error-text) rui:text-xs rui:mt-1 rui:ml-1 rui:font-medium rui:h-1 rui:z-10'>
        {errorMessage || ' '}
      </p>
    </div>
  )
})

Toggle.displayName = 'Toggle'

export default Toggle
