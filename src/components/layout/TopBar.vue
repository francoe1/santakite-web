<template>
  <header class="topbar" :class="{ 'is-scrolled': isScrolled, 'is-open': isMenuOpen }">
    <div class="topbar-inner">
      <div class="brand-mark" @click="scrollTo('hero')">
        <div class="brand-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z"
              stroke-width="1.5"
            />
            <path
              d="M8.5 16C10.5 14.5 13.5 14.5 15.5 16"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path d="M9 11.5V11.5" stroke-width="2" stroke-linecap="round" />
            <path d="M15 11.5V11.5" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-title">SantaKite</span>
          <span class="brand-sub">Playa 52</span>
        </div>
      </div>

      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M4 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>

      <nav class="topbar-nav" :class="{ 'is-open': isMenuOpen }" aria-label="Secciones principales">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="nav-button"
          @click="handleNavClick(item.id)"
        >
          {{ item.label }}
        </button>
        <a class="cta" href="https://wa.me/543456479677" target="_blank" rel="noreferrer">
          Reservar
        </a>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  navItems: {
    type: Array,
    default: () => [],
  },
})

const isScrolled = ref(false)
const isMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const scrollTo = (id) => {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleNavClick = (id) => {
  scrollTo(id)
  if (isMenuOpen.value) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.2s ease-in-out;
}

.topbar.is-scrolled {
  backdrop-filter: blur(14px);
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid var(--slate-200);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.topbar-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0.8rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.brand-logo {
  width: 36px;
  height: 36px;
}
.brand-logo svg {
  stroke: var(--sky-600);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.brand-title {
  color: var(--slate-800);
  font-size: 1.1rem;
}
.brand-sub {
  color: var(--slate-500);
  font-size: 0.85rem;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 1010;
  color: var(--slate-700);
}
@media (max-width: 800px) {
  .menu-toggle {
    display: block;
  }
}

.topbar-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--slate-600);
}

@media (max-width: 800px) {
  .topbar-nav {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(75vw, 300px);
    background: white;
    flex-direction: column;
    padding: 6rem 2rem 2rem;
    align-items: stretch;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  }
  .topbar-nav.is-open {
    transform: translateX(0);
  }
}

.nav-button {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  transition: all 0.15s ease-in-out;
}
.nav-button:hover {
  background-color: var(--sky-100);
  color: var(--sky-700);
  transform: translateY(-1px);
}
@media (max-width: 800px) {
  .nav-button {
    text-align: left;
    font-size: 1.1rem;
  }
}

.cta {
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  background-color: var(--sky-500);
  color: white;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
}
.cta:hover {
  background-color: var(--sky-600);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);
}
@media (max-width: 800px) {
  .cta {
    text-align: center;
    margin-top: 1rem;
    font-size: 1.1rem;
  }
}
</style>
