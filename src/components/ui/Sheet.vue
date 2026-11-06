<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import Icon from './Icon.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  /** 'dialog' (centrado) en desktop; siempre bottom-sheet en mobile. */
  wide: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'close'])

const panel = ref(null)
let lastFocus = null

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
const onKey = (e) => {
  if (e.key === 'Escape') close()
}

watch(
  () => props.modelValue,
  async (open) => {
    document.body.classList.toggle('no-scroll', open)
    if (open) {
      lastFocus = document.activeElement
      window.addEventListener('keydown', onKey)
      await nextTick()
      panel.value?.focus()
    } else {
      window.removeEventListener('keydown', onKey)
      lastFocus?.focus?.()
    }
  },
  { immediate: true }
)
onBeforeUnmount(() => {
  document.body.classList.remove('no-scroll')
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="modelValue" class="sheet-root" @click.self="close">
        <div
          ref="panel"
          class="sheet"
          :class="{ 'sheet--wide': wide }"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
        >
          <span class="grab" aria-hidden="true"></span>
          <header class="sheet-head">
            <div>
              <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
              <h3>{{ title }}</h3>
            </div>
            <button type="button" class="x" aria-label="Cerrar" @click="close"><Icon name="close" /></button>
          </header>
          <div class="sheet-body"><slot /></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(4, 20, 29, 0.66);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.sheet {
  width: 100%;
  max-height: 92dvh;
  display: flex;
  flex-direction: column;
  background: var(--sand-50);
  color: var(--text);
  border-radius: var(--r-xl) var(--r-xl) 0 0;
  padding: 10px 20px calc(20px + env(safe-area-inset-bottom, 0px));
  outline: none;
}
.grab {
  align-self: center;
  width: 44px;
  height: 5px;
  border-radius: 99px;
  background: var(--sand-200);
  margin-bottom: 12px;
}
.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 14px;
}
.sheet-head h3 {
  font-size: 1.6rem;
  margin-top: 6px;
}
.sheet-head h3::first-letter {
  text-transform: uppercase;
}
.x {
  flex: none;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--sand-100);
}
.x:hover {
  background: var(--sand-200);
}
.sheet-body {
  overflow: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

@media (min-width: 1024px) {
  .sheet-root {
    align-items: center;
    padding: 40px;
  }
  .sheet {
    width: min(720px, 100%);
    max-height: 86vh;
    border-radius: var(--r-xl);
    padding: 32px;
    box-shadow: var(--shadow-2);
  }
  .sheet--wide {
    width: min(1120px, 100%);
  }
  .grab {
    display: none;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(40px);
}
</style>
