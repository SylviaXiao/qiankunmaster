<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane  key="1" :tab="`各地私教统计表`" >
        <EduTeacherPrivateEducation ref="EduTeacherPrivateEducation" />
      </a-tab-pane>
      <a-tab-pane  key="2" :tab="`私教卡数统计表`" >
        <EduTeacherPrivateEducationCard ref="EduTeacherPrivateEducationCard"  />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import EduTeacherPrivateEducation from './eduTeacherPrivateEducation'
import EduTeacherPrivateEducationCard from './eduTeacherPrivateEducationCard'
export default {
  name: 'eduTeacherPrivateEducationStatistic',
  data() {
    return {
    }
  },
  components: {
    PermBox,
    EduTeacherPrivateEducation,EduTeacherPrivateEducationCard
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
