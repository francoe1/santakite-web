<template>
  <section id="servicios" class="section">
    <div class="section-head">
      <p class="eyebrow">Servicios</p>
      <div>
        <h2>Coaching, downwinds y gear listo</h2>
        <p class="muted">Todo optimizado para que navegues más y mejores en cada sesión.</p>
      </div>
    </div>
    <div class="cards">
      <article v-for="service in services" :key="service.title" class="card">
        <span class="chip">{{ service.tag }}</span>
        <h3>{{ service.title }}</h3>
        <p class="muted">{{ service.description }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  services: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.section {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: #94a3b8;
}

h2 {
  font-size: clamp(1.6rem, 2.5vw, 2rem);
  margin-bottom: 0.35rem;
}

.muted {
  color: #cbd5e1;
  max-width: 640px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.card {
  padding: 1.2rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.65);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.card h3 {
  font-size: 1.05rem;
}

.chip {
  align-self: flex-start;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.12);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.35);
  font-weight: 700;
  font-size: 0.85rem;
}
</style>
