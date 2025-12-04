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

<template>
  <section id="mapa" class="section-block">
    <div class="section-header">
      <div>
        <p class="section-eyebrow">Mapa y zonas</p>
        <h2 class="section-title">Ubicación y áreas seguras</h2>
        <p class="section-description">Delimitamos sectores para lanzar y para bañistas. Revisá antes de entrar al agua.</p>
      </div>
      <div class="tag bg-[var(--accent-2)]/15 text-[var(--accent-2)]">Modo offline seguro</div>
    </div>

    <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="space-y-3">
        <div ref="mapEl" class="h-[360px] w-full overflow-hidden rounded-2xl border border-[var(--outline)]/60 bg-[var(--surface-card)]"></div>
        <div class="grid gap-2 sm:grid-cols-2 text-sm text-muted">
          <div class="flex items-center gap-2">
            <span class="h-4 w-4 rounded bg-emerald-400 shadow-sm"></span>
            Zona de kites (despegue / navegación cercana)
          </div>
          <div class="flex items-center gap-2">
            <span class="h-4 w-4 rounded bg-rose-400 shadow-sm"></span>
            Prohibido bañistas cuando hay cometas
          </div>
        </div>
        <p v-if="mapError" class="text-sm text-muted">{{ mapError }}</p>
      </div>

      <div class="glass-card p-4 md:p-5 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="section-eyebrow">Viento en vivo</p>
            <h3 class="text-xl font-bold">Overlay GFS</h3>
          </div>
          <span class="tag bg-[var(--accent)]/10 text-[var(--accent)]">Windy</span>
        </div>
        <p class="text-muted text-sm">Visor centrado en Playa 52 con capa de viento del modelo GFS.</p>
        <div class="relative overflow-hidden rounded-2xl border border-[var(--outline)]/60">
          <iframe
            width="100%"
            height="320"
            src="https://embed.windy.com/embed2.html?lat=-30.9085&lon=-57.915&zoom=12&level=surface&overlay=wind&product=gfs"
            frameborder="0"
            scrolling="no"
            loading="lazy"
            title="Windy GFS Playa 52"
          ></iframe>
          <div class="absolute inset-0 pointer-events-none" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@import url('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
</style>
