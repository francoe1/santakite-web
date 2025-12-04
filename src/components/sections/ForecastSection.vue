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
        <p class="muted">Criterio: 12–30 nudos, direcciones Sur/Sudeste/Este, sin tormenta eléctrica.</p>
        <span class="status" :class="statusClass">{{ statusText }}</span>
      </div>
      <div class="forecast-grid">
        <div v-for="day in forecast" :key="day.date" class="forecast-card">
          <div class="forecast-date">{{ formatDate(day.date) }}</div>
          <div class="muted small">Viento medio: <strong>{{ day.avgWindKts.toFixed(0) }}</strong> nudos</div>
          <div class="muted small">Dirección: <strong>{{ degToCompass(day.mainDirDeg) }}</strong> ({{ day.mainDirDeg }}°)</div>
          <div class="badge" :class="classifyDay(day).className">{{ classifyDay(day).label }}</div>
          <div class="muted tiny">Tormentas: {{ day.hasStorm ? 'Sí' : 'No' }}</div>
        </div>
        <p v-if="!forecast.length && !statusError" class="muted small">Cargando datos…</p>
        <p v-if="statusError" class="muted small">{{ statusError }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const forecast = ref([])
const statusError = ref('')
const status = ref('loading')

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
  const dir = day.mainDirDeg
  const speed = day.avgWindKts
  const hasStorm = day.hasStorm

  const isGoodDir = (dir >= 60 && dir <= 120) || (dir >= 105 && dir <= 165) || (dir >= 150 && dir <= 210)
  const isGoodSpeed = speed >= 12 && speed <= 30

  if (hasStorm) return { label: 'No apto', className: 'badge-bad' }
  if (isGoodDir && isGoodSpeed) return { label: 'Óptimo', className: 'badge-ok' }
  if (speed < 10 || speed > 32) return { label: 'No apto', className: 'badge-bad' }
  return { label: 'Dudoso', className: 'badge-warn' }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
}

onMounted(async () => {
  try {
    const url =
      'https://api.open-meteo.com/v1/gfs?latitude=-30.90&longitude=-57.93&hourly=winddirection_10m,windspeed_10m,windgusts_10m'

    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    const { time, windspeed_10m, winddirection_10m } = data.hourly
    const map = {}

    for (let i = 0; i < time.length; i += 1) {
      const date = time[i].split('T')[0]
      if (!map[date]) map[date] = { speeds: [], dirs: [] }
      map[date].speeds.push(windspeed_10m[i])
      map[date].dirs.push(winddirection_10m[i])
    }

    const days = Object.keys(map).map((date) => {
      const speeds = map[date].speeds
      const dirs = map[date].dirs
      const avgWind = speeds.reduce((a, b) => a + b, 0) / speeds.length
      const avgDir = dirs.reduce((a, b) => a + b, 0) / dirs.length

      return {
        date,
        avgWindKts: Math.round(avgWind * 1.94384),
        mainDirDeg: Math.round(avgDir),
        hasStorm: false,
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
  padding: 0.9rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
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
</style>
