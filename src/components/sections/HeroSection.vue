<script setup>
import { computed, ref } from 'vue'
import Icon from '../ui/Icon.vue'
import StatusPill from '../ui/StatusPill.vue'
import WindCompass from '../ui/WindCompass.vue'
import WeekStrip from '../forecast/WeekStrip.vue'
import { degToCompass } from '@/utils/wind'
import { formatDay, formatKts } from '@/utils/forecast'
import { pickJoke } from '@/utils/jokes'
import { scrollToId } from '@/composables/useScrollSpy'

const props = defineProps({
  spot: { type: Object, required: true },
  forecast: { type: Object, required: true },
  status: { type: String, default: 'idle' },
  error: { type: String, default: '' },
  fetchedAt: { type: Number, default: 0 },
  sharing: { type: Boolean, default: false },
})
defineEmits(['reload', 'select-day', 'share'])

const current = computed(() => props.forecast.current)
const loading = computed(() => (props.status === 'loading' || props.status === 'idle') && !current.value)
const failed = computed(() => props.status === 'error' && !current.value)
const dirLabel = computed(() => (current.value ? degToCompass(current.value.dirDeg) : '–'))
const today = computed(() => props.forecast.today)
const nextDay = computed(() => props.forecast.days.slice(1).find((d) => d.window))

const updatedAt = computed(() =>
  props.fetchedAt ? new Date(props.fetchedAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }) : ''
)

// Veredicto: lo primero que se ve
const verdict = computed(() => {
  if (failed.value) return { word: '¿?', tone: 'muted', key: 'error' }
  if (loading.value) return { word: '…', tone: 'muted', key: 'loading' }
  const a = props.forecast.assessment
  return { word: a.verdict, tone: a.tone, key: a.key }
})
const bump = ref(0)
const seed = computed(() => `${current.value?.time?.slice(0, 10) ?? ''}${props.spot.id}`)
const joke = computed(() => pickJoke(verdict.value.key, seed.value, bump.value))

const sub = computed(() => {
  if (!current.value) return ''
  const now = `${formatKts(current.value.speedKts)} kts desde ${dirLabel.value}`
  if (today.value?.window) return `${now} · hoy sopla ${today.value.window.label}`
  if (nextDay.value) return `${now} · próxima ventana: ${formatDay(nextDay.value.date, { weekday: 'long', day: 'numeric' })} ${nextDay.value.window.label}`
  return `${now} · sin ventanas en los próximos días`
})
</script>

