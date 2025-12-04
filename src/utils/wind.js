const COMPASS_POINTS = [
  { abbr: 'N', aliases: ['N'] },
  { abbr: 'NNE', aliases: ['NNE', 'NNO'] },
  { abbr: 'NE', aliases: ['NE'] },
  { abbr: 'ENE', aliases: ['ENE'] },
  { abbr: 'E', aliases: ['E', 'ESTE'] },
  { abbr: 'ESE', aliases: ['ESE'] },
  { abbr: 'SE', aliases: ['SE'] },
  { abbr: 'SSE', aliases: ['SSE'] },
  { abbr: 'S', aliases: ['S', 'SUR'] },
  { abbr: 'SSO', aliases: ['SSO', 'SSW'] },
  { abbr: 'SO', aliases: ['SO', 'SW'] },
  { abbr: 'OSO', aliases: ['OSO', 'WSW'] },
  { abbr: 'O', aliases: ['O', 'W', 'OESTE'] },
  { abbr: 'ONO', aliases: ['ONO', 'WNW'] },
  { abbr: 'NO', aliases: ['NO', 'NW'] },
  { abbr: 'NNO', aliases: ['NNO', 'NNW'] },
]

const aliasMap = COMPASS_POINTS.reduce((map, point, idx) => {
  point.aliases.forEach((alias) => {
    map[alias.toUpperCase()] = { ...point, index: idx }
  })
  map[point.abbr] = { ...point, index: idx }
  return map
}, {})

export const normalizeDegrees = (deg) => ((deg % 360) + 360) % 360

export const normalizeDirectionLabel = (label) => {
  if (!label) return null
  const normalized = aliasMap[label.toUpperCase()]
  return normalized ? normalized.abbr : null
}

export const getDirectionOffset = (referenceLabel = 'N') => {
  const normalized = normalizeDirectionLabel(referenceLabel) ?? 'N'
  const info = aliasMap[normalized]
  if (!info) return 0
  return info.index * 22.5
}

export const degToCompass = (deg) => {
  const normalizedDeg = normalizeDegrees(deg)
  const index = Math.round(normalizedDeg / 22.5) % COMPASS_POINTS.length
  return COMPASS_POINTS[index].abbr
}

export const buildPreferredDirectionSet = (preferred = []) => {
  const set = new Set()
  preferred.forEach((dir) => {
    const normalized = normalizeDirectionLabel(dir)
    if (normalized) set.add(normalized)
  })
  return set
}

export const isDirectionPreferred = (deg, preferredSet, directionReference = 'N') => {
  if (!(preferredSet instanceof Set) || preferredSet.size === 0) return false
  const offset = getDirectionOffset(directionReference)
  const normalizedDeg = normalizeDegrees(deg - offset)
  const compass = degToCompass(normalizedDeg)
  return preferredSet.has(compass)
}

export const getCompassPoints = () => COMPASS_POINTS.map((point) => point.abbr)
