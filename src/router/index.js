import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/Movie&Show.vue'),
    },
    {
      path: '/saved',
      name: 'saved',
      component: () => import('../views/Saved.vue'),
    },
  ],
})

export default router
