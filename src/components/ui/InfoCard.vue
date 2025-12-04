<template>
  <article :class="['info-card', toneClass]">
    <div v-if="tag || $slots.leading" class="info-card__top">
      <span v-if="tag" class="chip">{{ tag }}</span>
      <slot name="leading" />
    </div>
    <h3 v-if="title">{{ title }}</h3>
    <p v-if="description" class="muted">{{ description }}</p>
    <slot />
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  tag: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'frost',
  },
})

const toneClass = computed(() => {
  if (props.tone === 'dark') return 'info-card--dark'
  if (props.tone === 'plain') return 'info-card--plain'
  return 'info-card--frost'
})
</script>

<style scoped>
.info-card {
  padding: 1.2rem;
  border: 1px solid #dfe7ec;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  height: 100%;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.info-card--frost {
  background: #f9fcfd;
}

.info-card--plain {
  background: #ffffff;
}

.info-card--dark {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(148, 163, 184, 0.22);
  color: #e2e8f0;
}

.info-card--frost:hover,
.info-card--plain:hover {
  border-color: #c7d6dc;
  background: #f4f7f9;
}

.info-card__top {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
}

.info-card h3 {
  font-size: 1.08rem;
  color: inherit;
}

.info-card .muted {
  color: #0f4c5c;
}

.chip {
  align-self: flex-start;
  padding: 0.3rem 0.75rem;
  background: #eef4f6;
  color: #0f4c5c;
  border: 1px solid #dfe7ec;
  font-weight: 700;
  font-size: 0.85rem;
}
</style>
