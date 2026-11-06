<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from '../ui/Icon.vue'
import SpotSwitcher from './SpotSwitcher.vue'
import { scrollToId, useScrollSpy } from '@/composables/useScrollSpy'

const props = defineProps({
  navItems: { type: Array, default: () => [] },
  spots: { type: Array, default: () => [] },
  currentSpotId: { type: String, default: null },
})
defineEmits(['select-spot'])

const active = useScrollSpy(props.navItems.map((n) => n.id))
const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 24)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header">
    <div class="container bar">
      <a href="#hoy" class="brand" aria-label="SantaKite, inicio" @click.prevent="scrollToId('hoy')">
        <svg class="logo" viewBox="0 0 40 40" aria-hidden="true">
          <rect x="1" y="1" width="38" height="38" fill="var(--ink)" />
          <path d="M7 24C10 11 25 6 34 12 28 14 22 21 20 33 16 28 11 25 7 24Z" fill="var(--volt)" />
        </svg>
        <span class="wordmark">Santa<b>Kite</b></span>
      </a>

      <nav class="nav" aria-label="Secciones principales">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          class="nav-link"
          :class="{ on: active === item.id }"
          :aria-current="active === item.id ? 'true' : undefined"
          @click.prevent="scrollToId(item.id)"
        >{{ item.label }}</a>
      </nav>

      <div class="right">
        <SpotSwitcher :spots="spots" :current-id="currentSpotId" @select="$emit('select-spot', $event)" />
        <a href="#contacto" class="btn btn--dark btn--sm cta" @click.prevent="scrollToId('contacto')">Escribinos</a>
      </div>
    </div>
  </header>

  <nav class="tabbar" aria-label="Navegación">
    <a
      v-for="item in navItems.filter((n) => n.tab)"
      :key="item.id"
      :href="`#${item.id}`"
      class="tab"
      :class="{ on: active === item.id }"
      @click.prevent="scrollToId(item.id)"
    >
      <Icon :name="item.icon" :size="22" />
      <span>{{ item.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.header { position: sticky; top: 0; z-index: 60; background: var(--paper); border-bottom: var(--bw) solid var(--ink); }
.bar { height: var(--header-h); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.brand { display: inline-flex; align-items: center; gap: 10px; }
.logo { width: 34px; height: 34px; }
.wordmark { font-family: var(--font-display); font-size: 1.7rem; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1; }
.wordmark b { font-weight: 400; background: var(--volt); padding: 0 4px; margin-left: 1px; }
.nav { display: none; }
.right { display: flex; align-items: center; gap: 12px; }
.cta { display: none; }

@media (min-width: 1024px) {
  .nav { display: flex; gap: 2px; margin-inline: auto; }
  .nav-link {
    padding: 8px 14px; font-family: var(--font-mono); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
    border: var(--bw) solid transparent;
  }
  .nav-link:hover { border-color: var(--ink); }
  .nav-link.on { background: var(--ink); color: var(--volt); }
  .cta { display: inline-flex; }
}

.tabbar {
  position: fixed; inset: auto 0 0 0; z-index: 60;
  height: calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  display: grid; grid-template-columns: repeat(5, 1fr);
  background: var(--ink); border-top: var(--bw) solid var(--ink);
}
.tab {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  font-family: var(--font-mono); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em;
  color: var(--paper); min-width: 0; border-right: 1px solid var(--ink-3);
}
.tab:last-child { border-right: 0; }
.tab.on { background: var(--volt); color: var(--ink); }
@media (min-width: 1024px) { .tabbar { display: none; } }
</style>
