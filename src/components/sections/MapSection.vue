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
        <div class="card">
          <h3>Viento en vivo (GFS)</h3>
          <p class="muted">Visor centrado en Playa 52 con overlay de viento usando modelo GFS.</p>
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
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: linear-gradient(120deg, rgba(3, 23, 39, 0.7), rgba(4, 29, 49, 0.82));
  border-radius: 1.5rem;
  padding: 1.2rem;
  border: 1px solid rgba(125, 242, 221, 0.12);
  box-shadow: 0 22px 46px rgba(2, 10, 24, 0.45);
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
  color: #94a3b8;
}

h2 {
  font-size: clamp(1.6rem, 2.5vw, 2rem);
  margin-bottom: 0.35rem;
}

.muted {
  color: #cbd5e1;
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
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid rgba(125, 242, 221, 0.35);
  box-shadow: 0 14px 38px rgba(2, 10, 24, 0.7);
  position: relative;
  z-index: 0;
}

.card {
  padding: 1.2rem;
  border-radius: 1rem;
  background: radial-gradient(circle at 80% 10%, rgba(94, 234, 212, 0.1), transparent 40%),
    linear-gradient(145deg, rgba(5, 26, 46, 0.76), rgba(6, 20, 38, 0.92));
  border: 1px solid rgba(56, 189, 248, 0.25);
  box-shadow: 0 14px 38px rgba(2, 10, 24, 0.7);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.card h3 {
  font-size: 1.1rem;
}

.windy-wrapper {
  border-radius: 0.9rem;
  overflow: hidden;
  border: 1px solid rgba(125, 242, 221, 0.28);
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
  color: #cbd5e1;
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
