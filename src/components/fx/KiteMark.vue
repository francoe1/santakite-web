<script setup>
// Isotipo de marca: kite LEI inclinado sobre fondo negro.
import Kite from './Kite.vue'
import { VOLT } from '@/utils/kiteShape'
</script>

<template>
  <svg viewBox="0 0 40 40" aria-hidden="true">
    <rect width="40" height="40" fill="#0b0b0b" />
    <g transform="translate(20 22.5) rotate(-10) scale(.1) translate(-150 -54)">
      <Kite :struts="[0.34, 0.66]" :panel-colors="[VOLT, VOLT, VOLT]" :bridle="false" :tube-w="22" />
    </g>
  </svg>
</template>
