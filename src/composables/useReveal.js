import { onBeforeUnmount, onMounted } from 'vue'

/** Anima elementos .reveal al entrar en viewport. */
export const useReveal = () => {
  let io
  onMounted(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'))
      return
    }
    io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => io.observe(el))
  })
  onBeforeUnmount(() => io?.disconnect())
}
