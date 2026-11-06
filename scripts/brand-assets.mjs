// Genera los íconos y la imagen Open Graph en /public.
// Requiere Playwright (npx playwright install chromium). Uso: node scripts/brand-assets.mjs
import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { kiteMarkup } from '../src/utils/kiteShape.js'

const root = resolve(import.meta.dirname, '..')
const font = (pkg, file) => `data:font/woff2;base64,${readFileSync(resolve(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64')}`
const css = `
@font-face{font-family:Anton;src:url(${font('anton', 'anton-latin-400-normal.woff2')})}
@font-face{font-family:'Space Mono';font-weight:700;src:url(${font('space-mono', 'space-mono-latin-700-normal.woff2')})}
@font-face{font-family:'Permanent Marker';src:url(${font('permanent-marker', 'permanent-marker-latin-400-normal.woff2')})}
*{box-sizing:border-box;margin:0}`

// Isotipo: kite LEI de 2 struts sobre fondo negro (misma geometría que el sitio)
const markG = (scale) => `<g transform="translate(20 22.5) rotate(-10) scale(${scale}) translate(-150 -54)">${kiteMarkup({ struts: [0.34, 0.66], panelColors: ['#c9ff2f', '#c9ff2f', '#c9ff2f'], bridle: false, tubeW: 22 })}</g>`
const mark = (size, scale) => `<svg width="${size}" height="${size}" viewBox="0 0 40 40"><rect width="40" height="40" fill="#0b0b0b"/>${markG(scale)}</svg>`
const icon = (size, scale) => `<html><style>${css}</style><body style="width:${size}px;height:${size}px;background:#0b0b0b">${mark(size, scale)}</body></html>`

const og = `<html><style>${css}
body{width:1200px;height:630px;background:#ece7da;position:relative;overflow:hidden;font-family:'Space Mono'}
.top{height:56px;background:#c9ff2f;border-bottom:4px solid #0b0b0b;display:flex;align-items:center;padding:0 40px;font-weight:700;font-size:22px;text-transform:uppercase;white-space:nowrap}
.q{position:absolute;left:60px;top:120px;font:400 225px/0.9 Anton;text-transform:uppercase}
.ans{position:absolute;left:60px;top:370px;padding:8px 40px 0;background:#c9ff2f;border:6px solid #0b0b0b;box-shadow:12px 12px 0 #0b0b0b;font:400 150px/1 Anton;transform:rotate(-2.5deg)}
.brand{position:absolute;right:50px;bottom:40px;font:400 66px Anton;text-transform:uppercase}
.brand b{background:#c9ff2f;font-weight:400;padding:0 8px}
.note{position:absolute;left:330px;top:410px;padding:14px 22px;background:#ffd60a;border:5px solid #0b0b0b;box-shadow:8px 8px 0 #0b0b0b;font:400 38px 'Permanent Marker';transform:rotate(-1.5deg);max-width:400px;font-size:34px}
.kite{position:absolute;right:40px;top:80px;transform:rotate(8deg)}
</style><body>
<div class="top">/ Kitesurf entre ríos / Viento en vivo / Pronóstico 7 días / Finde siempre a la vista</div>
<div class="q">¿Sopla?</div><div class="ans">SÍ</div>
<div class="note">Dejá todo. Hoy se navega.</div>
<svg class="kite" width="330" height="275" viewBox="0 0 300 250" fill="none"><path d="M21 103 130 232M277.8 103 170 232M149.5 121 143 232M149.5 121 157 232" stroke="#0b0b0b" stroke-width="2"/><g transform="translate(10 6) scale(.93)">${kiteMarkup()}</g><path d="M128 232h44" stroke="#0b0b0b" stroke-width="6" stroke-linecap="round"/></svg>
<div class="brand">Santa<b>Kite</b></div></body></html>`

const b = await chromium.launch()
const shot = async (html, w, h, file) => {
  const p = await b.newPage({ viewport: { width: w, height: h } })
  await p.setContent(html)
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(300)
  await p.screenshot({ path: resolve(root, 'public', file) })
  await p.close()
}
mkdirSync(resolve(root, 'public'), { recursive: true })
await shot(icon(192, 0.1), 192, 192, 'icon-192.png')
await shot(icon(512, 0.1), 512, 512, 'icon-512.png')
await shot(icon(512, 0.082), 512, 512, 'icon-maskable-512.png')
await shot(icon(180, 0.1), 180, 180, 'apple-touch-icon.png')
writeFileSync(resolve(root, 'public/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#0b0b0b"/>${markG(0.1)}</svg>\n`)
await shot(og, 1200, 630, 'og.png')
await b.close()
console.log('listo')
