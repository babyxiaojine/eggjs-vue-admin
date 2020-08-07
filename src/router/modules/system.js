const SystemRouter = [
  {
    path: '/system/menu/index',
    component: () => import('@/views/system/menu/index'),
    name: 'SystemMenu',
    meta: { title: '菜单管理', icon: 'icon', noCache: false }
  },
  {
    path: '/system/menu/edit',
    component: () => import('@/views/system/menu/edit'),
    name: 'SystemMenuEdit',
    meta: { title: '菜单编辑', icon: 'icon', noCache: true }
  },
  {
    path: '/system/cate/index',
    component: () => import('@/views/system/cate/index'),
    name: 'SystemCate',
    meta: { title: '栏目管理', icon: 'icon', noCache: false }
  },
  {
    path: '/system/cate/edit',
    component: () => import('@/views/system/cate/edit'),
    name: 'SystemCateEdit',
    meta: { title: '栏目编辑', icon: 'icon', noCache: true }
  },
  {
    path: '/system/role/index',
    component: () => import('@/views/system/role/index'),
    name: 'SystemRole',
    meta: { title: '角色管理', icon: 'icon', noCache: false }
  },
  {
    path: '/system/role/edit',
    component: () => import('@/views/system/role/edit'),
    name: 'SystemRoleEdit',
    meta: { title: '角色编辑', icon: 'icon', noCache: true }
  },
  {
    path: '/system/role/apportion',
    component: () => import('@/views/system/role/apportion'),
    name: 'SystemRoleApportion',
    meta: { title: '角色分配', icon: 'icon', noCache: false }
  },
  {
    path: '/system/user/index',
    component: () => import('@/views/system/user/index'),
    name: 'SystemUser',
    meta: { title: '用户管理', icon: 'icon', noCache: false }
  },
  {
    path: '/system/user/edit',
    component: () => import('@/views/system/user/edit'),
    name: 'SystemUserEdit',
    meta: { title: '新增用户', icon: 'icon', noCache: true }
  },
  {
    path: '/system/user/addrole',
    component: () => import('@/views/system/user/addrole'),
    name: 'SystemUserAddrole',
    meta: { title: '权限调整', icon: 'icon', noCache: true }
  },
  {
    path: '/system/shop/index',
    component: () => import('@/views/system/shop/index'),
    name: 'SystemShop',
    meta: { title: '店铺管理', icon: 'icon', noCache: true }
  },
  {
    path: '/system/dict/index',
    component: () => import('@/views/system/dict/index'),
    name: 'SystemDict',
    meta: { title: '数据字典', icon: 'icon', noCache: false }
  },
  {
    path: '/system/dict/edit',
    component: () => import('@/views/system/dict/edit'),
    name: 'SystemDictEdit',
    meta: { title: '新增字典', icon: 'icon', noCache: true }
  },
  {
    path: '/system/systemControl/index',
    component: () => import('@/views/system/systemControl/index'),
    name: 'SystemSystemControl',
    meta: { title: '系统监控', icon: 'icon', noCache: false }
  },
  {
    path: '/system/interfaceLogs/index',
    component: () => import('@/views/system/interfaceLogs/index'),
    name: 'SystemInterfaceLogs',
    meta: { title: '接口日志', icon: 'icon', noCache: false }
  },

]
export default SystemRouter
