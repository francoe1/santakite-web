import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useMediaQuery = (query) => {
  const matches = ref(typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  let mql
  const update = (e) => (matches.value = e.matches)
  onMounted(() => {
    mql = window.matchMedia(query)
    matches.value = mql.matches
    mql.addEventListener('change', update)
  })
  onBeforeUnmount(() => mql?.removeEventListener('change', update))
  return matches
}

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
