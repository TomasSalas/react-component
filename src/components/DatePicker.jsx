import React, {
  forwardRef,
  useEffect,
  useMemo,
  useState,
  memo,
  useRef
} from 'react'
import { createPortal } from 'react-dom'
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import clsx from 'clsx'
import { useId } from '../hooks/useId'

const TimePanel = ({ date, onTimeSelect, activeVariant, type = 'start', open }) => {
  const getVariantConfig = (variant) => {
    const variants = {
      primary: {
        selectedBg: 'rui:bg-[var(--primary-selected-bg)]',
        text: 'rui:text-[var(--primary-bg)]',
        activeBorder: 'rui:border-[var(--primary-bg)]',
        activeRing: 'rui:ring-[var(--primary-bg)]'
      },
      success: {
        selectedBg: 'rui:bg-[var(--success-selected-bg)]',
        text: 'rui:text-[var(--success-bg)]',
        activeBorder: 'rui:border-[var(--success-bg)]',
        activeRing: 'rui:ring-[var(--success-bg)]'
      },
      warning: {
        selectedBg: 'rui:bg-[var(--warning-selected-bg)]',
        text: 'rui:text-[var(--warning-active)]',
        activeBorder: 'rui:border-[var(--warning-active)]',
        activeRing: 'rui:ring-[var(--warning-active)]'
      },
      error: {
        selectedBg: 'rui:bg-[var(--error-selected-bg)]',
        text: 'rui:text-[var(--error-bg)]',
        activeBorder: 'rui:border-[var(--error-bg)]',
        activeRing: 'rui:ring-[var(--error-bg)]'
      }
    }
    return variants[variant] || {
      selectedBg: 'rui:bg-orange-100',
      text: 'rui:text-orange-600',
      activeBorder: 'rui:border-orange-600',
      activeRing: 'rui:ring-orange-600'
    }
  }

  const styles = getVariantConfig(activeVariant)

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

  const safeDate = useMemo(() => {
    if (date instanceof Date) return date
    if (typeof date === 'string') return new Date(date)
    const now = new Date()
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
  }, [date])

  const [currentHour, setCurrentHour] = useState(safeDate.getUTCHours())
  const [currentMinute, setCurrentMinute] = useState(safeDate.getUTCMinutes())

  const hourRef = useRef(null)
  const minRef = useRef(null)

  const scrollToItem = (ref, value) => {
    if (!ref.current) return
    const container = ref.current
    const items = container.querySelectorAll('.time-button')
    const targetItem = items[value]

    if (targetItem) {
      container.scrollTop = targetItem.offsetTop - 4
    }
  }

  useEffect(() => {
    const newHour = safeDate.getUTCHours()
    const newMinute = safeDate.getUTCMinutes()

    setCurrentHour(newHour)
    setCurrentMinute(newMinute)

    setTimeout(() => {
      scrollToItem(hourRef, newHour)
      scrollToItem(minRef, newMinute)
    }, 50)
  }, [safeDate])

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        scrollToItem(hourRef, currentHour)
        scrollToItem(minRef, currentMinute)
      }, 120)
      return () => clearTimeout(timer)
    }
  }, [open, currentHour, currentMinute])

  const handleSelect = (unit, val) => {
    const numVal = parseInt(val, 10)
    if (unit === 'hour') {
      setCurrentHour(numVal)
      scrollToItem(hourRef, numVal)
    } else {
      setCurrentMinute(numVal)
      scrollToItem(minRef, numVal)
    }
    onTimeSelect(unit, numVal, type)
  }

  const selectedTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`

  const renderColumn = (items, current, unitType, scrollRef) => (
    <div
      ref={scrollRef}
      className='rui:flex-1 rui:overflow-y-auto rui:bg-white rui:h-full rui:no-scrollbar rui:select-none'
      style={{
        scrollBehavior: 'smooth',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}
    >
      <div className='rui:flex rui:flex-col rui:items-center rui:gap-0.5 rui:p-1'>
        {items.map((val) => {
          const valNum = parseInt(val, 10)
          const isSelected = current === valNum
          return (
            <button
              key={val}
              type='button'
              className={clsx(
                'time-button rui:rounded-md rui:h-8 rui:w-8 rui:shrink-0 rui:flex rui:items-center rui:justify-center rui:text-sm rui:transition-colors',
                isSelected
                  ? `${styles.selectedBg} ${styles.text} rui:font-bold`
                  : 'rui:text-slate-600 rui:hover:bg-gray-100 rui:hover:text-slate-900'
              )}
              onClick={(e) => {
                e.stopPropagation()
                handleSelect(unitType, val)
              }}
            >
              {val}
            </button>
          )
        })}
        <div className='rui:h-54.25 rui:shrink-0' />
      </div>
    </div>
  )

  return (
    <div className='rui:flex rui:flex-col rui:w-30 rui:h-75 rui:overflow-hidden rui:bg-white rui:border-l rui:border-gray-100'>
      <div className='rui:z-20 rui:py-2.5 rui:bg-white rui:border-b rui:border-gray-100 rui:flex rui:items-center rui:justify-center rui:sticky rui:top-0'>
        <span className='rui:text-sm rui:font-bold rui:text-slate-800 rui:tracking-tight'>
          {selectedTime}
        </span>
      </div>

      <div className='rui:flex rui:flex-1 rui:overflow-hidden rui:relative'>
        {renderColumn(hours, currentHour, 'hour', hourRef)}
        <div className='rui:flex rui:items-center rui:justify-center rui:w-px rui:bg-gray-100' />
        {renderColumn(minutes, currentMinute, 'minute', minRef)}
      </div>
    </div>
  )
}

const MONTHS_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const SHORT_DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']

const isSameDay = (d1, d2) =>
  d1 && d2 &&
  d1.getUTCFullYear() === d2.getUTCFullYear() &&
  d1.getUTCMonth() === d2.getUTCMonth() &&
  d1.getUTCDate() === d2.getUTCDate()

const formatDate = (date, showTime) => {
  if (!date) return ''
  const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
  if (showTime) {
    const h = String(date.getUTCHours()).padStart(2, '0')
    const m = String(date.getUTCMinutes()).padStart(2, '0')
    return `${dateStr} ${h}:${m}`
  }
  return dateStr
}

const formatISO = (date, showTime) => {
  if (!date) return ''
  const YYYY = date.getUTCFullYear()
  const MM = String(date.getUTCMonth() + 1).padStart(2, '0')
  const DD = String(date.getUTCDate()).padStart(2, '0')

  if (showTime) {
    const hh = String(date.getUTCHours()).padStart(2, '0')
    const mm = String(date.getUTCMinutes()).padStart(2, '0')
    return `${YYYY}-${MM}-${DD}T${hh}:${mm}:00Z`
  }
  return `${YYYY}-${MM}-${DD}`
}

const parseISOAsUTC = (iso) => {
  if (!iso) return null
  if (iso.includes('T') && !iso.endsWith('Z') && !iso.includes('-')) {
    return new Date(`${iso}Z`)
  }
  return new Date(iso)
}

const getTodayUTC = () => {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

const getNextMonth = (date) => {
  const d = new Date(date)
  d.setUTCMonth(d.getUTCMonth() + 1)
  return d
}

const getVariantConfig = (variant) => {
  const variants = {
    primary: {
      mainBg: 'rui:bg-[var(--primary-bg)]',
      mainText: 'rui:text-[var(--primary-bg)]',
      contrastText: 'rui:text-[var(--primary-text)]',
      lightBg: 'rui:bg-[var(--primary-selected-bg)]',
      lightText: 'rui:text-[var(--primary-selected-text)]',
      border: 'rui:focus-within:border-[var(--primary-bg)]',
      ring: 'rui:focus-within:ring-[var(--primary-bg)]',
      focusRing: 'rui:focus-visible:ring-[var(--primary-focus)]',
      hoverBtn: 'rui:hover:bg-[var(--primary-bg)] rui:hover:text-[var(--primary-text)]',
      hoverLight: 'rui:hover:bg-[var(--primary-selected-bg)]',
      hoverText: 'rui:hover:text-[var(--primary-bg)]'
    },
    success: {
      mainBg: 'rui:bg-[var(--success-bg)]',
      mainText: 'rui:text-[var(--success-bg)]',
      contrastText: 'rui:text-[var(--success-text)]',
      lightBg: 'rui:bg-[var(--success-selected-bg)]',
      lightText: 'rui:text-[var(--success-selected-text)]',
      border: 'rui:focus-within:border-[var(--success-bg)]',
      ring: 'rui:focus-within:ring-[var(--success-bg)]',
      focusRing: 'rui:focus-visible:ring-[var(--success-focus)]',
      hoverBtn: 'rui:hover:bg-[var(--success-bg)] rui:hover:text-[var(--success-text)]',
      hoverLight: 'rui:hover:bg-[var(--success-selected-bg)]',
      hoverText: 'rui:hover:text-[var(--success-bg)]'
    },
    warning: {
      mainBg: 'rui:bg-[var(--warning-bg)]',
      mainText: 'rui:text-[var(--warning-active)]',
      contrastText: 'rui:text-[var(--warning-text)]',
      lightBg: 'rui:bg-[var(--warning-selected-bg)]',
      lightText: 'rui:text-[var(--warning-selected-text)]',
      border: 'rui:focus-within:border-[var(--warning-bg)]',
      ring: 'rui:focus-within:ring-[var(--warning-bg)]',
      focusRing: 'rui:focus-visible:ring-[var(--warning-focus)]',
      hoverBtn: 'rui:hover:bg-[var(--warning-bg)] rui:hover:text-[var(--warning-text)]',
      hoverLight: 'rui:hover:bg-[var(--warning-selected-bg)]',
      hoverText: 'rui:hover:text-[var(--warning-active)]'
    },
    error: {
      mainBg: 'rui:bg-[var(--error-bg)]',
      mainText: 'rui:text-[var(--error-bg)]',
      contrastText: 'rui:text-[var(--error-text)]',
      lightBg: 'rui:bg-[var(--error-selected-bg)]',
      lightText: 'rui:text-[var(--error-selected-text)]',
      border: 'rui:border-[var(--error-bg)] rui:focus-within:border-[var(--error-bg)]',
      ring: 'rui:focus-within:ring-[var(--error-bg)]',
      focusRing: 'rui:focus-visible:ring-[var(--error-focus)]',
      hoverBtn: 'rui:hover:bg-[var(--error-bg)] rui:hover:text-[var(--error-text)]',
      hoverLight: 'rui:hover:bg-[var(--error-selected-bg)]',
      hoverText: 'rui:hover:text-[var(--error-bg)]'
    }
  }
  return variants[variant] || variants.primary
}

const YearPanel = ({ viewDate, onSelect, activeVariant }) => {
  const currentYear = viewDate.getUTCFullYear()
  const startYear = Math.floor(currentYear / 10) * 10
  const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i)
  const styles = getVariantConfig(activeVariant)

  return (
    <div className='rui:grid rui:grid-cols-3 rui:gap-4 rui:p-2 rui:h-64 rui:content-start'>
      {years.map((year) => {
        const isSelected = year === currentYear
        const isOut = year < startYear || year > startYear + 9
        return (
          <button
            key={year} onClick={(e) => { e.stopPropagation(); onSelect(year) }}
            className={clsx('rui:p-2 rui:text-sm rui:rounded-md rui:transition-colors rui:h-10',
              isSelected ? `${styles.mainBg} ${styles.contrastText} rui:font-semibold` : `rui:text-gray-700 rui:hover:bg-gray-100 ${styles.hoverText}`,
              isOut && 'rui:text-gray-400')}
          >{year}
          </button>
        )
      })}
    </div>
  )
}

const MonthPanel = ({ viewDate, onSelect, activeVariant }) => {
  const styles = getVariantConfig(activeVariant)
  return (
    <div className='rui:grid rui:grid-cols-3 rui:gap-4 rui:p-2 rui:h-64 rui:content-start'>
      {MONTHS_NAMES.map((month, index) => {
        const isSelected = index === viewDate.getUTCMonth()
        return (
          <button
            key={month} onClick={(e) => { e.stopPropagation(); onSelect(index) }}
            className={clsx('rui:p-2 rui:text-sm rui:rounded-md rui:transition-colors rui:h-12',
              isSelected ? `${styles.mainBg} ${styles.contrastText} rui:font-semibold` : `rui:text-gray-700 rui:hover:bg-gray-100 ${styles.hoverText}`)}
          >
            {month.substring(0, 3)}
          </button>
        )
      })}
    </div>
  )
}

const DatePanel = memo(({ panelDate, state, handlers, activeVariant, range }) => {
  const styles = getVariantConfig(activeVariant)
  const calendarGrid = useMemo(() => {
    const year = panelDate.getUTCFullYear(); const month = panelDate.getUTCMonth()
    const firstDay = new Date(Date.UTC(year, month, 1)); const startDay = firstDay.getUTCDay()
    const startDate = new Date(Date.UTC(year, month, 1 - startDay)); const grid = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate); date.setUTCDate(date.getUTCDate() + i); grid.push(date)
    }
    return grid
  }, [panelDate])

  const handleDayKeyDown = (e) => {
    const key = e.key
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return
    e.preventDefault()
    const buttons = Array.from(e.currentTarget.parentElement.querySelectorAll('button:not(:disabled)'))
    const currentIndex = buttons.indexOf(e.currentTarget)
    if (currentIndex === -1) return
    const delta = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : key === 'ArrowUp' ? -7 : 7
    const target = buttons[currentIndex + delta]
    target?.focus()
  }

  return (
    <div className='rui:p-1 rui:w-80'>
      <div className='rui:grid rui:grid-cols-7 rui:mb-2 rui:border-b rui:pb-2 rui:border-gray-100'>
        {SHORT_DAYS.map((d) => (<div key={d} className='rui:text-center rui:text-xs rui:font-medium rui:text-gray-400 rui:select-none'>{d}</div>))}
      </div>
      <div className='rui:grid rui:grid-cols-7 rui:gap-1'>
        {calendarGrid.map((date) => {
          const isCurrentMonth = date.getUTCMonth() === panelDate.getUTCMonth()
          if (range && !isCurrentMonth) return <div key={date.toISOString()} className='rui:h-10 rui:w-full rui:invisible' />

          const isToday = isSameDay(date, getTodayUTC())
          const isSelectedSingle = !range && isSameDay(date, state.selectedDate)
          const isRangeStart = range && isSameDay(date, state.rangeStart)
          const isRangeEnd = range && isSameDay(date, state.rangeEnd)
          const isRangeEdge = isRangeStart || isRangeEnd

          let isInRange = false; let isInHoverRange = false
          if (range && state.rangeStart) {
            const time = date.getTime(); const start = state.rangeStart.getTime()
            if (state.rangeEnd) isInRange = time > start && time < state.rangeEnd.getTime()
            else if (state.hoveredDate) {
              const h = state.hoveredDate.getTime(); const s = Math.min(start, h); const e = Math.max(start, h)
              isInHoverRange = time >= s && time <= e
            }
          }

          const isDisabled = state.disabledDates.some((d) => isSameDay(d, date))
          let dayClasses = 'rui:w-full rui:h-10 rui:flex rui:items-center rui:justify-center rui:text-sm rui:transition-colors rui:duration-150 rui:rounded-md rui:relative rui:cursor-pointer'
          if (isDisabled) dayClasses += ' rui:opacity-50 rui:cursor-not-allowed'
          else if (isSelectedSingle || isRangeEdge) dayClasses += ` ${styles.mainBg} ${styles.contrastText} rui:font-bold rui:z-10`
          else if (isInRange || isInHoverRange) dayClasses += ` ${styles.lightBg} ${styles.lightText} ${isInHoverRange ? 'rui:opacity-70' : ''}`
          else if (isToday && !(range ? (state.rangeStart || state.rangeEnd) : state.selectedDate)) dayClasses += ` ${styles.mainBg} ${styles.contrastText}`
          else dayClasses += isCurrentMonth ? ' rui:text-gray-700' : ' rui:text-gray-400'
          if (!isDisabled) dayClasses += ` ${styles.hoverLight} ${styles.hoverText}`

          return (
            <button
              key={date.toISOString()} type='button' className={dayClasses}
              disabled={isDisabled}
              aria-label={date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })}
              aria-current={isToday ? 'date' : undefined}
              aria-selected={isSelectedSingle || isRangeEdge}
              onClick={(e) => !isDisabled && handlers.onDateSelect(e, date)}
              onMouseEnter={() => !isDisabled && handlers.onHover(date)}
              onKeyDown={handleDayKeyDown}
            >{date.getUTCDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
})

const CalendarHeader = ({ panelDate, viewMode, onPrev, onNext, onTitleClick, onSuperPrev, onSuperNext, activeVariant }) => {
  const styles = getVariantConfig(activeVariant)
  const getTitle = () => {
    if (viewMode === 'date') return `${MONTHS_NAMES[panelDate.getUTCMonth()]} ${panelDate.getUTCFullYear()}`
    if (viewMode === 'month') return `${panelDate.getUTCFullYear()}`
    const startYear = Math.floor(panelDate.getUTCFullYear() / 10) * 10
    return `${startYear} - ${startYear + 9}`
  }

  const navBtnClass = clsx(
    'rui:p-2 rui:rounded-full rui:text-gray-700 rui:transition-colors rui:group',
    styles.hoverBtn
  )

  return (
    <div className='rui:flex rui:justify-between rui:items-center rui:mb-4 rui:px-2'>
      <div className='rui:flex rui:gap-1'>
        <button type='button' onClick={onSuperPrev} aria-label='Año anterior' className={navBtnClass}><ChevronsLeft size={16} className='rui:group-hover:text-white rui:transition-colors' /></button>
        <button type='button' onClick={onPrev} aria-label='Mes anterior' className={navBtnClass}><ChevronLeft size={16} className='rui:group-hover:text-white rui:transition-colors' /></button>
      </div>
      <button type='button' onClick={onTitleClick} aria-label='Cambiar vista de calendario' className={`rui:text-sm rui:font-semibold rui:text-gray-800 rui:px-2 rui:py-1 rui:rounded-md ${styles.hoverLight} ${styles.hoverText}`}>{getTitle()}</button>
      <div className='rui:flex rui:gap-1'>
        <button type='button' onClick={onNext} aria-label='Mes siguiente' className={navBtnClass}><ChevronRight size={16} className='rui:group-hover:text-white rui:transition-colors' /></button>
        <button type='button' onClick={onSuperNext} aria-label='Año siguiente' className={navBtnClass}><ChevronsRight size={16} className='rui:group-hover:text-white rui:transition-colors' /></button>
      </div>
    </div>
  )
}

const CalendarPopup = memo(({ range, showTime, state, handlers, activeVariant, open }) => {
  const [leftViewMode, setLeftViewMode] = useState('date')
  const [rightViewMode, setRightViewMode] = useState('date')

  const [leftDate, setLeftDate] = useState(() => {
    const i = state.rangeStart || state.selectedDate || getTodayUTC()
    return new Date(Date.UTC(i.getUTCFullYear(), i.getUTCMonth(), 1))
  })

  const [rightDate, setRightDate] = useState(() => {
    if (range && state.rangeEnd) {
      return new Date(Date.UTC(state.rangeEnd.getUTCFullYear(), state.rangeEnd.getUTCMonth(), 1))
    }
    return getNextMonth(leftDate)
  })

  const handleMove = (amount, unit, side) => {
    const isL = side === 'left'
    const nd = new Date(isL ? leftDate : rightDate)

    if (unit === 'month') nd.setUTCMonth(nd.getUTCMonth() + amount)
    else if (unit === 'year') nd.setUTCFullYear(nd.getUTCFullYear() + amount)
    else if (unit === 'decade') nd.setUTCFullYear(nd.getUTCFullYear() + (amount * 10))

    if (range) {
      if (isL) {
        setLeftDate(nd)
        const nextMonthForRight = new Date(nd)
        nextMonthForRight.setUTCMonth(nextMonthForRight.getUTCMonth() + 1)
        setRightDate(nextMonthForRight)
      } else {
        setRightDate(nd)

        if (nd.getTime() <= leftDate.getTime()) {
          const prevMonthForLeft = new Date(nd)
          prevMonthForLeft.setUTCMonth(prevMonthForLeft.getUTCMonth() - 1)
          setLeftDate(prevMonthForLeft)
        }
      }
    } else {
      setLeftDate(nd)
    }
  }

  const renderSide = (side) => {
    const isL = side === 'left'
    const mode = isL ? leftViewMode : rightViewMode
    const pDate = isL ? leftDate : rightDate

    const getMoveConfig = (isSuper) => {
      if (isSuper) return mode === 'year' ? 'decade' : 'year'
      return mode === 'date' ? 'month' : mode === 'month' ? 'year' : 'decade'
    }

    return (
      <div className={clsx(
        'rui:flex rui:border-gray-100 rui:last:border-0',
        range ? 'rui:border-b rui:lg:border-b-0 rui:lg:border-r' : 'rui:border-r'
      )}
      >
        <div className='rui:flex rui:flex-col rui:p-2'>
          <CalendarHeader
            panelDate={pDate}
            viewMode={mode}
            activeVariant={activeVariant}
            onPrev={() => handleMove(-1, getMoveConfig(false), side)}
            onNext={() => handleMove(1, getMoveConfig(false), side)}
            onSuperPrev={() => handleMove(-1, getMoveConfig(true), side)}
            onSuperNext={() => handleMove(1, getMoveConfig(true), side)}
            onTitleClick={() => {
              const nextMode = mode === 'date' ? 'month' : 'year'
              setLeftViewMode(nextMode)
              setRightViewMode(nextMode)
            }}
          />
          <div className='rui:min-h-70'>
            {mode === 'year' && (
              <YearPanel
                viewDate={pDate}
                onSelect={(y) => {
                  const nd = new Date(pDate)
                  nd.setUTCFullYear(y)

                  if (isL) {
                    setLeftDate(nd)
                    if (nd.getTime() >= rightDate.getTime()) {
                      const nextMonth = new Date(nd)
                      nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1)
                      setRightDate(nextMonth)
                    }
                  } else {
                    setRightDate(nd)
                    if (nd.getTime() <= leftDate.getTime()) {
                      const prevMonth = new Date(nd)
                      prevMonth.setUTCMonth(prevMonth.getUTCMonth() - 1)
                      setLeftDate(prevMonth)
                    }
                  }

                  setLeftViewMode('month')
                  setRightViewMode('month')
                }}
                activeVariant={activeVariant}
              />
            )}
            {mode === 'month' && (
              <MonthPanel
                viewDate={pDate}
                onSelect={(m) => {
                  const nd = new Date(pDate)
                  nd.setUTCMonth(m)

                  if (isL) {
                    setLeftDate(nd)
                    if (nd.getTime() >= rightDate.getTime()) {
                      const nextMonth = new Date(nd)
                      nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1)
                      setRightDate(nextMonth)
                    }
                  } else {
                    setRightDate(nd)
                    if (nd.getTime() <= leftDate.getTime()) {
                      const prevMonth = new Date(nd)
                      prevMonth.setUTCMonth(prevMonth.getUTCMonth() - 1)
                      setLeftDate(prevMonth)
                    }
                  }

                  setLeftViewMode('date')
                  setRightViewMode('date')
                }}
                activeVariant={activeVariant}
              />
            )}
            {mode === 'date' && (
              <DatePanel panelDate={pDate} state={state} handlers={handlers} range={range} activeVariant={activeVariant} />
            )}
          </div>
        </div>
        {showTime && mode === 'date' && (
          <TimePanel
            date={isL ? (range ? state.rangeStart : state.selectedDate) : state.rangeEnd}
            activeVariant={activeVariant} open={open} onTimeSelect={(u, v) => handlers.onTimeSelect(u, v, isL ? 'start' : 'end')}
          />
        )}
      </div>
    )
  }

  useEffect(() => {
    if (state.rangeStart) {
      const newLeft = new Date(Date.UTC(state.rangeStart.getUTCFullYear(), state.rangeStart.getUTCMonth(), 1))
      setLeftDate(newLeft)

      if (range) {
        if (state.rangeEnd) {
          const newRight = new Date(Date.UTC(state.rangeEnd.getUTCFullYear(), state.rangeEnd.getUTCMonth(), 1))
          if (newLeft.getTime() === newRight.getTime()) {
            setRightDate(getNextMonth(newLeft))
          } else {
            setRightDate(newRight)
          }
        } else {
          setRightDate(getNextMonth(newLeft))
        }
      }
    }
  }, [state.rangeStart, state.rangeEnd, range])

  return (
    <div
      className={clsx(
        'rui:bg-white rui:rounded-lg rui:shadow-xl rui:border rui:border-gray-200 rui:flex rui:flex-col rui:lg:flex-row rui:overflow-hidden rui:max-h-[90vh] rui:overflow-y-auto rui:lg:overflow-visible',
        'rui:max-w-[calc(100vw-32px)] rui:overflow-x-auto rui:lg:overflow-x-visible'
      )}
      onMouseLeave={() => handlers.onHover(null)}
    >
      {renderSide('left')}
      {range && renderSide('right')}
    </div>
  )
})

const DatePicker = forwardRef(({
  value, onChange = () => { }, placeholder = 'Selecciona una fecha', errorMessage = '', className = '',
  range = false, rangeDays = null, size = 'medium', variant = 'primary', disabledDates = [], label = '',
  disabled = false, showTime = false
}, ref) => {
  const activeVariant = errorMessage ? 'error' : variant; const id = useId(); const errorId = `${id}-error`; const containerRef = useRef(null)
  const [open, setOpen] = useState(false); const [position, setPosition] = useState({ top: 0, left: 0 })
  const [inputValue, setInputValue] = useState(''); const [selectedDate, setSelectedDate] = useState(null)
  const [rangeStart, setRangeStart] = useState(null); const [rangeEnd, setRangeEnd] = useState(null); const [hoveredDate, setHoveredDate] = useState(null)
  const styles = getVariantConfig(activeVariant)
  const parsedDisabled = useMemo(() => disabledDates.map(d => parseISOAsUTC(d)).filter(Boolean), [disabledDates])

  useEffect(() => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      setSelectedDate(null)
      setRangeStart(null)
      setRangeEnd(null)
      setInputValue('')
      return
    }

    if (range && Array.isArray(value)) {
      const [startStr, endStr] = value
      const s = parseISOAsUTC(startStr)
      const e = parseISOAsUTC(endStr)

      if (s && e) {
        setRangeStart(s)
        setRangeEnd(e)
        setInputValue(`${formatDate(s, showTime)} - ${formatDate(e, showTime)}`)
      }
    } else if (!range && typeof value === 'string') {
      const d = parseISOAsUTC(value)
      if (d) {
        setSelectedDate(d)
        setInputValue(formatDate(d, showTime))
      }
    }
  }, [value, range, showTime])

  useEffect(() => {
    const click = (e) => {
      const p = document.getElementById(`calendar-portal-${id}`)
      if (open && containerRef.current && !containerRef.current.contains(e.target) && (!p || !p.contains(e.target))) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', click)
    return () => document.removeEventListener('mousedown', click)
  }, [open, id])

  const finalize = (s, e) => {
    if (range) {
      setInputValue(`${formatDate(s, showTime)} - ${formatDate(e, showTime)}`)
      onChange([formatISO(s, showTime), formatISO(e, showTime)])
    } else {
      setInputValue(formatDate(s, showTime))
      onChange(formatISO(s, showTime))
    }
    setOpen(false)
  }

  const handleDateSelect = (e, date) => {
    e.stopPropagation()

    if (range) {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        const ns = new Date(date)
        setRangeStart(ns)
        setRangeEnd(null)
      } else {
        let s = new Date(rangeStart)
        let ed = new Date(date)

        if (ed < s) [s, ed] = [ed, s]

        if (rangeDays) {
          const diff = Math.floor((ed.getTime() - s.getTime()) / 86400000) + 1
          if (diff > rangeDays) {
            ed = new Date(s)
            ed.setUTCDate(s.getUTCDate() + (rangeDays - 1))
          }
        }

        setRangeEnd(ed)
        if (!showTime) {
          finalize(s, ed)
        } else {
          setInputValue(`${formatDate(s, showTime)} - ${formatDate(ed, showTime)}`)
          onChange([formatISO(s, showTime), formatISO(ed, showTime)])
        }
      }
    } else {
      const nd = new Date(date)

      if (selectedDate) {
        nd.setUTCHours(
          selectedDate.getUTCHours(),
          selectedDate.getUTCMinutes(),
          0,
          0
        )
      } else {
        nd.setUTCHours(0, 0, 0, 0)
      }

      setSelectedDate(nd)

      if (!showTime) {
        finalize(nd)
      } else {
        setInputValue(formatDate(nd, showTime))
        onChange(formatISO(nd, showTime))
      }
    }
  }

  const handleTimeSelect = (unit, val, side) => {
    if (range) {
      if (side === 'start') {
        const newStart = new Date(rangeStart || getTodayUTC())
        if (unit === 'hour') {
          newStart.setUTCHours(val)
        } else {
          newStart.setUTCMinutes(val)
        }
        setRangeStart(newStart)

        if (rangeEnd) {
          setInputValue(`${formatDate(newStart, showTime)} - ${formatDate(rangeEnd, showTime)}`)
          onChange([formatISO(newStart, showTime), formatISO(rangeEnd, showTime)])
        }
      } else {
        const newEnd = new Date(rangeEnd || getTodayUTC())
        if (unit === 'hour') {
          newEnd.setUTCHours(val)
        } else {
          newEnd.setUTCMinutes(val)
        }
        setRangeEnd(newEnd)

        if (unit === 'minute' && rangeStart) {
          finalize(rangeStart, newEnd)
        } else if (rangeStart) {
          setInputValue(`${formatDate(rangeStart, showTime)} - ${formatDate(newEnd, showTime)}`)
          // NUEVO: Emitir evento al seleccionar la hora
          onChange([formatISO(rangeStart, showTime), formatISO(newEnd, showTime)])
        }
      }
    } else {
      const newDate = new Date(selectedDate || getTodayUTC())
      if (unit === 'hour') {
        newDate.setUTCHours(val)
      } else {
        newDate.setUTCMinutes(val)
      }
      setSelectedDate(newDate)

      if (unit === 'minute') {
        finalize(newDate)
      } else {
        setInputValue(formatDate(newDate, showTime))
        onChange(formatISO(newDate, showTime))
      }
    }
  }

  useEffect(() => {
    const updatePosition = () => {
      if (!open || !containerRef.current) return

      const inputRect = containerRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth

      const calendarEl = document.getElementById(`calendar-portal-${id}`)

      const calendarWidth =
        calendarEl?.getBoundingClientRect().width ||
        (range ? (showTime ? 860 : 640) : (showTime ? 430 : 320))

      let left = inputRect.left + window.scrollX
      const top = inputRect.bottom + window.scrollY + 8

      if (left + calendarWidth > viewportWidth) {
        left = viewportWidth - calendarWidth - 16
      }

      if (left < 16) {
        left = 16
      }

      setPosition({ top, left })
    }

    if (open) {
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
    }

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, range, showTime])

  const sizes = {
    small: { fs: 'rui:text-[16px] rui:lg:text-xs', p: 'rui:px-3 rui:py-2', is: 'rui:w-3 rui:h-3', h: 'rui:h-[32px]' },
    medium: { fs: 'rui:text-[16px] rui:lg:text-sm', p: 'rui:px-3 rui:py-2', is: 'rui:w-4 rui:h-4', h: 'rui:h-[36px]' },
    large: { fs: 'rui:text-[16px] rui:lg:text-base', p: 'rui:px-3 rui:py-2', is: 'rui:w-5 rui:h-5', h: 'rui:h-[40px]' }
  }
  const currentSize = sizes[size] || sizes.medium

  return (
    <div ref={containerRef} className={clsx('rui:relative rui:w-full', className)}>
      {label && (
        <label id={`${id}-label`} htmlFor={id} className='rui:block rui:text-sm rui:font-medium rui:text-gray-900 rui:mb-2'>
          {label}
        </label>
      )}
      <div
        id={id}
        tabIndex={disabled ? -1 : 0}
        role='button'
        aria-haspopup='dialog'
        aria-expanded={open}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? errorId : undefined}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={(e) => {
          if (disabled) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((p) => !p)
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        className={clsx(
          'rui:flex rui:items-center rui:w-full rui:border rui:rounded-lg rui:transition-colors rui:outline-none',
          'rui:focus-visible:ring-2 rui:focus-visible:ring-offset-1',
          styles.focusRing,
          currentSize.h,
          currentSize.p,
          {
            [`${styles.mainText.replace('rui:text', 'rui:border')} rui:ring-1 ${styles.mainText.replace('rui:text', 'rui:ring')}`]: open && !errorMessage,
            'rui:bg-white rui:border-gray-300': !errorMessage && !open && !disabled,
            'rui:opacity-50 rui:cursor-not-allowed rui:bg-gray-100': disabled
          },
          errorMessage && 'rui:border-(--error-bg)!'
        )}
      >
        <CalendarIcon className={`rui:mr-2 rui:shrink-0 rui:text-gray-400 ${currentSize.is}`} />
        <input
          readOnly
          tabIndex={-1}
          placeholder={placeholder}
          value={inputValue}
          autoComplete='off'
          inputMode='none'
          className={clsx(
            `rui:w-full rui:bg-transparent rui:outline-none ${currentSize.fs} rui:text-gray-800 rui:placeholder:text-gray-400`,
            'rui:pr-2',
            disabled ? 'rui:pointer-events-none' : 'rui:cursor-pointer'
          )}
        />
        {inputValue && !disabled && (
          <button
            type='button'
            aria-label='Limpiar fecha'
            onClick={(e) => {
              e.stopPropagation()
              setInputValue('')
              setSelectedDate(null)
              setRangeStart(null)
              setRangeEnd(null)
              onChange('')
            }}
            className={clsx(
              'rui:ml-auto rui:p-1 rui:rounded-md rui:transition-[background-color,transform] rui:duration-200 rui:group/clear',
              'rui:hover:bg-gray-100 rui:active:scale-95 rui:cursor-pointer rui:outline-none rui:focus-visible:ring-2',
              styles.focusRing,
              'rui:text-gray-400 rui:hover:text-gray-600'
            )}
          >
            <X className={clsx(
              currentSize.is,
              'rui:transition-transform rui:duration-200 rui:group-hover/clear:rotate-90'
            )}
            />
          </button>
        )}
      </div>
      <p id={errorId} className={clsx('rui:absolute rui:text-xs rui:mt-1 rui:h-4 rui:text-(--error-text)')}>
        {errorMessage}
      </p>
      {open && createPortal(
        <div
          id={`calendar-portal-${id}`}
          style={{ position: 'absolute', top: position.top, left: position.left, zIndex: 9999 }}
        >
          <CalendarPopup
            range={range}
            showTime={showTime}
            open={open}
            activeVariant={activeVariant}
            state={{ selectedDate, rangeStart, rangeEnd, hoveredDate, disabledDates: parsedDisabled }}
            handlers={{ onDateSelect: handleDateSelect, onHover: setHoveredDate, onTimeSelect: handleTimeSelect }}
          />
        </div>,
        document.body
      )}
    </div>
  )
})

DatePicker.displayName = 'DatePicker'
export default DatePicker
