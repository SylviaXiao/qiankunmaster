const getters = {
  isAdmin: (state, getters) => getters.userInfo?.perms?.includes('*'),
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  positionName: state => state.user.info.position?state.user.info.position.positionName:'无职位',
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  menuList: state => state.user.menuList,
  school_id: state => state.user.school_id,
  isReception: state => {
    let roles = state.user.info.roles || []
    let isReception = false
    roles.forEach(element => {
      const { roleName } = element
      if (roleName.includes('前台')) {
        isReception = true
        return false
      }
    })
    return isReception
  },
  // 网课组
  isOnlineCourseGroup: state => {
    let depts = state.user.info.depts
    let result = false
    if (depts) {
      for (const dept of depts) {
        const { deptId } = dept
        if ('f92fb2d7-0e57-472b-a8f6-6ad6bb9fd542' == deptId) {
          result = true
          break
        }
      }
    }
    return result
  }
}

export default getters
