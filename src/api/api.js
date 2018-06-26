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
export const getTeams = id => axios.get('/companies/queryTeams/' + id)
export const getAssociateList = id => axios.get('/outboundName/queryNames/' + id)
export const getCompanyPage = params => axios.get('/companies/companyPage', {params: params})
export const addCompanies = data => axios.post('/companies', data)
export const delCompanies = id => axios.delete('/companies/' + id)
export const putCompanies = (id, data) => axios.put('/companies/' + id, data)
export const getTeams = (id) => axios.get('/companies/queryTeams/' + id)
// dict
export const getOrgSize = () => axios.get('/dict/TypeorgSize')
// industry
export const getAuthDustries = () => axios.get('/industry/auth/getAllTypes')
export const getAuthDustryByType = typeId => axios.get('/industry/auth/getIndustrysByTypeId/' + typeId)
// user/sale
export const getUsers = params => axios.get('/users/querySales', {params: params})
export const getUsersCount = () => axios.get('/users/salesCount')
export const getUserById = id => axios.get('/users/' + id)
export const updSale = (id, params) => axios.put('/users/updateSales/' + id, params)
export const addBatch = (companyId, params) => axios.post('/users/addBatch?companyId=' + companyId, params)
export const addUser = params => axios.post('/users', params)
export const userEnabled = (id, params) => axios.put('/users/enabled/' + id + '?enabled=' + params)
// name
export const getLists = params => axios.get('/outboundName/getPage', {params: params})
export const addNameExcel = (query, params) => axios.post('/outboundName/addGroup?companyId=' + query.companyId + '&groupName=' + query.groupName + '&maskPhoneNo=' + query.maskPhoneNo, params)
export const getNames = (companyId) => axios.get('/outboundName/queryNames/' + companyId)
// file
export const getFile = id => axios.get('/file/' + id)
// task
export const getAdminTasks = params => axios.get('/task/admin/getPage', {params: params})
export const getTasks = params => axios.get('/task/getPage', {params: params})
export const createTask = data => axios.get('/task/createGroup', data)
export const getTaskDetail = id => axios.get('/task/' + id)
export const getAdminTaskDetail = id => axios.get('/task/admin/' + id)
// product
export const getProductList = () => axios.get('/product/list')
