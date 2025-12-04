<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand-mark" @click="scrollTo('hero')">
        <div class="brand-text">
          <span class="brand-title">SantaKite</span>
          <span class="brand-sub">Río &amp; viento libre</span>
        </div>
      </div>
      <div class="topbar-controls">
        <label class="spot-switch" for="spot-select">Spot</label>
        <select id="spot-select" class="spot-select" :value="currentSpotId" @change="onSelectChange">
          <option v-for="spot in spots" :key="spot.id" :value="spot.id">
            {{ spot.name }}
          </option>
        </select>

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
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  navItems: {
    type: Array,
    default: () => [],
  },
  spots: {
    type: Array,
    default: () => [],
  },
  currentSpotId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['select-spot'])

const scrollTo = (id) => {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const onSelectChange = (event) => {
  emit('select-spot', event.target.value)
}
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1px solid #e0e7ea;
}

.topbar-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0.7rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-title {
  color: #0b2f3f;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
}

.brand-sub {
  color: #0f5672;
  font-size: 0.82rem;
  font-weight: 600;
}



.topbar-controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.spot-switch {
  font-weight: 700;
  color: #0b2f3f;
  font-size: 0.85rem;
}

.spot-select {
  background: #f4f7f9;
  border: 1px solid #d7e0e4;
  color: #0b2f3f;
  padding: 0.45rem 0.8rem;
  font-weight: 600;
  cursor: pointer;
  min-width: 190px;
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
  background: #f4f7f9;
  border: 1px solid #d7e0e4;
  color: inherit;
  cursor: pointer;
  padding: 0.45rem 0.95rem;

  transition: background 0.2s, color 0.2s;
  letter-spacing: 0.01em;
}

.nav-button:hover {
  background: #e6eff4;
  color: #0f2f3f;
}

.cta {
  padding: 0.65rem 1.25rem;

  background: #0f4c5c;
  color: #f6fbfd;
  font-weight: 800;
  letter-spacing: 0.02em;
  border: 1px solid #0f4c5c;
  transition: background 0.2s ease, color 0.2s ease;
}

.cta:hover {
  background: #093544;
  color: #e9f4f8;
}

@media (max-width: 720px) {
  .topbar-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .topbar-controls {
    width: 100%;
  }

  .spot-select {
    width: 100%;
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
</style>
