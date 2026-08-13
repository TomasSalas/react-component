import React, { forwardRef } from 'react'
import clsx from 'clsx'
import { useId } from '../hooks/useId'

const Checkbox = forwardRef((props, ref) => {
  const {
    label = '',
    labelPosition = 'right',
    checked,
    onChange,
    disabled = false,
    name = '',
    errorMessage = '',
    variant = 'primary',
    fullWidth = false,
    style,
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

  const currentAccentColor = variantColors[activeVariant] || variantColors.primary

  const checkboxInputClasses = clsx(
    'rui:w-4 rui:h-4 rui:bg-gray-100 rui:border-gray-300 rui:rounded rui:shrink-0 rui:outline-none',
    'rui:transition-[border-color,box-shadow,transform] rui:duration-150 rui:ease-out',
    'rui:focus-visible:ring-2 rui:focus-visible:ring-offset-2 rui:active:scale-90',
    {
      'rui:disabled:opacity-75 rui:disabled:cursor-not-allowed': disabled,
      'rui:disabled:border-gray-200 rui:disabled:bg-gray-50': disabled,
      'rui:focus:border-[var(--primary-border)] rui:focus-visible:ring-(--primary-focus)': activeVariant === 'primary',
      'rui:focus:border-[var(--success-border)] rui:focus-visible:ring-(--success-focus)': activeVariant === 'success',
      'rui:focus:border-[var(--warning-border)] rui:focus-visible:ring-(--warning-focus)': activeVariant === 'warning',
      'rui:border-[var(--error-border)] rui:focus:border-[var(--error-border)] rui:focus-visible:ring-(--error-focus)': activeVariant === 'error'
    }
  )

  const labelClasses = clsx(
    'rui:text-sm rui:font-medium rui:cursor-pointer',
    {
      'rui:text-gray-900': !disabled && activeVariant !== 'error',
      'rui:text-gray-500 rui:cursor-not-allowed': disabled,
      'rui:text-[var(--error-text)]': activeVariant === 'error'
    }
  )

  return (
    <div className={clsx(className, { 'rui:w-full': fullWidth })} style={style}>
      <div
        className={clsx(
          'rui:flex rui:items-center rui:gap-2',
          { 'rui:flex-row-reverse rui:justify-end': labelPosition === 'left' }
        )}
      >
        <input
          ref={ref}
          id={id}
          type='checkbox'
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={checkboxInputClasses}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? errorId : undefined}
          style={{ accentColor: currentAccentColor }}
          {...rest}
        />

        {label && (
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        )}
      </div>

      <p id={errorId} className='rui:text-(--error-text) rui:text-xs rui:mt-1 rui:ml-1 rui:font-medium rui:h-1 rui:z-10'>
        {errorMessage || ' '}
      </p>
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
