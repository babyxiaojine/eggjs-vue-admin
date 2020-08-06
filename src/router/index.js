import Vue from 'vue'
import Router from 'vue-router'

import SystemRouter from './modules/system'
import PageRouter from './modules/page'
Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      noLayout: true
    }
  },

  {
    path: '/login/sso',
    component: () => import('@/views/login/sso'),
    hidden: true,
    meta: {
      noLayout: true
    }
  },

  {
    path: '/redirect/:path*',
    hidden: true,
    component: () => import('@/views/redirect/index')
  },

  {
    path: '/',
    redirect: '/home',
    name: 'home',
  },

  {
    path: '/home',
    component: () => import('@/views/home/index'),
    name: 'home',
    meta: { title: '首页', icon: 'icon', noCache: false }
  },
  {
    path: '/user/changePwd',
    component: () => import('@/views/user/changePwd'),
    name: 'changePwd',
    meta: { title: '修改密码', icon: 'icon', noCache: true }
  },
  ...SystemRouter,
  ...PageRouter,
  {
    path: '/error',
    component: () => import('@/views/error-page/401'),
    hidden: true,
    meta: {
      noLayout: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  // mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
