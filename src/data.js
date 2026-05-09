function walk(start, count, stepSize, min, max, decimals = 0) {
  const out = [start]
  for (let i = 1; i < count; i++) {
    const prev = out[i - 1]
    const delta = (Math.random() - 0.5) * 2 * stepSize
    const next = Math.min(max, Math.max(min, prev + delta))
    out.push(decimals > 0 ? parseFloat(next.toFixed(decimals)) : Math.round(next))
  }
  return out
}

function hourLabels(n) {
  return Array.from({ length: n }, (_, i) => {
    const h = (new Date().getHours() - n + 1 + i + 24) % 24
    return `${h}:00`
  })
}
function dayLabels(n) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - n + 1 + i)
    return days[d.getDay()]
  })
}
function monthDayLabels(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - n + 1 + i)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })
}

export const patient = {
  name: 'ALEX MORGAN',
  age: 34,
  dob: '1991-03-14',
  id: 'PT-00472',
  gender: 'M',
  height: '5\'11"',
}

const hr24  = walk(72,  24, 4, 55, 105)
const hr7d  = walk(68,  7,  5, 55, 105)
const hr30d = walk(70,  30, 3, 55, 105)

const sys24  = walk(118, 24, 3, 100, 145)
const sys7d  = walk(116, 7,  4, 100, 145)
const sys30d = walk(120, 30, 3, 100, 145)

const dia24  = walk(76,  24, 2, 60, 95)
const dia7d  = walk(74,  7,  3, 60, 95)
const dia30d = walk(76,  30, 2, 60, 95)

const spo2_24  = walk(98,  24, 0.5, 94, 100, 1)
const spo2_7d  = walk(97,  7,  0.5, 94, 100, 1)
const spo2_30d = walk(98,  30, 0.4, 94, 100, 1)

const temp24  = walk(98.6, 24, 0.2, 97.5, 99.9, 1)
const temp7d  = walk(98.4, 7,  0.2, 97.5, 99.9, 1)
const temp30d = walk(98.5, 30, 0.15,97.5, 99.9, 1)

const wt24  = walk(178, 24, 0.3, 175, 181, 1)
const wt7d  = walk(179, 7,  0.5, 175, 183, 1)
const wt30d = walk(181, 30, 0.4, 175, 184, 1)

const bmi7d  = wt7d.map(w  => parseFloat((w / (71.0 * 71.0) * 703).toFixed(1)))
const bmi30d = wt30d.map(w => parseFloat((w / (71.0 * 71.0) * 703).toFixed(1)))

const fat7d  = walk(18.5, 7,  0.3, 16, 22, 1)
const fat30d = walk(19.2, 30, 0.2, 16, 22, 1)

const rhr7d  = walk(62,  7,  2, 52, 72)
const rhr30d = walk(64,  30, 1, 52, 72)

const vo2_30d = walk(42, 30, 0.3, 38, 48, 1)

const steps7d  = walk(8432, 7,  1200, 3000, 14000)
const steps30d = walk(7800, 30, 800,  3000, 14000)

const sleep7d  = walk(7.2, 7,  0.5, 5.0, 9.5, 1)
const sleep30d = walk(7.0, 30, 0.4, 5.0, 9.5, 1)

function delta(arr) {
  if (arr.length < 2) return 0
  return parseFloat((arr[arr.length - 1] - arr[arr.length - 2]).toFixed(1))
}

