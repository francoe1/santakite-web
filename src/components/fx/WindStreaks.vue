<script setup>
// Rayas de viento: aparecen y corren más rápido cuanto más sopla; van hacia donde va el viento.
const streaks = [
  { top: 18, w: 240, d: 0, s: 1.0 },
  { top: 31, w: 180, d: -5, s: 0.8 },
  { top: 47, w: 300, d: -9, s: 1.2 },
  { top: 58, w: 200, d: -3, s: 0.9 },
  { top: 71, w: 260, d: -12, s: 1.1 },
  { top: 83, w: 170, d: -7, s: 0.8 },
]
</script>

<template>
  <div class="wind" aria-hidden="true">
    <svg v-for="(s, i) in streaks" :key="i" class="st" :style="{ top: `${s.top}%`, width: `${s.w}px`, '--d': `${s.d}s`, '--k': s.s }" viewBox="0 0 260 40" fill="none">
      <path d="M0 22C36 6 76 36 118 20S196 8 226 20C246 28 254 12 240 10C230 9 228 20 238 22" />
    </svg>
  </div>
</template>

<style scoped>
.wind { position: absolute; inset: 0; transform: scaleX(var(--w-dir, 1)); opacity: var(--w-streak, 0.15); }
.st { position: absolute; left: 0; height: auto; stroke: #0b0b0b; stroke-width: 2.4; stroke-linecap: round; transform: translateX(-30vw); animation: streak calc((var(--w-period, 5s) * 3.2 + 4s) / var(--k)) linear var(--d) infinite; }
@keyframes streak { 0% { transform: translateX(-30vw); opacity: 0; } 10%, 85% { opacity: 1; } 100% { transform: translateX(115vw); opacity: 0; } }
</style>
