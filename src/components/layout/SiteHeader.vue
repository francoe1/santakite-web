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
  <header class="header" :class="{ scrolled }">
    <div class="container bar">
      <a href="#hoy" class="brand" aria-label="SantaKite, inicio" @click.prevent="scrollToId('hoy')">
        <svg class="logo" viewBox="0 0 40 40" aria-hidden="true">
          <path d="M4 22C8 8 24 2 36 10 30 12 22 20 20 34 16 28 10 24 4 22Z" fill="var(--sun-500)" />
          <path d="M20 34 12 38" stroke="var(--sea-300)" stroke-width="2" stroke-linecap="round" fill="none" />
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
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="right">
        <SpotSwitcher :spots="spots" :current-id="currentSpotId" @select="$emit('select-spot', $event)" />
        <a href="#contacto" class="btn btn--primary btn--sm cta" @click.prevent="scrollToId('contacto')">Escribinos</a>
      </div>
    </div>
  </header>

  <!-- Mobile: barra inferior tipo app -->
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
.header {
  position: sticky;
  top: 0;
  z-index: 60;
  background: rgba(4, 20, 29, 0.96);
  backdrop-filter: saturate(1.4) blur(14px);
  border-bottom: 1px solid transparent;
  color: var(--text-inv);
  transition: background 0.3s, border-color 0.3s;
}
.header.scrolled {
  background: rgba(4, 20, 29, 0.92);
  border-color: var(--ink-line);
}
.bar {
  height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.logo {
  width: 34px;
  height: 34px;
}
.wordmark {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}
.wordmark b {
  font-weight: 800;
  color: var(--sun-500);
}
.nav {
  display: none;
}
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cta {
  display: none;
}

@media (min-width: 1024px) {
  .nav {
    display: flex;
    gap: 4px;
    margin-inline: auto;
  }
  .nav-link {
    position: relative;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-inv-soft);
    border-radius: 999px;
    transition: color 0.2s, background 0.2s;
  }
  .nav-link:hover {
    color: #fff;
  }
  .nav-link.on {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
  .cta {
    display: inline-flex;
  }
}

/* ---- Tab bar (solo móvil) ---- */
.tabbar {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 60;
  height: calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  background: rgba(4, 20, 29, 0.94);
  backdrop-filter: blur(16px);
  border-top: 1px solid var(--ink-line);
}
.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-inv-soft);
  position: relative;
  min-width: 0;
}
.tab.on {
  color: #fff;
}
.tab.on::before {
  content: '';
  position: absolute;
  top: 0;
  width: 28px;
  height: 3px;
  border-radius: 0 0 4px 4px;
  background: var(--sun-500);
}
.tab.on svg {
  color: var(--sun-500);
}
@media (min-width: 1024px) {
  .tabbar {
    display: none;
  }
}
</style>
