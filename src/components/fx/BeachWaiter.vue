<script setup>
import Kite from './Kite.vue'
// Kitesurfer impaciente esperando que levante el viento (camina de un lado a otro).
</script>

<template>
  <svg class="w" viewBox="0 0 170 155" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <g class="flip">
      <g class="kite"><g transform="translate(88 125) scale(.3 .2)"><Kite :tube-w="24" /></g></g>
      <path class="o" fill="none" d="M74 116 70 150" />
      <path class="o foot" fill="none" d="M86 116 92 150" />
      <path class="o" d="M62 152h14M86 152h14" fill="none" />
      <rect class="o" x="66" y="72" width="26" height="46" rx="9" fill="#ff3d1f" />
      <path class="o" fill="none" d="M68 82 56 102" />
      <path class="o arm" fill="none" d="M90 82 106 66" />
      <circle class="o" cx="80" cy="56" r="12" fill="#ece7da" />
      <path class="o" fill="none" d="M76 58h8M84 52l5 2" />
      <path class="o" fill="#ffd60a" d="M68 50c4-10 20-10 24 0z" />
      <path class="sweat" d="M96 48c3 4 3 8 0 9-3-1-3-5 0-9z" />
    </g>
    <g class="bubble">
      <path class="o" fill="#ffd60a" d="M14 8h72a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H58l-8 12-4-12H14a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8z" />
      <text class="hand t1" x="50" y="34" text-anchor="middle">¿ya?</text>
      <text class="hand t2" x="50" y="34" text-anchor="middle">…</text>
    </g>
  </svg>
</template>

<style scoped>
.w { overflow: visible; height: 100%; width: auto; }
.o { stroke: #0b0b0b; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
.flip { transform-box: view-box; transform-origin: 80px 90px; animation: flip 14s steps(1) infinite; }
@keyframes flip { 0% { transform: scaleX(1); } 50% { transform: scaleX(-1); } }
.kite { transform-box: fill-box; transform-origin: 50% 100%; animation: flap 0.7s ease-in-out infinite alternate; }
@keyframes flap { from { transform: scaleY(0.82); } to { transform: scaleY(1.08); } }
.foot { transform-box: view-box; transform-origin: 86px 116px; animation: tap 0.5s ease-in-out infinite alternate; }
@keyframes tap { to { transform: rotate(-14deg); } }
.arm { transform-box: view-box; transform-origin: 90px 82px; animation: look 2.4s ease-in-out infinite alternate; }
@keyframes look { to { transform: rotate(-10deg); } }
.sweat { fill: #8fd3ff; stroke: #0b0b0b; stroke-width: 1.6; animation: sweat 1.6s ease-in infinite; }
@keyframes sweat { 0% { transform: translateY(-6px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(26px); opacity: 0; } }
.bubble { transform-box: view-box; transform-origin: 50px 56px; animation: pop 3s ease-in-out infinite; }
@keyframes pop { 0%, 100% { transform: scale(1) rotate(-3deg); } 50% { transform: scale(1.08) rotate(3deg); } }
.hand { font-family: var(--font-hand); font-size: 26px; fill: #0b0b0b; }
.t1 { animation: t1 4s steps(1) infinite; } .t2 { animation: t2 4s steps(1) infinite; }
@keyframes t1 { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes t2 { 0%, 49% { opacity: 0; } 50%, 100% { opacity: 1; } }
</style>
