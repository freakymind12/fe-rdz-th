import { createRouter, createWebHistory } from 'vue-router'
import TheLayout from '@/layout/TheLayout.vue'
import { useAuthStore } from '@/stores/auth'

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
          path: '/login',
          name: 'Login',
          component: () => import('@/views/pages/LoginPage.vue'),
          meta: {
            breadcrumb: 'Login',
          }
        },

        {
          path: '/master-data',
          name: 'Master Data',
          component: () => import('@/views/master/DataMaster.vue'),
          meta: {
            breadcrumb: 'Master Data',
            requiresAuth: true,
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(
    record => record.meta.requiresAuth
  )

  // route public, silakan lewat
  if (!requiresAuth) {
    return next()
  }

  // butuh auth tapi belum login
  if (!authStore.isLoggedIn) {
    return next('/login')
  }

  // sudah login, cek token masih hidup atau tidak
  const isValid = await authStore.expiredCheck()

  if (!isValid) {
    return next('/login')
  }

  next()
})
export default router
