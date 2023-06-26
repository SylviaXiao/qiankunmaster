<template>
  <div>
    <template v-if="!poweredByQiankun">
      <a-layout :class="['layout', device]" style="height: 100vh;">
        <!-- SideMenu -->
        <a-drawer
          v-if="isMobile()"
          placement="left"
          :wrapClassName="`drawer-sider ${navTheme}`"
          :closable="false"
          @toggle="toggleFalse"
          :visible="collapsed"
          @close="drawerClose"
        >
          <side-menu mode="inline" :show="show" :menus="menus" :theme="navTheme" :collapsed="false" :collapsible="true" @menuSelect="menuSelect"></side-menu>
        </a-drawer>
        <!-- isSideMenu() -->
        <side-menu
          v-else-if="!isMobile()"
          mode="inline"
          :menus="menus"
          :show="show"
          :theme="navTheme"
          @toggle="toggleFalse"
          :collapsed="collapsed"
          :collapsible="true"
        ></side-menu>
        <!-- :collapsed="isMobile() ? collapsed : false" -->
        <a-layout :class="[layoutMode, `content-width-${contentWidth}`]" :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">
          <!-- layout header -->
          <global-header :mode="layoutMode" :menus="menus" :theme="navTheme" :collapsed="collapsed" :device="device" @toggle="toggle" />

          <!-- layout content -->
          <a-layout-content :style="{ height: '100%', padding: '24px 20px', paddingTop: fixedHeader ? '64px' : '0', overflow: 'auto', position: 'relative ' }">
            <!-- <multi-tab v-if="multiTab" ref="multiTab"></multi-tab> -->
            <div>
              <transition name="page-transition">
                <!--         <a-spin :spinning="true">-->
                <route-view class="view"></route-view>
                <!--         </a-spin>-->
              </transition>
            </div>
          </a-layout-content>

          <!-- layout footer -->
          <!-- <a-layout-footer> -->
          <!-- <global-footer /> -->
          <!-- </a-layout-footer> -->

          <!-- Setting Drawer (show in development mode) -->
          <!--      <setting-drawer v-if="!production"></setting-drawer>-->
        </a-layout>
        <div class="messageList ">
          <div class="messageTips" v-for="(item, index) in messageList" :key="index">
            <div class="title">
              <div>{{ item.title }}</div>
              <a-icon type="close" @click="closeMessage(index)" />
            </div>
            <div class="content">
              <div class="service msg-content" v-html="item.content" @click="toHref($event, item.targetId, index)">
                <!-- <span style="font-weight: 700;color: rgb(16,16,16);">客服依依</span>
                <span style="color: rgb(16, 16, 16);">分配</span>
                <span style="color: rgb(25, 169, 123);">【<span>张三/13978787878</span>】</span> -->
              </div>
              <!-- <div class="newResource">新资源，请及时处理<a-icon style="color:rgb(197, 194, 194);margin-left:5px;" type="snippets" /></div> -->
              <div class="time">{{ item.formateTime }}</div>
            </div>
          </div>
        </div>
      </a-layout>
    </template>
    <template v-else>
      <div :style="{ height: '100%', position: 'relative' }">
        <transition name="page-transition">
          <!--         <a-spin :spinning="true">-->
          <route-view class="view"></route-view>
          <!--         </a-spin>-->
        </transition>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { triggerWindowResizeEvent } from '@/utils/util'
import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'

