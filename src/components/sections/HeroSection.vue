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
    <!-- Ilustración decorativa -->
    <div class="art" aria-hidden="true">
      <div class="sun"></div>
      <svg class="kite" viewBox="0 0 320 260" fill="none">
        <path d="M20 120C50 30 220 -10 300 70 240 70 180 100 150 170 110 140 60 120 20 120Z" fill="url(#kg)" />
        <path d="M150 170 C150 200 120 230 90 250M150 170C160 200 190 225 230 250" stroke="rgba(255,255,255,.35)" stroke-width="1.5" />
        <path d="M20 120C80 120 110 130 150 170M300 70C230 80 180 110 150 170" stroke="rgba(255,255,255,.25)" stroke-width="1" />
        <defs>
          <linearGradient id="kg" x1="20" y1="0" x2="300" y2="140">
            <stop stop-color="#ff6a3d" />
            <stop offset=".55" stop-color="#ffb24a" />
            <stop offset="1" stop-color="#ff6a3d" />
          </linearGradient>
        </defs>
      </svg>
      <svg class="waves" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <path class="w1" d="M0 90C180 40 340 140 540 90S900 40 1100 100 1340 80 1440 60V220H0Z" />
        <path class="w2" d="M0 130C200 80 360 180 580 130S940 90 1140 140 1360 120 1440 110V220H0Z" />
        <path class="w3" d="M0 170C220 130 400 210 620 170S980 140 1180 180 1380 160 1440 150V220H0Z" />
      </svg>
    </div>

    <div class="container grid">
      <div class="copy">
        <p class="badge"><Icon name="pin" :size="14" />{{ spot.hero?.badge }}</p>
        <h1>
          {{ spot.hero?.title }}
          <span class="accent">{{ spot.hero?.accent }}</span>
        </h1>
        <p class="lead">{{ spot.hero?.lead }}</p>
        <ul class="tags" aria-label="Destacados del spot">
          <li v-for="t in spot.hero?.tags" :key="t" class="chip">{{ t }}</li>
        </ul>
        <div class="actions">
          <button type="button" class="btn btn--primary" @click="scrollToId('pronostico')">
            Ver pronóstico <Icon name="arrow" :size="18" />
          </button>
          <button type="button" class="btn btn--ghost" @click="scrollToId('mapa')">Mapa y zonas</button>
        </div>
      </div>

      <aside class="live" aria-label="Condiciones actuales" aria-live="polite">
        <header class="live-head">
          <p class="eyebrow">En vivo · {{ spot.name }}</p>
          <button v-if="status !== 'loading'" type="button" class="refresh" aria-label="Actualizar datos" @click="$emit('reload')">
            <Icon name="refresh" :size="16" />
            <span v-if="updatedAt">{{ updatedAt }}</span>
          </button>
        </header>

        <div v-if="loading" class="skeleton" aria-busy="true">
          <div class="sk sk-circle"></div>
          <div class="sk-col"><div class="sk sk-line"></div><div class="sk sk-line short"></div></div>
        </div>

        <div v-else-if="!current" class="fail">
          <Icon name="alert" :size="26" />
          <p>{{ error || 'Sin datos de viento por ahora.' }}</p>
          <button type="button" class="btn btn--ghost btn--sm" @click="$emit('reload')">Reintentar</button>
        </div>

        <template v-else>
          <div class="reading">
            <WindCompass :deg="current.dirDeg" :preferred="forecast.cfg.preferredDirections" :size="168" label="Dirección del viento actual" />
            <div>
              <p class="speed mono">{{ formatKts(current.speedKts, 0) }}<small>kts</small></p>
              <p class="from">desde <strong>{{ dirLabel }}</strong> · {{ Math.round(current.dirDeg) }}°</p>
              <StatusPill :tone="forecast.assessment.tone">{{ forecast.assessment.label }}</StatusPill>
            </div>
          </div>
          <p class="detail">{{ forecast.assessment.detail }}</p>

          <dl class="stats">
            <div><dt><Icon name="gust" :size="15" />Ráfaga</dt><dd class="mono">{{ formatKts(current.gustKts) }} kts</dd></div>
            <div><dt><Icon name="thermo" :size="15" />Temp.</dt><dd class="mono">{{ formatKts(current.tempC) }}°C</dd></div>
            <div><dt><Icon name="rain" :size="15" />Lluvia</dt><dd class="mono">{{ formatKts(current.precipMm, 1) }} mm</dd></div>
          </dl>

          <div class="window">
            <Icon name="clock" :size="18" />
            <p v-if="today?.window">
              Ventana de hoy: <strong class="mono">{{ today.window.label }}</strong> · {{ today.window.hours }} h
            </p>
            <p v-else-if="nextDay">
              Hoy sin ventana. Próxima: <strong>{{ formatDay(nextDay.date, { weekday: 'long', day: 'numeric' }) }}</strong>
              · <span class="mono">{{ nextDay.window.label }}</span>
            </p>
            <p v-else>Sin ventana navegable en los próximos días.</p>
          </div>
        </template>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  color: var(--text-inv);
  background:
    radial-gradient(120% 80% at 80% 0%, #0f4560 0%, transparent 60%),
    linear-gradient(180deg, var(--ink-950) 0%, var(--ink-900) 70%, var(--ink-800) 100%);
  padding: 28px 0 150px;
  min-height: calc(100svh - var(--header-h) - var(--tabbar-h));
  display: flex;
  align-items: center;
}
.art {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.sun {
  position: absolute;
  right: -10%;
  top: 6%;
  width: 60vw;
  max-width: 720px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 106, 61, 0.35), rgba(255, 106, 61, 0) 65%);
}
.kite {
  position: absolute;
  display: none;
  top: 8%;
  left: 52%;
  width: clamp(140px, 16vw, 240px);
  opacity: 0.9;
  animation: float 7s ease-in-out infinite;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.35));
}
@keyframes float {
  50% { transform: translate(-14px, 12px) rotate(-3deg); }
}
.waves {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: clamp(90px, 14vw, 190px);
}
.w1 { fill: rgba(27, 138, 166, 0.28); }
.w2 { fill: rgba(27, 138, 166, 0.4); }
.w3 { fill: var(--sand-50); }

