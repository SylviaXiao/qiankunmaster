import { asyncRouterMap, constantRouterMap, generatorDynamicRouter } from '@/config/router.config'
import store from '@/store'


/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission(permission, route) {
  // if (route.meta && route.meta.menu)
// return
  if (route.meta && route.meta.permission) {
    let flag = false
    if (!permission) {
      return false
    }
    for (let i = 0, len = permission.length; i < len; i++) {
      if (permission[i] === '*') {
        return true
      }
      for (let j = 0; j < route.meta.permission.length; j++) {
        let permList = permission[i].split(':')
        let routeList = route.meta.permission[j].split(':')
        flag = permList.equals(routeList)

        if (flag) {
          return true
        }
      }
    }

    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter(routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(roles.permissionList, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

function removeNoChildren(routerMap, roles) {
  const accessedRouters = filterAsyncRouter(routerMap, roles)
  accessedRouters.map((item, index) => {
    if (item.name === 'index' && item.children) {
      for (let i = item.children.length - 1; i >= 0; i--) {
        const r = item.children[i]
        if (r.children.length == 0) {
          item.children.splice(i, 1)
        } else {
          const hasChild = r.children
          for (let j = hasChild.length - 1; j >= 0; j--) {
            if (hasChild[j].children && hasChild[j].children.length == 0) {
              r.children.splice(j, 1)
            }
          }
          r.children.length == 0? item.children.splice(i, 1):''

        }
      }
    }
  })
  return accessedRouters
}


const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        const accessedRouters = removeNoChildren(asyncRouterMap, roles)

        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
