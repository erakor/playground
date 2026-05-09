import { T } from '../tokens'

const rivet = (top, left) => ({
  position: 'absolute',
  width: 8, height: 8,
  borderRadius: '50%',
  background: T.rivetColor,
  top, left,
  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1)',
})

export default function PanelFrame({ children, style, className }) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        background: T.panelBg,
        border: `5px solid ${T.panelBorderYellow}`,
        borderRadius: 4,
        ...style,
      }}
    >
      <div style={rivet(6, 6)} />
      <div style={rivet(6, 'calc(100% - 14px)')} />
      <div style={rivet('calc(100% - 14px)', 6)} />
      <div style={rivet('calc(100% - 14px)', 'calc(100% - 14px)')} />
      {children}
    </div>
  )
}
