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
  margin: 2.4rem 0 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.metric-card {
  padding: 1rem 1.2rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.65);
}

.metric-value {
  font-size: 1.45rem;
  font-weight: 700;
  color: #e2e8f0;
}

.metric-label {
  color: #94a3b8;
  margin-top: 0.3rem;
}
</style>
