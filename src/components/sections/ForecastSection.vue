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
          <button type="button" class="share" @click.stop="shareDay(day)">
            Compartir día navegable
          </button>
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
              Viento > 12 nudos y dirección S/SE/E son jugables. Ventana: verano 7-20 h · invierno 9-17:30 h. La lluvia reduce
              seguridad y visibilidad.
            </p>
          </div>
          <button type="button" class="close" @click="closeDetails">✕</button>
        </div>

        <div class="overlay-actions">
          <button type="button" class="share" @click="shareDay(selectedDay)">
            Compartir este día
          </button>
        </div>

        <div class="hourly-table" role="table">
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
            <div class="label-cell" role="rowheader">Viento</div>
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
            <div class="label-cell" role="rowheader">Ráfaga</div>
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
            <div class="label-cell" role="rowheader">Direc.</div>
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
            <div class="label-cell" role="rowheader">Temp</div>
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
            <div class="label-cell" role="rowheader">Lluvia</div>
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

const buildShareMessage = (day) => {
  const dateLabel = formatDate(day.date)
  const dirLabel = degToCompass(day.mainDirDeg)
  const best = day.bestHour
    ? `Mejor hora ${day.bestHour.label}: ${day.bestHour.speedKts.toFixed(0)} kts ${degToCompass(day.bestHour.dirDeg)} (ráfaga ${day.bestHour.gustKts.toFixed(0)} kts, lluvia ${day.bestHour.precipMm.toFixed(1)} mm)`
    : 'Revisá las horas jugables en el tablero'

  return `Te invito a navegar en Playa 52 el ${dateLabel}. Viento medio ${day.avgWindKts.toFixed(0)} kts (${dirLabel}), ráfaga máxima ${day.maxGustKts.toFixed(0)} kts. ${best}.`
}

