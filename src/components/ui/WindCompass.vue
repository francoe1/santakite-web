<script setup>
import { computed } from 'vue'
import { getDirectionOffset } from '@/utils/wind'

const props = defineProps({
  /** Grados DE DONDE VIENE el viento (convención meteorológica). */
  deg: { type: Number, default: null },
  /** Direcciones ideales del spot (abreviaturas de 16 puntos). */
  preferred: { type: Array, default: () => [] },
  size: { type: Number, default: 220 },
  dark: { type: Boolean, default: true },
  label: { type: String, default: 'Brújula de viento' },
})

const C = 100
const R = 84
const polar = (angle, r) => {
  const a = ((angle - 90) * Math.PI) / 180
  return [C + r * Math.cos(a), C + r * Math.sin(a)]
}

const wedges = computed(() =>
  [...new Set(props.preferred)].map((abbr) => {
    const mid = getDirectionOffset(abbr)
    const [x1, y1] = polar(mid - 11.25, R)
    const [x2, y2] = polar(mid + 11.25, R)
    const [x3, y3] = polar(mid + 11.25, R - 24)
    const [x4, y4] = polar(mid - 11.25, R - 24)
    return `M${x1} ${y1}A${R} ${R} 0 0 1 ${x2} ${y2}L${x3} ${y3}A${R - 24} ${R - 24} 0 0 0 ${x4} ${y4}Z`
  })
)

const ticks = Array.from({ length: 36 }, (_, i) => {
  const a = i * 10
  const long = i % 9 === 0
  const [x1, y1] = polar(a, R + 8)
  const [x2, y2] = polar(a, R + (long ? 1 : 4))
  return { x1, y1, x2, y2, long }
})

const cardinals = [
  { t: 'N', a: 0 },
  { t: 'E', a: 90 },
  { t: 'S', a: 180 },
  { t: 'O', a: 270 },
].map((c) => {
  const [x, y] = polar(c.a, R - 38)
  return { ...c, x, y }
})

const needleRotation = computed(() => (props.deg == null ? 0 : (props.deg + 180) % 360))
</script>

<template>
  <svg
    class="compass"
    :class="{ 'compass--light': !dark }"
    :width="size"
    :height="size"
    viewBox="0 0 200 200"
    role="img"
    :aria-label="label"
  >
    <circle :cx="C" :cy="C" :r="R + 10" class="ring-bg" />
    <path v-for="(d, i) in wedges" :key="i" :d="d" class="wedge" />
    <circle :cx="C" :cy="C" :r="R" class="ring" fill="none" />
    <line v-for="(t, i) in ticks" :key="i" :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2" :class="['tick', { long: t.long }]" />
    <text v-for="c in cardinals" :key="c.t" :x="c.x" :y="c.y" class="card" text-anchor="middle" dominant-baseline="central">{{ c.t }}</text>
    <g v-if="deg !== null" class="needle" :style="{ transform: `rotate(${needleRotation}deg)` }">
      <path d="M100 38 L111 100 L100 92 L89 100 Z" class="needle-head" />
      <path d="M100 162 L106 100 L100 106 L94 100 Z" class="needle-tail" />
    </g>
    <circle :cx="C" :cy="C" r="6" class="hub" />
  </svg>
</template>

<style scoped>
.compass {
  --c-ring: var(--paper);
  --c-text: var(--paper);
  --c-bg: transparent;
  --c-hub: var(--ink);
  overflow: visible;
}
.compass--light {
  --c-ring: var(--ink);
  --c-text: var(--ink);
}
.ring-bg { fill: var(--c-bg); }
.ring { stroke: var(--c-ring); stroke-width: 2.5; }
.wedge { fill: var(--volt); stroke: var(--ink); stroke-width: 1.2; }
.tick { stroke: var(--c-ring); stroke-width: 1; }
.tick.long { stroke-width: 2.5; }
.card { fill: var(--c-text); font: 700 12px var(--font-mono); }
.needle { transform-origin: 100px 100px; transition: transform 1.1s cubic-bezier(0.3, 1.5, 0.5, 1); }
.needle-head { fill: var(--red); stroke: var(--ink); stroke-width: 1.5; }
.needle-tail { fill: var(--c-text); stroke: var(--ink); stroke-width: 1.5; }
.hub { fill: var(--paper); stroke: var(--ink); stroke-width: 3; }
</style>
