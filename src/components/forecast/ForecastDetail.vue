<script setup>
import { computed, ref, watch } from 'vue'
import Sheet from '../ui/Sheet.vue'
import { formatDay, formatKts, levelLabel } from '@/utils/forecast'

const props = defineProps({
  day: { type: Object, default: null },
  cfg: { type: Object, required: true },
  detailText: { type: String, default: '' },
})
const emit = defineEmits(['close'])

const open = computed({
  get: () => !!props.day,
  set: (v) => !v && emit('close'),
})

const onlySun = ref(true)
const onlyPlayable = ref(false)
watch(() => props.day?.date, () => (onlyPlayable.value = false))

const hours = computed(() => {
  let h = props.day?.hours ?? []
  if (onlySun.value) h = h.filter((x) => x.assess.sun)
  if (onlyPlayable.value) h = h.filter((x) => x.assess.playable)
  return h
})

const scale = computed(() => {
  const max = Math.max(0, ...(props.day?.hours ?? []).map((h) => h.gustKts ?? 0))
  return Math.max(25, Math.ceil(max / 5) * 5)
})
const pct = (n) => `${Math.min(100, Math.max(0, (n / scale.value) * 100))}%`
const PLOT_H = 166
const thrTop = computed(() => 24 + PLOT_H - Math.min(1, props.cfg.minPlayableKts / scale.value) * PLOT_H)

const rows = [
  { key: 'hour', label: 'Hora' },
  { key: 'dir', label: 'Dirección' },
  { key: 'gust', label: 'Ráfaga' },
  { key: 'temp', label: 'Temp.' },
  { key: 'rain', label: 'Lluvia' },
]
const title = computed(() => (props.day ? formatDay(props.day.date, { weekday: 'long', day: 'numeric', month: 'long' }).replace(/ De /g, ' de ') : ''))
</script>

<template>
  <Sheet v-model="open" wide :title="title" eyebrow="Detalle por hora" @close="$emit('close')">
    <div v-if="day" class="detail">
      <div class="kpis">
        <div><small>Ventana</small><b class="mono">{{ day.window ? day.window.label : 'Sin ventana' }}</b></div>
        <div><small>Viento prom.</small><b class="mono">{{ formatKts(day.avgKts) }} kts</b></div>
        <div><small>Ráfaga máx.</small><b class="mono">{{ formatKts(day.maxGustKts) }} kts</b></div>
        <div><small>Dirección</small><b class="mono">{{ day.mainDir ?? '–' }}</b></div>
        <div class="hide-m"><small>Temp.</small><b class="mono">{{ day.minTemp !== null ? `${formatKts(day.minTemp)}–${formatKts(day.maxTemp)}°C` : '–' }}</b></div>
        <div class="hide-m"><small>Lluvia</small><b class="mono">{{ formatKts(day.totalRain, 1) }} mm</b></div>
      </div>

      <div class="filters">
        <button type="button" class="f" :class="{ on: onlySun }" :aria-pressed="onlySun" @click="onlySun = !onlySun">Solo con luz solar</button>
        <button type="button" class="f" :class="{ on: onlyPlayable }" :aria-pressed="onlyPlayable" @click="onlyPlayable = !onlyPlayable">Solo navegables</button>
      </div>

      <p v-if="!hours.length" class="empty">Ninguna hora cumple los filtros elegidos.</p>

      <div v-else class="scroller" tabindex="0" role="group" aria-label="Tabla horaria desplazable">
        <div class="grid" :style="{ '--n': hours.length }">
          <!-- Fila de barras -->
          <div class="rl bars-label"><span>Viento</span><small>kts</small></div>
          <div v-for="h in hours" :key="`b-${h.time}`" class="bar-cell" :class="`lv${h.assess.level}`">
            <div class="plot">
              <span class="gust" :style="{ height: pct(h.gustKts ?? 0) }"></span>
              <span class="spd" :style="{ height: pct(h.speedKts ?? 0) }"></span>
              <b class="mono val" :style="{ bottom: `calc(${pct(h.speedKts ?? 0)} + 4px)` }">{{ formatKts(h.speedKts) }}</b>
            </div>
          </div>

          <template v-for="r in rows" :key="r.key">
            <div class="rl">{{ r.label }}</div>
            <div v-for="h in hours" :key="`${r.key}-${h.time}`" class="c mono" :class="{ ok: h.assess.playable }">
              <template v-if="r.key === 'hour'">{{ String(h.hourNum).padStart(2, '0') }}h</template>
              <span v-else-if="r.key === 'dir'" class="arr" :class="{ good: h.assess.dirOk }" :style="{ transform: `rotate(${h.dirDegVisual}deg)` }" :title="`${Math.round(h.dirDeg)}°`">↑</span>
              <template v-else-if="r.key === 'gust'">{{ formatKts(h.gustKts) }}</template>
              <template v-else-if="r.key === 'temp'">{{ formatKts(h.tempC) }}°</template>
              <template v-else>{{ h.precipMm > 0 ? formatKts(h.precipMm, 1) : '·' }}</template>
            </div>
          </template>
          <i class="thr" :style="{ top: thrTop + 'px' }"><em>mín. {{ cfg.minPlayableKts }} kts</em></i>
        </div>
      </div>

      <ul class="legend">
        <li v-for="l in [1, 2, 3, 4]" :key="l"><i :class="`lv${l}`"></i>{{ levelLabel(l) }}</li>
        <li><i class="lv0"></i>No navegable</li>
        <li><span class="arr good">↑</span>Dirección ideal</li>
      </ul>
      <p v-if="detailText" class="note">{{ detailText }}</p>
    </div>
  </Sheet>
