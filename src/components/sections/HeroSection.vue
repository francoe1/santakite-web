<template>
  <section id="hero" class="hero">
    <div class="hero-splash" aria-hidden="true"></div>
    <div class="hero-copy">
      <p class="badge">Santa Ana · Río Uruguay</p>
      <h1>
        Kitesurf relajado, viento limpio
        <span class="accent">y vibra playera</span>
      </h1>
      <p class="lead">
        Base segura para armar, navegar y compartir. Zonas claras, pronóstico en vivo y ambiente chill para surfear cometas al
        atardecer.
      </p>
      <div class="hero-tags" aria-label="Destacados">
        <span>Vientos S · SE · E</span>
        <span>Zonas separadas</span>
        <span>Pronóstico GFS</span>
      </div>
    </div>
    <div class="hero-card" role="presentation">
      <div class="card-inner">
        <div class="wind-widget">
          <div
            class="arrow-circle"
            :style="currentWind.dirDeg !== null ? { transform: `rotate(${(currentWind.dirDeg + 180) % 360}deg)` } : {}"
          >
            ↑
          </div>
          <div class="wind-data">
            <p class="wind-value">
              {{ currentWind.speedKts !== null ? `${currentWind.speedKts.toFixed(1)} kts` : 'Cargando viento…' }}
            </p>
            <p class="muted">
              {{
                currentWind.dirDeg !== null
                  ? `Dirección ${currentDirLabel} (${Math.round(currentWind.dirDeg)}°)`
                  : 'Midiendo dirección en Playa 52'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const scrollTo = (id) => {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const currentWind = ref({ speedKts: null, dirDeg: null })

const currentDirLabel = computed(() => {
  if (currentWind.value.dirDeg === null) return ''
  return degToCompass(currentWind.value.dirDeg)
})

const degToCompass = (deg) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  return dirs[Math.round(deg / 45) % 8]
}

onMounted(async () => {
  try {
    const url =
      'https://api.open-meteo.com/v1/gfs?latitude=-30.9085&longitude=-57.915&current=winddirection_10m,windspeed_10m&timezone=auto&windspeed_unit=kn'

    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()

    currentWind.value = {
      speedKts: data.current?.windspeed_10m ?? null,
      dirDeg: data.current?.winddirection_10m ?? null,
    }
  } catch (err) {
    console.error(err)
  }
})
</script>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 2.25rem;
  align-items: center;
  padding-top: 1.5rem;
  position: relative;
}

.hero > * {
  position: relative;
  z-index: 1;
}

.hero-splash {
  position: absolute;
  inset: -12% -10% auto -8%;
  height: 380px;
  background:
    radial-gradient(circle at 20% 60%, rgba(94, 234, 212, 0.35), transparent 35%),
    radial-gradient(circle at 80% 30%, rgba(56, 189, 248, 0.32), transparent 36%),
    linear-gradient(135deg, rgba(4, 51, 73, 0.6), rgba(4, 30, 56, 0.8));
  filter: blur(18px) saturate(1.15);
  opacity: 0.9;
  border-radius: 50%;
  z-index: 0;
  animation: drift 14s ease-in-out infinite;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.2px;
  margin-bottom: 1rem;
}

h1 {
  font-size: clamp(2.2rem, 3vw, 3rem);
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  text-shadow: 0 12px 28px rgba(3, 10, 24, 0.6);
}

.accent {
  color: #5eead4;
}

.lead {
  color: #e2f3ff;
  max-width: 640px;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}

.hero-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hero-tags span {
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  background: rgba(94, 234, 212, 0.12);
  color: #7df2dd;
  font-weight: 700;
  border: 1px solid rgba(94, 234, 212, 0.35);
  box-shadow: 0 8px 20px rgba(3, 21, 37, 0.4);
  backdrop-filter: blur(6px);
}

.hero-card {
  background: linear-gradient(160deg, rgba(7, 26, 46, 0.8), rgba(4, 14, 32, 0.9)),
    radial-gradient(circle at 20% 10%, rgba(34, 211, 238, 0.18), transparent 50%);
  border: 1px solid rgba(125, 242, 221, 0.25);
  border-radius: 1.5rem;
  box-shadow: 0 18px 60px rgba(2, 10, 24, 0.9);
  overflow: hidden;
  position: relative;
  isolation: isolate;
  backdrop-filter: blur(10px);
}

.card-inner {
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.wind-widget {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 1rem;
  border: 1px solid rgba(94, 234, 212, 0.3);
  background: linear-gradient(145deg, rgba(11, 36, 51, 0.65), rgba(8, 25, 43, 0.9));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.arrow-circle {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 30% 20%, rgba(125, 242, 221, 0.25), rgba(14, 165, 233, 0.12));
  border: 1px solid rgba(125, 242, 221, 0.4);
  color: #7df2dd;
  font-weight: 900;
  font-size: 1.2rem;
  transition: transform 0.4s ease;
  animation: pulse 3s ease-in-out infinite;
}

.wind-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.wind-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #f8fafc;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: #94a3b8;
}

.muted {
  color: #cbd5e1;
  font-size: 0.95rem;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.stat {
  font-size: 1.6rem;
  font-weight: 700;
  color: #e2e8f0;
}

.mini-chip {
  align-self: flex-start;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(94, 234, 212, 0.12);
  color: #5eead4;
  font-weight: 700;
  border: 1px solid rgba(94, 234, 212, 0.35);
  margin-top: 0.5rem;
}

@keyframes drift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(12px, -10px, 0) scale(1.05);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(125, 242, 221, 0.3);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(125, 242, 221, 0.04);
  }
}
</style>
