<template>
  <div>
    <a-card :bordered="false">
      <a-tabs :activeKey="selectKey" @change="selectKeyHandle">
        <a-tab-pane v-if="handlePermBox('finance:target:view')" key="1" tab="分馆目标管理">
          <branchTargetInput />
        </a-tab-pane>
        <a-tab-pane v-if="handlePermBox('finance:target-perdevnum:view')" key="2" tab="个人开发数" force-render>
          <personalDevelopInput />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import branchTargetInput from './branchTargetInput'
import personalDevelopInput from './personalDevelopInput'
export default {
  components: {
    branchTargetInput,
    personalDevelopInput,
  },
  data() {
    return {
      selectKey: '1'
    }
  },
  created() {
    this._setSelctKey()
  },
  methods: {
    selectKeyHandle(e) {
      this.selectKey = e
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    _setSelctKey() {
      if (this.handlePermBox('finance:target:view')) {
        this.selectKey = '1'
        return
      }
      if (this.handlePermBox('finance:target-perdevnum:view')) {
        this.selectKey = '2'
        return
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
