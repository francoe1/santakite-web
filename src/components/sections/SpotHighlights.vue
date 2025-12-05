<template>
  <SectionShell id="spot" eyebrow="El spot" tone="soft">
    <CardGrid>
      <InfoCard
        v-for="item in spot.highlights"
        :key="item.title"
        :title="item.title"
        :description="item.description"
      />
    </CardGrid>
    <NoteBanner>
      <p>Coordenadas: <strong>{{ spot.references?.coordinatesLabel }}</strong></p>
      <p>Referencia: {{ spot.references?.description }}</p>
    </NoteBanner>
  </SectionShell>
</template>

<script setup>
import CardGrid from '../ui/CardGrid.vue'
import InfoCard from '../ui/InfoCard.vue'
import NoteBanner from '../ui/NoteBanner.vue'
import SectionShell from '../ui/SectionShell.vue'

const props = defineProps({
  spot: {
    type: Object,
    required: true,
  },
})
</script>
