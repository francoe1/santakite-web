<script setup>
import { scrollToId } from '@/composables/useScrollSpy'

defineProps({ navItems: { type: Array, default: () => [] }, spots: { type: Array, default: () => [] } })
defineEmits(['select-spot'])
</script>

<template>
  <footer class="footer">
    <div class="container grid">
      <div class="about">
        <p class="wordmark">Santa<b>Kite</b></p>
        <p class="soft">Kitesurf sobre el Río Uruguay y el lago de Salto Grande. Información de viento, zonas y seguridad para navegar mejor.</p>
      </div>
      <div>
        <h4>Explorar</h4>
        <ul>
          <li v-for="n in navItems" :key="n.id">
            <a :href="`#${n.id}`" @click.prevent="scrollToId(n.id)">{{ n.label }}</a>
          </li>
        </ul>
      </div>
      <div>
        <h4>Spots</h4>
        <ul>
          <li v-for="s in spots" :key="s.id">
            <button type="button" @click="$emit('select-spot', s.id); scrollToId('hoy')">{{ s.name }}</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="container legal">
      <p>Datos de viento: modelo GFS vía Open-Meteo. Son pronósticos: confirmá siempre las condiciones reales en la orilla.</p>
      <p>© {{ new Date().getFullYear() }} SantaKite</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--ink-950);
  color: var(--text-inv);
  padding: 56px 0 24px;
  border-top: 1px solid var(--ink-line);
}
.grid {
  display: grid;
  gap: 32px;
  grid-template-columns: 1fr 1fr;
}
.about {
  grid-column: 1 / -1;
  max-width: 44ch;
}
.wordmark {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}
.wordmark b {
  color: var(--sun-500);
  font-weight: 800;
}
.soft {
  color: var(--text-inv-soft);
  margin-top: 8px;
}
h4 {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-inv-soft);
  margin-bottom: 14px;
  font-weight: 700;
}
li {
  margin-bottom: 8px;
}
li a,
li button {
  color: var(--text-inv);
  opacity: 0.9;
  min-height: 32px;
}
li a:hover,
li button:hover {
  color: var(--sun-500);
}
.legal {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--ink-line);
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: var(--text-inv-soft);
}
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 2fr 1fr 1fr;
  }
  .about {
    grid-column: auto;
  }
  .legal {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
