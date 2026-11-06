<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Monta el contenido recién cuando está cerca del viewport (mejora la carga inicial).
const props = defineProps({ id: { type: String, default: null }, minHeight: { type: String, default: '480px' }, margin: { type: String, default: '700px' } })
const visible = ref(false)
const el = ref(null)
let io
onMounted(() => {
  if (!('IntersectionObserver' in window)) return (visible.value = true)
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        visible.value = true
        io.disconnect()
      }
    },
    { rootMargin: props.margin }
  )
  io.observe(el.value)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <slot v-if="visible" />
  <div v-else :id="id" ref="el" :style="{ minHeight }" aria-hidden="true"></div>
</template>
