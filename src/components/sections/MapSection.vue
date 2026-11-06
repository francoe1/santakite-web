<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Icon from '../ui/Icon.vue'

const props = defineProps({ spot: { type: Object, required: true } })

const tab = ref('zonas')
const unlocked = ref(false)
const mapEl = ref(null)
const map = shallowRef(null)
const mapError = ref('')

const cfg = computed(() => ({
  lat: props.spot.coordinates?.lat ?? 0,
  lon: props.spot.coordinates?.lon ?? 0,
  ...props.spot.map,
}))

const windyUrl = computed(
  () =>
    cfg.value.windyEmbedUrl ||
    `https://embed.windy.com/embed2.html?lat=${cfg.value.lat}&lon=${cfg.value.lon}&zoom=12&level=surface&overlay=wind&product=gfs`
)

const pinIcon = (label) =>
  L.divIcon({
    className: 'sk-pin',
    html: `<span title="${label.replace(/"/g, '&quot;')}"></span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -26],
  })

const setInteractive = (on) => {
  const m = map.value
  if (!m) return
  const fn = on ? 'enable' : 'disable'
  ;['dragging', 'touchZoom', 'scrollWheelZoom', 'doubleClickZoom', 'boxZoom', 'keyboard'].forEach((h) => m[h]?.[fn]())
}

const render = () => {
  if (!mapEl.value) return
  try {
    mapError.value = ''
    map.value?.remove()
    const v = cfg.value.view || { lat: cfg.value.lat, lon: cfg.value.lon, zoom: 15 }
    const m = L.map(mapEl.value, { zoomControl: false, attributionControl: true }).setView([v.lat, v.lon], v.zoom)
    L.control.zoom({ position: 'bottomright' }).addTo(m)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '© OpenStreetMap',
    }).addTo(m)

    ;(cfg.value.markers || []).forEach((mk) => {
      if (mk.lat != null && mk.lon != null) L.marker([mk.lat, mk.lon], { icon: pinIcon(mk.label ?? '') }).addTo(m).bindPopup(mk.label ?? '')
    })
    if (cfg.value.launchZone?.length)
      L.polygon(cfg.value.launchZone, { color: '#17a56f', fillColor: '#17a56f', fillOpacity: 0.35, weight: 2 })
        .addTo(m)
        .bindPopup('<b>Zona de kites</b><br>Armado, despegue y navegación cercana.')
    if (cfg.value.swimZone?.length)
      L.polygon(cfg.value.swimZone, { color: '#d6483b', fillColor: '#d6483b', fillOpacity: 0.28, weight: 2 })
        .addTo(m)
        .bindPopup('<b>Zona de bañistas</b><br>Sin kites mientras haya cometas.')
    map.value = m
    unlocked.value = false
    setInteractive(false)
  } catch (err) {
    console.error(err)
    mapError.value = 'No se pudo cargar el mapa en este entorno.'
  }
}

const unlock = () => {
  unlocked.value = true
  setInteractive(true)
}

const focusMarker = (mk) => {
  if (!map.value) return
  map.value.flyTo([mk.lat, mk.lon], Math.max(map.value.getZoom(), 16), { duration: 0.8 })
  document.getElementById('map-canvas')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}

onMounted(render)
onBeforeUnmount(() => map.value?.remove())
watch(() => props.spot.id, render)
watch(tab, async (t) => {
  unlocked.value = false
  if (t === 'zonas') {
    await nextTick()
    render()
  }
})
</script>

<template>
  <section id="mapa" class="section section--sand">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Mapa y zonas</p>
        <h2 class="section-title">Dónde armar, dónde navegar</h2>
        <p class="section-lead">Respetá los polígonos: la zona verde es de kites y la roja es de bañistas.</p>
      </div>

      <div class="tabs" role="tablist" aria-label="Tipo de mapa">
        <button role="tab" :aria-selected="tab === 'zonas'" :class="{ on: tab === 'zonas' }" @click="tab = 'zonas'">
          <Icon name="layers" :size="18" />Zonas del spot
        </button>
        <button role="tab" :aria-selected="tab === 'viento'" :class="{ on: tab === 'viento' }" @click="tab = 'viento'">
          <Icon name="wind" :size="18" />Viento en vivo
        </button>
      </div>

      <div class="board">
        <div class="stage">
          <div v-show="tab === 'zonas'" id="map-canvas" ref="mapEl" class="map" :class="{ locked: !unlocked }"></div>
          <div v-if="tab === 'viento'" class="windy" :class="{ locked: !unlocked }">
            <iframe :src="windyUrl" title="Mapa de viento Windy" loading="lazy" frameborder="0"></iframe>
          </div>
          <button v-if="!unlocked && !mapError" type="button" class="unlock" @click="unlock">
            <Icon name="map" :size="18" />Tocá para explorar
          </button>
          <p v-if="mapError" class="err">{{ mapError }}</p>
        </div>

        <aside class="side">
          <h3>Referencias</h3>
          <ul class="legend">
            <li><i class="sw sw-ok"></i><span><b>Zona de kites</b> Armado, despegue y navegación cercana.</span></li>
            <li><i class="sw sw-bad"></i><span><b>Zona de bañistas</b> Prohibido kites mientras haya bañistas.</span></li>
          </ul>
          <h3 v-if="cfg.markers?.length">Puntos de interés</h3>
          <ul class="pois">
            <li v-for="mk in cfg.markers" :key="mk.label">
              <button type="button" @click="tab = 'zonas'; focusMarker(mk)">
                <Icon name="pin" :size="18" /><span>{{ mk.label }}</span>
                <Icon name="arrow" :size="16" class="go" />
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tabs {
  display: inline-flex;
  padding: 5px;
  margin-bottom: 18px;
  gap: 4px;
  background: #fff;
  border: 1.5px solid var(--sand-line);
  border-radius: 999px;
  max-width: 100%;
}
.tabs button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-soft);
  white-space: nowrap;
}
.tabs button.on {
  background: var(--ink-900);
  color: #fff;
}
.board {
  display: grid;
  gap: 18px;
}
.stage {
  position: relative;
  border-radius: var(--r-lg);
  overflow: hidden;
  border: 1.5px solid var(--sand-line);
  background: var(--sea-100);
  height: 440px;
}
.map,
.windy,
.windy iframe {
  width: 100%;
  height: 100%;
}
.windy iframe {
  border: 0;
  display: block;
}
.locked,
.locked iframe {
  /* sin trampa de scroll mientras no se active */
  pointer-events: none;
}
.unlock {
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  z-index: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 20px;
  border-radius: 999px;
  background: var(--ink-900);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  box-shadow: var(--shadow-2);
}
.err {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  text-align: center;
  color: var(--text-soft);
}
.side {
  background: #fff;
  border: 1.5px solid var(--sand-line);
  border-radius: var(--r-lg);
  padding: 22px;
  display: grid;
  gap: 14px;
  align-content: start;
}
.side h3 {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-soft);
}
.legend {
  display: grid;
  gap: 12px;
}
.legend li {
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 12px;
  font-size: 14px;
  color: var(--text-soft);
}
.legend b {
  display: block;
  color: var(--text);
}
.sw {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  margin-top: 2px;
}
.sw-ok { background: rgba(23, 165, 111, 0.4); border: 2px solid var(--ok); }
.sw-bad { background: rgba(214, 72, 59, 0.3); border: 2px solid var(--bad); }
.pois button {
  width: 100%;
  display: grid;
  grid-template-columns: 22px 1fr 20px;
  gap: 10px;
  align-items: center;
  text-align: left;
  font-size: 14px;
  padding: 12px;
  border-radius: var(--r-sm);
  background: var(--sand-50);
  min-height: 52px;
}
.pois li + li { margin-top: 8px; }
.pois button:hover { background: var(--sand-100); }
.pois .go { opacity: 0.4; }

@media (min-width: 1024px) {
  .board {
    grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
    gap: 24px;
  }
  .stage { height: 600px; }
  .side { padding: 28px; }
}
</style>

<style>
.sk-pin span {
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50% 50% 50% 0;
  background: var(--sun-500);
  border: 3px solid #fff;
  transform: rotate(-45deg);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35);
}
</style>
