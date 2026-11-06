<script setup>
defineProps({ name: { type: String, required: true }, size: { type: [Number, String], default: 20 } })

// Iconos de trazo 24x24 (estilo lineal consistente)
const paths = {
  wind: 'M3 9h10a3 3 0 1 0-3-3M3 15h14a3 3 0 1 1-3 3M3 12h7',
  pin: 'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21zM12 12a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5z',
  map: 'M9 4 3 6.500v13.500l6-2.500 6 2.500 6-2.500V4l-6 2.500L9 4zM9 4v13.500M15 6.500V20',
  calendar: 'M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7zM4 10h16M8 3v4M16 3v4',
  shield: 'M12 3 4.500 6v5.500c0 4.600 3.200 8.200 7.500 9.500 4.300-1.300 7.500-4.900 7.500-9.500V6L12 3zM8.800 12l2.200 2.200 4.200-4.400',
  chat: 'M20 12a8 8 0 0 1-11.800 7L4 20l1.200-4A8 8 0 1 1 20 12zM9 11h6M9 14h4',
  chevron: 'm6 9 6 6 6-6',
  close: 'M6 6l12 12M18 6 6 18',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400',
  rain: 'M7 16a4 4 0 0 1-.5-7.900A5.500 5.500 0 0 1 17 7.500 4.500 4.500 0 0 1 17 16M8 19l-1 2M12 19l-1 2M16 19l-1 2',
  thermo: 'M14 14.800V5a2 2 0 0 0-4 0v9.800a4 4 0 1 0 4 0z',
  gust: 'M3 8h9a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h6',
  copy: 'M9 9h10v11H9zM5 15V4h10',
  route: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 17h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6',
  refresh: 'M20 11a8 8 0 0 0-14.500-4M4 4v4h4M4 13a8 8 0 0 0 14.500 4M20 20v-4h-4',
  check: 'm5 12.500 4.500 4.500L19 7.500',
  alert: 'M12 4 2.500 20h19L12 4zM12 10v4.500M12 17.500v.01',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  layers: 'm12 3 9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  waves: 'M2 8c2.500 0 2.500 2 5 2s2.500-2 5-2 2.500 2 5 2 2.500-2 5-2M2 14c2.500 0 2.500 2 5 2s2.500-2 5-2 2.500 2 5 2 2.500-2 5-2',
  share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13',
  download: 'M12 3v12M7 10l5 5 5-5M4 20h16',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7z',
  menu: 'M4 7h16M4 12h16M4 17h16',
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="square"
    stroke-linejoin="miter"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[name]" />
  </svg>
</template>
