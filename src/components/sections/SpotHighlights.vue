<template>
  <section id="spot" class="section">
    <div class="section-head">
      <p class="eyebrow">El spot</p>
      <div>
        <h2>Playa 52 en Santa Ana</h2>
        <p class="muted">Zona abierta de río Uruguay, con arena amplia para armar y lanzar lejos de bañistas.</p>
      </div>
    </div>
    <div class="kite-strip" aria-hidden="true">
      <img
        src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=80"
        alt="Amanecer con cometas en el agua"
        loading="lazy"
      />
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
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(226, 245, 246, 0.8));
  border-radius: 16px;
  padding: 1.4rem;
  border: 1px solid rgba(11, 65, 92, 0.12);
  box-shadow: 0 24px 54px rgba(11, 65, 92, 0.14);
}

.kite-strip {
  border-radius: 0.9rem;
  overflow: hidden;
  border: 1px solid rgba(0, 186, 199, 0.18);
  box-shadow: 0 14px 32px rgba(11, 65, 92, 0.18);
}

.kite-strip img {
  display: block;
  width: 100%;
  height: 160px;
  object-fit: cover;
  opacity: 0.92;
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
  border-radius: 0.8rem;
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.94), rgba(238, 249, 250, 0.92));
  border: 1px solid rgba(0, 186, 199, 0.18);
  box-shadow: 0 14px 38px rgba(11, 65, 92, 0.18);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.card h3 {
  font-size: 1.08rem;
  color: #0b2f3f;
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 186, 199, 0.4);
  box-shadow: 0 16px 42px rgba(11, 65, 92, 0.24);
}

.info-banner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.6rem;
  padding: 1rem 1.2rem;
  border-radius: 0.8rem;
  background: linear-gradient(110deg, rgba(0, 186, 199, 0.12), rgba(251, 133, 0, 0.12));
  border: 1px solid rgba(11, 65, 92, 0.14);
  color: #0b2f3f;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
}
</style>
