const SystemRouter = [
  {
    path: '/system/setting/menu/index',
    component: () => import('@/views/system/setting/menu/index'),
    name: 'SystemSettingMenu',
    meta: { title: '菜单管理', icon: 'icon', noCache: false }
  },
  {
    path: '/system/setting/menu/edit',
    component: () => import('@/views/system/setting/menu/edit'),
    name: 'SystemSettingMenuEdit',
    meta: { title: '菜单编辑', icon: 'icon', noCache: true }
  },
  {
    path: '/system/setting/role/index',
    component: () => import('@/views/system/setting/role/index'),
    name: 'SystemSettingRole',
    meta: { title: '角色管理', icon: 'icon', noCache: false }
  },
  {
    path: '/system/setting/role/edit',
    component: () => import('@/views/system/setting/role/edit'),
    name: 'SystemSettingRoleEdit',
    meta: { title: '角色编辑', icon: 'icon', noCache: true }
  },
  {
    path: '/system/setting/role/apportion',
    component: () => import('@/views/system/setting/role/apportion'),
    name: 'SystemSettingRoleApportion',
    meta: { title: '角色分配', icon: 'icon', noCache: false }
  },
  {
    path: '/system/setting/user/index',
    component: () => import('@/views/system/setting/user/index'),
    name: 'SystemSettingUser',
    meta: { title: '用户管理', icon: 'icon', noCache: false }
  },
  {
    path: '/system/setting/user/edit',
    component: () => import('@/views/system/setting/user/edit'),
    name: 'SystemSettingUserEdit',
    meta: { title: '新增用户', icon: 'icon', noCache: true }
  },
  {
    path: '/system/setting/user/addrole',
    component: () => import('@/views/system/setting/user/addrole'),
    name: 'SystemSettingUserAddrole',
    meta: { title: '权限调整', icon: 'icon', noCache: true }
  },
  {
    path: '/system/setting/shop/index',
    component: () => import('@/views/system/setting/shop/index'),
    name: 'SystemSettingShop',
    meta: { title: '店铺管理', icon: 'icon', noCache: true }
  },
  {
    path: '/system/setting/dict/index',
    component: () => import('@/views/system/setting/dict/index'),
    name: 'SystemSettingDict',
    meta: { title: '数据字典', icon: 'icon', noCache: false }
  },
  {
    path: '/system/setting/dict/edit',
    component: () => import('@/views/system/setting/dict/edit'),
    name: 'SystemSettingDictEdit',
    meta: { title: '新增字典', icon: 'icon', noCache: true }
  },
  {
    path: '/system/setting/systemControl/index',
    component: () => import('@/views/system/setting/systemControl/index'),
    name: 'SystemSettingSystemControl',
    meta: { title: '系统监控', icon: 'icon', noCache: false }
  },
  {
    path: '/system/setting/interfaceLogs/index',
    component: () => import('@/views/system/setting/interfaceLogs/index'),
    name: 'SystemSettingInterfaceLogs',
    meta: { title: '接口日志', icon: 'icon', noCache: false }
  },

]
export default SystemRouter
