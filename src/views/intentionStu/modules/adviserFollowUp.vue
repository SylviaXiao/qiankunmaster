<template>
  <div class="studentinfo-wrapper">
    <a-form :form="form">
      <!-- 下次跟进时间 -->
      <a-form-item label="下次跟进时间" v-bind="formItemLayout">
        <a-date-picker format="YYYY-MM-DD" v-decorator="['logDate', { rules: [{ required: false, message: '请选择时间' }] }]" />
      </a-form-item>

      <!-- 备注 -->
      <a-form-item label="备注" v-bind="formItemLayout">
        <a-textarea v-decorator="['logRemark', { rules: [{ required: true, message: '请输入备注' }] }]" />
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import moment from 'moment'
import { filterEmptyObject } from '@/utils/util'
const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 }
  }
}
export default {
  data() {
    return {
      formItemLayout
    }
  },
  props: {
    stuId: String
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    disabledDate(current) {
      // 不能选择今天以前的日期
      return current && current < moment().endOf('day')
    },

    // 向父级暴露form表单的数据
    getFollowUpData() {
      return this.validateData().then(() => {
        let formData = this.form.getFieldsValue()
        formData.logDate = formData.logDate ? moment(formData.logDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : ''
        formData.stuId = this.stuId
        return formData
      })
    },
    // 验证
    validateData() {
      return this.form.validateFields()
    },
    // 重置form
    resetForm() {
      //表单重置
      this.form.resetFields()
    }
  }
}
</script>

<style scoped lang="less"></style>
