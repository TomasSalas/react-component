import React from 'react'
import clsx from 'clsx'
import { ChevronRight } from 'lucide-react'

const BreadCrumbs = ({
  items = [],
  separator = <ChevronRight className='rui:w-4 rui:h-4' />,
  homeIcon,
  className = '',
  variant = 'primary',
  linkComponent: LinkComponent = 'a'
}) => {
  if (!items || items.length === 0) return null

  const variantClasses = {
    primary: 'rui:hover:text-[var(--primary-bg)]'
  }

  const activeHover = variantClasses[variant] || variantClasses.primary

  return (
    <nav
      aria-label='BreadCrumbs'
      className={clsx('rui:flex rui:py-2 rui:text-gray-500 rui:text-sm rui:select-none', className)}
    >
      <ol className='rui:inline-flex rui:items-center rui:space-x-1 rui:md:space-x-2 rui:list-none rui:p-0 rui:m-0'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0

          const isInteractive = !isLast && (!!item.href || !!item.onClick)

          const linkProps = isInteractive
            ? LinkComponent === 'a'
              ? { href: item.href || '#' }
              : { to: item.href || '#' }
            : {}

          return (
            <li key={index} className='rui:inline-flex rui:items-center'>
              {!isFirst && (
                <span className='rui:mx-2 rui:text-gray-400 rui:flex rui:items-center rui:justify-center'>
                  {separator}
                </span>
              )}

              <div className='rui:flex rui:items-center'>
                {isLast
                  ? (
                    <span aria-current='page' className='rui:font-semibold rui:text-gray-900 rui:flex rui:items-center rui:gap-1'>
                      {isFirst && homeIcon && (
                        <span className='rui:shrink-0'>{homeIcon}</span>
                      )}
                      {item.icon && !homeIcon && <span className='rui:shrink-0'>{item.icon}</span>}
                      {item.label}
                    </span>
                    )
                  : (
                    <LinkComponent
                      {...linkProps}
                      onClick={(e) => {
                        if (!isInteractive) {
                          e.preventDefault()
                          return
                        }
                        if (item.onClick) {
                          if (LinkComponent === 'a') e.preventDefault()
                          item.onClick()
                        }
                      }}
                      className={clsx(
                        'rui:inline-flex rui:items-center rui:gap-1 rui:transition-colors rui:duration-200',
                        {
                          [activeHover + ' rui:cursor-pointer']: isInteractive,
                          'rui:cursor-default': !isInteractive
                        }
                      )}
                    >
                      {isFirst && homeIcon && (
                        <span className='rui:shrink-0'>{homeIcon}</span>
                      )}
                      {item.icon && <span className='rui:shrink-0'>{item.icon}</span>}
                      {item.label}
                    </LinkComponent>
                    )}
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

BreadCrumbs.displayName = 'BreadCrumbs'

export default BreadCrumbs
