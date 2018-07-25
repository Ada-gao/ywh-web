import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import company from './views/company/company.vue'
// import product from './views/product/product.vue'
import salesman from './views/salesman/salesman.vue'
import dashboard from './views/dashboard/echarts.vue'
import list from './views/namelist'
import nameexcel from './views/namelist/importExcel.vue'
import task from './views/task/task.vue'
import newTask from './views/task/newTask.vue'
import tasklist from './views/task/detail.vue'
import dict from './views/parameter/dict.vue'
import parameter from './views/parameter/parameter.vue'
import workload from './views/report/workload.vue'
import reporttask from './views/report/task.vue'
import reportproduct from './views/report/product.vue'
import companyDetail from './views/company/create.vue'
import salesmanDetail from './views/salesman/detail.vue'
import excel from './views/salesman/importExcel.vue'

import trial from './views/trial'
import trialdetail from './views/trial/detail.vue'
import feedback from './views/feedback'
import fddetail from './views/feedback/detail.vue'

let routes = [
  {
    menuId: 1,
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    menuId: 2,
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  // { path: '/main', component: Main },
  {
    menuId: 3,
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-home',
    leaf: true,
    redirect: '/dashboard',
    children: [
      {menuId: 31, path: '/dashboard', component: dashboard, name: '首页-工作台'}
    ]
  },
  {
    menuId: 4,
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-sitemap',
    leaf: true,
    children: [
      {menuId: 41, path: '/company', component: company, name: '公司管理'},
      {menuId: 42, path: '/company/detail', name: '/company/detail', component: companyDetail}
    ]
  },
  // {
  //   path: '/',
  //   component: Home,
  //   name: '',
  //   iconCls: 'fa fa-globe',
  //   leaf: true,
  //   children: [
  //     {path: '/product', component: product, name: '产品管理'}
  //   ]
  // },
  {
    menuId: 5,
    path: '/',
    component: Home,
    name: 'sale',
    iconCls: 'fa fa-users',
    leaf: true, // 只有一个节点
    children: [
      {menuId: 51, path: '/salesman', component: salesman, name: '销售管理'},
      {menuId: 52, path: '/salesman/detail', component: salesmanDetail, name: 'salesmanDetail'},
      {menuId: 53, path: '/salesman/excel', component: excel, name: '销售批量导入'}
    ]
  },
  {
    menuId: 6,
    path: '/',
    component: Home,
    name: 'namelist',
    iconCls: 'fa fa-list-alt',
    leaf: true, // 只有一个节点
    children: [
      {menuId: 61, path: '/list', component: list, name: '名单管理'},
      {menuId: 62, path: '/list/excel', component: nameexcel, name: '名单批量导入'}
    ]
  },
  {
    menuId: 7,
    path: '/',
    component: Home,
    name: 'task',
    iconCls: 'fa fa-phone',
    leaf: true, // 只有一个节点
    children: [
      {menuId: 71, path: '/task', component: task, name: '任务管理'},
      {menuId: 72, path: 'task/newTask', component: newTask, name: '新建任务'},
      {menuId: 73, path: 'task/detail', component: tasklist, name: 'taskDetail'}
    ]
  },
  {
    menuId: 8,
    path: '/',
    component: Home,
    name: 'trial',
    iconCls: 'fa fa-list-ul',
    leaf: true, // 只有一个节点
    children: [
      {menuId: 81, path: '/trial', component: trial, name: '试用申请'},
      {menuId: 82, path: '/trial/detail', component: trialdetail, name: 'trialDetail'}
    ]
  },
  {
    menuId: 9,
    path: '/',
    component: Home,
    name: 'feedback',
    iconCls: 'fa fa-question-circle',
    leaf: true, // 只有一个节点
    children: [
      {menuId: 91, path: '/feedback', component: feedback, name: '问题反馈'},
      {menuId: 92, path: '/feedback/detail', component: fddetail, name: 'fdDetail'}
    ]
  },
  {
    menuId: 10,
    path: '/',
    component: Home,
    name: '参数管理',
    iconCls: 'fa fa-cog',
    children: [
      {menuId: 101, path: '/dict', component: dict, name: '数据字典', iconCls: 'fa fa-cog'},
      {menuId: 102, path: '/parameter', component: parameter, name: '参数设置', iconCls: 'fa fa-cog'}
    ]
  },
  {
    menuId: 11,
    path: '/',
    component: Home,
    name: '报表统计',
    iconCls: 'fa fa-cog',
    children: [
      {menuId: 111, path: '/workload', component: workload, name: '工作量', iconCls: 'fa fa-wpforms'},
      {menuId: 112, path: '/reporttask', component: reporttask, name: '外呼任务', iconCls: 'fa fa-wpforms'},
      {menuId: 113, path: '/reportproduct', component: reportproduct, name: '产品外呼', iconCls: 'fa fa-wpforms'}
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  }
]

export default routes
