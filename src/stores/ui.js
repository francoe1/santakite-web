import { defineStore } from 'pinia'

const STORAGE_KEY = 'santakite-theme'

const applyThemeClass = (theme) => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    theme: 'light',
  }),
  actions: {
    initTheme() {
      const stored = localStorage.getItem(STORAGE_KEY)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const mode = stored || (prefersDark ? 'dark' : 'light')
      this.theme = mode
      applyThemeClass(mode)
    },
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem(STORAGE_KEY, this.theme)
      applyThemeClass(this.theme)
    },
  },
})
