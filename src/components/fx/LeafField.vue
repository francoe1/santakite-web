<script setup>
import Leaf from './Leaf.vue'

// Hojas grandes en los bordes de toda la página; se balancean con el viento.
const leaves = [
  { side: 'l', top: 14, s: 1.0, r: 62, dark: false, d: 0 },
  { side: 'r', top: 20, s: 0.8, r: -58, dark: true, d: -1.2 },
  { side: 'l', top: 28, s: 0.7, r: 75, dark: true, d: -0.6 },
  { side: 'r', top: 33, s: 1.05, r: -66, dark: false, d: -2 },
  { side: 'l', top: 46, s: 0.95, r: 58, dark: false, d: -1.5 },
  { side: 'r', top: 55, s: 0.75, r: -72, dark: true, d: -0.3 },
  { side: 'l', top: 66, s: 0.8, r: 70, dark: true, d: -2.2 },
  { side: 'r', top: 75, s: 1.0, r: -60, dark: false, d: -0.9 },
  { side: 'l', top: 86, s: 1.0, r: 64, dark: false, d: -1.8 },
  { side: 'r', top: 93, s: 0.8, r: -64, dark: true, d: -0.4 },
]
</script>

<template>
  <div class="field" aria-hidden="true" inert>
    <div v-for="(l, i) in leaves" :key="i" class="slot" :class="l.side" :style="{ top: `${l.top}%`, '--k': l.s, '--r': `${l.r}deg`, '--ld': `${l.d}s` }">
      <Leaf :dark="l.dark" />
    </div>
  </div>
</template>

<style scoped>
.field { position: absolute; inset: 0; z-index: 3; pointer-events: none; user-select: none; -webkit-user-select: none; overflow: hidden; opacity: 0.34; filter: saturate(0.7); }
.slot { --base: 120px; position: absolute; width: calc(var(--base) * var(--k) * 0.8); height: calc(var(--base) * var(--k)); transform: rotate(var(--r)); transform-origin: 50% 100%; }
.slot.l { left: calc(var(--base) * var(--k) * -0.5); }
.slot.r { right: calc(var(--base) * var(--k) * -0.5); }
@media (min-width: 1024px) { .slot { --base: 210px; } }
</style>
