import axios from '@/common/request'
import qs from 'qs'

export function uploadLogo(file) {
  return axios({
    url: '/file/upload',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function uploadCompanyQualification(file) {
  return axios({
    url: '/file/uploadCompanyQualification',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getTrailDet(id, params) {
  let para = qs.stringify(params)
  return axios({
    url: '/trial/updateStatus/' + id,
    method: 'put',
    data: para
  })
}

//auth
export const requestLogin = params => axios.post('/auth/login', params)
export const getUser = () => axios.get('/auth/user')
//account
export const getLoginLogPage = params => axios.get('/account/getLoginLogPage', {params: params})
export const account = params => axios.post('/account', params)
export const getAccounts = params => axios.get('/account/getPage', {params: params})
export const recharge = params => axios.post('/account/recharge', params)
export const getAccountByCompanyId = id => axios.get('/account/getAccountByCompanyId/' + id)
export const getRechargePage = params => axios.get('/account/recharge', {params: params})
export const accountCompany = id => axios.get('/account/' + id)
export const getConsumptionPage = (id, params) => axios.get('/account/getConsumptionPage/' + id, {params: params})
export const getRechargePageById = (id, params) => axios.get('/account/getRechargePage/' + id, {params: params})
export const updateAccount = (id, params) => axios.put('/account/' + id, params)
export const enabledAccount = (id, status) => axios.put('/account/enabledAccount/' + id + '?status=' + status)
export const accounts = params => axios.get('/account/getAccount'  , {params: params})
// review
export const review = (pageTab, params) => axios.get('/review/' + pageTab, {params: params})
export const putReview = (id, status, content) => axios.put('/review/' + id + '?status=' + status + '&content=' + content)
export const messageDetail = id => axios.get('/review/messageDetail/' + id)
// message
export const getEnabledRule = () => axios.get('/message/getEnabledRule')
export const getMessageHistoryGroupPage = params => axios.get('/message/getMessageHistoryGroupPage', {params: params})
export const addMessageGroup = params => axios.post('/message/addMessageGroup', params)
export const message = params => axios.post('/message', params)
export const putMessage = (id, params) => axios.put('/message/' + id, params)
export const getMessage = id => axios.get('/message/' + id)
export const messageRulePage = params => axios.get('/message/messageRulePage', {params: params})
export const enabeldRule = (id, enabled) => axios.put('/message/enabledRule/' + id + '?enabled=' + enabled)
export const updateMessageGroup = (id, params) => axios.put('/message/updateMessageGroup/' + id, params)
export const getMessageHistory = (id, params) => axios.get('/message/getMessageHistory/'+id, {params: params})
// company
export const getCompanies = () => axios.get('/companies')
export const getTeams = params => axios.get('/companies/queryTeams', {params: params})
export const getCompanyPage = params => axios.get('/companies/companyPage', {params: params})
export const addCompanies = data => axios.post('/companies', data)
export const delCompanies = id => axios.delete('/companies/' + id)
export const putCompanies = (id, data) => axios.put('/companies/' + id, data)
export const getCompanyById = (id) => axios.get('/companies/'+id)
// users
export const getUsers = params => axios.get('/users/queryUsers', {params: params})
export const getAdmin = params => axios.get('/users/getAdmin', {params: params})
export const addAdmin = (id, params) => axios.post('/users/addAdmin?accountId=' + id, params)
export const getUsersCount = () => axios.get('/users/salesCount')
export const getUserById = id => axios.get('/users/' + id)
export const updSale = (id, params) => axios.put('/users/updateUsers/' + id, params)
export const addBatch = (companyId, params) => axios.post('/users/addBatch?companyId=' + companyId, params)
export const addUser = params => axios.post('/users', params)
export const userEnabled = (id, params) => axios.put('/users/enabled/' + id + '?enabled=' + params)
export const resetPWD = (id, newPWD) => axios.put('/users/resetPWD/' + id + '?newPWD=' + newPWD)
export const updateUsers = (id, params) => axios.put('/users/updateUsers/' + id, params)
export const statisSales = (id) => axios.get('/users/statisSales?companyId=' + id)
// outboundName
export const getBatch = params => axios.get('/outboundName/getBatch', {params: params})
export const getLists = params => axios.get('/outboundName/getPage', {params: params})
export const addNameExcel = (query, params) => axios.post('/outboundName/addGroup?companyId=' + query.companyId + '&groupName=' + query.groupName + '&maskPhoneNo=' + query.maskPhoneNo + '&source=' + query.source, params)
export const getNames = (companyId) => axios.get('/outboundName/queryNames/' + companyId)
// task
export const getAdminTasks = params => axios.get('/task/getGroupPage', {params: params})
export const getTasks = params => axios.get('/task/getPage', {params: params})
export const createTask = params => axios.post('/task/createGroup', params)
export const getTaskDetail = (id, params) => axios.get('/task/getGroup/' + id, {params: params})
export const updateTimes = (id, params) => axios.put('/task/updateTimes/' + id + '?times=' + params)
export const getProductByTeam = team => axios.get('/task/getProductByTeam?team=' + team)
export const getStatistic = () => axios.get('/task/statisByCompany')
export const taskDoneRate = (id) => axios.get('/task/statisBySales?userId=' + id)
// file
export const getFile = id => axios.get('/file/' + id)
// feedback
export const getFeedback = params => axios.get('/feedback/getPage', {params: params})
export const getFdDetail = id => axios.get('/feedback/getImg/' + id)
// report
export const workload = params => axios.get('/reportMgmt/workload', {params: params})
export const getCallStatis = params => axios.get('/reportMgmt/getCallStatis', {params: params})
export const getCallHistory = params => axios.get('/reportMgmt/getCallHistory', {params: params})
// trial
export const getTrial = params => axios.get('/trial/getPage', {params: params})
// product
export const getProductList = () => axios.get('/product/list')
// dict
export const getOrgSize = () => axios.get('/dict/TypeorgSize')
// industry
export const getAuthDustries = () => axios.get('/industry/auth/getAllTypes')
export const getAuthDustryByType = typeId => axios.get('/industry/auth/getIndustrysByTypeId/' + typeId)
