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
  background:
    linear-gradient(135deg, rgba(5, 32, 48, 0.94), rgba(3, 21, 38, 0.9)),
    radial-gradient(circle at 10% 50%, rgba(34, 211, 238, 0.16), transparent 40%),
    radial-gradient(circle at 90% 50%, rgba(14, 165, 233, 0.18), transparent 42%);
  border-bottom: 1px solid rgba(56, 189, 248, 0.25);
  box-shadow: 0 10px 34px rgba(4, 24, 44, 0.55);
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
  transition: transform 0.2s ease;
}

.brand-logo {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 0, #38bdf8, #0ea5e9 40%, #0f172a 85%);
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.35);
  position: relative;
  overflow: hidden;
  animation: float 4s ease-in-out infinite;
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

.brand-mark:hover {
  transform: translateY(-1px);
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
  transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
  letter-spacing: 0.01em;
}

.nav-button:hover {
  background: rgba(14, 165, 233, 0.14);
  color: #5eead4;
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(14, 165, 233, 0.18);
}

.cta {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: linear-gradient(120deg, #22d3ee, #0ea5e9, #2563eb);
  color: #03131f;
  font-weight: 700;
  letter-spacing: 0.01em;
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.45);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 44px rgba(14, 165, 233, 0.6);
  filter: saturate(1.1);
}

@media (max-width: 720px) {
  .topbar-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-nav {
    width: 100%;
    justify-content: space-between;
    gap: 0.6rem;
  }

  .nav-button,
  .cta {
    flex: 1;
    text-align: center;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
</style>
