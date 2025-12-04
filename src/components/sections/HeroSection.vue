<script setup>
import { computed, onMounted, ref } from 'vue'

const scrollTo = (id) => {
  const target = document.getElementById(id)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const currentWind = ref({ speedKts: null, dirDeg: null })

const currentDirLabel = computed(() => {
  if (currentWind.value.dirDeg === null) return ''
  return degToCompass(currentWind.value.dirDeg)
})

const degToCompass = (deg) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
  return dirs[Math.round(deg / 45) % 8]
}

onMounted(async () => {
  try {
    const url =
      'https://api.open-meteo.com/v1/gfs?latitude=-30.9085&longitude=-57.915&current=winddirection_10m,windspeed_10m&timezone=auto&windspeed_unit=kn'

    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()

    currentWind.value = {
      speedKts: data.current?.windspeed_10m ?? null,
      dirDeg: data.current?.winddirection_10m ?? null,
    }
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <section id="hero" class="section-block gradient-card overflow-hidden">
    <div class="grid gap-6 lg:grid-cols-2 lg:items-center">
      <div class="space-y-4">
        <div class="inline-flex items-center gap-2 rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs font-bold text-[var(--muted)] border border-[var(--outline)]/60">
          <span class="material-symbols-rounded text-base text-[var(--accent)]">surfing</span>
          Spot de río · Santa Ana
        </div>
        <div class="space-y-3">
          <h1 class="text-3xl md:text-4xl font-black leading-tight text-[var(--on-surface)]">
            Kitesurf libre con vibra surfer en <span class="text-[var(--accent)]">Playa 52</span>
          </h1>
          <p class="text-lg text-muted max-w-2xl">
            Amanecé con brisa limpia, armá tu cometa sobre arena suave y navegá con vista abierta al río. Zona chill con música baja, mates y comunidad que respeta el mar y el viento.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="tag">Vientos S · SE · E</span>
          <span class="tag">Zonas separadas</span>
          <span class="tag">Pronóstico GFS</span>
        </div>
        <div class="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            class="pill-button bg-[var(--accent)] text-white border-none shadow-android text-base"
            @click="scrollTo('mapa')"
          >
            <span class="material-symbols-rounded text-base">explore</span>
            Ver mapa &amp; viento
          </button>
          <a
            class="pill-button text-base"
            href="https://wa.me/543456479677"
            target="_blank"
            rel="noreferrer"
          >
            <span class="material-symbols-rounded text-base">call</span>
            Coordinar sesión
          </a>
        </div>
      </div>

      <div class="glass-card p-5 md:p-6 shadow-android flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="material-symbols-rounded text-[var(--accent)]">air</span>
            <div>
              <p class="text-sm text-muted">Viento GFS en vivo</p>
              <p class="text-lg font-extrabold">Playa 52</p>
            </div>
          </div>
          <span class="tag bg-[var(--accent)]/10 text-[var(--accent)]">Actualizado</span>
        </div>
        <div class="flex items-center gap-4">
          <div
            class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white text-2xl font-black"
            :style="currentWind.dirDeg !== null ? { transform: `rotate(${(currentWind.dirDeg + 180) % 360}deg)` } : {}"
          >
            ↑
          </div>
          <div class="space-y-1">
            <p class="text-3xl font-black leading-none">
              {{ currentWind.speedKts !== null ? `${currentWind.speedKts.toFixed(1)} kts` : 'Cargando viento…' }}
            </p>
            <p class="text-muted">
              {{
                currentWind.dirDeg !== null
                  ? `Dirección ${currentDirLabel} (${Math.round(currentWind.dirDeg)}°)`
                  : 'Midiendo dirección en Playa 52'
              }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="glass-card p-3 shadow-none">
            <p class="text-muted">Horario recomendado</p>
            <p class="text-lg font-bold">09:00 - 18:30</p>
          </div>
          <div class="glass-card p-3 shadow-none">
            <p class="text-muted">Zona segura</p>
            <p class="text-lg font-bold">Sector kites · Playas 52</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
