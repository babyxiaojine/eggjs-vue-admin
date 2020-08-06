import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/getUserAll',
    method: 'post'
  })
}

export function logout() {
  return request({
    skipValidate: true,
    url: '/sys/logout',
    method: 'post'
  }) 
}

export function getAllShop() {
  return request({
    url: '/shop/getAllShop',
    method: 'get',
  })
}
