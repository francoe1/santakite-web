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
  if (status.value === 'ok') return 'bg-emerald-500/15 text-emerald-400 border border-emerald-400/40'
  if (status.value === 'error') return 'bg-rose-500/15 text-rose-300 border border-rose-400/40'
  return 'bg-amber-500/15 text-amber-300 border border-amber-300/40'
})

const degToCompass = (deg) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  return dirs[Math.round(deg / 45) % 8]
}

const classifyDay = (day) => {
  const hasPlayable = day.playableCount > 0
  const soaked = day.totalRain >= 5
  if (!hasPlayable) return { label: 'No apto', className: 'bg-rose-500/15 text-rose-400 border border-rose-400/40' }
  if (soaked) return { label: 'Dudoso por lluvia', className: 'bg-amber-500/15 text-amber-400 border border-amber-400/40' }
  if (day.playableCount >= 6) return { label: 'Óptimo', className: 'bg-emerald-500/15 text-emerald-400 border border-emerald-400/40' }
  return { label: 'A revisar', className: 'bg-amber-500/15 text-amber-400 border border-amber-400/40' }
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
  const hue = 8 + (128 - 8) * score
  const tone = `hsl(${hue}, 58%, 62%)`
  const wash = `hsla(${hue}, 58%, 62%, 0.14)`
  return {
    borderColor: tone,
    background: `linear-gradient(180deg, ${wash}, rgba(15, 23, 42, 0.9))`,
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

<template>
  <section id="pronostico" class="section-block bg-[var(--surface-strong)]">
    <div class="section-header">
      <div>
        <p class="section-eyebrow">Pronóstico GFS</p>
        <h2 class="section-title">¿Es navegable los próximos días?</h2>
        <p class="section-description">Usamos datos horarios del modelo GFS (Open-Meteo) sobre Playa 52 para resumir 7 días.</p>
      </div>
      <span class="tag bg-accent-10 text-[var(--accent)]">Automático</span>
    </div>

    <div class="glass-card p-4 md:p-5 space-y-4 shadow-android">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-muted text-sm max-w-3xl">Criterio: más de 12 nudos con dirección Sur, Sudeste o Este; lluvia limita la navegación.</p>
        <span class="px-3 py-1 rounded-full text-xs font-bold" :class="statusClass">{{ statusText }}</span>
      </div>
      <div class="grid gap-3 md:grid-cols-2">
        <button
          v-for="day in forecast"
          :key="day.date"
          type="button"
          class="glass-card text-left p-4 md:p-5 space-y-2 border border-outline-50 hover:-translate-y-0.5 transition"
          @click="openDetails(day)"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted">{{ formatDate(day.date) }}</p>
              <p class="text-xl font-bold">{{ degToCompass(day.mainDirDeg) }} · {{ day.avgWindKts.toFixed(0) }} kts</p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs font-bold" :class="classifyDay(day).className">{{ classifyDay(day).label }}</span>
          </div>
          <div class="text-sm text-muted grid gap-1">
            <span>Ventana jugable: <strong class="text-[var(--on-surface)]">{{ day.playableCount }}</strong> hs</span>
            <span>Ráfaga máxima: <strong class="text-[var(--on-surface)]">{{ day.maxGustKts.toFixed(0) }}</strong> kts</span>
            <span>Lluvia estimada: <strong class="text-[var(--on-surface)]">{{ day.totalRain.toFixed(1) }}</strong> mm</span>
            <span>Mejor hora: <strong class="text-[var(--on-surface)]">{{ day.bestHour?.label || 'Sin datos' }}</strong></span>
          </div>
          <div class="flex items-center justify-between pt-1 text-amber-400" aria-label="Ventana destacada" role="img">
            <span>{{ day.stars > 0 ? '★'.repeat(day.stars) : 'Sin ventana marcada' }}</span>
            <span class="text-xs text-muted">Tap para ver detalle horario</span>
          </div>
        </button>
      </div>
      <p v-if="!forecast.length && !statusError" class="text-muted text-sm">Cargando datos…</p>
      <p v-if="statusError" class="text-muted text-sm">{{ statusError }}</p>
    </div>

    <Teleport to="body">
      <div
        v-if="selectedDay"
        class="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm"
        @click.self="closeDetails"
      >
        <div class="glass-card relative m-0 flex h-full w-full flex-col overflow-hidden bg-[var(--surface-strong)] p-4 md:p-6">
          <div class="flex items-start justify-between gap-3 pb-4 border-b border-outline-60">
            <div class="space-y-1">
              <p class="section-eyebrow">Detalle por hora</p>
              <h3 class="text-2xl font-black">{{ formatDate(selectedDay.date) }}</h3>
              <p class="text-muted text-sm">Viento > 12 nudos y dirección S/SE/E son jugables. Ventana: verano 7-20 h · invierno 9-17:30 h. La lluvia reduce seguridad y visibilidad.</p>
            </div>
            <button type="button" class="pill-button" @click="closeDetails">Cerrar</button>
          </div>

          <div class="flex-1 overflow-auto rounded-2xl border border-outline-60 bg-[var(--surface-card)] p-1 md:p-3 shadow-inner">
            <div class="flex flex-col">
              <div class="flex border-b border-outline-50 bg-surface-card-80 backdrop-blur">
                <div class="w-[150px] min-w-[150px] px-3 py-2 font-bold border-r border-outline-50">Hora</div>
                <div
                  v-for="hour in selectedDay.hours"
                  :key="`h-${hour.time}`"
                  class="min-w-[80px] max-w-[80px] px-2 py-2 text-center font-semibold text-[var(--on-surface)] border-l border-outline-40"
                  :style="hourCellStyle(hour)"
                >
                  {{ hour.label }}
                </div>
              </div>

              <div class="flex border-b border-outline-50">
                <div class="w-[150px] min-w-[150px] px-3 py-2 font-semibold text-muted border-r border-outline-50">Viento (kts)</div>
                <div
                  v-for="hour in selectedDay.hours"
                  :key="`w-${hour.time}`"
                  class="min-w-[80px] max-w-[80px] px-2 py-2 text-center font-extrabold text-white border-l border-outline-40"
                  :style="hourCellStyle(hour)"
                >
                  {{ hour.speedKts.toFixed(0) }}
                </div>
              </div>

              <div class="flex border-b border-outline-50">
                <div class="w-[150px] min-w-[150px] px-3 py-2 font-semibold text-muted border-r border-outline-50">Ráfagas (kts)</div>
                <div
                  v-for="hour in selectedDay.hours"
                  :key="`g-${hour.time}`"
                  class="min-w-[80px] max-w-[80px] px-2 py-2 text-center font-semibold text-white border-l border-outline-40"
                  :style="hourCellStyle(hour)"
                >
                  {{ hour.gustKts.toFixed(0) }}
                </div>
              </div>

              <div class="flex border-b border-outline-50">
                <div class="w-[150px] min-w-[150px] px-3 py-2 font-semibold text-muted border-r border-outline-50">Dirección</div>
                <div
                  v-for="hour in selectedDay.hours"
                  :key="`d-${hour.time}`"
                  class="min-w-[80px] max-w-[80px] px-2 py-2 text-center text-white border-l border-outline-40 space-y-1"
                  :style="hourCellStyle(hour)"
                >
                  <span class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20">
                    <span :style="{ transform: `rotate(${(hour.dirDeg + 180) % 360}deg)` }">↑</span>
                  </span>
                  <span class="block text-xs">{{ degToCompass(hour.dirDeg) }} ({{ hour.dirDeg }}°)</span>
                </div>
              </div>

              <div class="flex border-b border-outline-50">
                <div class="w-[150px] min-w-[150px] px-3 py-2 font-semibold text-muted border-r border-outline-50">Temperatura (°C)</div>
                <div
                  v-for="hour in selectedDay.hours"
                  :key="`t-${hour.time}`"
                  class="min-w-[80px] max-w-[80px] px-2 py-2 text-center font-semibold text-white border-l border-outline-40"
                  :style="hourCellStyle(hour)"
                >
                  {{ hour.tempC !== null ? hour.tempC.toFixed(0) : '-' }}
                </div>
              </div>

              <div class="flex">
                <div class="w-[150px] min-w-[150px] px-3 py-2 font-semibold text-muted border-r border-outline-50">Lluvia (mm)</div>
                <div
                  v-for="hour in selectedDay.hours"
                  :key="`r-${hour.time}`"
                  class="min-w-[80px] max-w-[80px] px-2 py-2 text-center font-semibold text-white border-l border-outline-40"
                  :style="hourCellStyle(hour)"
                >
                  {{ hour.precipMm.toFixed(1) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
