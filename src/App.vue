<script setup>
import { useSiteStore } from './stores/site'
import TopBar from './components/layout/TopBar.vue'
import HeroSection from './components/sections/HeroSection.vue'
import MetricsGrid from './components/sections/MetricsGrid.vue'
import ServicesSection from './components/sections/ServicesSection.vue'
import SpotHighlights from './components/sections/SpotHighlights.vue'
import SecuritySection from './components/sections/SecuritySection.vue'
import AgendaSection from './components/sections/AgendaSection.vue'
import EquipmentSection from './components/sections/EquipmentSection.vue'
import ContactSection from './components/sections/ContactSection.vue'

const site = useSiteStore()
</script>

<template>
  <TopBar :nav-items="site.navItems" />
  <main class="page">
    <HeroSection />
    <MetricsGrid :metrics="site.metrics" />
    <ServicesSection :services="site.services" />
    <SpotHighlights :highlights="site.spotHighlights" />
    <SecuritySection :security="site.security" />
    <AgendaSection :agenda="site.agenda" />
    <EquipmentSection :equipment="site.equipment" />
    <ContactSection :contacts="site.contacts" />
  </main>
</template>

<style>
:root {
  color-scheme: dark;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background:
    radial-gradient(circle at 0 0, #1f2937 0, transparent 55%),
    radial-gradient(circle at 100% 0, #0f172a 0, transparent 55%),
    radial-gradient(circle at 50% 100%, #111827 0, transparent 55%),
    #020617;
  color: #f9fafb;
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}
</style>
