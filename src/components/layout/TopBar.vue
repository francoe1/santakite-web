<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand-mark" @click="scrollTo('hero')">
        <div class="brand-logo" aria-hidden="true"></div>
        <div class="brand-text">
          <span class="brand-title">SantaKite</span>
          <span class="brand-sub">Playa 52</span>
        </div>
      </div>
      <nav class="topbar-nav" aria-label="Secciones principales">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="nav-button"
          @click="scrollTo(item.id)"
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
const props = defineProps({
  navItems: {
    type: Array,
    default: () => [],
  },
})

const scrollTo = (id) => {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(14px);
  background: linear-gradient(to right, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.92));
  border-bottom: 1px solid rgba(31, 41, 55, 0.8);
}

.topbar-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0.7rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}

.brand-logo {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 0, #38bdf8, #0ea5e9 40%, #0f172a 85%);
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.35);
  position: relative;
  overflow: hidden;
}

.brand-logo::after {
  content: '';
  position: absolute;
  inset: 25% 35%;
  border-radius: 999px 999px 20px 20px;
  background: rgba(15, 23, 42, 0.9);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-title {
  color: #e2e8f0;
}

.brand-sub {
  color: #94a3b8;
  font-size: 0.8rem;
}

.topbar-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  font-size: 0.84rem;
  color: #9ca3af;
  align-items: center;
}

.nav-button {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  transition: background 0.15s, color 0.15s, transform 0.15s;
}

.nav-button:hover {
  background: rgba(15, 23, 42, 0.9);
  color: #00c2ff;
  transform: translateY(-1px);
}

.cta {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: linear-gradient(120deg, #22d3ee, #0ea5e9, #2563eb);
  color: #0b1727;
  font-weight: 700;
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 44px rgba(14, 165, 233, 0.5);
}

@media (max-width: 720px) {
  .topbar-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-nav {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
