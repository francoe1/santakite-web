import { defineStore } from 'pinia'
import spots from '../data/spots.json'

export const useSiteStore = defineStore('site', {
  state: () => ({
    navItems: [
      { id: 'spot', label: 'Spot' },
      { id: 'mapa', label: 'Mapa' },
      { id: 'pronostico', label: 'Pronóstico' },
      { id: 'seguridad', label: 'Seguridad' },
      { id: 'contacto', label: 'Contacto' },
    ],
    spots,
    currentSpotId: spots[0]?.id ?? null,
  }),
  getters: {
    currentSpot: (state) => state.spots.find((spot) => spot.id === state.currentSpotId) ?? state.spots[0] ?? null,
  },
  actions: {
    setCurrentSpotId(spotId) {
      const exists = this.spots.some((spot) => spot.id === spotId)
      if (exists) {
        this.currentSpotId = spotId
      }
    },
  },
})
