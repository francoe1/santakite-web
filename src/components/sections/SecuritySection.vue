<script setup>
import { ref } from 'vue'
import Icon from '../ui/Icon.vue'
import { useIsDesktop } from '@/composables/useMediaQuery'

defineProps({ security: { type: Object, default: () => ({ steps: [], intro: '' }) } })
const isDesktop = useIsDesktop()
const openIdx = ref(0)
const toggle = (i) => (openIdx.value = openIdx.value === i ? -1 : i)
</script>

<template>
  <section id="seguridad" class="section">
    <div class="container">
      <div class="top reveal">
        <div class="section-head">
          <p class="eyebrow">Seguridad y protocolo</p>
          <h2 class="section-title">Navegamos bien para volver todos</h2>
        </div>
        <p class="intro"><Icon name="shield" :size="22" />{{ security.intro }}</p>
      </div>

      <ol class="steps">
        <li v-for="(step, i) in security.steps" :key="step.title" class="step reveal" :class="{ open: isDesktop || openIdx === i }">
          <h3>
            <button type="button" class="head" :aria-expanded="isDesktop || openIdx === i" :disabled="isDesktop" @click="toggle(i)">
              <span class="n mono">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="t">{{ step.title }}</span>
              <Icon v-if="!isDesktop" name="chevron" :size="22" class="chev" />
            </button>
          </h3>
          <div v-show="isDesktop || openIdx === i" class="panel">
            <ul>
              <li v-for="item in step.items" :key="item"><Icon name="check" :size="18" /><span>{{ item }}</span></li>
            </ul>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.intro {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 20px;
  margin-bottom: 28px;
  border-radius: var(--r-md);
  background: var(--sun-100);
  color: #6b2410;
  font-weight: 500;
}
.intro svg { flex: none; margin-top: 2px; color: var(--sun-600); }
.steps { display: grid; gap: 12px; counter-reset: s; }
.step { background: #fff; border: 1.5px solid var(--sand-line); border-radius: var(--r-lg); overflow: hidden; }
.head { width: 100%; display: flex; align-items: center; gap: 14px; padding: 18px 20px; text-align: left; min-height: 72px; }
.n { font-size: 13px; font-weight: 700; color: var(--sun-600); }
.t { flex: 1; font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; letter-spacing: -0.02em; }
.chev { transition: transform 0.25s; }
.open .chev { transform: rotate(180deg); }
.panel { padding: 0 20px 22px; }
.panel ul { display: grid; gap: 14px; }
.panel li { display: grid; grid-template-columns: 22px 1fr; gap: 10px; color: var(--text-soft); }
.panel li svg { color: var(--ok); margin-top: 3px; }

@media (min-width: 1024px) {
  .top { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: end; }
  .intro { margin-bottom: 56px; padding: 28px; font-size: 1.05rem; }
  .steps { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .step { padding: 12px 12px 16px; transition: transform 0.25s, box-shadow 0.25s; }
  .step:hover { transform: translateY(-6px); box-shadow: var(--shadow-1); }
  .head { flex-direction: column; align-items: flex-start; cursor: default; padding: 20px 20px 8px; min-height: 0; gap: 18px; }
  .n { font-size: 3.4rem; font-family: var(--font-display); font-weight: 800; color: var(--sand-200); line-height: 1; }
  .t { font-size: 1.7rem; }
}
</style>
