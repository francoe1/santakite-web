<template>
  <SectionShell
    id="pronostico"
    eyebrow="Pronóstico GFS"
    title="¿Es navegable los próximos días?"
  >
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
  </SectionShell>
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
import SectionShell from '../ui/SectionShell.vue'

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
  }

  const merged = { ...baseConfig, ...props.spot.forecast, ...baseCoordinates }

  if (!merged.preferredDirections?.length) {
    merged.preferredDirections = baseConfig.preferredDirections
  }

  merged.directionReference = merged.directionReference || baseConfig.directionReference

  return merged
})

const preferredDirectionSet = computed(() =>
  buildPreferredDirectionSet(forecastConfig.value.preferredDirections)
)

const statusText = computed(() => {
  if (status.value === 'ok') return 'Buena ventana'
  if (status.value === 'warn') return 'Viento marginal'
  if (status.value === 'error') return 'Error de datos'
  return 'Midiendo viento…'
})

const statusClass = computed(() => ({
  ok: status.value === 'ok',
  warn: status.value === 'warn',
  error: status.value === 'error',
}))

const isPlayable = (hour) => {
  if (!hour || hour.speedKts == null || hour.dirDeg == null) return false
  if (hour.speedKts < forecastConfig.value.minPlayableKts) return false
  if (hour.precipMm >= forecastConfig.value.maxPrecipMm) return false
  return preferredDirectionSet.value.has(degToCompass(hour.dirDeg))
}

const summarizeDay = (day) => {
  const hours = Array.isArray(day.hours) ? day.hours : []

  const validSpeeds = hours.map((h) => h?.speedKts).filter((n) => Number.isFinite(n))
  const validGusts = hours.map((h) => h?.gustKts).filter((n) => Number.isFinite(n))
  const validPrecip = hours.map((h) => h?.precipMm).filter((n) => Number.isFinite(n))
  const validDirs = hours.map((h) => h?.dirDeg).filter((n) => Number.isFinite(n))

  const avgWindKts =
    validSpeeds.reduce((sum, n) => sum + n, 0) / (validSpeeds.length || 1)

  const maxGustKts = validGusts.length ? Math.max(...validGusts) : 0
  const totalRain = validPrecip.reduce((sum, n) => sum + n, 0)

  const directionCounts = validDirs.reduce((acc, dir) => {
    const key = Math.round(dir)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})
  const mainDirDeg = Number(
    Object.entries(directionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0
  )

  const playableHours = hours.filter((hour) => isPlayable(hour))
  const playableShare = hours.length ? playableHours.length / hours.length : 0

  const stars = playableShare > 0.65 ? 3 : playableShare > 0.4 ? 2 : playableShare > 0.2 ? 1 : 0

  const sortableHours = hours.filter((h) => Number.isFinite(h?.speedKts))
  const bestPlayable = [...playableHours].sort(
    (a, b) => (b.speedKts ?? 0) - (a.speedKts ?? 0)
  )[0]
  const bestAny = [...sortableHours].sort(
    (a, b) => (b?.speedKts ?? 0) - (a?.speedKts ?? 0)
  )[0]
  const bestHour = bestPlayable || (sortableHours.length ? bestAny : null)

  return {
    ...day,
    avgWindKts,
    maxGustKts,
    totalRain,
    mainDirDeg,
    playableCount: playableHours.length,
    stars,
    bestHour: bestHour || null,
  }
}

const classifyDay = (day) => {
  const playableHours = day.hours.filter((hour) => isPlayable(hour))
  const share = playableHours.length / day.hours.length

  if (share > 0.65) return 'good'
  if (share > 0.35) return 'ok'
  if (share > 0.15) return 'marginal'
  return 'bad'
}

const formatDate = (dateStr, withDay = false) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-ES', {
    weekday: withDay ? 'long' : undefined,
    day: 'numeric',
    month: 'short',
  })
}

const setLayoutFromWidth = () => {
  isCompactLayout.value = window.innerWidth < 920
}

const onResize = () => setLayoutFromWidth()

const openDetails = (day) => {
  selectedDay.value = day
}

const closeDetails = () => {
  selectedDay.value = null
}

const hourCellStyle = (hour) => ({
  background: isPlayable(hour) ? 'rgba(34,197,94,0.08)' : 'transparent',
  borderColor: isPlayable(hour) ? 'rgba(34,197,94,0.25)' : '#e2e8f0',
})

const hourCardStyle = (hour) => ({
  background: isPlayable(hour) ? 'rgba(34,197,94,0.12)' : '#f8fafc',
  borderColor: isPlayable(hour) ? 'rgba(34,197,94,0.32)' : '#e2e8f0',
})

const refreshForecast = async () => {
  try {
    statusError.value = ''
    status.value = 'loading'
    const data = await weatherService.getWeekWind({
      latitude: forecastConfig.value.latitude,
      longitude: forecastConfig.value.longitude,
      directionReference: forecastConfig.value.directionReference,
      maxPrecipMm: forecastConfig.value.maxPrecipMm,
    })

    forecast.value = data.map((day) => summarizeDay(day))

    const anyGood = data.some((day) => classifyDay(day) === 'good')
    const anyPlayable = data.some((day) => classifyDay(day) !== 'bad')

    status.value = anyGood ? 'ok' : anyPlayable ? 'warn' : 'warn'
  } catch (err) {
    console.error(err)
    status.value = 'error'
    statusError.value = 'No se pudo cargar el pronóstico en este entorno.'
  }
}

onMounted(() => {
  refreshForecast()
  setLayoutFromWidth()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

watch(
  () => ({
    coords: props.spot.wind,
    directionReference: forecastConfig.value.directionReference,
  }),
  () => refreshForecast(),
  { deep: true }
)
</script>

<style scoped>
.card {
  padding: 1.1rem;
  background: #f9fcfd;
  border: 1px solid #dfe7ec;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

h2 {
  font-size: clamp(1.6rem, 2.6vw, 2.15rem);
  margin-bottom: 0.35rem;
  color: #0b1f2a;
}

.muted {
  color: #0f4c5c;
}

.small {
  font-size: 0.95rem;
}

.status {
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  font-weight: 800;
  border: 1px solid #dfe7ec;
}

.status.ok {
  background: #ecfdf3;
  color: #0f5132;
  border-color: #22c55e;
}

.status.warn {
  background: #fffbeb;
  color: #7c2d12;
  border-color: #f59e0b;
}

.status.error {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecdd3;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
}
</style>
