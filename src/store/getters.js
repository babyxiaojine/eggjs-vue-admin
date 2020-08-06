const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  permission_routes: state => state.permission.routes,
  userInfo: state => state.user.info,
  activeTopMenu: state => state.app.topMenu,
  errorLogs: state => state.errorLog.logs,
  queryEnames: state => data => {
    return state.user.enames.indexOf(data) > -1
  },
  isFranchStatus: state => {
    if(state.user.info.userType === '2' ){
      return state.user.info.franchStatus
    }
    return false
  },
  queryAuth: state => data => {
    return state.user.auth.indexOf(data) > -1
  },
  queryShopId: state => state.user.shopId,
  queryShops: state => state.user.shops
}
export default getters
