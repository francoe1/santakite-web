import { defineStore } from 'pinia'
import { getSpotWeather } from '@/services/weatherService'

const TTL_MS = 10 * 60 * 1000

/**
 * Cache central de datos meteorológicos por spot.
 * Cada componente lee de acá en vez de pedir su propio fetch.
 */
export const useForecastStore = defineStore('forecast', {
  state: () => ({
    bySpot: {}, // id -> { status, raw, error, fetchedAt }
  }),
  getters: {
    entry: (state) => (id) => state.bySpot[id] ?? { status: 'idle', raw: null, error: '', fetchedAt: 0 },
  },
  actions: {
    async load(spot, { force = false } = {}) {
      if (!spot) return
      const id = spot.id
      const existing = this.bySpot[id]
      if (existing?.status === 'loading') return
      if (!force && existing?.status === 'ok' && Date.now() - existing.fetchedAt < TTL_MS) return

      this.bySpot[id] = { ...(existing || {}), status: 'loading', error: '' }
      try {
        const raw = await getSpotWeather({
          latitude: spot.wind?.latitude ?? spot.coordinates?.lat,
          longitude: spot.wind?.longitude ?? spot.coordinates?.lon,
        })
        this.bySpot[id] = { status: 'ok', raw, error: '', fetchedAt: raw.fetchedAt }
      } catch (err) {
        console.error(err)
        this.bySpot[id] = {
          status: 'error',
          raw: existing?.raw ?? null,
          error: 'No pudimos cargar los datos de viento. Revisá tu conexión e intentá de nuevo.',
          fetchedAt: existing?.fetchedAt ?? 0,
        }
      }
    },
    loadAll(spots, opts) {
      return Promise.all(spots.map((s) => this.load(s, opts)))
    },
  },
})
