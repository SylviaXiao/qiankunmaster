<template>
  <div>
    <a-tabs>
      <a-tab-pane :tab="item.text" v-for="item in tabList" :key="item.id" v-if="handlePermBox(item.perm)">
        <component :is="item.component" :ref="item.component" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import privateClassConsumption from './modules/privateClassConsumption'
import privateAchievementAssessment from './modules/privateAchievementAssessment'

export default {
  data() {
    return {
      tabList: [
        { id: 1, text: '私教课耗', component: 'privateClassConsumption', perm: 'education:report:view' },
        { id: 2, text: '私教成果考核', component: 'privateAchievementAssessment', perm: 'education:report:view' }
      ]
    }
  },
  components: {
    PermBox,
    privateClassConsumption,
    privateAchievementAssessment
  },
  created() {},
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
