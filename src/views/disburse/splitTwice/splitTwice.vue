<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane  key="1" tab="未分摊"  v-if="handlePermBox('finance:secspl:view')">
        <NotSplitTable ref="NotSplitTable" />
      </a-tab-pane>
      <a-tab-pane  key="2" tab="已分摊-汇总"  v-if="handlePermBox('finance:secspl:view')">
        <SplitedTable ref="SplitedTable"  />
      </a-tab-pane>
      <a-tab-pane  key="3" tab="已分摊-明细"  v-if="handlePermBox('finance:secsplinfo:view')">
        <SplitedTotalTable ref="SplitedTotalTable" />
      </a-tab-pane>
      <a-tab-pane  key="4" tab="费用归类"  v-if="handlePermBox('finance:fee:view')">
        <SplitedFeeItemTable ref="SplitedFeeItemTable"  />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import NotSplitTable from './notSplitTable'
import SplitedTable from './splitedTable'
import SplitedTotalTable from './splitedTotalTable'
import SplitedFeeItemTable from './splitedFeeItemTable'
export default {
  name: 'splitTwice',
  data() {
    return {
    }
  },
  components: {
    PermBox,
    NotSplitTable,SplitedTable,SplitedTotalTable,SplitedFeeItemTable
  },
  created() {
  },
  methods: {
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    }
  }
}
</script>

<style lang="less" scoped type="text/less">
@import '~@/assets/style/index';
</style>
