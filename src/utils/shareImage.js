import { dayNumber, dayVerdict, formatDay, formatKts, getWeekend, isWeekend, levelLabel, monthShort, weekdayShort } from './forecast'
import { degToCompass } from './wind'
import { pickJoke } from './jokes'

const C = { paper: '#ece7da', paper2: '#e0d9c6', paper3: '#cdc5ab', ink: '#0b0b0b', volt: '#c9ff2f', yellow: '#ffd60a', red: '#ff3d1f', blue: '#2536ff', weekend: '#fff2a0' }
const F = {
  display: "Anton, Impact, 'Arial Narrow Bold', sans-serif",
  mono: "'Space Mono', ui-monospace, monospace",
  hand: "'Permanent Marker', 'Comic Sans MS', cursive",
}

export const FORMATS = {
  story: { id: 'story', label: 'Story 9:16', W: 1080, H: 1920, qMax: 290, ansH: 310, jokeSize: 62, cellH: 300, finde: 150, footer: 190, speedCard: true, inline: false, dTitle: 250, dAns: 300, dJoke: 60, chartH: 420, stats: true },
  post: { id: 'post', label: 'Post 4:5', W: 1080, H: 1350, qMax: 210, ansH: 220, jokeSize: 50, cellH: 220, finde: 112, footer: 140, speedCard: false, inline: true, dTitle: 150, dAns: 200, dJoke: 44, chartH: 280, stats: false },
}

const M = 70 // margen lateral

const font = (ctx, size, family, weight = '') => (ctx.font = `${weight} ${size}px ${family}`.trim())
const fit = (ctx, str, family, max, start, weight = '') => {
  let s = start
  font(ctx, s, family, weight)
  while (ctx.measureText(str).width > max && s > 12) font(ctx, (s -= 4), family, weight)
  return s
}
const wrap = (ctx, str, max) => {
  const out = []
  let line = ''
  str.split(' ').forEach((w) => {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > max && line) {
      out.push(line)
      line = w
    } else line = test
  })
  if (line) out.push(line)
  return out
}
const box = (ctx, x, y, w, h, { fill, shadow = 0, shadowColor = C.ink, lw = 6 } = {}) => {
  if (shadow) {
    ctx.fillStyle = shadowColor
    ctx.fillRect(x + shadow, y + shadow, w, h)
  }
  ctx.fillStyle = fill
  ctx.fillRect(x, y, w, h)
  if (lw) {
    ctx.lineWidth = lw
    ctx.strokeStyle = C.ink
    ctx.strokeRect(x + lw / 2, y + lw / 2, w - lw, h - lw)
  }
}
const txt = (ctx, s, x, y, color, align = 'left') => {
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(s, x, y)
}
const rotated = (ctx, cx, cy, deg, fn) => {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((deg * Math.PI) / 180)
  fn()
  ctx.restore()
}
const toneColor = (tone) => (tone === 'ok' ? C.volt : tone === 'warn' ? C.yellow : C.red)
const rateColor = (rating) => (rating === 'good' ? C.volt : rating === 'ok' ? '#d6f55e' : rating === 'marginal' ? C.yellow : C.paper2)

const grain = () => {
  const n = document.createElement('canvas')
  n.width = n.height = 160
  const g = n.getContext('2d')
  const img = g.createImageData(160, 160)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 22
  }
  g.putImageData(img, 0, 0)
  return n
}

const loadFonts = () =>
  Promise.all([
    document.fonts.load('300px Anton'),
    document.fonts.load("700 30px 'Space Mono'"),
    document.fonts.load("400 60px 'Permanent Marker'"),
  ]).catch(() => {})

export const buildShareUrl = (spot) => {
  const url = new URL(window.location.origin + '/')
  url.searchParams.set('spot', spot.id)
  return url.toString()
}