const drawShareCard = (day) =>
  new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      const width = 900
      const height = 2000 // relación 9:20 vertical
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, '#041529')
      gradient.addColorStop(0.45, '#062036')
      gradient.addColorStop(1, '#0a2f4e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      const panel = (x, y, w, h) => {
        ctx.save()
        const g = ctx.createLinearGradient(x, y, x, y + h)
        g.addColorStop(0, 'rgba(94, 234, 212, 0.18)')
        g.addColorStop(1, 'rgba(14, 23, 42, 0.6)')
        ctx.fillStyle = g
        ctx.strokeStyle = 'rgba(94, 234, 212, 0.38)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.roundRect(x, y, w, h, 28)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      }

      ctx.fillStyle = '#e2e8f0'
      ctx.font = '700 46px "Inter", "Helvetica", sans-serif'
      ctx.fillText('Playa 52 · Invitación a navegar', 60, 120)
      ctx.font = '400 30px "Inter", "Helvetica", sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('Comparte esta tarjeta 9:20 para tu crew', 60, 170)

      panel(60, 210, width - 120, 360)
      ctx.fillStyle = '#5eead4'
      ctx.font = '800 70px "Inter", "Helvetica", sans-serif'
      ctx.fillText(formatDate(day.date), 110, 305)

      ctx.fillStyle = '#e2e8f0'
      ctx.font = '600 34px "Inter", "Helvetica", sans-serif'
      ctx.fillText('Resumen del día', 110, 360)
      ctx.font = '400 30px "Inter", "Helvetica", sans-serif'
      ctx.fillStyle = '#cbd5e1'
      ctx.fillText(`Viento medio ${day.avgWindKts.toFixed(0)} kts (${degToCompass(day.mainDirDeg)})`, 110, 410)
      ctx.fillText(`Ráfaga máxima ${day.maxGustKts.toFixed(0)} kts · Lluvia ${day.totalRain.toFixed(1)} mm`, 110, 455)
      ctx.fillText(`Horas jugables ${day.playableCount} · Rating ${'★'.repeat(day.stars) || 'Sin ventana'}`, 110, 500)

      if (day.bestHour) {
        ctx.fillStyle = '#5eead4'
        ctx.font = '700 32px "Inter", "Helvetica", sans-serif'
        ctx.fillText('Ventana destacada', 110, 560)
        ctx.font = '400 28px "Inter", "Helvetica", sans-serif'
        ctx.fillStyle = '#cbd5e1'
        const detail = `Mejor hora ${day.bestHour.label}: ${day.bestHour.speedKts.toFixed(0)} kts ${degToCompass(day.bestHour.dirDeg)} · ráfaga ${
          day.bestHour.gustKts.toFixed(0)
        } kts · lluvia ${day.bestHour.precipMm.toFixed(1)} mm`
        ctx.fillText(detail, 110, 600)
      }

      panel(60, 610, width - 120, 670)
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '600 38px "Inter", "Helvetica", sans-serif'
      ctx.fillText('Mejores horas (kts · ráfaga)', 110, 680)

      const playableHours = day.hours.filter((h) => isPlayable(h))
      const sorted = (playableHours.length ? playableHours : [...day.hours])
        .slice()
        .sort((a, b) => b.speedKts - a.speedKts)
      const topHours = sorted.slice(0, 8).sort((a, b) => new Date(a.time) - new Date(b.time))

      const chartLeft = 120
      const chartBottom = 1200
      const chartWidth = width - 2 * chartLeft
      const chartHeight = 480
      const maxKts = Math.max(18, ...topHours.map((h) => h.gustKts))

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(chartLeft, chartBottom - chartHeight)
      ctx.lineTo(chartLeft, chartBottom)
      ctx.lineTo(chartLeft + chartWidth, chartBottom)
      ctx.stroke()

      ctx.font = '400 24px "Inter", "Helvetica", sans-serif'
      ctx.fillStyle = '#94a3b8'
      for (let i = 0; i <= 4; i += 1) {
        const value = Math.round((maxKts / 4) * i)
        const y = chartBottom - (chartHeight / maxKts) * value
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)'
        ctx.moveTo(chartLeft, y)
        ctx.lineTo(chartLeft + chartWidth, y)
        ctx.stroke()
        ctx.fillText(`${value} kts`, chartLeft - 80, y + 8)
      }

      const barWidth = topHours.length > 1 ? chartWidth / topHours.length - 20 : chartWidth * 0.4
      const xStep = topHours.length > 1 ? chartWidth / (topHours.length - 1) : chartWidth / 2

      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 4
      ctx.beginPath()

      topHours.forEach((hour, index) => {
        const x = chartLeft + index * xStep
        const speedHeight = (chartHeight / maxKts) * hour.speedKts
        const gustHeight = (chartHeight / maxKts) * hour.gustKts
        const barX = x - barWidth / 2
        const barY = chartBottom - speedHeight

        const barGradient = ctx.createLinearGradient(0, barY, 0, chartBottom)
        barGradient.addColorStop(0, 'rgba(94, 234, 212, 0.9)')
        barGradient.addColorStop(1, 'rgba(94, 234, 212, 0.25)')
        ctx.fillStyle = barGradient
        ctx.beginPath()
        ctx.roundRect(barX, barY, barWidth, speedHeight, 14)
        ctx.fill()

        const gustY = chartBottom - gustHeight
        if (index === 0) {
          ctx.moveTo(x, gustY)
        } else {
          ctx.lineTo(x, gustY)
        }

        ctx.fillStyle = '#e2e8f0'
        ctx.font = '700 26px "Inter", "Helvetica", sans-serif'
        ctx.fillText(hour.speedKts.toFixed(0), barX + barWidth / 2 - 14, barY - 12)
        ctx.font = '400 22px "Inter", "Helvetica", sans-serif'
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(`ráf ${hour.gustKts.toFixed(0)}`, barX + barWidth / 2 - 28, barY + 32)

        ctx.fillStyle = '#cbd5e1'
        ctx.font = '400 22px "Inter", "Helvetica", sans-serif'
        ctx.fillText(hour.label, x - 36, chartBottom + 34)
      })

      ctx.stroke()

      panel(60, 1300, width - 120, 520)
      ctx.fillStyle = '#e2e8f0'
      ctx.font = '600 34px "Inter", "Helvetica", sans-serif'
      ctx.fillText('Tip rápido', 110, 1370)
      ctx.font = '400 28px "Inter", "Helvetica", sans-serif'
      ctx.fillStyle = '#cbd5e1'
      ctx.fillText('Sur, Sudeste y Este arriba de 12 kts son ideales.', 110, 1415)
      ctx.fillText('Evita lluvia intensa; revisa ráfagas y la ventana horaria.', 110, 1460)
      ctx.fillText('Comparte y alinea a tu crew para la sesión.', 110, 1505)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '400 24px "Inter", "Helvetica", sans-serif'
      ctx.fillText('santakite.com · datos GFS · tarjeta 9:20 lista para compartir', 110, 1800)

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('No se pudo crear la imagen para compartir'))
          return
        }
        resolve({ blob, url: canvas.toDataURL('image/png') })
      })
    } catch (err) {
      reject(err)
    }
  })

