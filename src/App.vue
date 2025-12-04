<script setup>
import { onMounted, watch } from 'vue'
import { useSiteStore } from './stores/site'
import TopBar from './components/layout/TopBar.vue'
import HeroSection from './components/sections/HeroSection.vue'
import SpotHighlights from './components/sections/SpotHighlights.vue'
import MapSection from './components/sections/MapSection.vue'
import ForecastSection from './components/sections/ForecastSection.vue'
import SecuritySection from './components/sections/SecuritySection.vue'
import ContactSection from './components/sections/ContactSection.vue'

const site = useSiteStore()

const applySpotFromUrl = () => {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const spotId = params.get('spot')
  if (spotId) {
    site.setCurrentSpotId(spotId)
  }
}

const persistSpotInUrl = (spotId) => {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (spotId) {
    url.searchParams.set('spot', spotId)
  } else {
    url.searchParams.delete('spot')
  }
  const newUrl = `${url.pathname}${url.search}${url.hash}`
  window.history.replaceState({}, '', newUrl)
}

onMounted(() => {
  applySpotFromUrl()
  watch(
    () => site.currentSpotId,
    (spotId) => {
      persistSpotInUrl(spotId)
    },
    { immediate: true }
  )
})
</script>

<template>
  <TopBar
    :nav-items="site.navItems"
    :spots="site.spots"
    :current-spot-id="site.currentSpotId"
    @select-spot="site.setCurrentSpotId"
  />
  <main class="page">
    <HeroSection v-if="site.currentSpot" :spot="site.currentSpot" />
    <SpotHighlights v-if="site.currentSpot" :spot="site.currentSpot" />
    <MapSection v-if="site.currentSpot" :spot="site.currentSpot" />
    <ForecastSection v-if="site.currentSpot" :spot="site.currentSpot" />
    <SecuritySection v-if="site.currentSpot" :security="site.currentSpot.security" />
    <ContactSection v-if="site.currentSpot" :contacts="site.currentSpot.contacts" />
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Pacifico&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  box-shadow: none !important;
  border-radius: 0 !important;
}

body {
  font-family: 'Manrope', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #0b1f2a;
  line-height: 1.6;
  min-height: 100vh;
  background: linear-gradient(180deg, #f7fbff 0%, #eaf3f7 100%);
  overflow-x: hidden;
}

a {
  color: inherit;
  text-decoration: none;
}

main {
  max-width: 1260px;
  margin: 0 auto;
  padding: 1.2rem 1.1rem 3.8rem;
}

.page {
  position: relative;
}
</style>
