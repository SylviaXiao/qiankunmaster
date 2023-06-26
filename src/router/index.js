import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: window.__POWERED_BY_QIANKUN__ ? '/pm' : '/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
