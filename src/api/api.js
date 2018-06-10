import axios from 'axios'

axios.defaults.baseURL = process.env.BASE_API
axios.defaults.timeout = 15000

axios.interceptors.request.use(config => {
  config.headers['Authorization'] = sessionStorage.getItem('token')
  return config
}, error => {
  return Promise.reject(error)
})
export const requestLogin = params => axios.post('/auth/login', params)

export const getUser = () => axios.get('/auth/user')
export const getDeviceListPage = params => axios.get('/devices', {params: params})
export const getAppInfoListPage = params => axios.get('/appInfos', {params: params})
export const getAppBuildInfoListPage = params => axios.get('/build', {params: params})

export const updateRates = (id, loanType, baseRate, rates) => axios.post('/rates', {id, loanType, baseRate, rates})
export const getRates = loanType => axios.get(`/rates/${loanType}`)
