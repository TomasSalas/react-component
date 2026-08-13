import React, { forwardRef, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { useId } from '../hooks/useId'

export const CHART_COLORS = [
  '#2a78d6', // blue
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948', // red
  '#e87ba4', // magenta
  '#eb6834' // orange
]

const GRID_COLOR = '#e5e7eb'
const AXIS_TEXT_COLOR = '#6b7280'
const INK_COLOR = '#111827'

function formatValue (value, formatter) {
  if (formatter) return formatter(value)
  return typeof value === 'number' ? value.toLocaleString() : String(value)
}

function getNiceTicks (maxValue, tickCount = 4) {
  if (!Number.isFinite(maxValue) || maxValue <= 0) return [0, 1]
  const rawStep = maxValue / tickCount
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const residual = rawStep / magnitude
  let niceResidual = 1
  if (residual > 5) niceResidual = 10
  else if (residual > 2) niceResidual = 5
  else if (residual > 1) niceResidual = 2
  const step = niceResidual * magnitude
  const niceMax = Math.ceil(maxValue / step) * step
  const ticks = []
  for (let v = 0; v <= niceMax + step / 2; v += step) ticks.push(Math.round((v + Number.EPSILON) * 1000) / 1000)
  return ticks
}

function polarToCartesian (cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath (cx, cy, outerR, innerR, startAngle, endAngle) {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  const p0 = polarToCartesian(cx, cy, outerR, startAngle)
  const p1 = polarToCartesian(cx, cy, outerR, endAngle)
  if (innerR <= 0.01) {
    return [
      `M ${cx} ${cy}`,
      `L ${p0.x} ${p0.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p1.x} ${p1.y}`,
      'Z'
    ].join(' ')
  }
  const p2 = polarToCartesian(cx, cy, innerR, endAngle)
  const p3 = polarToCartesian(cx, cy, innerR, startAngle)
  return [
    `M ${p0.x} ${p0.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p3.x} ${p3.y}`,
    'Z'
  ].join(' ')
}

function topRoundedRectPath (x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h))
  if (radius <= 0.01) return `M ${x} ${y} h ${w} v ${h} h ${-w} Z`
  return [
    `M ${x} ${y + h}`,
    `L ${x} ${y + radius}`,
    `Q ${x} ${y} ${x + radius} ${y}`,
    `L ${x + w - radius} ${y}`,
    `Q ${x + w} ${y} ${x + w} ${y + radius}`,
    `L ${x + w} ${y + h}`,
    'Z'
  ].join(' ')
}

function getReadableTextColor (hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16) / 255
  const g = parseInt(c.substring(2, 4), 16) / 255
  const b = parseInt(c.substring(4, 6), 16) / 255
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  const contrastWithWhite = 1.05 / (luminance + 0.05)
  const contrastWithBlack = (luminance + 0.05) / 0.05
  return contrastWithBlack > contrastWithWhite ? '#0b0b0b' : '#ffffff'
}

function resolveSeries (data, series) {
  if (series && series.length > 0) return series
  const firstRow = data[0] || {}
  return Object.keys(firstRow)
    .filter((key) => key !== 'label')
    .map((key) => ({ key, name: key }))
}

const ChartLegend = ({ items }) => {
  if (!items || items.length < 2) return null
  return (
    <ul className='rui:flex rui:flex-wrap rui:items-center rui:justify-center rui:gap-x-4 rui:gap-y-2 rui:list-none rui:p-0 rui:mt-3 rui:mb-0'>
      {items.map((item) => (
        <li key={item.key} className='rui:flex rui:items-center rui:gap-1.5 rui:text-xs rui:text-gray-600'>
          {item.shape === 'line'
            ? (
              <span className='rui:inline-block rui:w-3 rui:h-0.5 rui:rounded-full rui:shrink-0' style={{ backgroundColor: item.color }} />
              )
            : (
              <span className='rui:inline-block rui:w-2.5 rui:h-2.5 rui:rounded-sm rui:shrink-0' style={{ backgroundColor: item.color }} />
              )}
          {item.name}
        </li>
      ))}
    </ul>
  )
}

