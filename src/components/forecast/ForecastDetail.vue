<script setup>
import { computed } from 'vue'
import Sheet from '../ui/Sheet.vue'
import Icon from '../ui/Icon.vue'
import { formatDay, formatKts, levelLabel } from '@/utils/forecast'
import { degToCompass, getDirectionOffset } from '@/utils/wind'

const props = defineProps({
  day: { type: Object, default: null },
  sharing: { type: Boolean, default: false },
  cfg: { type: Object, required: true },
})
const emit = defineEmits(['close', 'share'])

const open = computed({
  get: () => !!props.day,
  set: (v) => !v && emit('close'),
})

// Solo se muestran las horas con luz solar (el resto no se navega).
const hours = computed(() => (props.day?.hours ?? []).filter((x) => x.assess.sun))

// Dirección ideal del spot (promedio circular de las direcciones preferidas) -> flecha fantasma
const idealVisual = computed(() => {
  const list = props.cfg.preferredDirections ?? []
  if (!list.length) return null
  let sx = 0
  let sy = 0
  list.forEach((d) => {
    const a = (getDirectionOffset(d) * Math.PI) / 180
    sx += Math.sin(a)
    sy += Math.cos(a)
  })
  const from = ((Math.atan2(sx, sy) * 180) / Math.PI + 360) % 360
  return (from + 180) % 360
})
const idealLabel = computed(() => (props.cfg.preferredDirections ?? []).join(' · '))

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

      <div class="actions-row">
        <button type="button" class="btn btn--sm" :disabled="sharing" @click="$emit('share', day)"><Icon name="share" :size="18" />{{ sharing ? 'Generando imagen…' : 'Compartir este día' }}</button>
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
              <span v-if="(h.speedKts ?? 0) / scale > 0.16" class="binit mono" :class="{ good: h.assess.dirOk }" :style="{ height: pct(h.speedKts ?? 0) }">{{ degToCompass(h.dirDeg) }}</span>
            </div>
          </div>

          <template v-for="r in rows" :key="r.key">
            <div class="rl">{{ r.label }}</div>
            <div v-for="h in hours" :key="`${r.key}-${h.time}`" class="c mono" :class="{ ok: h.assess.playable }">
              <template v-if="r.key === 'hour'">{{ String(h.hourNum).padStart(2, '0') }}h</template>
              <span v-else-if="r.key === 'dir'" class="dirc" :title="`${degToCompass(h.dirDeg)} · ${Math.round(h.dirDeg)}°`">
                <span v-if="idealVisual !== null" class="arr ghost" :style="{ transform: `rotate(${idealVisual}deg)` }">↑</span>
                <span class="arr" :class="{ good: h.assess.dirOk }" :style="{ transform: `rotate(${h.dirDegVisual}deg)` }">↑</span>
                <small :class="{ good: h.assess.dirOk }">{{ degToCompass(h.dirDeg) }}</small>
              </span>
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
        <li><span class="arr good">↑</span>Dirección real (verde = ideal)</li>
        <li v-if="idealVisual !== null"><span class="arr ghost sample">↑</span>Fantasma: dirección ideal del spot ({{ idealLabel }})</li>
      </ul>
    </div>
  </Sheet>
</template>

