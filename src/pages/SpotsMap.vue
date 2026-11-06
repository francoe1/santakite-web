<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Icon from '@/components/ui/Icon.vue'
import KiteMark from '@/components/fx/KiteMark.vue'
import StatusPill from '@/components/ui/StatusPill.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import spots from '@/data/spots.json'
import { useSiteStore } from '@/stores/site'
import { useForecastStore } from '@/stores/forecast'
import { useSeo } from '@/composables/useSeo'
import { buildForecast, formatKts } from '@/utils/forecast'
import { degToCompass } from '@/utils/wind'
import { COUNTRY_COLORS, COUNTRY_ORDER, distanceKm, normalize } from '@/utils/geo'

useSeo(null, { page: 'map' })
const router = useRouter()
const site = useSiteStore()
const store = useForecastStore()

const query = ref('')
const country = ref('')
const selectedId = ref(null)
const me = ref(null) // { lat, lon } si el usuario permitió ubicarse
const geoMsg = ref('')
const mapEl = ref(null)
const map = shallowRef(null)
const markers = new Map()
let meMarker = null

const countries = COUNTRY_ORDER.map((code) => ({ code, name: spots.find((s) => s.country === code)?.countryName, count: spots.filter((s) => s.country === code).length }))

const filtered = computed(() => {
  const q = normalize(query.value)
  const list = spots
    .filter((s) => (!country.value || s.country === country.value) && (!q || normalize(`${s.name} ${s.locality} ${s.region} ${s.countryName}`).includes(q)))
    .map((s) => ({ spot: s, km: me.value ? distanceKm(me.value, s.coordinates) : null }))
  return me.value
    ? list.sort((a, b) => a.km - b.km)
    : list.sort((a, b) => COUNTRY_ORDER.indexOf(a.spot.country) - COUNTRY_ORDER.indexOf(b.spot.country) || a.spot.name.localeCompare(b.spot.name))
})

const selected = computed(() => spots.find((s) => s.id === selectedId.value) ?? null)
const sel = computed(() => {
  if (!selected.value) return null
  const entry = store.entry(selected.value.id)
  return { ...buildForecast(selected.value, entry.raw), status: entry.status }
})

