<script setup>
defineProps({ tone: { type: String, default: 'muted' } })
</script>
<template>
  <span class="tag" :class="`tag--${tone}`"><i aria-hidden="true"></i><slot /></span>
</template>
<style scoped>
.tag {
  display: inline-flex; align-items: center; gap: 8px;
  min-height: 30px; padding: 0 12px;
  font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
  border: var(--bw) solid var(--ink);
  background: var(--paper-2); color: var(--ink);
}
i { width: 9px; height: 9px; background: currentColor; }
.tag--ok { background: var(--volt); }
.tag--ok i { animation: blink 1.2s steps(2) infinite; }
.tag--warn { background: var(--yellow); }
.tag--bad { background: var(--red); color: #fff; }
.tag--muted { background: var(--paper-2); }
@keyframes blink { 50% { opacity: 0; } }
</style>
