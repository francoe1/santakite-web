<template>
  <section id="hero" class="hero">
    <div class="hero-copy">
      <p class="badge">Santa Ana · Río Uruguay</p>
      <h1>
        Kitesurf libre con vibra surfer
        <span class="accent">en Playa 52</span>
      </h1>
      <p class="lead">
        Amanecé con brisa limpia, armá tu cometa sobre arena suave y navegá con vista abierta al río. Zona chill con música
        baja, mates, y comunidad que respeta el mar y el viento.
      </p>
      <div class="hero-tags" aria-label="Destacados">
        <span>Vientos S · SE · E</span>
        <span>Zonas separadas</span>
        <span>Pronóstico GFS</span>
      </div>
      <div class="hero-actions">
        <button type="button" class="primary" @click="scrollTo('mapa')">Ver mapa &amp; viento</button>
        <a class="ghost" href="https://wa.me/543456479677" target="_blank" rel="noreferrer">Coordinar sesión</a>
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
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
  padding: 2rem;
  background: #ffffff;
  border: 1px solid #dfe7ec;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 1.4rem;
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  background: #e7f1f5;
  border: 1px solid #d7e2e8;
  color: #0f4c5c;
  font-weight: 700;
  letter-spacing: 0.2px;
  margin-bottom: 1rem;
}

h1 {
  font-size: clamp(2.2rem, 3vw, 3rem);
  line-height: 1.05;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
  color: #0b1f2a;
}

.accent {
  color: #0f4c5c;
}

.lead {
  color: #0f4c5c;
  max-width: 640px;
  margin-bottom: 1.4rem;
  font-size: 1.06rem;
}

.hero-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.hero-tags span {
  padding: 0.42rem 0.95rem;
  background: #f4f7f9;
  color: #0b2f3f;
  font-weight: 800;
  border: 1px solid #d7e0e4;
}

.hero-actions {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin-top: 0.8rem;
}

.primary,
.ghost {
  border: 1px solid #0f4c5c;
  padding: 0.75rem 1.3rem;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
  font-size: 0.98rem;

}

.primary {
  background: #0f4c5c;
  color: #f6fbfd;
}

.primary:hover {
  background: #093544;
}

.ghost {
  background: #ffffff;
  color: #0b2f3f;
  border-color: #d7e0e4;
}

.ghost:hover {
  background: #f4f7f9;
}

.hero-card {
  background: #f9fcfd;
  border: 1px solid #dfe7ec;
  display: flex;
  flex-direction: column;
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
  padding: 0.85rem;
  border: 1px solid #c7d6dc;
  background: #eef4f6;

}

.arrow-circle {
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  background: #0f4c5c;
  color: #f6fbfd;
  font-weight: 900;
  font-size: 1.2rem;
}

.wind-data {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.wind-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0b1f2a;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: #0f4c5c;
}

.muted {
  color: #0f4c5c;
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
  color: #0f2f3f;
}

.mini-chip {
  align-self: flex-start;
  padding: 0.38rem 0.78rem;
  background: #fff9ef;
  color: #c05621;
  font-weight: 800;
  border: 1px solid #f4d4a3;
  margin-top: 0.5rem;
}
</style>
