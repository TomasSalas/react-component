import React, { forwardRef } from 'react'
import clsx from 'clsx'

const Container = forwardRef((
  {
    children,
    as: Component = 'div',
    maxWidth = 'md',
    shadow = 'md',
    rounded = 'md',
    padding = 'md',
    className = '',
    ...rest
  },
  ref
) => {
  const maxWidthClasses = {
    sx: 'rui:max-w-[475px]',
    sm: 'rui:max-w-screen-sm',
    md: 'rui:max-w-screen-md',
    lg: 'rui:max-w-screen-lg',
    xl: 'rui:max-w-screen-xl',
    '2xl': 'rui:max-w-screen-2xl',
    fullWidth: 'rui:max-w-full'
  }

  const shadowClasses = {
    none: 'rui:shadow-none',
    sm: 'rui:shadow-sm',
    md: 'rui:shadow-md',
    lg: 'rui:shadow-lg',
    xl: 'rui:shadow-xl'
  }

  const roundedClasses = {
    none: 'rui:rounded-none',
    sm: 'rui:rounded-sm',
    md: 'rui:rounded-md',
    lg: 'rui:rounded-lg',
    xl: 'rui:rounded-xl',
    full: 'rui:rounded-full'
  }

  const paddingClasses = {
    0: 'rui:p-0',
    sm: 'rui:p-2',
    md: 'rui:p-4',
    lg: 'rui:p-6',
    xl: 'rui:p-8'
  }

  const containerClasses = clsx(
    'rui:w-full',
    maxWidthClasses[maxWidth],
    shadowClasses[shadow],
    roundedClasses[rounded],
    paddingClasses[padding],
    className
  )

  return (
    <Component ref={ref} className={containerClasses} {...rest}>
      {children}
    </Component>
  )
})

Container.displayName = 'Container'

export default Container