export const buildShareText = ({ spot, forecast, day = null }) => {
  if (day) {
    const name = formatDay(day.date, { weekday: 'long', day: 'numeric', month: 'long' })
    const lines = [`¿Sopla el ${name} en ${spot.name}? ${dayVerdict(day)}`]
    lines.push(day.window ? `Ventana ${day.window.label} (${day.window.hours} h)` : 'Sin ventana navegable')
    lines.push(`Viento medio ${formatKts(day.avgKts)} kts · ráfaga ${formatKts(day.maxGustKts)} kts`)
    return lines.join('\n')
  }
  const a = forecast.assessment
  const c = forecast.current
  const t = forecast.today
  const we = getWeekend(forecast.days)
  const wk = [we.sat, we.sun]
    .filter(Boolean)
    .map((d) => `${weekdayShort(d.date)} ${dayNumber(d.date)}: ${dayVerdict(d)}${d.window ? ` (${d.window.label})` : ''}`)
    .join(' · ')
  const lines = [`¿Sopla en ${spot.name}? ${a.verdict}${c ? ` — ${formatKts(c.speedKts)} kts ${degToCompass(c.dirDeg)}` : ''}`]
  if (t?.window) lines.push(`Hoy sopla ${t.window.label}`)
  if (wk) lines.push(`Finde → ${wk}`)
  return lines.join('\n')
}

const headerBlock = (ctx, spot, CW) => {
  return {
    h: 150,
    draw: (y) => {
      box(ctx, M, y, 70, 70, { fill: C.ink, lw: 0 })
      ctx.fillStyle = C.volt
      ctx.beginPath()
      ctx.moveTo(M + 12, y + 44)
      ctx.bezierCurveTo(M + 16, y + 20, M + 48, y + 10, M + 64, y + 22)
      ctx.bezierCurveTo(M + 52, y + 26, M + 42, y + 40, M + 38, y + 62)
      ctx.bezierCurveTo(M + 30, y + 52, M + 22, y + 46, M + 12, y + 44)
      ctx.fill()
      font(ctx, 76, F.display)
      txt(ctx, 'SANTA', M + 90, y + 62, C.ink)
      const sw = ctx.measureText('SANTA').width
      const kw = ctx.measureText('KITE').width
      ctx.fillStyle = C.volt
      ctx.fillRect(M + 90 + sw + 6, y + 4, kw + 16, 70)
      txt(ctx, 'KITE', M + 90 + sw + 14, y + 62, C.ink)

      const label = `Nº01 · ${spot.name} · ${spot.location}`.toUpperCase()
      const size = fit(ctx, label, F.mono, CW - 60, 30, '700')
      const lw = ctx.measureText(label).width + 40
      rotated(ctx, M + lw / 2, y + 112, -1.5, () => {
        ctx.fillStyle = C.ink
        ctx.fillRect(-lw / 2, -26, lw, 52)
        font(ctx, size, F.mono, '700')
        txt(ctx, label, 0, size * 0.34, C.volt, 'center')
      })
    },
  }
}


