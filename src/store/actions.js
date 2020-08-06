const actions = {
    async logout({dispatch}){
      // 退出登录
      // 清除 token
      await dispatch('user/resetToken')
      // 清除 tag标签路由 和 cache缓存路由
      await dispatch('tagsView/delAllViews')
      // 清除 top头部菜单
      await dispatch('app/clearTopMenu')
      // 清除 用户配置访问菜单
      await dispatch('permission/clearRoutes')
    }
  }
  export default actions
  