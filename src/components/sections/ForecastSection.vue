<template>
  <section id="pronostico" class="section">
    <div class="section-head">
      <div>
        <h2>¿Es navegable los próximos días?</h2>
        <p>Usamos datos horarios del modelo GFS (Open-Meteo) sobre Playa 52 para resumir 7 días.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <p>Criterio: más de 12 nudos con dirección Sur, Sudeste o Este; lluvia limita la navegación.</p>
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
          <div class="small">Viento medio: <strong>{{ day.avgWindKts.toFixed(0) }}</strong> kts</div>
          <div class="small">Dirección: <strong>{{ degToCompass(day.mainDirDeg) }}</strong> ({{ day.mainDirDeg }}°)</div>
          <div class="small">Ventana jugable: <strong>{{ day.playableCount }}</strong> hs</div>
          <div class="small">Ráfaga máxima: <strong>{{ day.maxGustKts.toFixed(0) }}</strong> kts</div>
          <div class="small">Lluvia estimada: <strong>{{ day.totalRain.toFixed(1) }}</strong> mm</div>
          <div class="small">
            <span v-if="day.stars > 0" class="stars" :aria-label="`Mejor ventana ${day.stars} estrellas`" role="img">
              {{ '★'.repeat(day.stars) }}
            </span>
            <span v-else>Sin ventana marcada</span>
          </div>
          <div class="badge" :class="classifyDay(day).className">{{ classifyDay(day).label }}</div>
          <div class="tiny">
            Mejor hora:
            <template v-if="day.bestHour">
              <strong>{{ day.bestHour.label }}</strong>
              · {{ day.bestHour.speedKts.toFixed(0) }} kts · {{ degToCompass(day.bestHour.dirDeg) }} ({{ day.bestHour.dirDeg }}°)
            </template>
            <template v-else>Sin datos</template>
          </div>
        </button>
      </div>
      <p v-if="!forecast.length && !statusError" class="small">Cargando datos…</p>
      <p v-if="statusError" class="small">{{ statusError }}</p>
    </div>
    <div v-if="selectedDay" class="overlay" @click.self="closeDetails">
      <div class="overlay-card">
        <div class="overlay-head">
          <div>
            <h3>Detalle por hora: {{ formatDate(selectedDay.date) }}</h3>
            <p class="small">
              Viento > 12 nudos y dirección S/SE/E son jugables. Ventana: verano 7-20 h · invierno 9-17:30 h.
            </p>
          </div>
          <button type="button" class="close" @click="closeDetails">✕</button>
        </div>

        <div class="hourly-table" role="table">
          <div class="hour-row header" role="row">
            <div class="label-cell" role="columnheader">Hora</div>
            <div v-for="hour in selectedDay.hours" :key="`h-${hour.time}`" class="hour-cell time" role="columnheader">
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
              <span class="dir-label">{{ degToCompass(hour.dirDeg) }}</span>
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
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const forecast = ref([])
const statusError = ref('')
const status = ref('loading')
const selectedDay = ref(null)

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

const degToCompass = (deg) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  return dirs[Math.round(deg / 45) % 8]
}

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

const isPreferredDirection = (deg) => {
  const compass = degToCompass(deg)
  return compass === 'S' || compass === 'SE' || compass === 'E'
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
    return hour >= 7 && hour <= 20
  }
  if (hour < 9) return false
  if (hour < 17) return true
  if (hour === 17) return minute <= 30
  return false
}

const isPlayable = (hour) =>
  hour.speedKts >= 12 && isPreferredDirection(hour.dirDeg) && hour.precipMm < 3 && isWithinWindow(hour.time)

const openDetails = (day) => {
  selectedDay.value = day
}

const playabilityScore = (hour) => {
  const speedScore = Math.min(Math.max((hour.speedKts - 8) / 14, 0), 1)
  const directionBoost = isPreferredDirection(hour.dirDeg) ? 0.3 : -0.25
  const rainPenalty = Math.min(hour.precipMm / 5, 0.35)
  const windowPenalty = isWithinWindow(hour.time) ? 0 : 0.4
  const raw = speedScore + directionBoost - rainPenalty - windowPenalty
  return Math.min(Math.max(raw, 0), 1)
}

