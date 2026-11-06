// Contenido SEO compartido entre la app (cliente) y el build (prerender estático).
// Solo funciones puras, sin dependencias del navegador.
import { getSpotConfig } from '../utils/forecast'

export const BRAND = {
  name: 'SantaKite',
  lang: 'es-AR',
  locale: 'es_AR',
  themeColor: '#0b0b0b',
  bgColor: '#ece7da',
}

const pad = (n) => String(n).padStart(2, '0')
const win = (w) => `${pad(w.startHour)}:00 a ${pad(w.endHour)}:00`
const trim = (s, max) => (s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`)

export const spotPath = (spot) => `/spot/${spot.id}`

export const homeMeta = (spots) => ({
  title: 'SantaKite · ¿Sopla hoy? Kitesurf en Entre Ríos: viento en vivo y pronóstico',
  description: trim(
    `¿Sopla hoy en ${spots.map((s) => s.name).join(', ')}? Viento en vivo, pronóstico a 7 días con el fin de semana, mapa de zonas y seguridad para kitesurf en Entre Ríos, Argentina.`,
    158
  ),
  keywords: 'kitesurf Entre Ríos, kitesurf Santa Ana, kitesurf Federación, viento en vivo, pronóstico de viento, spot de kite, Río Uruguay, Salto Grande',
  path: '/',
})

export const spotMeta = (spot) => {
  const cfg = getSpotConfig(spot)
  return {
    title: `Kitesurf en ${spot.name} · Viento en vivo y pronóstico | SantaKite`,
    description: trim(
      `Kitesurf en ${spot.name}: ¿sopla hoy? Viento en vivo, pronóstico a 7 días, mapa de zonas y seguridad. Viento ideal ${cfg.preferredDirections.slice(0, 4).join(' · ')} desde ${cfg.minPlayableKts} nudos.`,
      158
    ),
    keywords: `kitesurf ${spot.name}, viento ${spot.name}, pronóstico kite ${spot.name}, spot de kitesurf Entre Ríos, kitesurf Argentina`,
    path: spotPath(spot),
  }
}

export const buildFaq = (spot) => {
  const cfg = getSpotConfig(spot)
  const dirs = cfg.preferredDirections.join(', ')
  const safety = (spot.security?.steps || [])
    .map((s) => `${s.title}: ${s.items?.[0] ?? ''}`)
    .filter(Boolean)
    .join(' ')
  return [
    {
      q: `¿Con qué viento se navega en ${spot.name}?`,
      a: `${spot.forecast?.criteriaText ?? `Se navega con viento de ${dirs}.`} Las direcciones ideales son ${dirs}, con un mínimo de ${cfg.minPlayableKts} nudos y lluvia por debajo de ${cfg.maxPrecipMm} mm/h.`,
    },
    {
      q: `¿Cómo sé si hoy sopla en ${spot.name}?`,
      a: `Arriba de todo en la página ves ¿Sopla? con la respuesta en vivo (SÍ, CASI o NO), el viento actual en nudos y el pronóstico de los próximos 7 días con el fin de semana destacado. Los datos vienen del modelo GFS a través de Open-Meteo y se actualizan cada pocos minutos.`,
    },
    {
      q: `¿En qué horarios se puede navegar en ${spot.name}?`,
      a: `En verano (noviembre a febrero) de ${win(cfg.summerWindow)} y en invierno de ${win(cfg.winterWindow)}, mientras haya luz solar.`,
    },
    {
      q: `¿Dónde queda ${spot.name} y cómo llegar?`,
      a: `${spot.references?.description ?? spot.location} Coordenadas: ${spot.references?.coordinatesLabel ?? ''}. Desde la sección El spot podés abrir la ruta en Google Maps.`,
    },
    {
      q: `¿Qué reglas de seguridad hay en ${spot.name}?`,
      a: `${spot.security?.intro ?? ''} ${safety}`.trim(),
    },
  ]
}

const contactOf = (spots, icon) => spots.flatMap((s) => s.contacts || []).find((c) => c.icon === icon)

export const buildJsonLd = ({ siteUrl, spots, spot = null }) => {
  const insta = contactOf(spots, 'instagram')
  const wa = contactOf(spots, 'whatsapp')
  const orgId = `${siteUrl}/#organization`
  const siteId = `${siteUrl}/#website`
  const graph = [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: BRAND.name,
      url: siteUrl,
      logo: `${siteUrl}/icon-512.png`,
      image: `${siteUrl}/og.png`,
      ...(insta ? { sameAs: [insta.href] } : {}),
      ...(wa ? { contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', telephone: wa.value, availableLanguage: 'es' }] } : {}),
    },
    { '@type': 'WebSite', '@id': siteId, url: siteUrl, name: BRAND.name, inLanguage: BRAND.lang, publisher: { '@id': orgId } },
  ]

  const place = (s) => ({
    '@type': ['SportsActivityLocation', 'Place'],
    '@id': `${siteUrl}${spotPath(s)}#place`,
    name: `${s.name} · Kitesurf`,
    description: s.highlights?.[0]?.description ?? s.references?.description,
    url: `${siteUrl}${spotPath(s)}`,
    image: `${siteUrl}/og.png`,
    geo: { '@type': 'GeoCoordinates', latitude: s.coordinates.lat, longitude: s.coordinates.lon },
    address: { '@type': 'PostalAddress', addressLocality: s.location.split(',')[0].trim(), addressRegion: 'Entre Ríos', addressCountry: 'AR' },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${s.coordinates.lat},${s.coordinates.lon}`,
    isAccessibleForFree: true,
  })

  if (spot) {
    graph.push(
      place(spot),
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}${spotPath(spot)}#webpage`,
        url: `${siteUrl}${spotPath(spot)}`,
        name: spotMeta(spot).title,
        description: spotMeta(spot).description,
        inLanguage: BRAND.lang,
        isPartOf: { '@id': siteId },
        about: { '@id': `${siteUrl}${spotPath(spot)}#place` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: spot.name, item: `${siteUrl}${spotPath(spot)}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: buildFaq(spot).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }
    )
  } else {
    graph.push({
      '@type': 'ItemList',
      name: 'Spots de kitesurf',
      itemListElement: spots.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `${siteUrl}${spotPath(s)}`, name: s.name })),
    })
    spots.forEach((s) => graph.push(place(s)))
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

/** Tags <head> como string (usado en el build para páginas estáticas). */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export const buildHeadHtml = ({ siteUrl, spots, spot = null }) => {
  const m = spot ? spotMeta(spot) : homeMeta(spots)
  const url = `${siteUrl}${m.path === '/' ? '' : m.path}` || siteUrl
  const img = `${siteUrl}/og.png`
  const ld = JSON.stringify(buildJsonLd({ siteUrl, spots, spot })).replace(/</g, '\\u003c')
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="keywords" content="${esc(m.keywords)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="es-AR" href="${url}" />`,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
    `<meta property="og:site_name" content="${BRAND.name}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${BRAND.locale}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${BRAND.name}: ¿sopla hoy? Kitesurf en Entre Ríos" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<script type="application/ld+json" id="ld-json">${ld}</script>`,
  ].join('\n    ')
}
