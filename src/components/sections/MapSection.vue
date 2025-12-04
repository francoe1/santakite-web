<template>
  <section id="mapa" class="section">
    <div class="section-head">
      <div>
        <h2>Mapa y Zonas</h2>
        <p>
          Ubicación del spot y distribución de zonas para kitesurf y bañistas.
          <strong>Respetar las áreas para una convivencia segura.</strong>
        </p>
      </div>
    </div>

    <div class="grid">
      <div class="map-container">
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
        <p v-if="mapError" style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--slate-500)">{{ mapError }}</p>
      </div>
      <div class="card">
        <h3>Viento en vivo (GFS)</h3>
        <p>Visor centrado en Playa 52 con overlay de viento usando modelo GFS.</p>
        <div class="windy-wrapper">
          <iframe
            width="100%"
            height="320"
            src="https://embed.windy.com/embed2.html?lat=-30.9085&lon=-57.915&zoom=12&level=surface&overlay=wind&product=gfs"
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
import { onMounted, ref } from 'vue'

const mapEl = ref(null)
const mapError = ref('')

const spotLat = -30.9085
const spotLon = -57.915

onMounted(async () => {
  if (!mapEl.value) return

  try {
    const L = await import('https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js')

    const map = L.map(mapEl.value, {
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false,
      keyboard: false,
      zoomControl: false,
      tap: false,
    }).setView([spotLat - 0.005, spotLon - 0.003], 14.5)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      minZoom: 10,
    }).addTo(map)

    L.marker([spotLat, spotLon + 0.001]).addTo(map).bindPopup('Playa 52 - Spot de Kitesurf')
    L.marker([spotLat - 0.004, spotLon + 0.001])
      .addTo(map)
      .bindPopup('Construcción cercana: tener precaución con niveles bajos de agua')

    const launchZoneCoords = [
      [spotLat + 0.0005, spotLon],
      [spotLat + 0.0005, spotLon + 0.002],
      [spotLat - 0.0002, spotLon + 0.002],
      [spotLat - 0.0002, spotLon],
    ]

    const swimZoneCoords = [
      [spotLat - 0.0002, spotLon],
      [spotLat - 0.0002, spotLon + 0.002],
      [spotLat - 0.0051, spotLon + 0.002],
      [spotLat - 0.0051, spotLon - 0.009],
      [spotLat - 0.003, spotLon - 0.008],
      [spotLat - 0.001, spotLon - 0.005],
    ]

    L.polygon(launchZoneCoords, {
      color: '#22c55e',
      fillColor: '#22c55e',
      fillOpacity: 0.35,
      weight: 2,
    })
      .addTo(map)
      .bindPopup('Zona de kites (despegue / aterrizaje / navegación cercana)')

    L.polygon(swimZoneCoords, {
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.25,
      weight: 2,
    })
      .addTo(map)
      .bindPopup('Prohibido bañistas cuando hay cometas')
  } catch (err) {
    console.error(err)
    mapError.value = 'No se pudo cargar el mapa en este entorno.'
  }
})
</script>

<style scoped>
@import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');

.section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--slate-200);
}

.section-head {
  max-width: 720px;
  margin: 0 auto 2.5rem;
  text-align: center;
}

h2 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  margin-bottom: 0.5rem;
  font-weight: 700;
}

p {
  color: var(--slate-600);
  font-size: 1.1rem;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 1.5rem;
}

@media (max-width: 1000px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.map-container {
  background: white;
  padding: 1rem;
  border-radius: 1.25rem;
  border: 1px solid var(--slate-200);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.map {
  width: 100%;
  height: 380px;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  z-index: 0;
}

.card {
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: white;
  border: 1px solid var(--slate-200);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.card p {
  font-size: 1rem;
  color: var(--slate-500);
}

.windy-wrapper {
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--slate-200);
  position: relative;
  margin-top: 0.5rem;
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
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--slate-600);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 6px;
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