<template>
  <section id="hoy" class="hero">
    <div class="container">
      <p class="eyebrow"><Icon name="pin" :size="13" /> Nº01 · {{ spot.name }} · {{ spot.location }}</p>

      <div class="layout">
        <!-- 1 · LA RESPUESTA -->
        <div class="verdict-area" aria-live="polite">
          <h1 class="sr-only">¿Sopla en {{ spot.name }}? Viento en vivo y pronóstico de kitesurf</h1>
          <p class="q">
            <span>¿Sopla?</span>
            <span class="answer" :class="`tone-${verdict.tone}`">{{ verdict.word }}</span>
          </p>
          <button type="button" class="note" :title="'Tocá para otro chiste'" @click="bump++">
            <span class="hand">{{ joke }}</span>
            <span class="again mono">↻ otro</span>
          </button>
          <p v-if="sub" class="sub mono">{{ sub }}</p>
          <button type="button" class="btn btn--sm share-btn" :disabled="loading || failed || sharing" @click="$emit('share', joke)">
            <Icon name="share" :size="18" />{{ sharing ? 'Generando…' : 'Compartir' }}
          </button>
          <p v-if="forecast.assessment.detail && !loading" class="sr-only">{{ forecast.assessment.detail }}</p>
        </div>

        <!-- 2 · LOS PRÓXIMOS DÍAS (finde siempre marcado) -->
        <div class="strip-area">
          <WeekStrip :days="forecast.days" :loading="loading" :seed="seed" @select="$emit('select-day', $event)" />
        </div>

        <!-- 3 · DATOS EN VIVO -->
        <aside class="live" aria-label="Condiciones actuales">
          <svg class="kite" viewBox="0 0 300 240" fill="none" aria-hidden="true">
            <path d="M14 140C30 40 190 -20 288 60 214 62 168 100 150 190 104 160 58 144 14 140Z" fill="#0b0b0b" />
            <path d="M60 138C80 70 150 30 214 36 170 56 138 96 128 160 106 150 84 142 60 138Z" fill="#c9ff2f" />
            <path d="M150 190V236M150 190 96 232M150 190 206 232" stroke="#0b0b0b" stroke-width="3" />
          </svg>
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
              <WindCompass :deg="current.dirDeg" :preferred="forecast.cfg.preferredDirections" :size="120" label="Dirección del viento actual" />
            </div>
            <div class="status"><StatusPill :tone="forecast.assessment.tone">{{ forecast.assessment.label }}</StatusPill></div>
            <dl class="stats">
              <div><dt>Ráfaga</dt><dd class="mono">{{ formatKts(current.gustKts) }}<small>kts</small></dd></div>
              <div><dt>Temp.</dt><dd class="mono">{{ formatKts(current.tempC) }}<small>°C</small></dd></div>
              <div><dt>Lluvia</dt><dd class="mono">{{ formatKts(current.precipMm, 1) }}<small>mm</small></dd></div>
            </dl>
            <div class="window">
              <Icon name="clock" :size="18" />
              <p v-if="today?.window">Ventana de hoy: <strong class="mono">{{ today.window.label }}</strong> · {{ today.window.hours }} h</p>
              <p v-else-if="nextDay">Hoy sin ventana. Próxima: <strong>{{ formatDay(nextDay.date, { weekday: 'long', day: 'numeric' }) }}</strong></p>
              <p v-else>Sin ventana navegable en la semana.</p>
            </div>
          </template>
        </aside>

        <!-- 4 · EL SPOT -->
        <div class="tagline">
          <p class="t1">{{ spot.hero?.title }} <span class="t2">{{ spot.hero?.accent }}</span></p>
          <div>
            <p class="lead">{{ spot.hero?.lead }}</p>
            <ul class="tags" aria-label="Destacados del spot">
              <li v-for="t in spot.hero?.tags" :key="t" class="chip">{{ t }}</li>
            </ul>
            <div class="actions">
              <button type="button" class="btn btn--primary" @click="scrollToId('pronostico')">Pronóstico completo <Icon name="arrow" :size="18" /></button>
              <button type="button" class="btn btn--ghost" @click="scrollToId('mapa')">Mapa y zonas</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; padding: 22px 0 48px; background: var(--paper); overflow: hidden; }
.container { position: relative; }
.eyebrow { display: inline-flex; align-items: center; gap: 8px; max-width: 100%; }
.layout { display: grid; gap: 22px; margin-top: 14px; grid-template-areas: 'verdict' 'strip' 'live' 'tagline'; }
.verdict-area { grid-area: verdict; }
.strip-area { grid-area: strip; }
.live { grid-area: live; }
.tagline { grid-area: tagline; }

/* ---- Respuesta ---- */
.q { font-family: var(--font-display); font-weight: 400; text-transform: uppercase; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 18px; font-size: clamp(4.6rem, 2rem + 17vw, 15rem); line-height: 0.85; }
.answer { display: inline-block; padding: 0.06em 0.16em 0; border: var(--bw) solid var(--ink); box-shadow: 8px 8px 0 var(--ink); transform: rotate(-2.5deg); background: var(--paper-2); }
.tone-ok { background: var(--volt); }
.tone-warn { background: var(--yellow); }
.tone-bad { background: var(--red); }
.tone-muted { background: var(--red); }
.note { display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-top: 18px; padding: 10px 14px; text-align: left; background: var(--yellow); border: var(--bw) solid var(--ink); box-shadow: var(--shadow-sm); transform: rotate(-1deg); max-width: 100%; }
.note .hand { font-size: clamp(1.25rem, 1rem + 1.4vw, 2rem); line-height: 1.1; }
.again { font-size: 11px; font-weight: 700; text-transform: uppercase; opacity: 0.7; align-self: center; }
.note:hover .again { opacity: 1; }
.share-btn { margin-top: 16px; }
.sub { margin-top: 14px; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; }

