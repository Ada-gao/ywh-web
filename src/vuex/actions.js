import { getUser } from '@/api/api'

// test
export const increment = ({commit}) => {
  commit('INCREMENT')
}
export const decrement = ({commit}) => {
  commit('DECREMENT')
}
export const GetUser = ({commit}, token) => {
  if (token) {
    getUser().then(res => {
      const sysUser = res.data
      // const sysUser = res.data.username
      commit('SET_SYS_USER', sysUser)
    })
  }
}
