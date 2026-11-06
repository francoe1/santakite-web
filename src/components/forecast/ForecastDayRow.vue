<script setup>
import { computed } from 'vue'
import Icon from '../ui/Icon.vue'
import HeatStrip from './HeatStrip.vue'
import { dayNumber, isWeekend, monthShort, weekdayShort, formatKts } from '@/utils/forecast'

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
  <button type="button" class="row" :class="[`r-${day.rating}`, { today: isToday, weekend: isWeekend(day.date), compact: day.rating === 'bad' }]" @click="$emit('select', day)"
    :aria-label="`${label} ${dayNumber(day.date)} de ${monthShort(day.date)}: ${day.ratingInfo.label}. Ver detalle por hora.`">
    <span class="date">
      <b class="wd">{{ label }}</b>
      <span class="dn mono">{{ dayNumber(day.date) }} {{ monthShort(day.date) }}</span>
      <span v-if="isWeekend(day.date)" class="finde">★ Finde</span>
      <span v-if="isBest" class="best hand">¡mejor día!</span>
    </span>

    <span v-if="day.rating !== 'bad'" class="heat">
      <HeatStrip :day="day" :now-hour="isToday ? nowHour : null" />
      <span class="axis mono" aria-hidden="true"><i>6h</i><i>12h</i><i>18h</i><i>21h</i></span>
    </span>

    <span v-if="day.rating !== 'bad'" class="metrics">
      <span class="m"><small>Viento</small><b class="mono">{{ formatKts(day.avgKts) }}<em>kts</em></b></span>
      <span class="m"><small>Ráfaga</small><b class="mono">{{ formatKts(day.maxGustKts) }}<em>kts</em></b></span>
      <span class="m"><small>Dir.</small><b class="mono">{{ day.mainDir ?? '–' }}</b></span>
      <span class="m win"><small>Ventana</small><b class="mono">{{ day.window ? day.window.label : 'Sin ventana' }}</b></span>
    </span>

    <span v-if="day.rating === 'bad'" class="mini mono">Sin ventana · {{ formatKts(day.avgKts) }} kts de media · ráfaga {{ formatKts(day.maxGustKts) }}</span>

    <span class="badge">
      <span class="rate">{{ day.rating === 'bad' ? 'No sopla' : day.ratingInfo.short }}</span>
      <Icon name="arrow" :size="18" class="go" />
    </span>
  </button>
</template>

<style scoped>
.row {
  width: 100%; display: grid; grid-template-columns: 1fr auto; grid-template-areas: 'date badge' 'heat heat' 'metrics metrics'; gap: 14px 12px;
  text-align: left; padding: 16px; background: var(--ink); color: var(--paper); border: var(--bw) solid var(--paper);
  transition: transform 0.12s, box-shadow 0.12s, background 0.12s;
}
.row:hover { transform: translate(-3px, -3px); box-shadow: 6px 6px 0 var(--volt); }
.today { border-color: var(--volt); }
.weekend { border-color: var(--yellow); border-width: 3px; }
.finde { font-family: var(--font-mono); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 2px 8px; background: var(--yellow); color: var(--ink); }
.date { grid-area: date; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; position: relative; }
.wd { font-family: var(--font-display); font-weight: 400; font-size: 2.2rem; text-transform: uppercase; line-height: 1; }
.dn { font-size: 12px; font-weight: 700; color: var(--paper-3); text-transform: uppercase; }
.best { font-size: 1.1rem; padding: 0 10px; background: var(--yellow); color: var(--ink); transform: rotate(-4deg); }
.heat { grid-area: heat; display: grid; gap: 6px; }
.axis { display: flex; justify-content: space-between; font-size: 10px; color: var(--paper-3); }
.axis i { font-style: normal; }
.metrics { grid-area: metrics; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.m { display: grid; gap: 2px; }
.m small { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--paper-3); }
.m b { font-size: 1.1rem; }
.m em { font-style: normal; font-size: 0.7em; margin-left: 3px; color: var(--paper-3); font-weight: 400; }
.m.win { grid-column: 1 / -1; padding-top: 10px; border-top: 1px dashed var(--ink-3); grid-template-columns: auto 1fr; gap: 12px; align-items: baseline; }
.badge { grid-area: badge; display: inline-flex; align-items: center; gap: 8px; align-self: start; }
.rate { font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 10px; border: var(--bw) solid var(--paper); }
.r-good .rate { background: var(--volt); color: var(--ink); border-color: var(--volt); }
.r-ok .rate { background: #93bb1b; color: var(--ink); border-color: #93bb1b; }
.r-marginal .rate { background: var(--yellow); color: var(--ink); border-color: var(--yellow); }
.r-bad .rate { color: var(--paper-3); border-color: var(--ink-3); }
.go { transition: transform 0.15s; }
.row:hover .go { transform: translateX(4px); color: var(--volt); }
/* Días sin viento: fila fina, poco protagonismo */
.compact { grid-template-columns: auto 1fr auto; grid-template-areas: 'date mini badge'; align-items: center; gap: 4px 12px; padding: 8px 14px; background: transparent; border-style: dashed; border-color: var(--ink-3); border-left: 4px solid var(--ink-3); opacity: 0.78; }
.compact:hover { opacity: 1; box-shadow: 4px 4px 0 var(--ink-3); }
.compact .wd { font-size: 1.15rem; }
.compact .dn { font-size: 11px; }
.compact .mini { grid-area: mini; font-size: 11px; color: var(--paper-3); text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.compact .rate { font-size: 10px; padding: 2px 8px; color: var(--paper-3); border-color: var(--ink-3); }
.compact.weekend { border-left-color: var(--yellow); border-color: var(--yellow); opacity: 0.9; }
@media (max-width: 520px) {
  .compact { grid-template-areas: 'date badge' 'mini mini'; grid-template-columns: 1fr auto; }
  .compact .mini { white-space: normal; }
}
@media (min-width: 1024px) {
  .row { grid-template-columns: 150px minmax(280px, 1fr) minmax(0, 1.15fr) 150px; grid-template-areas: 'date heat metrics badge'; align-items: center; gap: 32px; padding: 16px 24px; }
  .date { flex-direction: column; gap: 2px; align-items: flex-start; }
  .best { position: absolute; left: 62px; top: -6px; }
  .metrics { grid-template-columns: 0.7fr 0.7fr 0.55fr 1.6fr; gap: 16px; }
  .m.win { grid-column: auto; padding: 0; border: 0; grid-template-columns: 1fr; gap: 2px; }
  .badge { justify-content: space-between; width: 100%; }
}
@media (min-width: 1024px) {
  .compact { grid-template-columns: 150px 1fr 150px; grid-template-areas: 'date mini badge'; gap: 32px; padding: 7px 24px 7px 24px; }
  .compact:hover { transform: none; }
  .compact .date { flex-direction: row; align-items: baseline; gap: 10px; }
  .compact .best { position: static; }
}
</style>
