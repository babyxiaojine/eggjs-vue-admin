const PageRouter = [
  {
    path: '/activities/index',
    component: () => import('@/views/activities/index'),
    name: 'Activities',
    meta: { title: '特卖活动管理', icon: 'icon', noCache: false }
  },
  {
    path: '/activities/edit',
    component: () => import('@/views/activities/edit'),
    name: 'ActivitiesEdit',
    meta: { title: '特卖活动管理', icon: 'icon', noCache: true }
  },
  {
    path: '/product/index',
    component: () => import('@/views/product/index'),
    name: 'Product',
    meta: { title: '商品管理', icon: 'icon', noCache: false }
  },
  {
    path: '/order/index',
    component: () => import('@/views/order/index'),
    name: 'Order',
    meta: { title: '订单管理', icon: 'icon', noCache: false }
  },
  {
    path: '/difference/index',
    component: () => import('@/views/saleDifference/index'),
    name: 'SaleDifference',
    meta: { title: '领用售卖差异', icon: 'icon', noCache: false }
  },
]
export default PageRouter
