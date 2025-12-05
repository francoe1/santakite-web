<template>
  <SectionShell
    id="servicios"
    eyebrow="Servicios"
    title="Coaching, downwinds y gear listo"
    description="Todo optimizado para que navegues más y mejores en cada sesión."
    tone="plain"
  >
    <CardGrid>
      <InfoCard
        v-for="service in services"
        :key="service.title"
        :tag="service.tag"
        :title="service.title"
        :description="service.description"
      />
    </CardGrid>
  </SectionShell>
</template>

<script setup>
import CardGrid from '../ui/CardGrid.vue'
import InfoCard from '../ui/InfoCard.vue'
import SectionShell from '../ui/SectionShell.vue'

const props = defineProps({
  services: {
    type: Array,
    default: () => [],
  },
})
</script>
