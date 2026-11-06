import { buildPreferredDirectionSet, degToCompass, isDirectionPreferred } from './wind'

export const DEFAULT_SPOT_CONFIG = {
  preferredDirections: ['S', 'SE', 'E'],
  directionReference: 'N',
  minPlayableKts: 12,
  maxPrecipMm: 3,
  summerWindow: { startHour: 7, endHour: 20 },
  winterWindow: { startHour: 9, endHour: 18 },
}

/** Mezcla la config por defecto con la del spot (spots.json -> forecast). */
export const getSpotConfig = (spot) => {
  const cfg = { ...DEFAULT_SPOT_CONFIG, ...(spot?.forecast || {}) }
  if (!cfg.preferredDirections?.length) cfg.preferredDirections = DEFAULT_SPOT_CONFIG.preferredDirections
  cfg.summerWindow = { ...DEFAULT_SPOT_CONFIG.summerWindow, ...(spot?.forecast?.summerWindow || {}) }
  cfg.winterWindow = { ...DEFAULT_SPOT_CONFIG.winterWindow, ...(spot?.forecast?.winterWindow || {}) }
  cfg.preferredSet = buildPreferredDirectionSet(cfg.preferredDirections)
  return cfg
}

/** Hora local (0-23) del spot a partir de "2025-01-30T14:00". */
export const hourOf = (time) => Number.parseInt(String(time).slice(11, 13), 10)
export const dateOf = (time) => String(time).slice(0, 10)
const monthOf = (time) => Number.parseInt(String(time).slice(5, 7), 10)

export const hasSunLight = (hour, cfg) => {
  const month = monthOf(hour.time)
  const win = month >= 11 || month <= 2 ? cfg.summerWindow : cfg.winterWindow
  const h = hourOf(hour.time)
  return h >= win.startHour && h <= win.endHour
}

/**
 * Evalúa una muestra horaria. Devuelve nivel 0-4:
 * 0 no navegable · 1 justo · 2 bueno · 3 muy bueno · 4 ideal
 */
export const assessHour = (hour, cfg) => {
  const speed = hour.speedKts
  const gust = hour.gustKts ?? speed
  const dirOk = isDirectionPreferred(hour.dirDeg, cfg.preferredSet, cfg.directionReference)
  const sun = hasSunLight(hour, cfg)
  const rainOk = (hour.precipMm ?? 0) <= cfg.maxPrecipMm
  const speedOk = Number.isFinite(speed) && speed >= cfg.minPlayableKts
  const playable = dirOk && sun && rainOk && speedOk

  let level = 0
  if (playable) {
    const over = speed - cfg.minPlayableKts
    level = over >= 9 ? 4 : over >= 6 ? 3 : over >= 3 ? 2 : 1
    if (gust - speed >= 10 && level > 1) level -= 1 // ráfagas muy marcadas
  }
  return { dirOk, sun, rainOk, speedOk, playable, level }
}

const LEVEL_LABELS = ['Sin ventana', 'Justo', 'Bueno', 'Muy bueno', 'Ideal']
export const levelLabel = (level) => LEVEL_LABELS[level] ?? LEVEL_LABELS[0]

const mostCommonCompass = (hours) => {
  const counts = {}
  hours.forEach((h) => {
    if (!Number.isFinite(h.dirDeg)) return
    const key = degToCompass(h.dirDeg)
    counts[key] = (counts[key] || 0) + 1
  })
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  return top ? top[0] : null
}

const longestRun = (hours) => {
  let best = null
  let cur = null
  hours.forEach((h) => {
    if (h.assess.playable) {
      if (cur && h.hourNum === cur.end + 1) cur.end = h.hourNum
      else cur = { start: h.hourNum, end: h.hourNum }
      if (!best || cur.end - cur.start > best.end - best.start) best = { ...cur }
    } else {
      cur = null
    }
  })
  return best
}

const pad = (n) => String(n).padStart(2, '0')

export const DAY_RATINGS = {
  good: { key: 'good', label: 'Día de viento', short: 'Excelente' },
  ok: { key: 'ok', label: 'Buena ventana', short: 'Bueno' },
  marginal: { key: 'marginal', label: 'Ventana corta', short: 'Marginal' },
  bad: { key: 'bad', label: 'Sin ventana', short: 'Sin viento' },
}

