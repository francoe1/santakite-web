<template>
  <section id="pronostico" class="section">
    <div class="section-head">
      <p class="eyebrow">Pronóstico GFS</p>
      <div>
        <h2>¿Es navegable los próximos días?</h2>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <p class="muted">{{ forecastConfig.criteriaText }}</p>
        <span class="status" :class="statusClass">{{ statusText }}</span>
      </div>
      <div class="forecast-grid">
        <button
          v-for="day in forecast"
          :key="day.date"
          class="forecast-card"
          type="button"
          @click="openDetails(day)"
        >
          <div class="forecast-date">{{ formatDate(day.date) }}</div>
          <div class="muted small">Viento medio: <strong>{{ day.avgWindKts.toFixed(0) }}</strong> kts</div>
          <div class="muted small">Dirección principal: <strong>{{ degToCompass(day.mainDirDeg) }}</strong> ({{ day.mainDirDeg }}°)</div>
          <div class="muted small">Ventana jugable: <strong>{{ day.playableCount }}</strong> hs</div>
          <div class="muted small">Ráfaga máxima: <strong>{{ day.maxGustKts.toFixed(0) }}</strong> kts</div>
          <div class="muted small">Lluvia estimada: <strong>{{ day.totalRain.toFixed(1) }}</strong> mm</div>
          <div class="muted small">
            <span v-if="day.stars > 0" class="stars" :aria-label="`Mejor ventana ${day.stars} estrellas`" role="img">
              {{ '★'.repeat(day.stars) }}
            </span>
            <span v-else>Sin ventana marcada</span>
          </div>
          <div class="badge" :class="classifyDay(day).className">{{ classifyDay(day).label }}</div>
          <div class="muted tiny">
            Mejor hora:
            <template v-if="day.bestHour">
              <strong>{{ day.bestHour.label }}</strong>
              · {{ day.bestHour.speedKts.toFixed(0) }} kts · {{ degToCompass(day.bestHour.dirDeg) }} ({{ day.bestHour.dirDeg }}°)
              · ráfaga {{ day.bestHour.gustKts.toFixed(0) }} kts · lluvia {{ day.bestHour.precipMm.toFixed(1) }} mm
            </template>
            <template v-else>Sin datos</template>
          </div>
        </button>
      </div>
      <p v-if="!forecast.length && !statusError" class="muted small">Cargando datos…</p>
      <p v-if="statusError" class="muted small">{{ statusError }}</p>
    </div>
    <div v-if="selectedDay" class="overlay" @click.self="closeDetails">
      <div class="overlay-card">
        <div class="overlay-head">
          <div>
            <p class="eyebrow">Detalle por hora</p>
            <h3>{{ formatDate(selectedDay.date) }}</h3>
            <p class="muted small">
              {{ forecastConfig.detailText }}
            </p>
          </div>
          <button type="button" class="close" @click="closeDetails">✕</button>
        </div>

        <div v-if="!isCompactLayout" class="hourly-table" role="table">
          <div class="hour-row header" role="row">
            <div class="label-cell" role="columnheader">Hora</div>
            <div
              v-for="hour in selectedDay.hours"
              :key="`h-${hour.time}`"
              class="hour-cell time"
              :style="hourCellStyle(hour)"
              role="columnheader"
            >
              {{ hour.label }}
            </div>
          </div>

          <div class="hour-row" role="row">
            <div class="label-cell" role="rowheader">Viento (kts)</div>
            <div
              v-for="hour in selectedDay.hours"
              :key="`w-${hour.time}`"
              class="hour-cell value"
              :style="hourCellStyle(hour)"
              role="cell"
            >
              {{ hour.speedKts.toFixed(0) }}
            </div>
          </div>

          <div class="hour-row" role="row">
            <div class="label-cell" role="rowheader">Ráfagas (kts)</div>
            <div
              v-for="hour in selectedDay.hours"
              :key="`g-${hour.time}`"
              class="hour-cell value"
              :style="hourCellStyle(hour)"
              role="cell"
            >
              {{ hour.gustKts.toFixed(0) }}
            </div>
          </div>

          <div class="hour-row" role="row">
            <div class="label-cell" role="rowheader">Dirección</div>
            <div
              v-for="hour in selectedDay.hours"
              :key="`d-${hour.time}`"
              class="hour-cell direction"
              :style="hourCellStyle(hour)"
              role="cell"
            >
              <span class="arrow" :style="{ transform: `rotate(${(hour.dirDeg + 180) % 360}deg)` }">↑</span>
              <span class="dir-label">{{ degToCompass(hour.dirDeg) }} ({{ hour.dirDeg }}°)</span>
            </div>
          </div>

          <div class="hour-row" role="row">
            <div class="label-cell" role="rowheader">Temperatura (°C)</div>
            <div
              v-for="hour in selectedDay.hours"
              :key="`t-${hour.time}`"
              class="hour-cell value"
              :style="hourCellStyle(hour)"
              role="cell"
            >
              <span>{{ hour.tempC !== null ? hour.tempC.toFixed(0) : '-' }}</span>
            </div>
          </div>

          <div class="hour-row" role="row">
            <div class="label-cell" role="rowheader">Lluvia (mm)</div>
            <div
              v-for="hour in selectedDay.hours"
              :key="`r-${hour.time}`"
              class="hour-cell value"
              :style="hourCellStyle(hour)"
              role="cell"
            >
              {{ hour.precipMm.toFixed(1) }}
            </div>
          </div>
        </div>

        <div v-else class="hourly-list" role="list">
          <article
            v-for="hour in selectedDay.hours"
            :key="`card-${hour.time}`"
            class="hour-card"
            :style="hourCardStyle(hour)"
            role="listitem"
          >
            <header class="hour-card__head">
              <p class="label">{{ hour.label }}</p>
              <span class="badge" :class="isPlayable(hour) ? 'badge-ok' : 'badge-warn'">
                {{ isPlayable(hour) ? 'Jugable' : 'Fuera de ventana' }}
              </span>
            </header>
            <dl class="hour-card__grid">
              <div>
                <dt>Viento</dt>
                <dd>{{ hour.speedKts.toFixed(0) }} kts</dd>
              </div>
              <div>
                <dt>Ráfaga</dt>
                <dd>{{ hour.gustKts.toFixed(0) }} kts</dd>
              </div>
              <div class="direction">
                <dt>Dirección</dt>
                <dd>
                  <span class="arrow" :style="{ transform: `rotate(${(hour.dirDeg + 180) % 360}deg)` }">↑</span>
                  <span class="dir-label">{{ degToCompass(hour.dirDeg) }} ({{ hour.dirDeg }}°)</span>
                </dd>
              </div>
              <div>
                <dt>Temp</dt>
                <dd>{{ hour.tempC !== null ? `${hour.tempC.toFixed(0)} °C` : 'Sin dato' }}</dd>
              </div>
              <div>
                <dt>Lluvia</dt>
                <dd>{{ hour.precipMm.toFixed(1) }} mm</dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import {
  buildPreferredDirectionSet,
  degToCompass,
  getDirectionOffset,
  normalizeDegrees,
} from '../../utils/wind'

