<script setup>
import Icon from '../ui/Icon.vue'

defineProps({ contacts: { type: Array, default: () => [] }, spot: { type: Object, default: null } })

const iconFor = { whatsapp: 'chat', instagram: 'external', location: 'pin' }
</script>

<template>
  <section id="contacto" class="section section--volt contact">
    <div class="container inner">
      <div class="copy reveal">
        <p class="eyebrow">[07] Contacto</p>
        <h2 class="section-title">Vení a<br />navegar con<br />nosotros</h2>
        <p class="section-lead hand">¿Dudas sobre el viento, el acceso o las zonas de {{ spot?.name }}? Escribinos antes de salir.</p>
      </div>
      <ul class="items reveal">
        <li v-for="c in contacts" :key="c.label">
          <component
            :is="c.href ? 'a' : 'div'"
            class="item"
            :href="c.href"
            :target="c.href ? '_blank' : null"
            :rel="c.href ? 'noreferrer' : null"
          >
            <span class="ic"><Icon :name="iconFor[c.icon] || 'chat'" :size="24" /></span>
            <span class="txt">
              <small>{{ c.label }}</small>
              <strong>{{ c.value }}</strong>
              <em v-if="c.detail">{{ c.detail }}</em>
            </span>
            <Icon v-if="c.href" name="arrow" :size="20" class="go" />
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.contact { overflow: hidden; }
.section-lead { font-family: var(--font-hand); font-size: 1.5rem; font-weight: 400; line-height: 1.2; }
.inner { position: relative; display: grid; gap: 36px; }
.items { display: grid; gap: 16px; align-content: start; }
.item { display: flex; align-items: center; gap: 16px; padding: 16px 18px; min-height: 88px; background: var(--ink); color: var(--paper); border: var(--bw) solid var(--ink); box-shadow: 6px 6px 0 var(--paper); transition: transform 0.12s, box-shadow 0.12s; }
a.item:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 var(--paper); }
.ic { flex: none; width: 52px; height: 52px; display: grid; place-items: center; background: var(--volt); color: var(--ink); }
.txt { flex: 1; min-width: 0; display: grid; }
.txt small { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--volt); }
.txt strong { font-family: var(--font-display); font-weight: 400; font-size: 1.6rem; text-transform: uppercase; line-height: 1.1; overflow-wrap: anywhere; }
.txt em { font-style: normal; font-size: 13px; color: var(--paper-3); }
.go { color: var(--volt); }
@media (min-width: 1024px) { .inner { grid-template-columns: 1.2fr 1fr; gap: 96px; align-items: center; } }
</style>
