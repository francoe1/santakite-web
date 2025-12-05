<template>
  <section :id="id" :class="['section-shell', toneClass]">
    <header v-if="hasHeader" class="section-shell__head">
      <div class="section-shell__eyebrow" v-if="eyebrow">{{ eyebrow }}</div>
      <div class="section-shell__titles">
        <h2 v-if="title">{{ title }}</h2>
        <p v-if="description" class="muted">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="section-shell__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="section-shell__body">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  id: {
    type: String,
    default: null,
  },
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'soft',
  },
})

const slots = useSlots()
const hasHeader = computed(() => props.eyebrow || props.title || props.description || !!slots.actions)
const toneClass = computed(() => (props.tone === 'plain' ? 'section-shell--plain' : 'section-shell--soft'))
</script>

<style scoped>
.section-shell {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.section-shell--soft {
  background: #ffffff;
  border: 1px solid #dfe7ec;
  padding: 1.4rem;
}

.section-shell--plain {
  padding: 0;
}

.section-shell__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.section-shell__eyebrow {
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: #0f4c5c;
  font-weight: 800;
}

.section-shell__titles {
  flex: 1;
  min-width: 220px;
}

.section-shell__titles h2 {
  font-size: clamp(1.6rem, 2.6vw, 2.15rem);
  margin-bottom: 0.35rem;
  color: #0b1f2a;
}

.section-shell__titles .muted {
  color: #0f4c5c;
  max-width: 720px;
}

.section-shell__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
