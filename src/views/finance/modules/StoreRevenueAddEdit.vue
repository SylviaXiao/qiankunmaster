<template>
  <div class="stu-leave-addedit">
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :title="title"
      :visible="visibleAddEdit"
      @ok="handleAddEditOk"
      :confirmLoading="confirmAddEditLoading"
      @cancel="handleAddEditCancel"
    >
      <div>
        <a-form :form="formEdit">
          <a-row :gutter="8">
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="选择时间">
                <a-date-picker :disabledDate="disabledDate" v-decorator="['createDate', { rules: [{ required: true, message: '请选择时间' }] }]" />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="收入项">
                <a-input v-decorator="[`name`, { rules: [{ required: true, message: '请输入收入项' }] }]" placeholder="输入收入项" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item label="支付类型" v-bind="formLayout">
                <a-select
                  v-decorator="[
                    'payTypeId',
                    {
                      initialValue: payMethods.length > 0 ? payMethods[0].id : '',
                      rules: [{ required: true, message: '请选择支付类型' }]
                    }
                  ]"
                >
                  <a-select-option :allowClear="true" v-for="(item, index) in payMethods" :value="item.id" :key="index">
                    {{ item.dictValue }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="收支金额">
                <a-input-number
                  placeholder="输入收支金额"
                  style="width: 100%"
                  v-decorator="[`price`, { rules: [{ required: true, type: 'number', message: '请输入收支金额' }] }]"
                  :min="0"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="备注">
                <a-textarea :rows="4" style="width: 100%" v-decorator="['remark', { rules: [{ required: false, message: '请输入备注' }] }]" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { saveFinShop } from '@/api/finance/finance'
import { listArea, listEduDance } from '@/api/common'
import { formLayout } from '../finance'
import { getPayMethods } from '@/api/education'
export default {
  props: {
    title: {
      type: String,
      default: '店面收入管理'
    }
  },
  data() {
    return {
      id: '',
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      payMethods: []
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    disabledDate(current) {
      if (this.$store.getters.isAdmin) {
        return false
      }
      
      let date = new Date()
      let day = date.getDate()
      let obj = moment(current).format('YYYY-MM-DD')
      let start = moment(date)
        .startOf('month')
        .format('YYYY-MM-DD')
      if (day <= 2)
        start = moment(date)
          .month(moment(date).month() - 1)
          .startOf('month')
          .format('YYYY-MM-DD')
      let end = moment(date)
        .endOf('month')
        .format('YYYY-MM-DD')
      return start > obj || obj > end
    },
    //获取并设置支付类型
    getAllPayMethods() {
      return getPayMethods().then(res => {
        this.payMethods = res.data
        if (!!res.data) {
          return res.data[0].id
        }
      })
    },
    handleAddEditOk(openId) {
      this.validateData()
        .then(res => {
          const { orgDeptId, eduDanceId } = res
          if (this.id) {
            res.id = this.id
          }
          if (res.createDate) {
            res.createDate = this.$tools.tailor.getDateTime(res.createDate)
          }
          return saveFinShop(res)
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
      return this.getAllPayMethods().then(() => {
        this.visibleAddEdit = true
        this.resetForm()
      })
    },
    backindData(record) {
      const { name, price, remark, createDate, payTypeId } = record
      this.id = record.id
      let formData = { name, price, createDate: createDate ? moment(createDate, 'YYYY-MM-DD HH:mm:ss') : [], remark, payTypeId }
      this.$nextTick(() => {
        this.formEdit.setFieldsValue(formData)
      })
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
