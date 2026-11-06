<template>
  <svg class="tw" viewBox="0 0 60 60" aria-hidden="true">
    <g class="roll">
      <circle cx="30" cy="30" r="24" fill="#ece7da" stroke="#0b0b0b" stroke-width="3" />
      <path d="M10 28c10-10 20 10 40-2M12 40c12-8 18 6 36-4M20 12c6 10 2 20 14 34M38 10c-6 12 4 18-4 36" fill="none" stroke="#0b0b0b" stroke-width="2.4" stroke-linecap="round" />
    </g>
  </svg>
</template>

<style scoped>
.tw { height: 100%; width: auto; overflow: visible; }
.roll { transform-box: view-box; transform-origin: 30px 30px; animation: roll 1.1s linear infinite; }
@keyframes roll { to { transform: rotate(360deg); } }
</style>
