import { login, logout, getInfo, getAllShop } from '@/api/user'
import Cookies from 'js-cookie'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  enames: [], //角色
  auth: [],  //权限
  menu: [], //菜单
  info: {}, //用户信息
  shopId: '', //当前用户shop  
  shops: [], //当前用户shop  
  allShop: null // shop列表
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ENAMES: (state, enames) => {
    state.enames = enames
  },
  SET_AUTH: (state, auth) => {
    state.auth = auth
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_SHOPID: (state, info) => {
    state.shopId = info
  },
  SET_SHOPS: (state, info) => {
    info.map(item=>[
      item.name = item.shopName
    ])
    state.shops = info
  },
  SET_ALLSHOP: (state, info) => {
    state.allShop = info
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data || !data.menus) {
          reject('获取菜单失败.')
        }
        if (process.env.ENV !== 'production') {
          const testUsers = Cookies.getJSON('testUsers') || {}
          testUsers[data.loginName] = { name: data.name, jobName: data.jobName, enames:data.enames, userType: data.userType, loginTime: Date.now() }
          Cookies.set('testUsers', testUsers,{ expires: 365 })
        }
        const { authorities=[], enames=[], menus=[], shopId='', shops=[] } = data
        const userInfo = {
          id: data.id,
          loginName: data.loginName,
          name: data.name,
          phone: data.phone,
          userNo: data.userNo,
          delFlag: data.delFlag,
          userType: data.userType,
          franchStatus: data.franchStatus
        }
        commit('SET_ENAMES', enames)
        commit('SET_AUTH', authorities)
        commit('SET_MENU', menus)
        commit('SET_INFO', userInfo)
        commit('SET_SHOPID', shopId)
        commit('SET_SHOPS', shops)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        return dispatch('resetToken')
      }).then(()=>{
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 清除所有用户数据
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ENAMES', [])
      commit('SET_MENU', [])
      commit('SET_AUTH', [])
      commit('SET_INFO', {})
      commit('SET_SHOPID', '')
      commit('SET_SHOPS', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },

    // queryAllShop
    queryAllShop({ commit, state }) {
      return new Promise((resolve, reject) => {
        if(state.allShop){
          resolve(state.allShop)
        }else{
          getAllShop().then((res) => {
            const resData = res.data || []
            resData.map(item=>{
              item.name = item.shopName
            })
            commit('SET_ALLSHOP', resData)
            resolve(resData)
          }).catch(error => {
            reject(error)
          })
        }
      })
    },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
