<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import KiteRider from './KiteRider.vue'
import BeachWaiter from './BeachWaiter.vue'
import SadWalker from './SadWalker.vue'
import RainWalker from './RainWalker.vue'
import Sleeper from './Sleeper.vue'
import MateSitters from './MateSitters.vue'
import GroundKite from './GroundKite.vue'
import KiteFlyer from './KiteFlyer.vue'
import Dog from './Dog.vue'
import Palm from './Palm.vue'
import WindStreaks from './WindStreaks.vue'

// mood = assessment.key: ok | strong | almost | crossed | calm | rain | night | loading | error
const props = defineProps({ mood: { type: String, default: '' } })
const scene = computed(() => (['ok', 'strong', 'almost', 'crossed', 'calm', 'rain', 'night'].includes(props.mood) ? props.mood : ''))

// kind: cross (cruza la pantalla) | still (se queda un rato) · h: alto en px · ms: tiempo en pantalla (still)
const R = (variant, dur, h = 120) => ({ c: KiteRider, p: { variant }, kind: 'cross', dur, h })
const POOLS = {
  ok: [R('ride', 18), R('ride', 14), { c: KiteFlyer, p: {}, kind: 'still', ms: 15000, h: 190 }, { c: MateSitters, kind: 'still', ms: 16000, h: 120 }, { c: Dog, kind: 'cross', dur: 11, h: 64 }],
  strong: [R('jump', 12, 140), R('jump', 10, 140), { c: KiteFlyer, p: {}, kind: 'still', ms: 14000, h: 190 }, { c: Dog, kind: 'cross', dur: 8, h: 64 }],
  almost: [{ c: BeachWaiter, kind: 'cross', dur: 18, h: 130 }, { c: MateSitters, kind: 'still', ms: 16000, h: 120 }, { c: GroundKite, kind: 'still', ms: 12000, h: 52 }, { c: Dog, kind: 'cross', dur: 12, h: 64 }],
  crossed: [R('confused', 20), { c: KiteFlyer, p: { wild: true }, kind: 'still', ms: 14000, h: 190 }, { c: BeachWaiter, kind: 'cross', dur: 18, h: 130 }, { c: Dog, kind: 'cross', dur: 9, h: 64 }],
  calm: [{ c: SadWalker, kind: 'cross', dur: 26, h: 120 }, { c: MateSitters, kind: 'still', ms: 18000, h: 120 }, { c: GroundKite, kind: 'still', ms: 14000, h: 52 }, { c: Dog, kind: 'cross', dur: 16, h: 64 }],
  rain: [{ c: RainWalker, kind: 'cross', dur: 22, h: 124 }, { c: MateSitters, kind: 'still', ms: 16000, h: 120 }, { c: GroundKite, kind: 'still', ms: 12000, h: 52 }],
  night: [{ c: Sleeper, kind: 'still', ms: 20000, h: 90 }, { c: GroundKite, kind: 'still', ms: 14000, h: 52 }],
}

// Un solo personaje por vez, elegido al azar según el viento, y siempre uno distinto al anterior.
const cur = ref(null)
const last = shallowRef(null)
let uid = 0
let timer = 0
const clear = () => clearTimeout(timer)
const rand = (a, b) => a + Math.random() * (b - a)

const pick = () => {
  const pool = POOLS[scene.value]
  if (!pool) return
  const options = pool.length > 1 ? pool.filter((x) => x !== last.value) : pool
  const def = options[Math.floor(Math.random() * options.length)]
  last.value = def
  const style = { '--h': `${def.h}px` }
  if (def.kind === 'cross') style['--dur'] = `${def.dur}s`
  else style.left = `${rand(8, 62)}vw`
  cur.value = { key: ++uid, ...def, style }
  if (def.kind === 'still') timer = setTimeout(leave, def.ms)
}
const leave = () => {
  cur.value = null
  timer = setTimeout(pick, rand(1500, 4500))
}
const onEnd = () => leave() // terminó de cruzar la pantalla

watch(
  scene,
  (s) => {
    clear()
    cur.value = null
    last.value = null
    if (s) timer = setTimeout(pick, 600)
  },
  { immediate: false }
)
onMounted(() => scene.value && (timer = setTimeout(pick, 800)))
onBeforeUnmount(clear)
</script>

<template>
  <div class="mood" aria-hidden="true" inert>
    <WindStreaks />
    <!-- Palmeras: siempre presentes, se mueven con el viento real y el scroll -->
    <div class="palmwrap pl"><Palm /></div>
    <div class="palmwrap pr"><Palm flip /></div>

    <div v-if="scene === 'rain'" class="rain"></div>
    <template v-if="scene === 'night'">
      <div class="moon"><svg viewBox="0 0 60 60"><path d="M40 6a24 24 0 1 0 14 38A20 20 0 0 1 40 6z" fill="#c9ff2f" stroke="#0b0b0b" stroke-width="3" stroke-linejoin="round" /></svg></div>
      <span class="star st1">+</span><span class="star st2">+</span><span class="star st3">+</span>
    </template>

    <Transition name="fx" type="transition">
      <div v-if="cur" :key="cur.key" class="actor" :class="cur.kind" :style="cur.style" @animationend.self="onEnd">
        <component :is="cur.c" v-bind="cur.p" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Capa decorativa: bastante más tenue que la UI y totalmente inerte */
.mood { position: fixed; inset: 0; z-index: 44; pointer-events: none; user-select: none; -webkit-user-select: none; overflow: hidden; opacity: 0.36; filter: saturate(0.7); }
.mood :deep(*) { pointer-events: none; -webkit-user-drag: none; }
.palmwrap { position: absolute; bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px) - 6px); height: 240px; }
.pl { left: -30px; }
.pr { right: -34px; height: 190px; }
.actor { position: absolute; bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px)); height: var(--h); will-change: transform; }
.actor :deep(svg) { filter: drop-shadow(3px 3px 0 rgba(11, 11, 11, 0.18)); }
.cross { left: 0; transform: translateX(-260px); animation: cross var(--dur) linear forwards; }
@keyframes cross { from { transform: translateX(-260px); } to { transform: translateX(calc(100vw + 40px)); } }
.rain { position: absolute; inset: 0; opacity: 0.6; background-image: linear-gradient(105deg, transparent 0 46%, #0b0b0b 46% 50%, transparent 50% 100%); background-size: 22px 40px; animation: rain 0.45s linear infinite; }
@keyframes rain { to { background-position: -10px 40px; } }
.moon { position: absolute; right: 22vw; bottom: calc(var(--tabbar-h) + 120px); width: 54px; animation: drift 9s ease-in-out infinite alternate; }
@keyframes drift { to { transform: translate(-30px, 12px) rotate(-8deg); } }
.star { position: absolute; font: 700 26px var(--font-mono); animation: twinkle 1.6s steps(2) infinite; bottom: calc(var(--tabbar-h) + 150px); }
.st1 { right: 34vw; } .st2 { right: 16vw; bottom: calc(var(--tabbar-h) + 110px); animation-delay: 0.5s; } .st3 { right: 46vw; bottom: calc(var(--tabbar-h) + 130px); animation-delay: 1s; }
@keyframes twinkle { 50% { opacity: 0.2; } }
.fx-enter-active, .fx-leave-active { transition: opacity 0.4s; }
.fx-enter-from, .fx-leave-to { opacity: 0; }

@media (max-width: 1023px) {
  .palmwrap { height: 104px; }
  .pr { height: 84px; }
  .actor { transform-origin: bottom left; scale: 0.62; }
}
@media (prefers-reduced-motion: reduce) { .actor { display: none; } }
</style>
