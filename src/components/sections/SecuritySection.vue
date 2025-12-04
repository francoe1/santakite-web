<script setup>
defineProps({
  security: {
    type: Object,
    default: () => ({ steps: [], intro: '' }),
  },
})
</script>

<template>
  <section id="seguridad" class="section-block">
    <div class="section-header">
      <div>
        <p class="section-eyebrow">Seguridad y protocolo</p>
        <h2 class="section-title">Checklist claro para usar el spot</h2>
        <p class="section-description">Indicaciones básicas para convivir con bañistas y mantener la zona de kites ordenada.</p>
      </div>
      <span class="tag bg-accent2-15 text-[var(--accent-2)]">Revisar antes de navegar</span>
    </div>

    <div class="grid gap-3 md:grid-cols-3">
      <article
        v-for="step in security.steps"
        :key="step.title"
        class="glass-card p-4 md:p-5 space-y-3 border border-outline-60 hover:-translate-y-0.5 transition"
      >
        <h3 class="text-lg font-bold flex items-center gap-2">
          <span class="material-symbols-rounded text-[var(--accent)]">task_alt</span>
          {{ step.title }}
        </h3>
        <ul class="grid gap-2 text-sm text-muted list-disc pl-5">
          <li v-for="item in step.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>

    <div class="glass-card p-4 md:p-5 text-sm text-[var(--on-surface)] flex items-center gap-3">
      <span class="material-symbols-rounded text-[var(--accent)]">shield</span>
      {{ security.intro }}
    </div>
  </section>
</template>
