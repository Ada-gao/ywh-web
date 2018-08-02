import axios from 'axios'
import router from '../routes'
import { Message } from 'element-ui'
// import store from '../store'
import { getToken, removeToken } from './js/auth'

// axios.defaults.baseURL = process.env.BASE_API
// axios.defaults.timeout = 15000
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

service.interceptors.request.use(config => {
  config.headers['Authorization'] = getToken()
  return config
}, error => {
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 1) {
      message(res.msg, 'error')
      return Promise.reject(res)
    }
    return response
  },
  error => {
    console.log('error')
    console.log(error)
    const res = error.response
    console.log(res.data)

    if (res.status === 400) {
      // 错误处理

    } else if (res.status === 401) {
      message('登录时间过期，请重新登录', 'error')
      removeToken()
      router.replace({
        path: '/login',
        query: {redirect: router.fullPath}
      })
    } else if (res.status === 403) {
      console.log(333)
      this.$router.push({path: '/login'})
      message('管理权限不足，请联系管理员')
    } else if (res.status === 500) {
      // alert(this.$router.currentRoute.path)
      message(res.data.error, 'error')
    } else {
      message('服务器被吃了⊙﹏⊙∥', 'error')
      router.replace({
        path: '/404',
        query: {redirect: router.fullPath}
      })
    }
    return Promise.reject(error)
  }
)

export function message (text, type) {
  Message({
    message: text,
    type: type,
    duration: 5 * 1000
  })
}

export default service
