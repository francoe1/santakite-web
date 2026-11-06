const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/gfs'

const num = (value) => (Number.isFinite(value) ? value : null)

const buildSample = (entry) => {
  const dirDeg = num(entry.dirDeg) ?? 0
  const speedKts = num(entry.speedKts)
  return {
    time: entry.time ?? null,
    speedKts,
    dirDeg,
    // La flecha apunta hacia donde VA el viento (dirDeg es de donde VIENE).
    dirDegVisual: (dirDeg + 180) % 360,
    gustKts: num(entry.gustKts) ?? speedKts,
    precipMm: num(entry.precipMm) ?? 0,
    tempC: num(entry.tempC),
  }
}

const buildUrl = ({ latitude, longitude }) => {
  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone: 'auto',
    forecast_days: '8', // hoy + 7 días por delante
    windspeed_unit: 'kn',
    current: 'winddirection_10m,windspeed_10m,windgusts_10m,temperature_2m,precipitation',
    hourly: 'winddirection_10m,windspeed_10m,windgusts_10m,precipitation,temperature_2m',
  })
  return `${OPEN_METEO_BASE}?${params.toString()}`
}

/**
 * Una sola llamada por spot: viento actual + pronóstico horario agrupado por día.
 * @returns {{ current: object|null, days: {date:string, hours:object[]}[], fetchedAt:number }}
 */
export const getSpotWeather = async ({ latitude, longitude }, { signal } = {}) => {
  if (latitude == null || longitude == null) throw new Error('Coordenadas incompletas')

  const response = await fetch(buildUrl({ latitude, longitude }), { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const data = await response.json()

  const c = data.current
  const current = c
    ? buildSample({
        time: c.time,
        speedKts: c.windspeed_10m,
        dirDeg: c.winddirection_10m,
        gustKts: c.windgusts_10m,
        tempC: c.temperature_2m,
        precipMm: c.precipitation,
      })
    : null

  const h = data.hourly || {}
  const times = h.time || []
  const grouped = {}
  times.forEach((time, i) => {
    const sample = buildSample({
      time,
      speedKts: h.windspeed_10m?.[i],
      dirDeg: h.winddirection_10m?.[i],
      gustKts: h.windgusts_10m?.[i],
      precipMm: h.precipitation?.[i],
      tempC: h.temperature_2m?.[i],
    })
    if (sample.speedKts == null) return
    const date = time.split('T')[0]
    ;(grouped[date] ||= []).push(sample)
  })

  const days = Object.keys(grouped)
    .sort()
    .map((date) => ({ date, hours: grouped[date] }))

  return { current, days, fetchedAt: Date.now() }
}

export default { getSpotWeather }
