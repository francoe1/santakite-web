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
  background: linear-gradient(120deg, rgba(3, 24, 41, 0.7), rgba(4, 31, 54, 0.86));
  border-radius: 1.5rem;
  padding: 1.2rem;
  border: 1px solid rgba(125, 242, 221, 0.12);
  box-shadow: 0 22px 46px rgba(2, 10, 24, 0.45);
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
  background: radial-gradient(circle at 10% 10%, rgba(94, 234, 212, 0.1), transparent 40%),
    linear-gradient(145deg, rgba(5, 23, 42, 0.75), rgba(6, 29, 52, 0.9));
  border: 1px solid rgba(56, 189, 248, 0.25);
  box-shadow: 0 14px 38px rgba(2, 10, 24, 0.7);
  transition: transform 0.2s ease, border-color 0.2s ease;
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

.step-card:hover {
  transform: translateY(-3px);
  border-color: rgba(125, 242, 221, 0.45);
}

.note {
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  background: linear-gradient(120deg, rgba(94, 234, 212, 0.12), rgba(14, 165, 233, 0.12));
  border: 1px dashed rgba(125, 242, 221, 0.5);
  color: #e6fffb;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
</style>
