<script setup>
import { computed } from 'vue'
import { dayNumber, dayVerdict, formatKts, getWeekend, isWeekend, weekdayShort } from '@/utils/forecast'
import { pickJoke } from '@/utils/jokes'

const props = defineProps({
  days: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  seed: { type: String, default: '' },
})
defineEmits(['select'])

const we = computed(() => getWeekend(props.days))
const weekendKey = computed(() => {
  const r = [we.value.sat, we.value.sun].filter(Boolean)
  if (!r.length) return null
  const good = r.filter((d) => d.rating === 'good' || d.rating === 'ok').length
  return good === r.length ? 'weekendYes' : good > 0 ? 'weekendMaybe' : 'weekendNo'
})
const weekendJoke = computed(() => (weekendKey.value ? pickJoke(weekendKey.value, props.seed) : ''))
const short = (d) => (d ? `${weekdayShort(d.date)} ${dayNumber(d.date)}` : '')
const sum = (d) => (d ? (d.window ? `${dayVerdict(d)} · ${d.window.hours}h` : 'NO') : '')
</script>

<template>
  <div class="week">
    <div class="week-head">
      <p class="mono">Próximos 7 días</p>
      <p class="mono legend"><span class="star">★</span> fin de semana</p>
    </div>

    <ol v-if="days.length" class="cells">
      <li v-for="(d, i) in days" :key="d.date">
        <button
          type="button"
          class="cell"
          :class="[`r-${d.rating}`, { we: isWeekend(d.date), today: i === 0 }]"
          :aria-label="`${i === 0 ? 'Hoy' : weekdayShort(d.date)} ${dayNumber(d.date)}: ${d.window ? 'sopla ' + d.window.label : 'sin viento útil'}. Ver detalle.`"
          @click="$emit('select', d)"
        >
          <span class="top">
            <b>{{ i === 0 ? 'Hoy' : weekdayShort(d.date) }}</b>
            <span v-if="isWeekend(d.date)" class="star" aria-hidden="true">★</span>
          </span>
          <span class="num mono">{{ dayNumber(d.date) }}</span>
          <span class="verdict">{{ dayVerdict(d) }}</span>
          <span class="hrs mono">{{ d.window ? d.window.hours + 'h' : '—' }}</span>
          <span class="kts mono">{{ formatKts(d.avgKts) }}<small>kt</small></span>
        </button>
      </li>
    </ol>
    <ol v-else-if="loading" class="cells" aria-busy="true"><li v-for="n in 8" :key="n" class="cell sk"></li></ol>

    <p v-if="weekendJoke" class="finde">
      <span class="tag mono">Finde</span>
      <span class="sum mono">
        <b>{{ short(we.sat) }}</b> {{ sum(we.sat) }} · <b>{{ short(we.sun) }}</b> {{ sum(we.sun) }}
      </span>
      <span class="hand joke">{{ weekendJoke }}</span>
    </p>
  </div>
</template>

<style scoped>
.week { border: var(--bw) solid var(--ink); background: var(--paper); box-shadow: var(--shadow); }
.week-head { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--ink); color: var(--paper); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
.week-head p { margin: 0; }
.star { color: var(--volt); }
.cells { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); }
.cell { width: 100%; height: 100%; display: grid; justify-items: center; gap: 2px; padding: 8px 2px 10px; border-right: var(--bw) solid var(--ink); text-align: center; background: var(--paper); transition: background 0.1s; }
li:last-child .cell { border-right: 0; }
.cell:hover { background: var(--paper-2); }
.top { display: inline-flex; gap: 2px; align-items: center; }
.top b { font-family: var(--font-display); font-weight: 400; font-size: 1.15rem; text-transform: uppercase; line-height: 1; }
.num { font-size: 11px; opacity: 0.7; }
.verdict { margin-top: 4px; width: calc(100% - 6px); padding: 6px 0 4px; font-family: var(--font-display); font-size: 1.5rem; line-height: 1; border: var(--bw) solid var(--ink); background: var(--paper-2); }
.r-good .verdict { background: var(--volt); }
.r-ok .verdict { background: #d6f55e; }
.r-marginal .verdict { background: var(--yellow); font-size: 1.1rem; padding-top: 9px; padding-bottom: 7px; }
.r-bad .verdict { background: var(--paper-2); color: #777; border-style: dashed; }
.hrs { font-size: 12px; font-weight: 700; margin-top: 3px; }
.kts { font-size: 10px; opacity: 0.75; }
.kts small { margin-left: 1px; }
.cell.we { background: repeating-linear-gradient(-45deg, #fff6b8 0 6px, var(--paper) 6px 12px); }
.cell.we .top b { background: var(--ink); color: var(--volt); padding: 1px 4px; }
.cell.today { outline: 3px solid var(--blue); outline-offset: -3px; }
.sk { min-height: 130px; background: var(--paper-2); animation: pulse 1s steps(2) infinite; }
@keyframes pulse { 50% { opacity: 0.4; } }

.finde { display: grid; gap: 4px 12px; padding: 12px 14px; border-top: var(--bw) solid var(--ink); background: var(--yellow); align-items: center; }
.tag { justify-self: start; padding: 2px 8px; background: var(--ink); color: var(--yellow); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
.sum { font-size: 13px; }
.sum b { text-transform: uppercase; }
.joke { font-size: 1.2rem; line-height: 1.15; }

@media (min-width: 1024px) {
  .week-head { padding: 10px 18px; font-size: 12px; }
  .cell { padding: 14px 6px 16px; gap: 4px; }
  .top b { font-size: 1.8rem; }
  .num { font-size: 13px; }
  .verdict { font-size: 2.4rem; padding: 10px 0 7px; }
  .r-marginal .verdict { font-size: 1.7rem; padding-top: 14px; padding-bottom: 11px; }
  .hrs { font-size: 15px; }
  .kts { font-size: 12px; }
  .finde { grid-template-columns: auto auto 1fr; padding: 14px 18px; gap: 18px; }
  .joke { font-size: 1.5rem; text-align: right; }
}
</style>
