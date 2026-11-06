import { ref } from 'vue'

const busy = ref(false)
const message = ref('')
let timer

const say = (t) => {
  message.value = t
  clearTimeout(timer)
  timer = setTimeout(() => (message.value = ''), 4500)
}

const download = (blob, name) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

/**
 * Una sola acción: genera la imagen y abre el menú nativo de compartir del dispositivo.
 * Si el dispositivo no puede compartir archivos (ej. compu), la descarga.
 */
export const useShare = () => {
  const share = async ({ spot, forecast, joke = '', day = null }) => {
    if (busy.value) return
    busy.value = true
    try {
      const { renderShareImage, buildShareText, buildShareUrl } = await import('@/utils/shareImage')
      const blob = await renderShareImage({ spot, forecast, joke, day, format: 'story' })
      const name = `santakite-${spot.id}${day ? `-${day.date}` : ''}.png`
      const file = new File([blob], name, { type: 'image/png' })
      const text = `${buildShareText({ spot, forecast, day })}\n${buildShareUrl(spot)}`

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: `¿Sopla en ${spot.name}?`, text })
        } catch (e) {
          if (e?.name !== 'AbortError') throw e
        }
      } else {
        download(blob, name)
        say('Imagen descargada. Subila a WhatsApp o Instagram desde tu galería.')
      }
    } catch (e) {
      console.error(e)
      say('No pudimos generar la imagen. Probá de nuevo.')
    } finally {
      busy.value = false
    }
  }
  return { share, busy, message }
}
