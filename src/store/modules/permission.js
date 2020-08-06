import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  // if (route.meta && route.meta.roles) {
  //   return roles.some(role => route.meta.roles.includes(role))
  // } else {
    return true
  // }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_ROUTES_ARRAY: (state, routes) => {
    state.addRoutes = routes
  }
}

const mapPermissionMenu = function(aMenu, treeMenu = [], menuList = []) {
  aMenu.map(mitem => {
    const childMenu = mitem.subMenu
    mitem.title = mitem.name
    if (childMenu && childMenu.length) {
      const gchild = mapPermissionMenu(childMenu, [], menuList)
      mitem.subMenu = gchild.treeMenu
      menuList.concat(gchild.menuList)
    } else {
      const marryRoute = asyncRoutes.find(matchItem => {
        return matchItem.path === mitem.href
      })
      mitem.path = mitem.href
      if (marryRoute) {
        mitem.name = marryRoute.name
        mitem.meta = marryRoute.meta
        marryRoute.title = mitem.title
      }
    }
    if (mitem.showFlag == 1) {
      treeMenu.push(mitem)
    }
    menuList.push({ ...mitem, subMenu: null })
  })
  return { treeMenu, menuList }
}
const actions = {
  // 生成用户可访问菜单路由
  generateRoutes({ commit }, menu) {
    return new Promise(resolve => {
      const accessedRoutes = mapPermissionMenu(menu)
      const treeMenu = [
        // { href: '/', title: '首页', icon: 'el-icon-s-home' },
        ...accessedRoutes.treeMenu
      ]
      commit('SET_ROUTES', treeMenu)
      commit('SET_ROUTES_ARRAY', accessedRoutes.menuList)
      resolve(accessedRoutes.menuList)
    })
  },
  // 清除用户可访问菜单路由
  clearRoutes({ commit }) {
    commit('SET_ROUTES', [])
    commit('SET_ROUTES_ARRAY', [])
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
