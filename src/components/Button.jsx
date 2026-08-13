import React, { forwardRef } from 'react'
import clsx from 'clsx'
import { CONTROL_HEIGHTS, CONTROL_FONT_SIZES } from '../utils/sizes'

const SpinnerIcon = () => (
  <svg className='rui:animate-spin rui:h-5 rui:w-5 rui:text-current' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
    <circle className='rui:opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
    <path
      className='rui:opacity-75'
      fill='currentColor'
      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
)

const Button = forwardRef((props, ref) => {
  const {
    children,
    className = '',
    startIcon,
    endIcon,
    variant = 'primary',
    size = 'medium',
    rounded = 'md',
    shadow = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    ariaLabel,
    fontWeight = 'medium',
    textStyle = 'normal',
    ...rest
  } = props

  const variants = {
    primary:
      'rui:bg-[var(--primary-bg)] rui:hover:bg-[var(--primary-hover)] rui:active:bg-[var(--primary-active)] rui:text-[var(--primary-text)] rui:focus-visible:ring-(--primary-focus)',
    success:
      'rui:bg-[var(--success-bg)] rui:hover:bg-[var(--success-hover)] rui:active:bg-[var(--success-active)] rui:text-[var(--success-text)] rui:focus-visible:ring-(--success-focus)',
    error:
      'rui:bg-[var(--error-bg)] rui:hover:bg-[var(--error-hover)] rui:active:bg-[var(--error-active)] rui:text-white rui:focus-visible:ring-(--error-focus)',
    warning:
      'rui:bg-[var(--warning-bg)] rui:hover:bg-[var(--warning-hover)] rui:active:bg-[var(--warning-active)] rui:text-[var(--warning-text)] rui:focus-visible:ring-(--warning-focus)',
    ghost:
      'rui:bg-transparent rui:hover:bg-[var(--ghost-hover)] rui:active:bg-[var(--ghost-active)] rui:text-[var(--ghost-text)] rui:border rui:border-[var(--ghost-border)] rui:focus-visible:ring-(--primary-focus)',
    link: 'rui:bg-transparent rui:hover:underline rui:active:underline rui:text-[var(--link-text)] rui:p-0 rui:focus-visible:ring-(--primary-focus)'
  }

  const sizes = {
    small: {
      padding: 'rui:px-3 rui:py-2',
      fontSize: CONTROL_FONT_SIZES.small,
      iconSpacing: 'rui:space-x-1.5',
      height: CONTROL_HEIGHTS.small,
      iconSize: 'rui:w-3 rui:h-3'
    },
    medium: {
      padding: 'rui:px-4 rui:py-2',
      fontSize: CONTROL_FONT_SIZES.medium,
      iconSpacing: 'rui:space-x-2',
      height: CONTROL_HEIGHTS.medium,
      iconSize: 'rui:w-4 rui:h-4'
    },
    large: {
      padding: 'rui:px-6 rui:py-4',
      fontSize: CONTROL_FONT_SIZES.large,
      iconSpacing: 'rui:space-x-2.5',
      height: CONTROL_HEIGHTS.large,
      iconSize: 'rui:w-5 rui:h-5'
    }
  }

  const roundness = {
    none: 'rui:rounded-none',
    sm: 'rui:rounded-sm',
    md: 'rui:rounded-md',
    lg: 'rui:rounded-lg',
    full: 'rui:rounded-full'
  }

  const shadows = {
    none: 'rui:shadow-none',
    sm: 'rui:shadow-sm',
    md: 'rui:shadow-md',
    lg: 'rui:shadow-lg',
    xl: 'rui:shadow-xl'
  }

  const fontWeights = {
    light: 'rui:font-light',
    normal: 'rui:font-normal',
    medium: 'rui:font-medium',
    bold: 'rui:font-bold',
    semibold: 'rui:font-semibold'
  }

  const textStyles = {
    truncate: 'rui:truncate rui:overflow-hidden rui:text-ellipsis rui:whitespace-nowrap',
    normal: 'rui:whitespace-normal rui:break-words',
    nowrap: 'rui:whitespace-nowrap'
  }

  const validVariant = variants[variant] ? variant : 'primary'
  const validSize = sizes[size] ? size : 'medium'
  const validRounded = roundness[rounded] ? rounded : 'md'
  const validShadow = shadows[shadow] ? shadow : 'md'
  const validFontWeight = fontWeights[fontWeight] ? fontWeight : 'medium'
  const validTextStyle = textStyles[textStyle] ? textStyle : 'normal'

  const buttonClasses = clsx(
    'rui:relative rui:inline-flex rui:items-center rui:justify-center rui:select-none rui:outline-none',
    'rui:focus-visible:ring-2 rui:focus-visible:ring-offset-2',
    'rui:transition-[background-color,box-shadow,transform] rui:duration-150 rui:ease-out',
    fontWeights[validFontWeight],
    variants[validVariant],
    sizes[validSize].padding,
    sizes[validSize].fontSize,
    sizes[validSize].height,
    roundness[validRounded],
    shadows[validShadow],
    {
      'rui:w-full': fullWidth,
      'rui:w-auto': !fullWidth,
      'rui:opacity-50 rui:cursor-not-allowed': disabled || loading,
      'rui:cursor-pointer rui:active:scale-[0.98]': !disabled && !loading
    },
    className
  )

  const contentClasses = clsx(
    'rui:flex rui:items-center rui:justify-center',
    sizes[validSize].iconSpacing,
    textStyles[validTextStyle],
    { 'rui:opacity-0': loading }
  )

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span className='rui:absolute rui:inset-0 rui:flex rui:items-center rui:justify-center'>
          <SpinnerIcon />
        </span>
      )}
      <span className={contentClasses}>
        {startIcon && (
          <span
            className={`rui:flex rui:items-center rui:justify-center ${sizes[validSize].iconSize} rui:shrink-0 rui:overflow-hidden`}
          >
            <span className={`${sizes[validSize].iconSize} rui:flex rui:items-center rui:justify-center`} style={{ fontSize: 0 }}>
              {startIcon}
            </span>
          </span>
        )}
        {children && <span className={textStyles[validTextStyle]}>{children}</span>}
        {endIcon && (
          <span
            className={`rui:flex rui:items-center rui:justify-center ${sizes[validSize].iconSize} rui:shrink-0 rui:overflow-hidden`}
          >
            <span className={`${sizes[validSize].iconSize} rui:flex rui:items-center rui:justify-center`} style={{ fontSize: 0 }}>
              {endIcon}
            </span>
          </span>
        )}
      </span>
    </button>
  )
})

Button.displayName = 'Button'

export default Button
