<template>
  <section id="hero" class="hero">
    <div class="hero-copy">
      <p class="badge">Santa Ana · Entre Ríos</p>
      <h1>
        Spot de kitesurf accesible y ordenado
        <span class="accent">en Playa 52</span>
      </h1>
      <p class="lead">
        Información clara del spot, zonas sugeridas y pronóstico GFS para decidir rápido si se puede navegar.
      </p>
      <div class="hero-tags" aria-label="Destacados">
        <span>Vientos S · SE · E</span>
        <span>Zonas separadas</span>
        <span>Pronóstico GFS</span>
      </div>
    </div>
    <div class="hero-viz">
      <div class="wind-widget-container">
        <div class="wind-widget">
          <div
            class="arrow-circle"
            :style="currentWind.dirDeg !== null ? { transform: `rotate(${(currentWind.dirDeg + 180) % 360}deg)` } : {}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-send"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </div>
          <div class="wind-data">
            <p class="wind-value">
              {{ currentWind.speedKts !== null ? `${currentWind.speedKts.toFixed(1)} kts` : 'Cargando…' }}
            </p>
            <p class="muted">
              {{
                currentWind.dirDeg !== null
                  ? `Dirección ${currentDirLabel} (${Math.round(currentWind.dirDeg)}°)`
                  : 'Midiendo…'
              }}
            </p>
          </div>
        </div>
      </div>
      <svg class="viz-svg" viewBox="0 0 514 266" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 266V0H514V266H0Z" fill="url(#paint0_linear_1_2)" />
        <path d="M0 266V152.5H514V266H0Z" fill="url(#paint1_linear_1_2)" />
        <defs>
          <linearGradient
            id="paint0_linear_1_2"
            x1="257"
            y1="0"
            x2="257"
            y2="266"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#38BDF8" />
            <stop offset="1" stop-color="#0EA5E9" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1_2"
            x1="257"
            y1="152.5"
            x2="257"
            y2="266"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#F5F9FF" />
            <stop offset="1" stop-color="#E0F2FE" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

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
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 2.25rem;
  align-items: center;
  padding-top: 2.5rem;
  min-height: 500px;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-top: 1rem;
  }
  .hero-viz {
    margin-top: 1rem;
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background-color: var(--sky-100);
  border: 1px solid var(--sky-200);
  color: var(--sky-700);
  font-weight: 600;
  letter-spacing: 0.2px;
  margin-bottom: 1rem;
}

h1 {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.accent {
  color: var(--sky-600);
}

.lead {
  color: var(--slate-600);
  max-width: 580px;
  margin-bottom: 1.75rem;
  font-size: 1.1rem;
}

.hero-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hero-tags span {
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  background-color: var(--sky-100);
  color: var(--sky-800);
  font-weight: 600;
  border: 1px solid var(--sky-200);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.hero-viz {
  position: relative;
  min-height: 266px;
}

.viz-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(12, 74, 110, 0.2);
}

.wind-widget-container {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.wind-widget {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.arrow-circle {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: white;
  border: 1px solid var(--slate-200);
  color: var(--sky-600);
  font-weight: 900;
  font-size: 1.2rem;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.wind-data {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.wind-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--slate-800);
}

.muted {
  color: var(--slate-600);
  font-size: 0.95rem;
}
</style>
