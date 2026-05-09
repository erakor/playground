import { T } from '../tokens'

export default function TitleBar({ children, style }) {
  return (
    <div style={{
      background: T.titleBarGreen,
      color: T.textWhite,
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: 3,
      padding: '0 12px',
      height: 28,
      display: 'flex',
      alignItems: 'center',
      borderRadius: '0 0 0 0',
      borderBottom: `1px solid ${T.rivetColor}`,
      ...style,
    }}>
      {children}
    </div>
  )
}
