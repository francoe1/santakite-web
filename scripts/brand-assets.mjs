// Genera los íconos y la imagen Open Graph en /public.
// Requiere Playwright (npx playwright install chromium). Uso: node scripts/brand-assets.mjs
import { chromium } from 'playwright'
import { mkdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const font = (pkg, file) => `data:font/woff2;base64,${readFileSync(resolve(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64')}`
const css = `
@font-face{font-family:Anton;src:url(${font('anton', 'anton-latin-400-normal.woff2')})}
@font-face{font-family:'Space Mono';font-weight:700;src:url(${font('space-mono', 'space-mono-latin-700-normal.woff2')})}
@font-face{font-family:'Permanent Marker';src:url(${font('permanent-marker', 'permanent-marker-latin-400-normal.woff2')})}
*{box-sizing:border-box;margin:0}`

const kite = (s, fill = '#c9ff2f') => `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><path d="M10 38C15 18 40 9 56 19 46 23 36 34 32 54 25 46 18 41 10 38Z" fill="${fill}"/></svg>`
const icon = (size, pad) => `<html><style>${css}</style><body style="width:${size}px;height:${size}px;background:#0b0b0b;display:grid;place-items:center">${kite(size * (1 - pad * 2))}</body></html>`

const og = `<html><style>${css}
body{width:1200px;height:630px;background:#ece7da;position:relative;overflow:hidden;font-family:'Space Mono'}
.top{height:56px;background:#c9ff2f;border-bottom:4px solid #0b0b0b;display:flex;align-items:center;padding:0 40px;font-weight:700;font-size:22px;text-transform:uppercase;white-space:nowrap}
.q{position:absolute;left:60px;top:120px;font:400 225px/0.9 Anton;text-transform:uppercase}
.ans{position:absolute;left:60px;top:370px;padding:8px 40px 0;background:#c9ff2f;border:6px solid #0b0b0b;box-shadow:12px 12px 0 #0b0b0b;font:400 150px/1 Anton;transform:rotate(-2.5deg)}
.brand{position:absolute;right:50px;bottom:40px;font:400 66px Anton;text-transform:uppercase}
.brand b{background:#c9ff2f;font-weight:400;padding:0 8px}
.note{position:absolute;left:330px;top:410px;padding:14px 22px;background:#ffd60a;border:5px solid #0b0b0b;box-shadow:8px 8px 0 #0b0b0b;font:400 38px 'Permanent Marker';transform:rotate(-1.5deg);max-width:400px;font-size:34px}
.kite{position:absolute;right:30px;top:90px;transform:rotate(12deg) scale(.85)}
</style><body>
<div class="top">/ Kitesurf entre ríos / Viento en vivo / Pronóstico 7 días / Finde siempre a la vista</div>
<div class="q">¿Sopla?</div><div class="ans">SÍ</div>
<div class="note">Dejá todo. Hoy se navega.</div>
<svg class="kite" width="300" height="240" viewBox="0 0 300 240" fill="none"><path d="M14 140C30 40 190 -20 288 60 214 62 168 100 150 190 104 160 58 144 14 140Z" fill="#0b0b0b"/><path d="M60 138C80 70 150 30 214 36 170 56 138 96 128 160 106 150 84 142 60 138Z" fill="#c9ff2f"/></svg>
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
await shot(icon(192, 0.12), 192, 192, 'icon-192.png')
await shot(icon(512, 0.12), 512, 512, 'icon-512.png')
await shot(icon(512, 0.22), 512, 512, 'icon-maskable-512.png')
await shot(icon(180, 0.14), 180, 180, 'apple-touch-icon.png')
await shot(og, 1200, 630, 'og.png')
await b.close()
console.log('listo')
