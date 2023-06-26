<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane v-if="handlePermBox('finance:target:stat')"  key="1" :tab="`分馆经营报表`" >
        <BranchReport   ref="BranchReport" />
      </a-tab-pane>
      <a-tab-pane  v-if="handlePermBox('finance:target:stat')"  key="2" :tab="`地区经营报表`" >
        <AreaReport ref="AreaReport"  />
      </a-tab-pane>
      <a-tab-pane  v-if="handlePermBox('finance:target:dancestat')"  key="3" :tab="`舞种续卡报表`" >
        <DanceContinuedCard ref="DanceContinuedCard"  />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import BranchReport from './branchReport'
import AreaReport from './areaReport'
import DanceContinuedCard from './danceContinuedCard'
export default {
  name: 'branchAnualReport',
  data() {
    return {
    }
  },
  components: {
    PermBox,
    BranchReport,AreaReport,DanceContinuedCard
  },
  created() {
    this._setSelctKey()
  },
  methods: {
    _setSelctKey() {
      if (this.handlePermBox('finance:target:stat')) {
        this.selectKey = '1'
        return
      }
      if (this.handlePermBox('finance:target:dancestat')) {
        this.selectKey = '3'
        return
      }
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
@import '~@/assets/style/index';
</style>
