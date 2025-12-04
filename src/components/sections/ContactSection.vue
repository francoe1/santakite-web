<template>
  <section id="contacto" class="contact">
    <div class="contact-card">
      <div>
        <p class="eyebrow">Contacto</p>
        <h2>Coordinar visita</h2>
        <p class="muted">Compartí día y horario para avisar presencia en el spot y respetar las zonas marcadas.</p>
      </div>
      <div class="contact-grid">
        <div v-for="contact in contacts" :key="contact.label" class="contact-item">
          <p class="label">{{ contact.label }}</p>
          <p class="value">{{ contact.value }}</p>
        </div>
      </div>
      <a class="primary" href="https://wa.me/5491137787151" target="_blank" rel="noreferrer">Abrir WhatsApp</a>
    </div>
    <div class="map-card">
      <div class="map-figure">
        <div class="pin"></div>
        <div class="halo"></div>
        <div class="grid"></div>
      </div>
      <div class="map-copy">
        <p class="eyebrow">Cómo llegar</p>
        <p class="muted">
          Playa 52, Santa Ana, Entre Ríos. Acceso público sobre el río; mantener libre el paso de bañistas.
        </p>
        <p class="mini-chip">Coordenadas: -30.9085, -57.9150</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  contacts: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.contact {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.4rem;
}

.contact-card,
.map-card {
  padding: 1.4rem;
  border-radius: 1.2rem;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.75);
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
}

.contact-item {
  padding: 0.8rem 0.95rem;
  border-radius: 0.9rem;
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.value {
  color: #e2e8f0;
  font-weight: 700;
}

.primary {
  align-self: flex-start;
  border-radius: 999px;
  padding: 0.75rem 1.4rem;
  font-weight: 700;
  border: 1px solid rgba(148, 163, 184, 0.35);
  cursor: pointer;
  background: linear-gradient(120deg, #22d3ee, #0ea5e9, #2563eb);
  color: #0b1727;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.85);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 55px rgba(14, 165, 233, 0.5);
}

.map-card {
  position: relative;
  overflow: hidden;
}

.map-figure {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: 1rem;
  background: radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.25), rgba(8, 47, 73, 0.6));
  overflow: hidden;
  border: 1px solid rgba(56, 189, 248, 0.35);
}

.pin {
  position: absolute;
  top: 44%;
  left: 52%;
  width: 18px;
  height: 18px;
  background: #22d3ee;
  border-radius: 8px 8px 2px 8px;
  transform: rotate(45deg);
  box-shadow: 0 0 0 10px rgba(34, 211, 238, 0.15);
}

.halo {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.3), transparent 65%);
  top: 30%;
  left: 38%;
}

.grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 40px 40px;
  mix-blend-mode: screen;
}

.map-copy {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mini-chip {
  align-self: flex-start;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.1);
  color: #38bdf8;
  font-weight: 700;
  border: 1px solid rgba(56, 189, 248, 0.35);
}
</style>
