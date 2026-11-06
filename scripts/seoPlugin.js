import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import spots from '../src/data/spots.json'
import { BRAND, buildFaq, buildHeadHtml, homeMeta, mapMeta, spotMeta, spotPath } from '../src/seo/content.js'

const START = '<!--seo:start-->'
const END = '<!--seo:end-->'
const PRE_START = '<!--prerender:start-->'
const PRE_END = '<!--prerender:end-->'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const resolveSiteUrl = () => {
  const raw =
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    'https://santakite.vercel.app'
  return raw.replace(/\/+$/, '')
}

/** HTML de contenido real para quien no ejecuta JavaScript (se reemplaza al montar Vue). */
const prerenderHtml = ({ siteUrl, spot, page = null }) => {
  const m = spot ? spotMeta(spot) : page === 'map' ? mapMeta(spots) : homeMeta(spots)
  const nav = spots.map((s) => `<li><a href="${siteUrl}${spotPath(s)}">Kitesurf en ${esc(s.name)} (${esc(s.region)}, ${esc(s.countryName)})</a></li>`).join('')
  const body = spot
    ? `
      <h1>¿Sopla en ${esc(spot.name)}? Viento en vivo y pronóstico de kitesurf</h1>
      <p>${esc(m.description)}</p>
      <h2>El spot</h2>
      <ul>${(spot.highlights || []).map((h) => `<li><strong>${esc(h.title)}</strong>. ${esc(h.description)}</li>`).join('')}</ul>
      <p>Coordenadas: ${esc(spot.references?.coordinatesLabel ?? '')}. ${esc(spot.references?.description ?? '')}</p>
      <h2>Pronóstico y criterio de viento</h2>
      <p>${esc(spot.forecast?.criteriaText ?? '')}</p>
      <p>${esc(spot.forecast?.detailText ?? '')}</p>
      <h2>Seguridad</h2>
      <p>${esc(spot.security?.intro ?? '')}</p>
      ${(spot.security?.steps || []).map((s) => `<h3>${esc(s.title)}</h3><ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`).join('')}
      <h2>Preguntas frecuentes</h2>
      ${buildFaq(spot).map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}
      <h2>Contacto</h2>
      <ul>${(spot.contacts || []).map((c) => `<li>${esc(c.label)}: ${c.href ? `<a href="${esc(c.href)}">${esc(c.value)}</a>` : esc(c.value)}</li>`).join('')}</ul>`
    : page === 'map'
      ? `
      <h1>Mapa de spots de kitesurf en Argentina, Brasil y Uruguay</h1>
      <p>${esc(m.description)}</p>`
      : `
      <h1>SantaKite: ¿sopla hoy? Kitesurf en Argentina, Brasil y Uruguay</h1>
      <p>${esc(m.description)}</p>`
  return `${PRE_START}<div class="prerender" data-prerender><header><a href="${siteUrl}/">${BRAND.name}</a></header><main>${body}<h2>Spots de kitesurf</h2><ul>${nav}</ul></main><noscript><p>Activá JavaScript para ver el viento en vivo y el pronóstico en tiempo real.</p></noscript></div>${PRE_END}`
}

const swap = (html, start, end, content) => {
  const i = html.indexOf(start)
  const j = html.indexOf(end)
  if (i < 0 || j < 0) return html
  return html.slice(0, i + start.length) + content + html.slice(j)
}

export default function seoPlugin() {
  const siteUrl = resolveSiteUrl()
  let outDir = 'dist'
  let root = process.cwd()

  return {
    name: 'santakite-seo',
    config: () => ({ define: { __SITE_URL__: JSON.stringify(siteUrl) } }),
    configResolved(cfg) {
      outDir = cfg.build.outDir
      root = cfg.root
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        swap(swap(html, START, END, `\n    ${buildHeadHtml({ siteUrl, spots })}\n    `), PRE_START, PRE_END, prerenderHtml({ siteUrl, spot: null }).replace(PRE_START, '').replace(PRE_END, '')),
    },
    closeBundle() {
      if (process.env.VITEST) return
      const dist = resolve(root, outDir)
      let built
      try {
        built = readFileSync(resolve(dist, 'index.html'), 'utf8')
      } catch {
        return
      }
      // Una página HTML estática por spot, con su <head> y contenido propios.
      spots.forEach((spot) => {
        let html = swap(built, START, END, `\n    ${buildHeadHtml({ siteUrl, spots, spot })}\n    `)
        html = swap(html, PRE_START, PRE_END, prerenderHtml({ siteUrl, spot }).replace(PRE_START, '').replace(PRE_END, ''))
        const dir = resolve(dist, 'spot', spot.id)
        mkdirSync(dir, { recursive: true })
        writeFileSync(resolve(dir, 'index.html'), html)
      })

      // Mapa de spots
      {
        let html = swap(built, START, END, `\n    ${buildHeadHtml({ siteUrl, spots, page: 'map' })}\n    `)
        html = swap(html, PRE_START, PRE_END, prerenderHtml({ siteUrl, spot: null, page: 'map' }).replace(PRE_START, '').replace(PRE_END, ''))
        mkdirSync(resolve(dist, 'mapa'), { recursive: true })
        writeFileSync(resolve(dist, 'mapa', 'index.html'), html)
      }

      // 404 con noindex para rutas desconocidas
      const notFound = swap(built, START, END, `\n    <title>Página no encontrada | ${BRAND.name}</title>\n    <meta name="robots" content="noindex" />\n    `)
      writeFileSync(resolve(dist, '404.html'), notFound)

      const today = new Date().toISOString().slice(0, 10)
      const urls = [{ loc: `${siteUrl}/`, priority: '1.0' }, { loc: `${siteUrl}/mapa`, priority: '0.9' }, ...spots.map((s) => ({ loc: `${siteUrl}${spotPath(s)}`, priority: '0.9' }))]
      writeFileSync(
        resolve(dist, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>hourly</changefreq><priority>${u.priority}</priority></url>`)
          .join('\n')}\n</urlset>\n`
      )
      writeFileSync(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
    },
  }
}
