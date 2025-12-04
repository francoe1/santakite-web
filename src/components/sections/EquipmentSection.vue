<template>
  <SectionShell
    eyebrow="Equipo"
    title="Todo listo para salir al agua"
    description="Gear chequeado, radios cargadas y quivers listos para la condición del día."
    tone="plain"
  >
    <CardGrid>
      <InfoCard v-for="item in equipment" :key="item" tone="dark">
        {{ item }}
      </InfoCard>
    </CardGrid>
  </SectionShell>
</template>

<script setup>
import CardGrid from '../ui/CardGrid.vue'
import InfoCard from '../ui/InfoCard.vue'
import SectionShell from '../ui/SectionShell.vue'

const props = defineProps({
  equipment: {
    type: Array,
    default: () => [],
  },
})
</script>
