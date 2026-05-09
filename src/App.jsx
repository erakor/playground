import { useState } from 'react'
import { T } from './tokens'
import { patient, series } from './data'

import PanelFrame      from './components/PanelFrame'
import TitleBar        from './components/TitleBar'
import IndicatorLight  from './components/IndicatorLight'
import TimeRangeTab    from './components/TimeRangeTab'
import MetricCard      from './components/MetricCard'
import TrendLine       from './components/TrendLine'
import OscilloscopeChart from './components/OscilloscopeChart'
import BarChart        from './components/BarChart'
import RingGauge       from './components/RingGauge'
import AnalogGauge     from './components/AnalogGauge'

function getRange(s, range) {
  const avail = Object.keys(s.data)
  const r = avail.includes(range) ? range : avail[avail.length - 1]
  return {
    data:   s.data[r]   || [],
    labels: s.labels[r] || [],
    delta:  s.delta[r]  ?? 0,
    range:  r,
  }
}

function statusFor(s, range) {
  const { data } = getRange(s, range)
  if (!data.length || !s.normal) return 'normal'
  const last = data[data.length - 1]
  if (last < s.normal[0] || last > s.normal[1]) return 'alert'
  const margin = (s.normal[1] - s.normal[0]) * 0.1
  if (last < s.normal[0] + margin || last > s.normal[1] - margin) return 'warn'
  return 'normal'
}

function TrendPanel({ s, range, height = 100 }) {
  const { data, labels, delta } = getRange(s, range)
  const st = statusFor(s, range)
  return (
    <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, minWidth: 0 }}>
      <TitleBar>
        <span style={{ flex: 1 }}>{s.label}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: s.color, marginRight: 8 }}>
          {s.current} {s.unit}
        </span>
        <IndicatorLight color={st === 'alert' ? 'red' : st === 'warn' ? 'yellow' : 'green'} size={8} />
      </TitleBar>
      <div style={{ padding: 8, flex: 1 }}>
        <TrendLine data={data} labels={labels} width={400} height={height} color={s.color} showGrid showArea showLabels />
        <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: T.textLight, opacity: 0.5 }}>
            {labels[0]} – {labels[labels.length - 1]}
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
            color: delta === 0 ? T.textLight : delta > 0 ? T.indicatorGreen : T.indicatorRed
          }}>
            {delta === 0 ? '—' : delta > 0 ? `▲ +${delta}` : `▼ ${delta}`} {s.unit}
          </span>
        </div>
      </div>
    </PanelFrame>
  )
}

