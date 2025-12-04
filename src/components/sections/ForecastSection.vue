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
          <div class="muted small">Viento medio: <strong>{{ day.avgWindKts.toFixed(0) }}</strong> nudos</div>
          <div class="muted small">Dirección principal: <strong>{{ degToCompass(day.mainDirDeg) }}</strong> ({{ day.mainDirDeg }}°)</div>
          <div class="muted small">Ventana jugable: <strong>{{ day.playableCount }}</strong> hs</div>
          <div class="muted small">Lluvia estimada: <strong>{{ day.totalRain.toFixed(1) }}</strong> mm</div>
          <div class="badge" :class="classifyDay(day).className">{{ classifyDay(day).label }}</div>
          <div class="muted tiny">Mejor hora: {{ day.bestHour ? day.bestHour.label : 'Sin datos' }}</div>
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

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Viento (kts)</th>
                <th>Dirección</th>
                <th>Lluvia (mm)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hour in selectedDay.hours" :key="hour.time">
                <td>{{ hour.label }}</td>
                <td>{{ hour.speedKts.toFixed(0) }}</td>
                <td>{{ degToCompass(hour.dirDeg) }} ({{ hour.dirDeg }}°)</td>
                <td>{{ hour.precipMm.toFixed(1) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

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

const openDetails = (day) => {
  selectedDay.value = day
}

const closeDetails = () => {
  selectedDay.value = null
}

onMounted(async () => {
  try {
    const url =
      'https://api.open-meteo.com/v1/gfs?latitude=-30.90&longitude=-57.93&hourly=winddirection_10m,windspeed_10m,precipitation&timezone=auto'

    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    const { time, windspeed_10m, winddirection_10m, precipitation } = data.hourly
    const map = {}

    for (let i = 0; i < time.length; i += 1) {
      const date = time[i].split('T')[0]
      if (!map[date]) map[date] = { speeds: [], dirs: [], rains: [], hours: [] }
      const speedMs = windspeed_10m[i]
      const dirDeg = winddirection_10m[i]
      const rainMm = precipitation[i] ?? 0

      map[date].speeds.push(speedMs)
      map[date].dirs.push(dirDeg)
      map[date].rains.push(rainMm)
      map[date].hours.push({
        time: time[i],
        label: new Date(time[i]).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        speedKts: speedMs * 1.94384,
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
      const bestHour = playableHours.sort((a, b) => b.speedKts - a.speedKts)[0]

      return {
        date,
        avgWindKts: Math.round(avgWind * 1.94384),
        mainDirDeg: Math.round(avgDir),
        totalRain,
        playableCount: playableHours.length,
        bestHour: bestHour ? { label: bestHour.label } : null,
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
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 30;
}

.overlay-card {
  background: #0b1222;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 1rem;
  padding: 1.25rem;
  width: min(900px, 100%);
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

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.15);
}

th {
  color: #cbd5e1;
  font-weight: 700;
}
</style>
