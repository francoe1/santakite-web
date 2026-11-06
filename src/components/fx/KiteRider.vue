<script setup>
// Kitesurfer cómico. variant: 'ride' (navega), 'jump' (salta), 'confused' (kite loco)
import Kite from './Kite.vue'
defineProps({ variant: { type: String, default: 'ride' } })
</script>

<template>
  <svg class="rider" :class="variant" viewBox="0 0 220 175" aria-hidden="true">
    <g class="all">
      <g class="kite">
        <g transform="translate(17 0) scale(.62)"><Kite /></g>
        <path class="lines" d="M24.4 64.5 94 116M195.6 64.5 126 116M110 77 105 116M110 77 115 116" />
      </g>
      <path class="o" d="M94 116H126" />
      <rect class="o" x="102" y="118" width="16" height="27" rx="6" fill="#ff3d1f" />
      <circle class="o" cx="110" cy="107" r="9" fill="#ece7da" />
      <path class="o face" d="M113 105h4" />
      <path class="o" fill="none" d="M104 125 96 116M116 125 124 116" />
      <path class="o" fill="none" d="M106 145 100 158M114 145 122 158" />
      <rect class="o" x="76" y="158" width="68" height="8" rx="4" fill="#ffd60a" transform="rotate(-5 110 162)" />
      <circle class="spray s1" cx="70" cy="164" r="3" /><circle class="spray s2" cx="58" cy="158" r="2.5" /><circle class="spray s3" cx="46" cy="166" r="2" />
      <path class="wake" d="M6 171c8-6 16-6 24 0s16 6 24 0 16-6 24 0" />
    </g>
    <text v-if="variant === 'confused'" class="hand q1" x="150" y="40">¿?</text>
    <text v-if="variant === 'jump'" class="hand q1" x="158" y="40">¡wooow!</text>
  </svg>
</template>

<style scoped>
.rider { overflow: visible; height: 100%; width: auto; }
.o { stroke: #0b0b0b; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
.lines { fill: none; stroke: #0b0b0b; stroke-width: 1.5; }
.face { stroke-width: 2.5; }
.spray { fill: #ece7da; stroke: #0b0b0b; stroke-width: 1.5; animation: spray 0.7s ease-out infinite; }
.s2 { animation-delay: 0.2s; } .s3 { animation-delay: 0.4s; }
@keyframes spray { 0% { transform: translate(0, 0); opacity: 1; } 100% { transform: translate(-16px, -12px); opacity: 0; } }
.wake { fill: none; stroke: #0b0b0b; stroke-width: 3; stroke-dasharray: 8 6; stroke-linecap: round; animation: wake 0.6s linear infinite; }
@keyframes wake { to { stroke-dashoffset: -14; } }
.all { animation: bob 0.9s ease-in-out infinite alternate; }
@keyframes bob { to { transform: translateY(-4px) rotate(-1deg); } }
.kite { transform-box: view-box; transform-origin: 110px 116px; animation: sway calc(var(--w-period, 5s) * 0.5) ease-in-out infinite alternate; }
@keyframes sway { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }
.hand { font-family: var(--font-hand); font-size: 26px; fill: #0b0b0b; }
.q1 { animation: floaty 1.2s ease-in-out infinite alternate; }
@keyframes floaty { to { transform: translateY(-8px) rotate(6deg); } }

/* salto */
.jump .all { animation: jump 2.6s ease-in-out infinite; }
@keyframes jump { 0%, 45%, 100% { transform: translateY(0); } 62% { transform: translateY(-62px) rotate(-8deg); } 78% { transform: translateY(0); } }
.jump .kite { animation-duration: 0.8s; }
/* kite enloquecido */
.confused .kite { animation: loopy 1.1s ease-in-out infinite alternate; }
@keyframes loopy { from { transform: rotate(-58deg); } to { transform: rotate(58deg); } }
.confused .all { animation: wobble 0.5s ease-in-out infinite alternate; }
@keyframes wobble { from { transform: rotate(-3deg); } to { transform: rotate(3deg) translateY(-3px); } }
</style>
