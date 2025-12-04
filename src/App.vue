<script setup>
import { useSiteStore } from './stores/site'
import TopBar from './components/layout/TopBar.vue'
import HeroSection from './components/sections/HeroSection.vue'
import SpotHighlights from './components/sections/SpotHighlights.vue'
import MapSection from './components/sections/MapSection.vue'
import ForecastSection from './components/sections/ForecastSection.vue'
import SecuritySection from './components/sections/SecuritySection.vue'
import ContactSection from './components/sections/ContactSection.vue'

const site = useSiteStore()
</script>

<template>
  <TopBar :nav-items="site.navItems" />
  <main class="page">
    <HeroSection />
    <SpotHighlights :highlights="site.spotHighlights" />
    <MapSection />
    <ForecastSection />
    <SecuritySection :security="site.security" />
    <ContactSection :contacts="site.contacts" />
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
