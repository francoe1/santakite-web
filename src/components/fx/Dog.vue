<template>
  <svg class="dog" viewBox="0 0 150 89" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <g class="all">
      <path class="o tail" fill="none" d="M20 44Q6 30 12 16" />
      <g class="leg l1"><path class="o" fill="none" d="M34 60 30 86" /></g>
      <g class="leg l2"><path class="o" fill="none" d="M46 60 52 86" /></g>
      <rect class="o" x="18" y="36" width="76" height="30" rx="15" fill="#ece7da" />
      <path fill="#ffd60a" d="M30 38h22a8 8 0 0 1 0 26H30a13 13 0 0 1 0-26z" opacity=".0" />
      <g class="leg l3"><path class="o" fill="none" d="M74 60 70 86" /></g>
      <g class="leg l4"><path class="o" fill="none" d="M86 60 92 86" /></g>
      <circle class="o" cx="104" cy="40" r="15" fill="#ece7da" />
      <rect class="o" x="110" y="40" width="24" height="14" rx="7" fill="#ece7da" />
      <circle cx="132" cy="43" r="4" fill="#0b0b0b" />
      <path class="o" fill="#0b0b0b" d="M96 30c-8 0-12 10-8 20 6-2 10-8 10-14z" />
      <circle cx="108" cy="36" r="2.6" fill="#0b0b0b" />
      <path class="o" fill="none" d="M92 52Q96 58 106 56" stroke="#ff3d1f" />
      <path class="tongue" fill="#ff3d1f" stroke="#0b0b0b" stroke-width="2" d="M120 54q2 10 7 6" />
    </g>
  </svg>
</template>

<style scoped>
.dog { overflow: visible; height: 100%; width: auto; }
.o { stroke: #0b0b0b; stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
.all { animation: run 0.36s ease-in-out infinite alternate; }
@keyframes run { to { transform: translateY(-5px); } }
.leg { transform-box: view-box; animation: legs 0.36s ease-in-out infinite alternate; }
.l1 { transform-origin: 34px 60px; } .l2 { transform-origin: 46px 60px; animation-direction: alternate-reverse; }
.l3 { transform-origin: 74px 60px; animation-direction: alternate-reverse; } .l4 { transform-origin: 86px 60px; }
@keyframes legs { from { transform: rotate(-32deg); } to { transform: rotate(32deg); } }
.tail { transform-box: view-box; transform-origin: 20px 44px; animation: wag 0.2s ease-in-out infinite alternate; }
@keyframes wag { to { transform: rotate(-24deg); } }
.tongue { animation: tg 0.36s ease-in-out infinite alternate; transform-box: view-box; transform-origin: 120px 54px; }
@keyframes tg { to { transform: scaleY(0.7); } }
</style>
