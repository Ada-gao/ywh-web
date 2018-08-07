import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import getters from './getters'
import routesMap from '../routes'

Vue.use(Vuex)

// 应用初始状态
const state = {
  count: 10,
  sysUser: '',
  adminStat: null,
  menuIds: null,
  routers: routesMap,
  userInfo: null
}

// 定义所需的 mutations
const mutations = {
  INCREMENT: (state) => {
    state.count++
  },
  DECREMENT: (state) => {
    state.count--
  },
  SET_SYS_USER: (state, sysUser) => {
    state.sysUser = sysUser
  },
  SET_ADMIN_STAT: (state, payload) => {
    state.adminStat = payload
  },
  SET_MENU_ID: (state, menuIds) => {
    state.menuIds = menuIds
  },
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  },
  SET_USERINFO: (state, payload) => {
    state.userInfo = payload
  }
}

// 创建 store 实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})
