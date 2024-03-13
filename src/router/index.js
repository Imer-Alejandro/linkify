import { createRouter, createWebHistory } from 'vue-router'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/compartir',
      name: 'Compartir',
      component: () => import('../views/CompartirView.vue'),
      props: (route) => ({ url: route.params.url }),
    }
    
  ]
})

export default router
