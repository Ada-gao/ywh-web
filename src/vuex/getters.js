// test
// export const getCount = state => {
//   return state.count
// }
const getters = {
  getCount: state => state.count,
  sysUser: state => state.sysUser
}
export default getters