const props = defineProps({
  spot: {
    type: Object,
    required: true,
  },
})

const forecast = ref([])
const statusError = ref('')
const status = ref('loading')
const selectedDay = ref(null)
const isCompactLayout = ref(false)

const forecastConfig = computed(() => {
  const baseCoordinates = {
    latitude: props.spot.wind?.latitude ?? props.spot.coordinates?.lat ?? 0,
    longitude: props.spot.wind?.longitude ?? props.spot.coordinates?.lon ?? 0,
  }

  const baseConfig = {
    criteriaText:
      'Criterio: más de 12 nudos con dirección Sur, Sudeste o Este; lluvia limita la navegación.',
    detailText:
      'Viento > 12 nudos desde S, SE o E es navegable dentro de la ventana local. Verano: 7:00 a 20:00 · invierno: 9:00 a 17:30. La lluvia y la falta de luz reducen seguridad y visibilidad.',
    preferredDirections: ['S', 'SE', 'E'],
    directionReference: 'N',
    minPlayableKts: 12,
    maxPrecipMm: 3,
    summerWindow: { startHour: 7, endHour: 20 },
    winterWindow: { startHour: 9, endHour: 17, endMinute: 30 },
    speedScoreBase: 8,
    speedScoreCap: 14,
    coordinates: baseCoordinates,
  }

  const configFromSpot = props.spot.forecast || {}

  return {
    ...baseConfig,
    ...configFromSpot,
    preferredDirections: configFromSpot.preferredDirections || baseConfig.preferredDirections,
    directionReference: configFromSpot.directionReference || baseConfig.directionReference,
    summerWindow: { ...baseConfig.summerWindow, ...configFromSpot.summerWindow },
    winterWindow: { ...baseConfig.winterWindow, ...configFromSpot.winterWindow },
    coordinates: { ...baseCoordinates, ...(configFromSpot.coordinates || {}) },
  }
})

