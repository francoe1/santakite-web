<template>
  <section id="pronostico" class="section">
    <div class="section-head">
      <p class="eyebrow">Pronóstico GFS</p>
      <div>
        <h2>¿Es navegable los próximos días?</h2>
        <p class="muted">Usamos datos horarios del modelo GFS (Open-Meteo) sobre Playa 52 para resumir 7 días.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <p class="muted">Criterio: más de 12 nudos con dirección Sur, Sudeste o Este; lluvia limita la navegación.</p>
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
          <div class="muted small">Lluvia estimada: <strong>{{ day.totalRain.toFixed(1) }}</strong> mm</div>
          <div class="badge" :class="classifyDay(day).className">{{ classifyDay(day).label }}</div>
          <div class="muted tiny">
            Mejor hora:
            <template v-if="day.bestHour">
              <strong>{{ day.bestHour.label }}</strong>
              · {{ day.bestHour.speedKts.toFixed(0) }} kts · {{ degToCompass(day.bestHour.dirDeg) }} ({{ day.bestHour.dirDeg }}°)
              · lluvia {{ day.bestHour.precipMm.toFixed(1) }} mm
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
              Viento > 12 nudos y dirección S/SE/E son jugables. La lluvia reduce seguridad y visibilidad.
            </p>
          </div>
          <button type="button" class="close" @click="closeDetails">✕</button>
        </div>

        <div class="hourly-strip">
          <div
            v-for="hour in selectedDay.hours"
            :key="hour.time"
            class="hour-card"
            :class="{ playable: isPlayable(hour) }"
          >
            <div class="hour-top">
              <p class="hour-label">{{ hour.label }}</p>
              <span class="chip" :class="isPlayable(hour) ? 'chip-ok' : 'chip-muted'">
                {{ isPlayable(hour) ? 'Jugable' : 'No jugable' }}
              </span>
            </div>
            <div class="wind-block">
              <div class="kts">{{ hour.speedKts.toFixed(0) }} kts</div>
              <div class="dir-block">
                <span class="arrow" :style="{ transform: `rotate(${hour.dirDeg}deg)` }">↑</span>
                <span class="dir-label">{{ degToCompass(hour.dirDeg) }} ({{ hour.dirDeg }}°)</span>
              </div>
            </div>
            <div class="rain">Lluvia: {{ hour.precipMm.toFixed(1) }} mm</div>
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
  if (day.playableCount >= 3) return { label: 'Óptimo', className: 'badge-ok' }
  return { label: 'A revisar', className: 'badge-warn' }
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

const isPlayable = (hour) => hour.speedKts >= 12 && isPreferredDirection(hour.dirDeg)

const openDetails = (day) => {
  selectedDay.value = day
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
      'https://api.open-meteo.com/v1/gfs?latitude=-30.9085&longitude=-57.915&hourly=winddirection_10m,windspeed_10m,precipitation&current=winddirection_10m,windspeed_10m&timezone=auto&windspeed_unit=kn'

    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    const { time, windspeed_10m, winddirection_10m, precipitation } = data.hourly
    const map = {}

    for (let i = 0; i < time.length; i += 1) {
      const date = time[i].split('T')[0]
      if (!map[date]) map[date] = { speeds: [], dirs: [], rains: [], hours: [] }
      const speedKts = windspeed_10m[i]
      const dirDeg = winddirection_10m[i]
      const rainMm = precipitation[i] ?? 0

      map[date].speeds.push(speedKts)
      map[date].dirs.push(dirDeg)
      map[date].rains.push(rainMm)
      map[date].hours.push({
        time: time[i],
        label: new Date(time[i]).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        speedKts: speedKts,
        dirDeg: Math.round(dirDeg),
        precipMm: rainMm,
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
      const playableHours = hours.filter((h) => h.speedKts >= 12 && isPreferredDirection(h.dirDeg))
      const bestHourEntry = playableHours.sort((a, b) => b.speedKts - a.speedKts)[0]

      return {
        date,
        avgWindKts: Math.round(avgWind),
        mainDirDeg: Math.round(avgDir),
        totalRain,
        playableCount: playableHours.length,
        bestHour: bestHourEntry
          ? {
              label: bestHourEntry.label,
              speedKts: bestHourEntry.speedKts,
              dirDeg: bestHourEntry.dirDeg,
              precipMm: bestHourEntry.precipMm,
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
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
}

.muted {
  color: #cbd5e1;
}

.card {
  padding: 1.2rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.65);
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  border-radius: 999px;
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
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  cursor: pointer;
  color: #e2e8f0;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.forecast-card:hover,
.forecast-card:focus-visible {
  border-color: rgba(34, 197, 94, 0.55);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.55);
  outline: none;
}

.forecast-date {
  font-weight: 700;
}

.badge {
  align-self: flex-start;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.85rem;
}

.badge-ok {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.35);
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
  backdrop-filter: blur(4px);
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
  border-radius: 1rem;
  padding: 1.25rem;
  width: min(900px, 100%);
  max-height: 90vh;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  border-radius: 999px;
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.hourly-strip {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(160px, 1fr);
  gap: 0.8rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.hour-card {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.8rem;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.75);
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.hour-card.playable {
  border-color: rgba(34, 197, 94, 0.45);
  box-shadow: 0 12px 28px rgba(34, 197, 94, 0.15);
}

.hour-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.hour-label {
  font-weight: 700;
  color: #e2e8f0;
}

.chip {
  border-radius: 999px;
  padding: 0.2rem 0.65rem;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid transparent;
}

.chip-ok {
  background: rgba(34, 197, 94, 0.18);
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.35);
}

.chip-muted {
  background: rgba(148, 163, 184, 0.14);
  color: #cbd5e1;
  border-color: rgba(148, 163, 184, 0.3);
}

.wind-block {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.kts {
  font-size: 1.35rem;
  font-weight: 800;
}

.dir-block {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #cbd5e1;
}

.arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-weight: 900;
}

.dir-label {
  font-size: 0.95rem;
}

.rain {
  color: #cbd5e1;
  font-size: 0.95rem;
}
</style>
