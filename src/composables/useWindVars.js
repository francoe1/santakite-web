import { onBeforeUnmount, onMounted, watchEffect } from 'vue'

const clamp = (n, a, b) => Math.min(b, Math.max(a, n))

/**
 * Publica el viento real como variables CSS globales para que palmeras, hojas, sombrilla,
 * kites y rayas de viento se muevan acorde (más viento = más balanceo y más rápido).
 * El scroll "empuja" el viento SOLO en las capas marcadas con [data-wind-scroll] (palmeras y hojas):
 * los personajes y el resto de la página usan siempre los valores base, así no se corren al scrollear.
 *  --w-sway   amplitud del balanceo (deg)        --w-period  duración de cada vaivén
 *  --w-lean   inclinación hacia donde sopla (deg) --w-flap    aleteo de telas
 *  --w-dir    1 / -1 sentido del viento           --w-streak  intensidad de las rayas
 */
export const useWindVars = (getCurrent) => {
  let base = { sway: 5, lean: 0 }
  let boost = 0 // 0..1, sube al hacer scroll y decae solo
  let dir = 1
  let raf = 0
  let lastY = 0
  let lastT = 0

  let targets = []
  const root = () => document.documentElement.style
  const refreshTargets = () => (targets = [...document.querySelectorAll('[data-wind-scroll]')])
  const apply = () => {
    // base para todos (no cambia al scrollear)
    root().setProperty('--w-sway', `${base.sway.toFixed(1)}deg`)
    root().setProperty('--w-lean', `${base.lean.toFixed(1)}deg`)
    // con el empujón del scroll, solo en las capas decorativas
    if (!targets.length || !targets[0].isConnected) refreshTargets()
    const sway = `${(base.sway * (1 + boost * 1.4)).toFixed(1)}deg`
    const lean = `${(base.lean + dir * boost * 4).toFixed(1)}deg`
    targets.forEach((el) => {
      el.style.setProperty('--w-sway', sway)
      el.style.setProperty('--w-lean', lean)
    })
  }

  const stop = watchEffect(() => {
    if (typeof document === 'undefined') return
    const c = getCurrent()
    const kts = Number.isFinite(c?.speedKts) ? c.speedKts : 5
    const to = (((c?.dirDeg ?? 0) + 180) * Math.PI) / 180 // hacia dónde va el viento
    const east = Math.sin(to)
    base = { sway: clamp(2.5 + kts * 0.75, 2.5, 22), lean: clamp(east * kts * 0.55, -16, 16) }
    const r = root()
    r.setProperty('--w-period', `${clamp(6.5 - kts * 0.16, 1.5, 6.5).toFixed(2)}s`)
    r.setProperty('--w-flap', `${clamp(0.06 + kts * 0.012, 0.06, 0.34).toFixed(2)}`)
    r.setProperty('--w-dir', east >= 0 ? '1' : '-1')
    r.setProperty('--w-streak', `${clamp(0.08 + kts * 0.02, 0.08, 0.55).toFixed(2)}`)
    apply()
  })

  const tick = () => {
    boost *= 0.92
    if (boost < 0.01) boost = 0
    apply()
    raf = boost > 0 ? requestAnimationFrame(tick) : 0
  }
  const onScroll = () => {
    const now = performance.now()
    const dy = window.scrollY - lastY
    const dt = Math.max(1, now - lastT)
    lastY = window.scrollY
    lastT = now
    const v = Math.abs(dy) / dt // px/ms
    boost = clamp(Math.max(boost, v / 3), 0, 1)
    dir = dy >= 0 ? 1 : -1
    if (!raf) raf = requestAnimationFrame(tick)
  }
  onMounted(() => {
    lastY = window.scrollY
    lastT = performance.now()
    window.addEventListener('scroll', onScroll, { passive: true })
  })
  onBeforeUnmount(() => {
    stop()
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(raf)
  })
}
