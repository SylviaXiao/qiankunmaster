import Vue from 'vue'
import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
import { mapState } from 'vuex'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// const mixinsComputed = Vue.config.optionMergeStrategies.computed
// const mixinsMethods = Vue.config.optionMergeStrategies.methods

const mixin = {
  computed: {
    ...mapState({
      layoutMode: state => state.app.layout,
      navTheme: state => state.app.theme,
      primaryColor: state => state.app.color,
      colorWeak: state => state.app.weak,
      fixedHeader: state => state.app.fixedHeader,
      fixSiderbar: state => state.app.fixSiderbar,
      fixSidebar: state => state.app.fixSiderbar,
      contentWidth: state => state.app.contentWidth,
      autoHideHeader: state => state.app.autoHideHeader,
      sidebarOpened: state => state.app.sidebar,
      multiTab: state => state.app.multiTab
    })
  },
  data() {
    return {
      // rpIframeHeight: '250px',
      rpSpinning: false
    }
  },
  mounted() {
    window.addEventListener(
      'message',
      event => {
        // console.log(event)
        // this.rpIframeHeight = '100'
      },
      false
    )
  },
  methods: {
    getToken() {
      return Vue.ls.get(ACCESS_TOKEN, '')
    },
    getSchoolId() {
      return this.$store.getters.school_id || null
    },
    getUserId() {
      return this.$store.getters.userInfo.user.id || null
    },
    isTopMenu() {
      return this.layoutMode === 'topmenu'
    },
    isSideMenu() {
      return !this.isTopMenu()
    },
    postMsg() {
      this.rpSpinning = false
      // this.$refs.monitor.contentWindow.postMessage(
      //   { tokenDanse: this.getToken(), editAble, isPortal: false },
      //   this.IFRAME_SRC
      // )
    }
  }
}

const mixinDevice = {
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  methods: {
    isMobile() {
      return this.device === DEVICE_TYPE.MOBILE
    },
    isDesktop() {
      return this.device === DEVICE_TYPE.DESKTOP
    },
    isTablet() {
      return this.device === DEVICE_TYPE.TABLET
    }
  }
}

const AppDeviceEnquire = {
  mounted() {
    const { $store } = this
    deviceEnquire(deviceType => {
      switch (deviceType) {
        case DEVICE_TYPE.DESKTOP:
          $store.commit('TOGGLE_DEVICE', 'desktop')
          $store.dispatch('setSidebar', true)
          break
        case DEVICE_TYPE.TABLET:
          $store.commit('TOGGLE_DEVICE', 'tablet')
          $store.dispatch('setSidebar', true)
          break
        case DEVICE_TYPE.MOBILE:
        default:
          $store.commit('TOGGLE_DEVICE', 'mobile')
          $store.dispatch('setSidebar', true)
          break
      }
    })
  }
}

const verifyMixin = {
  methods: {
    verify(rule, value, callback) {
      if (value && /^1[3456789]\d{9,10}$/.test(value)) {
        callback()
      } else if (!value) {
        callback()
      } else {
        callback('请输入正确的手机号码')
      }
    }
  }
}
//全局
//清楚keepAlive缓存
const clearKeepAliveMixin = {
  methods: {
    clearKeepAlive(that) {
      let vnode = that.$vnode
      let parentVnode = vnode.parent
      if (parentVnode && parentVnode.componentInstance.cache) {
        var key = vnode.key == null ? vnode.componentOptions.Ctor.cid + (vnode.componentOptions.tag ? `::${vnode.componentOptions.tag}` : '') : vnode.key
        var cache = parentVnode.componentInstance.cache
        var keys = parentVnode.componentInstance.keys
        if (cache[key]) {
          that.$destroy()
          // remove key
          if (keys.length) {
            var index = keys.indexOf(key)
            if (index > -1) {
              keys.splice(index, 1)
            }
          }
          cache[key] = null
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.meta.clearAlive) {
      next(vm => vm.clearKeepALive(vm))
    } else {
      next()
    }
  }
}

export { mixin, AppDeviceEnquire, mixinDevice, verifyMixin, clearKeepAliveMixin }
