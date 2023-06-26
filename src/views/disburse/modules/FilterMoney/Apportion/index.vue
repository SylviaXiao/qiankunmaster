<template>
  <div class="fc-apportion" v-bind="$props" v-on="$listeners">
    <div style="display:flex;">
      <div class="apportion" v-if="innerValue.length > 0">
        <div v-for="(item, index) in innerValue" :key="index">
          {{ item.startDate }}<span v-if="item.startDate !== item.endDate">~{{ item.endDate }}</span
          >/{{ item.parentDeptName || '' }}<span v-if="item.parentDeptName">/</span>{{ item.deptName }}/{{ item.price }}
        </div>
      </div>
      <a href="#" v-if="!disabled" @click="apportion">分摊</a>
    </div>
    <!-- 分摊弹窗 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="分摊情况"
      width="1300px"
      v-model="apportionModal"
      okText="保存"
      cancelText="取消"
      @ok="saveApportionPlans()"
      @cancel="ApportionPlansClose()"
    >
      <contributions ref="contributions" @closeAchiModal="ApportionPlansClose"></contributions>
    </a-modal>
  </div>
</template>
<script>
import contributions from './contributions'
export default {
  // model: {
  //   prop: 'value',
  //   event: 'change'
  // },
  props: [
    'value',
    'disabled',
    'bindPrice',
    'formData',
    'rowIndex' // 计算公式放在表格中时， 需要获取在表格中的行位置
  ],
  name: 'fc-apportion',
  components: { contributions },
  data() {
    return {
      innerValue: this.value || [],
      apportionModal: false, //分摊
      deptTree: [] //所有分馆列表
    }
  },
  created() {},
  methods: {
    ApportionPlansClose() {
      this.schoolId = null
      this.$refs.contributions.clear()
      this.apportionModal = false
    },
    saveApportionPlans() {
      let flag = this.$refs.contributions.checkData()
      if(!flag){
        this.$notification['error']({
          message: '系统通知',
          description: `舞种/班型分摊金额的和必须等于分摊金额`
        })
        return
      }
      let msg = this.$refs.contributions.counselorInfo
      if (msg && Array.isArray(msg) && msg.length > 0) {
        for (let i = 0; i < msg.length; i++) {
          let item = msg[i]
          if (!item.startDate || !item.price || !item._deptId || !item.endDate) {
            return this.$notification['error']({
              message: '系统通知',
              description: '请先填写完整'
            })
          }

          if (Array.isArray(item._deptId) && item._deptId.length > 0) {
            item.deptId = item._deptId[item._deptId.length - 1]
          } else {
            return this.$notification['error']({
              message: '系统通知',
              description: '请先填写完整'
            })
          }
        }
        let total = msg
          .map(item => item.price)
          .reduce((a, b) => {
            return a + b
          }, 0)
        if (String(this.price.toFixed(2)) !== String(total.toFixed(2))) {
          return this.$notification['error']({
            message: '系统通知',
            description: '分摊金额的合必须等于总金额'
          })
        }
        this.innerValue = msg
        //this.$emit('change', this.innerValue)
        this.$emit('change', {
          data: this.innerValue,
          rowIndex: this.rowIndex
        })
        this.ApportionPlansClose()
      } else {
        this.$emit('change', {
          data: [],
          rowIndex: this.rowIndex
        })
        this.ApportionPlansClose()
      }
    },
    //分摊
    apportion() {
      let price = this.bindPrice || 0
      this.price = price
      if (!price) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请先填写总金额'
        })
      }
      this.apportionModal = true
      this.$nextTick(() => {
        let innerValue = []
        this.innerValue ? JSON.parse(JSON.stringify(this.innerValue)) : []
        this.innerValue.forEach((item, index) => {
          innerValue.push({
            deptName: item.deptName,
            price: item.price,
            _deptId: item._deptId,
            parentDeptName: item.parentDeptName,
            id: item.id,
            parentDeptId: item.parentDeptId,
            key: index,
            startDate: item.startDate,
            endDate: item.endDate,
            spendingSplitProjects:item.spendingSplitProjects
          })
          // if (item.deptId && typeof item.deptId === 'string' && Array.isArray(item._deptId) && item._deptId.length > 0) item.deptId = item._deptId
        })
        this.$refs.contributions.backData({
          price,
          spendingSplits: innerValue
        })
      })
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.innerValue = val
      } else {
        this.innerValue = []
      }
    }
  }
}
</script>
<style lang="less" scoped>
.apportion {
  width: calc(100% - 30px);
  box-sizing: border-box;
  background-color: #fff;
  border: 0.01rem solid #d9d9d9;
  border-top-width: 0.0102rem;
  border-radius: 0.04rem;
  outline: none;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  min-height: 32px;
  cursor: pointer;
}
.explain-text {
  font-size: 12px;
  color: #aaa;
  line-height: 20px;
}
/deep/.ant-select-disabled .ant-select-selection {
  background: #f5f7fa;
  color: #c0c4cc;
  border: 0.01rem solid #f5f7fa;
}
</style>
