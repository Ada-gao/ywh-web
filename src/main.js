import Vue from 'vue'
import 'babel-polyfill'
import 'es6-promise-polyfill'
import 'es6-promise'
// import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
// import store from './vuex/store'
// import Vuex from 'vuex'
import 'nprogress/nprogress.css'
import routes from './common/routes'
import 'font-awesome/css/font-awesome.min.css'
// import timestamp from './common/js/util'
import App from './App'

// Vue.filter('timestamp', timestamp.getLocalTime)

Vue.use(ElementUI)
Vue.use(VueRouter)
// Vue.use(Vuex)

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem('token')) {
    if (to.path === '/login') {
      next({ path: '/' })
    }else{
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

// Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
//   return moment(dataStr).format(pattern)
// })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

export {router}