const preferredDirectionSet = computed(() => {
  const normalized = buildPreferredDirectionSet(forecastConfig.value.preferredDirections)
  if (normalized.size === 0) {
    return buildPreferredDirectionSet(['N', 'E', 'S', 'O'])
  }
  return normalized
})

const directionOffsetDeg = computed(() => getDirectionOffset(forecastConfig.value.directionReference))

const normalizeDirection = (deg) => normalizeDegrees(deg - directionOffsetDeg.value)

const statusText = computed(() => {
  if (status.value === 'ok') return 'Datos GFS cargados'
  if (status.value === 'error') return 'Error al cargar pronóstico'
  return 'Cargando datos GFS…'
})

const statusClass = computed(() => {
  if (status.value === 'ok') return 'status-ok'
  if (status.value === 'error') return 'status-error'
  return 'status-loading'
})

const forecastUrl = computed(() => {
  const { latitude, longitude } = forecastConfig.value.coordinates
  if (latitude == null || longitude == null) return ''

  return `https://api.open-meteo.com/v1/gfs?latitude=${latitude}&longitude=${longitude}&hourly=winddirection_10m,windspeed_10m,windgusts_10m,precipitation,temperature_2m&current=winddirection_10m,windspeed_10m&timezone=auto&windspeed_unit=kn`
})

const classifyDay = (day) => {
  const hasPlayable = day.playableCount > 0
  const soaked = day.totalRain >= 5
  if (!hasPlayable) return { label: 'No apto', className: 'badge-bad' }
  if (soaked) return { label: 'Dudoso por lluvia', className: 'badge-warn' }
  if (day.playableCount >= 6) return { label: 'Óptimo', className: 'badge-ok' }
  return { label: 'A revisar', className: 'badge-warn' }
}

const bestStarRating = (playableHours) => {
  if (playableHours >= 6) return 3
  if (playableHours >= 4) return 2
  if (playableHours >= 2) return 1
  return 0
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
}

const isPreferredDirection = (deg) =>
  preferredDirectionSet.value.size > 0 &&
  preferredDirectionSet.value.has(degToCompass(deg))

const evaluateLayout = () => {
  isCompactLayout.value = window.innerWidth <= 480
}

const isSummerDate = (dateStr) => {
  const month = new Date(dateStr).getMonth()
  return month >= 10 || month <= 2
}

const isWithinWindow = (dateTime) => {
  const date = new Date(dateTime)
  const hour = date.getHours()
  const minute = date.getMinutes()
  if (isSummerDate(dateTime)) {
    return hour >= forecastConfig.value.summerWindow.startHour && hour <= forecastConfig.value.summerWindow.endHour
  }
  if (hour < forecastConfig.value.winterWindow.startHour) return false
  if (hour < forecastConfig.value.winterWindow.endHour) return true
  if (hour === forecastConfig.value.winterWindow.endHour)
    return minute <= (forecastConfig.value.winterWindow.endMinute ?? 59)
  return false
}

const isPlayable = (hour) =>
  hour.speedKts >= forecastConfig.value.minPlayableKts &&
  isPreferredDirection(hour.dirDeg) &&
  hour.precipMm < forecastConfig.value.maxPrecipMm &&
  isWithinWindow(hour.time)

const openDetails = (day) => {
  selectedDay.value = day
}

const playabilityScore = (hour) => {
  const speedScore = Math.min(
    Math.max((hour.speedKts - forecastConfig.value.speedScoreBase) / forecastConfig.value.speedScoreCap, 0),
    1
  )
  const directionBoost = isPreferredDirection(hour.dirDeg) ? 0.3 : -0.25
  const rainPenalty = Math.min(hour.precipMm / 5, 0.35)
  const windowPenalty = isWithinWindow(hour.time) ? 0 : 0.4
  const raw = speedScore + directionBoost - rainPenalty - windowPenalty
  return Math.min(Math.max(raw, 0), 1)
}

