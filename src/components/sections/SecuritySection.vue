<template>
  <SectionShell
    id="seguridad"
    eyebrow="Seguridad y protocolo"
    title="Checklist claro para usar el spot"
    description="Indicaciones básicas para convivir con bañistas y mantener la zona de kites ordenada."
  >
    <CardGrid>
      <InfoCard v-for="step in security.steps" :key="step.title" :title="step.title">
        <ul class="step-list">
          <li v-for="item in step.items" :key="item">{{ item }}</li>
        </ul>
      </InfoCard>
    </CardGrid>
    <NoteBanner tone="muted">{{ security.intro }}</NoteBanner>
  </SectionShell>
</template>

<script setup>
import CardGrid from '../ui/CardGrid.vue'
import InfoCard from '../ui/InfoCard.vue'
import NoteBanner from '../ui/NoteBanner.vue'
import SectionShell from '../ui/SectionShell.vue'

const props = defineProps({
  security: {
    type: Object,
    default: () => ({ steps: [], intro: '' }),
  },
})
</script>

<style scoped>
.step-list {
  display: grid;
  gap: 0.5rem;
  color: #0f4c5c;
  padding-left: 1rem;
}
</style>
