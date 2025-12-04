<script setup>
import { useSiteStore } from './stores/site'
import TopBar from './components/layout/TopBar.vue'
import HeroSection from './components/sections/HeroSection.vue'
import SpotHighlights from './components/sections/SpotHighlights.vue'
import MapSection from './components/sections/MapSection.vue'
import ForecastSection from './components/sections/ForecastSection.vue'
import SecuritySection from './components/sections/SecuritySection.vue'
import ContactSection from './components/sections/ContactSection.vue'
import AgendaSection from './components/sections/AgendaSection.vue'
import ServicesSection from './components/sections/ServicesSection.vue'
import EquipmentSection from './components/sections/EquipmentSection.vue'

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
    <AgendaSection />
    <ServicesSection />
    <EquipmentSection />
    <ContactSection :contacts="site.contacts" />
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

:root {
  --sky-50: #f0f9ff;
  --sky-100: #e0f2fe;
  --sky-200: #bae6fd;
  --sky-300: #7dd3fc;
  --sky-400: #38bdf8;
  --sky-500: #0ea5e9;
  --sky-600: #0284c7;
  --sky-700: #0369a1;
  --sky-800: #075985;
  --sky-900: #0c4a6e;
  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-300: #cbd5e1;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-600: #475569;
  --slate-700: #334155;
  --slate-800: #1e293b;
  --slate-900: #0f172a;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--slate-50);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 800'%3e%3cg fill-opacity='0.4'%3e%3cpath fill='rgba(17, 94, 89, 0.1)' d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/%3e%3cpath fill='rgba(17, 94, 89, 0.1)' d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/%3e%3cpath fill='rgba(17, 94, 89, 0.1)' d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/%3e%3cpath fill='rgba(17, 94, 89, 0.1)' d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/%3e%3cpath fill='rgba(17, 94, 89, 0.1)' d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 273.6 120.6 265.7 181.8 259.4z'/%3e%3c/g%3e%3c/svg%3e");
  background-size: cover;
  background-position: center;
  color: var(--slate-700);
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
