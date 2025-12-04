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
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background:
    radial-gradient(circle at 20% 20%, rgba(45, 212, 191, 0.08) 0, transparent 30%),
    radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.1) 0, transparent 30%),
    radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.08) 0, transparent 32%),
    linear-gradient(135deg, #031226, #041527 35%, #041826 60%, #05222d 100%);
  color: #f8fafc;
  line-height: 1.6;
  min-height: 100vh;
  background-attachment: fixed;
}

a {
  color: inherit;
  text-decoration: none;
}

main {
  max-width: 1240px;
  margin: 0 auto;
  padding: 1.5rem 1.1rem 3.5rem;
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
  background: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')
      center/cover no-repeat;
  opacity: 0.25;
  filter: saturate(1.1) blur(1px);
}

.page::after {
  background:
    radial-gradient(circle at 15% 25%, rgba(14, 165, 233, 0.16), transparent 30%),
    radial-gradient(circle at 85% 75%, rgba(56, 189, 248, 0.18), transparent 28%),
    linear-gradient(135deg, rgba(4, 23, 47, 0.7), rgba(6, 31, 53, 0.8));
  opacity: 0.9;
}
</style>
