<template>
  <section id="spot" class="section">
    <div class="section-head">
      <p class="eyebrow">El spot</p>
      <div>
        <h2>Playa 52 en Santa Ana</h2>
        <p class="muted">Zona abierta de río Uruguay, con arena amplia para armar y lanzar lejos de bañistas.</p>
      </div>
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
  background: linear-gradient(120deg, rgba(3, 22, 38, 0.65), rgba(5, 30, 48, 0.85));
  border-radius: 1.5rem;
  padding: 1.2rem;
  border: 1px solid rgba(125, 242, 221, 0.15);
  box-shadow: 0 22px 46px rgba(3, 15, 32, 0.45);
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
  background: radial-gradient(circle at 20% 20%, rgba(94, 234, 212, 0.1), transparent 40%),
    linear-gradient(145deg, rgba(5, 22, 43, 0.7), rgba(7, 30, 53, 0.85));
  border: 1px solid rgba(56, 189, 248, 0.25);
  box-shadow: 0 14px 38px rgba(2, 10, 24, 0.65);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.card h3 {
  font-size: 1.05rem;
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(125, 242, 221, 0.5);
  box-shadow: 0 16px 42px rgba(3, 15, 32, 0.55);
}

.info-banner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.6rem;
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  background: linear-gradient(110deg, rgba(94, 234, 212, 0.14), rgba(14, 165, 233, 0.12));
  border: 1px solid rgba(125, 242, 221, 0.3);
  color: #e0fff7;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
</style>
