import Vue from 'vue'
import 'babel-polyfill'
import 'es6-promise-polyfill'
import 'es6-promise'
import App from './App'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import timestamp from './common/js/util'
import { getToken } from '@/common/js/auth'

Vue.filter('timestamp', timestamp.getLocalTime)

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const router = new VueRouter({
  mode: 'history',
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
})

router.afterEach(transition => {
  NProgress.done()
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export {router}
