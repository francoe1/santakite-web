<script setup>
import { computed } from 'vue'
import { useForecastStore } from '@/stores/forecast'
import { buildForecast } from '@/utils/forecast'
import { degToCompass } from '@/utils/wind'

const props = defineProps({ spots: { type: Array, required: true } })
const store = useForecastStore()

const items = computed(() => {
  const live = props.spots.map((spot) => {
    const f = buildForecast(spot, store.entry(spot.id).raw)
    if (!f.current) return `${spot.name} · midiendo viento`
    return `${spot.name} ${Math.round(f.current.speedKts)} kts ${degToCompass(f.current.dirDeg)} · ${f.assessment.label}`
  })
  return [...live, 'Kitesurf entre ríos', 'Respetá la zona de bañistas', 'Si hay duda, no armes']
})
</script>

<template>
  <div class="ticker" role="marquee" aria-label="Viento en vivo en cada spot">
    <div class="track">
      <ul v-for="n in 2" :key="n" :aria-hidden="n === 2">
        <li v-for="(t, i) in items" :key="i"><span class="star">✱</span>{{ t }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.ticker {
  height: var(--ticker-h);
  background: var(--volt); color: var(--ink);
  border-bottom: var(--bw) solid var(--ink);
  overflow: hidden; display: flex; align-items: center;
  font-family: var(--font-mono); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
}
.track { display: flex; width: max-content; animation: slide 38s linear infinite; }
.ticker:hover .track { animation-play-state: paused; }
ul { display: flex; flex: none; }
li { white-space: nowrap; padding-right: 28px; }
.star { margin-right: 28px; }
@keyframes slide { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .track { animation: none; } }
</style>
