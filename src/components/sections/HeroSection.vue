<script setup>
import { computed } from 'vue'
import Icon from '../ui/Icon.vue'
import StatusPill from '../ui/StatusPill.vue'
import WindCompass from '../ui/WindCompass.vue'
import { degToCompass } from '@/utils/wind'
import { formatDay, formatKts } from '@/utils/forecast'
import { scrollToId } from '@/composables/useScrollSpy'

const props = defineProps({
  spot: { type: Object, required: true },
  forecast: { type: Object, required: true },
  status: { type: String, default: 'idle' },
  error: { type: String, default: '' },
  fetchedAt: { type: Number, default: 0 },
})
defineEmits(['reload'])

const current = computed(() => props.forecast.current)
const loading = computed(() => (props.status === 'loading' || props.status === 'idle') && !current.value)
const dirLabel = computed(() => (current.value ? degToCompass(current.value.dirDeg) : '–'))

const today = computed(() => props.forecast.today)
const nextDay = computed(() => props.forecast.days.slice(1).find((d) => d.window))

const updatedAt = computed(() =>
  props.fetchedAt
    ? new Date(props.fetchedAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
    : ''
)
</script>

<template>
  <section id="hoy" class="hero">
    <div class="art" aria-hidden="true">
      <svg class="kite" viewBox="0 0 300 240" fill="none">
        <path d="M14 140C30 40 190 -20 288 60 214 62 168 100 150 190 104 160 58 144 14 140Z" fill="#0b0b0b" />
        <path d="M60 138C80 70 150 30 214 36 170 56 138 96 128 160 106 150 84 142 60 138Z" fill="#c9ff2f" />
        <path d="M150 190V236M150 190 96 232M150 190 206 232" stroke="#0b0b0b" stroke-width="3" />
      </svg>
      <p class="sticker hand" :class="{ off: !forecast.assessment.playable }">
        {{ forecast.assessment.playable ? '¡hoy sopla!' : 'esperando viento…' }}
      </p>
    </div>

    <div class="container">
      <p class="eyebrow"><Icon name="pin" :size="13" /> Nº01 · {{ spot.hero?.badge }}</p>
      <h1>
        <span class="t1">{{ spot.hero?.title }}</span>
        <span class="t2">{{ spot.hero?.accent }}</span>
      </h1>

      <div class="grid">
        <div class="copy">
          <p class="lead">{{ spot.hero?.lead }}</p>
          <ul class="tags" aria-label="Destacados del spot">
            <li v-for="t in spot.hero?.tags" :key="t" class="chip">{{ t }}</li>
          </ul>
          <div class="actions">
            <button type="button" class="btn btn--primary" @click="scrollToId('pronostico')">Ver pronóstico <Icon name="arrow" :size="18" /></button>
            <button type="button" class="btn btn--ghost" @click="scrollToId('mapa')">Mapa y zonas</button>
          </div>
        </div>

        <aside class="live" aria-label="Condiciones actuales" aria-live="polite">
          <header class="live-head">
            <p>● En vivo — {{ spot.name }}</p>
            <button v-if="status !== 'loading'" type="button" class="refresh" aria-label="Actualizar datos" @click="$emit('reload')">
              <Icon name="refresh" :size="14" /><span v-if="updatedAt">{{ updatedAt }}</span>
            </button>
          </header>

          <div v-if="loading" class="skeleton" aria-busy="true"><div class="sk big"></div><div class="sk"></div></div>

          <div v-else-if="!current" class="fail">
            <Icon name="alert" :size="26" />
            <p>{{ error || 'Sin datos de viento por ahora.' }}</p>
            <button type="button" class="btn btn--sm" @click="$emit('reload')">Reintentar</button>
          </div>

          <template v-else>
            <div class="reading">
              <div>
                <p class="speed">{{ formatKts(current.speedKts, 0) }}<small>kts</small></p>
                <p class="from mono">desde <b>{{ dirLabel }}</b> · {{ Math.round(current.dirDeg) }}°</p>
              </div>
              <WindCompass :deg="current.dirDeg" :preferred="forecast.cfg.preferredDirections" :size="132" label="Dirección del viento actual" />
            </div>
            <div class="status"><StatusPill :tone="forecast.assessment.tone">{{ forecast.assessment.label }}</StatusPill></div>
            <p class="detail">{{ forecast.assessment.detail }}</p>

            <dl class="stats">
              <div><dt>Ráfaga</dt><dd class="mono">{{ formatKts(current.gustKts) }}<small>kts</small></dd></div>
              <div><dt>Temp.</dt><dd class="mono">{{ formatKts(current.tempC) }}<small>°C</small></dd></div>
              <div><dt>Lluvia</dt><dd class="mono">{{ formatKts(current.precipMm, 1) }}<small>mm</small></dd></div>
            </dl>

            <div class="window">
              <Icon name="clock" :size="18" />
              <p v-if="today?.window">Ventana de hoy: <strong class="mono">{{ today.window.label }}</strong> · {{ today.window.hours }} h</p>
              <p v-else-if="nextDay">Hoy sin ventana. Próxima: <strong>{{ formatDay(nextDay.date, { weekday: 'long', day: 'numeric' }) }}</strong> · <span class="mono">{{ nextDay.window.label }}</span></p>
              <p v-else>Sin ventana navegable en los próximos días.</p>
            </div>
          </template>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; overflow: hidden; padding: 28px 0 56px; background: var(--paper); }
