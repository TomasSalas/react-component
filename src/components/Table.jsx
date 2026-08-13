import React, { useState, useMemo, useRef, useEffect, forwardRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Inbox,
  ChevronUp,
  ChevronDown,
  Loader2,
  Search,
  X
} from 'lucide-react'
import clsx from 'clsx'

const variantStyles = {
  primary: {
    text: 'rui:text-[var(--primary-bg)]',
    border: 'rui:border-[var(--primary-bg)]',
    loader: 'rui:text-[var(--primary-bg)]',
    ping: 'rui:bg-[var(--primary-bg)]',
    ring: 'rui:focus-visible:ring-(--primary-focus)'
  },
  success: {
    text: 'rui:text-[var(--success-bg)]',
    border: 'rui:border-[var(--success-bg)]',
    loader: 'rui:text-[var(--success-bg)]',
    ping: 'rui:bg-[var(--success-bg)]',
    ring: 'rui:focus-visible:ring-(--success-focus)'
  },
  error: {
    text: 'rui:text-[var(--error-bg)]',
    border: 'rui:border-[var(--error-bg)]',
    loader: 'rui:text-[var(--error-bg)]',
    ping: 'rui:bg-[var(--error-bg)]',
    ring: 'rui:focus-visible:ring-(--error-focus)'
  },
  warning: {
    text: 'rui:text-[var(--warning-bg)]',
    border: 'rui:border-[var(--warning-bg)]',
    loader: 'rui:text-[var(--warning-bg)]',
    ping: 'rui:bg-[var(--warning-bg)]',
    ring: 'rui:focus-visible:ring-(--warning-focus)'
  },
  ghost: {
    text: 'rui:text-[var(--ghost-text)]',
    border: 'rui:border-[var(--ghost-border)]',
    loader: 'rui:text-[var(--ghost-text)]',
    ping: 'rui:bg-[var(--ghost-border)]',
    ring: 'rui:focus-visible:ring-(--primary-focus)'
  }
}

