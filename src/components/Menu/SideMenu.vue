<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null]"
    :width="navStyle || !show ? '1rem' : '2.56rem'"
    style="display:flex;"
    v-model="collapse"
    :collapsible="collapsible"
    :trigger="null"
    :collapsedWidth="navStyle || !show ? '1rem' : '2.56rem'"
  >
    <!-- @breakpoint="onBreakpoint" -->
    <!-- breakpoint="sm" -->
    <div style=" background-color: #1BA97B;">
      <logo @changeKeys="changeKeys" />
      <!-- navStyle && -->
      <!-- v-if="!isMobile()" -->
      <secMenu
        :collapsed="collapsed"
        :menu="menu"
        :theme="theme"
        class="fMenu"
        @toggleFalse="toggleFalse"
        @changeKeys="changeKeys"
        ref="fMenu"
        :pick="selectKey"
      />
      <!-- <s-menu :collapsed="collapsed" :menu="menu" :theme="theme" :mode="mode" @select="onSelect" v-if="isMobile()" style="width:2rem"></s-menu> -->
    </div>
    <!-- && selectKey != '/home' -->
    <!-- v-show="!collapsed" -->
    <!-- !isMobile() &&  -->
    <div :class="show ? 'sub ' : 'sub subnone'">
      <div v-if="!navStyle">
        <menuExport
          :isMobile="isMobile()"
          :collapsed="collapsed"
          :menu="secMenus"
          :theme="theme"
          :mode="mode"
          :show="show"
          @select="onSelect"
          @changeKeys="changeKeys"
          @toggle="toggle"
          class="secMenu"
          ref="secMenu"
        ></menuExport>
      </div>
    </div>
  </a-layout-sider>
</template>

<script>
import Logo from '@/components/tools/Logo'
import SMenu from './index'
import secMenu from './secMenu'
import menuExport from './menuExport'
// import createTimePicker from './menuExport'
import { mixin, mixinDevice } from '@/utils/mixin'
import {} from '@/utils/GlobalVar'
export default {
  name: 'SideMenu',
  data() {
    return {
      selectKey: '/homepage',
      secMenus: [],
      menu: [],
      collapse: false
    }
  },
  components: { Logo, SMenu, secMenu, menuExport },
  mixins: [mixin, mixinDevice],
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  watch: {
    collapsed: {
      immediate: true,
      deep: true,
      handler(n, o) {
        this.collapse = n
      }
    },
    menus: {
      immediate: true,
      deep: true,
      handler(n, o) {
        this.menu = n
        // n.forEach((item, index) => {
        //   if (item.path == '/home') {
        //     this.menu.splice(index, 1)
        //   }
        // })
        if (!this.secMenus.name) {
          this.changeMenu(n[0])
        }
      }
    },
    selectKey(n) {},
    $route(n) {
      if (this.selectKey !== n.matched[1].path) {
        this.selectKey = n.matched[1].path
      }
      // this.$refs.fMenu.selected = [this.selectKey]
      let val = this.menus.find(item => item.path === n.matched[1].path)
      this.changeMenu(val)
    }
  },
  mounted() {
    let path = this.$route.matched[1].path
    if (path !== '/homepage') {
      this.selectKey = path
      let val = this.menus.find(item => item.path === path)
      this.changeMenu(val)
    }
    let id = document.getElementsByClassName('ant-layout-sider-children')[0]
    id.style.display = 'flex'
  },
  methods: {
    onBreakpoint(broken) {},
    toggle() {
      this.$emit('toggle', false)
      // this.show = false
    },
    toggleFalse() {
      this.$emit('toggle', true)
      // this.show = true
    },
    changeMenu(n) {
      this.secMenus = n || []
    },
    changeKeys(n) {
      if (n) {
        this.selectKey = n && n.path
      }
      this.changeMenu(n)
    },
    onSelect(obj) {
      this.$emit('menuSelect', obj)
    }
  },
  computed: {
    navStyle() {
      return this._globalVar.defaultRouter.includes(this.selectKey)
    }
  }
}
</script>
<style lang="less" scoped>
.ant-layout-sider-children {
  position: relative;
  height: 1000px !important;

  .fMenu {
    padding: 0;
    //   width:150px;
  }
  .secMenu {
    // padding:10px;

    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    transition: all 0.2s;
    background-color: #fff;
  }
  // /deep/ .ant-layout-sider .ant-layout-sider-dark .sider .dark {
  //   box-shadow:0 0 0 !important;
  // }
}
/* 滚动条样式 */
/deep/.ant-layout-sider {
  background: #fff;
}
.secMenu::-webkit-scrollbar {
  width: 1px;
  height: 1px;
  background-color: #f0f0f0;
}

.secMenu::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0px #fff;
  border-radius: 0px;
  background-color: #fff;
}

.secMenu::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 0px #fff;
  background-color: #fff;
}
.sub {
  overflow: hidden;
  width: 100%;
  transition: all 0.22s;
  height: 100vh;
  background: #fff;
}
.subnone {
  width: 0;
}
</style>
