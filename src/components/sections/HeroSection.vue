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
}

.accent {
  color: #38bdf8;
}

.lead {
  color: #e2e8f0;
  max-width: 620px;
  margin-bottom: 1.5rem;
}

.hero-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hero-tags span {
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  background: rgba(14, 165, 233, 0.1);
  color: #7dd3fc;
  font-weight: 600;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.hero-card {
  background: radial-gradient(circle at 30% 0, rgba(56, 189, 248, 0.2), rgba(37, 99, 235, 0.1)),
    linear-gradient(160deg, #0b1224, #0b1729);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 1.4rem;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.85);
  overflow: hidden;
  position: relative;
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
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.6);
}

.arrow-circle {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #7dd3fc;
  font-weight: 900;
  font-size: 1.2rem;
  transition: transform 0.2s ease;
}

.wind-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.wind-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #e2e8f0;
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
  background: rgba(14, 165, 233, 0.1);
  color: #38bdf8;
  font-weight: 600;
  border: 1px solid rgba(56, 189, 248, 0.35);
  margin-top: 0.5rem;
}
</style>
