<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="班级签到统计">
        <EduClassSignIn />
      </a-tab-pane>
      <a-tab-pane key="2" tab="签到异常统计" v-if="handlePermBox('education:personalSignAbnormal:view')">
        <EduClassPersonalSignIn />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import PermBox from '@/components/PermBox'
import EduClassSignIn from './components/EduClassSignIn.vue'
import EduClassPersonalSignIn from './components/EduClassPersonalSignIn.vue'
export default {
  name: 'eduClassSignInfo',
  data() {
    return {}
  },
  components: {
    PermBox,
    EduClassSignIn,
    EduClassPersonalSignIn
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