</template>

<style scoped>
.detail { display: grid; gap: 18px; }
.kpis { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.kpis > div { background: #fff; border: 1.5px solid var(--sand-line); border-radius: var(--r-sm); padding: 12px 14px; display: grid; gap: 2px; }
.kpis small { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-soft); }
.kpis b { font-size: 1rem; }
.hide-m { display: none !important; }
.filters { display: flex; gap: 8px; flex-wrap: wrap; }
.f { min-height: 40px; padding: 0 16px; border-radius: 99px; border: 1.5px solid var(--sand-line); background: #fff; font-size: 14px; font-weight: 600; }
.f.on { background: var(--ink-900); color: #fff; border-color: var(--ink-900); }
.empty { padding: 28px; text-align: center; color: var(--text-soft); }

.scroller { overflow-x: auto; border-radius: var(--r-md); border: 1.5px solid var(--sand-line); background: #fff; scrollbar-width: thin; }
.grid {
  display: grid;
  --lw: 76px;
  grid-template-columns: var(--lw) repeat(var(--n), minmax(46px, 1fr));
  grid-auto-rows: 38px;
  grid-template-rows: 190px;
  min-width: max-content;
  width: 100%;
  position: relative;
}
.rl {
  position: sticky; left: 0; z-index: 3;
  display: flex; align-items: center; padding: 0 10px;
  background: #fff; border-right: 1.5px solid var(--sand-line); border-top: 1px solid var(--sand-100);
  font-size: 12px; font-weight: 700; color: var(--text-soft);
}
.bars-label { flex-direction: column; align-items: flex-start; justify-content: flex-end; padding-bottom: 8px; border-top: 0; }
.bars-label small { font-weight: 500; font-family: var(--font-mono); }
.bar-cell { position: relative; height: 190px; padding-top: 24px; border-left: 1px solid var(--sand-100); }
.plot { position: absolute; inset: 24px 0 0 0; }
.gust, .spd { position: absolute; bottom: 0; left: 18%; right: 18%; border-radius: 6px 6px 0 0; }
.gust { background: var(--sand-200); }
.spd { background: #b3c4cd; }
.val { position: absolute; left: 0; right: 0; text-align: center; font-size: 12px; font-weight: 700; }
.lv1 .spd { background: #8fd8b8; } .lv2 .spd { background: #4cc590; } .lv3 .spd { background: #17a56f; } .lv4 .spd { background: #0f8758; }
.thr {
  position: absolute; left: var(--lw); right: 0; height: 0; border-top: 2px dashed var(--sun-500);
  pointer-events: none; z-index: 2;
}
.thr em { position: absolute; right: 6px; top: -20px; font-style: normal; font: 700 11px var(--font-mono); color: var(--sun-600); background: #fff; padding: 0 4px; }
.c { display: grid; place-items: center; border-left: 1px solid var(--sand-100); border-top: 1px solid var(--sand-100); font-size: 13px; }
.c.ok { background: rgba(23, 165, 111, 0.06); }
.arr { display: inline-block; font-weight: 800; font-size: 18px; color: #8a9aa4; line-height: 1; }
.arr.good { color: var(--ok); }
.legend { display: flex; flex-wrap: wrap; gap: 8px 18px; font-size: 13px; color: var(--text-soft); }
.legend li { display: inline-flex; align-items: center; gap: 8px; }
.legend i { width: 14px; height: 14px; border-radius: 4px; background: #b3c4cd; }
.legend .lv1 { background: #8fd8b8; } .legend .lv2 { background: #4cc590; } .legend .lv3 { background: #17a56f; } .legend .lv4 { background: #0f8758; }
.note { font-size: 13px; color: var(--text-soft); padding: 14px; background: var(--sand-100); border-radius: var(--r-sm); }

@media (min-width: 1024px) {
  .kpis { grid-template-columns: repeat(6, 1fr); }
  .hide-m { display: grid !important; }
  .grid { --lw: 96px; }
}
</style>
