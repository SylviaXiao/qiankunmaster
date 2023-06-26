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
  import auditionRegisterReport from './auditionRegisterReport'
  import personalAuditionRegisterReport from './personalAuditionRegisterReport'
  import total from './personalAuditionRegisterReportTotal.vue'
  import noFinance from './personalAuditionRegisterReportNoFinance.vue'
  export default {
    components: {
      PermBox,
      auditionRegisterReport,
      total,
      personalAuditionRegisterReport,
      noFinance,
    },
    data() {
      return {
        tabList: [
          { id: 1, text: '试课报名登记表', component: 'auditionRegisterReport', perm: 'finance:audition-report:view' },
          { id: 2, text: '私教199试课报名登记表', component: 'total', perm: 'finance:priedureport:view' },
          { id: 3, text: '私教199试课报名登记表（转化含缴费）', component: 'personalAuditionRegisterReport', perm: 'finance:priedureport:view' },
          { id: 4, text: '私教199试课报名登记表（转化不含缴费）', component: 'noFinance', perm: 'finance:priedureport:view' }
        ]
      }
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
