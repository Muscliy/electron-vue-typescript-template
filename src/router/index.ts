import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'

Vue.use(Router)


export const constantRoutes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/404'
  },
  {
    path: '/hello',
    component: () => import(/* webpackChunkName: "login" */ '@/components/HelloWorld'),
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true }
  }

]


const createRouter = () => new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  // routes: constantRoutes
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
