<script setup>
// Hoja tropical grande. dark: relleno negro con nervios flúor.
defineProps({ dark: { type: Boolean, default: false } })
</script>

<template>
  <svg class="leaf" viewBox="0 0 240 300" aria-hidden="true">
    <g class="sway">
      <path class="body" :class="{ dark }" d="M120 296C30 236 6 112 120 8 234 112 210 236 120 296Z" />
      <path class="vein" :class="{ dark }" d="M120 296V34" />
      <path class="vein thin" :class="{ dark }" d="M120 250q-38-14-66-46M120 250q38-14 66-46M120 202q-38-14-62-48M120 202q38-14 62-48M120 154q-34-14-52-46M120 154q34-14 52-46M120 106q-26-10-38-34M120 106q26-10 38-34" />
    </g>
  </svg>
</template>

<style scoped>
.leaf { width: 100%; height: 100%; overflow: visible; }
.sway { transform-box: view-box; transform-origin: 120px 296px; animation: leaf var(--w-period, 5s) ease-in-out var(--ld, 0s) infinite alternate; }
@keyframes leaf { from { transform: rotate(calc(var(--w-sway, 4deg) * -1)); } to { transform: rotate(var(--w-sway, 4deg)); } }
.body { fill: #c9ff2f; stroke: #0b0b0b; stroke-width: 6; stroke-linejoin: round; }
.body.dark { fill: #0b0b0b; }
.vein { fill: none; stroke: #0b0b0b; stroke-width: 5; stroke-linecap: round; }
.vein.thin { stroke-width: 3.5; }
.vein.dark { stroke: #c9ff2f; }
</style>
