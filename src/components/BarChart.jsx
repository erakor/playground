import { useState } from 'react'
import { T } from '../tokens'

const BAR_COLORS = [T.accentBlue, T.accentPurple, T.accentBlue, T.accentPurple]

export default function BarChart({
  data = [],
  labels = [],
  width = 300,
  height = 120,
  color,
  altColor,
  showAxis = true,
  pad = 10,
  axisHeight = 18,
}) {
  const [hovered, setHovered] = useState(null)
  if (!data.length) return null

  const max = Math.max(...data)
  const chartH = height - axisHeight - pad
  const barW = Math.max(4, Math.floor((width - pad * 2) / data.length) - 2)
  const gap  = Math.max(1, Math.floor((width - pad * 2) / data.length) - barW)

  const primaryColor   = color   || T.accentBlue
  const secondaryColor = altColor || T.accentPurple

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ display: 'block', background: T.panelInsetBg, borderRadius: 3 }}
    >
      {showAxis && (
        <line
          x1={pad} y1={height - axisHeight}
          x2={width - pad} y2={height - axisHeight}
          stroke={T.accentYellow}
          strokeWidth={2}
        />
      )}

      {data.map((v, i) => {
        const bh = Math.max(2, (v / max) * chartH)
        const x = pad + i * (barW + gap)
        const y = height - axisHeight - bh
        const c = (i % 2 === 0) ? primaryColor : secondaryColor
        const isHov = hovered === i
        const lbl = labels[i] || ''

        return (
          <g key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'default' }}
          >
            <rect
              x={x} y={y} width={barW} height={bh}
              fill={isHov ? T.accentYellow : c}
              rx={1}
              style={{ transition: 'fill 0.1s' }}
            />
            {labels.length > 0 && (
              <text
                x={x + barW / 2} y={height - 3}
                textAnchor="middle"
                fill={T.textLight}
                fontSize={6}
                fontFamily="JetBrains Mono, monospace"
                fillOpacity={0.6}
              >
                {lbl}
              </text>
            )}
            {isHov && (
              <text
                x={Math.min(x + barW / 2, width - 20)}
                y={Math.max(y - 3, 10)}
                textAnchor="middle"
                fill={T.accentYellow}
                fontSize={8}
                fontFamily="JetBrains Mono, monospace"
              >
                {v.toLocaleString()}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
