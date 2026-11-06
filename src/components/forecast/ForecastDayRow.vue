<script setup>
import { computed } from 'vue'
import Icon from '../ui/Icon.vue'
import HeatStrip from './HeatStrip.vue'
import { dayNumber, monthShort, weekdayShort, formatKts } from '@/utils/forecast'

const props = defineProps({
  day: { type: Object, required: true },
  isToday: { type: Boolean, default: false },
  nowHour: { type: Number, default: null },
  isBest: { type: Boolean, default: false },
})
defineEmits(['select'])

const label = computed(() =>
  props.isToday ? 'Hoy' : weekdayShort(props.day.date)
)
</script>

<template>
  <button type="button" class="row" :class="[`r-${day.rating}`, { today: isToday }]" @click="$emit('select', day)"
    :aria-label="`${label} ${dayNumber(day.date)} de ${monthShort(day.date)}: ${day.ratingInfo.label}. Ver detalle por hora.`">
    <span class="date">
      <b class="wd">{{ label }}</b>
      <span class="dn mono">{{ dayNumber(day.date) }} {{ monthShort(day.date) }}</span>
      <span v-if="isBest" class="best">Mejor día</span>
    </span>

    <span class="heat">
      <HeatStrip :day="day" :now-hour="isToday ? nowHour : null" />
      <span class="axis mono" aria-hidden="true"><i>6h</i><i>12h</i><i>18h</i><i>21h</i></span>
    </span>

    <span class="metrics">
      <span class="m"><small>Viento</small><b class="mono">{{ formatKts(day.avgKts) }}<em>kts</em></b></span>
      <span class="m"><small>Ráfaga</small><b class="mono">{{ formatKts(day.maxGustKts) }}<em>kts</em></b></span>
      <span class="m"><small>Dir.</small><b class="mono">{{ day.mainDir ?? '–' }}</b></span>
      <span class="m win"><small>Ventana</small><b class="mono">{{ day.window ? day.window.label : 'Sin ventana' }}</b></span>
    </span>

    <span class="badge">
      <span class="rate">{{ day.ratingInfo.short }}</span>
      <Icon name="arrow" :size="18" class="go" />
    </span>
  </button>
</template>

<style scoped>
.row {
  --accent: var(--text-inv-soft);
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'date badge'
    'heat heat'
    'metrics metrics';
  gap: 14px 12px;
  text-align: left;
  padding: 18px;
  border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--ink-line);
  border-left: 4px solid var(--accent);
  color: var(--text-inv);
  transition: background 0.2s, transform 0.2s, border-color 0.2s;
}
.row:hover { background: rgba(255, 255, 255, 0.09); }
.r-good { --accent: #17a56f; }
.r-ok { --accent: #4cc590; }
.r-marginal { --accent: #e3a417; }
.r-bad { --accent: #46606f; }
.r-bad .rate { opacity: 0.7; }
.today { background: rgba(255, 106, 61, 0.08); border-color: rgba(255, 106, 61, 0.35); border-left-color: var(--accent); }

.date { grid-area: date; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.wd { font-family: var(--font-display); font-size: 1.5rem; text-transform: capitalize; letter-spacing: -0.02em; }
.dn { font-size: 13px; color: var(--text-inv-soft); text-transform: uppercase; }
.best {
  font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
  padding: 3px 8px; border-radius: 99px; background: var(--sun-500); color: #fff;
}
.heat { grid-area: heat; display: grid; gap: 6px; }
.axis { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-inv-soft); font-style: normal; }
.axis i { font-style: normal; }
.metrics { grid-area: metrics; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.m { display: grid; gap: 2px; }
.m small { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-inv-soft); }
.m b { font-size: 1.05rem; }
.m em { font-style: normal; font-size: 0.7em; margin-left: 3px; color: var(--text-inv-soft); font-weight: 500; }
.m.win { grid-column: 1 / -1; padding-top: 10px; border-top: 1px dashed var(--ink-line); grid-template-columns: auto 1fr; gap: 12px; align-items: baseline; }
.badge { grid-area: badge; display: inline-flex; align-items: center; gap: 8px; align-self: start; }
.rate {
  font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 99px; color: #fff;
  background: color-mix(in srgb, var(--accent) 35%, transparent);
  border: 1px solid var(--accent);
}
.go { color: var(--text-inv-soft); transition: transform 0.2s; }
.row:hover .go { transform: translateX(4px); color: #fff; }

/* ---- Desktop: fila tipo tabla ---- */
@media (min-width: 1024px) {
  .row {
    grid-template-columns: 150px minmax(280px, 1fr) minmax(0, 1.15fr) 150px;
    grid-template-areas: 'date heat metrics badge';
    align-items: center;
    gap: 32px;
    padding: 18px 28px 18px 24px;
  }
  .row:hover { transform: translateX(6px); }
  .date { flex-direction: column; gap: 2px; align-items: flex-start; }
  .metrics { grid-template-columns: 0.7fr 0.7fr 0.55fr 1.6fr; gap: 16px; }
  .m.win { grid-column: auto; padding: 0; border: 0; grid-template-columns: 1fr; gap: 2px; }
  .badge { justify-content: space-between; width: 100%; }
}
</style>
