import Vue from 'vue'
import App from './App'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
import 'font-awesome/css/font-awesome.min.css'
import timestamp from './common/js/util'
import { getToken } from '@/common/js/auth'

// Mock.bootstrap()

Vue.filter('timestamp', timestamp.getLocalTime)

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

// NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.sysUser === '') {
        store.dispatch('GetUser', getToken()).then(res => {
          console.log('测试' + res)
          console.log(res)
          // 每次请求的回调
        })
      }
      next()
    }
  } else {
    if (to.path === '/login') { // 去往登陆页
      next()
    } else {
      next('/login')
    }
  }
  // if (to.path === '/login') {
  //   sessionStorage.removeItem('token')
  // }
  // let user = sessionStorage.getItem('token')
  // // console.log(user)
  // if (!user && to.path !== '/login') {
  //   next({ path: '/login' })
  // } else {
  //   store.dispatch('GetUser', user)
  //   next()
  // }
})

router.afterEach(transition => {
  NProgress.done()
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

new Vue({
  // el: '#app',
  // template: '<App/>',
  router,
  store,
  // components: { App }
  render: h => h(App)
}).$mount('#app')
