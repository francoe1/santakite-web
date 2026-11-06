# SantaKite

Web de kitesurf en Entre Ríos: ¿sopla hoy? Viento en vivo, pronóstico a 8 días con el finde destacado, mapa de zonas, seguridad y una imagen para compartir.

Vue 3 + Vite + Pinia + Vue Router. Datos de viento: GFS vía [Open-Meteo](https://open-meteo.com).

## Desarrollo

```sh
npm install
npm run dev      # desarrollo
npm run build    # producción (genera además páginas estáticas por spot, sitemap.xml y robots.txt)
```

## Spots

Los spots viven en `src/data/spots.json` (25 spots de Argentina, Brasil y Uruguay). Cada spot tiene su propia URL `/spot/<id>` y todos se ven en el mapa `/mapa`.

- `verified: false` marca spots "en revisión": ubicación aproximada y sin zonas dibujadas.
- `forecast.anyDirection: true` significa que la dirección ideal del viento no está confirmada: solo se evalúa la fuerza (mínimo de nudos). Para confirmarla, reemplazalo por `preferredDirections`.
- Para sumar un spot copiá cualquiera de los existentes y completá `country`, `region`, `coordinates`, `forecast` y `map`.

## SEO

- Metadatos, Open Graph, Twitter Cards y datos estructurados (JSON-LD) por spot: `src/seo/content.js`.
- En el build, `scripts/seoPlugin.js` genera `dist/spot/<id>/index.html` con el `<head>` y el contenido propios de cada spot, `sitemap.xml`, `robots.txt` y `404.html`.
- **URL del sitio:** se toma de `VITE_SITE_URL` o, en Vercel, de `VERCEL_PROJECT_PRODUCTION_URL`. Si usás dominio propio, definí `VITE_SITE_URL=https://tudominio.com` en las variables de entorno.
- Íconos e imagen OG: `node scripts/brand-assets.mjs` (requiere Playwright).

## Animaciones

Los personajes vectoriales (`src/components/fx`) cambian con el estado del viento. Siempre activas y muy tenues: un solo personaje por vez, elegido al azar según el viento, más palmeras, hojas y rayas de viento que reaccionan al viento real y al scroll. Solo se pausan si el sistema pide `prefers-reduced-motion`.
