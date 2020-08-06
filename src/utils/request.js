import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import Cookies from 'js-cookie'
import router from '@/router'
// import { getToken } from '@/utils/auth'
const generateBaseUrl = function () {
  const url = process.env.VUE_APP_BASE_API
  const cookieTestService = Cookies.get('testServiceUrl')
  if (cookieTestService) {
    return (cookieTestService.indexOf('http') > -1 ? cookieTestService : 'http://' + cookieTestService) + '/api'
  } else {
    return url
  }
}
const baseURL = generateBaseUrl()
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000
})
let loadingInstance
// request 请求拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    loadingInstance = Loading.service({
      // target: document.querySelector('.app-main'),
      background: 'rgba(255,255,255,.1)',
      text: '加载中...'
    })
    if (store.getters.token) {
      config.params = { ...config.params, dToken: store.getters.token }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
// 保持登录激活定时器
let loginAliveTimer;
function openAliveTime(){
  if(loginAliveTimer){
    clearTimeout(loginAliveTimer)
  }
  if (store.getters.token) {
    loginAliveTimer = setTimeout(function(){
      if (store.getters.token) {
        getAxios('/sys/keepalive',{
          showLoading:true
        })
      }
    },300000)
  }
}

// response 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 关闭loading
    loadingInstance.close()
    // 重启alive
    openAliveTime()
    // 判断是否跳过校验
    if (response.config.skipValidate) {
      return res
    }
    if (res.code !== '0000') {
 
      // code:10001 登录失效
      if (res.code === '10001') {
        // 超时后强行注销所有登录和用户信息并退出
        store.dispatch('logout').then(() => {
          // 改为路由跳转
          router.push('/login')
          // location.reload()
        })
      }else{
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 2500
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    loadingInstance.close()
    console.log('err' + error) // for debug
    Message({
      message: '网络开小差了,请稍后重试...',
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

const postAxios = function (url, config) {
  return service({
    url,
    method: 'post',
    ...config
  })
}
const getAxios = function (url, config) {
  return service({
    url,
    method: 'get',
    ...config
  })
}

/** 格式化Object为url参数
* @param obj[object]
* @return [string]->a=1&b=2
*/
function encodeQueryString(obj) {
  const params = []
  for (var key in obj) {
    params.push(key + '=' + encodeURIComponent(obj[key]))
  }
  return params.join('&')
}

function openServiceUrl(url = '', params = {}) {
  const queryData = {
    dToken: store.getters.token,
    ...params
  }
  const queryStr = encodeQueryString(queryData)
  window.open(`${baseURL}${url}?${queryStr}`, '_blank')
}
export {
  baseURL,
  postAxios,
  getAxios,
  openServiceUrl
}
