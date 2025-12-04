<template>
  <section id="hero" class="hero">
    <div class="hero-copy">
      <p class="badge">{{ spot.hero?.badge }}</p>
      <h1>
        {{ spot.hero?.title }} <span class="accent">{{ spot.hero?.accent }}</span>
      </h1>
      <p class="lead">
        {{ spot.hero?.lead }}
      </p>
      <div class="hero-tags" aria-label="Destacados">
        <span v-for="tag in spot.hero?.tags" :key="tag">{{ tag }}</span>
      </div>
      <div class="hero-actions">
        <button type="button" class="primary" @click="scrollTo('mapa')">Ver mapa &amp; viento</button>
      </div>
    </div>
    <div class="hero-card" role="presentation">
      <div class="card-inner">
        <div class="wind-widget">
          <div
            class="arrow-circle"
            :style="normalizedDirDeg !== null ? { transform: `rotate(${(normalizedDirDeg + 180) % 360}deg)` } : {}"
          >
            ↑
          </div>
          <div class="wind-data">
            <p class="wind-value">
              {{ currentWind.speedKts !== null ? `${currentWind.speedKts.toFixed(1)} kts` : 'Cargando viento…' }}
            </p>
            <p class="muted">
              {{
                normalizedDirDeg !== null
                  ? `Dirección ${currentDirLabel} (${Math.round(normalizedDirDeg)}°)`
                  : windFallback
              }}
            </p>
            <div class="mood-chip" :class="`tone-${currentMood.tone}`" role="status">
              <span class="emoji" aria-hidden="true">{{ currentMood.emoji }}</span>
              <span class="label">{{ currentMood.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

import {
  buildPreferredDirectionSet,
  degToCompass,
  getDirectionOffset,
  normalizeDegrees,
} from '../../utils/wind'

const props = defineProps({
  spot: {
    type: Object,
    required: true,
  },
})

const scrollTo = (id) => {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const currentWind = ref({ speedKts: null, dirDeg: null })
const windFallback = computed(() => `Midiendo dirección en ${props.spot.name}`)

const baseWindConfig = {
  preferredDirections: ['S', 'SE', 'E'],
  minPlayableKts: 12,
  directionReference: 'N',
}

const windConfig = computed(() => {
  const configFromSpot = props.spot.forecast || {}

  return {
    ...baseWindConfig,
    ...configFromSpot,
    preferredDirections:
      configFromSpot.preferredDirections?.length > 0
        ? configFromSpot.preferredDirections
        : baseWindConfig.preferredDirections,
    directionReference: configFromSpot.directionReference || baseWindConfig.directionReference,
  }
})

const preferredDirectionSet = computed(() => {
  const set = buildPreferredDirectionSet(windConfig.value.preferredDirections)
  if (set.size === 0) return buildPreferredDirectionSet(baseWindConfig.preferredDirections)
  return set
})
const directionOffsetDeg = computed(() => getDirectionOffset(windConfig.value.directionReference))

const windApiUrl = computed(() => {
  const { latitude, longitude } = props.spot.wind || {}
  if (latitude == null || longitude == null) return null

  // Open-Meteo winddirection_10m usa convención meteorológica: 0° = viento desde el norte.
  return `https://api.open-meteo.com/v1/gfs?latitude=${latitude}&longitude=${longitude}&current=winddirection_10m,windspeed_10m&timezone=auto&windspeed_unit=kn`
})

const normalizedDirDeg = computed(() =>
  currentWind.value.dirDeg === null
    ? null
    : normalizeDegrees(currentWind.value.dirDeg - directionOffsetDeg.value)
)

const currentDirLabel = computed(() => {
  if (normalizedDirDeg.value === null) return ''
  return degToCompass(normalizedDirDeg.value)
})

const currentMood = computed(() => {
  if (currentWind.value.speedKts === null || normalizedDirDeg.value === null) {
    return { emoji: '🛰️', label: 'Midiendo viento local…', tone: 'muted' }
  }

  const matchesDirection = preferredDirectionSet.value.has(degToCompass(normalizedDirDeg.value))
  const speed = currentWind.value.speedKts
  const delta = speed - windConfig.value.minPlayableKts
  const speedScore = Math.max(Math.min(delta / 6, 1), -0.5)
  const weightedScore = Math.min(Math.max(speedScore + (matchesDirection ? 0.5 : -0.5), -0.5), 1)

  if (matchesDirection && speed >= windConfig.value.minPlayableKts) {
    return { emoji: '🏄‍♂️', label: 'Navegable ahora', tone: 'ok', score: weightedScore }
  }

  if (matchesDirection && speed >= windConfig.value.minPlayableKts - 2) {
    return { emoji: '🤞', label: 'Casi jugable', tone: 'warn', score: weightedScore }
  }

  if (speed >= windConfig.value.minPlayableKts) {
    return { emoji: '🌬️', label: 'Viento cruzado', tone: 'warn', score: weightedScore }
  }

  return { emoji: '😴', label: 'Esperando viento útil', tone: 'muted', score: weightedScore }
})

const fetchWind = async () => {
  if (!windApiUrl.value) return
  try {
    const response = await fetch(windApiUrl.value)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()

    currentWind.value = {
      speedKts: data.current?.windspeed_10m ?? null,
      dirDeg: data.current?.winddirection_10m ?? null,
    }
  } catch (err) {
    console.error(err)
  }
}

onMounted(fetchWind)

watch(windApiUrl, () => {
  fetchWind()
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

.mood-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.65rem;
  border: 1px solid #c7d6dc;
  background: #fff;
  font-weight: 800;
  width: fit-content;
}

.mood-chip .emoji {
  font-size: 1.05rem;
}

.tone-ok {
  border-color: #22c55e;
  color: #0f5132;
  background: #ecfdf3;
}

.tone-warn {
  border-color: #f59e0b;
  color: #7c2d12;
  background: #fffbeb;
}

.tone-muted {
  border-color: #cbd5e1;
  color: #0b2f3f;
  background: #f8fafc;
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
