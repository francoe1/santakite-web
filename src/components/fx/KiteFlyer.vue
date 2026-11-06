<script setup>
// Persona en tierra con el kite volando alto; el kite sigue el viento real.
import Kite from './Kite.vue'
defineProps({ wild: { type: Boolean, default: false } })
</script>

<template>
  <svg class="kf" :class="{ wild }" viewBox="0 0 170 327" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <g class="fly">
      <path class="lines" d="M13.2 62.1 62 238M156.8 62.1 108 238M85 72.5 80 238M85 72.5 90 238" />
      <g transform="translate(7 8) scale(.52)"><Kite /></g>
    </g>
    <path class="o" fill="none" d="M62 238H108" />
    <path class="o" fill="none" d="M76 252 64 238M94 252 106 238" />
    <rect class="o" x="74" y="250" width="22" height="38" rx="8" fill="#ff3d1f" />
    <circle class="o" cx="85" cy="238" r="0" />
    <circle class="o" cx="85" cy="236" r="11" fill="#ece7da" transform="translate(0 -4)" />
    <path class="o" fill="none" d="M80 288 74 322M90 288 98 322" />
    <path class="o" fill="none" d="M62 324h20M90 324h20" />
  </svg>
</template>

<style scoped>
.kf { overflow: visible; height: 100%; width: auto; }
.o { stroke: #0b0b0b; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
.lines { fill: none; stroke: #0b0b0b; stroke-width: 1.8; }
.fly { transform-box: view-box; transform-origin: 85px 238px; animation: fly calc(var(--w-period, 5s) * 0.9) ease-in-out infinite alternate; }
@keyframes fly { from { transform: rotate(calc(var(--w-sway, 4deg) * -1.1 + var(--w-lean, 0deg) * 0.8)); } to { transform: rotate(calc(var(--w-sway, 4deg) * 1.1 + var(--w-lean, 0deg) * 0.8)); } }
.wild .fly { animation: wild 1.3s ease-in-out infinite alternate; }
@keyframes wild { from { transform: rotate(-46deg); } to { transform: rotate(46deg); } }
</style>
