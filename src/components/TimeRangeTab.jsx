import { T } from '../tokens'

const RANGES = ['24H', '7D', '30D']

export default function TimeRangeTab({ value, onChange, available }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {RANGES.map(r => {
        const enabled = !available || available.includes(r)
        const active = value === r
        return (
          <button
            key={r}
            onClick={() => enabled && onChange(r)}
            disabled={!enabled}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: 2,
              padding: '4px 10px',
              border: `2px solid ${active ? T.panelBorderYellow : T.panelBgLighter}`,
              borderRadius: 2,
              cursor: enabled ? 'pointer' : 'not-allowed',
              background: active ? T.panelBorderYellow : T.panelInsetBg,
              color: active ? T.textDark : enabled ? T.textLight : T.panelBgLighter,
              transition: 'all 0.15s',
            }}
          >
            {r}
          </button>
        )
      })}
    </div>
  )
}