const TablePagination = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  rowsPerPage,
  rowsPerPageOptions,
  onPageChange,
  onRowsPerPageChange,
  size,
  sizes,
  ring
}) => {
  if (totalItems === 0) return null

  const paginationClasses = clsx(
    'rui:flex rui:items-center rui:justify-between rui:mx-1 rui:p-3',
    sizes.select
  )

  const buttonClasses = clsx(
    'rui:inline-flex rui:items-center rui:justify-center rui:rounded-md rui:bg-transparent rui:text-gray-600',
    'rui:hover:bg-gray-100 rui:hover:text-gray-800 rui:focus:outline-none rui:focus-visible:ring-2',
    ring,
    'rui:disabled:opacity-50 rui:disabled:cursor-not-allowed rui:transition-colors',
    sizes.button
  )

  return (
    <div className={paginationClasses}>
      <div className='rui:flex rui:items-center rui:space-x-2'>
        <p className='rui:text-sm rui:text-gray-700'>Filas por página:</p>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(e)}
          className={clsx(
            'rui:bg-transparent rui:text-gray-900 rui:focus:outline-none rui:focus-visible:ring-2 rui:rounded rui:border-0 rui:cursor-pointer',
            ring
          )}
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className='rui:flex rui:items-center'>
        <div className='rui:text-sm rui:text-gray-700'>
          {startIndex + 1}-{endIndex} de {totalItems}
        </div>
        <div className='rui:flex rui:items-center rui:space-x-2'>
          <button
            onClick={() => onPageChange('prev')}
            disabled={currentPage === 1}
            className={buttonClasses}
            type='button'
          >
            <ChevronLeft size={sizes.icon} />
            <span className='rui:sr-only'>Página anterior</span>
          </button>
          <button
            onClick={() => onPageChange('next')}
            disabled={currentPage === totalPages}
            className={buttonClasses}
            type='button'
          >
            <ChevronRight size={sizes.icon} />
            <span className='rui:sr-only'>Página siguiente</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const Table = forwardRef(
  (
    {
      columns: providedColumns,
      data = [],
      actions = null,
      onRowClick = null,
      onSortChange = null,
      caption,
      tableClassName = '',
      rowClassName = '',
      rowsPerPageOptions = [10, 25, 50],
      defaultRowsPerPage = 10,
      currentPage: controlledCurrentPage,
      rowsPerPage: controlledRowsPerPage,
      totalItems: controlledTotalItems,
      totalPages: controlledTotalPages,
      onPageChange,
      onRowsPerPageChange,
      size = 'md',
      titleNoData = 'No hay datos disponibles',
      subTitleNoData = '',
      disablePagination = false,
      heightVh = 50,
      loadingInfo = false,
      textLoading = '',
      variant = 'primary',
      boldHeaders = false,
      enableSorting = false,
      enableFiltering = false
    },
    ref
  ) => {
    const [internalCurrentPage, setInternalCurrentPage] = useState(1)
    const [internalRowsPerPage, setInternalRowsPerPage] = useState(
      controlledRowsPerPage !== undefined
        ? controlledRowsPerPage
        : defaultRowsPerPage
    )

    const [filters, setFilters] = useState({})
    const [activeSearchColumn, setActiveSearchColumn] = useState(null)

    const [sortConfig, setSortConfig] = useState({
      key: null,
      direction: null
    })

    const isControlled =
      controlledCurrentPage !== undefined &&
      controlledRowsPerPage !== undefined
    const currentPage = isControlled
      ? controlledCurrentPage
      : internalCurrentPage
    const rowsPerPage = isControlled
      ? controlledRowsPerPage
      : internalRowsPerPage

    const tableContainerRef = useRef(null)
    const scrollPositionRef = useRef(0)

    const sizeVariants = {
      sm: {
        header: 'rui:px-3 rui:py-4 rui:text-xs',
        cell: 'rui:px-3 rui:py-2 rui:text-xs',
        button: 'rui:w-6 rui:h-6',
        icon: 12,
        select: 'rui:text-xs'
      },
      md: {
        header: 'rui:px-6 rui:py-4 rui:text-sm',
        cell: 'rui:px-6 rui:py-4 rui:text-sm',
        button: 'rui:w-8 rui:h-8',
        icon: 16,
        select: 'rui:text-sm'
      },
      lg: {
        header: 'rui:px-6 rui:py-4 rui:text-base',
        cell: 'rui:px-6 rui:py-5 rui:text-base',
        button: 'rui:w-10 rui:h-10',
        icon: 20,
        select: 'rui:text-base'
      }
    }

    const currentSizes = sizeVariants[size] || sizeVariants.md
    const currentStyle = variantStyles[variant] || variantStyles.primary
    const rowBgVariant = 'rui:even:bg-slate-50'

    const columns = useMemo(
      () =>
        providedColumns ||
        (data.length > 0
          ? Object.keys(data[0]).map((key) => ({
            key,
            header:
              key.charAt(0).toUpperCase() +
              key
                .slice(1)
                .replace(/([A-Z])/g, ' $1')
                .trim(),
            sortable: enableSorting
          }))
          : []),
      [providedColumns, data, enableSorting]
    )

    const isNumeric = (value) => {
      if (value == null) return false
      if (typeof value === 'boolean') return false
      if (typeof value === 'object') return false
      if (Array.isArray(value)) return false
      const num = Number(value)
      return !Number.isNaN(num) && Number.isFinite(num)
    }

    const filteredData = useMemo(() => {
      if (Object.keys(filters).length === 0) return data

      return data.filter((row) => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true
          const cellValue = row[key]
          if (cellValue === null || cellValue === undefined) return false
          return String(cellValue).toLowerCase().includes(value.toLowerCase())
        })
      })
    }, [data, filters])

    const sortData = useMemo(() => {
      if (!sortConfig.key || !sortConfig.direction) {
        return filteredData
      }

      return [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        const aIsNumeric = isNumeric(aValue)
        const bIsNumeric = isNumeric(bValue)

        let comparison = 0

        if (aIsNumeric && bIsNumeric) {
          const aNum = Number.parseFloat(aValue)
          const bNum = Number.parseFloat(bValue)
          comparison = aNum - bNum
        } else {
          const aStr = String(aValue).toLowerCase()
          const bStr = String(bValue).toLowerCase()
          comparison = aStr.localeCompare(bStr)
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }, [filteredData, sortConfig])

    const handleFilterChange = (key, value) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value
      }))
      setInternalCurrentPage(1)
      if (onPageChange && isControlled) onPageChange(1)
    }

    const toggleSearch = (columnKey) => {
      if (activeSearchColumn === columnKey) {
        setActiveSearchColumn(null)
      } else {
        setActiveSearchColumn(columnKey)
      }
    }

    const handleSort = (columnKey) => {
      if (activeSearchColumn === columnKey) return

      if (!enableSorting) {
        if (onSortChange) {
          onSortChange(columnKey)
        }
        return
      }

      setSortConfig((prevConfig) => {
        if (prevConfig.key === columnKey) {
          if (prevConfig.direction === 'asc') {
            return { key: columnKey, direction: 'desc' }
          } else if (prevConfig.direction === 'desc') {
            return { key: null, direction: null }
          } else {
            return { key: columnKey, direction: 'asc' }
          }
        } else {
          return { key: columnKey, direction: 'asc' }
        }
      })

      if (isControlled && onPageChange) {
        onPageChange(1)
      } else {
        setInternalCurrentPage(1)
      }
    }

    const renderSortIcon = (columnKey) => {
      if (!enableSorting) {
        return null
      }

      const activeColor = currentStyle.text
      const inactiveColor = 'rui:text-gray-400'
      const hoverColor = 'rui:group-hover:text-gray-600'

      if (sortConfig.key === columnKey) {
        if (sortConfig.direction === 'asc') {
          return (
            <div className='rui:flex rui:flex-col rui:ml-1'>
              <ChevronUp
                strokeWidth={3}
                className={`rui:w-3 rui:h-3 ${activeColor} rui:transition-colors rui:duration-200 rui:-mb-1`}
              />
              <ChevronDown
                strokeWidth={3}
                className={`rui:w-3 rui:h-3 ${inactiveColor} rui:transition-colors rui:duration-200`}
              />
            </div>
          )
        } else if (sortConfig.direction === 'desc') {
          return (
            <div className='rui:flex rui:flex-col rui:ml-1'>
              <ChevronUp
                strokeWidth={3}
                className={`rui:w-3 rui:h-3 ${inactiveColor} rui:transition-colors rui:duration-200 rui:-mb-1`}
              />
              <ChevronDown
                strokeWidth={3}
                className={`rui:w-3 rui:h-3 ${activeColor} rui:transition-colors rui:duration-200`}
              />
            </div>
          )
        }
      }

      return (
        <div className='rui:flex rui:flex-col rui:ml-1'>
          <ChevronUp
            strokeWidth={3}
            className={`rui:w-3 rui:h-3 ${inactiveColor} ${hoverColor} rui:transition-colors rui:duration-200 rui:-mb-1`}
          />
          <ChevronDown
            strokeWidth={3}
            className={`rui:w-3 rui:h-3 ${inactiveColor} ${hoverColor} rui:transition-colors rui:duration-200`}
          />
        </div>
      )
    }

    const totalItems =
      controlledTotalItems !== undefined
        ? controlledTotalItems
        : sortData.length
    const totalPages =
      controlledTotalPages !== undefined
        ? controlledTotalPages
        : Math.ceil(totalItems / rowsPerPage)

    useEffect(() => {
      if (!disablePagination && totalPages > 0 && currentPage > totalPages) {
        if (isControlled && onPageChange) {
          onPageChange(totalPages)
        } else {
          setInternalCurrentPage(totalPages)
        }
      }
    }, [
      totalPages,
      currentPage,
      disablePagination,
      isControlled,
      onPageChange
    ])

    const paginatedData = useMemo(() => {
      if (disablePagination) {
        return sortData
      }
      if (
        isControlled &&
        controlledTotalItems !== undefined &&
        controlledTotalPages !== undefined
      ) {
        return sortData
      }
      const startIndex = (currentPage - 1) * rowsPerPage
      return sortData.slice(startIndex, startIndex + rowsPerPage)
    }, [
      sortData,
      currentPage,
      rowsPerPage,
      disablePagination,
      isControlled,
      controlledTotalItems,
      controlledTotalPages
    ])

    useEffect(() => {
      const container = tableContainerRef.current
      if (container && !disablePagination) {
        const handleScrollRestore = () => {
          const maxScroll = container.scrollHeight - container.clientHeight
          container.scrollTop = Math.min(scrollPositionRef.current, maxScroll)
        }

        if (
          sortData.length > 0 &&
          currentPage === 1 &&
          rowsPerPage === (controlledRowsPerPage || defaultRowsPerPage)
        ) {
          window.requestAnimationFrame(handleScrollRestore)
        }

        const handleScroll = () => {
          scrollPositionRef.current = container.scrollTop
        }

        container.addEventListener('scroll', handleScroll)
        return () => container.removeEventListener('scroll', handleScroll)
      }
    }, [
      sortData,
      defaultRowsPerPage,
      disablePagination,
      currentPage,
      rowsPerPage,
      controlledRowsPerPage
    ])

    useEffect(() => {
      const container = tableContainerRef.current
      if (container && !disablePagination) {
        container.scrollTop = 0
      }
    }, [currentPage, rowsPerPage, disablePagination])

    const handlePageChange = (direction) => {
      let newPage = currentPage
      if (direction === 'prev' && currentPage > 1) {
        newPage = currentPage - 1
      }
      if (direction === 'next' && currentPage < totalPages) {
        newPage = currentPage + 1
      }

      if (newPage !== currentPage) {
        if (isControlled && onPageChange) {
          onPageChange(direction)
        } else {
          setInternalCurrentPage(newPage)
        }
        scrollPositionRef.current = 0
      }
    }

    const handleRowsPerPageChange = (e) => {
      const newRowsPerPage = Number(e.target.value)
      if (isControlled && onRowsPerPageChange) {
        onRowsPerPageChange(e)
      } else {
        setInternalRowsPerPage(newRowsPerPage)
        setInternalCurrentPage(1)
      }
      scrollPositionRef.current = 0
    }

    const handleRowClick = (row) => {
      if (onRowClick) onRowClick(row)
    }

    const handleKeyDown = (e, row) => {
      if ((e.key === 'Enter' || e.key === ' ') && onRowClick) {
        e.preventDefault()
        handleRowClick(row)
      }
    }

    const tableContainerStyle = {
      maxHeight:
        typeof heightVh === 'number' && heightVh > 0 ? `${heightVh}vh` : '50vh'
    }

    return (
      <div ref={ref} className='rui:w-full rui:space-y-4 rui:relative rui:shadow-lg rui:rounded-lg'>
        <div className='rui:relative'>
          {loadingInfo && (
            <div className='rui:absolute rui:inset-0 rui:bg-white rui:backdrop-blur-sm rui:flex rui:items-center rui:justify-center rui:z-30 rui:rounded-xl'>
              <div className='rui:flex rui:flex-col rui:items-center rui:justify-center rui:p-6'>
                <div className='rui:relative'>
                  <Loader2
                    className={clsx(
                      'rui:w-12 rui:h-12 rui:animate-spin',
                      currentStyle.loader
                    )}
                  />
                  <div
                    className={clsx(
                      'rui:absolute rui:inset-0 rui:w-12 rui:h-12 rui:rounded-full rui:opacity-20 rui:animate-ping',
                      currentStyle.ping
                    )}
                  />
                </div>
                <p className='rui:mt-3 rui:text-sm rui:text-gray-700 rui:font-medium rui:tracking-wide'>
                  {textLoading}
                </p>
              </div>
            </div>
          )}
          <div
            ref={tableContainerRef}
            className='rui:relative rui:overflow-auto rui:bg-white rui:sm:rounded-xl'
            style={tableContainerStyle}
          >
            <table
              className={clsx(
                'rui:w-full rui:text-left rui:text-gray-500 rui:whitespace-normal rui:min-w-full',
                tableClassName
              )}
            >
              {caption && (
                <caption className='rui:p-5 rui:text-lg rui:font-semibold rui:text-left rui:text-gray-900 rui:bg-white rui:sticky rui:top-0 rui:z-[5]'>
                  {caption}
                </caption>
              )}

              {data.length > 0 && (
                <thead className='rui:text-gray-700 rui:bg-linear-to-r rui:from-gray-50 rui:to-gray-100 rui:sticky rui:top-0 rui:z-[5] rui:border-b rui:border-gray-200'>
                  <tr>
                    {columns.map((column) => {
                      const isFiltering = activeSearchColumn === column.key
                      const hasFilterValue =
                        filters[column.key] && filters[column.key].length > 0

                      const isSortable = enableSorting && (column.sortable || enableSorting)

                      const handleHeaderClick = () => {
                        if (isSortable) {
                          handleSort(column.key)
                        }
                      }

                      const ariaSort = isSortable
                        ? (sortConfig.key === column.key
                            ? (sortConfig.direction === 'asc' ? 'ascending' : sortConfig.direction === 'desc' ? 'descending' : 'none')
                            : 'none')
                        : undefined

                      return (
                        <th
                          key={column.key}
                          scope='col'
                          aria-sort={ariaSort}
                          className={clsx(
                            boldHeaders ? 'rui:font-bold' : 'rui:font-medium',
                            'rui:text-gray-900 rui:tracking-wider rui:text-nowrap rui:relative rui:group',
                            currentSizes.header
                          )}
                        >
                          <div
                            className={clsx(
                              'rui:flex rui:items-center rui:justify-between rui:gap-2',
                              isFiltering ? 'rui:invisible' : 'rui:visible'
                            )}
                          >
                            {column.renderHeader
                              ? (
                                  column.renderHeader(column)
                                )
                              : (
                                <div
                                  onClick={handleHeaderClick}
                                  onKeyDown={(e) => {
                                    if (isSortable && (e.key === 'Enter' || e.key === ' ')) {
                                      e.preventDefault()
                                      handleHeaderClick()
                                    }
                                  }}
                                  tabIndex={isSortable ? 0 : undefined}
                                  role={isSortable ? 'button' : undefined}
                                  className={clsx(
                                    'rui:flex rui:items-center rui:gap-1 rui:select-none',
                                    enableSorting
                                      ? 'rui:cursor-pointer rui:hover:text-gray-800 rui:transition-colors'
                                      : '',
                                    boldHeaders ? 'rui:font-bold' : 'rui:font-medium'
                                  )}
                                >
                                  <span>{column.header}</span>
                                  {(column.sortable || enableSorting) &&
                                    renderSortIcon(column.key)}
                                </div>
                                )}

                            {enableFiltering && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleSearch(column.key)
                                }}
                                className={clsx(
                                  'rui:p-1 rui:rounded-full rui:transition-colors rui:focus:outline-none rui:focus-visible:ring-2',
                                  currentStyle.ring,
                                  hasFilterValue
                                    ? 'rui:opacity-100 rui:bg-(--primary-selected-bg)'
                                    : 'rui:opacity-0 rui:group-hover:opacity-100 rui:text-gray-400 rui:hover:bg-gray-200 rui:hover:text-gray-600',
                                  hasFilterValue ? currentStyle.text : ''
                                )}
                                title={`Buscar en ${column.header}`}
                                aria-label={`Buscar en ${column.header}`}
                              >
                                <Search
                                  size={14}
                                  strokeWidth={hasFilterValue ? 2.5 : 2}
                                />
                              </button>
                            )}
                          </div>

                          {isFiltering && (
                            <div className='rui:absolute rui:inset-0 rui:flex rui:items-center rui:px-3 rui:bg-gray-50 rui:z-10'>
                              <div className='rui:relative rui:w-full rui:flex rui:items-center'>
                                <input
                                  autoFocus
                                  type='text'
                                  placeholder={column.header}
                                  value={filters[column.key] || ''}
                                  onBlur={() => setActiveSearchColumn(null)}
                                  onChange={(e) =>
                                    handleFilterChange(
                                      column.key,
                                      e.target.value
                                    )}
                                  className={clsx(
                                    currentStyle.border,
                                    'rui:border-b-2 rui:w-full rui:py-1 rui:text-sm rui:bg-transparent rui:focus:outline-none rui:transition-colors rui:placeholder-gray-400 rui:font-normal',
                                    'rui:text-gray-900'
                                  )}
                                />
                                <button
                                  type='button'
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleFilterChange(column.key, '')
                                  }}
                                  aria-label={`Limpiar filtro de ${column.header}`}
                                  className='rui:absolute rui:right-0 rui:top-1/2 rui:-translate-y-1/2 rui:text-gray-400 rui:hover:text-red-500 rui:p-1'
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          )}
                        </th>
                      )
                    })}
                    {actions && (
                      <th
                        scope='col'
                        className={clsx(
                          boldHeaders ? 'rui:font-bold' : 'rui:font-medium',
                          'rui:text-gray-900 rui:tracking-wider',
                          currentSizes.header
                        )}
                      >
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
              )}

              <tbody>
                {paginatedData.length === 0
                  ? (
                    <tr>
                      <td
                        colSpan={columns.length + (actions ? 1 : 0)}
                        className='rui:p-0 rui:border-b rui:border-gray-100'
                      >
                        <div className='rui:flex rui:flex-col rui:items-center rui:justify-center rui:h-60'>
                          <div className='rui:p-4 rui:bg-gray-50 rui:rounded-full rui:mb-4'>
                            <Inbox className='rui:h-8 rui:w-8 rui:text-gray-400' />
                          </div>
                          <p className='rui:text-lg rui:font-semibold rui:text-gray-900 rui:mb-1'>
                            {titleNoData}
                          </p>
                          {subTitleNoData !== '' && (
                            <p className='rui:text-sm rui:text-gray-500 rui:text-center rui:max-w-sm'>
                              {subTitleNoData}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                    )
                  : (
                      paginatedData.map((row, index) => (
                        <tr
                          key={row.id || index}
                          className={clsx(
                            'rui:bg-white rui:border-b rui:border-gray-100 rui:transition-colors rui:duration-150 rui:ease-in-out',
                            rowBgVariant,
                            {
                              'rui:cursor-pointer': onRowClick,
                              'rui:hover:bg-gray-50': !onRowClick
                            },
                            rowClassName
                          )}
                          onClick={() => handleRowClick(row)}
                          onKeyDown={(e) => handleKeyDown(e, row)}
                          tabIndex={onRowClick ? 0 : undefined}
                          role={onRowClick ? 'button' : undefined}
                        >
                          {columns.map((column) => (
                            <td
                              key={`${row.id || index}-${column.key}`}
                              className={clsx(
                                'rui:font-medium rui:text-gray-800 rui:align-middle',
                                currentSizes.cell,
                                {
                                  'rui:whitespace-nowrap rui:overflow-hidden rui:text-ellipsis':
                                  !column.wrapText,
                                  'rui:whitespace-normal rui:wrap-break-word': column.wrapText
                                }
                              )}
                              style={
                              column.maxWidth ? { maxWidth: column.maxWidth } : {}
                            }
                            >
                              {column.render
                                ? (
                                    column.render(row[column.key], row)
                                  )
                                : (
                                  <span
                                    className={clsx('rui:text-gray-900', {
                                      'rui:block': column.wrapText,
                                      'rui:truncate': !column.wrapText
                                    })}
                                    title={
                                    !column.wrapText ? row[column.key] : undefined
                                  }
                                  >
                                    {row[column.key]}
                                  </span>
                                  )}
                            </td>
                          ))}
                          {actions && (
                            <td
                              className={clsx(
                                currentSizes.cell,
                                'rui:w-32 rui:align-middle'
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className='rui:flex rui:items-center rui:gap-2'>
                                {actions(row)}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
              </tbody>
            </table>
          </div>
          {!disablePagination && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={(currentPage - 1) * rowsPerPage}
              endIndex={Math.min(
                (currentPage - 1) * rowsPerPage + rowsPerPage,
                totalItems
              )}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              size={size}
              sizes={currentSizes}
              ring={currentStyle.ring}
            />
          )}
        </div>
      </div>
    )
  }
)

Table.displayName = 'Table'

export default Table
