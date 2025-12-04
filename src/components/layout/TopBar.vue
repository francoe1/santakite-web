<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand-mark" @click="scrollTo('hero')">
        <div class="brand-logo" aria-hidden="true"></div>
        <div class="brand-text">
          <span class="brand-title">SantaKite</span>
          <span class="brand-sub">Río &amp; viento libre</span>
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
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(11, 65, 92, 0.12);
  box-shadow: 0 12px 28px rgba(12, 44, 60, 0.08);
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
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background:
    linear-gradient(140deg, rgba(10, 173, 191, 0.95), rgba(8, 115, 183, 0.95)),
    url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80') center/cover;
  box-shadow: 0 8px 20px rgba(11, 76, 113, 0.25);
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.brand-logo::after {
  content: '';
  position: absolute;
  inset: 8% 10%;
  border-radius: 12px;
  background: linear-gradient(125deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
  opacity: 0.75;
  transform: translateY(-6px);
  animation: glide 5s ease-in-out infinite;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-title {
  color: #0b2f3f;
  font-family: 'Pacifico', cursive;
  font-size: 1.2rem;
  letter-spacing: 0.01em;
}

.brand-sub {
  color: #0f5672;
  font-size: 0.82rem;
  font-weight: 600;
}


.brand-mark:hover {
  transform: translateY(-2px);
}

.topbar-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #0f4c5c;
  align-items: center;
}

.nav-button {
  background: rgba(15, 77, 92, 0.06);
  border: 1px solid rgba(15, 77, 92, 0.14);
  color: inherit;
  cursor: pointer;
  padding: 0.45rem 0.95rem;
  border-radius: 14px;
  transition: background 0.2s, color 0.2s, transform 0.2s, box-shadow 0.2s;
  letter-spacing: 0.01em;
  box-shadow: 0 10px 20px rgba(15, 76, 92, 0.12);
}

.nav-button:hover {
  background: linear-gradient(120deg, rgba(14, 165, 233, 0.12), rgba(45, 212, 191, 0.12));
  color: #0f2f3f;
  transform: translateY(-2px);
  box-shadow: 0 14px 24px rgba(15, 76, 92, 0.2);
}

.cta {
  padding: 0.65rem 1.25rem;
  border-radius: 16px;
  background: linear-gradient(120deg, #ffb703, #fb8500, #f15bb5);
  color: #0b1f2a;
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: 0 16px 36px rgba(241, 91, 181, 0.26);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 44px rgba(251, 133, 0, 0.35);
  filter: saturate(1.05);
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

@keyframes glide {
  0%,
  100% {
    transform: translateY(-6px) translateX(0);
  }
  50% {
    transform: translateY(-2px) translateX(6px);
  }
}
</style>
