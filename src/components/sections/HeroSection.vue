<template>
  <section id="hero" class="hero">
    <div class="hero-splash" aria-hidden="true"></div>
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
  gap: 2.4rem;
  align-items: center;
  padding-top: 2rem;
  position: relative;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), rgba(226, 245, 246, 0.6));
  border-radius: 28px;
  padding: 2.4rem;
  overflow: hidden;
  box-shadow: 0 28px 60px rgba(11, 65, 92, 0.14);
}

.hero > * {
  position: relative;
  z-index: 1;
}

.hero-splash {
  position: absolute;
  inset: -12% -10% auto -8%;
  height: 420px;
  background:
    radial-gradient(circle at 20% 60%, rgba(0, 186, 199, 0.16), transparent 35%),
    radial-gradient(circle at 80% 30%, rgba(241, 91, 181, 0.16), transparent 32%),
    url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80') center/cover;
  filter: blur(10px) saturate(1.1);
  opacity: 0.8;
  border-radius: 50%;
  z-index: 0;
  animation: drift 14s ease-in-out infinite;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 1.6rem;
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(15, 76, 92, 0.1);
  border: 1px solid rgba(15, 76, 92, 0.2);
  color: #0f4c5c;
  font-weight: 700;
  letter-spacing: 0.2px;
  margin-bottom: 1rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

h1 {
  font-size: clamp(2.3rem, 3.2vw, 3.2rem);
  line-height: 1.05;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  color: #0b1f2a;
}

.accent {
  color: #fb8500;
}

.lead {
  color: #0f4c5c;
  max-width: 640px;
  margin-bottom: 1.4rem;
  font-size: 1.08rem;
}

.hero-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.hero-tags span {
  border-radius: 999px;
  padding: 0.42rem 0.95rem;
  background: rgba(0, 186, 199, 0.12);
  color: #0b2f3f;
  font-weight: 800;
  border: 1px solid rgba(0, 186, 199, 0.4);
  box-shadow: 0 10px 24px rgba(11, 76, 92, 0.1);
  backdrop-filter: blur(6px);
}

.hero-actions {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin-top: 0.8rem;
}

.primary,
.ghost {
  border: none;
  border-radius: 14px;
  padding: 0.75rem 1.3rem;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-size: 0.98rem;
}

.primary {
  background: linear-gradient(120deg, #009fb7, #00c2cb);
  color: #fdfefc;
  box-shadow: 0 14px 32px rgba(0, 155, 183, 0.28);
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(0, 155, 183, 0.32);
}

.ghost {
  background: rgba(15, 76, 92, 0.08);
  color: #0b2f3f;
  border: 1px solid rgba(11, 65, 92, 0.14);
  box-shadow: 0 10px 24px rgba(15, 76, 92, 0.12);
}

.ghost:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(11, 65, 92, 0.18);
}

.hero-card {
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.86)),
    url('https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=900&q=80') center/cover;
  border: 1px solid rgba(11, 65, 92, 0.18);
  border-radius: 20px;
  box-shadow: 0 22px 50px rgba(11, 65, 92, 0.18);
  overflow: hidden;
  position: relative;
  isolation: isolate;
  backdrop-filter: blur(12px);
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
  border-radius: 14px;
  border: 1px solid rgba(0, 186, 199, 0.22);
  background: linear-gradient(145deg, rgba(0, 186, 199, 0.08), rgba(11, 65, 92, 0.05));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.arrow-circle {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 30% 20%, rgba(0, 186, 199, 0.22), rgba(0, 155, 183, 0.18));
  border: 1px solid rgba(0, 155, 183, 0.45);
  color: #0b2f3f;
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
  border-radius: 999px;
  background: rgba(251, 133, 0, 0.12);
  color: #c05621;
  font-weight: 800;
  border: 1px solid rgba(251, 133, 0, 0.35);
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
    box-shadow: 0 0 0 0 rgba(0, 155, 183, 0.18);
  }
  50% {
    box-shadow: 0 0 0 14px rgba(0, 155, 183, 0.06);
  }
}
</style>
