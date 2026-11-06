<script setup>
import { computed } from 'vue'
import Icon from '../ui/Icon.vue'
import StatusPill from '../ui/StatusPill.vue'
import { buildForecast } from '@/utils/forecast'
import { degToCompass } from '@/utils/wind'
import { useForecastStore } from '@/stores/forecast'
import spotsData from '@/data/spots.json'
import { scrollToId } from '@/composables/useScrollSpy'

const props = defineProps({
  spots: { type: Array, required: true },
  currentId: { type: String, default: null },
})
defineEmits(['select'])

const store = useForecastStore()
const total = spotsData.length

const rows = computed(() =>
  props.spots
    .map((spot) => {
      const entry = store.entry(spot.id)
      const f = buildForecast(spot, entry.raw)
      return { spot, status: entry.status, f }
    })
    .map((r, _, all) => ({ ...r, loading: r.status === 'loading' || r.status === 'idle' }))
)

const ranked = computed(() => {
  const best = [...rows.value].filter((r) => r.f.today).sort((a, b) => b.f.today.score - a.f.today.score)[0]
  return best && best.f.today.playableCount > 0 ? best.spot.id : null
})
</script>

<template>
  <section id="hoy-spots" class="section picker">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">[02] Hoy en cada spot</p>
        <h2 class="section-title">¿Dónde se<br />navega hoy?</h2>
        <p class="section-lead">
          Comparamos el viento de los spots más cercanos con el criterio propio de cada uno: dirección ideal (cuando está confirmada), mínimo de nudos, lluvia y luz solar.
        </p>
      </div>

      <router-link to="/mapa" class="btn btn--dark allmap">Ver los {{ total }} spots en el mapa</router-link>
      <ul class="cards">
        <li v-for="r in rows" :key="r.spot.id">
          <button
            type="button"
            class="card"
            :class="{ on: r.spot.id === currentId, best: r.spot.id === ranked }"
            :aria-pressed="r.spot.id === currentId"
            @click="$emit('select', r.spot.id); scrollToId('hoy')"
          >
            <span v-if="r.spot.id === ranked" class="ribbon hand">¡la mejor!</span>
            <span class="loc">{{ r.spot.location }} · {{ r.spot.countryName }}</span>
            <strong class="name">{{ r.spot.name }}</strong>

            <template v-if="r.loading && !r.f.today">
              <span class="sk"></span><span class="sk short"></span>
            </template>
            <template v-else-if="r.f.today">
              <span class="now mono">
                {{ r.f.current ? Math.round(r.f.current.speedKts) : '–' }}<small>kts</small>
                <em v-if="r.f.current">{{ degToCompass(r.f.current.dirDeg) }}</em>
              </span>
              <span class="win">
                <Icon name="clock" :size="16" />
                <template v-if="r.f.today.window">{{ r.f.today.window.label }}</template>
                <template v-else>Sin ventana hoy</template>
              </span>
              <span class="foot">
                <StatusPill :tone="r.f.assessment.tone === 'muted' ? 'muted' : r.f.assessment.tone" class="pill-l">{{ r.f.assessment.label }}</StatusPill>
                <Icon name="arrow" :size="20" class="go" />
              </span>
            </template>
            <span v-else class="err">Sin datos</span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.picker { background: var(--paper); }
.allmap { margin: -24px 0 28px; }
.cards { display: grid; gap: 22px; }
.card {
  position: relative; width: 100%; min-height: 200px; display: flex; flex-direction: column; align-items: flex-start; gap: 8px; text-align: left; padding: 20px;
  background: var(--paper); border: var(--bw) solid var(--ink); box-shadow: var(--shadow);
  transition: transform 0.12s, box-shadow 0.12s;
}
.card:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 var(--ink); }
.card.on { background: var(--paper-2); }
.card.best { background: var(--volt); }
.ribbon { position: absolute; top: -18px; right: 14px; padding: 4px 14px; font-size: 1.2rem; background: var(--ink); color: var(--volt); transform: rotate(4deg); }
.loc { font-family: var(--font-mono); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.name { font-family: var(--font-display); font-weight: 400; font-size: 2.6rem; line-height: 0.9; text-transform: uppercase; }
.now { font-family: var(--font-display); font-size: 4.4rem; line-height: 0.9; margin-top: 6px; }
.now small { font-family: var(--font-mono); font-size: 0.24em; margin-left: 6px; font-weight: 700; }
.now em { font-style: normal; font-family: var(--font-mono); font-size: 0.26em; font-weight: 700; margin-left: 12px; padding: 2px 8px; border: var(--bw) solid var(--ink); vertical-align: middle; }
.win { display: inline-flex; gap: 8px; align-items: center; font-family: var(--font-mono); font-size: 13px; font-weight: 700; }
.foot { display: flex; align-items: center; justify-content: space-between; width: 100%; margin-top: auto; padding-top: 10px; }
.go { transition: transform 0.15s; }
.card:hover .go { transform: translateX(6px); }
.sk { width: 70%; height: 40px; background: var(--paper-3); animation: pulse 1s steps(2) infinite; }
.sk.short { width: 45%; height: 20px; }
@keyframes pulse { 50% { opacity: 0.4; } }
@media (min-width: 768px) { .cards { grid-template-columns: repeat(3, 1fr); gap: 32px; } }
@media (min-width: 1024px) { .card { min-height: 300px; padding: 28px; } .name { font-size: 3.4rem; } .now { font-size: 6rem; } }
</style>
