<template>
  <div class="body">
    <a-menu style="width: 1rem; background-color: #1ba97b;" mode="inline" :theme="theme" :selected-keys="selected">
      <a-menu-item v-for="item in menu" v-show="!item.meta.hidden" :key="item.path" @click="handleClick(item)">
        <a-icon :type="item.meta.icon" />
        {{ item.meta.title }}
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      selected: []
    }
  },
  props: {
    selectKey: {
      type: String,
      required: false
    },
    menu: {
      type: Array,
      required: true,
      default: () => []
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
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    pick: {
      type: String
    }
  },
  components: {},

  computed: {},

  watch: {
    menu: {
      deep: true,
      immediate: true,
      handler(n) {
        this.selected = this.pick ? [this.pick] : []
        if (this.selected.length) {
          let data = this.menu.find(item => item.path === this.selected[0])
          this.$emit('changeKeys', data)
        }
      }
    },
    pick: {
      immediate: true,
      deep: true,
      handler(n) {
        if (n == '/homepage') {
          this.selected = []
        } else {
          this.selected = [n]
        }
      }
    }
  },

  methods: {
    handleClick(item) {
      this.selected = [item.path]
      Vue.ls.set('one_nav', this.selected)
      this.$emit('changeKeys', item)
      this.$emit('toggleFalse')
      // this.$router.push(item.path)
    },
    updateMenu() {
      // const routes = this.$route.matched.concat()
      // const { hidden } = this.$route.meta
      // if (routes.length >= 3 && hidden) {
      //   routes.pop()
      //   this.selected = [routes[routes.length - 1].path]
      // } else {
      //   this.selected = [routes.pop().path]
      // }
      // const openKeys = []
      // this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-menu-item {
  padding-left: 8px !important;
  margin-left: 3px;
  height: 0.45rem !important;
  line-height: 0.45rem !important;
}

.body {
  padding: 20px;
  color: #fff;
  .menuItem {
    margin-bottom: 20px;
  }
}
.ant-menu {
  color: rgb(255, 255, 255);
}
/deep/ .ant-menu-item-selected {
  // color: #333 !important;
  background: #fff !important;
  color: #1ba97b !important;

  .anticon {
    // color: #333 !important;
    color: #1ba97b !important;
    font-size: 16px;
    margin: 0 2px 0 13px;
  }
}
// /deep/li.ant-menu-item.ant-menu-item-selected .anticon span::before {
//   background: #19a97b;
//   content: ' ';
//   left: 23px;
//   width: 5px;
//   height: 5px;
//   position: absolute;
//   top: 13px;
//   border-radius: 50%;
// }
/deep/ .ant-menu-item {
  border-top-left-radius: 0.22rem;
  border-bottom-left-radius: 0.22rem;
}
/deep/ .ant-menu-item:hover,
/deep/ .ant-menu-item:visited {
  background: #fff !important;
  color: #1ba97b !important;
}
/deep/.ant-menu-vertical .ant-menu-item::after,
.ant-menu-vertical-left .ant-menu-item::after,
.ant-menu-vertical-right .ant-menu-item::after,
.ant-menu-inline .ant-menu-item::after {
  border-right: 0;
}
</style>
