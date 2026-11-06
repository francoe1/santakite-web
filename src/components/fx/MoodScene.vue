<script setup>
import { computed } from 'vue'
import KiteRider from './KiteRider.vue'
import BeachWaiter from './BeachWaiter.vue'
import SadWalker from './SadWalker.vue'
import Tumbleweed from './Tumbleweed.vue'
import RainWalker from './RainWalker.vue'
import Sleeper from './Sleeper.vue'
import MateSitters from './MateSitters.vue'
import GroundKite from './GroundKite.vue'
import KiteFlyer from './KiteFlyer.vue'
import Palm from './Palm.vue'

// mood = assessment.key: ok | strong | almost | crossed | calm | rain | night | loading | error
const props = defineProps({ mood: { type: String, default: '' } })
const scene = computed(() => (['ok', 'strong', 'almost', 'crossed', 'calm', 'rain', 'night'].includes(props.mood) ? props.mood : ''))
const hasMate = computed(() => scene.value && scene.value !== 'night')
const hasFlyer = computed(() => ['ok', 'strong', 'crossed'].includes(scene.value))
const hasGroundKite = computed(() => ['almost', 'calm', 'rain', 'night'].includes(scene.value))
</script>

<template>
  <div class="mood" aria-hidden="true">
    <!-- Palmeras: siempre presentes, se mueven con el viento real -->
    <div class="palmwrap pl"><Palm /></div>
    <div class="palmwrap pr"><Palm flip /></div>

    <Transition name="fx" mode="out-in">
      <div v-if="scene" :key="scene" class="fx">
        <div class="scene">
          <!-- Playa tranquila: mate bajo la sombrilla -->
          <div v-if="hasMate" class="actor still mate" style="--h: 150px"><MateSitters /></div>
          <div v-if="hasGroundKite" class="actor still gk1" style="--h: 62px"><GroundKite /></div>

          <!-- Protagonistas según el estado del viento -->
          <div v-if="scene === 'ok'" class="actor cross" style="--dur: 22s; --delay: 1s; --h: 140px"><KiteRider variant="ride" /></div>
          <div v-else-if="scene === 'strong'" class="actor cross" style="--dur: 14s; --delay: 0.5s; --h: 160px"><KiteRider variant="jump" /></div>
          <div v-else-if="scene === 'almost'" class="actor pace" style="--h: 150px"><BeachWaiter /></div>
          <div v-else-if="scene === 'crossed'" class="actor cross" style="--dur: 26s; --delay: 1s; --h: 144px"><KiteRider variant="confused" /></div>
          <template v-else-if="scene === 'calm'">
            <div class="actor cross" style="--dur: 34s; --delay: 2s; --h: 140px"><SadWalker /></div>
            <div class="actor cross" style="--dur: 15s; --delay: 7s; --h: 44px"><Tumbleweed /></div>
          </template>
          <template v-else-if="scene === 'rain'">
            <div class="rain"></div>
            <div class="actor cross" style="--dur: 26s; --delay: 1s; --h: 144px"><RainWalker /></div>
          </template>
          <template v-else-if="scene === 'night'">
            <div class="moon"><svg viewBox="0 0 60 60"><path d="M40 6a24 24 0 1 0 14 38A20 20 0 0 1 40 6z" fill="#c9ff2f" stroke="#0b0b0b" stroke-width="3" stroke-linejoin="round" /></svg></div>
            <span class="star st1">+</span><span class="star st2">+</span><span class="star st3">+</span>
            <div class="actor rest" style="--h: 110px"><Sleeper /></div>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Kites volando alto -->
    <Transition name="fx">
      <div v-if="hasFlyer" class="sky"><div class="flyer"><KiteFlyer :wild="scene === 'crossed'" /></div></div>
    </Transition>
  </div>
</template>

<style scoped>
.mood { position: fixed; inset: 0; z-index: 44; pointer-events: none; overflow: hidden; }
.palmwrap { position: absolute; bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px) - 6px); height: 240px; }
.pl { left: -30px; }
.pr { right: -34px; height: 190px; }
.fx { position: absolute; left: 0; right: 0; bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px)); height: 175px; overflow: hidden; }
.scene { position: absolute; inset: 0; }
.actor { position: absolute; bottom: 0; height: var(--h); will-change: transform; }
.actor :deep(svg) { filter: drop-shadow(3px 3px 0 rgba(11, 11, 11, 0.18)); }
.cross { left: 0; transform: translateX(-260px); animation: cross var(--dur) linear var(--delay) infinite; }
@keyframes cross { 0% { transform: translateX(-260px); } 62%, 100% { transform: translateX(calc(100vw + 40px)); } }
.pace { left: 20vw; animation: pace 14s linear infinite; }
@keyframes pace { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(min(40vw, 480px)); } }
.rest { right: 12vw; }
.still.mate { right: 300px; }
.still.gk1 { right: 560px; }
.rain { position: absolute; inset: 0; opacity: 0.45; background-image: linear-gradient(105deg, transparent 0 46%, #0b0b0b 46% 50%, transparent 50% 100%); background-size: 22px 40px; animation: rain 0.45s linear infinite; }
@keyframes rain { to { background-position: -10px 40px; } }
.moon { position: absolute; right: 22vw; top: 10px; width: 54px; animation: drift 9s ease-in-out infinite alternate; }
@keyframes drift { to { transform: translate(-30px, 12px) rotate(-8deg); } }
.star { position: absolute; font: 700 26px var(--font-mono); animation: twinkle 1.6s steps(2) infinite; }
.st1 { right: 34vw; top: 30px; } .st2 { right: 16vw; top: 60px; animation-delay: 0.5s; } .st3 { right: 46vw; top: 70px; animation-delay: 1s; }
@keyframes twinkle { 50% { opacity: 0.2; } }

/* kite volando: a la derecha, sobre la playa */
.sky { position: absolute; right: 110px; bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px)); height: 230px; width: 120px; }
.flyer { height: 100%; filter: drop-shadow(3px 3px 0 rgba(11, 11, 11, 0.16)); }

.fx-enter-active, .fx-leave-active { transition: opacity 0.35s; }
.fx-enter-from, .fx-leave-to { opacity: 0; }

@media (max-width: 1023px) {
  .palmwrap { height: 104px; }
  .pr { height: 84px; }
  .fx { height: 100px; }
  .actor { transform-origin: bottom left; scale: 0.58; }
  .still.mate { right: auto; left: 44px; }
  .still.gk1 { right: auto; left: 210px; }
  .sky { height: 140px; width: 76px; right: 26px; }
}
@media (prefers-reduced-motion: reduce) { .fx, .sky { display: none; } }
</style>
