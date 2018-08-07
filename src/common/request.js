import axios from 'axios'
import router from '../routes'
import { Message } from 'element-ui'
import { getToken, removeToken } from './js/auth'

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
    const res = error.response
    if (res.status === 400) {
      // 错误处理
      if (res.data.message){
        message(res.data.message, 'error')
      } else {
        message(res.data.error, 'error')
      }
    } else if (res.status === 401) {
      message('登录时间过期，请重新登录', 'error')
      removeToken()
      setTimeout(()=>{
        window.location.href = window.location.protocol + '//' + window.location.host + '/login'
      },2000)
    } else if (res.status === 403) {
      message('管理权限不足，请联系管理员')
      setTimeout(()=>{
        window.location.href = window.location.protocol + '//' + window.location.host + '/login'
      },2000)
    } else if (res.status === 500) {
      if (res.data.message){
        message(res.data.message, 'error')
      } else {
        message(res.data.error, 'error')
      }
    } else {
      message('服务器被吃了⊙﹏⊙∥', 'error')
      setTimeout(()=>{
        window.location.href = window.location.protocol + '//' + window.location.host + '/404'
      },2000)
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
