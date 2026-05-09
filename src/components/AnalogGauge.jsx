import { T } from '../tokens'

export default function AnalogGauge({
  value = 0,
  min = 0,
  max = 100,
  unit = '',
  label = '',
  size = 120,
  zones,
}) {
  const cx = size / 2
  const cy = size / 2
  const outerR  = size * 0.46
  const faceR   = size * 0.37
  const startDeg = -135
  const totalDeg = 270
  const pct  = Math.min(1, Math.max(0, (value - min) / (max - min)))
  const needleDeg = startDeg + pct * totalDeg

  const toRad = d => (d - 90) * Math.PI / 180

  const ticks = Array.from({ length: 9 }, (_, i) => {
    const deg = startDeg + (i / 8) * totalDeg
    const rad = toRad(deg)
    const inner  = outerR * 0.8
    const outer2 = outerR * 0.95
    return {
      x1: cx + inner * Math.cos(rad),
      y1: cy + inner * Math.sin(rad),
      x2: cx + outer2 * Math.cos(rad),
      y2: cy + outer2 * Math.sin(rad),
      major: i % 4 === 0,
    }
  })

  const needleRad = toRad(needleDeg)
  const nLen = faceR * 0.75
  const nx = cx + nLen * Math.cos(needleRad)
  const ny = cy + nLen * Math.sin(needleRad)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={outerR} fill={T.panelBgDarker} stroke={T.panelBgLighter} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={faceR}  fill={T.gaugeFace} />

      {zones && zones.map((z, i) => {
        const zStart = startDeg + ((z.from - min) / (max - min)) * totalDeg
        const zEnd   = startDeg + ((z.to   - min) / (max - min)) * totalDeg
        const zRad1 = toRad(zStart)
        const zRad2 = toRad(zEnd)
        const arcR = outerR * 0.88
        const large = zEnd - zStart > 180 ? 1 : 0
        const x1 = cx + arcR * Math.cos(zRad1)
        const y1 = cy + arcR * Math.sin(zRad1)
        const x2 = cx + arcR * Math.cos(zRad2)
        const y2 = cy + arcR * Math.sin(zRad2)
        return (
          <path key={i}
            d={`M ${x1} ${y1} A ${arcR} ${arcR} 0 ${large} 1 ${x2} ${y2}`}
            fill="none" stroke={z.color} strokeWidth={4} strokeLinecap="round"
          />
        )
      })}

      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={T.textDark} strokeWidth={t.major ? 2 : 1} strokeLinecap="round" />
      ))}

      <text x={cx} y={cy - faceR * 0.25} textAnchor="middle"
        fill={T.textDark} fontSize={size * 0.09} fontFamily="Inter, sans-serif"
        fontWeight={700} letterSpacing={1}>
        {unit}
      </text>

      <text x={cx} y={cy + faceR * 0.45} textAnchor="middle"
        fill={T.textDark} fontSize={size * 0.11} fontFamily="JetBrains Mono, monospace"
        fontWeight={700}>
        {value}
      </text>

      <line x1={cx} y1={cy} x2={nx} y2={ny}
        stroke={T.needleRed} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={size * 0.05}
        fill={T.rivetColor} stroke={T.panelBgLighter} strokeWidth={1} />

      <text x={cx} y={size - 4} textAnchor="middle"
        fill={T.textLight} fontSize={size * 0.07} fontFamily="Inter, sans-serif"
        fontWeight={700} letterSpacing={2} fillOpacity={0.5}>
        {label}
      </text>
    </svg>
  )
}
