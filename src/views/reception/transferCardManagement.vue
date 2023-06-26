<template>
  <div>
    <a-card :bordered="false">
      <a-tabs :activeKey="selectKey" @change="selectKeyHandle" defaultActiveKey="0">
        <!-- v-if="handlePermBox('finance:finteacher:view')" -->
        <a-tab-pane :tab="item.text" v-for="(item, index) in tabList" :key="index + ''">
          <component :is="item.component" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import turnCardList from './modules/turnCardList'
import goOutlist from './modules/goOutlist'
export default {
  components: {
    turnCardList,
    goOutlist
  },
  data() {
    return {
      selectKey: '0',
      tabList: [{ text: '转出顾问业绩列表', component: 'goOutlist', perm: '' }, { text: '转入顾问业绩列表', component: 'turnCardList', perm: '' }]
    }
  },
  created() {
    // this._setSelctKey()
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'transferCardManagement') {
          let { selectKey } = this.$route.query
          if (selectKey) this.selectKey = selectKey
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    selectKeyHandle(e) {
      this.selectKey = e
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    }
    // _setSelctKey() {
    //   if(this.handlePermBox('finance:finteacher')) {
    //     this.selectKey = 'daoshi'
    //     return
    //   }
    //   if(this.handlePermBox('student:auditionlog:view')) {
    //     this.selectKey = 'shike'
    //     return
    //   }
    //   if(this.handlePermBox('salary:deduct:view')) {
    //     this.selectKey = 'kaoqin'
    //     return
    //   }
    // }
  }
}
</script>

<style lang="less" scoped></style>
