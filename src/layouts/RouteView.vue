<script>
import { start } from 'qiankun'
export default {
  name: 'RouteView',
  props: {
    keepAlive: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  mounted() {
    if (!window.qiankunStarted) {
      window.qiankunStarted = true
      start()
    }
  },
  render() {
    const {
      $route: { meta, name },
      $store: { getters }
    } = this
    let inKeep = (
      <keep-alive>
        <router-view />
      </keep-alive>
    )
    let notKeep = <router-view />
    if (meta.isMircro) {
      inKeep = (
        <keep-alive>
          <div id="qiankun" />
        </keep-alive>
      )
      notKeep = <div id="qiankun" />
    }
    // 这里增加了 multiTab 的判断，当开启了 multiTab 时
    // 应当全部组件皆缓存，否则会导致切换页面后页面还原成原始状态
    // 若确实不需要，可改为 return meta.keepAlive ? inKeep : notKeep
    if (!getters.multiTab && !meta.keepAlive) {
      return notKeep
    }
    // return this.keepAlive || getters.multiTab || meta.keepAlive ? inKeep : notKeep
    return meta.keepAlive ? inKeep : notKeep
  }
}
</script>
