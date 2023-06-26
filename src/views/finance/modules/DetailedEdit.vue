<template>
  <div class="detailed-addedit">
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
              <a-form-item v-bind="formLayout" label="缴费时间">
                <a-date-picker
                  placeholder="请选择缴费时间"
                  style="width: 100%"
                  :disabledDate="disabledDate"
                  v-decorator="[`tradeDate`, { rules: [{ required: true, message: '请输入缴费时间' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24" v-if="income">
              <a-form-item v-bind="formLayout" label="缴费类型">
                <a-select v-decorator="['type', { initialValue: 'A', rules: [{ required: true, message: '请选择缴费类型' }] }]">
                  <a-select-option :allowClear="true" value="A">全款</a-select-option>
                  <a-select-option :allowClear="true" value="B">定金</a-select-option>
                  <a-select-option :allowClear="true" value="C">补缴</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24" v-if="income">
              <a-form-item v-bind="formLayout" label="支付方式">
                <a-select allowClear v-decorator="['payTypeId', { rules: [{ required: true, message: '请选择支付方式' }] }]" placeholder="请选择支付方式">
                  <a-select-option :allowClear="true" :value="item.id" v-for="(item, index) in listSysDictArr" :key="index">
                    {{ item.dictValue }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24" v-if="!isReception && income">
              <a-form-item v-bind="formLayout" label="收款金额">
                <a-input-number
                  placeholder="输入收款金额"
                  style="width: 100%"
                  v-decorator="[`price`, { rules: [{ required: true, type: 'number', message: '请输入收款金额' }] }]"
                  :min="0"
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
import { changeFinance, changeFinanceDesk } from '@/api/finance/finance'
import { listSysDict } from '@/api/student'
import { formLayout } from '../finance'
import moment from 'moment'
import Vue from "vue"

export default {
  props: {
    title: {
      type: String,
      default: '收支明细'
    },
    isReception: { type: Boolean, default: false },
    income: { type: Boolean, default: true }
  },
  data() {
    return {
      id: '',
      listSysDictArr: [],
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this)
  },
  methods: {
    disabledDate(current) {
      const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
      if(!!!userSchoolId||userSchoolId.length<=0){
        return
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
    handleAddEditOk(openId) {
      this.validateData()
        .then(params => {
          if (this.id) {
            params.financeId = this.id
          }
          params.tradeDate ? (params.tradeDate = this.$tools.tailor.getDate(params.tradeDate)) : ''
          params.tradeDate = params.tradeDate
          return this.isReception ? changeFinanceDesk(params) : changeFinance(params)
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
      this.init()
      this.resetForm()
    },
    backindData(record) {
      const { price, payTypeId, type } = record
      this.id = record.id
      let formData = { price, payTypeId, type, tradeDate: this.$tools.tailor.dateToMoment(record.tradeDate) }
      this.$nextTick(() => {
        this.formEdit.setFieldsValue(formData)
      })
    },
    validateData() {
      return this.formEdit.validateFields()
    },
    init() {
      listSysDict().then(res => {
        this.listSysDictArr = res.data
      })
    },
    resetForm() {
      this.id = ''
      this.listSysDictArr = []
      this.formEdit.resetFields()
    },
    refreshTable() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.detailed-addedit {
}
</style>
