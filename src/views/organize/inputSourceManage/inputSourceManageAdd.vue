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
            <a-col :lg="24" :md="24" :sm="24" v-if="isEdit">
              <a-form-item v-bind="formLayout" label="操作日期">
                <a-input
                  :disabled="true"
                  v-decorator="[`updateDate`, { rules: [{ required: false, message: '请输入操作日期' }] }]"
                  placeholder="请输入操作日期"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24" v-if="isEdit">
              <a-form-item v-bind="formLayout" label="收入类别">
                <a-input
                  :disabled="true"
                  v-decorator="[`incomeType`, { rules: [{ required: false, message: '请输入收入类别' }] }]"
                  placeholder="请输入收入类别"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24" v-if="isEdit">
              <a-form-item v-bind="formLayout" label="收入平台">
                <a-input
                  :disabled="true"
                  v-decorator="[`incomePlatform`, { rules: [{ required: false, message: '请输入收入平台' }] }]"
                  placeholder="请输入收入平台"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24" v-if="isEdit">
              <a-form-item v-bind="formLayout" label="账号">
                <a-input
                  :disabled="true"
                  v-decorator="[`incomeAccount`, { rules: [{ required: false, message: '请输入账号' }] }]"
                  placeholder="请输入账号"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="提现金额">
                <a-input-number
                  v-decorator="[`incomeCash`, { rules: [{ required: true, message: '请输入提现金额' }] }]"
                  placeholder="请输入提现金额"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="打款方式">
                <a-select
                  @change="payTypeChange"
                  :allowClear="true"
                  v-decorator="[`payType`, { rules: [{ required: true, message: '请选择打款方式' }] }]"
                  placeholder="请选择打款方式 "
                >
                  <a-select-option v-for="(item, index) in cityArr" :key="index" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="银行账号">
                <a-select
                  v-decorator="[`sysBankId`, { rules: [{ required: false, message: '请选择银行账号' }] }]"
                  style="width:100%;"
                  showSearch
                  @change="handleBankAccountChange"
                >
                  <a-select-option v-for="(item, index) in accountList" :key="index" :value="item.id">
                    <div>{{ item.bankCardNo }}</div>
                    <div>{{ item.bankName }}</div>
                    <div>{{ item.bankNo }}</div>
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-show="showDept" v-bind="formLayout" label="付款分馆">
                <a-select disabled v-decorator="[`schoolId`, { rules: [{ required: showDept, message: '请选择付款分馆' }] }]" style="width:100%;">
                  <a-select-option v-for="(item, index) in payDeptList" :key="index" :value="item.deptId">
                    {{ item.deptName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="运营人员">
                <a-input
                  :disabled="true"
                  v-decorator="[`userName`, { rules: [{ required: true, message: '请输入运营人员' }] }]"
                  placeholder="请输入运营人员"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="备注">
                <a-textarea v-decorator="[`remark`, { rules: [{ required: false, message: '请输入备注' }] }]" placeholder="请输入备注" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { addFinOnlineInfo } from '@/api/organize'
import { formLayout } from '../organizeConst'
import { listOrgDept, listBank } from '@/api/education/card'
import IModal from '@/components/InnerModal'
import { mapGetters } from 'vuex'
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
      isEdit: false,
      payType: false,
      cityArr: [{ id: 'A', name: '对公' }, { id: 'B', name: '对私' }],
      id: '',
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      finOnlineChannelId: '',
      showDept: false,
      payDeptList: [], // 付款分馆
      accountList: [] // 付款分馆对应的银行账号
    }
  },
  beforeCreate() {
    this.formEdit = this.$form.createForm(this, {
      onValuesChange: (props, values) => {
        this.onValuesChange(props, values)
      }
    })
  },
  methods: {
    ...mapGetters(['nickname']),
    onValuesChange(props, values) {
      this.showDept = values.sysBankId
    },
    payTypeChange(e) {
      this.payType = e === 'A' ? true : false
    },
    queryDeptList() {
      listOrgDept().then(res => {
        this.payDeptList = res.data
      })
    },
    async queryAccountList() {
      let res = await listBank()
      this.accountList = res.data

      let sysBankId = this.formEdit.getFieldValue('sysBankId')
      if (sysBankId) {
        this.setSchoolId(sysBankId)
      }
    },
    handleBankAccountChange(value) {
      let account = this.setSchoolId(value)
      if (!account) return
      this.formEdit.setFieldsValue({
        schoolId: account.deptId
      })
    },
    setSchoolId(bankId) {
      let account = this.accountList.filter(item => {
        return item.id == bankId
      })?.[0]
      if (!account) return null
      const { deptId, deptName } = account
      this.payDeptList = [{ deptId, deptName }]
      return account
    },
    handleAddEditOk() {
      this.validateData()
        .then(res => {
          const { incomeCash, payType, incomeBank, remark, schoolId, sysBankId } = res
          let params = {
            incomeCash,
            payType,
            incomeBank,
            remark,
            schoolId,
            sysBankId
          }
          if (this.id) {
            params.id = this.id
          } else {
            params.finOnlineChannelId = this.finOnlineChannelId
          }
          return addFinOnlineInfo(params)
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
      this.queryAccountList()
    },
    backindData(record, flag) {
      const { payType, incomeBank, incomeCash, remark, updateDate, incomeType, incomePlatform, incomeAccount, schoolId, sysBankId } = record
      let userName = this.nickname()
      let formData = {
        payType,
        incomeBank,
        userName,
        incomeCash: incomeCash || '',
        remark: remark || '',
        schoolId,
        sysBankId
      }
      this.isEdit = false
      if (flag) {
        this.id = record.id
        this.isEdit = true
        formData = Object.assign(formData, { updateDate: updateDate.slice(0, 10), incomeType, incomePlatform, incomeAccount })
      } else {
        this.finOnlineChannelId = record.id
      }
      console.log(7777, formData)
      this.payType = payType === 'A' ? true : false
      this.$nextTick(() => {
        this.formEdit.setFieldsValue(formData)
      })
    },
    validateData() {
      return this.formEdit.validateFields()
    },
    resetForm() {
      this.id = ''
      this.finOnlineChannelId = ''
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
