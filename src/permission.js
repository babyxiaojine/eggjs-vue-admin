import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/login/sso', '/error'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  const pageTit = to.query.pageTitle || to.meta.title
  document.title = getPageTitle(pageTit)
  const hasToken = getToken()
  if (to.path === '/login/sso') {
    // 判断sso入口登录允许直接进入路由
    next()
  }else{
    // 不是sso登录,判断是否存在token
    if (hasToken) {
      // 存在token
      if (to.path === '/login') {
        // 判断跳转页面为登录页面，重定向到首页
        next({ path: '/' })
        NProgress.done()
      } else {
        const isGetUser = store.getters.userInfo
        if (isGetUser.userNo || isGetUser.loginName || isGetUser.id) {
          next()
        } else {
          try {
            const { menus } = await store.dispatch('user/getUserInfo')
            const accessRoutes = await store.dispatch('permission/generateRoutes', menus)
            const hasInAccess = accessRoutes.findIndex(item => {
              return item.href === to.path
            })
            if (window.location.hostname === '10.28.113.82' || window.location.hostname === 'localhost') {
              next({ ...to, replace: true })
            }
            // 登录获取到菜单后判断菜单是否在授权列表内，在就跳转到该页面，不在就跳到首页
            if (hasInAccess > -1) {
              next({ ...to, replace: true })
            } else {
              store.dispatch('app/handleTopMenu', {
                active: 0
              })
              next({ path: '/', replace: true })
            }
          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      /* 没有token */
      if (whiteList.includes(to.path)) {
        //判断在未登录白名单中可进入的路由
        next()
      }else{
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }

})

router.afterEach(() => {
  NProgress.done()
})
