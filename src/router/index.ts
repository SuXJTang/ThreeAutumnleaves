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
      path: '/3d-printing/:id',
      name: '3d-printing-detail',
      component: () => import('../views/3DPrintingDetailView.vue'),
    },
    {
      path: '/ai-agent',
      name: 'ai-agent',
      component: () => import('../views/AIAgentView.vue'),
    },
    {
      path: '/ai-resource/:id',
      name: 'ai-resource-detail',
      component: () => import('../views/AIResourceDetailView.vue'),
    },
    // 用户相关路由
    {
      path: '/user/profile',
      name: 'user-profile',
      component: () => import('../views/UserProfileView.vue'),
    },
    {
      path: '/user/settings',
      name: 'user-settings',
      component: () => import('../views/UserSettingsView.vue'),
    },
    {
      path: '/user/orders',
      name: 'user-orders',
      component: () => import('../views/UserOrdersView.vue'),
    },
    {
      path: '/user/favorites',
      name: 'user-favorites',
      component: () => import('../views/UserFavoritesView.vue'),
    },
  ],
})

export default router