const finish = (ctx, canvas, f, blocks, spot) => {
  const { W, H } = f
  const CW = W - M * 2
  // ---- Reparto vertical
  const tickerH = 84
  const total = blocks.reduce((s, b) => s + b.h, 0)
  const avail = H - tickerH - f.footer - total
  const gap = Math.max(16, Math.min(58, avail / (blocks.length + 1)))
  let y = tickerH + gap
  blocks.forEach((b) => {
    b.draw(y)
    y += b.h + gap
  })

  // ---- Ticker superior
  ctx.fillStyle = C.volt
  ctx.fillRect(0, 0, W, tickerH)
  ctx.fillStyle = C.ink
  ctx.fillRect(0, tickerH - 6, W, 6)
  font(ctx, 30, F.mono, '700')
  const items = [`${spot.name}`, 'Kitesurf entre ríos', '¿Sopla hoy?', 'Si hay duda, no armes']
  let tx = -20
  for (let i = 0; tx < W; i++) {
    const t = `/ ${items[i % items.length].toUpperCase()} `
    txt(ctx, t, tx, 50, C.ink)
    tx += ctx.measureText(t).width + 18
  }

  // ---- Pie
  const fy = H - f.footer
  ctx.fillStyle = C.ink
  ctx.fillRect(0, fy, W, f.footer)
  const ms = fit(ctx, 'SANTAKITE', F.display, CW, f.footer - 60)
  font(ctx, ms, F.display)
  txt(ctx, 'SANTAKITE', W / 2, fy + ms * 0.9 + 6, C.volt, 'center')
  font(ctx, 24, F.mono, '700')
  txt(ctx, buildShareUrl(spot).replace(/^https?:\/\//, '').replace(/\/\?/, '/?'), W / 2, H - 16, C.paper, 'center')

  // ---- Grano de impresión
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = ctx.createPattern(grain(), 'repeat')
  ctx.fillRect(0, 0, W, H)
  ctx.globalCompositeOperation = 'source-over'

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/png'))
}

/** Dibuja la imagen y devuelve un Blob PNG. */
export const renderShareImage = async ({ spot, forecast, joke, format = 'story', day = null }) => {
  if (day) return renderDayImage({ spot, forecast, day, format })
  await loadFonts()
  const f = FORMATS[format] ?? FORMATS.story
  const { W, H } = f
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const CW = W - M * 2

  const a = forecast.assessment
  const cur = forecast.current
  const days = forecast.days.slice(0, 8)
  const we = getWeekend(days)
  const word = a.verdict
  const tone = toneColor(a.tone)
  const today = forecast.today

  // Fondo
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, W, H)

  // ---- Medición de bloques
  const blocks = []

  // 1) Marca + etiqueta del spot
  blocks.push(headerBlock(ctx, spot, CW))

  // 2) ¿SOPLA? + respuesta (+ nudos en story)
  const qSize = fit(ctx, '¿SOPLA?', F.display, f.inline ? CW * 0.52 : CW, f.qMax)
  const qH = qSize * 0.9
  if (f.inline) {
    blocks.push({
      h: Math.max(qH, f.ansH),
      draw: (y) => {
        font(ctx, qSize, F.display)
        txt(ctx, '¿SOPLA?', M, y + qSize * 0.88, C.ink)
        const aw = CW - ctx.measureText('¿SOPLA?').width - 50
        drawAnswer(y + 8, M + CW - aw, aw, f.ansH - 10)
      },
    })
  } else {
    blocks.push({
      h: qH,
      draw: (y) => {
        font(ctx, qSize, F.display)
        txt(ctx, '¿SOPLA?', M, y + qSize * 0.88, C.ink)
      },
    })
    blocks.push({
      h: f.ansH + 20,
      draw: (y) => {
        const aw = 470
        drawAnswer(y + 6, M, aw, f.ansH - 6)
        if (f.speedCard && cur) drawSpeed(y + 6, M + aw + 50, CW - aw - 50, f.ansH - 6)
      },
    })
  }

  function drawAnswer(y, x, w, h) {
    rotated(ctx, x + w / 2, y + h / 2, -2.5, () => {
      box(ctx, -w / 2, -h / 2, w, h, { fill: tone, shadow: 14, lw: 8 })
      const s = fit(ctx, word, F.display, w - 60, h * 0.72)
      font(ctx, s, F.display)
      txt(ctx, word, 0, s * 0.34, C.ink, 'center')
    })
  }
  function drawSpeed(y, x, w, h) {
    box(ctx, x, y, w, h, { fill: C.ink, shadow: 14, shadowColor: C.volt, lw: 6 })
    font(ctx, 200, F.display)
    const num = formatKts(cur.speedKts, 0)
    txt(ctx, num, x + 26, y + 190, C.volt)
    const nw = ctx.measureText(num).width
    font(ctx, 54, F.display)
    txt(ctx, 'KTS', x + 26 + nw + 12, y + 190, C.paper)
    font(ctx, 26, F.mono, '700')
    txt(ctx, `DESDE ${degToCompass(cur.dirDeg)} · ${Math.round(cur.dirDeg)}°`, x + 26, y + h - 58, C.paper)
    txt(ctx, a.label.toUpperCase(), x + 26, y + h - 22, C.volt)
  }

  // 3) Chiste
  font(ctx, f.jokeSize, F.hand)
  const jokeLines = wrap(ctx, joke, CW - 80)
  const lh = f.jokeSize * 1.2
  const jokeH = jokeLines.length * lh + 56
  blocks.push({
    h: jokeH + 12,
    draw: (y) => {
      rotated(ctx, M + CW / 2, y + jokeH / 2 + 4, -1, () => {
        box(ctx, -CW / 2, -jokeH / 2, CW, jokeH, { fill: C.yellow, shadow: 10, lw: 6 })
        font(ctx, f.jokeSize, F.hand)
        jokeLines.forEach((l, i) => txt(ctx, l, -CW / 2 + 40, -jokeH / 2 + 28 + f.jokeSize * 0.9 + i * lh, C.ink))
      })
    },
  })

  // 4) Línea de datos
  let sub = cur ? `${formatKts(cur.speedKts)} kts desde ${degToCompass(cur.dirDeg)}` : ''
  if (today?.window) sub += ` · hoy sopla ${today.window.label}`
  else sub += ' · hoy sin ventana'
  font(ctx, 30, F.mono, '700')
  const subLines = wrap(ctx, sub.toUpperCase(), CW)
  blocks.push({
    h: subLines.length * 40,
    draw: (y) => {
      font(ctx, 30, F.mono, '700')
      subLines.forEach((l, i) => txt(ctx, l, M, y + 30 + i * 40, C.ink))
    },
  })

  // 5) Tira de días
  const k = f.cellH / 300
  blocks.push({
    h: 56 + f.cellH,
    draw: (y) => {
      box(ctx, M, y, CW, 56 + f.cellH, { fill: C.paper, shadow: 10, lw: 6 })
      ctx.fillStyle = C.ink
      ctx.fillRect(M, y, CW, 56)
      font(ctx, 24, F.mono, '700')
      txt(ctx, 'PRÓXIMOS 7 DÍAS', M + 24, y + 37, C.paper)
      txt(ctx, '* = FIN DE SEMANA', M + CW - 24, y + 37, C.volt, 'right')
      const cw = CW / days.length
      days.forEach((d, i) => {
        const x = M + i * cw
        const cy = y + 56
        const wkend = isWeekend(d.date)
        if (wkend) {
          ctx.fillStyle = C.weekend
          ctx.fillRect(x, cy, cw, f.cellH)
        }
        if (i < days.length - 1) {
          ctx.fillStyle = C.ink
          ctx.fillRect(x + cw - 2, cy, 4, f.cellH)
        }
        const label = (i === 0 ? 'HOY' : weekdayShort(d.date)).toUpperCase()
        const lsz = 46 * k
        font(ctx, lsz, F.display)
        const lw = ctx.measureText(label).width
        if (wkend) {
          ctx.fillStyle = C.ink
          ctx.fillRect(x + cw / 2 - lw / 2 - 8, cy + 10 * k, lw + 16, lsz + 12 * k)
          txt(ctx, label, x + cw / 2, cy + 10 * k + lsz * 0.92, C.volt, 'center')
        } else txt(ctx, label, x + cw / 2, cy + 10 * k + lsz * 0.92, C.ink, 'center')
        font(ctx, 26 * k, F.mono, '700')
        txt(ctx, `${dayNumber(d.date)}${wkend ? '*' : ''}`, x + cw / 2, cy + 96 * k, C.ink, 'center')

        const vh = 104 * k
        const vy = cy + 116 * k
        const vw = cw - 28
        ctx.fillStyle = rateColor(d.rating)
        ctx.fillRect(x + 14, vy, vw, vh)
        ctx.lineWidth = 5
        ctx.strokeStyle = C.ink
        ctx.setLineDash(d.rating === 'bad' ? [10, 8] : [])
        ctx.strokeRect(x + 16.5, vy + 2.5, vw - 5, vh - 5)
        ctx.setLineDash([])
        const v = dayVerdict(d)
        font(ctx, (v === 'POCO' ? 44 : 66) * k, F.display)
        txt(ctx, v, x + cw / 2, vy + vh * 0.7, d.rating === 'bad' ? '#777' : C.ink, 'center')

        font(ctx, 30 * k, F.mono, '700')
        txt(ctx, d.window ? `${d.window.hours}h` : '—', x + cw / 2, vy + vh + 38 * k, C.ink, 'center')
        font(ctx, 22 * k, F.mono)
        txt(ctx, `${formatKts(d.avgKts)}kt`, x + cw / 2, vy + vh + 66 * k, '#555', 'center')

        if (i === 0) {
          ctx.lineWidth = 8
          ctx.strokeStyle = C.blue
          ctx.strokeRect(x + 4, cy + 4, cw - 8, f.cellH - 8)
        }
      })
    },
  })

  // 6) Finde
  const wkGood = [we.sat, we.sun].filter(Boolean).filter((d) => d.rating === 'good' || d.rating === 'ok').length
  const wkTotal = [we.sat, we.sun].filter(Boolean).length
  const wkKey = wkGood === wkTotal ? 'weekendYes' : wkGood > 0 ? 'weekendMaybe' : 'weekendNo'
  const wkJoke = pickJoke(wkKey, `${spot.id}${days[0]?.date ?? ''}`)
  const wkSum = [we.sat, we.sun]
    .filter(Boolean)
    .map((d) => `${weekdayShort(d.date)} ${dayNumber(d.date)} ${dayVerdict(d)}${d.window ? ` ${d.window.hours}h` : ''}`)
    .join('  ·  ')
    .toUpperCase()
  if (wkTotal) {
    font(ctx, 38 * Math.min(1, k + 0.2), F.hand)
    const wkLines = wrap(ctx, wkJoke, CW - 60)
    const fs = 38 * Math.min(1, k + 0.2)
    const fh = Math.max(f.finde, 76 + wkLines.slice(0, 2).length * fs * 1.2 + 14)
    blocks.push({
      h: fh,
      draw: (y) => {
        box(ctx, M, y, CW, fh, { fill: C.yellow, shadow: 10, lw: 6 })
        ctx.fillStyle = C.ink
        ctx.fillRect(M + 24, y + 20, 112, 38)
        font(ctx, 24, F.mono, '700')
        txt(ctx, 'FINDE', M + 80, y + 47, C.yellow, 'center')
        const s = fit(ctx, wkSum, F.mono, CW - 190, 28, '700')
        font(ctx, s, F.mono, '700')
        txt(ctx, wkSum, M + 156, y + 48, C.ink)
        font(ctx, 38 * Math.min(1, k + 0.2), F.hand)
        wkLines.slice(0, 2).forEach((l, i) => txt(ctx, l, M + 30, y + 98 + i * 46 * Math.min(1, k + 0.2), C.ink))
      },
    })
  }

  return finish(ctx, canvas, f, blocks, spot)
}

const LV_FILL = ['#9b9684', '#e3f58f', '#d6f55e', C.volt, '#a6e000']

/** Imagen de un día puntual: veredicto, ventana, estadísticas y barras hora por hora. */
export const renderDayImage = async ({ spot, forecast, day, format = 'story' }) => {
  await loadFonts()
  const f = FORMATS[format] ?? FORMATS.story
  const { W, H } = f
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const CW = W - M * 2
  const cfg = forecast.cfg
  const wk = isWeekend(day.date)

  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, W, H)

  const word = dayVerdict(day)
  const good = day.rating === 'good' || day.rating === 'ok'
  const tone = good ? C.volt : day.rating === 'marginal' ? C.yellow : C.red
  const jokeKey = wk ? (good ? 'weekendYes' : day.rating === 'marginal' ? 'weekendMaybe' : 'weekendNo') : good ? 'dayYes' : day.rating === 'marginal' ? 'dayMaybe' : 'dayNo'
  const joke = pickJoke(jokeKey, `${spot.id}${day.date}`)

  const blocks = [headerBlock(ctx, spot, CW)]

  // Día en grande
  const title = `${formatDay(day.date, { weekday: 'long' })} ${dayNumber(day.date)}`.toUpperCase()
  const tSize = fit(ctx, title, F.display, CW, f.dTitle)
  const month = formatDay(day.date, { month: 'long' }).toUpperCase()
  blocks.push({
    h: tSize * 0.9 + 84,
    draw: (y0) => {
      const y = y0 + 24
      font(ctx, tSize, F.display)
      txt(ctx, title, M, y + tSize * 0.88, C.ink)
      font(ctx, 32, F.mono, '700')
      txt(ctx, `DE ${month} · ${spot.name.toUpperCase()}`, M, y + tSize * 0.9 + 40, C.ink)
      if (wk) {
        rotated(ctx, M + CW - 150, y + tSize * 0.9 + 22, -4, () => {
          box(ctx, -150, -26, 300, 52, { fill: C.yellow, shadow: 6, lw: 4 })
          font(ctx, 26, F.mono, '700')
          txt(ctx, '* FIN DE SEMANA', 0, 9, C.ink, 'center')
        })
      }
    },
  })

  // Veredicto + ventana
  const rowH = f.dAns
  blocks.push({
    h: rowH + 20,
    draw: (y) => {
      const aw = 470
      rotated(ctx, M + aw / 2, y + 6 + (rowH - 6) / 2, -2.5, () => {
        box(ctx, -aw / 2, -(rowH - 6) / 2, aw, rowH - 6, { fill: tone, shadow: 14, lw: 8 })
        font(ctx, 26, F.mono, '700')
        txt(ctx, '¿SOPLA ESE DÍA?', 0, -(rowH - 6) / 2 + 46, C.ink, 'center')
        const sz = fit(ctx, word, F.display, aw - 60, (rowH - 6) * 0.56)
        font(ctx, sz, F.display)
        txt(ctx, word, 0, sz * 0.34 + 44, C.ink, 'center')
      })
      const x = M + aw + 50
      const w = CW - aw - 50
      box(ctx, x, y + 6, w, rowH - 6, { fill: C.ink, shadow: 14, shadowColor: C.volt, lw: 6 })
      font(ctx, 24, F.mono, '700')
      txt(ctx, day.window ? 'VENTANA NAVEGABLE' : 'SIN VENTANA', x + 24, y + 6 + 46, C.volt)
      if (day.window) {
        const wsz = fit(ctx, day.window.label.replace(' – ', '–'), F.display, w - 48, 96)
        font(ctx, wsz, F.display)
        txt(ctx, day.window.label.replace(' – ', '–'), x + 24, y + 6 + 46 + wsz * 0.95 + 14, C.paper)
        font(ctx, 30, F.mono, '700')
        txt(ctx, `${day.window.hours} H DE VIENTO`, x + 24, y + rowH - 28, C.volt)
      } else {
        font(ctx, 66, F.display)
        txt(ctx, 'NO NAVEGABLE', x + 24, y + 6 + 46 + 80, C.paper)
        font(ctx, 28, F.mono, '700')
        txt(ctx, `${formatKts(day.avgKts)} KTS DE MEDIA`, x + 24, y + rowH - 28, C.volt)
      }
    },
  })

  // Chiste
  const js = f.dJoke
  font(ctx, js, F.hand)
  const jl = wrap(ctx, joke, CW - 80)
  const jh = jl.length * js * 1.2 + 56
  blocks.push({
    h: jh + 12,
    draw: (y) =>
      rotated(ctx, M + CW / 2, y + jh / 2 + 4, -1, () => {
        box(ctx, -CW / 2, -jh / 2, CW, jh, { fill: C.yellow, shadow: 10, lw: 6 })
        font(ctx, js, F.hand)
        jl.forEach((l, i) => txt(ctx, l, -CW / 2 + 40, -jh / 2 + 28 + js * 0.9 + i * js * 1.2, C.ink))
      }),
  })

  // Estadísticas
  if (f.stats) {
    blocks.push({
      h: 130,
      draw: (y) => {
        const items = [
          ['VIENTO MEDIO', `${formatKts(day.avgKts)} kts`],
          ['RÁFAGA MÁX', `${formatKts(day.maxGustKts)} kts`],
          ['DIRECCIÓN', day.mainDir ?? '–'],
          ['LLUVIA', `${formatKts(day.totalRain, 1)} mm`],
        ]
        box(ctx, M, y, CW, 130, { fill: C.paper, shadow: 10, lw: 6 })
        const cw = CW / items.length
        items.forEach(([l, v], i) => {
          const x = M + i * cw
          if (i) {
            ctx.fillStyle = C.ink
            ctx.fillRect(x - 2, y, 4, 130)
          }
          font(ctx, 20, F.mono, '700')
          txt(ctx, l, x + cw / 2, y + 40, '#444', 'center')
          const sz = fit(ctx, v, F.display, cw - 24, 58)
          font(ctx, sz, F.display)
          txt(ctx, v.toUpperCase(), x + cw / 2, y + 40 + sz * 0.95 + 10, C.ink, 'center')
        })
      },
    })
  }

  // Gráfico hora por hora
  const H0 = 6
  const H1 = 21
  const n = H1 - H0 + 1
  const maxG = Math.max(0, ...day.hours.map((h) => h.gustKts ?? 0))
  const scale = Math.max(25, Math.ceil(maxG / 5) * 5)
  blocks.push({
    h: f.chartH,
    draw: (y) => {
      box(ctx, M, y, CW, f.chartH, { fill: C.paper, shadow: 10, lw: 6 })
      ctx.fillStyle = C.ink
      ctx.fillRect(M, y, CW, 52)
      font(ctx, 24, F.mono, '700')
      txt(ctx, 'VIENTO HORA POR HORA (KTS)', M + 24, y + 35, C.paper)
      txt(ctx, `MÍN. ${cfg.minPlayableKts} KTS`, M + CW - 24, y + 35, C.volt, 'right')
      const px = M + 20
      const pw = CW - 40
      const top = y + 52 + 38
      const bottom = y + f.chartH - 74
      const ph = bottom - top
      const bw = pw / n
      // umbral
      const ty = bottom - (cfg.minPlayableKts / scale) * ph
      for (let h = H0; h <= H1; h++) {
        const hour = day.hours.find((x) => x.hourNum === h)
        const bx = px + (h - H0) * bw
        if (hour) {
          const bh = Math.max(6, ((hour.speedKts ?? 0) / scale) * ph)
          const gh = Math.max(bh, ((hour.gustKts ?? 0) / scale) * ph)
          ctx.fillStyle = C.paper3
          ctx.fillRect(bx + 6, bottom - gh, bw - 12, gh)
          ctx.fillStyle = hour.assess.sun ? LV_FILL[hour.assess.level] : C.paper2
          ctx.fillRect(bx + 6, bottom - bh, bw - 12, bh)
          ctx.lineWidth = 3
          ctx.strokeStyle = C.ink
          ctx.strokeRect(bx + 7.5, bottom - bh + 1.5, bw - 15, bh - 3)
          font(ctx, 21, F.mono, '700')
          txt(ctx, String(Math.round(hour.speedKts ?? 0)), bx + bw / 2, bottom - bh - 8, C.ink, 'center')
        }
        font(ctx, 20, F.mono)
        txt(ctx, String(h).padStart(2, '0'), bx + bw / 2, bottom + 30, '#333', 'center')
        if (hour) {
          font(ctx, 15, F.mono, '700')
          txt(ctx, degToCompass(hour.dirDeg), bx + bw / 2, bottom + 52, hour.assess.dirOk ? C.ink : '#777', 'center')
        }
      }
      ctx.lineWidth = 4
      ctx.strokeStyle = C.red
      ctx.setLineDash([14, 10])
      ctx.beginPath()
      ctx.moveTo(px, ty)
      ctx.lineTo(px + pw, ty)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = C.ink
      ctx.fillRect(px, bottom + 2, pw, 4)
    },
  })

  return finish(ctx, canvas, f, blocks, spot)
}
