<template>
  <section id="spot" class="section">
    <div class="section-head">
      <p class="eyebrow">El spot</p>
    </div>
    <div class="cards">
      <article v-for="item in highlights" :key="item.title" class="card">
        <h3>{{ item.title }}</h3>
        <p class="muted">{{ item.description }}</p>
      </article>
    </div>
    <div class="info-banner">
      <p>Coordenadas: <strong>-30.9085, -57.9150</strong></p>
      <p>Referencia: Playa 52, Santa Ana, Entre Ríos.</p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  highlights: {
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
  background: #ffffff;
  padding: 1.4rem;
  border: 1px solid #dfe7ec;
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
  color: #0f4c5c;
  font-weight: 800;
}

h2 {
  font-size: clamp(1.6rem, 2.6vw, 2.15rem);
  margin-bottom: 0.35rem;
  color: #0b1f2a;
}

.muted {
  color: #0f4c5c;
  max-width: 640px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.card {
  padding: 1.2rem;
  background: #f9fcfd;
  border: 1px solid #dfe7ec;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.card h3 {
  font-size: 1.08rem;
  color: #0b2f3f;
}

.card:hover {
  border-color: #c7d6dc;
  background: #f4f7f9;
}

.info-banner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.6rem;
  padding: 1rem 1.2rem;
  background: #eef4f6;
  border: 1px solid #dfe7ec;
  color: #0b2f3f;
}
</style>
