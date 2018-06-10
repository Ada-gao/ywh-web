import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
// import Devices from './views/nav1/Devices.vue'
// import AppInfos from './views/nav1/AppInfos.vue'
// import AppBuildInfos from './views/nav1/AppBuildInfos.vue'
// import Form from './views/nav1/Form.vue'
// import user from './views/nav1/user.vue'
import Rates from './views/nav2/Rates.vue'
// import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

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
      {path: '/dashboard', component: echarts, name: 'Dashboard'}
    ]
  },
  // {
  //   path: '/',
  //   component: Home,
  //   name: '基础信息',
  //   iconCls: 'fa fa-database',
  //   children: [
  //     {path: '/devices', component: Devices, name: '设备信息'},
  //     {path: '/appInfos', component: AppInfos, name: 'APP信息'},
  //     {path: '/appBuildInfos', component: AppBuildInfos, name: 'Build信息'}
  //   ]
  // },
  {
    path: '/',
    component: Home,
    name: '基础参数',
    iconCls: 'fa fa-cog',
    children: [
      {path: '/rates', component: Rates, name: '贷款利率配置'}
    ]
  },
  // {
  //   path: '/',
  //   component: Home,
  //   name: '',
  //   iconCls: 'fa fa-address-card',
  //   leaf: true, // 只有一个节点
  //   children: [
  //     {path: '/page6', component: Page6, name: '导航三'}
  //   ]
  // },
  {
    path: '*',
    hidden: true,
    redirect: {path: '/404'}
  }
]

export default routes
