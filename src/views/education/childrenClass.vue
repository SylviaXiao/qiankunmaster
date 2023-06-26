<template>
  <div>
    <a-card :bordered="false">
      <a-tabs :activeKey="selectKey" @change="selectKeyHandle">
        <a-tab-pane v-if="handlePermBox('education:class:view')" key="class" tab="少儿班级管理">
          <childrenClassList ref="childrenClassList"/>
        </a-tab-pane>
        <a-tab-pane v-if="handlePermBox('education:pageChildClass:view')" key="upGrade" tab="升班记录" force-render>
          <upGradeList ref="upGradeList"/>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import childrenClassList from './childrenClassList'
import upGradeList from './upGradeList'
export default {
  components: {
    childrenClassList,
    upGradeList,
  },
  data() {
    return {
      selectKey: 'class'
    }
  },
  created() {
    this._setSelctKey()
  },
  methods: {
    selectKeyHandle(e) {
      this.selectKey = e
      if(e==='upGrade') this.$refs.upGradeList._refreshTable()
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    _setSelctKey() {
      if (this.handlePermBox('education:class:view')) {
        this.selectKey = 'class'
        return
      }
      if (this.handlePermBox('education:pageChildClass:view')) {
        this.selectKey = 'upGrade'
        return
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
