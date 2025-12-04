<template>
  <div v-if="day" class="overlay" @click.self="$emit('close')">
    <div class="overlay-card">
      <div class="overlay-head">
        <div>
          <p class="eyebrow">Detalle por hora</p>
          <h3>{{ formatDate(day.date) }}</h3>
          <p class="muted small">
            {{ detailText }}
          </p>
        </div>
        <button type="button" class="close" @click="$emit('close')">✕</button>
      </div>

      <div v-if="!isCompactLayout" class="hourly-table" role="table">
        <div class="hour-row header" role="row">
          <div class="label-cell" role="columnheader">Hora</div>
          <div
            v-for="hour in day.hours"
            :key="`h-${hour.time}`"
            class="hour-cell time"
            :style="hourCellStyle(hour)"
            role="columnheader"
          >
            {{ hour.label }}
          </div>
        </div>

        <div class="hour-row" role="row">
          <div class="label-cell" role="rowheader">Viento (kts)</div>
          <div
            v-for="hour in day.hours"
            :key="`w-${hour.time}`"
            class="hour-cell value"
            :style="hourCellStyle(hour)"
            role="cell"
          >
            {{ hour.speedKts.toFixed(0) }}
          </div>
        </div>

        <div class="hour-row" role="row">
          <div class="label-cell" role="rowheader">Ráfagas (kts)</div>
          <div
            v-for="hour in day.hours"
            :key="`g-${hour.time}`"
            class="hour-cell value"
            :style="hourCellStyle(hour)"
            role="cell"
          >
            {{ hour.gustKts.toFixed(0) }}
          </div>
        </div>

        <div class="hour-row" role="row">
          <div class="label-cell" role="rowheader">Dirección</div>
          <div
            v-for="hour in day.hours"
            :key="`d-${hour.time}`"
            class="hour-cell direction"
            :style="hourCellStyle(hour)"
            role="cell"
          >
            <span class="arrow" :style="{ transform: `rotate(${hour.dirDeg + 180}deg)` }">↑</span>
            <span class="dir-label">{{ degToCompass(hour.dirDeg) }} ({{ hour.dirDeg }}°)</span>
          </div>
        </div>

        <div class="hour-row" role="row">
          <div class="label-cell" role="rowheader">Temperatura (°C)</div>
          <div
            v-for="hour in day.hours"
            :key="`t-${hour.time}`"
            class="hour-cell value"
            :style="hourCellStyle(hour)"
            role="cell"
          >
            <span>{{ hour.tempC !== null ? hour.tempC.toFixed(0) : '-' }}</span>
          </div>
        </div>

        <div class="hour-row" role="row">
          <div class="label-cell" role="rowheader">Lluvia (mm)</div>
          <div
            v-for="hour in day.hours"
            :key="`r-${hour.time}`"
            class="hour-cell value"
            :style="hourCellStyle(hour)"
            role="cell"
          >
            {{ hour.precipMm.toFixed(1) }}
          </div>
        </div>
      </div>

      <div v-else class="hourly-list" role="list">
        <article
          v-for="hour in day.hours"
          :key="`card-${hour.time}`"
          class="hour-card"
          :style="hourCardStyle(hour)"
          role="listitem"
        >
          <header class="hour-card__head">
            <p class="label">{{ hour.label }}</p>
            <span class="badge" :class="isPlayable(hour) ? 'badge-ok' : 'badge-warn'">
              {{ isPlayable(hour) ? 'Jugable' : 'Fuera de ventana' }}
            </span>
          </header>
          <dl class="hour-card__grid">
            <div>
              <dt>Viento</dt>
              <dd>{{ hour.speedKts.toFixed(0) }} kts</dd>
            </div>
            <div>
              <dt>Ráfaga</dt>
              <dd>{{ hour.gustKts.toFixed(0) }} kts</dd>
            </div>
            <div class="direction">
              <dt>Dirección</dt>
              <dd>
                <span class="arrow" :style="{ transform: `rotate(${hour.dirDeg + 180}deg)` }">↑</span>
                <span class="dir-label">{{ degToCompass(hour.dirDeg) }} ({{ hour.dirDeg }}°)</span>
              </dd>
            </div>
            <div>
              <dt>Temp</dt>
              <dd>{{ hour.tempC !== null ? `${hour.tempC.toFixed(0)} °C` : 'Sin dato' }}</dd>
            </div>
            <div>
              <dt>Lluvia</dt>
              <dd>{{ hour.precipMm.toFixed(1) }} mm</dd>
            </div>
          </dl>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { degToCompass } from '../../utils/wind'

const props = defineProps({
  day: {
    type: Object,
    default: null,
  },
  isCompactLayout: {
    type: Boolean,
    required: true,
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
  width: 150px;
  min-width: 150px;
  padding: 0.55rem 0.75rem;
  background: rgba(15, 23, 42, 0.9);
  color: #e2e8f0;
  font-weight: 700;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  position: sticky;
  left: 0;
  z-index: 2;
}

.hour-cell {
  min-width: 80px;
  max-width: 80px;
  border-left: 1px solid rgba(148, 163, 184, 0.12);
  padding: 0.55rem 0.35rem;
  text-align: center;
  color: #e2e8f0;
  display: grid;
  gap: 0.35rem;
  justify-items: center;
  background: rgba(15, 23, 42, 0.82);
}

.hour-row.header .hour-cell {
  font-weight: 700;
  background: rgba(15, 23, 42, 0.95);
}

.hour-cell.value {
  font-size: 1rem;
  font-weight: 800;
}

.hour-cell.direction {
  font-size: 0.85rem;
  line-height: 1.2;
}

.hour-cell .arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  background: rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-weight: 900;
}

.dir-label {
  font-size: 0.78rem;
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
