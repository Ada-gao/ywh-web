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
// company
export const getCompanies = () => axios.get('/companies')
export const getCompanyPage = params => axios.get('/companies/companyPage', {params: params})
export const addCompanies = data => axios.post('/companies/', data)
export const delCompanies = id => axios.delete('/companies/' + id)
export const putCompanies = (id, data) => axios.put('/companies/' + id, data)
// dict
export const getOrgSize = () => axios.get('/dict/TypeorgSize')
// industry
export const getAuthDustries = () => axios.get('/industry/auth/getAllTypes')
export const getAuthDustryByType = typeId => axios.get('/industry/auth/getIndustrysByTypeId/' + typeId)
// user/sale
export const getUsers = params => axios.get('/users/querySales', {params: params})
export const getUsersCount = () => axios.get('/users/salesCount')
// name
export function getLists (query) {
  return axios({
    url: '/outboundName/getPage',
    method: 'get',
    params: query
  })
}
// task
export function getTasks (query) {
  return axios({
    url: '/task/admin/getPage',
    method: 'get',
    params: query
  })
}
