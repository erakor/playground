import { T } from '../tokens'

const COLORS = {
  green:  T.indicatorGreen,
  red:    T.indicatorRed,
  blue:   T.indicatorBlue,
  yellow: T.accentYellow,
}

export default function IndicatorLight({ color = 'green', on = true, size = 10, style }) {
  const c = COLORS[color] || color
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: on ? c : T.panelBgDarker,
      boxShadow: on ? `0 0 6px 2px ${c}88` : 'none',
      border: `1px solid ${T.rivetColor}`,
      flexShrink: 0,
      ...style,
    }} />
  )
}
