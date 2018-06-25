import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
// import * as getters from './getters'
import getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
  count: 10,
  sysUser: ''
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
  }
}

// 创建 store 实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})
