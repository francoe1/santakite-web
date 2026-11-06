<script setup>
import { scrollToId } from '@/composables/useScrollSpy'

defineProps({ navItems: { type: Array, default: () => [] }, spots: { type: Array, default: () => [] } })
defineEmits(['select-spot'])
</script>

<template>
  <footer class="footer">
    <div class="container cols">
      <div>
        <h4>Explorar</h4>
        <ul>
          <li v-for="n in navItems" :key="n.id"><a :href="`#${n.id}`" @click.prevent="scrollToId(n.id)">{{ n.label }}</a></li>
        </ul>
      </div>
      <div>
        <h4>Spots cercanos</h4>
        <ul>
          <li v-for="s in spots" :key="s.id">
            <button type="button" @click="$emit('select-spot', s.id); scrollToId('hoy')">{{ s.name }}</button>
          </li>
          <li><router-link to="/mapa" class="all">Todos en el mapa →</router-link></li>
        </ul>
      </div>
      <p class="legal">
        Datos de viento: modelo GFS vía Open-Meteo. Son pronósticos: confirmá siempre las condiciones reales en la orilla.
        <br />© {{ new Date().getFullYear() }} SantaKite — hecho en Entre Ríos.
      </p>
    </div>
    <p class="mega" aria-hidden="true">SantaKite</p>
  </footer>
</template>

<style scoped>
.footer { background: var(--ink); color: var(--paper); border-top: var(--bw) solid var(--ink); padding-top: 48px; overflow: hidden; }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 32px 24px; }
h4 { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.12em; color: var(--volt); margin-bottom: 14px; font-weight: 700; }
li a, li button { font-family: var(--font-display); font-size: 1.5rem; text-transform: uppercase; line-height: 1.4; }
li a:hover, li button:hover { color: var(--volt); }
.all { color: var(--volt); }
.legal { grid-column: 1 / -1; font-size: 13px; color: var(--paper-3); max-width: 46ch; }
.mega {
  font-family: var(--font-display); text-transform: uppercase; line-height: 0.8; text-align: center;
  font-size: clamp(4rem, 21vw, 24rem); color: var(--volt); margin-top: 32px; margin-bottom: -0.06em; white-space: nowrap;
  user-select: none;
}
@media (min-width: 1024px) {
  .cols { grid-template-columns: 1fr 1fr 2fr; }
  .legal { grid-column: auto; justify-self: end; text-align: right; }
}
</style>
