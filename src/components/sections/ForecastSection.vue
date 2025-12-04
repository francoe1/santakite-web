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
        <ForecastCard
          v-for="day in forecast"
          :key="day.date"
          :day="day"
          :classification="classifyDay(day)"
          :format-date="formatDate"
          @select="openDetails"
        />
      </div>
      <p v-if="!forecast.length && !statusError" class="muted small">Cargando datos…</p>
      <p v-if="statusError" class="muted small">{{ statusError }}</p>
    </div>
    <ForecastDetailModal
      v-if="selectedDay"
      :day="selectedDay"
      :is-compact-layout="isCompactLayout"
      :hour-cell-style="hourCellStyle"
      :hour-card-style="hourCardStyle"
      :is-playable="isPlayable"
      :format-date="formatDate"
      :detail-text="forecastConfig.detailText"
      @close="closeDetails"
    />
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import {
  buildPreferredDirectionSet,
  degToCompass,
} from '../../utils/wind'
import { weatherService } from '../../services/weatherService'
import ForecastCard from '../forecast/ForecastCard.vue'
import ForecastDetailModal from '../forecast/ForecastDetailModal.vue'

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
  deg != null &&
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
  if (!dateTime) return false
  const date = new Date(dateTime)
  if (Number.isNaN(date.getTime())) return false
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
  (hour.speedKts ?? 0) >= forecastConfig.value.minPlayableKts &&
  isPreferredDirection(hour.dirDeg) &&
  (hour.precipMm ?? 0) < forecastConfig.value.maxPrecipMm &&
  isWithinWindow(hour.time)

const openDetails = (day) => {
  selectedDay.value = day
}

const playabilityScore = (hour) => {
  const speed = hour.speedKts ?? 0
  const rain = hour.precipMm ?? 0
  const speedScore = Math.min(
    Math.max((speed - forecastConfig.value.speedScoreBase) / forecastConfig.value.speedScoreCap, 0),
    1
  )
  const directionBoost = isPreferredDirection(hour.dirDeg) ? 0.3 : -0.25
  const rainPenalty = Math.min(rain / 5, 0.35)
  const windowPenalty = isWithinWindow(hour.time) ? 0 : 0.4
  const raw = speedScore + directionBoost - rainPenalty - windowPenalty
  return Math.min(Math.max(raw, 0), 1)
}

const fetchForecast = async () => {
  const { latitude, longitude } = forecastConfig.value.coordinates
  if (latitude == null || longitude == null) {
    statusError.value = 'No hay coordenadas para cargar el pronóstico.'
    status.value = 'error'
    return
  }

  status.value = 'loading'
  statusError.value = ''
  forecast.value = []

  try {
    const weekDays = await weatherService.getWeekWind({
      latitude,
      longitude,
      directionReference: forecastConfig.value.directionReference,
    })

    const days = weekDays.map((day) => {
      const hours = day.hours || []
      const validSpeeds = hours.map((h) => h.speedKts).filter((speed) => speed != null)
      const validDirs = hours.map((h) => h.dirDeg).filter((dir) => dir != null)
      const validRains = hours.map((h) => h.precipMm ?? 0)
      const gusts = hours.map((h) => h.gustKts).filter((gust) => gust != null)

      const playableHours = hours.filter((hour) => isPlayable(hour))
      const bestHour = playableHours.reduce((best, hour) => {
        if (!best) return hour
        return (hour.gustKts ?? 0) > (best.gustKts ?? 0) ? hour : best
      }, null)

      const avgWindKts =
        validSpeeds.length > 0 ? validSpeeds.reduce((a, b) => a + b, 0) / validSpeeds.length : 0
      const mainDirDeg =
        validDirs.length > 0 ? Math.round(validDirs.reduce((a, b) => a + b, 0) / validDirs.length) : 0
      const maxGustKts = gusts.length > 0 ? Math.max(...gusts) : 0
      const totalRain = validRains.reduce((a, b) => a + b, 0)

      return {
        date: day.date,
        avgWindKts,
        mainDirDeg,
        playableCount: playableHours.length,
        maxGustKts,
        totalRain,
        hours,
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

watch(
  () => ({
    coordinates: forecastConfig.value.coordinates,
    directionReference: forecastConfig.value.directionReference,
  }),
  () => {
    fetchForecast()
  },
  { deep: true }
)

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

@media (max-width: 520px) {
  .card-header {
    align-items: flex-start;
  }
}
</style>
