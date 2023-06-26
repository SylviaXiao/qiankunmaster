<template>
  <transition name="showHeader">
    <div v-if="visible" class="header-animat">
      <a-layout-header
        v-if="visible"
        :class="[fixedHeader && 'ant-header-fixedHeader', sidebarOpened ? 'ant-header-side-opened' : 'ant-header-side-closed']"
        :style="{ padding: '0' }"
      >
        <div v-if="mode === 'sidemenu'" class="header" :class="{ between: device !== 'mobile' }">
          <multi-tab v-if="device !== 'mobile'" ref="multiTab" class="multi_tab" style="margin-top: 0.45rem; margin-left: 0; width: 50%"></multi-tab>
          <div class="between" style="height:100%;">
            <a-icon v-if="device === 'mobile'" class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle" />
            <global-notify v-if="$tools.hasPerm(`education:message:view`)"/>
            <user-menu></user-menu>
          </div>
        </div>
        <div v-else :class="['top-nav-header-index', theme]">
          <div class="header-index-wide">
            <div class="header-index-left">
              <logo class="top-nav-header" :show-title="device !== 'mobile'" />
              <s-menu v-if="device !== 'mobile'" mode="horizontal" :menu="menus" :theme="theme" />
              <a-icon v-else class="trigger" :type="collapsed ? 'menu-fold' : 'menu-unfold'" @click="toggle" />
            </div>
            <user-menu class="header-index-right"></user-menu>
          </div>
        </div>
      </a-layout-header>
      <!-- <a-drawer title="消息提醒" width="600" placement="right" :visible="messageVisible" :after-visible-change="afterVisibleChange" @close="onClose">
        <MessageList ref="MessageListModal"></MessageList>
      </a-drawer> -->
    </div>
  </transition>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../Menu/'
import Logo from '../tools/Logo'
import { mixin } from '@/utils/mixin'
import MultiTab from '@/components/MultiTab'
import MessageList from './modules/MessageList'
import { mapActions, mapState } from 'vuex'
import GlobalNotify from '@/components/GlobalNotify'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo,
    MultiTab,
    MessageList,
    GlobalNotify
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      // sidemenu, topmenu
      default: 'sidemenu'
    },
    menus: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    device: {
      type: String,
      required: false,
      default: 'desktop'
    }
  },
  data() {
    return {
      messageVisible: false,
      visible: true,
      schoolVisible: false,
      oldScrollTop: 0,
      branchId: null,
      autoExpandParent: true,
      schoolName: '',
      replaceFields: { children: 'children', title: 'name', key: 'branchId' }
    }
  },
  mounted() {
    document.body.addEventListener('scroll', this.handleScroll, { passive: true })
    console.log(this.info)
  },
  computed: {
    ...mapState({
      branches: state => state.user.branches,
      // schoolName: state => state.user.schoolName,
      info: state => state.user.info,
      message: state => state.user.message
    })
  },
  watch: {},
  methods: {
    afterVisibleChange(val) {
      if (val) {
        this.$refs.MessageListModal.initData()
      }
    },
    onClose() {
      this.messageVisible = false
    },
    bellClick() {
      this.messageVisible = !this.messageVisible
      if (this.messageVisible) {
        this.$store.commit('SET_MESSAGE', 0)
      }
    },
    getTree(arr) {
      if (!arr?.length) return
      arr.forEach((item, index) => {
        item.scopedSlots = { title: 'custom' }
        if (item.children && item.children.length > 0) {
          this.getTree(item.children)
        }
      })
    },
    ...mapActions(['swicthSchool']),
    handleScroll() {
      if (!this.autoHideHeader) {
        return
      }
      const scrollTop = document.body.scrollTop + document.documentElement.scrollTop
      if (!this.ticking) {
        this.ticking = true
        requestAnimationFrame(() => {
          if (this.oldScrollTop > scrollTop) {
            this.visible = true
          } else if (scrollTop > 300 && this.visible) {
            this.visible = false
          } else if (scrollTop < 300 && !this.visible) {
            this.visible = true
          }
          this.oldScrollTop = scrollTop
          this.ticking = false
        })
      }
    },
    toggle() {
      this.$emit('toggle')
    }
  },
  beforeDestroy() {
    document.body.removeEventListener('scroll', this.handleScroll, true)
  }
}
</script>

<style lang="less">
@import '~@/assets/style/index';
.header {
  height: 100%;
}

.header-animat {
  position: relative;
  z-index: 2;
}
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  transition: all 0.5s ease;
}
.showHeader-enter,
.showHeader-leave-to {
  opacity: 0;
}
.between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.schoolPop {
  height: 200px;
  padding-right: 20px !important;
  overflow-y: auto;
}
</style>
