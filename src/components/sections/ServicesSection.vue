<template>
  <section id="services" class="section">
    <div class="section-head">
      <div>
        <h2>Servicios</h2>
        <p>
          Ofrecemos servicios para que tu experiencia de kitesurf sea la mejor.
        </p>
      </div>
    </div>
    <div class="card">
      <h3>Clases de kitesurf</h3>
      <p>Clases para todos los niveles, con instructores certificados. ¡Animate a probar!</p>
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
