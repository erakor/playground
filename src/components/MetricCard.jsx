import { T } from '../tokens'
import PanelFrame from './PanelFrame'
import TitleBar from './TitleBar'
import TrendLine from './TrendLine'
import IndicatorLight from './IndicatorLight'

function statusColor(status) {
  if (status === 'alert')  return T.indicatorRed
  if (status === 'warn')   return T.accentOrange
  return T.indicatorGreen
}

export default function MetricCard({
  label = '',
  value,
  unit = '',
  delta = 0,
  trend = [],
  trendColor,
  status = 'normal',
  style,
  children,
}) {
  const dPos    = delta > 0
  const dZero   = delta === 0
  const dColor  = dZero ? T.textLight : dPos ? T.indicatorGreen : T.indicatorRed
  const dSymbol = dZero ? '—' : dPos ? `▲ +${delta}` : `▼ ${delta}`
  const color   = trendColor || T.accentYellow

  return (
    <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', ...style }}>
      <TitleBar>
        <span style={{ flex: 1 }}>{label}</span>
        <IndicatorLight color={status === 'alert' ? 'red' : status === 'warn' ? 'yellow' : 'green'} size={8} />
      </TitleBar>

      <div style={{ padding: '10px 14px 6px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 700,
            fontSize: 28,
            color: color,
            textShadow: `0 0 12px ${color}66`,
            lineHeight: 1,
          }}>
            {value ?? '--'}
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: T.textLight,
            opacity: 0.7,
          }}>
            {unit}
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            color: dColor,
            marginLeft: 'auto',
          }}>
            {dSymbol}
          </span>
        </div>

        {children}

        {trend.length > 1 && (
          <div style={{ marginTop: 6 }}>
            <TrendLine
              data={trend}
              width={200}
              height={40}
              color={color}
              showGrid={false}
              showArea
              pad={4}
            />
          </div>
        )}
      </div>
    </PanelFrame>
  )
}
