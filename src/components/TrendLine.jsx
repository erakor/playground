import { T } from '../tokens'

function toPoints(data, w, h, pad = 8) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const iw = w - pad * 2
  const ih = h - pad * 2
  return data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * iw
    const y = pad + (1 - (v - min) / range) * ih
    return `${x},${y}`
  }).join(' ')
}

function toAreaPoints(data, w, h, pad = 8) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const iw = w - pad * 2
  const ih = h - pad * 2
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * iw
    const y = pad + (1 - (v - min) / range) * ih
    return `${x},${y}`
  })
  const firstX = pad
  const lastX  = pad + iw
  const bottom = h - pad
  return `${firstX},${bottom} ` + pts.join(' ') + ` ${lastX},${bottom}`
}

export default function TrendLine({
  data = [],
  labels = [],
  width = 300,
  height = 80,
  color = T.screenYellow,
  showGrid = true,
  showArea = true,
  showLabels = false,
  pad = 8,
}) {
  if (!data.length) return null

  const gridRows = 3
  const gridCols = 4
  const filteredLabels = labels.filter((_, i) =>
    Math.round(i % Math.max(1, Math.floor(labels.length / 5))) === 0
  )

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ display: 'block', background: T.screenGraphBg, borderRadius: 3 }}
    >
      <defs>
        <filter id={`glow-${color.replace('#','')}`}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {showGrid && Array.from({ length: gridRows }).map((_, i) => {
        const y = pad + (i / gridRows) * (height - pad * 2)
        return <line key={`hr${i}`} x1={pad} y1={y} x2={width - pad} y2={y}
          stroke={T.screenYellow} strokeOpacity={0.18} strokeWidth={1} />
      })}
      {showGrid && Array.from({ length: gridCols }).map((_, i) => {
        const x = pad + (i / gridCols) * (width - pad * 2)
        return <line key={`vr${i}`} x1={x} y1={pad} x2={x} y2={height - pad}
          stroke={T.screenYellow} strokeOpacity={0.18} strokeWidth={1} />
      })}

      {showArea && (
        <polygon
          points={toAreaPoints(data, width, height, pad)}
          fill={color}
          fillOpacity={0.12}
        />
      )}

      <polyline
        points={toPoints(data, width, height, pad)}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={`url(#glow-${color.replace('#','')})`}
      />

      {showLabels && filteredLabels.map((lbl, i) => {
        const idx = labels.indexOf(lbl)
        const x = pad + (idx / (labels.length - 1)) * (width - pad * 2)
        return (
          <text key={i} x={x} y={height - 1} textAnchor="middle"
            fill={T.textLight} fontSize={7} fontFamily="JetBrains Mono, monospace"
            fillOpacity={0.7}>
            {lbl}
          </text>
        )
      })}
    </svg>
  )
}
