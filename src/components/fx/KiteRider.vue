<script setup>
// Kitesurfer cómico. variant: 'ride' (navega), 'jump' (salta), 'confused' (kite loco)
defineProps({ variant: { type: String, default: 'ride' } })
</script>

<template>
  <svg class="rider" :class="variant" viewBox="0 0 220 175" aria-hidden="true">
    <g class="all">
      <g class="kite">
        <path class="o" fill="#0b0b0b" d="M20 52C36 4 150 -8 200 44 150 40 122 56 110 76 80 62 50 54 20 52Z" />
        <path fill="#c9ff2f" d="M52 50C68 22 130 14 164 40 136 42 118 54 110 68 90 58 70 52 52 50Z" />
      </g>
      <g class="lines"><path d="M28 54 96 116M192 46 124 116M110 76V116" /></g>
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
.lines path { fill: none; stroke: #0b0b0b; stroke-width: 1.6; }
.face { stroke-width: 2.5; }
.spray { fill: #ece7da; stroke: #0b0b0b; stroke-width: 1.5; animation: spray 0.7s ease-out infinite; }
.s2 { animation-delay: 0.2s; } .s3 { animation-delay: 0.4s; }
@keyframes spray { 0% { transform: translate(0, 0); opacity: 1; } 100% { transform: translate(-16px, -12px); opacity: 0; } }
.wake { fill: none; stroke: #0b0b0b; stroke-width: 3; stroke-dasharray: 8 6; stroke-linecap: round; animation: wake 0.6s linear infinite; }
@keyframes wake { to { stroke-dashoffset: -14; } }
.all { animation: bob 0.9s ease-in-out infinite alternate; }
@keyframes bob { to { transform: translateY(-4px) rotate(-1deg); } }
.kite { transform-origin: 110px 78px; transition: none; animation: sway 2.2s ease-in-out infinite alternate; }
@keyframes sway { from { transform: rotate(-8deg); } to { transform: rotate(8deg); } }
.hand { font-family: var(--font-hand); font-size: 26px; fill: #0b0b0b; }
.q1 { animation: floaty 1.2s ease-in-out infinite alternate; }
@keyframes floaty { to { transform: translateY(-8px) rotate(6deg); } }

/* salto */
.jump .all { animation: jump 2.6s ease-in-out infinite; }
@keyframes jump { 0%, 45%, 100% { transform: translateY(0); } 62% { transform: translateY(-62px) rotate(-8deg); } 78% { transform: translateY(0); } }
.jump .kite { animation-duration: 0.9s; }
/* kite enloquecido */
.confused .kite { animation: spin 2.4s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.confused .all { animation: wobble 0.5s ease-in-out infinite alternate; }
@keyframes wobble { from { transform: rotate(-3deg); } to { transform: rotate(3deg) translateY(-3px); } }
</style>
