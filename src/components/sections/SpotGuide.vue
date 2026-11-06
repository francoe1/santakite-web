<script setup>
import { computed, ref } from 'vue'
import Icon from '../ui/Icon.vue'
import WindCompass from '../ui/WindCompass.vue'
import { getSpotConfig } from '@/utils/forecast'

const props = defineProps({ spot: { type: Object, required: true } })

const cfg = computed(() => getSpotConfig(props.spot))
const pad = (n) => String(n).padStart(2, '0')
const win = (w) => `${pad(w.startHour)}:00 – ${pad(w.endHour)}:00`

const facts = computed(() => [
  { label: 'Viento mínimo', value: `${cfg.value.minPlayableKts} kts`, hint: 'Para salir con comodidad' },
  { label: 'Lluvia máxima', value: `${cfg.value.maxPrecipMm} mm/h`, hint: 'Más que eso cierra la ventana' },
  { label: 'Horario verano', value: win(cfg.value.summerWindow), hint: 'Noviembre a febrero' },
  { label: 'Horario invierno', value: win(cfg.value.winterWindow), hint: 'Marzo a octubre' },
])

const copied = ref(false)
const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.spot.references?.coordinatesLabel ?? '')
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    /* sin portapapeles: no hacemos nada */
  }
}
const mapsUrl = computed(
  () => `https://www.google.com/maps/dir/?api=1&destination=${props.spot.coordinates.lat},${props.spot.coordinates.lon}`
)
</script>

<template>
  <section id="spot" class="section">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">[03] El spot</p>
        <h2 class="section-title">{{ spot.name }}</h2>
        <p class="section-lead hand place">{{ spot.location }}</p>
      </div>

      <p v-if="!spot.verified" class="review"><b>Spot en revisión.</b> La ubicación es aproximada y los datos del lugar (zonas, dirección ideal del viento) todavía no están confirmados. Consultá con escuelas y riders locales antes de ir.</p>

      <div class="layout">
        <div class="highlights reveal">
          <article v-for="(h, i) in spot.highlights" :key="h.title" class="hl">
            <span class="num mono">{{ String(i + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ h.title }}</h3>
              <p>{{ h.description }}</p>
            </div>
          </article>
        </div>

        <aside class="sheet reveal">
          <div class="wind-box">
            <WindCompass v-if="!cfg.anyDirection" :deg="null" :preferred="cfg.preferredDirections" :size="200" :dark="false" label="Direcciones ideales del spot" />
            <div>
              <p class="mini">Viento ideal</p>
              <p v-if="!cfg.anyDirection" class="dirs mono">{{ cfg.preferredDirections.join(' · ') }}</p>
              <p v-else class="dirs mono">Sin confirmar</p>
              <p class="note">{{ cfg.anyDirection ? `Por ahora evaluamos solo la fuerza: desde ${cfg.minPlayableKts} nudos.` : 'Sectores verdes en la brújula.' }}</p>
            </div>
          </div>
          <dl class="facts">
            <div v-for="f in facts" :key="f.label">
              <dt>{{ f.label }}</dt>
              <dd class="mono">{{ f.value }}</dd>
              <small>{{ f.hint }}</small>
            </div>
          </dl>
          <div class="where">
            <div>
              <p class="mini">Coordenadas</p>
              <p class="mono coords">{{ spot.references?.coordinatesLabel }}</p>
            </div>
            <div class="where-actions">
              <button type="button" class="btn btn--sm btn--ghost dark" @click="copy">
                <Icon :name="copied ? 'check' : 'copy'" :size="16" />{{ copied ? 'Copiado' : 'Copiar' }}
              </button>
              <a :href="mapsUrl" target="_blank" rel="noreferrer" class="btn btn--sm btn--dark">
                <Icon name="route" :size="16" />Cómo llegar
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-title { font-size: clamp(3.4rem, 1rem + 12vw, 11rem); }
.place { font-size: 1.5rem; font-weight: 400; margin-top: 10px; transform: rotate(-1.5deg); display: inline-block; background: var(--yellow); padding: 2px 12px; }
.layout { display: grid; gap: 36px; }
.hl { display: grid; grid-template-columns: 76px 1fr; gap: 12px; padding: 22px 0; border-top: var(--bw) solid var(--ink); }
.hl:last-child { border-bottom: var(--bw) solid var(--ink); }
.num { font-family: var(--font-display); font-size: 3.4rem; line-height: 0.85; color: transparent; -webkit-text-stroke: 1.5px var(--ink); }
.hl h3 { font-size: 1.9rem; margin-bottom: 8px; }
.hl p { font-weight: 500; }
.sheet { background: var(--paper); border: var(--bw) solid var(--ink); box-shadow: var(--shadow); display: grid; align-content: start; }
.sheet > * { padding: 18px; border-bottom: var(--bw) solid var(--ink); }
.sheet > :last-child { border-bottom: 0; }
.wind-box { display: grid; grid-template-columns: auto 1fr; gap: 18px; align-items: center; background: var(--volt); }
.wind-box:has(> div:only-child) { grid-template-columns: 1fr; }
.mini { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.dirs { font-family: var(--font-display); font-size: 2.2rem; line-height: 1; margin-top: 4px; }
.note { font-size: 13px; margin-top: 6px; }
.facts { display: grid; grid-template-columns: 1fr 1fr; padding: 0 !important; }
.facts > div { padding: 14px 16px; border-right: var(--bw) solid var(--ink); border-bottom: var(--bw) solid var(--ink); }
.facts > div:nth-child(2n) { border-right: 0; }
.facts > div:nth-last-child(-n + 2) { border-bottom: 0; }
dt { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
dd { font-family: var(--font-display); font-size: 1.5rem; line-height: 1.1; margin: 2px 0; }
.facts small { font-size: 12px; }
.where { display: grid; gap: 12px; }
.coords { font-weight: 700; }
.where-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.btn.dark { color: var(--ink); }
@media (max-width: 380px) { .wind-box { grid-template-columns: 1fr; justify-items: center; text-align: center; } }
@media (min-width: 1024px) {
  .layout { grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 80px; align-items: start; }
  .hl { grid-template-columns: 120px 1fr; padding: 34px 0; }
  .num { font-size: 6rem; }
  .hl h3 { font-size: 2.6rem; }
  .sheet { position: sticky; top: calc(var(--header-h) + 24px); }
}
</style>
