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
.switcher { position: relative; }
.trigger {
  display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 12px;
  border: var(--bw) solid var(--ink); background: var(--volt); box-shadow: var(--shadow-sm);
  font-family: var(--font-mono); font-weight: 700; font-size: 13px; text-transform: uppercase;
}
.trigger:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 var(--ink); }
.name { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.chev { transition: transform 0.15s; }
.chev.up { transform: rotate(180deg); }
.popover {
  position: absolute; right: 0; top: calc(100% + 12px); width: 340px; z-index: 70;
  background: var(--paper); border: var(--bw) solid var(--ink); box-shadow: var(--shadow);
}
.opt { width: 100%; display: grid; grid-template-columns: 1fr auto; text-align: left; gap: 0 12px; padding: 14px 16px; border-bottom: var(--bw) solid var(--ink); }
li:last-child .opt { border-bottom: 0; }
.opt:hover { background: var(--paper-2); }
.opt.on { background: var(--ink); color: var(--paper); }
.opt-name { font-family: var(--font-display); font-size: 1.5rem; text-transform: uppercase; }
.opt-loc { grid-column: 1; font-family: var(--font-mono); font-size: 12px; opacity: 0.75; }
.opt-check { grid-row: 1 / span 2; grid-column: 2; align-self: center; color: var(--volt); }
.pop-enter-active, .pop-leave-active { transition: opacity 0.1s, transform 0.1s; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(-6px); }

.sheet-list { display: grid; gap: 12px; padding: 4px 4px 8px; }
.s-opt {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; text-align: left;
  padding: 16px; min-height: 76px; background: var(--paper); border: var(--bw) solid var(--ink); box-shadow: var(--shadow-sm);
}
.s-opt.on { background: var(--volt); }
.s-opt strong { display: block; font-family: var(--font-display); font-weight: 400; font-size: 1.7rem; text-transform: uppercase; line-height: 1; }
.s-opt small { display: block; font-size: 13px; }
.winds { font-family: var(--font-mono); margin-top: 4px; font-weight: 700; }
</style>
