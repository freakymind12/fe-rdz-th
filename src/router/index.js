import { createRouter, createWebHistory } from 'vue-router'
import TheLayout from '@/layout/TheLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TheLayout,
      redirect: '/dashboard',
      meta: { breadcrumb: 'Home' },
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/LiveDashboard.vue'),
          meta: {
            breadcrumb: 'Live Dashboard',
          },
        },
        {
          path: '/heatmap',
          name: 'Heatmap',
          component: () => import('@/views/dashboard/EmbedHeatmap.vue'),
          meta: {
            breadcrumb: 'Grafana Heatmap',
          },
        },

        {
          path: '/report',
          name: 'Report',
          component: () => import('@/views/report/ReportData.vue'),
          meta: {
            breadcrumb: 'Report',
          },
        },

        {
          path: '/master-data',
          name: 'Master Data',
          component: () => import('@/views/master/DataMaster.vue'),
          meta: {
            breadcrumb: 'Master Data',
          },
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/views/pages/NotFound.vue'),
          meta: {
            breadcrumb: 'Not Found',
          },
        },
      ],
    },
  ],
})

export default router
