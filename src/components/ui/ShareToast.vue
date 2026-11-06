<script setup>
import { useShare } from '@/composables/useShare'
const { message } = useShare()
</script>

<template>
  <Transition name="toast">
    <p v-if="message" class="toast hand" role="status">{{ message }}</p>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed; left: 50%; z-index: 1100; transform: translateX(-50%) rotate(-1deg);
  bottom: calc(var(--tabbar-h) + 24px + env(safe-area-inset-bottom, 0px));
  width: min(92vw, 520px); padding: 12px 16px; font-size: 1.3rem; line-height: 1.15; text-align: center;
  background: var(--yellow); border: var(--bw) solid var(--ink); box-shadow: var(--shadow-sm);
}
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(14px) rotate(-1deg); }
</style>
