<script setup>
// Persona en tierra con el kite volando alto; el kite sigue el viento real.
defineProps({ wild: { type: Boolean, default: false } })
</script>

<template>
  <svg class="kf" :class="{ wild }" viewBox="0 0 170 330" aria-hidden="true">
    <g class="fly">
      <path class="lines" d="M64 238 22 74M106 238 148 66M85 238V96" />
      <g class="kite">
        <path class="o" fill="#0b0b0b" d="M6 78C20 22 152 14 164 66 126 60 102 72 85 100 66 74 40 62 6 78Z" />
        <path fill="#c9ff2f" d="M40 74C56 40 118 34 140 62 112 62 98 72 85 90 70 76 56 72 40 74Z" />
      </g>
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
.kite { transform-box: view-box; transform-origin: 85px 100px; animation: kt calc(var(--w-period, 5s) * 0.5) ease-in-out infinite alternate; }
@keyframes kt { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }
.wild .fly { animation-duration: 1.2s; }
.wild .kite { animation: loop 3.4s linear infinite; }
@keyframes loop { to { transform: rotate(360deg); } }
</style>