/* ---- Datos en vivo ---- */
.live { position: relative; background: var(--ink); color: var(--paper); border: var(--bw) solid var(--ink); box-shadow: 8px 8px 0 var(--volt); padding: 0 0 16px; align-self: start; }
.kite { display: none; }
.live-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 16px; background: var(--paper); color: var(--ink); border-bottom: var(--bw) solid var(--ink); font-family: var(--font-mono); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.live-head p::first-letter { color: var(--red); }
.refresh { display: inline-flex; align-items: center; gap: 6px; min-height: 28px; padding: 0 8px; border: var(--bw) solid var(--ink); font-size: 12px; background: var(--volt); }
.live > :not(.live-head):not(.kite) { margin-inline: 16px; }
.reading { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 14px; }
.speed { font-family: var(--font-display); font-size: clamp(5.5rem, 4.5rem + 4vw, 8rem); line-height: 0.82; color: var(--volt); }
.speed small { font-size: 0.22em; margin-left: 8px; color: var(--paper); letter-spacing: 0.06em; }
.from { margin-top: 8px; font-size: 13px; }
.from b { color: var(--volt); }
.status { margin-top: 12px; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 14px; border: var(--bw) solid var(--paper); }
.stats > div { padding: 8px 12px; border-right: var(--bw) solid var(--paper); }
.stats > div:last-child { border-right: 0; }
dt { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--paper-3); }
dd { font-size: 1.3rem; font-weight: 800; }
dd small { font-size: 0.55em; margin-left: 3px; font-weight: 400; color: var(--paper-3); }
.window { display: flex; gap: 12px; align-items: center; margin-top: 12px; padding: 10px 14px; background: var(--volt); color: var(--ink); border: var(--bw) solid var(--ink); font-size: 14px; font-weight: 600; }
.window svg { flex: none; }
.fail { display: grid; gap: 12px; justify-items: start; padding: 20px 16px 4px; }
.skeleton { display: grid; gap: 12px; padding: 20px 16px 4px; }
.sk { height: 28px; background: var(--ink-3); animation: pulse 1s steps(2) infinite; }
.sk.big { height: 110px; }
@keyframes pulse { 50% { opacity: 0.4; } }

/* ---- Tagline del spot ---- */
.tagline { display: grid; gap: 14px; padding-top: 22px; border-top: var(--bw) solid var(--ink); }
.t1 { font-family: var(--font-display); text-transform: uppercase; font-size: clamp(2.6rem, 1.4rem + 5vw, 5.5rem); line-height: 0.9; }
.t2 { display: block; font-size: 0.55em; color: transparent; -webkit-text-stroke: 1.5px var(--ink); margin-top: 4px; }
.lead { font-size: 1.15rem; font-weight: 600; max-width: 38ch; line-height: 1.35; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 18px; }
.actions .btn { flex: 1 1 auto; }

@media (min-width: 1024px) {
  .hero { padding: 40px 0 96px; }
  .layout { grid-template-columns: minmax(0, 1fr) 440px; grid-template-areas: 'verdict live' 'strip live' 'tagline tagline'; gap: 36px 64px; margin-top: 22px; align-items: start; }
  .live { margin-top: 70px; }
  .q { font-size: clamp(6rem, 9.4vw, 11rem); gap: 6px 28px; flex-wrap: nowrap; }
  .kite { display: block; position: absolute; width: 190px; right: 18px; top: -112px; transform: rotate(10deg); animation: bob 5s ease-in-out infinite; pointer-events: none; }
  @keyframes bob { 50% { transform: rotate(5deg) translateY(8px); } }
  .tagline { grid-template-columns: 1.3fr 1fr; gap: 64px; align-items: end; margin-top: 24px; padding-top: 36px; }
  .actions .btn { flex: 0 0 auto; }
  .note { margin-top: 26px; }
}
@media (max-width: 380px) { .reading { flex-direction: column; align-items: flex-start; } }
</style>
