import { getDirectionOffset, normalizeDegrees } from '../utils/wind'

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/gfs'

const toNumberOrNull = (value) => (Number.isFinite(value) ? value : null)

const normalizeDirection = (deg, directionReference) => {
  if (deg == null) return null
  const offset = getDirectionOffset(directionReference)
  return Math.round(normalizeDegrees(deg - offset))
}

const buildWindSample = (entry, directionReference) => {
  const label = entry.label
    ? entry.label
    : entry.time
      ? new Date(entry.time).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
      : ''

  return {
    time: entry.time ?? null,
    label,
    speedKts: toNumberOrNull(entry.speedKts),
    dirDeg:
      toNumberOrNull(entry.dirDeg) != null
        ? normalizeDirection(entry.dirDeg, directionReference)
        : null,
    gustKts: toNumberOrNull(entry.gustKts ?? entry.speedKts),
    precipMm: toNumberOrNull(entry.precipMm) ?? 0,
    tempC: toNumberOrNull(entry.tempC),
  }
}

const buildHourlySamples = (hourly, directionReference) => {
  const {
    time = [],
    windspeed_10m = [],
    winddirection_10m = [],
    windgusts_10m = [],
    precipitation = [],
    temperature_2m = [],
  } = hourly || {}

  return time.map((timestamp, idx) =>
    buildWindSample(
      {
        time: timestamp,
        speedKts: windspeed_10m[idx],
        dirDeg: winddirection_10m[idx],
        gustKts: windgusts_10m[idx] ?? windspeed_10m[idx],
        precipMm: precipitation[idx] ?? 0,
        tempC: temperature_2m[idx],
      },
      directionReference
    )
  )
}

const buildUrl = (coordinates, { includeHourly = false } = {}) => {
  const params = new URLSearchParams({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    timezone: 'auto',
    windspeed_unit: 'kn',
    current: 'winddirection_10m,windspeed_10m',
  })

  if (includeHourly) {
    params.set(
      'hourly',
      'winddirection_10m,windspeed_10m,windgusts_10m,precipitation,temperature_2m'
    )
  }

  return `${OPEN_METEO_BASE}?${params.toString()}`
}

const fetchWeather = async (coordinates, options = {}) => {
  if (!coordinates || coordinates.latitude == null || coordinates.longitude == null) {
    throw new Error('Coordenadas incompletas')
  }

  const url = buildUrl(coordinates, options)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

export const getCurrentWind = async ({ latitude, longitude, directionReference = 'N' }) => {
  const data = await fetchWeather({ latitude, longitude }, { includeHourly: false })
  const current = data.current || {}

  return buildWindSample(
    {
      time: current.time ?? null,
      label: 'Ahora',
      speedKts: current.windspeed_10m,
      dirDeg: current.winddirection_10m,
      gustKts: current.windgusts_10m ?? current.windspeed_10m,
      tempC: current.temperature_2m,
      precipMm: current.precipitation,
    },
    directionReference
  )
}

export const getWeekWind = async ({ latitude, longitude, directionReference = 'N' }) => {
  const data = await fetchWeather({ latitude, longitude }, { includeHourly: true })
  const samples = buildHourlySamples(data.hourly, directionReference)

  const grouped = samples.reduce((acc, sample) => {
    const dateKey = sample.time?.split('T')[0]
    if (!dateKey) return acc
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(sample)
    return acc
  }, {})

  return Object.keys(grouped)
    .sort()
    .map((date) => ({ date, hours: grouped[date] }))
}

export const getDayWind = async (
  { latitude, longitude, directionReference = 'N' },
  targetDate
) => {
  const days = await getWeekWind({ latitude, longitude, directionReference })
  if (!targetDate) return days[0]?.hours ?? []
  const found = days.find((day) => day.date === targetDate)
  return found ? found.hours : []
}

export const weatherService = {
  getCurrentWind,
  getDayWind,
  getWeekWind,
}

export default weatherService
