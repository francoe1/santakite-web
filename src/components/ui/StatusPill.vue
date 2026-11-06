<script setup>
defineProps({ tone: { type: String, default: 'muted' } })
</script>
<template>
  <span class="pill" :class="`pill--${tone}`"><i class="dot" aria-hidden="true"></i><slot /></span>
</template>
<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}
.pill--ok { color: #5ff0b4; background: rgba(23, 165, 111, 0.16); border-color: rgba(23, 165, 111, 0.5); }
.pill--ok .dot { box-shadow: 0 0 0 0 currentColor; animation: ping 1.8s infinite; }
.pill--warn { color: #ffcf5c; background: rgba(227, 164, 23, 0.14); border-color: rgba(227, 164, 23, 0.45); }
.pill--bad { color: #ff9288; background: rgba(214, 72, 59, 0.14); border-color: rgba(214, 72, 59, 0.45); }
.pill--muted { color: var(--text-inv-soft); background: rgba(255, 255, 255, 0.06); border-color: var(--ink-line); }
@keyframes ping { 70% { box-shadow: 0 0 0 8px transparent; } 100% { box-shadow: 0 0 0 0 transparent; } }
</style>
