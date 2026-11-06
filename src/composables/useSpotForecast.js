import { computed, watch } from 'vue'
import { useForecastStore } from '@/stores/forecast'
import { buildForecast } from '@/utils/forecast'

/** Pronóstico procesado y reactivo para un spot (ref/getter). */
export const useSpotForecast = (spotRef) => {
  const store = useForecastStore()
  const spot = computed(() => (typeof spotRef === 'function' ? spotRef() : spotRef.value))

  watch(spot, (s) => store.load(s), { immediate: true })

  const entry = computed(() => store.entry(spot.value?.id))
  const forecast = computed(() => buildForecast(spot.value, entry.value.raw))
  return {
    entry,
    forecast,
    status: computed(() => entry.value.status),
    error: computed(() => entry.value.error),
    reload: () => store.load(spot.value, { force: true }),
  }
}
