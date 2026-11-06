<script setup>
import { computed } from 'vue'
import Icon from '../ui/Icon.vue'
import StatusPill from '../ui/StatusPill.vue'
import { buildForecast } from '@/utils/forecast'
import { degToCompass } from '@/utils/wind'
import { useForecastStore } from '@/stores/forecast'
import { scrollToId } from '@/composables/useScrollSpy'

const props = defineProps({
  spots: { type: Array, required: true },
  currentId: { type: String, default: null },
})
defineEmits(['select'])

const store = useForecastStore()

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
        <p class="eyebrow">Hoy en cada spot</p>
        <h2 class="section-title">¿Dónde se navega hoy?</h2>
        <p class="section-lead">
          Comparamos el viento de los tres spots con el criterio propio de cada uno: dirección ideal, mínimo de nudos, lluvia y luz solar.
        </p>
      </div>

      <ul class="cards">
        <li v-for="r in rows" :key="r.spot.id">
          <button
            type="button"
            class="card"
            :class="{ on: r.spot.id === currentId, best: r.spot.id === ranked }"
            :aria-pressed="r.spot.id === currentId"
            @click="$emit('select', r.spot.id); scrollToId('hoy')"
          >
            <span v-if="r.spot.id === ranked" class="ribbon">Mejor opción hoy</span>
            <span class="loc">{{ r.spot.location }}</span>
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
.picker {
  background: var(--sand-50);
  padding-top: 24px;
}
.cards {
  display: grid;
  gap: 14px;
}
.card {
  position: relative;
  width: 100%;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  text-align: left;
  padding: 22px;
  border-radius: var(--r-lg);
  background: #fff;
  border: 1.5px solid var(--sand-line);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-1);
  border-color: var(--ink-700);
}
.card.on {
  border-color: var(--ink-900);
}
.card.best {
  background: var(--ink-900);
  color: var(--text-inv);
  border-color: var(--ink-900);
}
.ribbon {
  position: absolute;
  top: 18px;
  right: 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 99px;
  background: var(--sun-500);
  color: #fff;
}
.loc {
  font-size: 13px;
  color: var(--text-soft);
}
.card.best .loc { color: var(--text-inv-soft); }
.name {
  font-family: var(--font-display);
  font-size: 1.7rem;
  line-height: 1;
}
.now {
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1;
  margin-top: 6px;
}
.now small {
  font-size: 0.35em;
  margin-left: 4px;
  font-weight: 500;
  opacity: 0.7;
}
.now em {
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 0.4em;
  margin-left: 10px;
  padding: 3px 9px;
  border-radius: 99px;
  background: rgba(7, 32, 45, 0.08);
  vertical-align: middle;
}
.card.best .now em { background: rgba(255, 255, 255, 0.14); }
.win {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  font-family: var(--font-mono);
}
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
  padding-top: 6px;
}
.go {
  transition: transform 0.2s;
}
.card:hover .go { transform: translateX(6px); }
/* Pills sobre fondo claro: variantes más oscuras */
.card:not(.best) :deep(.pill--ok) { color: #0b6e47; background: #e4f7ee; }
.card:not(.best) :deep(.pill--warn) { color: #8a5c00; background: #fff4d6; }
.card:not(.best) :deep(.pill--muted) { color: var(--text-soft); background: var(--sand-100); border-color: var(--sand-line); }
.sk {
  width: 70%;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(90deg, var(--sand-100), var(--sand-200), var(--sand-100));
  background-size: 200% 100%;
  animation: sh 1.4s infinite;
}
.sk.short { width: 45%; height: 18px; }
@keyframes sh { to { background-position: -200% 0; } }

@media (min-width: 768px) {
  .cards { grid-template-columns: repeat(3, 1fr); gap: 20px; }
}
@media (min-width: 1024px) {
  .picker { padding-top: 72px; }
  .card { min-height: 260px; padding: 30px; }
  .name { font-size: 2.1rem; }
}
</style>
