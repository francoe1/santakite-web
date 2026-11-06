<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from '../ui/Icon.vue'
import Sheet from '../ui/Sheet.vue'
import { useIsDesktop } from '@/composables/useMediaQuery'

const props = defineProps({
  spots: { type: Array, default: () => [] },
  currentId: { type: String, default: null },
  tone: { type: String, default: 'dark' },
})
const emit = defineEmits(['select'])

const isDesktop = useIsDesktop()
const open = ref(false)
const root = ref(null)

const current = () => props.spots.find((s) => s.id === props.currentId) ?? props.spots[0]
const choose = (id) => {
  emit('select', id)
  open.value = false
}
const onDoc = (e) => {
  if (isDesktop.value && open.value && root.value && !root.value.contains(e.target)) open.value = false
}
const onKey = (e) => e.key === 'Escape' && (open.value = false)
onMounted(() => {
  document.addEventListener('pointerdown', onDoc)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDoc)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div ref="root" class="switcher">
    <button
      type="button"
      class="trigger"
      :aria-expanded="open"
      aria-haspopup="listbox"
      aria-label="Cambiar de spot"
      @click="open = !open"
    >
      <Icon name="pin" :size="16" />
      <span class="name">{{ current()?.name }}</span>
      <Icon name="chevron" :size="16" class="chev" :class="{ up: open }" />
    </button>

    <!-- Desktop: popover -->
    <Transition name="pop">
      <ul v-if="open && isDesktop" class="popover" role="listbox">
        <li v-for="s in spots" :key="s.id" role="option" :aria-selected="s.id === currentId">
          <button type="button" class="opt" :class="{ on: s.id === currentId }" @click="choose(s.id)">
            <span class="opt-name">{{ s.name }}</span>
            <span class="opt-loc">{{ s.location }}</span>
            <Icon v-if="s.id === currentId" name="check" :size="18" class="opt-check" />
          </button>
        </li>
      </ul>
    </Transition>

    <!-- Mobile: bottom sheet -->
    <Sheet v-if="!isDesktop" v-model="open" title="Elegí tu spot" eyebrow="Spots disponibles">
      <ul class="sheet-list">
        <li v-for="s in spots" :key="s.id">
          <button type="button" class="s-opt" :class="{ on: s.id === currentId }" @click="choose(s.id)">
            <span>
              <strong>{{ s.name }}</strong>
              <small>{{ s.location }}</small>
              <small class="winds">Viento ideal: {{ (s.forecast?.preferredDirections || []).slice(0, 4).join(' · ') }}</small>
            </span>
            <Icon v-if="s.id === currentId" name="check" :size="22" />
          </button>
        </li>
      </ul>
    </Sheet>
  </div>
</template>

<style scoped>
.switcher {
  position: relative;
}
.trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid var(--ink-line);
  color: var(--text-inv);
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;
}
.trigger:hover {
  background: rgba(255, 255, 255, 0.14);
}
.name {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chev {
  transition: transform 0.2s;
}
.chev.up {
  transform: rotate(180deg);
}
.popover {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 320px;
  padding: 8px;
  background: var(--sand-50);
  color: var(--text);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-2);
  z-index: 70;
}
.opt {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  text-align: left;
  gap: 0 12px;
  padding: 12px 14px;
  border-radius: 12px;
}
.opt:hover,
.opt.on {
  background: var(--sand-100);
}
.opt-name {
  font-weight: 700;
}
.opt-loc {
  grid-column: 1;
  font-size: 13px;
  color: var(--text-soft);
}
.opt-check {
  grid-row: 1 / span 2;
  grid-column: 2;
  align-self: center;
  color: var(--ok);
}
.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.sheet-list {
  display: grid;
  gap: 10px;
}
.s-opt {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  padding: 16px;
  border-radius: var(--r-md);
  border: 1.5px solid var(--sand-line);
  background: #fff;
  min-height: 72px;
}
.s-opt.on {
  border-color: var(--sun-500);
  background: var(--sun-100);
}
.s-opt strong {
  display: block;
  font-family: var(--font-display);
  font-size: 1.15rem;
}
.s-opt small {
  display: block;
  color: var(--text-soft);
  font-size: 13px;
}
.winds {
  font-family: var(--font-mono);
  margin-top: 2px;
}
</style>
