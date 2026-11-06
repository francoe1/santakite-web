<script setup>
// Kitesurfer con el bolso al hombro, caminando de vuelta sin haber navegado.
</script>

<template>
  <svg class="p" viewBox="0 0 170 175" aria-hidden="true">
    <g class="all">
      <g class="legB"><path class="o" fill="none" d="M96 112 92 154M84 154h18" /></g>
      <g class="legA"><path class="o" fill="none" d="M104 112 110 154M98 154h18" /></g>
      <g class="bag"><rect class="o" x="52" y="46" width="22" height="82" rx="10" fill="#0b0b0b" /><rect x="58" y="60" width="10" height="40" rx="5" fill="#c9ff2f" /></g>
      <rect class="o" x="86" y="70" width="28" height="46" rx="9" fill="#c9ff2f" />
      <path class="o" fill="none" d="M88 80 80 108M112 80 118 108" />
      <circle class="o" cx="102" cy="58" r="12" fill="#ece7da" />
      <path class="o" fill="none" d="M104 62h8M100 55l6 1" />
      <path class="o" fill="none" d="M92 62q-6 2-8 8" />
    </g>
    <g class="think"><circle class="o" cx="128" cy="36" r="3" fill="#ece7da" /><circle class="o" cx="138" cy="24" r="5" fill="#ece7da" /><path class="o" fill="#ece7da" d="M146 6h22a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-22a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8z" transform="translate(-6 -4)" /><text class="dots" x="157" y="20" text-anchor="middle">...</text></g>
  </svg>
</template>

<style scoped>
.p { overflow: visible; height: 100%; width: auto; }
.o { stroke: #0b0b0b; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
.all { animation: step 0.9s ease-in-out infinite; }
@keyframes step { 50% { transform: translateY(-3px); } }
.legA, .legB { transform-box: view-box; transform-origin: 100px 112px; }
.legA { animation: swingA 0.9s ease-in-out infinite; } .legB { animation: swingB 0.9s ease-in-out infinite; }
@keyframes swingA { 0%, 100% { transform: rotate(-22deg); } 50% { transform: rotate(22deg); } }
@keyframes swingB { 0%, 100% { transform: rotate(22deg); } 50% { transform: rotate(-22deg); } }
.think { animation: think 2.5s ease-in-out infinite; }
@keyframes think { 50% { transform: translateY(-5px); } }
.dots { font: 22px var(--font-hand); fill: #0b0b0b; }
</style>