.art { position: absolute; inset: 0; pointer-events: none; }
.kite { position: absolute; display: none; width: clamp(170px, 20vw, 300px); right: 3%; top: 18px; transform: rotate(10deg); animation: bob 5s ease-in-out infinite; }
@keyframes bob { 50% { transform: rotate(6deg) translateY(10px); } }
.sticker {
  position: absolute; display: none; right: 11%; top: 262px; width: 150px; aspect-ratio: 1; padding: 20px; place-items: center; text-align: center;
  font-size: 1.5rem; line-height: 1; border: var(--bw) solid var(--ink); border-radius: 50%; background: var(--volt); transform: rotate(-12deg); box-shadow: var(--shadow-sm);
}
.sticker.off { background: var(--yellow); }

.container { position: relative; }
.eyebrow { display: inline-flex; align-items: center; gap: 8px; }
h1 { margin-top: 18px; font-size: clamp(4.2rem, 1rem + 17vw, 14rem); line-height: 0.82; }
.t1 { display: block; }
.t2 {
  display: block; margin-top: 6px; font-size: 0.42em; line-height: 0.95;
  color: transparent; -webkit-text-stroke: 2px var(--ink);
}
@media (min-width: 1024px) { .t2 { -webkit-text-stroke-width: 2.5px; } h1 { font-size: clamp(6rem, 11.5vw, 13rem); } }

.grid { display: grid; gap: 28px; margin-top: 28px; }
.lead { font-size: clamp(1.1rem, 1rem + 0.5vw, 1.4rem); font-weight: 600; max-width: 34ch; line-height: 1.35; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 26px; }
.actions .btn { flex: 1 1 auto; }

/* ---- Tarjeta en vivo ---- */
.live { position: relative; background: var(--ink); color: var(--paper); border: var(--bw) solid var(--ink); box-shadow: 8px 8px 0 var(--volt); padding: 0 0 18px; }
.live-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 16px; background: var(--paper); color: var(--ink); border-bottom: var(--bw) solid var(--ink); font-family: var(--font-mono); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.live-head p::first-letter { color: var(--red); }
.refresh { display: inline-flex; align-items: center; gap: 6px; min-height: 28px; padding: 0 8px; border: var(--bw) solid var(--ink); font-size: 12px; background: var(--volt); }
.live > :not(.live-head) { margin-inline: 16px; }
.reading { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 16px; }
.speed { font-family: var(--font-display); font-size: clamp(6.5rem, 5rem + 6vw, 10rem); line-height: 0.82; color: var(--volt); }
.speed small { font-size: 0.22em; margin-left: 8px; color: var(--paper); letter-spacing: 0.06em; }
.from { margin-top: 10px; font-size: 13px; }
.from b { color: var(--volt); }
.status { margin-top: 14px; }
.detail { margin-top: 10px; font-size: 14px; color: var(--paper-3); }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 16px; border: var(--bw) solid var(--paper); }
.stats > div { padding: 10px 12px; border-right: var(--bw) solid var(--paper); }
.stats > div:last-child { border-right: 0; }
dt { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--paper-3); }
dd { font-size: 1.4rem; font-weight: 800; margin-top: 2px; }
dd small { font-size: 0.55em; margin-left: 3px; font-weight: 400; color: var(--paper-3); }
.window { display: flex; gap: 12px; align-items: center; margin-top: 14px; padding: 12px 14px; background: var(--volt); color: var(--ink); border: var(--bw) solid var(--ink); font-size: 14px; font-weight: 600; }
.window svg { flex: none; }
.fail { display: grid; gap: 12px; justify-items: start; padding: 20px 16px 4px; }
.skeleton { display: grid; gap: 12px; padding: 20px 16px 4px; }
.sk { height: 28px; background: var(--ink-3); animation: pulse 1s steps(2) infinite; }
.sk.big { height: 110px; }
@keyframes pulse { 50% { opacity: 0.4; } }

@media (min-width: 1024px) {
  .hero { padding: 56px 0 96px; }
  .kite, .sticker { display: grid; }
  .grid { grid-template-columns: minmax(0, 1fr) minmax(0, 480px); gap: 80px; align-items: start; margin-top: 40px; }
  .actions .btn { flex: 0 0 auto; }
  .copy::after { content: ''; display: block; margin-top: 48px; height: 150px; width: 70%; background-image: radial-gradient(var(--ink) 2px, transparent 2.3px); background-size: 12px 12px; -webkit-mask-image: linear-gradient(90deg, #000, transparent); mask-image: linear-gradient(90deg, #000, transparent); }
}
@media (max-width: 380px) { .reading { flex-direction: column; align-items: flex-start; } }
</style>
