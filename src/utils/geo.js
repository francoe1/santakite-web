const toRad = (d) => (d * Math.PI) / 180

/** Distancia en km entre dos puntos (haversine). */
export const distanceKm = (a, b) => {
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

/** Spots ordenados por cercanía a un punto (el propio spot queda primero). */
export const sortByDistance = (spots, point) =>
  [...spots]
    .map((s) => ({ spot: s, km: distanceKm(point, s.coordinates) }))
    .sort((a, b) => a.km - b.km)

export const normalize = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

export const COUNTRY_ORDER = ['AR', 'BR', 'UY']
export const COUNTRY_COLORS = { AR: '#c9ff2f', BR: '#ffd60a', UY: '#ff3d1f' }