const hourCellStyle = (hour) => {
  const score = playabilityScore(hour)
  const isGood = isPlayable(hour)
  if (!isGood) return {}

  const hue = 120 + 80 * score
  const saturation = 40 + 30 * score
  const lightness = 65 - 15 * score
  const tone = `hsl(${hue}, ${saturation}%, ${lightness}%)`
  const wash = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.15)`
  return {
    borderColor: tone,
    background: `linear-gradient(180deg, ${wash}, transparent)`,
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
})

onMounted(async () => {
  try {
    const url =
      'https://api.open-meteo.com/v1/gfs?latitude=-30.9085&longitude=-57.915&hourly=winddirection_10m,windspeed_10m,windgusts_10m,precipitation,temperature_2m&current=winddirection_10m,windspeed_10m&timezone=auto&windspeed_unit=kn'

    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    const { time, windspeed_10m, winddirection_10m, windgusts_10m, precipitation, temperature_2m } = data.hourly
    const map = {}

    for (let i = 0; i < time.length; i += 1) {
      const date = time[i].split('T')[0]
      if (!map[date]) map[date] = { speeds: [], dirs: [], rains: [], hours: [] }
      const speedKts = windspeed_10m[i]
      const dirDeg = winddirection_10m[i]
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

      const avgWind = speeds.reduce((a, b) => a + b, 0) / speeds.length
      const avgDir = dirs.reduce((a, b) => a + b, 0) / dirs.length
      const totalRain = rains.reduce((a, b) => a + b, 0)
      const playableHours = hours.filter((h) => isPlayable(h))
      const bestHourEntry = playableHours.sort((a, b) => b.speedKts - a.speedKts)[0]
      const maxGust = Math.max(...hours.map((h) => h.gustKts))
      const stars = bestStarRating(playableHours.length)

      return {
        date,
        avgWindKts: Math.round(avgWind),
        mainDirDeg: Math.round(avgDir),
        totalRain,
        playableCount: playableHours.length,
        maxGustKts: Math.round(maxGust),
        stars,
        bestHour: bestHourEntry
          ? {
              label: bestHourEntry.label,
              speedKts: bestHourEntry.speedKts,
              dirDeg: bestHourEntry.dirDeg,
              precipMm: bestHourEntry.precipMm,
              gustKts: bestHourEntry.gustKts,
            }
          : null,
        hours,
      }
    })

    forecast.value = days.slice(0, 7)
    status.value = 'ok'
  } catch (err) {
    console.error(err)
    status.value = 'error'
    statusError.value = 'No se pudo cargar el pronóstico GFS en este entorno.'
  }
})
</script>

<style scoped>
.section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--slate-200);
}

.section-head {
  max-width: 720px;
  margin: 0 auto 2.5rem;
  text-align: center;
}

h2 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  margin-bottom: 0.5rem;
  font-weight: 700;
}

p {
  color: var(--slate-600);
  font-size: 1.1rem;
}

.card {
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: white;
  border: 1px solid var(--slate-200);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.card-header p {
  font-size: 0.9rem;
  color: var(--slate-500);
}

.status {
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid;
}

.status-loading {
  background-color: var(--yellow-100);
  color: var(--yellow-700);
  border-color: var(--yellow-200);
}
.status-ok {
  background-color: var(--green-100);
  color: var(--green-700);
  border-color: var(--green-200);
}
.status-error {
  background-color: var(--red-100);
  color: var(--red-700);
  border-color: var(--red-200);
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.forecast-card {
  border: none;
  text-align: left;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--slate-200);
  background: var(--slate-50);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  cursor: pointer;
  color: var(--slate-700);
  transition: all 0.2s ease;
}

.forecast-card:hover,
.forecast-card:focus-visible {
  border-color: var(--sky-400);
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.07);
  outline: none;
}

.forecast-date {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.badge {
  align-self: flex-start;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  border: 1px solid;
}

.badge-ok {
  background-color: var(--green-100);
  color: var(--green-700);
  border-color: var(--green-200);
}
.badge-warn {
  background-color: var(--yellow-100);
  color: var(--yellow-700);
  border-color: var(--yellow-200);
}
.badge-bad {
  background-color: var(--red-100);
  color: var(--red-700);
  border-color: var(--red-200);
}

.small,
p.small {
  font-size: 0.9rem;
  color: var(--slate-500);
}

.tiny {
  font-size: 0.8rem;
  color: var(--slate-500);
  margin-top: 0.25rem;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1200;
  overflow-y: auto;
}

.overlay-card {
  background: white;
  border: 1px solid var(--slate-200);
  border-radius: 1.25rem;
  padding: 1.5rem;
  width: min(1100px, 100%);
  max-height: 90vh;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.overlay-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.overlay-head h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.close {
  border: 1px solid var(--slate-300);
  background: white;
  color: var(--slate-600);
  border-radius: 999px;
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.close:hover {
  background: var(--slate-100);
  transform: scale(1.05);
}

.hourly-table {
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  border: 1px solid var(--slate-200);
  border-radius: 1rem;
  background: var(--slate-50);
}

.hour-row {
  display: flex;
  min-width: fit-content;
  border-bottom: 1px solid var(--slate-200);
}
.hour-row:last-child {
  border-bottom: none;
}

.label-cell {
  width: 140px;
  min-width: 140px;
  padding: 0.6rem 0.85rem;
  background: white;
  color: var(--slate-700);
  font-weight: 600;
  display: flex;
  align-items: center;
  border-right: 1px solid var(--slate-200);
}

.hour-cell {
  min-width: 70px;
  max-width: 70px;
  border-left: 1px solid var(--slate-200);
  padding: 0.6rem 0.35rem;
  text-align: center;
  color: var(--slate-700);
  display: grid;
  gap: 0.3rem;
  justify-items: center;
  font-size: 0.9rem;
}

.hour-row.header .hour-cell {
  font-weight: 600;
  background: white;
}

.hour-cell.value {
  font-weight: 700;
}
.hour-cell.direction {
  line-height: 1.2;
}

.hour-cell .arrow {
  display: inline-block;
  font-weight: 900;
}
.dir-label {
  font-size: 0.8rem;
  color: var(--slate-500);
}

.stars {
  color: #f59e0b;
  letter-spacing: 2px;
}
</style>
