<template>
  <section id="agenda" class="section">
    <div class="section-head">
      <p class="eyebrow">Agenda y condiciones</p>
      <div>
        <h2>Cuándo navegar en Playa 52</h2>
        <p class="muted">Ventanas de viento, backups y reglas claras para confirmar o suspender.</p>
      </div>
    </div>
    <div class="cards">
      <article v-for="slot in agenda" :key="slot.title" class="card">
        <h3>{{ slot.title }}</h3>
        <p class="muted">{{ slot.detail }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  agenda: {
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.card {
  padding: 1.2rem;
  border-radius: 0.75rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.65);
}

.card h3 {
  margin-bottom: 0.55rem;
  font-size: 1.05rem;
}
</style>
