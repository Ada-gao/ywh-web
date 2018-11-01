import Vue from 'vue'
import 'babel-polyfill'
import 'es6-promise-polyfill'
import 'es6-promise'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/iconfont/iconfont.css';
import '@/styles/app.scss';
import 'font-awesome/css/font-awesome.min.css'
import 'nprogress/nprogress.css'
import VueRouter from 'vue-router'
import routes from './common/routes'
import App from './App'

import * as Api from "@/api/api"
import * as Utils  from '@/common/js/util'
import vuePicturePreview from 'vue-picture-preview'
Vue.prototype.Api = Api
Vue.prototype.Utils = Utils
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(vuePicturePreview)
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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

export {router}
