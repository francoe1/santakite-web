<script setup>
import { useSeo } from '@/composables/useSeo'
import { pickJoke } from '@/utils/jokes'

useSeo(null, { noindex: true, title: 'Página no encontrada | SantaKite' })
const joke = pickJoke('notfound', 'x')
</script>

<template>
  <main id="contenido" class="nf">
    <div class="container">
      <p class="eyebrow">Error 404</p>
      <h1>Esta página<br />no sopla</h1>
      <p class="hand joke">{{ joke }}</p>
      <router-link class="btn btn--primary" to="/">Volver al viento</router-link>
    </div>
  </main>
</template>

<style scoped>
.nf { min-height: 100vh; display: grid; align-items: center; padding: 48px 0; }
h1 { font-size: clamp(5rem, 2rem + 18vw, 16rem); margin: 18px 0; line-height: 0.85; }
.joke { font-size: 1.8rem; margin-bottom: 28px; background: var(--yellow); display: inline-block; padding: 4px 14px; transform: rotate(-1deg); border: var(--bw) solid var(--ink); }
.container > a { display: flex; width: fit-content; }
</style>
