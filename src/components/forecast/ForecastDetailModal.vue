<template>
  <div v-if="day" class="overlay" @click.self="$emit('close')">
    <div class="overlay-card">
      <div class="overlay-head">
        <div>
          <p class="eyebrow">Detalle por hora</p>
          <h3>{{ formatDate(day.date, true) }}</h3>
          <div>
            <label style="margin-right: 10px;">
              <input type="checkbox" v-model="filterBySunLight" />
              <span style="margin-left: 4px;">Filtrar horas con luz solar</span>
            </label>
            <br></br>
            <label>
              <input type="checkbox" v-model="filterByPlayables" />
              <span style="margin-left: 4px;">Filtrar horas navegables</span>
            </label>
          </div>
          <p class="muted small">
            {{ detailText }}
          </p>
        </div>
        <button type="button" class="close" @click="$emit('close')">✕</button>
      </div>

      <div class="hourly-table" role="table">
        <div class="hour-row header" role="row">
          <div class="label-cell" role="columnheader">Hora</div>
          <div v-for="hour in hours" :key="`h-${hour.time}`" class="hour-cell time" :style="hourCellStyle(hour)"
            role="columnheader">
            {{ hour.label }}h
          </div>
        </div>

        <div class="hour-row" role="row">
          <div class="label-cell" role="rowheader">Viento (kts)</div>
          <div v-for="hour in hours" :key="`w-${hour.time}`" class="hour-cell value" :style="hourCellStyle(hour)"
            role="cell">
            {{ hour.speedKts.toFixed(0) }}
          </div>
        </div>

        <div class="hour-row" role="row">
          <div class="label-cell" role="rowheader">Ráfagas (kts)</div>
          <div v-for="hour in hours" :key="`g-${hour.time}`" class="hour-cell value" :style="hourCellStyle(hour)"
            role="cell">
            {{ hour.gustKts.toFixed(0) }}
          </div>
        </div>

        <div class="hour-row" role="row">
          <div class="label-cell" role="rowheader">Dirección</div>
          <div v-for="hour in hours" :key="`d-${hour.time}`" class="hour-cell direction" :style="hourCellStyle(hour)"
            role="cell" :title="`${degToCompass(hour.dirDeg)} (${hour.dirDeg}°)`">
            <span class="arrow" :style="{ transform: `rotate(${hour.dirDegVisual}deg)` }">↑</span>
          </div>
        </div>

        <div class="hour-row" role="row">
          <div class="label-cell" role="rowheader">Temp (°C)</div>
          <div v-for="hour in hours" :key="`t-${hour.time}`" class="hour-cell value" :style="hourCellStyle(hour)"
            role="cell">
            <span>{{ hour.tempC !== null ? hour.tempC.toFixed(0) : '-' }}</span>
          </div>
        </div>

        <div class="hour-row" role="row">
          <div class="label-cell" role="rowheader">Lluvia (mm)</div>
          <div v-for="hour in hours" :key="`r-${hour.time}`" class="hour-cell value" :style="hourCellStyle(hour)"
            role="cell">
            {{ hour.precipMm.toFixed(1) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { degToCompass } from '../../utils/wind'
import { computed, ref } from 'vue'

const filterBySunLight = ref(true)
const filterByPlayables = ref(false)

const props = defineProps({
  day: {
    type: Object,
    default: null,
  },
  hourCellStyle: {
    type: Function,
    required: true,
  },
  hourCardStyle: {
    type: Function,
    required: true,
  },
  isPlayable: {
    type: Function,
    required: true,
  },
  formatDate: {
    type: Function,
    required: true,
  },
  detailText: {
    type: String,
    required: true,
  },
  hasSunLight: {
    type: Function,
    required: true,
  },
  isPlayablePercent: {
    type: Function,
    required: true,
  },
})

const hours = computed(() => {
  if (!props.day) return []

  let hours = props.day.hours;

  if (filterBySunLight.value) {
    hours = hours.filter(props.hasSunLight)
  }

  if (filterByPlayables.value) {
    hours = hours.filter(props.isPlayable)
  }

  return hours
})

defineEmits(['close'])
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1200;
  overflow-y: auto;
}

.overlay-card {
  background: #0b1222;
  border: 1px solid rgba(148, 163, 184, 0.25);

  padding: 1.25rem;
  width: min(1040px, 100%);
  max-height: 90vh;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #e5f3ff;
}

.overlay-head {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}

.close {
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;

  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  color: #94a3b8;
}

.muted {
  color: #cbd5e1;
}

.small {
  font-size: 0.9rem;
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

.hourly-table {
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-x: auto;
  border: 1px solid rgba(148, 163, 184, 0.2);

  position: relative;
}

.hourly-table {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  user-select: none;
}

.hourly-table::-webkit-scrollbar {
  height: 6px;
}

.hourly-table::-webkit-scrollbar-track {
  background: transparent;
}

.hourly-table::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.hour-row {
  display: flex;
  gap: 0;
  min-width: fit-content;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}

.hour-row:last-child {
  border-bottom: none;
}

.label-cell {
  width: 100px;
  min-width: 100px;
  padding: 0.1rem 0.4rem;
  background: rgba(15, 23, 42);
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  position: sticky;
  left: 0;
  z-index: 2;
}

.hour-cell {
  min-width: 40px;
  max-width: 40px;
  border-left: 1px solid rgba(148, 163, 184, 0.12);
  text-align: center;
  color: #e2e8f0;
  display: grid;
  gap: 0.35rem;
  justify-items: center;
  align-items: center;
  background: rgba(15, 23, 42);
}

.hour-row.header .hour-cell {
  font-weight: 400;
  background: rgba(15, 23, 42) !important;
}

.hour-cell.value {
  font-size: .85rem;
  font-weight: 400;
}

.hour-cell .arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  font-weight: 900;
}

.dir-label {
  font-size: 0.6rem;
}

.hourly-list {
  display: grid;
  gap: 0.75rem;
}

.hour-card {
  border: 1px solid rgba(148, 163, 184, 0.24);
  padding: 0.75rem 0.85rem;
  display: grid;
  gap: 0.6rem;
  color: #e5f3ff;
}

.hour-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
}

.hour-card__head .label {
  font-weight: 800;
  color: #f1f5f9;
}

.hour-card__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem 0.75rem;
}

.hour-card__grid dt {
  font-size: 0.78rem;
  color: #cbd5e1;
  margin-bottom: 0.15rem;
}

.hour-card__grid dd {
  margin: 0;
  font-weight: 700;
  color: #e5f3ff;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.hour-card__grid .direction {
  grid-column: span 2;
}

@media (max-width: 720px) {
  .overlay {
    padding: 0.85rem;
  }

  .overlay-card {
    padding: 1rem;
    width: 100%;
  }

  .overlay-head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 520px) {
  .hour-card__grid {
    grid-template-columns: 1fr;
  }
}
</style>
