<script setup>
import { computed } from 'vue'

const props = defineProps({
  navItems: { type: Array, default: () => [] },
  theme: { type: String, default: 'light' },
})

const emit = defineEmits(['toggle-theme'])

const scrollTo = (id) => {
  const target = document.getElementById(id)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const themeIcon = computed(() => (props.theme === 'dark' ? 'sunny' : 'nightlight'))
const themeLabel = computed(() => (props.theme === 'dark' ? 'Modo claro' : 'Modo oscuro'))
</script>

<template>
  <header class="sticky top-0 z-50">
    <div class="glass-card flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 md:px-5 py-3 shadow-android">
      <button
        type="button"
        class="flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:-translate-y-0.5"
        @click="scrollTo('hero')"
      >
        <span
          class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-400 text-white font-black shadow-android"
        >
          SK
        </span>
        <span class="flex flex-col text-left">
          <span class="text-lg font-extrabold tracking-tight">SantaKite</span>
          <span class="text-xs font-semibold text-muted">Playa 52 · Río Uruguay</span>
        </span>
      </button>

      <div class="flex flex-wrap items-center gap-2 md:justify-end w-full">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            class="pill-button text-sm"
            @click="scrollTo(item.id)"
          >
            {{ item.label }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="pill-button text-sm"
            :aria-label="themeLabel"
            @click="emit('toggle-theme')"
          >
            <span class="material-symbols-rounded text-base">{{ themeIcon }}</span>
            {{ themeLabel }}
          </button>
          <a
            class="pill-button bg-[var(--accent)] text-white border-none shadow-android text-sm"
            href="https://wa.me/543456479677"
            target="_blank"
            rel="noreferrer"
          >
            <span class="material-symbols-rounded text-base">chat</span>
            Reservar
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
