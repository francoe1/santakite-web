<template>
  <section id="equipment" class="section">
    <div class="section-head">
      <div>
        <h2>Equipamiento</h2>
        <p>
          Contamos con equipamiento de primeras marcas para que puedas disfrutar al máximo.
        </p>
      </div>
    </div>
    <div class="card">
      <h3>Alquiler de equipos</h3>
      <p>Alquiler de kites, tablas y arneses. ¡Consultanos por precios y disponibilidad!</p>
    </div>
  </section>
</template>

<style scoped>
.section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid var(--slate-200);
}

.section-head {
  max-width: 720px;
  margin: 0 auto 2.5rem;
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

.card {
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: white;
  border: 1px solid var(--slate-200);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.card p {
  font-size: 1rem;
  color: var(--slate-500);
}
</style>
