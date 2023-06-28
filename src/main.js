import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import { filters } from './filter'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import { VueCropper } from 'vue-cropper'
import MultiTab from '@/components/MultiTab'
import Print from 'vue-print-nb'
import globalVar from '@/utils/GlobalVar'
import BigNumber from 'bignumber.js'
import perm from '@/core/directives/perm'
import { registerMicroApps, start ,initGlobalState} from 'qiankun';

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

Vue.use(VueCropper)
import tools from '@/tools/common'
import Verify from '@/tools/verify'
// import Echarts from 'echarts'
import * as echarts from 'echarts'

Vue.prototype.$tools = tools
Vue.prototype.$tabs = MultiTab
Vue.prototype.$verify = Verify
Vue.prototype.$charts = echarts
// 全局变量管理
Vue.prototype._globalVar = globalVar
Vue.prototype.$number = num => new BigNumber(num)
import bootstrap1 from './core/bootstrap'
import './core/use'
import './permission' // permission control
import './utils/filter' // global filter

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
function IsPC() {
  var userAgentInfo = navigator.userAgent
  var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  var flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}
function setRem() {
  //  PC端
  if (IsPC()) {
    if (Number(document.body.clientWidth) > 1383) {
      // // debugger
      // let baseSize = 100
      // let basePc = baseSize / 1920 // 表示1920的设计图,使用100PX的默认值
      // let vW = window.innerWidth // 当前窗口的宽度
      // // let vH = window.innerHeight; // 当前窗口的高度
      // // 非正常屏幕下的尺寸换算
      // let rem = vW * basePc // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应font-size值
      // document.documentElement.style.fontSize = rem + 'px'
      document.documentElement.style.fontSize = '100px'
    } else {
      document.documentElement.style.fontSize = '100px'
    }
  } else {
    document.documentElement.style.fontSize = '100px'
  }
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function() {
  setRem()
}

import GlobalComponents from '@/utils/globalComponents'

Vue.use(GlobalComponents)
Vue.use(Print)
// new Vue({
//   router,
//   store,
//   created() {
//     bootstrap()
//   },
//   render: h => h(App)
// }).$mount('#app')

// 开发环境添加自动生成号码,身份证号
if (process.env.NODE_ENV === 'development') {
  import(`./fillForm`).then(fillForm => {
    window.fill = new fillForm.default()
  })
}
//注册微应用
let propsData = {
  sex: '男',
  age: 18,
  userName: '小东'
}
const actions = initGlobalState(propsData)
// 主项目项目监听和修改(在项目中任何需要监听的地方进行监听)
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log('改变前的值 ', prev)
  console.log('改变后的值 ', state)
})
// 将actions对象绑到Vue原型上，为了项目中其他地方使用方便
Vue.prototype.$actions = actions
const apps = [
  {
    name: 'vueApp1', // 应用的名字
    entry: '//localhost:4447', // 默认会加载这个html 解析里面的js 动态的执行 （子应用必须支持跨域）fetch
    container: '#qiankun', // 容器名
    activeRule: '/vueApp1', // 激活的路径
    props: propsData
  },
  {
    name: 'vueApp2', // 应用的名字
    entry: '//localhost:8081', // 默认会加载这个html 解析里面的js 动态的执行 （子应用必须支持跨域）fetch
    container: '#qiankun', // 容器名
    activeRule: '/erp/qiankun/vue', // 激活的路径
    props: propsData
  }
]
registerMicroApps(apps, {
  beforeLoad: [
    app => {
      console.log('=======>before load', app)
      return Promise.resolve()
    }
  ],
  beforeMount: [
    app => {
      console.log('========>before mount', app)
      return Promise.resolve()
    }
  ],
  afterUnmount: [
    app => {
      console.log('========>after unload', app)
      return Promise.resolve()
    }
  ]
}) // start up micro app
start({ prefetch: true })
import './public-path'
let instance = null
function render(props = {}) {
  const { container } = props
  instance = new Vue({
    router,
    store,
    created() {
      bootstrap1()
    },
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app') // 这里是挂载到自己的html中  基座会拿到这个挂载后的html 将其插入进去
}

if (!window.__POWERED_BY_QIANKUN__) {
  // 默认独立运行
  render()
}

// 父应用加载子应用，子应用必须暴露三个接口：bootstrap、mount、unmount
// 子组件的协议就ok了
export async function bootstrap(props) {
  console.log('[pm-app] bootstraped')
}

export async function mount(props) {
  console.log('[pm-app] mount', props)
  render(props)
}

export async function unmount(props) {
  console.log('[pm-app] unmount', props)
  instance.$destroy()
  instance = null
}
