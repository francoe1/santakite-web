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
        <p class="eyebrow">El spot</p>
        <h2 class="section-title">{{ spot.name }}</h2>
        <p class="section-lead">{{ spot.location }}</p>
      </div>

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
            <WindCompass :deg="null" :preferred="cfg.preferredDirections" :size="200" :dark="false" label="Direcciones ideales del spot" />
            <div>
              <p class="mini">Viento ideal</p>
              <p class="dirs mono">{{ cfg.preferredDirections.join(' · ') }}</p>
              <p class="note">Sectores verdes en la brújula.</p>
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
.layout {
  display: grid;
  gap: 28px;
}
.highlights {
  display: grid;
}
.hl {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 14px;
  padding: 22px 0;
  border-top: 1.5px solid var(--sand-line);
}
.hl:last-child {
  border-bottom: 1.5px solid var(--sand-line);
}
.num {
  font-size: 13px;
  font-weight: 700;
  color: var(--sun-600);
  padding-top: 6px;
}
.hl h3 {
  font-size: 1.35rem;
  margin-bottom: 8px;
}
.hl p {
  color: var(--text-soft);
}
.sheet {
  background: #fff;
  border: 1.5px solid var(--sand-line);
  border-radius: var(--r-lg);
  padding: 22px;
  display: grid;
  gap: 22px;
  align-content: start;
}
.wind-box {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  align-items: center;
}
.mini {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-soft);
}
.dirs {
  font-size: 1.15rem;
  font-weight: 700;
  margin-top: 4px;
  color: var(--ok);
}
.note {
  font-size: 13px;
  color: var(--text-soft);
  margin-top: 6px;
}
.facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.facts > div {
  padding: 14px;
  background: var(--sand-50);
  border-radius: var(--r-sm);
}
dt {
  font-size: 12px;
  color: var(--text-soft);
}
dd {
  font-weight: 700;
  font-size: 0.95rem;
  margin: 2px 0;
}
.facts small {
  color: var(--text-soft);
  font-size: 12px;
}
.where {
  display: grid;
  gap: 12px;
  padding-top: 18px;
  border-top: 1.5px dashed var(--sand-line);
}
.coords {
  font-size: 0.95rem;
  font-weight: 600;
}
.where-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.btn.dark {
  color: var(--ink-900);
}
.btn.dark:hover {
  background: var(--sand-100);
}

@media (max-width: 380px) {
  .wind-box { grid-template-columns: 1fr; justify-items: center; text-align: center; }
}
@media (min-width: 1024px) {
  .layout {
    grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
    gap: 72px;
    align-items: start;
  }
  .hl {
    grid-template-columns: 72px 1fr;
    padding: 32px 0;
  }
  .hl h3 {
    font-size: 1.6rem;
  }
  .sheet {
    padding: 32px;
    position: sticky;
    top: calc(var(--header-h) + 24px);
  }
}
</style>