const pinIcon = (s, on = false) =>
  L.divIcon({
    className: 'sk-pin2',
    html: `<span class="${on ? 'on' : ''}" style="--c:${COUNTRY_COLORS[s.country]}" title="${s.name}"></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  })

const fit = (list) => {
  if (!map.value || !list.length) return
  const b = L.latLngBounds(list.map((s) => [s.coordinates.lat, s.coordinates.lon]))
  map.value.fitBounds(b, { padding: [50, 50], maxZoom: 9, animate: true })
}

const select = (id, { fly = true } = {}) => {
  const prev = markers.get(selectedId.value)
  if (prev) prev.setIcon(pinIcon(spots.find((s) => s.id === selectedId.value)))
  selectedId.value = id
  const s = spots.find((x) => x.id === id)
  if (!s) return
  markers.get(id)?.setIcon(pinIcon(s, true)).setZIndexOffset(1000)
  store.load(s)
  if (fly && map.value) map.value.flyTo([s.coordinates.lat, s.coordinates.lon], Math.max(map.value.getZoom(), 10), { duration: 0.8 })
}

const syncMarkers = () => {
  const ids = new Set(filtered.value.map((x) => x.spot.id))
  markers.forEach((m, id) => {
    if (ids.has(id) && !map.value.hasLayer(m)) m.addTo(map.value)
    if (!ids.has(id) && map.value.hasLayer(m)) map.value.removeLayer(m)
  })
}

onMounted(async () => {
  await nextTick()
  map.value = L.map(mapEl.value, { zoomControl: false, minZoom: 3, attributionControl: true })
  L.control.zoom({ position: 'bottomright' }).addTo(map.value)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(map.value)
  spots.forEach((s) => {
    const m = L.marker([s.coordinates.lat, s.coordinates.lon], { icon: pinIcon(s), keyboard: false, riseOnHover: true })
    m.on('click', () => select(s.id, { fly: false }))
    markers.set(s.id, m)
  })
  syncMarkers()
  fit(spots)
  const from = new URLSearchParams(window.location.search).get('spot')
  if (from) select(from)
})
onBeforeUnmount(() => map.value?.remove())

watch(filtered, (list) => {
  if (!map.value) return
  syncMarkers()
  if (!me.value && (query.value || country.value)) fit(list.map((x) => x.spot))
})

const locate = () => {
  geoMsg.value = ''
  if (!navigator.geolocation) return (geoMsg.value = 'Tu navegador no permite ubicarte.')
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      me.value = { lat: pos.coords.latitude, lon: pos.coords.longitude }
      if (meMarker) map.value.removeLayer(meMarker)
      meMarker = L.circleMarker([me.value.lat, me.value.lon], { radius: 8, color: '#0b0b0b', weight: 3, fillColor: '#2536ff', fillOpacity: 1 }).addTo(map.value)
      const nearest = [...spots].sort((a, b) => distanceKm(me.value, a.coordinates) - distanceKm(me.value, b.coordinates))[0]
      fit([nearest, { coordinates: me.value }])
      select(nearest.id, { fly: false })
    },
    () => (geoMsg.value = 'No pudimos obtener tu ubicación. Revisá el permiso del navegador.'),
    { enableHighAccuracy: false, timeout: 10000 }
  )
}

const openSpot = (id) => {
  site.setCurrentSpotId(id)
  router.push({ name: 'spot', params: { id } })
}
const mapsUrl = (s) => `https://www.google.com/maps/dir/?api=1&destination=${s.coordinates.lat},${s.coordinates.lon}`
const first = () => filtered.value[0] && select(filtered.value[0].spot.id)
</script>

<template>
  <header class="mh">
    <div class="container bar">
      <router-link to="/" class="brand" aria-label="SantaKite, inicio">
        <KiteMark class="logo" /><span class="wordmark">Santa<b>Kite</b></span>
      </router-link>
      <router-link to="/" class="btn btn--sm back"><Icon name="arrow" :size="16" class="flip" />Volver al viento</router-link>
    </div>
  </header>

  <main id="contenido" tabindex="-1" class="page">
    <div class="container head">
      <p class="eyebrow">[ ] Mapa de spots</p>
      <h1>Encontrá tu spot</h1>
      <p class="lead">{{ spots.length }} spots de kitesurf en Argentina, Brasil y Uruguay. Tocá uno para ver si sopla ahora.</p>
    </div>

    <div class="container layout">
      <!-- Panel: búsqueda + lista -->
      <section class="panel" aria-label="Buscar spots">
        <div class="tools">
          <input v-model="query" class="search" type="search" placeholder="Buscar spot, ciudad o país" aria-label="Buscar spot" @keyup.enter="first" />
          <div class="chips" role="group" aria-label="Filtrar por país">
            <button type="button" class="chip" :class="{ on: !country }" :aria-pressed="!country" @click="country = ''">Todos <b>{{ spots.length }}</b></button>
            <button v-for="c in countries" :key="c.code" type="button" class="chip" :class="{ on: country === c.code }" :aria-pressed="country === c.code" @click="country = country === c.code ? '' : c.code">
              <i class="dot" :style="{ background: COUNTRY_COLORS[c.code] }"></i>{{ c.name }} <b>{{ c.count }}</b>
            </button>
          </div>
          <button type="button" class="btn btn--sm near" @click="locate"><Icon name="pin" :size="16" />Spots cerca mío</button>
          <p v-if="geoMsg" class="geomsg">{{ geoMsg }}</p>
        </div>

        <ul class="list">
          <li v-for="{ spot, km } in filtered" :key="spot.id">
            <button type="button" class="item" :class="{ on: spot.id === selectedId }" @click="select(spot.id)">
              <i class="dot" :style="{ background: COUNTRY_COLORS[spot.country] }"></i>
              <span class="t"><strong>{{ spot.name }}</strong><small>{{ spot.region }} · {{ spot.countryName }}<template v-if="!spot.verified"> · en revisión</template></small></span>
              <span v-if="km !== null" class="km mono">{{ Math.round(km) }} km</span>
              <Icon name="arrow" :size="16" class="go" />
            </button>
          </li>
          <li v-if="!filtered.length" class="none">No encontramos spots para “{{ query }}”.</li>
        </ul>
      </section>

      <!-- Mapa + ficha del spot elegido -->
      <section class="stage" aria-label="Mapa">
        <div ref="mapEl" class="map"></div>

        <article v-if="selected" class="card" aria-live="polite">
          <header>
            <div>
              <p class="mini mono">{{ selected.region }} · {{ selected.countryName }}</p>
              <h2>{{ selected.name }}</h2>
            </div>
            <button type="button" class="x" aria-label="Cerrar" @click="selectedId = null"><Icon name="close" :size="18" /></button>
          </header>

          <div v-if="sel.status === 'loading' || sel.status === 'idle'" class="load mono">Consultando el viento…</div>
          <div v-else-if="!sel.current" class="load mono">Sin datos de viento por ahora.</div>
          <template v-else>
            <div class="verdict">
              <span class="v" :class="`tone-${sel.assessment.tone}`">{{ sel.assessment.verdict }}</span>
              <div>
                <p class="speed mono">{{ formatKts(sel.current.speedKts) }} kts <small>desde {{ degToCompass(sel.current.dirDeg) }}</small></p>
                <StatusPill :tone="sel.assessment.tone">{{ sel.assessment.label }}</StatusPill>
              </div>
            </div>
            <p class="win mono">
              <template v-if="sel.today?.window">Hoy sopla {{ sel.today.window.label }}</template>
              <template v-else>Hoy sin ventana navegable</template>
            </p>
          </template>

          <p v-if="!selected.verified" class="rev">Spot en revisión: ubicación aproximada{{ selected.forecast.anyDirection ? ' y dirección ideal sin confirmar' : '' }}.</p>

          <div class="acts">
            <button type="button" class="btn btn--primary btn--sm" @click="openSpot(selected.id)">Abrir spot <Icon name="arrow" :size="16" /></button>
            <a :href="mapsUrl(selected)" target="_blank" rel="noreferrer" class="btn btn--sm">Cómo llegar</a>
          </div>
        </article>
      </section>
    </div>
  </main>

  <SiteFooter :nav-items="[]" :spots="site.nearby(6)" @select-spot="openSpot" />
</template>

<style scoped>
.mh { position: sticky; top: 0; z-index: 60; background: var(--paper); border-bottom: var(--bw) solid var(--ink); }
.bar { height: var(--header-h); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.brand { display: inline-flex; align-items: center; gap: 10px; }
.logo { width: 34px; height: 34px; }
.wordmark { font-family: var(--font-display); font-size: 1.7rem; text-transform: uppercase; line-height: 1; }
.wordmark b { font-weight: 400; background: var(--volt); padding: 0 4px; margin-left: 1px; }
.flip { transform: scaleX(-1); }

.page { padding: 28px 0 56px; }
.head { margin-bottom: 20px; }
h1 { font-size: clamp(3rem, 1.5rem + 8vw, 8rem); margin-top: 14px; }
.lead { margin-top: 10px; font-weight: 600; max-width: 52ch; }
.layout { display: grid; gap: 20px; }

.panel { border: var(--bw) solid var(--ink); background: var(--paper); box-shadow: var(--shadow); display: flex; flex-direction: column; min-height: 0; }
.tools { display: grid; gap: 10px; padding: 12px; border-bottom: var(--bw) solid var(--ink); }
.search { width: 100%; min-height: 48px; padding: 0 14px; border: var(--bw) solid var(--ink); background: #fff; font: 600 15px var(--font-body); }
.search:focus { outline: none; background: var(--volt); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { display: inline-flex; align-items: center; gap: 6px; min-height: 34px; padding: 0 10px; border: var(--bw) solid var(--ink); background: var(--paper); font-family: var(--font-mono); font-size: 12px; font-weight: 700; text-transform: uppercase; }
.chip.on { background: var(--ink); color: var(--volt); }
.chip b { font-weight: 700; opacity: 0.7; }
.dot { width: 12px; height: 12px; border: 2px solid var(--ink); flex: none; display: inline-block; }
.near { justify-self: start; }
.geomsg { font-size: 13px; background: var(--yellow); padding: 6px 10px; border: var(--bw) solid var(--ink); }
.list { overflow: auto; max-height: 340px; overscroll-behavior: contain; }
.item { width: 100%; display: grid; grid-template-columns: 14px 1fr auto 18px; gap: 10px; align-items: center; text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--paper-3); min-height: 56px; }
.item:hover { background: var(--paper-2); }
.item.on { background: var(--volt); }
.t strong { display: block; font-family: var(--font-display); font-weight: 400; font-size: 1.35rem; text-transform: uppercase; line-height: 1.05; }
.t small { font-size: 12px; color: #333; }
.km { font-size: 12px; font-weight: 700; }
.go { opacity: 0.4; }
.none { padding: 20px 14px; font-size: 14px; }

.stage { position: relative; border: var(--bw) solid var(--ink); box-shadow: var(--shadow); background: var(--paper-2); min-height: 420px; z-index: 0; isolation: isolate; }
.map { position: absolute; inset: 0; }
.card { position: absolute; left: 10px; right: 10px; bottom: 10px; z-index: 500; display: grid; gap: 10px; padding: 14px; background: var(--paper); border: var(--bw) solid var(--ink); box-shadow: var(--shadow-sm); }
.card header { display: flex; justify-content: space-between; gap: 10px; }
.mini { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.card h2 { font-size: 2.2rem; }
.x { width: 34px; height: 34px; display: grid; place-items: center; border: var(--bw) solid var(--ink); background: var(--volt); flex: none; }
.load { font-size: 13px; }
.verdict { display: flex; align-items: center; gap: 14px; }
.v { font-family: var(--font-display); font-size: 3rem; line-height: 1; padding: 6px 14px 2px; border: var(--bw) solid var(--ink); background: var(--paper-2); box-shadow: 4px 4px 0 var(--ink); }
.tone-ok { background: var(--volt); } .tone-warn { background: var(--yellow); } .tone-bad, .tone-muted { background: var(--red); }
.speed { font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
.speed small { font-weight: 400; font-size: 0.8em; }
.win { font-size: 13px; font-weight: 700; }
.rev { font-size: 12px; background: var(--yellow); padding: 6px 10px; border: var(--bw) solid var(--ink); }
.acts { display: flex; flex-wrap: wrap; gap: 8px; }

@media (min-width: 1024px) {
  .layout { grid-template-columns: 400px minmax(0, 1fr); gap: 32px; align-items: stretch; }
  .panel { height: calc(100vh - var(--header-h) - 220px); min-height: 520px; }
  .list { max-height: none; flex: 1; }
  .stage { height: calc(100vh - var(--header-h) - 220px); min-height: 520px; }
  .card { left: 16px; right: auto; bottom: 16px; width: 380px; }
}
@media (max-width: 1023px) {
  .stage { height: 62vh; order: -1; }
}
</style>

<style>
.sk-pin2 span { display: block; width: 28px; height: 28px; background: var(--c, #c9ff2f); border: 3px solid #0b0b0b; transform: rotate(45deg); box-shadow: 3px 3px 0 #0b0b0b; transition: transform 0.15s; }
.sk-pin2 span.on { transform: rotate(45deg) scale(1.35); background: #fff; outline: 3px solid var(--c, #c9ff2f); }
</style>
