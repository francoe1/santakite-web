import { onBeforeUnmount, watchEffect } from 'vue'

const clamp = (n, a, b) => Math.min(b, Math.max(a, n))

/**
 * Publica el viento real como variables CSS globales para que palmeras, hojas,
 * sombrillas y kites se muevan acorde (más viento = más balanceo y más rápido).
 *  --w-sway   amplitud del balanceo (deg)
 *  --w-period duración de cada vaivén
 *  --w-lean   inclinación hacia donde sopla (deg, + = hacia la derecha)
 *  --w-flap   amplitud del aleteo de telas
 */
export const useWindVars = (getCurrent) => {
  const stop = watchEffect(() => {
    if (typeof document === 'undefined') return
    const c = getCurrent()
    const kts = Number.isFinite(c?.speedKts) ? c.speedKts : 5
    const to = (((c?.dirDeg ?? 0) + 180) * Math.PI) / 180 // hacia dónde va el viento
    const east = Math.sin(to)
    const r = document.documentElement.style
    r.setProperty('--w-sway', `${clamp(2.5 + kts * 0.75, 2.5, 22).toFixed(1)}deg`)
    r.setProperty('--w-period', `${clamp(6.5 - kts * 0.16, 1.5, 6.5).toFixed(2)}s`)
    r.setProperty('--w-lean', `${clamp(east * kts * 0.55, -16, 16).toFixed(1)}deg`)
    r.setProperty('--w-flap', `${clamp(0.06 + kts * 0.012, 0.06, 0.34).toFixed(2)}`)
  })
  onBeforeUnmount(stop)
}