export const series = {
  heartRate: {
    label: 'HEART RATE', unit: 'BPM', current: hr24[hr24.length - 1],
    data: { '24H': hr24, '7D': hr7d, '30D': hr30d },
    labels: { '24H': hourLabels(24), '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '24H': delta(hr24), '7D': delta(hr7d), '30D': delta(hr30d) },
    normal: [60, 100], color: '#e8c43a',
  },
  systolic: {
    label: 'SYSTOLIC', unit: 'mmHg', current: sys24[sys24.length - 1],
    data: { '24H': sys24, '7D': sys7d, '30D': sys30d },
    labels: { '24H': hourLabels(24), '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '24H': delta(sys24), '7D': delta(sys7d), '30D': delta(sys30d) },
    normal: [90, 130], color: '#3d9fc6',
  },
  diastolic: {
    label: 'DIASTOLIC', unit: 'mmHg', current: dia24[dia24.length - 1],
    data: { '24H': dia24, '7D': dia7d, '30D': dia30d },
    labels: { '24H': hourLabels(24), '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '24H': delta(dia24), '7D': delta(dia7d), '30D': delta(dia30d) },
    normal: [60, 85], color: '#a875c9',
  },
  spo2: {
    label: 'SpO2', unit: '%', current: spo2_24[spo2_24.length - 1],
    data: { '24H': spo2_24, '7D': spo2_7d, '30D': spo2_30d },
    labels: { '24H': hourLabels(24), '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '24H': delta(spo2_24), '7D': delta(spo2_7d), '30D': delta(spo2_30d) },
    normal: [95, 100], color: '#4477c8',
  },
  tempF: {
    label: 'TEMPERATURE', unit: '°F', current: temp24[temp24.length - 1],
    data: { '24H': temp24, '7D': temp7d, '30D': temp30d },
    labels: { '24H': hourLabels(24), '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '24H': delta(temp24), '7D': delta(temp7d), '30D': delta(temp30d) },
    normal: [97.8, 99.1], color: '#e8892b',
  },
  weight: {
    label: 'WEIGHT', unit: 'lbs', current: wt24[wt24.length - 1],
    data: { '24H': wt24, '7D': wt7d, '30D': wt30d },
    labels: { '24H': hourLabels(24), '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '24H': delta(wt24), '7D': delta(wt7d), '30D': delta(wt30d) },
    normal: [160, 185], color: '#f4b14a',
  },
  bmi: {
    label: 'BMI', unit: '', current: bmi7d[bmi7d.length - 1],
    data: { '7D': bmi7d, '30D': bmi30d },
    labels: { '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '7D': delta(bmi7d), '30D': delta(bmi30d) },
    normal: [18.5, 24.9], color: '#4fb04f',
  },
  bodyFat: {
    label: 'BODY FAT', unit: '%', current: fat7d[fat7d.length - 1],
    data: { '7D': fat7d, '30D': fat30d },
    labels: { '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '7D': delta(fat7d), '30D': delta(fat30d) },
    normal: [8, 20], color: '#e8892b',
  },
  restingHR: {
    label: 'RESTING HR', unit: 'BPM', current: rhr7d[rhr7d.length - 1],
    data: { '7D': rhr7d, '30D': rhr30d },
    labels: { '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '7D': delta(rhr7d), '30D': delta(rhr30d) },
    normal: [50, 70], color: '#e8c43a',
  },
  vo2max: {
    label: 'VO₂ MAX', unit: 'ml/kg/min', current: vo2_30d[vo2_30d.length - 1],
    data: { '30D': vo2_30d },
    labels: { '30D': monthDayLabels(30) },
    delta: { '30D': delta(vo2_30d) },
    normal: [38, 55], color: '#a875c9',
  },
  steps: {
    label: 'STEPS', unit: 'steps', current: steps7d[steps7d.length - 1],
    data: { '7D': steps7d, '30D': steps30d },
    labels: { '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '7D': delta(steps7d), '30D': delta(steps30d) },
    normal: [7000, 12000], color: '#4fb04f',
  },
  sleep: {
    label: 'SLEEP', unit: 'hrs', current: sleep7d[sleep7d.length - 1],
    data: { '7D': sleep7d, '30D': sleep30d },
    labels: { '7D': dayLabels(7), '30D': monthDayLabels(30) },
    delta: { '7D': delta(sleep7d), '30D': delta(sleep30d) },
    normal: [7, 9], color: '#3d9fc6',
  },
}
