<template>
  <SectionShell
    id="agenda"
    eyebrow="Agenda y condiciones"
    title="Cuándo navegar en Playa 52"
    description="Ventanas de viento, backups y reglas claras para confirmar o suspender."
    tone="plain"
  >
    <CardGrid :min-width="220">
      <InfoCard
        v-for="slot in agenda"
        :key="slot.title"
        :title="slot.title"
        :description="slot.detail"
        tone="plain"
      />
    </CardGrid>
  </SectionShell>
</template>

<script setup>
import CardGrid from '../ui/CardGrid.vue'
import InfoCard from '../ui/InfoCard.vue'
import SectionShell from '../ui/SectionShell.vue'

const props = defineProps({
  agenda: {
    type: Array,
    default: () => [],
  },
})
</script>