const shareDay = async (day) => {
  if (!day) return

  const message = buildShareMessage(day)
  const title = `Sesión en Playa 52 · ${formatDate(day.date)}`

  try {
    const { blob, url } = await drawShareCard(day)
    const file = new File([blob], `playa52-${day.date}.png`, { type: 'image/png' })

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title, text: message })
      return
    }

    if (navigator.share) {
      await navigator.share({ title, text: message, url: window.location.href })
      return
    }

    const link = document.createElement('a')
    link.href = url
    link.download = `playa52-${day.date}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    alert('Descargamos una tarjeta de invitación para que la compartas')
  } catch (err) {
    console.error(err)
    alert('No pudimos generar la tarjeta para compartir este día')
  }
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

.share {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 0.35rem;
  padding: 0.55rem 0.75rem;
  background: rgba(148, 163, 184, 0.12);
  color: #e2e8f0;
  border: 1px solid rgba(125, 242, 221, 0.4);
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.share:hover,
.share:focus-visible {
  border-color: rgba(125, 242, 221, 0.7);
  transform: translateY(-1px);
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
  max-height: 92vh;

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
  flex-wrap: wrap;
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

.overlay-actions {
  display: flex;
  justify-content: flex-end;
}

.overlay-actions .share {
  width: auto;
  min-width: 220px;
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
  min-width: 76px;
  max-width: 76px;
  border-left: 1px solid rgba(148, 163, 184, 0.12);
  padding: 0.5rem 0.3rem;
  text-align: center;
  color: #e2e8f0;
  display: grid;
  gap: 0.32rem;
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
  width: 22px;
  height: 22px;

  background: rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-weight: 900;
}

.dir-label {
  font-size: 0.75rem;
}

.stars {
  color: #fbbf24;
  letter-spacing: 3px;
}

@media (max-width: 900px) {
  .overlay {
    align-items: flex-start;
    padding: 0.85rem;
  }

  .overlay-card {
    width: 100%;
    padding: 0.9rem;
    gap: 0.7rem;
  }

  .label-cell {
    width: 132px;
    min-width: 132px;
    padding: 0.5rem 0.65rem;
    font-size: 0.95rem;
  }

  .hour-cell {
    min-width: 64px;
    max-width: 64px;
    padding: 0.42rem 0.25rem;
    gap: 0.28rem;
    font-size: 0.92rem;
  }

  .hour-cell .arrow {
    width: 20px;
    height: 20px;
  }

  .dir-label {
    font-size: 0.72rem;
  }

  .forecast-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .forecast-card {
    padding: 0.8rem;
  }

  .overlay-card {
    max-height: 90vh;
    padding: 0.75rem;
    gap: 0.65rem;
  }

  .hourly-table {
    font-size: 0.85rem;
  }

  .label-cell {
    width: 102px;
    min-width: 102px;
    padding: 0.45rem 0.55rem;
    font-size: 0.88rem;
  }

  .hour-cell {
    min-width: 48px;
    max-width: 48px;
    padding: 0.35rem 0.2rem;
    gap: 0.22rem;
    font-size: 0.84rem;
  }

  .hour-cell .arrow {
    width: 18px;
    height: 18px;
    font-size: 0.8rem;
  }

  .dir-label {
    font-size: 0.68rem;
  }

  .overlay-head h3 {
    margin-top: 0.2rem;
  }
}
</style>
