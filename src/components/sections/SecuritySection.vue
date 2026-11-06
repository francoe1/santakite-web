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
          <p class="eyebrow">[06] Seguridad y protocolo</p>
          <h2 class="section-title">Navegamos bien.<br />Volvemos todos.</h2>
        </div>
        <p class="intro"><Icon name="alert" :size="26" /><span>{{ security.intro }}</span></p>
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
.intro { display: flex; gap: 14px; align-items: flex-start; padding: 22px 20px; margin-bottom: 32px; background: repeating-linear-gradient(-45deg, var(--yellow) 0 18px, #f2c800 18px 36px); border: var(--bw) solid var(--ink); font-weight: 700; box-shadow: var(--shadow-sm); }
.intro span { background: var(--yellow); padding: 2px 6px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.intro svg { flex: none; margin-top: 2px; background: var(--ink); color: var(--yellow); padding: 3px; width: 32px; height: 32px; }
.steps { display: grid; gap: 16px; }
.step { background: var(--paper); border: var(--bw) solid var(--ink); box-shadow: var(--shadow-sm); }
.head { width: 100%; display: flex; align-items: center; gap: 14px; padding: 16px 18px; text-align: left; min-height: 74px; }
.n { font-family: var(--font-display); font-size: 2.4rem; line-height: 1; color: transparent; -webkit-text-stroke: 1.5px var(--ink); }
.t { flex: 1; font-family: var(--font-display); font-size: 1.9rem; text-transform: uppercase; line-height: 1; }
.chev { transition: transform 0.2s; }
.open .chev { transform: rotate(180deg); }
.panel { padding: 0 18px 22px; }
.panel ul { display: grid; gap: 14px; }
.panel li { display: grid; grid-template-columns: 24px 1fr; gap: 10px; font-weight: 500; }
.panel li svg { margin-top: 2px; background: var(--volt); border: 1.5px solid var(--ink); padding: 2px; width: 22px; height: 22px; }
@media (min-width: 1024px) {
  .top { display: grid; grid-template-columns: 1.2fr 1fr; gap: 64px; align-items: end; }
  .intro { margin-bottom: 64px; padding: 28px; font-size: 1.1rem; }
  .steps { grid-template-columns: repeat(3, 1fr); gap: 36px; }
  .step { box-shadow: var(--shadow); transition: transform 0.12s, box-shadow 0.12s; }
  .step:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 var(--ink); }
  .step:nth-child(2) { margin-top: 36px; }
  .step:nth-child(3) { margin-top: 72px; }
  .head { flex-direction: column; align-items: flex-start; cursor: default; padding: 24px 24px 8px; min-height: 0; gap: 22px; }
  .n { font-size: 8rem; line-height: 0.8; -webkit-text-stroke-width: 2px; }
  .t { font-size: 2.4rem; }
  .panel { padding: 8px 24px 28px; }
}
</style>
