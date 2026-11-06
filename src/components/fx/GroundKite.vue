<template>
  <svg class="gk" viewBox="0 0 230 74" aria-hidden="true">
    <path class="o" fill="none" d="M2 68q40-9 100-3t126 3" />
    <g class="flat">
      <path class="o" fill="#0b0b0b" d="M10 56C22 30 104 20 156 42 116 40 94 48 86 60 62 50 36 50 10 56Z" />
      <path fill="#c9ff2f" d="M44 54C58 38 108 32 138 44 112 44 98 50 90 56 76 52 60 52 44 54Z" />
    </g>
    <path class="thin" d="M18 54 176 64M150 42 178 62M86 60 178 64" />
    <path class="o" d="M170 62h24" />
    <rect class="o" x="196" y="52" width="26" height="14" rx="6" fill="#ffd60a" />
  </svg>
</template>

<style scoped>
.gk { overflow: visible; height: 100%; width: auto; }
.o { stroke: #0b0b0b; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
.thin { fill: none; stroke: #0b0b0b; stroke-width: 1.6; }
.flat { transform-box: view-box; transform-origin: 86px 62px; animation: flutter calc(var(--w-period, 5s) * 0.45) ease-in-out infinite alternate; }
@keyframes flutter { from { transform: skewX(calc(var(--w-sway, 4deg) * -0.5)) scaleY(calc(1 - var(--w-flap, 0.1))); } to { transform: skewX(calc(var(--w-sway, 4deg) * 0.5)) scaleY(calc(1 + var(--w-flap, 0.1))); } }
</style>
