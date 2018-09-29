import Login from '../views/Login'
import NotFound from '../views/404'
import Home from '../views/Home'
// 1、首页工作台
import dashboard from '../views/dashboard/echarts'
// 2、账户管理
import account from '../views/account/account'
// 3、公司管理
import company from '../views/company/company'
import companyCreate from '../views/company/create'
import companyDetail from '../views/company/detail'
// 4、销售管理
import salesman from '../views/salesman/salesman'
import salesmanDetail from '../views/salesman/detail'
import excel from '../views/salesman/importExcel'
// 5、名单管理
import list from '../views/namelist/index'
import namelist from '../views/namelist/namelist'
import nameexcel from '../views/namelist/importExcel'
// 6、任务管理
import task from '../views/task/task'
import newTask from '../views/task/newTask'
import tasklist from '../views/task/detail'
// 7、消息推送管理
import push from '../views/push/push'
import rule from '../views/push/rule'
import ruleDetail from '../views/push/ruleDetail'
import createRule from '../views/push/createRule'
import pushDetail from '../views/push/pushDetail'
// 8、试用管理
import trial from '../views/trial/index'
import trialdetail from '../views/trial/detail'
// 9、审核管理
import check from '../views/check/check'
import pushdetail from '../views/check/pushdetail'
import taskdetail from '../views/check/taskdetail'
// 10、报表统计
import workload from '../views/report/workload'
import reportTask from '../views/report/task'
import record from '../views/report/record'
import count from '../views/report/count'
// 11、系统管理
import system from '../views/system/system'
import open from '../views/system/open'
import recharge from '../views/system/recharge'
import systemDetail from '../views/system/detail'
// 12、问题反馈
import feedback from '../views/feedback/index'
import fddetail from '../views/feedback/detail'
// 13、版本管理
import listVersion from '../views/version/list'
import publishVersion from '../views/version/publish'

let routes = [
  {
    path: '/login',
    component: Login,
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    hidden: true
  },
  {
    path: '/',
    component: Home,
    children: [
      {path: '/dashboard', component: dashboard, name: '首页-工作台'},
      {path: '/account', component: account, name: '账户管理'},
      {path: '/company', component: company, name: '公司管理'},
      {path: '/company/create', name: 'create', component: companyCreate},
      {path: '/company/detail', name: 'detail', component: companyDetail},
      {path: '/salesman', component: salesman, name: '销售管理'},
      {path: '/salesman/detail', component: salesmanDetail, name: 'salesmanDetail'},
      {path: '/salesman/excel', component: excel, name: '销售批量导入'},
      {path: '/list', component: list, name: '名单管理'},
      {path: '/list/excel', component: nameexcel, name: 'nameexcel'},
      {path: '/list/namelist', component: namelist, name: 'namelist'},
      {path: '/task', component: task, name: '任务管理'},
      {path: '/task/newTask', component: newTask, name: 'newTask'},
      {path: '/task/detail', component: tasklist, name: 'taskDetail'},
      {path: '/push/push', component: push, name: 'push'},
      {path: '/push/rule', component: rule, name: 'rule'},
      {path: '/push/ruleDetail', component: ruleDetail, name: 'ruleDetail'},
      {path: '/push/createRule', component: createRule, name: 'createRule'},
      {path: '/push/pushDetail', component: pushDetail, name: 'pushDetail'},
      {path: '/trial', component: trial, name: '试用管理'},
      {path: '/trial/detail', component: trialdetail, name: 'trialDetail'},
      {path: '/check', component: check, name: '审核管理'},
      {path: '/check/pushdetail', component: pushdetail, name: 'pushdetail'},
      {path: '/check/taskdetail', component: taskdetail, name: 'taskdetail'},
      {path: '/report/workload', component: workload, name: '工作量统计'},
      {path: '/report/task', component: reportTask, name: '外呼任务统计'},
      {path: '/report/record', component: record, name: '历史通话记录'},
      {path: '/report/count', component: count, name: '话务统计'},
      {path: '/system', component: system, name: '系统管理'},
      {path: '/system/open', component: open, name: 'open'},
      {path: '/system/recharge', component: recharge, name: 'recharge'},
      {path: '/system/detail', component: systemDetail, name: 'systemDetail'},
      {path: '/feedback', component: feedback, name: '问题反馈'},
      {path: '/feedback/detail', component: fddetail, name: 'fDetail'},
      {path: '/version/list', component: listVersion, name: 'listVersion'},
      {path: '/version/publish', component: publishVersion, name: 'publishVersion'}
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  }
]

export default routes
