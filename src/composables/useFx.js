import { ref, watch } from 'vue'

const KEY = 'sk-fx'
const read = () => {
  try {
    const v = localStorage.getItem(KEY)
    if (v !== null) return v === '1'
  } catch { /* sin storage */ }
  return typeof window === 'undefined' ? true : !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Estado global: las animaciones se pueden apagar y se recuerda la elección.
const enabled = ref(read())
watch(enabled, (v) => {
  try {
    localStorage.setItem(KEY, v ? '1' : '0')
  } catch { /* sin storage */ }
})

export const useFx = () => ({ enabled, toggle: () => (enabled.value = !enabled.value) })
