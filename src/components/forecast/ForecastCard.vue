<template>
  <button class="forecast-card" type="button" @click="$emit('select', day)">
    <div class="forecast-date">{{ formatDate(day.date) }}</div>
    <div class="muted small">Viento medio: <strong>{{ day.avgWindKts.toFixed(0) }}</strong> kts</div>
    <div class="muted small">Dirección principal: <strong>{{ degToCompass(day.mainDirDeg) }}</strong> ({{ day.mainDirDeg }}°)</div>
    <div class="muted small">Ventana jugable: <strong>{{ day.playableCount }}</strong> hs</div>
    <div class="muted small">Ráfaga máxima: <strong>{{ day.maxGustKts.toFixed(0) }}</strong> kts</div>
    <div class="muted small">Lluvia estimada: <strong>{{ day.totalRain.toFixed(1) }}</strong> mm</div>
    <div class="muted small">
      <span v-if="day.stars > 0" class="stars" :aria-label="`Mejor ventana ${day.stars} estrellas`" role="img">
        {{ '★'.repeat(day.stars) }}
      </span>
      <span v-else>Sin ventana marcada</span>
    </div>
    <div class="badge" :class="classification.className">{{ classification.label }}</div>
    <div class="muted tiny">
      Mejor hora:
      <template v-if="day.bestHour">
        <strong>{{ day.bestHour.label }}</strong>
        · {{ day.bestHour.speedKts.toFixed(0) }} kts · {{ degToCompass(day.bestHour.dirDeg) }} ({{ day.bestHour.dirDeg }}°)
        · ráfaga {{ day.bestHour.gustKts.toFixed(0) }} kts · lluvia {{ day.bestHour.precipMm.toFixed(1) }} mm
      </template>
      <template v-else>Sin datos</template>
    </div>
  </button>
</template>

<script setup>
import { degToCompass } from '../../utils/wind'

const props = defineProps({
  day: {
    type: Object,
    required: true,
  },
  classification: {
    type: Object,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
})

defineEmits(['select'])
</script>

<style scoped>
.forecast-card {
  border: none;
  text-align: left;
  padding: 0.9rem;

  border: 1px solid rgba(125, 242, 221, 0.2);
  background: linear-gradient(160deg, rgba(5, 22, 43, 0.7), rgba(6, 28, 51, 0.9));
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  cursor: pointer;
  color: #e2e8f0;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.forecast-card:hover,
.forecast-card:focus-visible {
  border-color: rgba(125, 242, 221, 0.55);
  transform: translateY(-2px);

  outline: none;
}

.forecast-date {
  font-weight: 700;
}

.muted {
  color: #cbd5e1;
}

.small {
  font-size: 0.9rem;
}

.tiny {
  font-size: 0.8rem;
}

.badge {
  align-self: flex-start;
  padding: 0.3rem 0.75rem;

  font-weight: 700;
  font-size: 0.85rem;
}

.badge-ok {
  background: rgba(94, 234, 212, 0.2);
  color: #5eead4;
  border: 1px solid rgba(94, 234, 212, 0.35);
}

.badge-warn {
  background: rgba(234, 179, 8, 0.2);
  color: #eab308;
  border: 1px solid rgba(234, 179, 8, 0.35);
}

.badge-bad {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.stars {
  color: #fbbf24;
  letter-spacing: 3px;
}
</style>