.grid {
  position: relative;
  display: grid;
  gap: 32px;
  width: 100%;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sea-300);
}
h1 {
  font-size: clamp(2.8rem, 1.4rem + 6.6vw, 6.4rem);
  line-height: 0.95;
  margin-top: 16px;
}
.accent {
  display: block;
  color: var(--sun-500);
  font-weight: 500;
  font-style: italic;
  font-size: 0.62em;
  line-height: 1.05;
  margin-top: 6px;
}
.lead {
  margin-top: 20px;
  max-width: 46ch;
  font-size: clamp(1.05rem, 1rem + 0.4vw, 1.3rem);
  color: var(--text-inv-soft);
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.actions .btn {
  flex: 1 1 auto;
}

/* ---- Tarjeta de viento en vivo ---- */
.live {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(180, 225, 240, 0.2);
  backdrop-filter: blur(18px);
  border-radius: var(--r-lg);
  padding: 20px;
  box-shadow: var(--shadow-2);
}
.live-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.refresh {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-inv-soft);
  background: rgba(255, 255, 255, 0.06);
}
.refresh:hover { color: #fff; }
.live-head .eyebrow::before { display: none; }
.live-head .eyebrow { font-size: 11px; }
.reading {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 16px;
}
.speed {
  font-family: var(--font-display);
  font-size: clamp(3.4rem, 3rem + 2vw, 5rem);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.04em;
}
.speed small {
  font-size: 0.3em;
  margin-left: 6px;
  font-weight: 500;
  color: var(--text-inv-soft);
  letter-spacing: 0;
}
.from {
  margin: 6px 0 12px;
  color: var(--text-inv-soft);
  font-size: 14px;
}
.from strong { color: #fff; }
.detail {
  margin-top: 14px;
  font-size: 14px;
  color: var(--text-inv-soft);
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 16px;
}
.stats > div {
  padding: 12px;
  border-radius: var(--r-sm);
  background: rgba(4, 20, 29, 0.45);
  border: 1px solid var(--ink-line);
}
dt {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-inv-soft);
}
dd {
  margin-top: 4px;
  font-size: 1.05rem;
  font-weight: 700;
}
.window {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 14px;
  padding: 14px;
  border-radius: var(--r-sm);
  background: rgba(255, 106, 61, 0.14);
  border: 1px solid rgba(255, 106, 61, 0.35);
  font-size: 14px;
}
.window svg { color: var(--sun-500); flex: none; }

.fail { display: grid; justify-items: start; gap: 12px; padding: 12px 0; color: var(--text-inv-soft); }
.skeleton { display: flex; gap: 18px; align-items: center; padding: 8px 0 12px; }
.sk { background: linear-gradient(90deg, rgba(255,255,255,.06), rgba(255,255,255,.16), rgba(255,255,255,.06)); background-size: 200% 100%; animation: sh 1.4s infinite; border-radius: 12px; }
.sk-circle { width: 150px; height: 150px; border-radius: 50%; flex: none; }
.sk-col { flex: 1; display: grid; gap: 12px; }
.sk-line { height: 44px; }
.sk-line.short { width: 60%; height: 24px; }
@keyframes sh { to { background-position: -200% 0; } }

@media (min-width: 1024px) {
  .kite { display: block; }
  .hero { padding: 56px 0 200px; }
  .grid {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 72px;
    align-items: center;
  }
  .actions .btn { flex: 0 0 auto; }
  .live { padding: 28px; }
  .reading { gap: 24px; }
}
@media (max-width: 380px) {
  .reading { grid-template-columns: 1fr; justify-items: center; text-align: center; }
}
</style>
