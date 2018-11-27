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
// 5、潜客管理
import customerIndex from '../views/customer/index'
// 6、名单管理
import list from '../views/namelist/index'
import namelist from '../views/namelist/namelist'
import nameexcel from '../views/namelist/importExcel'
// 7、任务管理
import task from '../views/task/task'
import newTask from '../views/task/newTask'
import tasklist from '../views/task/detail'
import taskdispatch from '../views/task/dispatch'
// 8、消息推送管理
import push from '../views/push/push'
import rule from '../views/push/rule'
import ruleDetail from '../views/push/ruleDetail'
import createRule from '../views/push/createRule'
import pushDetail from '../views/push/pushDetail'
// 9、试用管理
import trial from '../views/trial/index'
import trialdetail from '../views/trial/detail'
// 10、审核管理
import check from '../views/check/check'
import pushdetail from '../views/check/pushdetail'
import taskdetail from '../views/check/taskdetail'
// 11、报表统计
import workload from '../views/report/workload'
import reportTask from '../views/report/task'
import record from '../views/report/record'
import count from '../views/report/count'
// 12、系统管理
import system from '../views/system/system'
import open from '../views/system/open'
import recharge from '../views/system/recharge'
import systemDetail from '../views/system/detail'
// 13、问题反馈
import feedback from '../views/feedback/index'
import fddetail from '../views/feedback/detail'
// 14、版本管理
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
      {path: '/dashboard', component: dashboard},
      {path: '/account', component: account},
      {path: '/company', component: company},
      {path: '/company/create', component: companyCreate, name: 'create'},
      {path: '/company/detail', component: companyDetail, name: 'detail'},
      {path: '/salesman', component: salesman},
      {path: '/salesman/detail', component: salesmanDetail, name: 'salesmanDetail'},
      {path: '/salesman/excel', component: excel},
      {path: '/customer/index', component: customerIndex},
      {path: '/list', component: list},
      {path: '/list/excel', component: nameexcel, name: 'nameexcel'},
      {path: '/list/namelist', component: namelist, name: 'namelist'},
      {path: '/task', component: task},
      {path: '/task/newTask', component: newTask, name: 'newTask'},
      {path: '/task/detail', component: tasklist, name: 'taskDetail'},
      {path: '/task/dispatch', component: taskdispatch,name:'taskdispatch'},
      {path: '/push/push', component: push, name: 'push'},
      {path: '/push/rule', component: rule, name: 'rule'},
      {path: '/push/ruleDetail', component: ruleDetail, name: 'ruleDetail'},
      {path: '/push/createRule', component: createRule, name: 'createRule'},
      {path: '/push/pushDetail', component: pushDetail, name: 'pushDetail'},
      {path: '/trial', component: trial},
      {path: '/trial/detail', component: trialdetail, name: 'trialDetail'},
      {path: '/check', component: check},
      {path: '/check/pushdetail', component: pushdetail, name: 'pushdetail'},
      {path: '/check/taskdetail', component: taskdetail, name: 'taskdetail'},
      {path: '/report/workload', component: workload},
      {path: '/report/task', component: reportTask},
      {path: '/report/record', component: record},
      {path: '/report/count', component: count},
      {path: '/system', component: system},
      {path: '/system/open', component: open, name: 'open'},
      {path: '/system/recharge', component: recharge, name: 'recharge'},
      {path: '/system/detail', component: systemDetail, name: 'systemDetail'},
      {path: '/feedback', component: feedback},
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
