<script setup>
defineProps({
  highlights: { type: Array, default: () => [] },
})
</script>

<template>
  <section id="spot" class="section-block">
    <div class="section-header">
      <div>
        <p class="section-eyebrow">El spot</p>
        <h2 class="section-title">Playa 52 en Santa Ana</h2>
        <p class="section-description">Zona abierta del río Uruguay, con arena amplia para armar y lanzar lejos de bañistas.</p>
      </div>
      <div class="tag bg-[var(--accent)]/10 text-[var(--accent)]">-30.9085, -57.9150</div>
    </div>

    <div class="grid gap-3 md:gap-4 md:grid-cols-3">
      <article
        v-for="item in highlights"
        :key="item.title"
        class="glass-card p-4 md:p-5 flex flex-col gap-2 hover:-translate-y-0.5 transition"
      >
        <h3 class="text-lg font-bold">{{ item.title }}</h3>
        <p class="text-muted text-sm leading-relaxed">{{ item.description }}</p>
      </article>
    </div>

    <div class="glass-card p-4 md:p-5 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-2 text-[var(--on-surface)] font-semibold">
        <span class="material-symbols-rounded text-[var(--accent)]">location_on</span>
        Playa 52 – Santa Ana, Entre Ríos
      </div>
      <p class="text-muted text-sm">Referencia: acceso junto a la construcción cercana · ideal en S, SE o E.</p>
    </div>
  </section>
</template>
