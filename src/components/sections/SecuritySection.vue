<template>
  <section id="seguridad" class="section">
    <div class="section-head">
      <div>
        <h2>Seguridad y Protocolo</h2>
        <p>Indicaciones básicas para convivir con bañistas y mantener la zona de kites ordenada.</p>
      </div>
    </div>
    <div class="steps">
      <article v-for="(step, index) in security.steps" :key="step.title" class="step-card">
        <div class="step-number">{{ index + 1 }}</div>
        <h3>{{ step.title }}</h3>
        <ul>
          <li v-for="item in step.items" :key="item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-check"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {{ item }}
          </li>
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

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.step-card {
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: white;
  border: 1px solid var(--slate-200);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  padding-top: 2.5rem;
}

.step-number {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background-color: var(--sky-500);
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 1.1rem;
}

h3 {
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
  font-weight: 600;
}

ul {
  display: grid;
  gap: 0.6rem;
  color: var(--slate-600);
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
}

.feather-check {
  color: var(--sky-500);
  flex-shrink: 0;
  margin-top: 4px;
}

.note {
  margin-top: 2.5rem;
  padding: 1.25rem 1.5rem;
  border-radius: 1.25rem;
  background-color: var(--sky-50);
  border: 1px solid var(--sky-200);
  color: var(--sky-800);
  text-align: center;
}
</style>
