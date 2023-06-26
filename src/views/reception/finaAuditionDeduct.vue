<template>
  <div>
    <a-card :bordered="false">
      <a-tabs :activeKey="selectKey" @change="selectKeyHandle">
        <a-tab-pane v-if="handlePermBox('finance:finteacher:view')" key="daoshi" tab="导师绩效">
          <teacherFinance />
        </a-tab-pane>
        <a-tab-pane v-if="handlePermBox('student:auditionlog:view')" key="shike" tab="试课管理" force-render>
          <auditionList />
        </a-tab-pane>
        <a-tab-pane v-if="handlePermBox('salary:deduct:view')" key="kaoqin" tab="考勤管理">
          <deductList />
        </a-tab-pane>
        <a-tab-pane v-if="handlePermBox('education:class-creationfee:view')" key="create" tab="创编费管理">
          <createList />
        </a-tab-pane>
        <a-tab-pane v-if="handlePermBox('student:auditioncvn:view')" key="199" tab="199试课转化报名（转化含缴费）">
          <personalAuditionRegisterChange />
        </a-tab-pane>
        <a-tab-pane v-if="handlePermBox('student:auditioncvn:noFinanceView')" key="199NoFinance" tab="199试课转化报名（转化不含缴费）">
          <personalAuditionRegisterChangeNoFinance />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import teacherFinance from './modules/teacherFinance'
import auditionList from './modules/auditionList'
import deductList from './modules/deductList'
import createList from './modules/createList'
import personalAuditionRegisterChange from './modules/personalAuditionRegisterChange'
import personalAuditionRegisterChangeNoFinance from './modules/personalAuditionRegisterChangeNoFinance.vue'
export default {
  components: {
    teacherFinance,
    auditionList,
    deductList,
    createList,
    personalAuditionRegisterChange,
    personalAuditionRegisterChangeNoFinance
  },
  data() {
    return {
      selectKey: 'daoshi'
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
      if (this.handlePermBox('finance:finteacher')) {
        this.selectKey = 'daoshi'
        return
      }
      if (this.handlePermBox('student:auditionlog:view')) {
        this.selectKey = 'shike'
        return
      }
      if (this.handlePermBox('salary:deduct:view')) {
        this.selectKey = 'kaoqin'
        return
      }
      if (this.handlePermBox('education:class-creationfee:view')) {
        this.selectKey = 'create'
        return
      }
      if (this.handlePermBox('student:auditioncvn:view')) {
        this.selectKey = '199'
        return
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