const ChartTooltip = ({ tooltip }) => {
  if (!tooltip) return null
  return (
    <div
      role='status'
      className='rui:absolute rui:z-20 rui:pointer-events-none rui:bg-gray-900 rui:text-white rui:text-xs rui:rounded-md rui:shadow-lg rui:px-3 rui:py-2 rui:min-w-[120px]'
      style={{
        left: tooltip.x,
        top: tooltip.y,
        transform: `translate(${tooltip.align === 'right' ? '-100%' : '0%'}, -50%)`
      }}
    >
      {tooltip.title && <p className='rui:font-semibold rui:mb-1 rui:whitespace-nowrap'>{tooltip.title}</p>}
      <div className='rui:space-y-0.5'>
        {tooltip.rows.map((row) => (
          <div key={row.key} className='rui:flex rui:items-center rui:gap-2 rui:justify-between'>
            <span className='rui:flex rui:items-center rui:gap-1.5 rui:text-gray-300 rui:whitespace-nowrap'>
              <span className='rui:inline-block rui:w-2 rui:h-2 rui:rounded-full rui:shrink-0' style={{ backgroundColor: row.color }} />
              {row.name}
            </span>
            <span className='rui:font-semibold rui:whitespace-nowrap'>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ChartDataTable = ({ id, caption, headers, rows }) => (
  <table id={id} className='rui:sr-only'>
    <caption>{caption}</caption>
    <thead>
      <tr>{headers.map((h) => <th key={h} scope='col'>{h}</th>)}</tr>
    </thead>
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
      ))}
    </tbody>
  </table>
)

const BAR_VIEW_W = 640
const BAR_VIEW_H = 320
const BAR_PAD = { top: 16, right: 16, bottom: 32, left: 44 }

const BarChartBody = ({ data, series, colors, valueFormatter, showGrid, onHover, hoveredIndex }) => {
  const plotW = BAR_VIEW_W - BAR_PAD.left - BAR_PAD.right
  const plotH = BAR_VIEW_H - BAR_PAD.top - BAR_PAD.bottom

  const maxValue = Math.max(0, ...data.flatMap((row) => series.map((s) => Number(row[s.key]) || 0)))
  const ticks = getNiceTicks(maxValue, 4)
  const tickMax = ticks[ticks.length - 1] || 1
  const yScale = (v) => BAR_PAD.top + plotH - (v / tickMax) * plotH

  const bandWidth = plotW / Math.max(data.length, 1)
  const groupGap = 2
  const groupWidth = Math.min(bandWidth * 0.7, series.length * 26)
  const barWidth = Math.min(24, (groupWidth - groupGap * (series.length - 1)) / series.length)
  const actualGroupWidth = barWidth * series.length + groupGap * (series.length - 1)

  const decimate = data.length > 8 ? Math.ceil(data.length / 8) : 1

  return (
    <>
      {showGrid && ticks.map((t) => (
        <g key={t}>
          <line x1={BAR_PAD.left} x2={BAR_VIEW_W - BAR_PAD.right} y1={yScale(t)} y2={yScale(t)} stroke={GRID_COLOR} strokeWidth={1} />
          <text x={BAR_PAD.left - 8} y={yScale(t)} textAnchor='end' dominantBaseline='middle' fontSize={10} fill={AXIS_TEXT_COLOR}>
            {formatValue(t, valueFormatter)}
          </text>
        </g>
      ))}
      <line x1={BAR_PAD.left} x2={BAR_VIEW_W - BAR_PAD.right} y1={yScale(0)} y2={yScale(0)} stroke={AXIS_TEXT_COLOR} strokeWidth={1} />

      {data.map((row, i) => {
        const groupX = BAR_PAD.left + i * bandWidth + (bandWidth - actualGroupWidth) / 2
        const isHovered = hoveredIndex === i
        return (
          <g
            key={row.label ?? i}
            onMouseEnter={() => onHover(i, groupX + actualGroupWidth / 2, BAR_PAD.top)}
            onMouseLeave={() => onHover(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect x={BAR_PAD.left + i * bandWidth} y={BAR_PAD.top} width={bandWidth} height={plotH} fill='transparent' />
            {series.map((s, j) => {
              const value = Number(row[s.key]) || 0
              const barH = yScale(0) - yScale(value)
              const x = groupX + j * (barWidth + groupGap)
              const y = yScale(value)
              const color = colors[j % colors.length]
              const showLabel = barH > 20 && series.length <= 3
              return (
                <g key={s.key}>
                  <path
                    d={topRoundedRectPath(x, y, barWidth, Math.max(barH, 0), 4)}
                    fill={color}
                    opacity={isHovered ? 1 : 0.92}
                    tabIndex={0}
                    role='img'
                    aria-label={`${row.label}, ${s.name}: ${formatValue(value, valueFormatter)}`}
                    onFocus={() => onHover(i, groupX + actualGroupWidth / 2, BAR_PAD.top)}
                    onBlur={() => onHover(null)}
                    style={{ outline: 'none', transition: 'opacity 150ms ease' }}
                  />
                  {showLabel && (
                    <text x={x + barWidth / 2} y={y - 6} textAnchor='middle' fontSize={10} fontWeight={600} fill={INK_COLOR}>
                      {formatValue(value, valueFormatter)}
                    </text>
                  )}
                </g>
              )
            })}
            {(decimate === 1 || i % decimate === 0) && (
              <text
                x={BAR_PAD.left + i * bandWidth + bandWidth / 2}
                y={BAR_VIEW_H - BAR_PAD.bottom + 16}
                textAnchor='middle'
                fontSize={11}
                fill={AXIS_TEXT_COLOR}
              >
                {row.label}
              </text>
            )}
          </g>
        )
      })}
    </>
  )
}

const LINE_VIEW_W = 640
const LINE_VIEW_H = 320
const LINE_PAD = { top: 16, right: 20, bottom: 32, left: 44 }

const LineChartBody = ({ data, series, colors, valueFormatter, showGrid, onHover, hoveredIndex, svgRef }) => {
  const plotW = LINE_VIEW_W - LINE_PAD.left - LINE_PAD.right
  const plotH = LINE_VIEW_H - LINE_PAD.top - LINE_PAD.bottom

  const maxValue = Math.max(0, ...data.flatMap((row) => series.map((s) => Number(row[s.key]) || 0)))
  const ticks = getNiceTicks(maxValue, 4)
  const tickMax = ticks[ticks.length - 1] || 1
  const yScale = (v) => LINE_PAD.top + plotH - (v / tickMax) * plotH
  const xScale = (i) => LINE_PAD.left + (data.length > 1 ? (i * plotW) / (data.length - 1) : plotW / 2)

  const decimate = data.length > 8 ? Math.ceil(data.length / 8) : 1

  const handleMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = LINE_VIEW_W / rect.width
    const localX = (e.clientX - rect.left) * scaleX
    let nearest = 0
    let nearestDist = Infinity
    data.forEach((_, i) => {
      const d = Math.abs(xScale(i) - localX)
      if (d < nearestDist) { nearestDist = d; nearest = i }
    })
    onHover(nearest, xScale(nearest), LINE_PAD.top)
  }

  return (
    <>
      {showGrid && ticks.map((t) => (
        <g key={t}>
          <line x1={LINE_PAD.left} x2={LINE_VIEW_W - LINE_PAD.right} y1={yScale(t)} y2={yScale(t)} stroke={GRID_COLOR} strokeWidth={1} />
          <text x={LINE_PAD.left - 8} y={yScale(t)} textAnchor='end' dominantBaseline='middle' fontSize={10} fill={AXIS_TEXT_COLOR}>
            {formatValue(t, valueFormatter)}
          </text>
        </g>
      ))}
      <line x1={LINE_PAD.left} x2={LINE_VIEW_W - LINE_PAD.right} y1={yScale(0)} y2={yScale(0)} stroke={AXIS_TEXT_COLOR} strokeWidth={1} />

      <rect
        x={LINE_PAD.left} y={LINE_PAD.top} width={plotW} height={plotH} fill='transparent'
        onMouseMove={handleMove}
        onMouseLeave={() => onHover(null)}
      />

      {hoveredIndex !== null && (
        <line x1={xScale(hoveredIndex)} x2={xScale(hoveredIndex)} y1={LINE_PAD.top} y2={LINE_PAD.top + plotH} stroke={AXIS_TEXT_COLOR} strokeWidth={1} strokeDasharray='3 3' pointerEvents='none' />
      )}

      {series.map((s, j) => {
        const color = colors[j % colors.length]
        const points = data.map((row, i) => `${xScale(i)},${yScale(Number(row[s.key]) || 0)}`).join(' ')
        return (
          <g key={s.key}>
            <polyline points={points} fill='none' stroke={color} strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' pointerEvents='none' />
            {data.map((row, i) => {
              const value = Number(row[s.key]) || 0
              const isHovered = hoveredIndex === i
              return (
                <circle
                  key={i}
                  cx={xScale(i)}
                  cy={yScale(value)}
                  r={isHovered ? 5 : 4}
                  fill={color}
                  stroke='#ffffff'
                  strokeWidth={2}
                  tabIndex={0}
                  role='img'
                  aria-label={`${row.label}, ${s.name}: ${formatValue(value, valueFormatter)}`}
                  onFocus={() => onHover(i, xScale(i), LINE_PAD.top)}
                  onBlur={() => onHover(null)}
                  style={{ outline: 'none', transition: 'r 150ms ease' }}
                />
              )
            })}
          </g>
        )
      })}

      {data.map((row, i) => (
        (decimate === 1 || i % decimate === 0) && (
          <text key={i} x={xScale(i)} y={LINE_VIEW_H - LINE_PAD.bottom + 16} textAnchor='middle' fontSize={11} fill={AXIS_TEXT_COLOR}>
            {row.label}
          </text>
        )
      ))}
    </>
  )
}

const PIE_SIZE = 260

const PieChartBody = ({ data, colors, valueFormatter, isDonut, onHover, hoveredIndex }) => {
  const cx = PIE_SIZE / 2
  const cy = PIE_SIZE / 2
  const outerR = PIE_SIZE / 2 - 12
  const innerR = isDonut ? outerR * 0.62 : 0
  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0)

  let cursor = 0
  const slices = data.map((d, i) => {
    const value = Number(d.value) || 0
    const fraction = total > 0 ? value / total : 0
    const startAngle = cursor * 360
    cursor += fraction
    const endAngle = cursor * 360
    return { ...d, value, fraction, startAngle, endAngle, color: d.color || colors[i % colors.length] }
  })

  return (
    <>
      {slices.map((slice, i) => {
        const mid = (slice.startAngle + slice.endAngle) / 2
        const isHovered = hoveredIndex === i
        const lift = isHovered ? 6 : 0
        const liftVector = polarToCartesian(0, 0, lift, mid)
        const showInlineLabel = slice.fraction >= 0.08
        const labelPos = polarToCartesian(cx, cy, (outerR + innerR) / 2, mid)
        return (
          <g
            key={slice.label ?? i}
            transform={`translate(${liftVector.x}, ${liftVector.y})`}
            style={{ transition: 'transform 150ms ease' }}
          >
            <path
              d={arcPath(cx, cy, outerR, innerR, slice.startAngle, slice.endAngle)}
              fill={slice.color}
              stroke='#ffffff'
              strokeWidth={2}
              tabIndex={0}
              role='img'
              aria-label={`${slice.label}: ${formatValue(slice.value, valueFormatter)} (${Math.round(slice.fraction * 100)}%)`}
              onMouseEnter={() => onHover(i, cx, cy)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(i, cx, cy)}
              onBlur={() => onHover(null)}
              style={{ outline: 'none', cursor: 'pointer' }}
            />
            {showInlineLabel && (
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor='middle'
                dominantBaseline='middle'
                fontSize={11}
                fontWeight={600}
                fill={getReadableTextColor(slice.color)}
                pointerEvents='none'
              >
                {Math.round(slice.fraction * 100)}%
              </text>
            )}
          </g>
        )
      })}
    </>
  )
}

const Chart = forwardRef((props, ref) => {
  const {
    type = 'bar',
    data = [],
    series,
    colors = CHART_COLORS,
    height = 320,
    showLegend,
    showGrid = true,
    valueFormatter,
    title,
    className = '',
    ...rest
  } = props

  const id = useId()
  const svgRef = useRef(null)
  const wrapperRef = useRef(null)
  const [hovered, setHovered] = useState(null)

  const setWrapperRef = (node) => {
    wrapperRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

  const resolvedSeries = useMemo(() => (type === 'pie' || type === 'donut' ? [] : resolveSeries(data, series)), [type, data, series])

  const handleHover = (index, viewX, viewY) => {
    if (index === null) { setHovered(null); return }

    const isCircularType = type === 'pie' || type === 'donut'
    const viewW = isCircularType ? PIE_SIZE : BAR_VIEW_W
    const viewH = isCircularType ? PIE_SIZE : BAR_VIEW_H

    let pixelX = viewX
    let pixelY = viewY
    if (svgRef.current && wrapperRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect()
      const wrapperRect = wrapperRef.current.getBoundingClientRect()
      pixelX = svgRect.left - wrapperRect.left + (viewX / viewW) * svgRect.width
      pixelY = svgRect.top - wrapperRect.top + (viewY / viewH) * svgRect.height
    }

    setHovered({ index, x: viewX, y: viewY, pixelX, pixelY })
  }

  if (!data || data.length === 0) {
    return (
      <div ref={setWrapperRef} className={clsx('rui:flex rui:items-center rui:justify-center rui:text-sm rui:text-gray-400 rui:border rui:border-dashed rui:border-gray-200 rui:rounded-lg', className)} style={{ height }}>
        Sin datos para graficar
      </div>
    )
  }

  const isCircular = type === 'pie' || type === 'donut'
  const legendItems = isCircular
    ? data.map((d, i) => ({ key: d.label ?? i, name: d.label, color: d.color || colors[i % colors.length], shape: 'square' }))
    : resolvedSeries.map((s, i) => ({ key: s.key, name: s.name, color: colors[i % colors.length], shape: type === 'line' ? 'line' : 'square' }))

  const shouldShowLegend = showLegend ?? (isCircular ? data.length >= 2 : resolvedSeries.length >= 2)

  let tooltip = null
  if (hovered) {
    if (isCircular) {
      const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
      const d = data[hovered.index]
      const value = Number(d.value) || 0
      const color = d.color || colors[hovered.index % colors.length]
      tooltip = {
        x: hovered.pixelX,
        y: hovered.pixelY,
        align: 'left',
        title: d.label,
        rows: [{ key: 'value', name: 'Valor', color, value: `${formatValue(value, valueFormatter)} (${total > 0 ? Math.round((value / total) * 100) : 0}%)` }]
      }
    } else {
      const row = data[hovered.index]
      tooltip = {
        x: hovered.pixelX,
        y: hovered.pixelY,
        align: hovered.x > BAR_VIEW_W * 0.7 ? 'right' : 'left',
        title: row.label,
        rows: resolvedSeries.map((s, j) => ({
          key: s.key,
          name: s.name,
          color: colors[j % colors.length],
          value: formatValue(Number(row[s.key]) || 0, valueFormatter)
        }))
      }
    }
  }

  const tableHeaders = isCircular ? ['Categoría', 'Valor'] : ['Categoría', ...resolvedSeries.map((s) => s.name)]
  const tableRows = isCircular
    ? data.map((d) => [d.label, formatValue(Number(d.value) || 0, valueFormatter)])
    : data.map((row) => [row.label, ...resolvedSeries.map((s) => formatValue(Number(row[s.key]) || 0, valueFormatter))])

  return (
    <div ref={setWrapperRef} className={clsx('rui:relative rui:w-full', className)} {...rest}>
      {title && <p className='rui:text-sm rui:font-semibold rui:text-gray-900 rui:mb-2'>{title}</p>}

      {isCircular
        ? (
          <div className='rui:flex rui:justify-center' style={{ maxHeight: height }}>
            <svg ref={svgRef} viewBox={`0 0 ${PIE_SIZE} ${PIE_SIZE}`} role='group' aria-label={title || 'Gráfico circular'} style={{ width: '100%', maxWidth: height, height: 'auto' }}>
              <PieChartBody
                data={data}
                colors={colors}
                valueFormatter={valueFormatter}
                isDonut={type === 'donut'}
                onHover={handleHover}
                hoveredIndex={hovered?.index ?? null}
              />
            </svg>
          </div>
          )
        : (
          <div style={{ width: '100%', aspectRatio: `${BAR_VIEW_W} / ${BAR_VIEW_H}`, maxHeight: height }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${BAR_VIEW_W} ${BAR_VIEW_H}`}
              role='group'
              aria-label={title || 'Gráfico'}
              style={{ width: '100%', height: '100%' }}
            >
              {type === 'line'
                ? (
                  <LineChartBody
                    data={data}
                    series={resolvedSeries}
                    colors={colors}
                    valueFormatter={valueFormatter}
                    showGrid={showGrid}
                    onHover={handleHover}
                    hoveredIndex={hovered?.index ?? null}
                    svgRef={svgRef}
                  />
                  )
                : (
                  <BarChartBody
                    data={data}
                    series={resolvedSeries}
                    colors={colors}
                    valueFormatter={valueFormatter}
                    showGrid={showGrid}
                    onHover={handleHover}
                    hoveredIndex={hovered?.index ?? null}
                  />
                  )}
            </svg>
          </div>
          )}

      <ChartTooltip tooltip={tooltip} />
      {shouldShowLegend && <ChartLegend items={legendItems} />}
      <ChartDataTable id={id} caption={title || 'Datos del gráfico'} headers={tableHeaders} rows={tableRows} />
    </div>
  )
})

Chart.displayName = 'Chart'

export default Chart
