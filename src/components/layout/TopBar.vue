<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  navItems: { type: Array, default: () => [] },
  theme: { type: String, default: 'light' },
})

const emit = defineEmits(['toggle-theme'])

const isOpen = ref(false)

const scrollTo = (id) => {
  const target = document.getElementById(id)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const themeIcon = computed(() => (props.theme === 'dark' ? 'sunny' : 'nightlight'))
const themeLabel = computed(() => (props.theme === 'dark' ? 'Modo claro' : 'Modo oscuro'))

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50">
    <div class="glass-card px-4 md:px-5 py-3 shadow-android">
      <div class="flex items-center justify-between gap-3">
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

        <div class="flex items-center gap-2">
          <div class="hidden md:flex flex-wrap items-center gap-2">
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
          <div class="hidden md:flex items-center gap-2">
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
          <button
            type="button"
            class="pill-button md:hidden text-sm"
            :aria-expanded="isOpen"
            aria-controls="mobile-menu"
            @click="toggleMenu"
          >
            <span class="material-symbols-rounded text-base">menu</span>
            Menú
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        v-if="isOpen"
        class="mt-3 flex flex-col gap-2 md:hidden"
      >
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="pill-button text-sm justify-start"
          @click="() => { scrollTo(item.id); closeMenu() }"
        >
          <span class="material-symbols-rounded text-base">arrow_right</span>
          {{ item.label }}
        </button>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            class="pill-button text-sm justify-start"
            :aria-label="themeLabel"
            @click="() => { emit('toggle-theme'); closeMenu() }"
          >
            <span class="material-symbols-rounded text-base">{{ themeIcon }}</span>
            {{ themeLabel }}
          </button>
          <a
            class="pill-button bg-[var(--accent)] text-white border-none shadow-android text-sm justify-start"
            href="https://wa.me/543456479677"
            target="_blank"
            rel="noreferrer"
            @click="closeMenu"
          >
            <span class="material-symbols-rounded text-base">chat</span>
            Reservar
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
