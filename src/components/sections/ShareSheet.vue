<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Sheet from '../ui/Sheet.vue'
import Icon from '../ui/Icon.vue'
import { FORMATS, buildShareText, buildShareUrl, renderShareImage } from '@/utils/shareImage'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  spot: { type: Object, required: true },
  forecast: { type: Object, required: true },
  joke: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const open = computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })
const format = ref('story')
const url = ref('')
const blob = ref(null)
const busy = ref(false)
const msg = ref('')
let msgTimer

const shareUrl = computed(() => buildShareUrl(props.spot))
const shareText = computed(() => buildShareText({ spot: props.spot, forecast: props.forecast }))
const fileName = computed(() => `santakite-${props.spot.id}-${format.value}.png`)
const file = computed(() => (blob.value ? new File([blob.value], fileName.value, { type: 'image/png' }) : null))
const canNative = computed(() => !!file.value && typeof navigator !== 'undefined' && navigator.canShare?.({ files: [file.value] }))

const say = (t) => {
  msg.value = t
  clearTimeout(msgTimer)
  msgTimer = setTimeout(() => (msg.value = ''), 4500)
}

const render = async () => {
  busy.value = true
  try {
    const b = await renderShareImage({ spot: props.spot, forecast: props.forecast, joke: props.joke, format: format.value })
    if (url.value) URL.revokeObjectURL(url.value)
    blob.value = b
    url.value = URL.createObjectURL(b)
  } catch (e) {
    console.error(e)
    say('No pudimos generar la imagen. Probá de nuevo.')
  } finally {
    busy.value = false
  }
}

watch(
  () => [props.modelValue, format.value],
  ([o]) => o && render(),
  { immediate: true }
)
onBeforeUnmount(() => url.value && URL.revokeObjectURL(url.value))

const download = () => {
  if (!url.value) return
  const a = document.createElement('a')
  a.href = url.value
  a.download = fileName.value
  document.body.appendChild(a)
  a.click()
  a.remove()
}

const nativeShare = async () => {
  try {
    await navigator.share({ files: [file.value], title: `¿Sopla en ${props.spot.name}?`, text: `${shareText.value}\n${shareUrl.value}` })
  } catch (e) {
    if (e?.name !== 'AbortError') say('No se pudo abrir el menú de compartir.')
  }
}

const whatsapp = () => {
  const text = `${shareText.value}\n${shareUrl.value}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  say('WhatsApp no deja adjuntar la imagen por link: tocá "Compartir" para mandarla con la foto, o descargala.')
}

const instagram = () => {
  if (canNative.value) return nativeShare()
  download()
  say('Imagen descargada. Abrí Instagram y subila a tu historia o publicación.')
}

const copy = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    say('Link copiado.')
  } catch {
    say('No se pudo copiar. Copialo desde la barra del navegador.')
  }
}
</script>

<template>
  <Sheet v-model="open" wide title="Compartí el viento" eyebrow="Imagen lista para historias y chats">
    <div class="share">
      <div class="preview">
        <div class="formats" role="tablist" aria-label="Formato de la imagen">
          <button v-for="f in FORMATS" :key="f.id" role="tab" :aria-selected="format === f.id" :class="{ on: format === f.id }" @click="format = f.id">{{ f.label }}</button>
        </div>
        <div class="frame" :class="format" :aria-busy="busy">
          <img v-if="url" :src="url" :alt="`Imagen para compartir: ¿Sopla en ${spot.name}?`" />
          <p v-if="busy" class="loading mono">Imprimiendo…</p>
        </div>
      </div>

      <div class="actions">
        <button v-if="canNative" type="button" class="btn btn--primary big" @click="nativeShare"><Icon name="share" :size="20" />Compartir</button>
        <button type="button" class="btn" :disabled="!url" @click="whatsapp"><Icon name="chat" :size="20" />WhatsApp</button>
        <button type="button" class="btn" :disabled="!url" @click="instagram"><Icon name="camera" :size="20" />Instagram</button>
        <button type="button" class="btn btn--ghost" :disabled="!url" @click="download"><Icon name="download" :size="20" />Descargar</button>
        <button type="button" class="btn btn--ghost" @click="copy"><Icon name="copy" :size="20" />Copiar link</button>
        <p class="hint">
          <template v-if="canNative">En el celular, "Compartir" abre tus apps: elegí WhatsApp o Instagram (historia) y se envía la imagen directo.</template>
          <template v-else>En la compu: descargá la imagen y subila a Instagram, o mandá el texto por WhatsApp con el link del spot.</template>
        </p>
        <p v-if="msg" class="msg hand" role="status">{{ msg }}</p>
      </div>
    </div>
  </Sheet>
</template>

<style scoped>
.share { display: grid; gap: 22px; padding: 4px 6px 8px 4px; }
.formats { display: inline-flex; border: var(--bw) solid var(--ink); margin-bottom: 14px; }
.formats button { min-height: 42px; padding: 0 16px; font-family: var(--font-mono); font-size: 12px; font-weight: 700; text-transform: uppercase; }
.formats button + button { border-left: var(--bw) solid var(--ink); }
.formats .on { background: var(--ink); color: var(--volt); }
.frame { position: relative; border: var(--bw) solid var(--ink); box-shadow: var(--shadow); background: var(--paper-2); margin: 0 8px 8px 0; display: grid; place-items: center; }
.frame.story { aspect-ratio: 9 / 16; max-height: 54vh; margin-inline: auto; }
.frame.post { aspect-ratio: 4 / 5; max-height: 54vh; margin-inline: auto; }
.frame img { width: 100%; height: 100%; object-fit: contain; display: block; }
.loading { position: absolute; font-weight: 700; text-transform: uppercase; }
.actions { display: grid; gap: 12px; align-content: start; }
.actions .btn { width: 100%; justify-content: flex-start; }
.big { min-height: 60px; font-size: 1.4rem; }
.hint { font-size: 13px; color: #444; }
.msg { font-size: 1.25rem; line-height: 1.15; padding: 10px 12px; background: var(--yellow); border: var(--bw) solid var(--ink); transform: rotate(-1deg); }
@media (min-width: 1024px) {
  .share { grid-template-columns: minmax(0, 1fr) 340px; gap: 40px; align-items: start; }
  .frame.story, .frame.post { max-height: 56vh; }
}
</style>
