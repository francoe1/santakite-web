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
  background: #ffffff;
  padding: 1.2rem;
  border: 1px solid #dfe7ec;
  color: #0b1f2a;
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
}

h2 {
  font-size: clamp(1.6rem, 2.5vw, 2rem);
  margin-bottom: 0.35rem;
}

.muted {
  color: #0f4c5c;
  max-width: 640px;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.step-card {
  padding: 1.2rem;
  background: #f9fcfd;
  border: 1px solid #dfe7ec;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.step-card h3 {
  margin-bottom: 0.65rem;
  font-size: 1.05rem;
}

.step-card ul {
  display: grid;
  gap: 0.5rem;
  color: #0f4c5c;
  padding-left: 1rem;
}

.step-card:hover {
  border-color: #c7d6dc;
  background: #f4f7f9;
}

.note {
  padding: 1rem 1.2rem;
  background: #eef4f6;
  border: 1px solid #dfe7ec;
}
</style>
