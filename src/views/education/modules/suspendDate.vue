<template lang="html">
  <div class="suspend-date">
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
      title="选择时间"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel">
      <a-form :form="formEdit">
        <a-row :gutter="8">
          <a-col :span="24">
            <a-form-item v-bind="formLayout" label="选择时间">
              <a-range-picker
                style="width: 100%;"
                :disabledDate="$tools.tailor.disabledDate"
                :showTime="{
                  hideDisabledOptions: true
                }"
                format="YYYY-MM-DD"
                v-decorator="[
                  'dateRange',
                  {rules: [{ required: true, message: '请选择停课时间' }]}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :lg="24" :md="24" :sm="24">
            <a-form-item v-bind="formLayout" label="备注">
              <a-textarea
                style="width: 100%;"
                placeholder="请输入备注信息"
                :rows="4"
                v-decorator="[
                  'remark',
                  {rules: [{ required: false, message: '请输入备注信息' }]}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
   </a-modal>
  </div>
</template>

<script>
const formLayout = {
    labelCol: {
      sm: {
        span: 6
      }
    },
    wrapperCol: {
      sm: {
        span: 16
      }
    }
  }
export default {
  data() {
    return {
      formLayout,
      visible: false,
      confirmLoading: false
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    reset() {
      this.$nextTick(() => {
        this.formEdit.resetFields()
      })
    },
    open() {
      this.visible = true
      this.reset()
    },
    handleOk() {
      this.validateData().then(res => {
        this.confirmLoading = true
        const {dateRange, remark} = res
        let stateDate = dateRange[0]
        let endDate = dateRange[1]
        const {$tools:{tailor:{getDate}}} = this
        let params = {
          remark,
          stateDate: getDate(stateDate),
          endDate: getDate(endDate),
        }
        this.$emit('getSuspendData',params)
      })
    },
    cancelFirmLoading() {
      this.confirmLoading = false
    },
    handleCancel() {
      this.visible = false
    },
    validateData() {
      return this.formEdit.validateFields()
    },
  }
}
</script>

<style lang="less" scoped>
.suspend-date {

}
</style>
