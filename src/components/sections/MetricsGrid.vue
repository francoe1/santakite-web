<template>
  <section class="metrics" aria-label="Indicadores clave">
    <div v-for="metric in metrics" :key="metric.label" class="metric-card">
      <p class="metric-value">{{ metric.value }}</p>
      <p class="metric-label">{{ metric.label }}</p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  metrics: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.metrics {
  margin: 3rem 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.metric-card {
  padding: 1.25rem 1.5rem;
  background: white;
  border: 1px solid var(--slate-200);
  border-radius: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--sky-600);
}

.metric-label {
  color: var(--slate-500);
  margin-top: 0.25rem;
  font-size: 1rem;
}
</style>
