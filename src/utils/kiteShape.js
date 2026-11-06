// Geometría de un kite de kitesurf tipo LEI (Leading Edge Inflatable), visto desde abajo/atrás:
// tubo inflable en el borde de ataque (arco), puntas hacia abajo, struts (tubos transversales),
// paneles de tela hasta el borde de fuga y bridas que bajan hacia la barra.
// Sistema de coordenadas: 300 x 130. Solo funciones puras (sirve en Vue, canvas y scripts de build).

export const KITE_W = 300
export const KITE_H = 130

export const INK = '#0b0b0b'
export const VOLT = '#c9ff2f'
export const YELLOW = '#ffd60a'
export const RED = '#ff3d1f'

// Borde de ataque (tubo grueso) y borde de fuga (más plano), en dos tramos cúbicos simétricos.
const LEAD = [
  [[12, 104], [30, 30], [95, 4], [150, 4]],
  [[150, 4], [205, 4], [270, 30], [288, 104]],
]
const TRAIL = [
  [[12, 104], [58, 84], [104, 74], [150, 74]],
  [[150, 74], [196, 74], [242, 84], [288, 104]],
]

const cubic = (p, t) => {
  const u = 1 - t
  return [
    u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
    u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
  ]
}
const at = (curve, t) => {
  const seg = t < 0.5 ? 0 : 1
  return cubic(curve[seg], Math.min(1, Math.max(0, (t - seg * 0.5) * 2)))
}
const n1 = (n) => +n.toFixed(1)
const pathOf = (c) => `M${c[0][0].join(' ')}C${c[0][1].join(' ')} ${c[0][2].join(' ')} ${c[0][3].join(' ')}C${c[1][1].join(' ')} ${c[1][2].join(' ')} ${c[1][3].join(' ')}`
const sample = (curve, a, b, n = 10) => Array.from({ length: n + 1 }, (_, i) => at(curve, a + ((b - a) * i) / n))
const poly = (pts) => pts.map(([x, y]) => `${n1(x)} ${n1(y)}`).join('L')

export const DEFAULT_STRUTS = [0.15, 0.3, 0.5, 0.7, 0.85]
export const defaultPanelColors = (n) =>
  n === 6 ? [INK, VOLT, RED, RED, VOLT, INK] : Array.from({ length: n }, (_, i) => (i % 2 ? INK : VOLT))

export const kiteGeometry = ({ struts = DEFAULT_STRUTS } = {}) => {
  const ts = [0, ...struts, 1]
  const panels = ts.slice(0, -1).map((a, i) => {
    const b = ts[i + 1]
    return `M${poly(sample(LEAD, a, b))}L${poly(sample(TRAIL, b, a))}Z`
  })
  return {
    lead: pathOf(LEAD),
    trail: pathOf(TRAIL),
    panels,
    struts: struts.map((t) => {
      const [x1, y1] = at(LEAD, t)
      const [x2, y2] = at(TRAIL, t)
      return { x1: n1(x1), y1: n1(y1), x2: n1(x2), y2: n1(y2) }
    }),
    attach: [0.3, 0.5, 0.7].map((t) => at(LEAD, t).map(n1)),
    // puntos de anclaje para dibujar las líneas hasta la barra
    anchors: { leftTip: [12, 104], rightTip: [288, 104], bridle: [150, 124] },
  }
}

/** Kite como string SVG (<g>), para scripts de build y favicon. */
export const kiteMarkup = ({ struts = DEFAULT_STRUTS, panelColors, tube = YELLOW, bridle = true, tubeW = 18 } = {}) => {
  const g = kiteGeometry({ struts })
  const colors = panelColors ?? defaultPanelColors(g.panels.length)
  const parts = [
    ...g.panels.map((d, i) => `<path d="${d}" fill="${colors[i]}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`),
    bridle ? `<path d="${g.attach.map(([x, y]) => `M${x} ${y}L150 124`).join('')}" fill="none" stroke="${INK}" stroke-width="2"/>` : '',
    ...g.struts.map((s) => `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="${INK}" stroke-width="${tubeW * 0.72}" stroke-linecap="round"/><line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="${tube}" stroke-width="${tubeW * 0.36}" stroke-linecap="round"/>`),
    `<path d="${g.lead}" fill="none" stroke="${INK}" stroke-width="${tubeW}" stroke-linecap="round"/>`,
    `<path d="${g.lead}" fill="none" stroke="${tube}" stroke-width="${tubeW * 0.55}" stroke-linecap="round"/>`,
  ]
  return `<g>${parts.join('')}</g>`
}
