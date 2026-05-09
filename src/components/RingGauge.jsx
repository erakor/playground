import { T } from '../tokens'

function describeArc(cx, cy, r, startDeg, endDeg) {
  const toRad = d => (d - 90) * Math.PI / 180
  const start = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) }
  const end   = { x: cx + r * Math.cos(toRad(endDeg)),   y: cy + r * Math.sin(toRad(endDeg))   }
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
}

export default function RingGauge({
  value = 0,
  min = 0,
  max = 100,
  color = T.accentBlue,
  label = '',
  unit = '',
  size = 110,
}) {
  const cx = size / 2
  const cy = size / 2
  const r  = size * 0.36
  const strokeW = size * 0.09

  const startDeg = -120
  const totalDeg = 240
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)))
  const endDeg = startDeg + pct * totalDeg

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', flexShrink: 0 }}>
      <path
        d={describeArc(cx, cy, r, startDeg, startDeg + totalDeg)}
        fill="none"
        stroke={T.panelBgDarker}
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
      {pct > 0 && (
        <path
          d={describeArc(cx, cy, r, startDeg, endDeg)}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      )}
      <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
        fill={color} fontSize={size * 0.17} fontFamily="JetBrains Mono, monospace"
        fontWeight={700}>
        {typeof value === 'number' ? value : '--'}
      </text>
      {unit && (
        <text x={cx} y={cy + size * 0.17} textAnchor="middle"
          fill={T.textLight} fontSize={size * 0.08} fontFamily="JetBrains Mono, monospace"
          fillOpacity={0.7}>
          {unit}
        </text>
      )}
      <text x={cx} y={size - 4} textAnchor="middle"
        fill={T.textLight} fontSize={size * 0.075} fontFamily="Inter, sans-serif"
        fontWeight={700} letterSpacing={1} fillOpacity={0.6}>
        {label}
      </text>
    </svg>
  )
}
