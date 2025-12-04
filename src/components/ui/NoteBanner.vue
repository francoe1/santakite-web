<template>
  <div class="note-banner" :class="variantClass">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tone: {
    type: String,
    default: 'info',
  },
})

const variantClass = computed(() => {
  if (props.tone === 'muted') return 'note-banner--muted'
  if (props.tone === 'warn') return 'note-banner--warn'
  return 'note-banner--info'
})
</script>

<style scoped>
.note-banner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.6rem;
  padding: 1rem 1.2rem;
  border: 1px solid #dfe7ec;
}

.note-banner--info {
  background: #eef4f6;
  color: #0b2f3f;
}

.note-banner--muted {
  background: #f8fafc;
  color: #0b2f3f;
}

.note-banner--warn {
  background: #fffbeb;
  color: #7c2d12;
  border-color: #f4d4a3;
}
</style>
