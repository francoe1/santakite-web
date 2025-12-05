<template>
  <div class="card-grid" :style="gridStyle">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  minWidth: {
    type: Number,
    default: 240,
  },
})

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(auto-fit, minmax(${props.minWidth}px, 1fr))`,
}))
</script>

<style scoped>
.card-grid {
  display: grid;
  gap: 1rem;
}
</style>
