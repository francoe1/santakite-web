import { onBeforeUnmount, watchEffect } from 'vue'
import { BRAND, buildJsonLd, homeMeta, spotMeta } from '@/seo/content'
import spots from '@/data/spots.json'

const SITE_URL = (typeof __SITE_URL__ !== 'undefined' && __SITE_URL__) || (typeof window !== 'undefined' ? window.location.origin : '')

const upsert = (selector, make) => {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = make()
    document.head.appendChild(el)
  }
  return el
}
const meta = (attr, key, content) => {
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, key)
    return m
  })
  el.setAttribute('content', content)
}
const link = (rel, href, extra = {}) => {
  const sel = `link[rel="${rel}"]${extra.hreflang ? `[hreflang="${extra.hreflang}"]` : ''}`
  const el = upsert(sel, () => {
    const l = document.createElement('link')
    l.rel = rel
    Object.entries(extra).forEach(([k, v]) => l.setAttribute(k, v))
    return l
  })
  el.href = href
}

/** Mantiene <head> (título, descripción, canonical, OG, JSON-LD) alineado con el spot visible. */
export const useSeo = (getSpot, { noindex = false, title: forcedTitle } = {}) => {
  const stop = watchEffect(() => {
    if (typeof document === 'undefined') return
    const spot = typeof getSpot === 'function' ? getSpot() : null
    const m = forcedTitle ? { title: forcedTitle, description: BRAND.name, keywords: '', path: window.location.pathname } : spot ? spotMeta(spot) : homeMeta(spots)
    const url = `${SITE_URL}${m.path === '/' ? '' : m.path}` || SITE_URL

    document.title = m.title
    meta('name', 'description', m.description)
    meta('name', 'keywords', m.keywords)
    meta('name', 'robots', noindex ? 'noindex' : 'index, follow, max-image-preview:large, max-snippet:-1')
    if (noindex) document.head.querySelector('link[rel="canonical"]')?.remove()
    else link('canonical', url)
    link('alternate', url, { hreflang: 'es-AR' })
    link('alternate', url, { hreflang: 'x-default' })
    meta('property', 'og:title', m.title)
    meta('property', 'og:description', m.description)
    meta('property', 'og:url', url)
    meta('property', 'og:image', `${SITE_URL}/og.png`)
    meta('name', 'twitter:title', m.title)
    meta('name', 'twitter:description', m.description)
    meta('name', 'twitter:image', `${SITE_URL}/og.png`)

    const ld = upsert('script#ld-json', () => {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = 'ld-json'
      return s
    })
    ld.textContent = noindex ? '{}' : JSON.stringify(buildJsonLd({ siteUrl: SITE_URL, spots, spot }))
  })
  onBeforeUnmount(stop)
}
