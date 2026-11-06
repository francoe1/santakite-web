<script setup>
import { computed, onMounted, watch } from 'vue'
import { useSiteStore } from '@/stores/site'
import { useForecastStore } from '@/stores/forecast'
import { useSpotForecast } from '@/composables/useSpotForecast'
import { useReveal } from '@/composables/useReveal'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import Ticker from '@/components/layout/Ticker.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import TodayPicker from '@/components/sections/TodayPicker.vue'
import SpotGuide from '@/components/sections/SpotGuide.vue'
import MapSection from '@/components/sections/MapSection.vue'
import ForecastSection from '@/components/sections/ForecastSection.vue'
import SecuritySection from '@/components/sections/SecuritySection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

const site = useSiteStore()
const forecastStore = useForecastStore()
const spot = computed(() => site.currentSpot)
const { forecast, status, error, entry, reload } = useSpotForecast(() => site.currentSpot)

// El spot elegido queda en la URL (?spot=...) para poder compartirlo.
const syncUrl = (id) => {
  const url = new URL(window.location.href)
  id ? url.searchParams.set('spot', id) : url.searchParams.delete('spot')
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
}

onMounted(() => {
  const fromUrl = new URLSearchParams(window.location.search).get('spot')
  if (fromUrl) site.setCurrentSpotId(fromUrl)
  watch(() => site.currentSpotId, syncUrl, { immediate: true })
  forecastStore.loadAll(site.spots) // alimenta el comparador "¿Dónde se navega hoy?"
})

useReveal()
</script>

<template>
  <SiteHeader :nav-items="site.navItems" :spots="site.spots" :current-spot-id="site.currentSpotId" @select-spot="site.setCurrentSpotId" />
  <Ticker :spots="site.spots" />
  <main v-if="spot">
    <HeroSection :spot="spot" :forecast="forecast" :status="status" :error="error" :fetched-at="entry.fetchedAt" @reload="reload" />
    <TodayPicker :spots="site.spots" :current-id="site.currentSpotId" @select="site.setCurrentSpotId" />
    <SpotGuide :spot="spot" />
    <MapSection :spot="spot" />
    <ForecastSection :spot="spot" :forecast="forecast" :status="status" :error="error" :fetched-at="entry.fetchedAt" @reload="reload" />
    <SecuritySection :security="spot.security" />
    <ContactSection :contacts="spot.contacts" :spot="spot" />
  </main>
  <SiteFooter :nav-items="site.navItems.filter((n) => n.id !== 'hoy')" :spots="site.spots" @select-spot="site.setCurrentSpotId" />
</template>
