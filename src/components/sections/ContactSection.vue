<script setup>
import Icon from '../ui/Icon.vue'

defineProps({ contacts: { type: Array, default: () => [] }, spot: { type: Object, default: null } })

const iconFor = { whatsapp: 'chat', instagram: 'external', location: 'pin' }
</script>

<template>
  <section id="contacto" class="section section--dark contact">
    <div class="glow" aria-hidden="true"></div>
    <div class="container inner">
      <div class="copy reveal">
        <p class="eyebrow">Contacto</p>
        <h2 class="section-title">Vení a navegar con nosotros</h2>
        <p class="section-lead">¿Dudas sobre el viento, el acceso o las zonas de {{ spot?.name }}? Escribinos antes de salir.</p>
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
.contact { overflow: hidden; background: linear-gradient(180deg, var(--ink-900), var(--ink-950)); }
.glow { position: absolute; left: -10%; bottom: -40%; width: 70vw; max-width: 900px; aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle, rgba(255, 106, 61, 0.22), transparent 65%); }
.inner { position: relative; display: grid; gap: 36px; }
.items { display: grid; gap: 12px; align-content: start; }
.item {
  display: flex; align-items: center; gap: 16px; padding: 18px 20px; min-height: 84px;
  border-radius: var(--r-md); background: rgba(255, 255, 255, 0.06); border: 1px solid var(--ink-line);
  transition: background 0.2s, transform 0.2s, border-color 0.2s;
}
a.item:hover { background: rgba(255, 255, 255, 0.12); transform: translateX(6px); border-color: var(--sun-500); }
.ic { flex: none; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 50%; background: rgba(255, 106, 61, 0.18); color: var(--sun-500); }
.txt { flex: 1; min-width: 0; display: grid; }
.txt small { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-inv-soft); }
.txt strong { font-size: 1.1rem; overflow-wrap: anywhere; }
.txt em { font-style: normal; font-size: 13px; color: var(--text-inv-soft); }
.go { color: var(--text-inv-soft); }
@media (min-width: 1024px) {
  .inner { grid-template-columns: 1fr 1fr; gap: 96px; align-items: center; }
}
</style>
