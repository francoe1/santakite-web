<script setup>
// Kite de kitesurf (LEI) fiel al real: tubo inflable, struts, paneles y bridas.
// Se dibuja dentro de un <svg> padre, en un sistema de 300 x 130.
import { computed } from 'vue'
import { INK, YELLOW, defaultPanelColors, kiteGeometry } from '@/utils/kiteShape'

const props = defineProps({
  struts: { type: Array, default: () => [0.15, 0.3, 0.5, 0.7, 0.85] },
  panelColors: { type: Array, default: null },
  tube: { type: String, default: YELLOW },
  bridle: { type: Boolean, default: true },
  tubeW: { type: Number, default: 18 },
})
const g = computed(() => kiteGeometry({ struts: props.struts }))
const colors = computed(() => props.panelColors ?? defaultPanelColors(g.value.panels.length))
</script>

<template>
  <g class="kite-art">
    <path v-for="(d, i) in g.panels" :key="i" :d="d" :fill="colors[i]" :stroke="INK" stroke-width="3" stroke-linejoin="round" />
    <path v-if="bridle" :d="g.attach.map(([x, y]) => `M${x} ${y}L150 124`).join('')" fill="none" :stroke="INK" stroke-width="2" />
    <template v-for="(s, i) in g.struts" :key="i">
      <line :x1="s.x1" :y1="s.y1" :x2="s.x2" :y2="s.y2" :stroke="INK" :stroke-width="tubeW * 0.72" stroke-linecap="round" />
      <line :x1="s.x1" :y1="s.y1" :x2="s.x2" :y2="s.y2" :stroke="tube" :stroke-width="tubeW * 0.36" stroke-linecap="round" />
    </template>
    <path :d="g.lead" fill="none" :stroke="INK" :stroke-width="tubeW" stroke-linecap="round" />
    <path :d="g.lead" fill="none" :stroke="tube" :stroke-width="tubeW * 0.55" stroke-linecap="round" />
  </g>
</template>
