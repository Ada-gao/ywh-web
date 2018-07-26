import { getUser } from '@/api/api'
import routesMap from '../routes'

/**
 * 动态权限判断
 * @param menuIds  用户拥有的菜单列表
 * @param route   菜单选择
 * @returns {boolean}
 */
function hasPermission (menuIds, route) {
  let result = false
  menuIds.filter(menuId => {
    if (menuId === route.menuId) {
      result = true
    }
  })
  return result
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter (asyncRouterMap, menuIds) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menuIds, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menuIds)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

// test
export const increment = ({commit}) => {
  commit('INCREMENT')
}
export const decrement = ({commit}) => {
  commit('DECREMENT')
}
export const GetUser = ({commit}, token) => {
  if (token) {
    // console.log('token')
    getUser().then(res => {
      const userInfo = res.data
      const userData = res.data.authorities
      let sysUser = ''
      let menuIds = []
      let accessedRouters
      if (userData.length > 1) {
        sysUser = 'superadmin'
        // sysUser = userInfo.username
        menuIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 31, 41, 42, 51, 52, 53, 61, 62, 71, 72, 73, 81, 82, 91, 92, 101, 102, 111, 112, 113]
        accessedRouters = routesMap
      } else {
        sysUser = userData[0].authority === 'ROLE_ADMIN' ? 'admin' : 'sale'
        // sysUser = userInfo.username
        menuIds = [1, 2, 3, 4, 5, 6, 7, 31, 41, 42, 51, 52, 53, 61, 62, 71, 72, 73]
        accessedRouters = filterAsyncRouter(routesMap, menuIds)
      }
      commit('SET_USERINFO', userInfo)
      commit('SET_SYS_USER', sysUser)
      commit('SET_MENU_ID', menuIds)
      commit('SET_ROUTERS', accessedRouters)
    })
  }
}
