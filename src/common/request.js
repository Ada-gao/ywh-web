import axios from 'axios'
import { router } from '../main'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 10000 // 请求超时时间
})

service.interceptors.request.use(config => {
  config.headers['Authorization'] = sessionStorage.getItem('token')
  return config
}, error => {
  console.log("request error"+error)
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
    const res = response.data
    if (res.code === 1) {
      return Promise.reject(res)
    }
    return response
  },
  error => {
    if (error.response){
      const res = error.response
      if (res.status === 400) {
        message(res.data.message || res.data.error, 'error')
      } else if (res.status === 401) {
        message('登录时间过期，请重新登录', 'error')
        removeToken()
        router.replace({ path: '/login' })
      } else if (res.status === 403) {
        message('管理权限不足，请联系管理员')
        router.replace({path: '/login'})
      } else if (res.status === 500) {
        message(res.data.message || res.data.error, 'error')
      } else {
        message('服务器被吃了⊙﹏⊙∥', 'error')
        router.replace({path: '/404'})
      }
    } else{
      message('请求超时，请稍后重试', 'error')
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
