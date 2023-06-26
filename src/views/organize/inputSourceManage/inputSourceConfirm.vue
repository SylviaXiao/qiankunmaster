<template>
  <div class="stu-leave-addedit">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      :visible="visibleAddEdit"
      @ok="handleAddEditOk"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
      okText="保存"
    >
      <div>
        <a-form :form="formEdit">
          <a-row :gutter="8">
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="到账日期">
                <a-date-picker
                  v-decorator="[`receivedDate`, { rules: [{ required: true, message: '请输入到账日期' }] }]"
                  placeholder="请选择到账日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="手续费">
                <a-input-number
                  :max="incomeCash"
                  :min="0"
                  @change="incomeFeeChange"
                  v-decorator="[`incomeFee`, { rules: [{ required: true, message: '请输入手续费' }] }]"
                  placeholder="请输入手续费"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="银行账号">
                <a-input style="width: 100%" v-model="record.incomeBank" :disabled="true" />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="到账金额">
                <a-input-number
                  :disabled="true"
                  v-decorator="[`incomeCash`, { rules: [{ required: false, message: '请输入到账金额' }] }]"
                  placeholder="请输入到账金额"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { comfirmFinOnlineInfo } from '@/api/organize'
import { formLayout } from '../organizeConst'
import IModal from '@/components/InnerModal'
export default {
  components: {
    IModal
  },
  props: {
    title: {
      type: String,
      default: '新增收款信息'
    },
    stuId: String
  },
  data() {
    return {
      incomeCash: 0,
      id: '',
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      finOnlineChannelId: '',
      record: {}
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    incomeFeeChange(e) {
      let price = this.incomeCash - e
      this.$nextTick(() => {
        this.formEdit.setFieldsValue({
          incomeCash: price
        })
      })
    },
    handleAddEditOk() {
      this.validateData()
        .then(res => {
          const { receivedDate, incomeFee } = res
          let params = {
            receivedDate,
            incomeFee,
            id: this.id
          }
          return comfirmFinOnlineInfo(params)
        })
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统提示',
              description: '已操作成功'
            })
            this.refreshTable()
            this.handleAddEditCancel()
          }
        })
        .finally(() => {
          this.confirmAddEditLoading = false
        })
    },
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    open() {
      this.visibleAddEdit = true
      this.resetForm()
    },
    backindData(record) {
      const { incomeCash } = record
      this.record = { ...record }
      this.id = record.id
      this.incomeCash = incomeCash || 0
    },
    validateData() {
      return this.formEdit.validateFields()
    },
    resetForm() {
      this.id = ''
      this.formEdit.resetFields()
    },
    refreshTable() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-addedit {
}
</style>
