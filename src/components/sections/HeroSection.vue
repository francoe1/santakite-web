<template>
  <section id="hero" class="hero">
    <div class="hero-copy">
      <p class="badge">Kitesurf en Punta Lara</p>
      <h1>
        Kitesurf moderno y seguro
        <span class="accent">en Playa 52</span>
      </h1>
      <p class="lead">
        Escuela boutique en Santa Ana con coaches certificados, radios BBTalkin y spot amplio para aprender, progresar o
        entrenar downwinds sin perder tiempo.
      </p>
      <div class="hero-actions">
        <a class="primary" href="https://wa.me/5491137787151" target="_blank" rel="noreferrer">Agendar sesión</a>
        <button class="ghost" type="button" @click="scrollTo('servicios')">Ver servicios</button>
      </div>
      <div class="hero-tags" aria-label="Destacados">
        <span>Clases 1:1</span>
        <span>Downwinds guiados</span>
        <span>Equipo listo</span>
      </div>
    </div>
    <div class="hero-card" role="presentation">
      <div class="card-inner">
        <p class="eyebrow">Session-ready</p>
        <h2>Viento limpio, checklist rápido y radios conectadas.</h2>
        <p class="muted">Armamos tu quiver, hacemos briefing y salís a navegar con asistencia.</p>
        <div class="stat-grid">
          <div>
            <p class="stat">+10</p>
            <p class="muted">Años enseñando</p>
          </div>
          <div>
            <p class="stat">250</p>
            <p class="muted">Días de viento</p>
          </div>
          <div>
            <p class="stat">+400</p>
            <p class="muted">Alumnos</p>
          </div>
        </div>
        <div class="mini-chip">Playa 52 · Punta Lara</div>
      </div>
    </div>
  </section>
</template>

<script setup>
const scrollTo = (id) => {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 2.25rem;
  align-items: center;
  padding-top: 1.5rem;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.2px;
  margin-bottom: 1rem;
}

h1 {
  font-size: clamp(2.2rem, 3vw, 3rem);
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.accent {
  color: #38bdf8;
}

.lead {
  color: #e2e8f0;
  max-width: 620px;
  margin-bottom: 1.5rem;
}

.hero-actions {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 1.25rem;
}

.primary,
.ghost {
  border-radius: 999px;
  padding: 0.75rem 1.4rem;
  font-weight: 700;
  border: 1px solid rgba(148, 163, 184, 0.35);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
}

.primary {
  background: linear-gradient(120deg, #22d3ee, #0ea5e9, #2563eb);
  color: #0b1727;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.85);
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 55px rgba(14, 165, 233, 0.5);
}

.ghost {
  background: rgba(15, 23, 42, 0.7);
  color: #e2e8f0;
}

.ghost:hover {
  border-color: rgba(56, 189, 248, 0.7);
  transform: translateY(-1px);
}

.hero-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hero-tags span {
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  background: rgba(14, 165, 233, 0.1);
  color: #7dd3fc;
  font-weight: 600;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.hero-card {
  background: radial-gradient(circle at 30% 0, rgba(56, 189, 248, 0.2), rgba(37, 99, 235, 0.1)),
    linear-gradient(160deg, #0b1224, #0b1729);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 1.4rem;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.85);
  overflow: hidden;
  position: relative;
}

.card-inner {
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: #94a3b8;
}

.muted {
  color: #cbd5e1;
  font-size: 0.95rem;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.stat {
  font-size: 1.6rem;
  font-weight: 700;
  color: #e2e8f0;
}

.mini-chip {
  align-self: flex-start;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.1);
  color: #38bdf8;
  font-weight: 600;
  border: 1px solid rgba(56, 189, 248, 0.35);
  margin-top: 0.5rem;
}
</style>
