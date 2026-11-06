<script setup>
import { computed } from 'vue'
const props = defineProps({
  day: { type: Object, required: true },
  nowHour: { type: Number, default: null },
  from: { type: Number, default: 6 },
  to: { type: Number, default: 21 },
})

const SCALE = 30
const cells = computed(() => {
  const out = []
  for (let h = props.from; h <= props.to; h++) {
    const hour = props.day.hours.find((x) => x.hourNum === h)
    if (!hour) {
      out.push({ h, empty: true })
      continue
    }
    out.push({
      h,
      level: hour.assess.level,
      sun: hour.assess.sun,
      height: Math.max(8, Math.min(100, ((hour.speedKts ?? 0) / SCALE) * 100)),
      speed: Math.round(hour.speedKts ?? 0),
      past: props.nowHour !== null && h < props.nowHour,
      now: props.nowHour === h,
    })
  }
  return out
})
</script>

<template>
  <div class="strip" aria-hidden="true">
    <span
      v-for="c in cells"
      :key="c.h"
      class="cell"
      :class="[`lv${c.level ?? 0}`, { night: !c.sun, past: c.past, now: c.now }]"
      :title="c.empty ? '' : `${c.h}:00 · ${c.speed} kts`"
    >
      <i v-if="!c.empty" :style="{ height: c.height + '%' }"></i>
    </span>
  </div>
</template>

<style scoped>
.strip {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 44px;
}
.cell {
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  min-width: 0;
}
.cell i {
  display: block;
  width: 100%;
  border-radius: 3px 3px 1px 1px;
  background: rgba(157, 185, 198, 0.35);
}
.cell.night i { background: rgba(157, 185, 198, 0.14); }
.cell.past { opacity: 0.45; }
.cell.now::after {
  content: '';
  position: absolute;
  inset: -3px -2px -3px;
  border: 1.5px solid var(--sun-500);
  border-radius: 4px;
}
.lv1 i { background: #8fd8b8; }
.lv2 i { background: #4cc590; }
.lv3 i { background: #17a56f; }
.lv4 i { background: #0f8758; box-shadow: 0 0 10px rgba(23, 165, 111, 0.6); }
</style>
