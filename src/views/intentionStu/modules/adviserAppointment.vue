<template>
  <div class="studentinfo-wrapper">
    <a-form :form="form">
      <!-- 类型 -->
      <a-form-item label="类型" v-bind="formItemLayout" style="margin-bottom: 10px;">
        <a-radio-group v-decorator="['type',
        {rules: [{ required: true, message: '请选择类型' }],initialValue: []}]">
          <a-radio value="A">到访</a-radio>
          <a-radio value="B">预约</a-radio>
        </a-radio-group>

      </a-form-item>
      <!-- 日历 -->
      <a-form-item label="时间" v-bind="formItemLayout">
        <a-date-picker
          format="YYYY-MM-DD"
          v-decorator="[
              'auditionDate',
              {rules: [{ required: true, message: '请选择时间' }]}
            ]"
        />

      </a-form-item>
      <!-- 备注 -->
      <a-form-item label="备注" v-bind="formItemLayout">
        <a-textarea
          v-decorator="[
              'auditionRemark',
              {rules: [{ required: false, message: '请输入备注' }]}
            ]"
        />
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
  const TimeArr = [{ label: '上午', value: 'Y' }, { label: '下午', value: 'N' }]
  export default {
    data() {
      return {
        formItemLayout,
        TimeArr
      }
    },
    props: {
      userId: String,
      initAppointment: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      initAppointment(nv) {
        nv ? this.resetForm() : ''
      }
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
      getAppointmentData() {
        return this.validateData().then(() => {
          let formData = this.form.getFieldsValue()
          formData.type = formData.type
          formData.auditionDate = this.$tools.tailor.getDate(formData.auditionDate)
          formData.stuId = this.userId
          return Promise.resolve(formData)
        }).catch(err => {
          return Promise.reject(err)
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

<style scoped lang=less>

</style>
