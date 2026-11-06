import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/Index.vue'
import spots from '@/data/spots.json'

const spotIds = new Set(spots.map((s) => s.id))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Index },
    { path: '/spot/:id', name: 'spot', component: Index, beforeEnter: (to) => (spotIds.has(to.params.id) ? true : { name: 'notfound', params: { pathMatch: to.path.slice(1).split('/') }, replace: true }) },
    { path: '/mapa', name: 'map', component: () => import('@/pages/SpotsMap.vue') },
    { path: '/:pathMatch(.*)*', name: 'notfound', component: () => import('@/pages/NotFound.vue') },
  ],
  scrollBehavior: (to, from, saved) => saved ?? (from.name && to.name !== from.name ? { top: 0 } : false),
})

// Compatibilidad con links viejos: /?spot=federacion -> /spot/federacion
router.beforeEach((to) => {
  const id = to.query.spot
  if (to.name === 'home' && typeof id === 'string' && spotIds.has(id)) {
    return { name: 'spot', params: { id }, replace: true }
  }
})

export default router
