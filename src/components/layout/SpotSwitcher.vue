<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Icon from '../ui/Icon.vue'
import Sheet from '../ui/Sheet.vue'
import { useIsDesktop } from '@/composables/useMediaQuery'
import { COUNTRY_ORDER, normalize } from '@/utils/geo'

const props = defineProps({
  spots: { type: Array, default: () => [] },
  currentId: { type: String, default: null },
  tone: { type: String, default: 'dark' },
})
const emit = defineEmits(['select'])

const isDesktop = useIsDesktop()
const open = ref(false)
const root = ref(null)
const query = ref('')
const searchEl = ref(null)

const groups = computed(() => {
  const q = normalize(query.value)
  const list = props.spots.filter((s) => !q || normalize(`${s.name} ${s.locality} ${s.region} ${s.countryName}`).includes(q))
  return COUNTRY_ORDER.map((code) => ({ code, name: list.find((s) => s.country === code)?.countryName, spots: list.filter((s) => s.country === code) })).filter((g) => g.spots.length)
})
watch(open, async (o) => {
  if (!o) query.value = ''
  else if (isDesktop.value) {
    await nextTick()
    searchEl.value?.focus()
  }
})

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
      <div v-if="open && isDesktop" class="popover">
        <input ref="searchEl" v-model="query" class="search" type="search" placeholder="Buscar spot, ciudad o país" aria-label="Buscar spot" />
        <div class="scroll">
          <section v-for="g in groups" :key="g.code">
            <h4 class="gh">{{ g.name }} <span>{{ g.spots.length }}</span></h4>
            <ul role="listbox">
              <li v-for="s in g.spots" :key="s.id" role="option" :aria-selected="s.id === currentId">
                <button type="button" class="opt" :class="{ on: s.id === currentId }" @click="choose(s.id)">
                  <span class="opt-name">{{ s.name }}</span>
                  <span class="opt-loc">{{ s.region }}<template v-if="!s.verified"> · en revisión</template></span>
                  <Icon v-if="s.id === currentId" name="check" :size="18" class="opt-check" />
                </button>
              </li>
            </ul>
          </section>
          <p v-if="!groups.length" class="none">Sin resultados para “{{ query }}”.</p>
        </div>
        <router-link to="/mapa" class="maplink" @click="open = false"><Icon name="map" :size="18" />Ver todos en el mapa</router-link>
      </div>
    </Transition>

    <!-- Mobile: bottom sheet -->
    <Sheet v-if="!isDesktop" v-model="open" title="Elegí tu spot" eyebrow="Spots disponibles">
      <input v-model="query" class="search" type="search" placeholder="Buscar spot, ciudad o país" aria-label="Buscar spot" />
      <router-link to="/mapa" class="maplink m" @click="open = false"><Icon name="map" :size="18" />Ver todos en el mapa</router-link>
      <section v-for="g in groups" :key="g.code" class="grp">
        <h4 class="gh">{{ g.name }} <span>{{ g.spots.length }}</span></h4>
        <ul class="sheet-list">
          <li v-for="s in g.spots" :key="s.id">
            <button type="button" class="s-opt" :class="{ on: s.id === currentId }" @click="choose(s.id)">
              <span>
                <strong>{{ s.name }}</strong>
                <small>{{ s.region }}<template v-if="!s.verified"> · en revisión</template></small>
              </span>
              <Icon v-if="s.id === currentId" name="check" :size="22" />
            </button>
          </li>
        </ul>
      </section>
      <p v-if="!groups.length" class="none">Sin resultados para “{{ query }}”.</p>
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
.popover { position: absolute; right: 0; top: calc(100% + 12px); width: 380px; z-index: 70; background: var(--paper); border: var(--bw) solid var(--ink); box-shadow: var(--shadow); }
.search { width: 100%; min-height: 48px; padding: 0 14px; border: 0; border-bottom: var(--bw) solid var(--ink); background: #fff; font: 600 15px var(--font-body); }
.search:focus { outline: none; background: var(--volt); }
.scroll { max-height: min(56vh, 480px); overflow: auto; overscroll-behavior: contain; }
.gh { position: sticky; top: 0; z-index: 1; display: flex; justify-content: space-between; padding: 6px 14px; background: var(--ink); color: var(--volt); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; }
.opt { width: 100%; display: grid; grid-template-columns: 1fr auto; text-align: left; gap: 0 12px; padding: 10px 14px; border-bottom: 1px solid var(--paper-3); }
.opt:hover { background: var(--paper-2); }
.opt.on { background: var(--ink); color: var(--paper); }
.opt-name { font-family: var(--font-display); font-size: 1.3rem; text-transform: uppercase; line-height: 1.1; }
.opt-loc { grid-column: 1; font-family: var(--font-mono); font-size: 11px; opacity: 0.75; }
.opt-check { grid-row: 1 / span 2; grid-column: 2; align-self: center; color: var(--volt); }
.none { padding: 18px 14px; font-size: 14px; }
.maplink { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; border-top: var(--bw) solid var(--ink); background: var(--volt); font-family: var(--font-display); font-size: 1.15rem; text-transform: uppercase; letter-spacing: 0.04em; }
.maplink:hover { background: var(--ink); color: var(--volt); }
.maplink.m { border: var(--bw) solid var(--ink); margin: 12px 4px; box-shadow: var(--shadow-sm); }
.pop-enter-active, .pop-leave-active { transition: opacity 0.1s, transform 0.1s; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(-6px); }

.grp { margin-top: 12px; }
.sheet-list { display: grid; gap: 10px; padding: 10px 4px 4px; }
.s-opt { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px; text-align: left; padding: 12px 14px; min-height: 60px; background: var(--paper); border: var(--bw) solid var(--ink); box-shadow: var(--shadow-sm); }
.s-opt.on { background: var(--volt); }
.s-opt strong { display: block; font-family: var(--font-display); font-weight: 400; font-size: 1.5rem; text-transform: uppercase; line-height: 1; }
.s-opt small { display: block; font-size: 13px; }
</style>
