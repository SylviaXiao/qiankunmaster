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
              <a-form-item v-bind="formLayout" label="收入类别">
                <a-input
                  v-decorator="[`incomeType`, { rules: [{ required: true, message: '请输入收入类别' }] }]"
                  placeholder="请输入收入类别"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="收入平台">
                <a-input
                  v-decorator="[`incomePlatform`, { rules: [{ required: true, message: '请输入收入平台' }] }]"
                  placeholder="请输入收入平台"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="账号">
                <a-input v-decorator="[`incomeAccount`, { rules: [{ required: true, message: '请输入账号' }] }]" placeholder="请输入账号" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="账号ID">
                <a-input
                  v-decorator="[`incomeAccountId`, { rules: [{ required: false, message: '请输入账号ID' }] }]"
                  placeholder="请输入账号ID"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="登录">
                <a-input v-decorator="[`incomeSign`, { rules: [{ required: false, message: '请输入登录' }] }]" placeholder="请输入登录" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="密码">
                <a-input
                  v-decorator="[`incomePassword`, { rules: [{ required: false, message: '请输入密码' }] }]"
                  placeholder="请输入密码"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="打款方式">
                <a-select
                  :allowClear="true"
                  @change="payTypeChange"
                  v-decorator="[`payType`, { rules: [{ required: false, message: '请选择打款方式' }] }]"
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
                  <a-select-option v-for="(item, index) in accountList" :key="index" :value="`${index}~${item.id}~${item.bankCardNo}~${item.bankName}`">
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
              <a-form-item v-bind="formLayout" label="营业执照">
                <a-input
                  v-decorator="[`incomelicense`, { rules: [{ required: true, message: '请输入营业执照' }] }]"
                  placeholder="请输入营业执照"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="开户行">
                <a-input
                  v-decorator="[`incomeBankDeposit`, { rules: [{ required: false, message: '请输入开户行' }] }]"
                  placeholder="请输入开户行"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="提现日期">
                <a-date-picker
                  v-decorator="[`incomeDate`, { rules: [{ required: false, message: '请输入提现日期' }] }]"
                  placeholder="请选择提现日期"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  valueFormat="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="发票信息">
                <a-input
                  v-decorator="[`incomeInvoice`, { rules: [{ required: false, message: '请输入发票信息' }] }]"
                  placeholder="请输入发票信息"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="发票邮寄地址">
                <a-input
                  v-decorator="[`incomeAddress`, { rules: [{ required: false, message: '请输入发票邮寄地址' }] }]"
                  placeholder="请输入发票邮寄地址"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="到账周期">
                <a-input
                  v-decorator="[`incomeReceipt`, { rules: [{ required: false, message: '请输入到账周期' }] }]"
                  placeholder="请输入到账周期"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :lg="24" :md="24" :sm="24">
              <a-form-item v-bind="formLayout" label="登陆网址">
                <a-input
                  v-decorator="[`incomeUrl`, { rules: [{ required: false, message: '请输入登陆网址' }] }]"
                  placeholder="请输入登陆网址"
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
import { addFinOnline } from '@/api/organize'
import { listOrgDept, listBank } from '@/api/education/card'
import { formLayout } from '../organizeConst'
import IModal from '@/components/InnerModal'
export default {
  components: {
    IModal
  },
  props: {
    title: {
      type: String,
      default: '新增收入渠道信息'
    },
    stuId: String
  },
  data() {
    return {
      payType: false,
      cityArr: [{ id: 'A', name: '对公' }, { id: 'B', name: '对私' }],
      id: '',
      formLayout,
      visibleAddEdit: false,
      confirmAddEditLoading: false,
      record: {},
      showDept: false,
      payDeptList: [], // 付款分馆
      accountList: [], // 付款分馆对应的银行账号
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
    onValuesChange(props, values) {
      this.showDept = !!this.formEdit.getFieldValue('sysBankId')
    },
    async queryAccountList() {
      let res = await listBank()
      this.accountList = res.data
      let sysBankId = this.formEdit.getFieldValue('sysBankId')
      if (sysBankId) {
        let account = this.setSchoolId(sysBankId)
        const { firstIndex, id, bankCardNo, bankName } = account
        this.formEdit.setFieldsValue({ sysBankId: `${firstIndex}~${id}~${bankCardNo}~${bankName}` })
      }
      
    },
    handleBankAccountChange(indexValue) {
      this.formEdit.setFieldsValue({ sysBankId: indexValue })
      let value = indexValue.split('~')[1]
      let account = this.setSchoolId(value)
      if (!account) return
      this.formEdit.setFieldsValue({
        schoolId: account.deptId,
        incomeBankDeposit: account.bankName
      })
    },
    setSchoolId(bankId) {
      let firstIndex = -1
      let account = this.accountList.filter((item, index) => {
        let result = item.id == bankId  
        if (result) { firstIndex = index }
        return result
      })?.[0]
      if (!account) return null
      const { deptId, deptName } = account
      this.payDeptList = [{ deptId, deptName }]
      account.firstIndex = firstIndex
      return account
    },
    // filterOption(input, option) {
    //   return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    // },
    payTypeChange(e) {
      this.payType = e === 'A' ? true : false
    },
    handleAddEditOk() {
      this.validateData()
        .then(res => {
          const {
            incomeType,
            incomePlatform,
            incomeAccount,
            incomeAccountId,
            incomeSign,
            incomePassword,
            payType,
            schoolId,
            sysBankId,
            incomelicense,
            incomeBankDeposit,
            incomeDate,
            incomeInvoice,
            incomeAddress,
            incomeReceipt,
            incomeUrl
          } = res
          let params = {
            incomeType,
            incomePlatform,
            incomeAccount,
            incomeAccountId,
            incomeSign,
            incomePassword,
            payType,
            schoolId,
            sysBankId: sysBankId.split('~')[1],
            incomelicense,
            incomeBankDeposit,
            incomeDate,
            incomeInvoice,
            incomeAddress,
            incomeReceipt,
            incomeUrl
          }
          if (this.id) {
            params.id = this.id
          }
          return addFinOnline(params)
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
    backindData(record) {
      this.record = record
      const {
        incomeType,
        incomePlatform,
        incomeAccount,
        incomeAccountId,
        incomeSign,
        incomePassword,
        payType,
        sysBankId,
        schoolId,
        incomelicense,
        incomeBankDeposit,
        incomeDate,
        incomeInvoice,
        incomeAddress,
        incomeReceipt,
        incomeUrl
      } = record
      this.id = record.id
      let formData = {
        incomeType,
        incomePlatform,
        incomeAccount,
        incomeAccountId,
        incomeSign,
        incomePassword,
        payType,
        sysBankId,
        schoolId,
        incomelicense,
        incomeBankDeposit,
        incomeDate,
        incomeInvoice,
        incomeAddress,
        incomeReceipt,
        incomeUrl
      }
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
      this.payType = '',
      this.showDept = false,
      this.payDeptList = [],
      this.accountList = [] 
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
