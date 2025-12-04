<template>
  <section id="mapa" class="section">
    <div class="section-head">
      <p class="eyebrow">Mapa y zonas</p>
    </div>

    <div class="grid">
      <div>
        <div ref="mapEl" class="map"></div>
        <div class="zones-legend">
          <div class="legend-item">
            <span class="legend-color legend-launch"></span>
            Zona de kites (despegue / navegación cercana)
          </div>
          <div class="legend-item">
            <span class="legend-color legend-swim"></span>
            Prohibido bañistas cuando hay cometas
          </div>
        </div>
        <p v-if="mapError" class="muted" style="margin-top: 0.5rem;">{{ mapError }}</p>
      </div>
      <div>
        <div class="windy-wrapper">
          <iframe
            width="100%"
            height="320"
            :src="windyUrl"
            frameborder="0"
            scrolling="no"
            loading="lazy"
          ></iframe>
          <div class="windy-guard" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  spot: {
    type: Object,
    required: true,
  },
})

const mapEl = ref(null)
const mapError = ref('')
const mapInstance = ref(null)
let leafletModule = null

const mapConfig = computed(() => ({
  lat: props.spot.coordinates?.lat ?? 0,
  lon: props.spot.coordinates?.lon ?? 0,
  ...props.spot.map,
}))

const windyUrl = computed(
  () =>
    mapConfig.value.windyEmbedUrl ||
    `https://embed.windy.com/embed2.html?lat=${mapConfig.value.lat}&lon=${mapConfig.value.lon}&zoom=12&level=surface&overlay=wind&product=gfs`
)

const resetMapContainer = () => {
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }
  if (mapEl.value) {
    mapEl.value.innerHTML = ''
  }
}

const loadLeaflet = async () => {
  if (!leafletModule) {
    leafletModule = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js')
  }
  return leafletModule
}

const renderMap = async () => {
  if (!mapEl.value) return

  try {
    mapError.value = ''
    const L = await loadLeaflet()
    resetMapContainer()

    const view = mapConfig.value.view || {
      lat: mapConfig.value.lat - 0.005,
      lon: mapConfig.value.lon - 0.003,
      zoom: 14.5,
    }

    mapInstance.value = L.map(mapEl.value, {
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false,
      keyboard: false,
      zoomControl: false,
      tap: false,
    }).setView([view.lat, view.lon], view.zoom)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      minZoom: 10,
    }).addTo(mapInstance.value)

    if (Array.isArray(mapConfig.value.markers)) {
      mapConfig.value.markers.forEach((marker) => {
        if (marker.lat != null && marker.lon != null) {
          L.marker([marker.lat, marker.lon]).addTo(mapInstance.value).bindPopup(marker.label ?? '')
        }
      })
    }

    if (Array.isArray(mapConfig.value.launchZone) && mapConfig.value.launchZone.length) {
      L.polygon(mapConfig.value.launchZone, {
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 0.35,
        weight: 2,
      })
        .addTo(mapInstance.value)
        .bindPopup('Zona de kites (despegue / aterrizaje / navegación cercana)')
    }

    if (Array.isArray(mapConfig.value.swimZone) && mapConfig.value.swimZone.length) {
      L.polygon(mapConfig.value.swimZone, {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.25,
        weight: 2,
      })
        .addTo(mapInstance.value)
        .bindPopup('Prohibido bañistas cuando hay cometas')
    }
  } catch (err) {
    console.error(err)
    mapError.value = 'No se pudo cargar el mapa en este entorno.'
  }
}

onMounted(renderMap)

watch(
  mapConfig,
  () => {
    renderMap()
  },
  { deep: true }
)
</script>

<style scoped>
@import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

.section {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #ffffff;
  padding: 1.4rem;
  border: 1px solid #dfe7ec;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: #0f4c5c;
  font-weight: 800;
}

h2 {
  font-size: clamp(1.6rem, 2.6vw, 2.15rem);
  margin-bottom: 0.35rem;
  color: #0b1f2a;
}

.muted {
  color: #0f4c5c;
  max-width: 640px;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 1.25rem;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.map {
  width: 100%;
  height: 360px;
  border: 1px solid #dfe7ec;
  position: relative;
  z-index: 0;
}

.card {
  padding: 1.2rem;
  background: #f9fcfd;
  border: 1px solid #dfe7ec;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.card h3 {
  font-size: 1.12rem;
  color: #0b2f3f;
}

.windy-wrapper {
  border: 1px solid #dfe7ec;
  position: relative;
}

.windy-guard {
  position: absolute;
  inset: 0;
  bottom: 72px;
  z-index: 2;
  pointer-events: auto;
  background: transparent;
}

.zones-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.5rem;
  margin-top: 0.75rem;
  color: #0f4c5c;
  font-size: 0.9rem;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 18px;
  height: 18px;
  display: inline-block;
}

.legend-launch {
  background: rgba(34, 197, 94, 0.4);
  border: 1px solid #22c55e;
}

.legend-swim {
  background: rgba(239, 68, 68, 0.35);
  border: 1px solid #ef4444;
}
</style>
