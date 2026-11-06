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
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(11, 11, 11, 0.72);
  display: flex; align-items: flex-end; justify-content: center;
}
.sheet {
  width: 100%; max-height: 92dvh; display: flex; flex-direction: column;
  background: var(--paper); color: var(--ink);
  border: var(--bw) solid var(--ink); border-bottom: 0;
  padding: 10px 18px calc(18px + env(safe-area-inset-bottom, 0px));
  outline: none;
}
.grab { align-self: center; width: 48px; height: 6px; background: var(--ink); margin-bottom: 12px; }
.sheet-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-bottom: 16px; }
.sheet-head h3 { font-size: clamp(2.2rem, 7vw, 3.6rem); margin-top: 10px; }
.sheet-head h3::first-letter { text-transform: uppercase; }
.x {
  flex: none; width: 46px; height: 46px; display: grid; place-items: center;
  border: var(--bw) solid var(--ink); background: var(--volt); box-shadow: var(--shadow-sm);
}
.x:hover { background: var(--ink); color: var(--volt); }
.sheet-body { overflow: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }

@media (min-width: 1024px) {
  .sheet-root { align-items: center; padding: 40px; }
  .sheet { width: min(720px, 100%); max-height: 88vh; border-bottom: var(--bw) solid var(--ink); padding: 32px; box-shadow: 12px 12px 0 var(--volt); }
  .sheet--wide { width: min(1160px, 100%); }
  .grab { display: none; }
}
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.18s ease; }
.sheet-enter-active .sheet, .sheet-leave-active .sheet { transition: transform 0.25s cubic-bezier(0.2, 0.9, 0.2, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet, .sheet-leave-to .sheet { transform: translateY(30px); }
</style>