export const summarizeDay = (day, cfg) => {
  const hours = day.hours.map((h) => ({
    ...h,
    hourNum: hourOf(h.time),
    assess: assessHour(h, cfg),
  }))
  const daylight = hours.filter((h) => h.assess.sun)
  const base = daylight.length ? daylight : hours
  const speeds = base.map((h) => h.speedKts).filter(Number.isFinite)
  const gusts = base.map((h) => h.gustKts).filter(Number.isFinite)
  const temps = base.map((h) => h.tempC).filter(Number.isFinite)

  const playable = hours.filter((h) => h.assess.playable)
  const run = longestRun(hours)
  const best = [...playable].sort((a, b) => b.assess.level - a.assess.level || b.speedKts - a.speedKts)[0] ?? null
  const strongest = [...base].sort((a, b) => (b.speedKts ?? 0) - (a.speedKts ?? 0))[0] ?? null

  const count = playable.length
  const rating = count >= 5 ? 'good' : count >= 3 ? 'ok' : count >= 1 ? 'marginal' : 'bad'

  return {
    date: day.date,
    hours,
    avgKts: speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0,
    maxKts: speeds.length ? Math.max(...speeds) : 0,
    maxGustKts: gusts.length ? Math.max(...gusts) : 0,
    minTemp: temps.length ? Math.min(...temps) : null,
    maxTemp: temps.length ? Math.max(...temps) : null,
    totalRain: hours.reduce((sum, h) => sum + (h.precipMm || 0), 0),
    mainDir: mostCommonCompass(base),
    playableCount: count,
    window: run ? { start: run.start, end: run.end + 1, label: `${pad(run.start)}:00 – ${pad(run.end + 1)}:00`, hours: run.end - run.start + 1 } : null,
    best,
    strongest,
    rating,
    ratingInfo: DAY_RATINGS[rating],
    score: count * 10 + (best?.assess.level ?? 0),
  }
}

export const assessCurrent = (current, cfg) => {
  if (!current || !Number.isFinite(current.speedKts)) {
    return { tone: 'muted', label: 'Midiendo viento…', detail: '', playable: false }
  }
  const dirOk = isDirectionPreferred(current.dirDeg, cfg.preferredSet, cfg.directionReference)
  const speed = current.speedKts
  if (dirOk && speed >= cfg.minPlayableKts) {
    return { tone: 'ok', label: 'Navegable ahora', detail: 'Dirección y fuerza dentro del rango del spot.', playable: true }
  }
  if (dirOk && speed >= cfg.minPlayableKts - 3) {
    return { tone: 'warn', label: 'Casi navegable', detail: `Faltan ~${Math.max(1, Math.ceil(cfg.minPlayableKts - speed))} kts para el mínimo del spot.`, playable: false }
  }
  if (speed >= cfg.minPlayableKts) {
    return { tone: 'warn', label: 'Viento cruzado', detail: 'Hay fuerza pero la dirección no es la ideal para este spot.', playable: false }
  }
  return { tone: 'muted', label: 'Sin viento útil', detail: 'Viento flojo o fuera de la dirección del spot.', playable: false }
}

/** Procesa lo que devuelve la API para un spot. */
export const buildForecast = (spot, raw) => {
  const cfg = getSpotConfig(spot)
  const days = (raw?.days || []).map((d) => summarizeDay(d, cfg))
  const current = raw?.current ?? null
  return { cfg, days, current, assessment: assessCurrent(current, cfg), today: days[0] ?? null }
}

export const formatKts = (n, digits = 0) => (Number.isFinite(n) ? n.toFixed(digits) : '–')

const parseLocalDate = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const formatDay = (dateStr, opts = { weekday: 'short', day: 'numeric', month: 'short' }) =>
  parseLocalDate(dateStr).toLocaleDateString('es-AR', opts)

export const weekdayShort = (dateStr) =>
  parseLocalDate(dateStr).toLocaleDateString('es-AR', { weekday: 'short' }).replace('.', '')

export const dayNumber = (dateStr) => parseLocalDate(dateStr).getDate()
export const monthShort = (dateStr) =>
  parseLocalDate(dateStr).toLocaleDateString('es-AR', { month: 'short' }).replace('.', '')
