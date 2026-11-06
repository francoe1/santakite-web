<script setup>
import Kite from './Kite.vue'
</script>

<template>
  <svg class="gk" viewBox="0 0 230 74" aria-hidden="true">
    <path class="o" fill="none" d="M2 68q40-9 100-3t126 3" />
    <path class="thin" d="M12 51Q80 66 172 62M150 51Q166 60 196 62M81 56Q130 66 178 62" />
    <g class="flat"><g transform="translate(6 24) scale(.5 .26)"><Kite :tube-w="22" /></g></g>
    <path class="o" d="M170 62h28" />
    <rect class="o" x="198" y="54" width="22" height="14" rx="6" fill="#ffd60a" />
  </svg>
</template>

<style scoped>
.gk { overflow: visible; height: 100%; width: auto; }
.o { stroke: #0b0b0b; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
.thin { fill: none; stroke: #0b0b0b; stroke-width: 1.6; }
.flat { transform-box: view-box; transform-origin: 86px 62px; animation: flutter calc(var(--w-period, 5s) * 0.45) ease-in-out infinite alternate; }
@keyframes flutter { from { transform: skewX(calc(var(--w-sway, 4deg) * -0.5)) scaleY(calc(1 - var(--w-flap, 0.1))); } to { transform: skewX(calc(var(--w-sway, 4deg) * 0.5)) scaleY(calc(1 + var(--w-flap, 0.1))); } }
</style>
