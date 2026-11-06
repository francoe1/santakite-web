<template>
  <svg class="sl" viewBox="0 0 230 105" aria-hidden="true">
    <g class="all">
      <rect class="o" x="6" y="88" width="210" height="14" rx="3" fill="#ffd60a" />
      <path class="o" d="M20 88c0-18 30-18 30 0" fill="#0b0b0b" />
      <rect class="o" x="48" y="60" width="96" height="28" rx="12" fill="#c9ff2f" />
      <path class="o" fill="none" d="M144 76 190 76 190 88M144 82 186 82" />
      <circle class="o" cx="38" cy="66" r="13" fill="#ece7da" />
      <path class="o" fill="#ff3d1f" d="M22 62c4-14 24-14 28-2z" />
      <path class="o" fill="none" d="M34 70q4 3 8 0" />
    </g>
    <g class="zs"><text class="z z1" x="56" y="40">Z</text><text class="z z2" x="76" y="26">z</text><text class="z z3" x="92" y="14">z</text></g>
  </svg>
</template>

<style scoped>
.sl { overflow: visible; height: 100%; width: auto; }
.o { stroke: #0b0b0b; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
.all { transform-box: view-box; transform-origin: 100px 90px; animation: breathe 3s ease-in-out infinite; }
@keyframes breathe { 50% { transform: scale(1.02, 1.05); } }
.z { font: 30px var(--font-hand); fill: #0b0b0b; animation: z 2.4s ease-in infinite; opacity: 0; }
.z2 { animation-delay: 0.7s; } .z3 { animation-delay: 1.4s; }
@keyframes z { 0% { transform: translate(0, 10px) scale(0.6); opacity: 0; } 30% { opacity: 1; } 100% { transform: translate(18px, -26px) scale(1.2); opacity: 0; } }
</style>