<style scoped>
.detail { display: grid; gap: 18px; padding: 4px 6px 8px 4px; }
.kpis { display: grid; grid-template-columns: repeat(2, 1fr); border: var(--bw) solid var(--ink); }
.kpis > div { padding: 10px 14px; display: grid; gap: 2px; border-right: var(--bw) solid var(--ink); border-bottom: var(--bw) solid var(--ink); background: var(--paper); }
.kpis > div:nth-child(2n) { border-right: 0; }
.kpis small { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
.kpis b { font-size: 1.05rem; }
.hide-m { display: none !important; }
.actions-row { display: flex; gap: 10px; flex-wrap: wrap; }
.empty { padding: 28px; text-align: center; }

.scroller { overflow-x: auto; border: var(--bw) solid var(--ink); background: var(--paper); scrollbar-width: thin; }
.grid { --lw: 76px; display: grid; grid-template-columns: var(--lw) repeat(var(--n), minmax(46px, 1fr)); grid-auto-rows: 38px; grid-template-rows: 190px 38px 54px; min-width: max-content; width: 100%; position: relative; }
.rl { position: sticky; left: 0; z-index: 3; display: flex; align-items: center; padding: 0 10px; background: var(--ink); color: var(--paper); font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; border-top: 1px solid var(--ink-3); }
.bars-label { flex-direction: column; align-items: flex-start; justify-content: flex-end; padding-bottom: 8px; border-top: 0; }
.bars-label small { font-weight: 400; }
.bar-cell { position: relative; height: 190px; padding-top: 24px; border-left: 1px solid var(--paper-3); }
.plot { position: absolute; inset: 24px 0 0 0; }
.gust, .spd { position: absolute; bottom: 0; left: 16%; right: 16%; }
.gust { background: repeating-linear-gradient(135deg, var(--paper-3) 0 3px, transparent 3px 6px); border: 1.5px solid var(--ink); border-bottom: 0; }
.spd { background: #9b9684; border: 1.5px solid var(--ink); border-bottom: 0; }
.val { position: absolute; left: 0; right: 0; text-align: center; font-size: 12px; font-weight: 700; }
.lv1 .spd { background: #e3f58f; } .lv2 .spd { background: #d6f55e; } .lv3 .spd { background: var(--volt); } .lv4 .spd { background: var(--volt-2); }
.thr { position: absolute; left: var(--lw); right: 0; height: 0; border-top: 2px dashed var(--red); pointer-events: none; z-index: 2; }
.thr em { position: absolute; right: 6px; top: -22px; font: 700 11px var(--font-mono); color: #fff; background: var(--red); padding: 1px 6px; font-style: normal; }
.c { display: grid; place-items: center; border-left: 1px solid var(--paper-3); border-top: 1px solid var(--paper-3); font-size: 13px; font-weight: 700; }
.c.ok { background: rgba(201, 255, 47, 0.35); }
.arr { display: inline-block; font-weight: 800; font-size: 18px; color: #8a8672; line-height: 1; }
.arr.good { color: var(--ink); }
.legend { display: flex; flex-wrap: wrap; gap: 8px 18px; font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; }
.legend li { display: inline-flex; align-items: center; gap: 8px; }
.legend i { width: 14px; height: 14px; background: #9b9684; border: 1.5px solid var(--ink); }
.legend .lv1 { background: #e3f58f; } .legend .lv2 { background: #d6f55e; } .legend .lv3 { background: var(--volt); } .legend .lv4 { background: var(--volt-2); }

.binit { position: absolute; left: 0; right: 0; bottom: 4px; text-align: center; font-size: 10px; font-weight: 700; color: #333; pointer-events: none; display: flex; align-items: flex-end; justify-content: center; }
.binit.good { color: var(--ink); }
.dirc { display: grid; justify-items: center; line-height: 1; position: relative; width: 100%; height: 100%; place-content: center; }
.dirc .arr { grid-area: 1 / 1; font-size: 20px; }
.dirc small { grid-area: 2 / 1; margin-top: 2px; font-size: 9px; font-weight: 700; color: #555; }
.dirc small.good { color: var(--ink); }
.arr.ghost { color: transparent; -webkit-text-stroke: 1.6px #6b6857; opacity: 0.85; font-size: 27px; }
.arr.ghost.sample { display: inline-block; font-size: 18px; }
@media (min-width: 1024px) {
  .kpis { grid-template-columns: repeat(6, 1fr); }
  .kpis > div { border-bottom: 0; border-right: var(--bw) solid var(--ink) !important; }
  .kpis > div:last-child { border-right: 0 !important; }
  .hide-m { display: grid !important; }
  .grid { --lw: 96px; }
}
</style>