const fetchForecast = async () => {
  if (!forecastUrl.value) return
  status.value = 'loading'
  statusError.value = ''
  forecast.value = []

  try {
    const response = await fetch(forecastUrl.value)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    const { time, windspeed_10m, winddirection_10m, windgusts_10m, precipitation, temperature_2m } = data.hourly
    const map = {}

    for (let i = 0; i < time.length; i += 1) {
      const date = time[i].split('T')[0]
      if (!map[date]) map[date] = { speeds: [], dirs: [], rains: [], hours: [] }
      const speedKts = windspeed_10m[i]
      const dirDeg = normalizeDirection(winddirection_10m[i])
      const rainMm = precipitation[i] ?? 0
      const gustKts = windgusts_10m[i] ?? windspeed_10m[i]
      const tempC = temperature_2m[i] ?? null

      map[date].speeds.push(speedKts)
      map[date].dirs.push(dirDeg)
      map[date].rains.push(rainMm)
      map[date].hours.push({
        time: time[i],
        label: new Date(time[i]).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        speedKts: speedKts,
        dirDeg: Math.round(dirDeg),
        precipMm: rainMm,
        gustKts: gustKts,
        tempC: tempC,
      })
    }

    const days = Object.keys(map).map((date) => {
      const speeds = map[date].speeds
      const dirs = map[date].dirs
      const rains = map[date].rains
      const hours = map[date].hours

      const playableHours = hours.filter((hour) => isPlayable(hour))
      const bestHour = hours.find((hour) => isPlayable(hour) && hour.gustKts === Math.max(...hours.map((h) => h.gustKts)))
      const mainDirDeg = Math.round(dirs.reduce((a, b) => a + b, 0) / dirs.length)

      return {
        date,
        avgWindKts: speeds.reduce((a, b) => a + b, 0) / speeds.length,
        mainDirDeg,
        playableCount: playableHours.length,
        maxGustKts: Math.max(...hours.map((h) => h.gustKts)),
        totalRain: rains.reduce((a, b) => a + b, 0),
        hours: hours,
        bestHour: bestHour || null,
        stars: bestStarRating(playableHours.length),
      }
    })

    forecast.value = days.slice(0, 7)
    status.value = 'ok'
  } catch (err) {
    console.error(err)
    statusError.value = 'No se pudo cargar el pronóstico en este entorno.'
    status.value = 'error'
  }
}

const hourCellStyle = (hour) => {
  const score = playabilityScore(hour)
  const hue = 8 + (128 - 8) * score
  const tone = `hsl(${hue}, 58%, 62%)`
  const wash = `hsla(${hue}, 58%, 62%, 0.14)`
  return {
    borderColor: tone,
    background: `linear-gradient(180deg, ${wash}, rgba(15, 23, 42, 0.9))`,
  }
}

const hourCardStyle = (hour) => {
  const tone = hourCellStyle(hour)
  return {
    borderColor: tone.borderColor,
    background: tone.background,
  }
}

const closeDetails = () => {
  selectedDay.value = null
}

watch(
  selectedDay,
  (val) => {
    document.body.style.overflow = val ? 'hidden' : ''
  },
  { immediate: false }
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('resize', evaluateLayout)
})

watch(forecastUrl, () => {
  fetchForecast()
})

onMounted(() => {
  evaluateLayout()
  window.addEventListener('resize', evaluateLayout)
  fetchForecast()
})
</script>

<style scoped>
.section {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: #e8f6ff;
  background: linear-gradient(120deg, rgba(3, 24, 41, 0.7), rgba(4, 29, 49, 0.85));

  padding: 1.2rem;
  border: 1px solid rgba(125, 242, 221, 0.12);

}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: #94a3b8;
}

h2 {
  font-size: clamp(1.6rem, 2.5vw, 2rem);
  margin-bottom: 0.35rem;
  color: #f1f5f9;
}

.muted {
  color: #cbd5e1;
}

.card {
  padding: 1.2rem;

  background: radial-gradient(circle at 15% 20%, rgba(94, 234, 212, 0.12), transparent 40%),
    linear-gradient(145deg, rgba(6, 27, 48, 0.75), rgba(7, 22, 40, 0.92));
  border: 1px solid rgba(56, 189, 248, 0.25);

  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #e5f3ff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.status {
  padding: 0.35rem 0.85rem;

  font-weight: 700;
  font-size: 0.85rem;
}

