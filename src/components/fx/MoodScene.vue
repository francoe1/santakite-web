<script setup>
import { computed } from 'vue'
import KiteRider from './KiteRider.vue'
import BeachWaiter from './BeachWaiter.vue'
import SadWalker from './SadWalker.vue'
import Tumbleweed from './Tumbleweed.vue'
import RainWalker from './RainWalker.vue'
import Sleeper from './Sleeper.vue'
import Icon from '../ui/Icon.vue'
import { useFx } from '@/composables/useFx'

// mood = assessment.key: ok | strong | almost | crossed | calm | rain | night | loading | error
const props = defineProps({ mood: { type: String, default: '' } })
const { enabled, toggle } = useFx()

const scene = computed(() => (['ok', 'strong', 'almost', 'crossed', 'calm', 'rain', 'night'].includes(props.mood) ? props.mood : ''))
</script>

<template>
  <div v-if="enabled && scene" class="fx" aria-hidden="true">
    <Transition name="fx" mode="out-in">
      <div :key="scene" class="scene">
        <!-- sopla: navega -->
        <template v-if="scene === 'ok'">
          <div class="actor cross" style="--dur: 22s; --delay: 1s; --h: 140px"><KiteRider variant="ride" /></div>
        </template>
        <!-- sopla fuerte: salta -->
        <template v-else-if="scene === 'strong'">
          <div class="actor cross" style="--dur: 14s; --delay: 0.5s; --h: 160px"><KiteRider variant="jump" /></div>
        </template>
        <!-- casi: espera -->
        <template v-else-if="scene === 'almost'">
          <div class="actor pace" style="--h: 150px"><BeachWaiter /></div>
        </template>
        <!-- viento cruzado: kite descontrolado -->
        <template v-else-if="scene === 'crossed'">
          <div class="actor cross" style="--dur: 26s; --delay: 1s; --h: 144px"><KiteRider variant="confused" /></div>
        </template>
        <!-- no sopla: bolso al hombro y un yuyo rodando -->
        <template v-else-if="scene === 'calm'">
          <div class="actor cross" style="--dur: 34s; --delay: 2s; --h: 140px"><SadWalker /></div>
          <div class="actor cross" style="--dur: 15s; --delay: 7s; --h: 44px"><Tumbleweed /></div>
        </template>
        <!-- lluvia -->
        <template v-else-if="scene === 'rain'">
          <div class="rain"></div>
          <div class="actor cross" style="--dur: 26s; --delay: 1s; --h: 144px"><RainWalker /></div>
        </template>
        <!-- noche -->
        <template v-else-if="scene === 'night'">
          <div class="moon"><svg viewBox="0 0 60 60"><path d="M40 6a24 24 0 1 0 14 38A20 20 0 0 1 40 6z" fill="#c9ff2f" stroke="#0b0b0b" stroke-width="3" stroke-linejoin="round" /></svg></div>
          <span class="star st1">+</span><span class="star st2">+</span><span class="star st3">+</span>
          <div class="actor rest" style="--h: 110px"><Sleeper /></div>
        </template>
      </div>
    </Transition>
    <button type="button" class="off" aria-label="Ocultar animaciones" title="Ocultar animaciones" @click="toggle"><Icon name="close" :size="14" /></button>
  </div>
</template>

<style scoped>
.fx {
  position: fixed; left: 0; right: 0; z-index: 45; pointer-events: none; overflow: hidden;
  bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px));
  height: 175px;
}
.scene { position: absolute; inset: 0; }
.actor { position: absolute; bottom: 0; height: var(--h); will-change: transform; }
.actor :deep(svg) { filter: drop-shadow(3px 3px 0 rgba(11, 11, 11, 0.18)); }
.cross { left: 0; transform: translateX(-260px); animation: cross var(--dur) linear var(--delay) infinite; }
@keyframes cross { 0% { transform: translateX(-260px); } 62%, 100% { transform: translateX(calc(100vw + 40px)); } }
.pace { left: 6vw; animation: pace 14s linear infinite; }
@keyframes pace { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(min(46vw, 520px)); } }
.rest { right: 4vw; }
.rain {
  position: absolute; inset: 0; opacity: 0.45;
  background-image: linear-gradient(105deg, transparent 0 46%, #0b0b0b 46% 50%, transparent 50% 100%);
  background-size: 22px 40px; animation: rain 0.45s linear infinite;
}
@keyframes rain { to { background-position: -10px 40px; } }
.moon { position: absolute; right: 12vw; top: 10px; width: 54px; animation: drift 9s ease-in-out infinite alternate; }
@keyframes drift { to { transform: translate(-30px, 12px) rotate(-8deg); } }
.star { position: absolute; font: 700 26px var(--font-mono); animation: twinkle 1.6s steps(2) infinite; }
.st1 { right: 28vw; top: 30px; } .st2 { right: 6vw; top: 60px; animation-delay: 0.5s; } .st3 { right: 40vw; top: 70px; animation-delay: 1s; }
@keyframes twinkle { 50% { opacity: 0.2; } }
.off {
  position: absolute; right: 8px; top: 8px; width: 28px; height: 28px; display: grid; place-items: center; pointer-events: auto;
  background: var(--paper); border: var(--bw) solid var(--ink); opacity: 0.85;
}
.off:hover { background: var(--volt); opacity: 1; }
.fx-enter-active, .fx-leave-active { transition: opacity 0.35s; }
.fx-enter-from, .fx-leave-to { opacity: 0; }

@media (max-width: 1023px) {
  .fx { height: 110px; }
  .actor { transform-origin: bottom left; scale: 0.78; }
}
@media (prefers-reduced-motion: reduce) { .fx { display: none; } }
</style>
