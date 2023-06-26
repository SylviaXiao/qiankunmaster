<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane  key="1" :tab="`导师签到统计`" >
        <EduTeacherSign ref="EduTeacherSign" />
      </a-tab-pane>
      <a-tab-pane  key="2" :tab="`月度人力统计`" >
        <MonthPeopleStatistic ref="MonthPeopleStatistic"  />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import EduTeacherSign from './eduTeacherSign'
import MonthPeopleStatistic from './monthPeopleStatistic'
export default {
  name: 'eduTeacherSignStatistic',
  data() {
    return {
    }
  },
  components: {
    PermBox,
    EduTeacherSign,MonthPeopleStatistic
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
