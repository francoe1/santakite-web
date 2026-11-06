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
.strip { display: flex; align-items: flex-end; gap: 3px; height: 48px; }
.cell { position: relative; flex: 1; height: 100%; display: flex; align-items: flex-end; min-width: 0; }
.cell i { display: block; width: 100%; background: #4a4a4a; }
.cell.night i { background: #2b2b2b; }
.cell.past { opacity: 0.4; }
.cell.now::after { content: ''; position: absolute; inset: -4px -2px; border: 2px solid var(--yellow); }
.lv1 i { background: #6d8a14; } .lv2 i { background: #93bb1b; } .lv3 i { background: #b0e020; } .lv4 i { background: var(--volt); }
</style>
