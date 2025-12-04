<script setup>
import { onMounted } from 'vue'
import { useSiteStore } from './stores/site'
import { useUiStore } from './stores/ui'
import TopBar from './components/layout/TopBar.vue'
import HeroSection from './components/sections/HeroSection.vue'
import SpotHighlights from './components/sections/SpotHighlights.vue'
import MapSection from './components/sections/MapSection.vue'
import ForecastSection from './components/sections/ForecastSection.vue'
import SecuritySection from './components/sections/SecuritySection.vue'
import ContactSection from './components/sections/ContactSection.vue'

const site = useSiteStore()
const ui = useUiStore()

onMounted(() => {
  ui.initTheme()
})
</script>

<template>
  <div class="app-shell bg-android">
    <div class="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-5 md:space-y-7">
      <TopBar :nav-items="site.navItems" :theme="ui.theme" @toggle-theme="ui.toggleTheme" />
      <main class="space-y-5 md:space-y-6">
        <HeroSection />
        <SpotHighlights :highlights="site.spotHighlights" />
        <MapSection />
        <ForecastSection />
        <SecuritySection :security="site.security" />
        <ContactSection :contacts="site.contacts" />
      </main>
    </div>
  </div>
</template>
