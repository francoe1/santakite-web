<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
import LazyMount from '@/components/ui/LazyMount.vue'
import ShareToast from '@/components/ui/ShareToast.vue'
import { useShare } from '@/composables/useShare'
import LeafField from '@/components/fx/LeafField.vue'
import { useWindVars } from '@/composables/useWindVars'
import MoodScene from '@/components/fx/MoodScene.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import { useSeo } from '@/composables/useSeo'
import ForecastDetail from '@/components/forecast/ForecastDetail.vue'
import ForecastSection from '@/components/sections/ForecastSection.vue'
import SecuritySection from '@/components/sections/SecuritySection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

const MapSection = defineAsyncComponent(() => import('@/components/sections/MapSection.vue'))

const route = useRoute()
const router = useRouter()
const site = useSiteStore()
const forecastStore = useForecastStore()
const spot = computed(() => site.currentSpot)
const selectedDate = ref(null)
const { share, busy: sharing } = useShare()
const shareJoke = ref('')
const shareHero = (joke) => {
  shareJoke.value = joke
  share({ spot: spot.value, forecast: forecast.value, joke })
}
const shareDay = (day) => share({ spot: spot.value, forecast: forecast.value, joke: shareJoke.value, day })
const { forecast, status, error, entry, reload } = useSpotForecast(() => site.currentSpot)

// La URL manda: /spot/:id (o / para el spot por defecto).
watch(
  () => route.params.id,
  (id) => site.setCurrentSpotId(id ?? site.spots[0].id),
  { immediate: true }
)
const selectSpot = (id) => router.push({ name: 'spot', params: { id } })
const nearbySpots = computed(() => site.nearby(3)) // comparador "¿Dónde se navega hoy?"
const tickerSpots = computed(() => site.nearby(5))
watch(tickerSpots, (list) => forecastStore.loadAll(list), { immediate: true })

useWindVars(() => forecast.value.current)
useSeo(() => (route.name === 'spot' ? site.currentSpot : null))

const selectedDay = computed(() => forecast.value.days.find((d) => d.date === selectedDate.value) ?? null)
useReveal()
</script>

<template>
  <SiteHeader :nav-items="site.navItems" :spots="site.spots" :current-spot-id="site.currentSpotId" @select-spot="selectSpot" />
  <Ticker :spots="tickerSpots" />
  <main v-if="spot" id="contenido" tabindex="-1" class="has-leaves">
    <LeafField />
    <HeroSection :spot="spot" :forecast="forecast" :status="status" :error="error" :fetched-at="entry.fetchedAt" @reload="reload" @select-day="selectedDate = $event.date" @share="shareHero" :sharing="sharing" />
    <TodayPicker :spots="nearbySpots" :current-id="site.currentSpotId" @select="selectSpot" />
    <SpotGuide :spot="spot" />
    <LazyMount id="mapa" min-height="900px"><MapSection :spot="spot" /></LazyMount>
    <ForecastSection :spot="spot" :forecast="forecast" :status="status" :error="error" :fetched-at="entry.fetchedAt" @reload="reload" @select="selectedDate = $event.date" />
    <SecuritySection :security="spot.security" />
    <FaqSection :spot="spot" />
    <ContactSection :contacts="spot.contacts" :spot="spot" />
  </main>
  <ForecastDetail v-if="spot" :day="selectedDay" :cfg="forecast.cfg" :sharing="sharing" @share="shareDay" @close="selectedDate = null" />
  <MoodScene :mood="forecast.assessment.key" />
  <ShareToast />
  <SiteFooter :nav-items="site.navItems.filter((n) => n.id !== 'hoy')" :spots="site.nearby(6)" @select-spot="selectSpot" />
</template>