import RouteView from './RouteView'
// import MultiTab from '@/components/MultiTab'
import SideMenu from '@/components/Menu/SideMenu'
import GlobalHeader from '@/components/GlobalHeader'
import GlobalFooter from '@/components/GlobalFooter'
import SettingDrawer from '@/components/SettingDrawer'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
const baesUrl = process.env.VUE_APP_URL
const poweredByQiankun = window.__POWERED_BY_QIANKUN__
export default {
  name: 'BasicLayout',
  mixins: [mixin, mixinDevice],
  components: {
    RouteView,
    // MultiTab,
    SideMenu,
    GlobalHeader,
    GlobalFooter,
    SettingDrawer
  },
  data() {
    return {
      collapsed: false,
      menus: [],
      show: true,
      // navTheme: 'light',
      messageList: [],
      websock: null,
      timeoutObj: null,
      timeout: 60000,
      webSorcketInited: false,
      poweredByQiankun
    }
  },
  computed: {
    navStyle() {
      return this._globalVar.defaultRouter.includes(this.selectKey)
    },
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    contentPaddingLeft() {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '256px'
      }
      return '100px'
    }
  },
  watch: {
    sidebarOpened(val) {
      this.collapsed = !val
    }
    // mainMenu: {
    //   deep: true,
    //   immediate: true,
    //   handler(n) {
    //     console.log(n)
    //   }
    // }
  },
  created() {
    this.menus = this.mainMenu.find(item => item.path === '/').children
    this.collapsed = !this.sidebarOpened
    // this.$route.meta.keepAlive = true
  },
  mounted() {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
    // this.initWebSocket()
  },
  methods: {
    toggleFalse(data) {
      console.log(data)
      this.show = data
    },
    initWebSocket() {
      if (this.webSorcketInited) {
        return
      }
      this.webSorcketInited = true
      // 初始化weosocket
      const token = Vue.ls.get(ACCESS_TOKEN)
      let baesUrls = baesUrl
      let protocol = window.location.protocol
      if (baesUrls.indexOf(protocol) === -1) {
        baesUrls = protocol + '//' + window.location.host + baesUrl
      }
      if (protocol === 'https:') {
        baesUrls = baesUrls.replace(protocol, 'wss:')
      } else {
        baesUrls = baesUrls.replace(protocol, 'ws:')
      }
      this.websock = new WebSocket(`${baesUrls}/ws/asset?X-Token=${token}`)
      // 接收数据
      this.websock.onmessage = this.websocketonmessage
      // 发送数据
      this.websock.onopen = this.websocketonopen
      // 重连
      this.websock.onerror = this.websocketonerror
      // 关闭
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() {
      console.log('连接成功')
      // 连接建立之后执行send方法发送数据
      const token = Vue.ls.get(ACCESS_TOKEN)
      const obj = {
        head: { token }
      }
      // 登录
      this.websocketsend(JSON.stringify(obj))
      // 这里是第一次建立连接所发送的信息，应由前后端商量后决定
      this.reset().start()
    },
    websocketonerror(data) {
      // 连接建立失败重连
      console.log('websocketonerror, 连接失败', data)
    },
    websocketonmessage(e) {
      // 数据接收
      if (e.data) {
        let data = JSON.parse(e.data)
        if (!data.heartbeat) {
          this.getMessage(data)
        }
      }
      console.log('WebSocket接收数据成功', e)
    },
    websocketsend(data) {
      if (this.webSorcketInited) {
        // 数据发送
        console.log('WebSocket发送数据成功')
        // 发送消息
        this.websock.send(data)
      }
    },
    websocketclose(e) {
      this.webSorcketInited = false
      let that = this
      // 关闭
      clearTimeout(this.timeoutObj)
      console.log('websocketclose -> 1')
      setTimeout(function() {
        console.log('websocketclose -> 2')
        that.initWebSocket()
      }, 10000)
      console.log('断开连接', e)
    },
    // 心跳重置
    reset() {
      clearTimeout(this.timeoutObj)
      return this
    },
    // 心跳开始
    start() {
      const t = this
      const token = Vue.ls.get(ACCESS_TOKEN)
      this.timeoutObj = setInterval(() => {
        if (t.webSorcketInited) {
          const data = {
            head: { token }
          }
          t.websock.send(JSON.stringify(data))
        }
      }, this.timeout)
    },
    closeMessage(index) {
      this.messageList.splice(index, 1)
      let message = this.$store.getters.message
      if (message.length > 0) {
        this.$store.commit('SET_MESSAGE', message - 1)
      }
    },
    getMessage(datas) {
      let message = this.$store.getters.message + 1
      this.$store.commit('SET_MESSAGE', message)
      let _this = this
      if (_this.messageList.length >= 3) {
        this.messageList.splice(0, 1)
      }
      let date = new Date()
      _this.messageList.push(
        Object.assign(
          {
            time: date.getTime(),
            formateTime: moment(date).format('YYYY-MM-DD')
          },
          datas
        )
      )
      setTimeout(() => {
        if (this.messageList && this.messageList.length > 0) {
          this.messageList.forEach((item, index) => {
            if (item.time == date.getTime()) {
              this.messageList.splice(index, 1)
            }
          })
        }
      }, 180000)
    },
    toHref(e, id, index) {
      if (e.target.dataset && e.target.dataset.route) {
        this.$router.push({ path: `${e.target.dataset.route}/${id}` })
      } else {
        e.target.childNodes.forEach(item => {
          if (item.dataset && item.dataset.route) {
            this.$router.push({ path: `${item.dataset.route}/${id}` })
          }
        })
      }
      this.messageList.splice(index, 1)
      let message = this.$store.getters.message
      if (message.length > 0) {
        this.$store.commit('SET_MESSAGE', message - 1)
      }
    },
    ...mapActions(['setSidebar']),
    toggle() {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    paddingCalc() {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '256px' : '100px'
      } else {
        left = (this.isMobile() && '0') || (this.fixSidebar && '100px') || '0'
      }
      return left
    },
    menuSelect(obj) {
      if (!this.isDesktop()) {
        this.collapsed = false
      }
    },
    drawerClose() {
      this.collapsed = false
    }
  }
}
</script>

<style lang="less">
@import url('../components/global.less');

/*
   * The following styles are auto-applied to elements with
   * transition="page-transition" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the page transition by editing
   * these styles.
   */

.page-transition-enter {
  opacity: 0;
}

.page-transition-leave-active {
  opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.view {
  width: 100%;
  /*height: 100%;*/
  // overflow: hidden;
}
.messageList {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99999;
  .messageTips {
    width: 229px;
    min-height: 106px;
    background-color: rgba(247, 247, 247);
    font-size: 14px;
    padding: 6px 5px;
    margin: 0 0 10px 0;
    .title {
      display: flex;
      justify-content: space-between;
      padding: 0 0 2px;
    }
    .content {
      .service {
        // display: flex;
        padding: 10px 0 5px 0;
        font-size: 12px;
        // > :nth-child(1) {
        //   font-weight: 700;
        //   color: rgb(16, 16, 16);
        // }
        // > :nth-child(2) {
        //   color: rgb(16, 16, 16);
        // }
        // > :nth-child(3) {
        //   > span {
        //     color: rgb(25, 169, 123);
        //   }
        // }
      }
      .newResource {
        font-size: 12px;
        color: rgb(16, 16, 16);
      }
      .time {
        font-size: 12px;
        color: rgba(8, 7, 7, 0.38);
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