export default function App() {
  const [range, setRange] = useState('24H')

  const rangeAvail = (s) => Object.keys(s.data)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>

      {/* ── HEADER ── */}
      <PanelFrame style={{ overflow: 'hidden' }}>
        <TitleBar style={{ height: 36, fontSize: 13 }}>
          POWER STATION / VITALS MONITOR
        </TitleBar>
        <div style={{
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          <IndicatorLight color="green" size={12} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 12, color: T.accentYellow, letterSpacing: 1 }}>
            {patient.id}
          </span>
          <span style={{ color: T.panelBgLighter }}>·</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 12, color: T.textWhite, letterSpacing: 2 }}>
            {patient.name}
          </span>
          <span style={{ color: T.panelBgLighter }}>·</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: T.textLight, opacity: 0.7 }}>
            AGE {patient.age}  ·  {patient.height}  ·  DOB {patient.dob}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, color: T.textLight, opacity: 0.6, letterSpacing: 2 }}>
              TIME RANGE
            </span>
            <TimeRangeTab value={range} onChange={setRange} />
          </div>
        </div>
      </PanelFrame>

      {/* ── ROW 1: Heart Rate oscilloscope + top 5 metric cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1fr', gap: 10 }}>

        {/* Heart Rate Oscilloscope */}
        <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TitleBar>
            HEART RATE
            <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, opacity: 0.7 }}>
              LIVE MONITOR
            </span>
          </TitleBar>
          <div style={{ padding: 8, flex: 1 }}>
            <OscilloscopeChart initialData={series.heartRate.data['24H']} height={108} />
          </div>
        </PanelFrame>

        {/* Blood Pressure */}
        <MetricCard
          label="BLOOD PRESSURE"
          value={`${series.systolic.current}/${series.diastolic.current}`}
          unit="mmHg"
          delta={getRange(series.systolic, range).delta}
          trend={getRange(series.systolic, range).data}
          trendColor={series.systolic.color}
          status={statusFor(series.systolic, range)}
        />

        {/* SpO2 */}
        <MetricCard
          label="SpO₂"
          value={series.spo2.current}
          unit="%"
          delta={getRange(series.spo2, range).delta}
          trend={getRange(series.spo2, range).data}
          trendColor={series.spo2.color}
          status={statusFor(series.spo2, range)}
        />

        {/* Temperature */}
        <MetricCard
          label="TEMPERATURE"
          value={series.tempF.current}
          unit="°F"
          delta={getRange(series.tempF, range).delta}
          trend={getRange(series.tempF, range).data}
          trendColor={series.tempF.color}
          status={statusFor(series.tempF, range)}
        />

        {/* Weight */}
        <MetricCard
          label="WEIGHT"
          value={series.weight.current}
          unit="lbs"
          delta={getRange(series.weight, range).delta}
          trend={getRange(series.weight, range).data}
          trendColor={series.weight.color}
          status={statusFor(series.weight, range)}
        />
      </div>

      {/* ── ROW 2: Trend Charts ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <TrendPanel s={series.systolic}  range={range} height={90} />
        <TrendPanel s={series.spo2}      range={range} height={90} />
        <TrendPanel s={series.tempF}     range={range} height={90} />
      </div>

      {/* ── ROW 3: Body Metrics ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>

        {/* BMI */}
        {(() => {
          const r = getRange(series.bmi, range)
          return (
            <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <TitleBar>BMI</TitleBar>
              <div style={{ padding: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                <RingGauge value={series.bmi.current} min={15} max={35}
                  color={series.bmi.color} unit="" label="BMI" size={90} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <TrendLine data={r.data} width={160} height={60} color={series.bmi.color} showGrid showArea />
                  <div style={{ marginTop: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: T.textLight, opacity: 0.5 }}>
                    NORMAL: 18.5 – 24.9
                  </div>
                </div>
              </div>
            </PanelFrame>
          )
        })()}

        {/* Body Fat */}
        {(() => {
          const r = getRange(series.bodyFat, range)
          return (
            <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <TitleBar>BODY FAT</TitleBar>
              <div style={{ padding: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                <RingGauge value={series.bodyFat.current} min={5} max={35}
                  color={series.bodyFat.color} unit="%" label="FAT" size={90} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <TrendLine data={r.data} width={160} height={60} color={series.bodyFat.color} showGrid showArea />
                  <div style={{ marginTop: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: T.textLight, opacity: 0.5 }}>
                    HEALTHY: 8 – 20%
                  </div>
                </div>
              </div>
            </PanelFrame>
          )
        })()}

        {/* Resting HR */}
        <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TitleBar>RESTING HR</TitleBar>
          <div style={{ padding: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <AnalogGauge
              value={series.restingHR.current}
              min={40} max={100}
              unit="BPM"
              label="RESTING"
              size={90}
              zones={[
                { from: 40, to: 60, color: T.indicatorBlue },
                { from: 60, to: 80, color: T.indicatorGreen },
                { from: 80, to: 100, color: T.indicatorRed },
              ]}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <TrendLine data={getRange(series.restingHR, range).data}
                width={160} height={60} color={series.restingHR.color} showGrid showArea />
            </div>
          </div>
        </PanelFrame>

        {/* VO2 Max */}
        <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TitleBar>VO₂ MAX</TitleBar>
          <div style={{ padding: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <RingGauge value={series.vo2max.current} min={20} max={65}
              color={series.vo2max.color} unit="ml/kg" label="VO₂" size={90} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <TrendLine data={getRange(series.vo2max, range).data}
                width={160} height={60} color={series.vo2max.color} showGrid showArea />
              <div style={{ marginTop: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: T.textLight, opacity: 0.5 }}>
                EXCELLENT: &gt;40
              </div>
            </div>
          </div>
        </PanelFrame>
      </div>

      {/* ── ROW 4: Weight + SpO2 Gauge ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 10 }}>

        {/* Weight trend bar chart */}
        <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TitleBar>
            WEIGHT HISTORY
            <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: series.weight.color, opacity: 0.8 }}>
              {series.weight.current} lbs
            </span>
          </TitleBar>
          <div style={{ padding: 8, flex: 1 }}>
            <BarChart
              data={getRange(series.weight, range).data}
              labels={getRange(series.weight, range).labels}
              width={500} height={100}
              color={T.accentOrangeLight}
              altColor={T.accentOrange}
            />
          </div>
        </PanelFrame>

        {/* SpO2 Gauge + trend */}
        <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TitleBar>SpO₂</TitleBar>
          <div style={{ padding: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
            <AnalogGauge
              value={series.spo2.current}
              min={90} max={100}
              unit="%"
              label="SpO2"
              size={100}
              zones={[
                { from: 90, to: 95, color: T.indicatorRed },
                { from: 95, to: 97, color: T.accentOrange },
                { from: 97, to: 100, color: T.indicatorGreen },
              ]}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <TrendLine data={getRange(series.spo2, range).data}
                width={200} height={70} color={series.spo2.color} showGrid showArea showLabels />
            </div>
          </div>
        </PanelFrame>
      </div>

      {/* ── ROW 5: Activity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>

        {/* Steps */}
        <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TitleBar>
            DAILY STEPS
            <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: series.steps.color, opacity: 0.8 }}>
              {series.steps.current.toLocaleString()} steps
            </span>
          </TitleBar>
          <div style={{ padding: 8 }}>
            <BarChart
              data={getRange(series.steps, range).data}
              labels={getRange(series.steps, range).labels}
              width={300} height={90}
              color={T.indicatorGreen}
              altColor={T.accentBlue}
            />
            <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                flex: 1, height: 6, background: T.panelInsetBg,
                borderRadius: 3, overflow: 'hidden',
                border: `1px solid ${T.panelBgLighter}`
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (series.steps.current / 10000) * 100)}%`,
                  background: T.indicatorGreen,
                  borderRadius: 3,
                  boxShadow: `0 0 6px ${T.indicatorGreen}88`,
                }} />
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: T.textLight, opacity: 0.6, whiteSpace: 'nowrap' }}>
                {Math.round((series.steps.current / 10000) * 100)}% of 10k goal
              </span>
            </div>
          </div>
        </PanelFrame>

        {/* Sleep */}
        <PanelFrame style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TitleBar>
            SLEEP
            <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: series.sleep.color, opacity: 0.8 }}>
              {series.sleep.current} hrs
            </span>
          </TitleBar>
          <div style={{ padding: 8 }}>
            <BarChart
              data={getRange(series.sleep, range).data}
              labels={getRange(series.sleep, range).labels}
              width={300} height={90}
              color={T.accentBlue}
              altColor={T.accentPurple}
            />
            <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                flex: 1, height: 6, background: T.panelInsetBg,
                borderRadius: 3, overflow: 'hidden',
                border: `1px solid ${T.panelBgLighter}`
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (series.sleep.current / 9) * 100)}%`,
                  background: T.accentBlue,
                  borderRadius: 3,
                  boxShadow: `0 0 6px ${T.accentBlue}88`,
                }} />
              </div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: T.textLight, opacity: 0.6, whiteSpace: 'nowrap' }}>
                {Math.round((series.sleep.current / 9) * 100)}% of 9h goal
              </span>
            </div>
          </div>
        </PanelFrame>

        {/* HR Trend over selected range */}
        <TrendPanel s={series.heartRate} range={range} height={90} />
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 12px',
        background: T.panelInsetBg,
        border: `1px solid ${T.panelBgLighter}`,
        borderRadius: 2,
      }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: T.textLight, opacity: 0.4, letterSpacing: 2 }}>
          POWER STATION v1.0 · VITALS MONITOR
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: T.accentYellow, opacity: 0.5 }}>
          {patient.id} · {new Date().toLocaleString()}
        </span>
      </div>
    </div>
  )
}
