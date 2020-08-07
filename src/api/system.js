import request from '@/utils/request'

export function queryAllMenu(menuType) {
  return request({
    url: '/sys/menu/queryAllMenu',
    method: 'post',
    data: {
      menuType: menuType
    }
  })
}
export function queryAllCate(menuType) {
  return request({
    url: '/sys/cate/queryAllCate',
    method: 'post',
    data: {
      menuType: menuType
    }
  })
}


