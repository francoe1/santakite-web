import { defineStore } from 'pinia'
import spots from '../data/spots.json'
import { sortByDistance } from '../utils/geo'

export const useSiteStore = defineStore('site', {
  state: () => ({
    navItems: [
      { id: 'hoy', label: 'Hoy', icon: 'wind', tab: true },
      { id: 'spot', label: 'El spot', icon: 'pin', tab: false },
      { id: 'mapa', label: 'Mapa', icon: 'map', tab: true },
      { id: 'pronostico', label: 'Pronóstico', icon: 'calendar', tab: true },
      { id: 'seguridad', label: 'Seguridad', icon: 'shield', tab: true },
      { id: 'faq', label: 'Preguntas', icon: 'chat', tab: false },
      { id: 'contacto', label: 'Contacto', icon: 'chat', tab: true },
    ],
    spots,
    currentSpotId: spots[0]?.id ?? null,
  }),
  getters: {
    /** El spot actual + los N más cercanos (para el comparador "¿Dónde se navega hoy?" y el ticker). */
    nearby: (state) => (count = 3) => {
      const cur = state.spots.find((x) => x.id === state.currentSpotId) ?? state.spots[0]
      return sortByDistance(state.spots, cur.coordinates).slice(0, count).map((x) => x.spot)
    },
    currentSpot: (state) => state.spots.find((s) => s.id === state.currentSpotId) ?? state.spots[0] ?? null,
  },
  actions: {
    setCurrentSpotId(spotId) {
      if (this.spots.some((s) => s.id === spotId)) this.currentSpotId = spotId
    },
  },
})
