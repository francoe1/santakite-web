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
}

body {
  font-family: 'Manrope', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #0b1f2a;
  line-height: 1.6;
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(248, 252, 255, 0.92) 0%, rgba(218, 240, 245, 0.88) 35%, rgba(10, 58, 74, 0.9) 100%),
    url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=80&sat=-10') center/cover fixed;
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
  isolation: isolate;
}

.page::before,
.page::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
}

.page::before {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.4), rgba(7, 89, 133, 0.18));
  opacity: 0.65;
}

.page::after {
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.62), transparent 32%),
    radial-gradient(circle at 78% 30%, rgba(7, 89, 133, 0.28), transparent 35%),
    radial-gradient(circle at 25% 80%, rgba(248, 180, 76, 0.24), transparent 30%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.45), rgba(7, 89, 133, 0.55));
  opacity: 0.85;
}
</style>
