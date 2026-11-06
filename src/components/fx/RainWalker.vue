<template>
  <svg class="p" viewBox="0 0 170 175" aria-hidden="true">
    <g class="all">
      <g class="legB"><path class="o" fill="none" d="M82 118 78 156M68 156h18" /></g>
      <g class="legA"><path class="o" fill="none" d="M92 118 98 156M88 156h18" /></g>
      <rect class="o" x="72" y="72" width="28" height="48" rx="9" fill="#ff3d1f" />
      <circle class="o" cx="86" cy="58" r="12" fill="#ece7da" />
      <path class="o" fill="none" d="M88 62q4 3 8 0" />
      <path class="o" fill="none" d="M96 84 104 60" />
      <path class="o" d="M104 60V22" />
      <path class="o" fill="#ffd60a" d="M52 28C58-6 150-6 156 28c-8-8-14-8-20 0-8-8-14-8-20 0-6-8-14-8-20 0-6-8-12-8-20 0z" transform="translate(-4 4)" />
    </g>
    <circle class="drip d1" cx="60" cy="34" r="2.5" /><circle class="drip d2" cx="106" cy="38" r="2.5" /><circle class="drip d3" cx="146" cy="32" r="2.5" />
  </svg>
</template>

<style scoped>
.p { overflow: visible; height: 100%; width: auto; }
.o { stroke: #0b0b0b; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
.all { animation: step 0.8s ease-in-out infinite; }
@keyframes step { 50% { transform: translateY(-3px); } }
.legA, .legB { transform-box: view-box; transform-origin: 88px 118px; }
.legA { animation: swingA 0.8s ease-in-out infinite; } .legB { animation: swingB 0.8s ease-in-out infinite; }
@keyframes swingA { 0%, 100% { transform: rotate(-22deg); } 50% { transform: rotate(22deg); } }
@keyframes swingB { 0%, 100% { transform: rotate(22deg); } 50% { transform: rotate(-22deg); } }
.drip { fill: #8fd3ff; stroke: #0b0b0b; stroke-width: 1.4; animation: drip 0.9s ease-in infinite; }
.d2 { animation-delay: 0.3s; } .d3 { animation-delay: 0.6s; }
@keyframes drip { from { transform: translateY(0); opacity: 1; } to { transform: translateY(40px); opacity: 0; } }
</style>
