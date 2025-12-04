<template>
  <section class="section">
    <div class="section-head">
      <p class="eyebrow">Equipo</p>
      <div>
        <h2>Todo listo para salir al agua</h2>
        <p class="muted">Gear chequeado, radios cargadas y quivers listos para la condición del día.</p>
      </div>
    </div>
    <ul class="equipment-list">
      <li v-for="item in equipment" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>

<script setup>
const props = defineProps({
  equipment: {
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

.equipment-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.8rem;
  list-style: none;
  padding: 0;
}

.equipment-list li {
  padding: 0.95rem 1.1rem;
  border-radius: 0.9rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #e2e8f0;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.6);
}
</style>
