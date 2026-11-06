<script setup>
import { computed, ref } from 'vue'
import Icon from '../ui/Icon.vue'
import ForecastDayRow from '../forecast/ForecastDayRow.vue'
import ForecastDetail from '../forecast/ForecastDetail.vue'
import { formatDay, levelLabel } from '@/utils/forecast'

const props = defineProps({
  spot: { type: Object, required: true },
  forecast: { type: Object, required: true },
  status: { type: String, default: 'idle' },
  error: { type: String, default: '' },
  fetchedAt: { type: Number, default: 0 },
})
defineEmits(['reload'])

const selected = ref(null)

const days = computed(() => props.forecast.days)
const loading = computed(() => (props.status === 'loading' || props.status === 'idle') && !days.value.length)
const best = computed(() => [...days.value].filter((d) => d.window).sort((a, b) => b.score - a.score)[0] ?? null)
const goodDays = computed(() => days.value.filter((d) => d.rating === 'good' || d.rating === 'ok').length)
const nowHour = computed(() => {
  const t = props.forecast.current?.time
  return t ? Number.parseInt(t.slice(11, 13), 10) : null
})

const criteria = computed(() => props.spot.forecast?.criteriaText)
</script>

<template>
  <section id="pronostico" class="section section--dark">
    <div class="container">
      <div class="head">
        <div class="section-head">
          <p class="eyebrow">Pronóstico 7 días · GFS</p>
          <h2 class="section-title">¿Cuándo se navega?</h2>
          <p class="section-lead">{{ criteria }}</p>
        </div>
        <button type="button" class="btn btn--ghost btn--sm reload" :disabled="status === 'loading'" @click="$emit('reload')">
          <Icon name="refresh" :size="16" />Actualizar
        </button>
      </div>

      <div v-if="best" class="summary">
        <div class="s-main">
          <small>Mejor día de la semana</small>
          <strong>{{ formatDay(best.date, { weekday: 'long', day: 'numeric', month: 'long' }) }}</strong>
          <span class="mono">{{ best.window.label }} · {{ best.window.hours }} h · {{ levelLabel(best.best?.assess.level ?? 0) }}</span>
        </div>
        <div class="s-stat"><b class="mono">{{ goodDays }}</b><span>de {{ days.length }} días con buena ventana</span></div>
        <button type="button" class="btn btn--primary btn--sm" @click="selected = best">Ver detalle <Icon name="arrow" :size="16" /></button>
      </div>
      <div v-else-if="days.length" class="summary calm">
        <div class="s-main">
          <small>Semana tranquila</small>
          <strong>Sin ventanas navegables en los próximos días</strong>
          <span>Probá otro spot desde el selector: cada uno trabaja con distinta dirección de viento.</span>
        </div>
      </div>

      <div class="key" aria-label="Referencias del gráfico">
        <span><i class="k lv0"></i>No navegable</span>
        <span><i class="k lv1"></i>Justo</span>
        <span><i class="k lv2"></i>Bueno</span>
        <span><i class="k lv3"></i>Muy bueno</span>
        <span><i class="k lv4"></i>Ideal</span>
        <span class="alt">Las barras muestran el viento de cada hora (6 a 21 h).</span>
      </div>

      <ul v-if="days.length" class="list">
        <li v-for="(d, i) in days" :key="d.date">
          <ForecastDayRow :day="d" :is-today="i === 0" :now-hour="nowHour" :is-best="best?.date === d.date" @select="selected = $event" />
        </li>
      </ul>
      <ul v-else-if="loading" class="list" aria-busy="true">
        <li v-for="n in 7" :key="n" class="sk"></li>
      </ul>
      <div v-else class="fail">
        <Icon name="alert" :size="28" />
        <p>{{ error || 'No hay datos de pronóstico.' }}</p>
        <button type="button" class="btn btn--primary btn--sm" @click="$emit('reload')">Reintentar</button>
      </div>

      <p class="foot">Pronóstico del modelo GFS (Open-Meteo). Es una estimación: antes de armar, confirmá el viento real en la orilla.</p>
    </div>

    <ForecastDetail :day="selected" :cfg="forecast.cfg" :detail-text="spot.forecast?.detailText" @close="selected = null" />
  </section>
</template>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}
.reload { display: none; }
.summary {
  display: grid;
  gap: 16px;
  padding: 22px;
  margin-bottom: 20px;
  border-radius: var(--r-lg);
  background: linear-gradient(135deg, rgba(255, 106, 61, 0.22), rgba(255, 106, 61, 0.06));
  border: 1px solid rgba(255, 106, 61, 0.4);
}
.summary.calm { background: rgba(255, 255, 255, 0.05); border-color: var(--ink-line); }
.s-main { display: grid; gap: 4px; }
.s-main small { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--sun-500); }
.s-main strong { font-family: var(--font-display); font-size: 1.6rem; line-height: 1.1; text-transform: capitalize; }
.s-main span { font-size: 14px; color: var(--text-inv-soft); }
.s-stat { display: flex; align-items: baseline; gap: 10px; font-size: 14px; color: var(--text-inv-soft); }
.s-stat b { font-family: var(--font-display); font-size: 2.2rem; color: #fff; }
.key { display: flex; flex-wrap: wrap; gap: 8px 16px; margin-bottom: 16px; font-size: 12px; color: var(--text-inv-soft); }
.key span { display: inline-flex; align-items: center; gap: 6px; }
.key .alt { flex-basis: 100%; }
.k { width: 12px; height: 12px; border-radius: 3px; background: rgba(157, 185, 198, 0.4); }
.k.lv1 { background: #8fd8b8; } .k.lv2 { background: #4cc590; } .k.lv3 { background: #17a56f; } .k.lv4 { background: #0f8758; }
.list { display: grid; gap: 12px; }
.sk { height: 176px; border-radius: var(--r-md); background: linear-gradient(90deg, rgba(255,255,255,.04), rgba(255,255,255,.1), rgba(255,255,255,.04)); background-size: 200% 100%; animation: sh 1.4s infinite; }
@keyframes sh { to { background-position: -200% 0; } }
.fail { display: grid; justify-items: center; gap: 14px; padding: 48px 16px; text-align: center; color: var(--text-inv-soft); }
.foot { margin-top: 24px; font-size: 13px; color: var(--text-inv-soft); }

@media (min-width: 1024px) {
  .reload { display: inline-flex; margin-top: 56px; }
  .summary { grid-template-columns: 1fr auto auto; align-items: center; gap: 40px; padding: 28px 36px; margin-bottom: 28px; }
  .s-main strong { font-size: 2.2rem; }
  .key { justify-content: flex-start; }
  .key .alt { flex-basis: auto; margin-left: auto; }
  .list { gap: 10px; }
  .sk { height: 84px; }
}
</style>
