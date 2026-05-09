import { useEffect, useRef, useState } from 'react'
import { T } from '../tokens'
import TrendLine from './TrendLine'

export default function OscilloscopeChart({ initialData = [], current = 72, height = 120 }) {
  const [buffer, setBuffer] = useState(() => {
    const base = initialData.length ? [...initialData] : Array.from({ length: 24 }, (_, i) => 68 + Math.sin(i * 0.5) * 6)
    return base.slice(-60)
  })

  useEffect(() => {
    const id = setInterval(() => {
      setBuffer(prev => {
        const last = prev[prev.length - 1]
        const next = Math.min(105, Math.max(55, last + (Math.random() - 0.5) * 6))
        return [...prev.slice(-59), Math.round(next)]
      })
    }, 1500)
    return () => clearInterval(id)
  }, [])

  const live = buffer[buffer.length - 1]

  return (
    <div style={{ position: 'relative' }}>
      <TrendLine
        data={buffer}
        width={600}
        height={height}
        color={T.screenYellow}
        showGrid
        showArea
        pad={10}
      />
      <div style={{
        position: 'absolute',
        top: 6,
        right: 10,
        fontFamily: 'JetBrains Mono, monospace',
        fontWeight: 700,
        fontSize: 22,
        color: T.screenYellow,
        textShadow: `0 0 8px ${T.screenYellow}`,
        lineHeight: 1,
      }}>
        {live}<span style={{ fontSize: 10, marginLeft: 3, opacity: 0.8 }}>BPM</span>
      </div>
      <div style={{
        position: 'absolute',
        top: 8,
        left: 10,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 8,
        color: T.screenYellow,
        opacity: 0.7,
        letterSpacing: 2,
      }}>
        LIVE ●
      </div>
    </div>
  )
}