.status-loading {
  background: rgba(234, 179, 8, 0.18);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.35);
}

.status-ok {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.35);
}

.status-error {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.35);
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem;
}

.forecast-card {
  border: none;
  text-align: left;
  padding: 0.9rem;

  border: 1px solid rgba(125, 242, 221, 0.2);
  background: linear-gradient(160deg, rgba(5, 22, 43, 0.7), rgba(6, 28, 51, 0.9));
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  cursor: pointer;
  color: #e2e8f0;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.forecast-card:hover,
.forecast-card:focus-visible {
  border-color: rgba(125, 242, 221, 0.55);
  transform: translateY(-2px);

  outline: none;
}

.forecast-date {
  font-weight: 700;
}

.badge {
  align-self: flex-start;
  padding: 0.3rem 0.75rem;

  font-weight: 700;
  font-size: 0.85rem;
}

.badge-ok {
  background: rgba(94, 234, 212, 0.2);
  color: #5eead4;
  border: 1px solid rgba(94, 234, 212, 0.35);
}

.badge-warn {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
  border: 1px solid rgba(234, 179, 8, 0.35);
}

.badge-bad {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.small {
  font-size: 0.9rem;
}

.tiny {
  font-size: 0.8rem;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1200;
  overflow-y: auto;
}

.overlay-card {
  background: #0b1222;
  border: 1px solid rgba(148, 163, 184, 0.25);

  padding: 1.25rem;
  width: min(1040px, 100%);
  max-height: 90vh;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #e5f3ff;
}

.overlay-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}

.close {
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;

  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  cursor: pointer;
}


.hourly-table {
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-x: auto;
  border: 1px solid rgba(148, 163, 184, 0.2);

  position: relative;
}

.hour-row {
  display: flex;
  gap: 0;
  min-width: fit-content;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}

.hour-row:last-child {
  border-bottom: none;
}

.label-cell {
  width: 150px;
  min-width: 150px;
  padding: 0.55rem 0.75rem;
  background: rgba(15, 23, 42, 0.9);
  color: #e2e8f0;
  font-weight: 700;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  position: sticky;
  left: 0;
  z-index: 2;

}

.hour-cell {
  min-width: 80px;
  max-width: 80px;
  border-left: 1px solid rgba(148, 163, 184, 0.12);
  padding: 0.55rem 0.35rem;
  text-align: center;
  color: #e2e8f0;
  display: grid;
  gap: 0.35rem;
  justify-items: center;
  background: rgba(15, 23, 42, 0.82);
}

.hour-row.header .hour-cell {
  font-weight: 700;
  background: rgba(15, 23, 42, 0.95);
}

.hour-cell.value {
  font-size: 1rem;
  font-weight: 800;
}

.hour-cell.direction {
  font-size: 0.85rem;
  line-height: 1.2;
}

.hour-cell .arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  background: rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-weight: 900;
}

.dir-label {
  font-size: 0.78rem;
}

.stars {
  color: #fbbf24;
  letter-spacing: 3px;
}

.hourly-list {
  display: grid;
  gap: 0.75rem;
}

.hour-card {
  border: 1px solid rgba(148, 163, 184, 0.24);
  padding: 0.75rem 0.85rem;
  display: grid;
  gap: 0.6rem;
  color: #e5f3ff;
}

.hour-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
}

.hour-card__head .label {
  font-weight: 800;
  color: #f1f5f9;
}

.hour-card__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem 0.75rem;
}

.hour-card__grid dt {
  font-size: 0.78rem;
  color: #cbd5e1;
  margin-bottom: 0.15rem;
}

.hour-card__grid dd {
  margin: 0;
  font-weight: 700;
  color: #e5f3ff;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.hour-card__grid .direction {
  grid-column: span 2;
}

@media (max-width: 720px) {
  .overlay {
    padding: 0.85rem;
  }

  .overlay-card {
    padding: 1rem;
    width: 100%;
  }

  .overlay-head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 520px) {
  .card-header {
    align-items: flex-start;
  }

  .hour-card__grid {
    grid-template-columns: 1fr;
  }
}
</style>
