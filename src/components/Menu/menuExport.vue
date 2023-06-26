<template>
  <div class="body">
    <div style="line-height:0.64rem;text-align:center;font-size:16px;font-weight:bold;">
      {{ this.menu.meta.title }}管理
      <a-icon v-if="!isMobile" class="trigger" type="menu-unfold" @click="toggle" />
    </div>
    <a-menu style="width: 2rem;" mode="inline" :selected-keys="current" @click="handleClick" :openKeys="openKeys" @openChange="onOpenChange">
      <template v-for="item in list">
        <a-menu-item :key="item.path" @click="handleClick(item)" v-if="!item.children && item.meta.hidden != true">
          <div>
            <a-icon :type="item.meta.icon" />
            {{ item.meta.hidden }}
            {{ item.meta.title }}
          </div>
        </a-menu-item>
        <a-sub-menu v-if="item.children" :key="item.path" v-bind="$props" v-on="$listeners">
          <span slot="title">
            <a-icon :type="item.meta.icon" /><span>{{ item.meta.title }}</span>
          </span>
          <template v-for="item in item.children">
            <a-menu-item v-if="!item.children && item.meta.hidden != true" :key="item.path | pathFilter">
              <a-icon :type="item.meta.icon" />
              <!-- <a-popover> -->
              <!-- <template slot="content">
                <span>{{ item.meta.title }}</span>
              </template> -->
              <span>{{ item.meta.title }}</span>
              <!-- </a-popover> -->
            </a-menu-item>
            <sub-menu v-if="item.children" :key="item.path" :menu-info="item" />
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { Menu } from 'ant-design-vue'
const SubMenu = {
  template: `
      <a-sub-menu :key="menuInfo.path" v-bind="$props" v-on="$listeners">
        <span slot="title">
          <a-icon :type="menuInfo.meta.icon" /><span>{{ menuInfo.meta.title }}</span>
        </span>
        <template v-for="item in menuInfo.children">
        111
          <a-menu-item v-if="!item.children && item.meta.hidden!=true" :key="item.path">
            <a-icon :type="item.meta.icon" />
            <span>{{ item.meta.title }}</span>
          </a-menu-item>
          <sub-menu v-if="item.children " :key="item.path" :menu-info="item" />
        </template>
      </a-sub-menu>
    `,
  name: 'SubMenu',
  isSubMenu: true,
  props: {
    ...Menu.SubMenu.props,
    menuInfo: {
      type: Object,
      default: () => ({})
    }
  }
}
export default {
  data() {
    return {
      defaultSelectedKeys: [],
      current: [this.$route.path],
      list: [],
      openKeys: [],
      flag: false
    }
  },
  components: {
    'sub-menu': SubMenu
  },
  props: {
    isMobile: {
      type: Boolean,
      required: false,
      default: false
    },
    menu: {
      type: [Object, Array],
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'light'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    show: {
      type: Boolean,
      required: false,
      default: true
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {},
  mounted() {
    // this.hiddenArrow()
  },
  created() {},
  watch: {
    $route(n, o) {
      this.current = [n.path]
    },
    menu: {
      deep: true,
      immediate: true,
      handler(n) {
        this.flag = false
        this.current = [this.$route.path]
        this.openKeys = []
        if (n.hideChildrenInMenu) {
          this.$router.push(n.redirect)
          this.list = n.children.filter(item => !item.meta.hidden)
        } else {
          this.list = n.children
        }
        this.getChildren(n)
      }
    }
  },
  filters: {
    pathFilter(path) {
      const reg = /\/:.*?\?/g
      if (reg.test(path)) {
        return path.replace(reg, '')
      }
      return path
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
    },
    getChildren(arr) {
      if (arr.children) {
        let data = arr.children.filter(item => item.children)
        data.forEach(item => {
          this.openKeys.push(item.path)
          if (item.children) {
            this.getChildren(item)
          }
        })
      }
    },
    handleClick(e) {
      this.current = [e.key]
      this.$router.push(e.key)
    },
    onOpenChange(openKeys) {
      if (openKeys.length !== 0) {
        this.openKeys = openKeys
      } else {
        this.openKeys = ['']
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/style/index';

.body {
  font-size: 14px;
}
.reverse {
  position: absolute;
  top: 2px;
  right: 0;
}
/deep/ .ant-menu-item {
  // color: #999 !important;
  color: #aaaaaa !important;
  height: 0.3rem !important;
  line-height: 0.3rem !important;
  padding-left: 8px !important;
}
/deep/ .ant-menu-inline > .ant-menu-item {
  font-size: 14px !important;
}
/deep/ .ant-menu {
  width: 174px !important;
}
/deep/ .ant-menu-submenu-arrow {
  display: none !important;
}
/deep/ .ant-menu-item::after {
  border-right: none !important;
}
/deep/ .ant-menu-item:hover {
  color: #1ba97b !important;
}
/deep/ .ant-menu-item-selected {
  background-color: rgba(221, 221, 221, 0) !important;
  color: #1ba97b !important;
}
/deep/ .ant-menu-submenu-selected {
  color: #333 !important;
  // color: #1ba97b !important;
}
// /deep/.ant-menu {
//   background-color: #1ba97b !important;
// }
/deep/ .ant-menu-submenu-title:hover {
  // color: #333 !important;
  color: #1ba97b !important;
  div {
    // color: #333 !important;
    color: #1ba97b !important;
    i {
      // color: #333 !important;
      color: #1ba97b !important;
    }
  }
}
/deep/ .ant-menu-submenu-active {
  // color: #333;
  color: #1ba97b !important;
}
/deep/ .ant-menu-submenu-title {
  position: relative !important;
  height: 0.3rem !important;
  line-height: 0.3rem !important;
  padding-left: 8px !important;
}
/deep/.ant-menu-inline-collapsed > .ant-menu-submenu > .ant-menu-submenu-title .anticon + span {
  display: inline-block;
  max-width: 100%;
  opacity: 1;
}
</style>
