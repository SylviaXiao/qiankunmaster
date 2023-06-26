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
  import privateEducationBonusConfig from './modules/privateEducationBonusConfig'
  import achievementAssessmentConfig from './modules/achievementAssessmentConfig'

  export default {
    data() {
      return {
        tabList: [
          { id: 1, text: '私教奖金设置', component: 'privateEducationBonusConfig', perm: 'education:item:view' },
          { id: 2, text: '成果考核设置', component: 'achievementAssessmentConfig', perm: 'education:achieveitem:view' },
        ]
      }
    },
    components: {
      PermBox,
      privateEducationBonusConfig,
      achievementAssessmentConfig
    },
    created() {
    },
    methods: {
      handlePermBox(str) {
        return this.$tools.checkPerm(str)
      },
    }
  }
</script>

<style lang="less" scoped type="text/less">
  @import '~@/assets/style/index';
</style>
