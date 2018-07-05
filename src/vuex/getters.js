// test
// export const getCount = state => {
//   return state.count
// }
const getters = {
  getCount: state => state.count,
  sysUser: state => state.sysUser,
  menuIds: state => state.menuIds,
  routers: state => state.routers,
  getUserInfo: state => state.userInfo
}
export default getters
