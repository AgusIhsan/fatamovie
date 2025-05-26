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
    {
      path: '/movie/:id',
      name: 'DetailMovie',
      component: () => import('@/views/DetailMovie.vue'),
    },
    {
      path: '/search',
      name: 'SearchPage',
      component: () => import('@/views/SearchPage.vue'),
    },
    {
      path: '/genre/:idAndSlug',
      name: 'GenreList',
      component: () => import('@/views/GenreList.vue'),
    },
  ],
})

export default router
