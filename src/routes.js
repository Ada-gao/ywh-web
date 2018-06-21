import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import company from './views/company/company.vue'
// import product from './views/product/product.vue'
import salesman from './views/salesman/salesman.vue'
import dashboard from './views/dashboard/echarts.vue'
import list from './views/task/list.vue'
import task from './views/task/task.vue'
import dict from './views/parameter/dict.vue'
import parameter from './views/parameter/parameter.vue'
import workload from './views/report/workload.vue'
import reporttask from './views/report/task.vue'
import reportproduct from './views/report/product.vue'
import companyDetail from './views/company/create.vue'
import salesmanDetail from './views/salesman/detail.vue'

let routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  // { path: '/main', component: Main },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-dashboard',
    leaf: true,
    children: [
      {path: '/dashboard', component: dashboard, name: '仪表盘'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-sitemap',
    leaf: true,
    children: [
      {path: '/company', component: company, name: '公司管理'},
      {path: '/company/detail/:id', component: companyDetail, name: '新建公司'}
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
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-book',
    leaf: true, // 只有一个节点
    children: [
      {path: '/salesman', component: salesman, name: '销售管理'},
      {path: '/salesman/detail/:id', component: salesmanDetail, name: '新建销售'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-phone-square',
    leaf: true, // 只有一个节点
    children: [
      {path: '/list', component: list, name: '名单管理'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-phone-square',
    leaf: true, // 只有一个节点
    children: [
      {path: '/task', component: task, name: '任务管理'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '参数管理',
    iconCls: 'fa fa-cog',
    children: [
      {path: '/dict', component: dict, name: '数据字典'},
      {path: '/parameter', component: parameter, name: '参数设置'}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '报表统计',
    iconCls: 'fa fa-wpforms',
    children: [
      {path: '/workload', component: workload, name: '工作量'},
      {path: '/reporttask', component: reporttask, name: '外呼任务'},
      {path: '/reportproduct', component: reportproduct, name: '产品外呼'}
    ]
  },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  }
]

export default routes
