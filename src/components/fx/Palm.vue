<script setup>
// Palmera que se mueve con el viento real (variables --w-*). flip: espejo.
defineProps({ flip: { type: Boolean, default: false } })
const fronds = [-168, -138, -108, -76, -46, -14, 18, 168]
</script>

<template>
  <svg class="palm" :class="{ flip }" viewBox="0 0 280 400" aria-hidden="true">
    <g class="lean"><g class="tree">
      <path class="o" fill="#ffd60a" d="M106 400C98 316 120 230 130 130L154 132C150 232 138 320 144 400Z" />
      <path class="ring" d="M110 352q16 7 32 0M112 312q16 7 32 0M116 272q16 7 32 0M120 232q16 7 32 0M124 192q16 7 32 0M128 154q14 6 26 0" />
      <g v-for="(a, i) in fronds" :key="a" class="fi" :style="{ '--d': `${i * -0.35}s` }">
        <g :transform="`rotate(${a} 142 128)`">
          <g transform="translate(142 128)">
            <path class="o" fill="#c9ff2f" d="M0 0C30-42 96-50 150-4 104-14 52-10 0 0Z" />
            <path class="rib" d="M4-2C52-24 100-24 142-8" />
          </g>
        </g>
      </g>
      <circle class="o" cx="134" cy="136" r="8" fill="#ff3d1f" /><circle class="o" cx="150" cy="138" r="8" fill="#ff3d1f" /><circle class="o" cx="142" cy="148" r="8" fill="#ff3d1f" />
    </g></g>
  </svg>
</template>

<style scoped>
.palm { overflow: visible; height: 100%; width: auto; }
.flip { transform: scaleX(-1); }
.o { stroke: #0b0b0b; stroke-width: 5; stroke-linejoin: round; stroke-linecap: round; }
.ring, .rib { fill: none; stroke: #0b0b0b; stroke-width: 3; stroke-linecap: round; }
.lean { transform-box: view-box; transform-origin: 125px 400px; transform: rotate(var(--w-lean, 0deg)); transition: transform 2s ease; }
.tree { transform-box: view-box; transform-origin: 125px 400px; animation: tree calc(var(--w-period, 5s) * 1.3) ease-in-out infinite alternate; }
@keyframes tree { from { transform: rotate(calc(var(--w-sway, 4deg) * -0.3)); } to { transform: rotate(calc(var(--w-sway, 4deg) * 0.3)); } }
.fi { transform-box: view-box; transform-origin: 142px 128px; animation: frond var(--w-period, 5s) ease-in-out var(--d, 0s) infinite alternate; }
@keyframes frond { from { transform: rotate(calc(var(--w-sway, 4deg) * -0.8)); } to { transform: rotate(calc(var(--w-sway, 4deg) * 0.8)); } }
</style>
