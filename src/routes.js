import Login from './views/Login'
import NotFound from './views/404'
import Home from './views/Home'
// 1、首页工作台
import dashboard from './views/dashboard/echarts'
// 2、账户管理
import account from './views/account/account'
// 3、公司管理
import company from './views/company/company'
import companyCreate from './views/company/create'
import companyDetail from './views/company/detail'
// 4、销售管理
import salesman from './views/salesman/salesman'
import salesmanDetail from './views/salesman/detail'
import excel from './views/salesman/importExcel'
// 5、名单管理
import list from './views/namelist'
import nameexcel from './views/namelist/importExcel'
// 6、任务管理
import task from './views/task/task'
import newTask from './views/task/newTask'
import tasklist from './views/task/detail'
// 7、消息推送管理
import push from './views/push/push'
// 8、试用管理
import trial from './views/trial'
import trialdetail from './views/trial/detail'
// 9、审核管理
import check from './views/check/check'
// 10、报表统计
import workload from './views/report/workload'
import reportTask from './views/report/task'
import record from './views/report/record'
import count from './views/report/count'
// 11、系统管理
import system from './views/system/system'
// 12、问题反馈
import feedback from './views/feedback'
import fddetail from './views/feedback/detail'

let routes = [
  {
    menuId: 1,
    path: '/login',
    component: Login,
    hidden: true
  },
  {
    menuId: 2,
    path: '/404',
    component: NotFound,
    hidden: true
  },
  {
    menuId: 3,
    path: '/',
    component: Home,
    iconCls: 'fa fa-home',
    leaf: true, // 只有一个节点
    children: [
      {menuId: 31, path: '/dashboard', component: dashboard, name: '首页-工作台'}
    ]
  },
  {
    menuId: 4,
    path: '/',
    component: Home,
    iconCls: 'fa fa-sitemap',
    leaf: true,
    children: [
      {menuId: 41, path: '/account', component: account, name: '账户管理'}
    ]
  },
  {
    menuId: 5,
    path: '/',
    component: Home,
    iconCls: 'fa fa-sitemap',
    leaf: true,
    children: [
      {menuId: 51, path: '/company', component: company, name: '公司管理'},
      {menuId: 52, path: '/company/create', name: 'create', component: companyCreate},
      {menuId: 53, path: '/company/detail', name: 'detail', component: companyDetail}
    ]
  },
  {
    menuId: 6,
    path: '/',
    component: Home,
    iconCls: 'fa fa-users',
    leaf: true,
    children: [
      {menuId: 61, path: '/salesman', component: salesman, name: '销售管理'},
      {menuId: 62, path: '/salesman/detail', component: salesmanDetail, name: 'salesmanDetail'},
      {menuId: 63, path: '/salesman/excel', component: excel, name: '销售批量导入'}
    ]
  },
  {
    menuId: 7,
    path: '/',
    component: Home,
    iconCls: 'fa fa-list-alt',
    leaf: true,
    children: [
      {menuId: 71, path: '/list', component: list, name: '名单管理'},
      {menuId: 72, path: '/list/excel', component: nameexcel, name: '名单批量导入'}
    ]
  },
  {
    menuId: 8,
    path: '/',
    component: Home,
    iconCls: 'fa fa-phone',
    leaf: true,
    children: [
      {menuId: 81, path: '/task', component: task, name: '任务管理'},
      {menuId: 82, path: '/task/newTask', component: newTask, name: '新建任务'},
      {menuId: 83, path: '/task/detail', component: tasklist, name: 'taskDetail'}
    ]
  },
  {
    menuId: 9,
    path: '/',
    component: Home,
    iconCls: 'fa fa-phone',
    leaf: true,
    children: [
      {menuId: 91, path: '/push', component: push, name: '消息推送管理'}
    ]
  },
  {
    menuId: 10,
    path: '/',
    component: Home,
    iconCls: 'fa fa-list-ul',
    leaf: true,
    children: [
      {menuId: 101, path: '/trial', component: trial, name: '试用管理'},
      {menuId: 102, path: '/trial/detail', component: trialdetail, name: 'trialDetail'}
    ]
  },
  {
    menuId: 11,
    path: '/',
    component: Home,
    iconCls: 'fa fa-phone',
    leaf: true,
    children: [
      {menuId: 111, path: '/check', component: check, name: '审核管理'}
    ]
  },
  {
    menuId: 12,
    path: '/',
    component: Home,
    name: '报表统计',
    iconCls: 'fa fa-cog',
    leaf: false,
    children: [
      {menuId: 121, path: '/report/workload', component: workload, name: '工作量统计', iconCls: 'fa fa-wpforms'},
      {menuId: 122, path: '/report/task', component: reportTask, name: '外呼任务统计', iconCls: 'fa fa-wpforms'},
      {menuId: 123, path: '/report/record', component: record, name: '历史通话记录', iconCls: 'fa fa-wpforms'},
      {menuId: 124, path: '/report/count', component: count, name: '话务统计', iconCls: 'fa fa-wpforms'}
    ]
  },
  {
    menuId: 13,
    path: '/',
    component: Home,
    iconCls: 'fa fa-phone',
    leaf: true,
    children: [
      {menuId: 131, path: '/system', component: system, name: '系统管理'}
    ]
  },
  {
    menuId: 14,
    path: '/',
    component: Home,
    iconCls: 'fa fa-question-circle',
    leaf: true,
    children: [
      {menuId: 141, path: '/feedback', component: feedback, name: '问题反馈'},
      {menuId: 142, path: '/feedback/detail', component: fddetail, name: 'fddetail'}
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  }
]

export default routes
