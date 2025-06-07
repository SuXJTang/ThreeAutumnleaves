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
      path: '/projects',
      name: 'projects',
      component: () => import('../views/ProjectsView.vue'),
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/CommunityView.vue'),
    },
    {
      path: '/announcement',
      name: 'announcement',
      component: () => import('../views/AnnouncementView.vue'),
    },

    {
      path: '/software-recommendations',
      name: 'software-recommendations',
      component: () => import('../views/SoftwareRecommendationsView.vue'),
    },
    {
      path: '/3d-printing',
      name: '3d-printing',
      component: () => import('../views/3DPrintingView.vue'),
    },
    {
      path: '/ai-agent',
      name: 'ai-agent',
      component: () => import('../views/AIAgentView.vue'),
    },
  ],
})

export default router
