<template>
  <svg class="m" viewBox="0 0 270 190" aria-hidden="true">
    <g class="umb">
      <path class="o" d="M135 44V160" />
      <path class="o" fill="#ffd60a" d="M44 72C58 14 212 14 226 72 210 62 196 62 180 72 164 62 150 62 135 72 120 62 106 62 90 72 74 62 58 62 44 72Z" />
      <path fill="#ff3d1f" d="M90 72C96 38 114 24 135 21 128 40 128 58 135 72 120 62 106 62 90 72Z" />
      <path fill="#ff3d1f" d="M180 72C174 38 156 24 135 21 142 40 142 58 135 72 150 62 164 62 180 72Z" />
    </g>
    <rect class="o" x="22" y="160" width="226" height="14" fill="#c9ff2f" />
    <path class="o thin" d="M66 160v14M110 160v14M154 160v14M198 160v14" />

    <!-- A: toma mate -->
    <rect class="o" x="70" y="146" width="56" height="14" rx="7" fill="#0b0b0b" />
    <rect class="o" x="60" y="100" width="26" height="52" rx="9" fill="#ff3d1f" />
    <circle class="o" cx="73" cy="86" r="12" fill="#ece7da" />
    <path class="o" fill="#ffd60a" d="M57 82c4-14 28-14 32 0z" />
    <path class="o thin" d="M70 91q4 3 8 0" />
    <g class="sip a">
      <path class="o" fill="none" d="M82 110 102 120" />
      <rect class="o" x="100" y="110" width="15" height="17" rx="5" fill="#c9ff2f" />
      <path class="o thin" d="M110 110 120 94" />
      <path class="steam s1" d="M104 104q-5-8 0-16" /><path class="steam s2" d="M110 104q5-8 0-16" />
    </g>

    <!-- B: toma mate con otro ritmo -->
    <rect class="o" x="168" y="146" width="56" height="14" rx="7" fill="#0b0b0b" />
    <rect class="o" x="196" y="100" width="26" height="52" rx="9" fill="#c9ff2f" />
    <circle class="o" cx="209" cy="86" r="12" fill="#ece7da" />
    <path class="o" fill="#ff3d1f" d="M193 82c4-14 28-14 32 0z" />
    <path class="o thin" d="M206 91q4 3 8 0" />
    <g class="sip b">
      <path class="o" fill="none" d="M200 110 182 120" />
      <rect class="o" x="166" y="110" width="15" height="17" rx="5" fill="#c9ff2f" />
      <path class="o thin" d="M171 110 162 94" />
      <path class="steam s1" d="M170 104q-5-8 0-16" /><path class="steam s2" d="M176 104q5-8 0-16" />
    </g>
    <rect class="o" x="136" y="128" width="14" height="32" rx="5" fill="#0b0b0b" /><rect x="136" y="138" width="14" height="6" fill="#c9ff2f" />

    <g class="bubble"><path class="o" fill="#ffd60a" d="M96 18h58a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6h-30l-8 10-3-10H96a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z" transform="translate(-8 -6) scale(.9)" /><text class="hand" x="118" y="26" text-anchor="middle">¿cebás?</text></g>
  </svg>
</template>

<style scoped>
.m { overflow: visible; height: 100%; width: auto; }
.o { stroke: #0b0b0b; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
.thin { stroke-width: 2.5; fill: none; }
.umb { transform-box: view-box; transform-origin: 135px 160px; transform: rotate(calc(var(--w-lean, 0deg) * 0.5)); }
.umb { animation: umb calc(var(--w-period, 5s) * 1.2) ease-in-out infinite alternate; }
@keyframes umb { to { transform: rotate(calc(var(--w-lean, 0deg) * 0.5 + var(--w-sway, 4deg) * 0.25)); } }
.sip { transform-box: view-box; animation: sip 4.4s ease-in-out infinite; }
.sip.a { transform-origin: 82px 110px; } .sip.b { transform-origin: 200px 110px; animation-delay: -2.2s; }
@keyframes sip { 0%, 45%, 100% { transform: rotate(0); } 55%, 80% { transform: rotate(-38deg); } }
.sip.b { animation-name: sipb; }
@keyframes sipb { 0%, 45%, 100% { transform: rotate(0); } 55%, 80% { transform: rotate(38deg); } }
.steam { fill: none; stroke: #0b0b0b; stroke-width: 2.5; stroke-linecap: round; opacity: 0; animation: steam 2s ease-out infinite; }
.s2 { animation-delay: 0.7s; }
@keyframes steam { 0% { opacity: 0; transform: translateY(4px); } 40% { opacity: 0.9; } 100% { opacity: 0; transform: translateY(-14px); } }
.bubble { transform-box: view-box; transform-origin: 118px 40px; animation: bub 6s ease-in-out infinite; }
@keyframes bub { 0%, 55%, 100% { opacity: 0; transform: scale(0.6); } 62%, 90% { opacity: 1; transform: scale(1); } }
.hand { font: 20px var(--font-hand); fill: #0b0b0b; }
</style>
