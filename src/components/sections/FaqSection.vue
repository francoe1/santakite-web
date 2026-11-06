<script setup>
import { computed } from 'vue'
import { buildFaq } from '@/seo/content'

const props = defineProps({ spot: { type: Object, required: true } })
const items = computed(() => buildFaq(props.spot))
</script>

<template>
  <section id="faq" class="section section--sand" aria-labelledby="faq-title">
    <div class="container wrap">
      <div class="section-head reveal">
        <p class="eyebrow">[07] Preguntas frecuentes</p>
        <h2 id="faq-title" class="section-title">Lo que<br />todos preguntan</h2>
        <p class="section-lead">Sobre {{ spot.name }}: viento, horarios, cómo llegar y seguridad.</p>
      </div>
      <div class="list">
        <details v-for="(f, i) in items" :key="f.q" class="item" :open="i === 0">
          <summary><span class="n mono">{{ String(i + 1).padStart(2, '0') }}</span><h3>{{ f.q }}</h3><span class="plus" aria-hidden="true"></span></summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.list { display: grid; gap: 0; border: var(--bw) solid var(--ink); background: var(--paper); box-shadow: var(--shadow); }
.item + .item { border-top: var(--bw) solid var(--ink); }
summary { display: grid; grid-template-columns: 38px 1fr 28px; gap: 12px; align-items: center; padding: 18px; cursor: pointer; list-style: none; min-height: 68px; }
summary::-webkit-details-marker { display: none; }
summary:hover { background: var(--volt); }
.n { font-size: 12px; font-weight: 700; }
h3 { font-size: 1.5rem; line-height: 1; }
.plus { position: relative; width: 22px; height: 22px; }
.plus::before, .plus::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 3px; background: var(--ink); transform: translateY(-50%); }
.plus::after { transform: translateY(-50%) rotate(90deg); transition: transform 0.15s; }
details[open] .plus::after { transform: translateY(-50%) rotate(0); }
.item p { padding: 0 18px 22px 68px; font-weight: 500; max-width: 70ch; }
@media (min-width: 1024px) {
  .wrap { display: grid; grid-template-columns: 5fr 7fr; gap: 80px; align-items: start; }
  .section-head { position: sticky; top: calc(var(--header-h) + 24px); margin-bottom: 0; }
  summary { padding: 22px 26px; grid-template-columns: 48px 1fr 28px; }
  h3 { font-size: 1.9rem; }
  .item p { padding: 0 26px 26px 86px; font-size: 1.05rem; }
}
</style>
