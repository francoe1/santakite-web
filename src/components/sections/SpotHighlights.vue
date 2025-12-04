<template>
  <section id="spot" class="section">
    <div class="section-head">
      <div>
        <h2>Playa 52 en Santa Ana</h2>
        <p>Zona abierta de río Uruguay, con arena amplia para armar y lanzar lejos de bañistas.</p>
      </div>
    </div>
    <div class="cards">
      <article v-for="item in highlights" :key="item.title" class="card">
        <div class="card-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
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
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--slate-200);
}

.section-head {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

h2 {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  margin-bottom: 0.5rem;
  font-weight: 700;
}

p {
  color: var(--slate-600);
  font-size: 1.1rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
}

.card {
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: white;
  border: 1px solid var(--slate-200);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background-color: var(--sky-100);
  color: var(--sky-600);
  border: 1px solid var(--sky-200);
  margin-bottom: 0.5rem;
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.card p {
  font-size: 1rem;
  color: var(--slate-500);
}

.info-banner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1.25rem;
  background-color: var(--sky-500);
  color: white;
  margin-top: 2.5rem;
}

.info-banner p {
  color: white;
  font-size: 1rem;
}
</style>
