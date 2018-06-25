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
export const addCompanies = data => axios.post('/companies', data)
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
export const getUserById = id => axios.get('/users/' + id)
export const updUser = (id, params) => axios.put('/users/' + id, params)
export const addBatch = params => axios.post('/users/addBatch', params)
export const addUser = params => axios.post('/users', params)
// name
export const getLists = params => axios.get('/outboundName/getPage', {params: params})
// file
export const getFile = id => axios.get('/file/' + id)
// task
export const getTasks = params => axios.get('/task/admin/getPage', {params: params})
export const createTask = data => axios.get('/task', data)
