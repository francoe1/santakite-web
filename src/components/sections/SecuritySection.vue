<template>
  <section id="seguridad" class="section">
    <div class="section-head">
      <p class="eyebrow">Seguridad y protocolo</p>
      <div>
        <h2>Checklist claro para usar el spot</h2>
        <p class="muted">Indicaciones básicas para convivir con bañistas y mantener la zona de kites ordenada.</p>
      </div>
    </div>
    <div class="steps">
      <article v-for="step in security.steps" :key="step.title" class="step-card">
        <h3>{{ step.title }}</h3>
        <ul>
          <li v-for="item in step.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
    <div class="note">{{ security.intro }}</div>
  </section>
</template>

<script setup>
const props = defineProps({
  security: {
    type: Object,
    default: () => ({ steps: [], intro: '' }),
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

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.step-card {
  padding: 1.2rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 14px 38px rgba(15, 23, 42, 0.65);
}

.step-card h3 {
  margin-bottom: 0.65rem;
  font-size: 1.05rem;
}

.step-card ul {
  display: grid;
  gap: 0.5rem;
  color: #cbd5e1;
  padding-left: 1rem;
}

.note {
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px dashed rgba(56, 189, 248, 0.4);
  color: #e2e8f0;
}
</style>
