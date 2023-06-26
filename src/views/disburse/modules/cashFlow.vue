<template>
  <a-modal
    :maskClosable="$store.state.modalMaskClickEnable"
    :title="title"
    v-model="modal"
    width="900px"
    okText="保存"
    cancelText="取消"
    @ok="submit"
    :confirmLoading="isloading"
  >
    <a-form-model ref="ruleForm" :model="form" :rules="rules">
      <a-row>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转出日期" prop="date" v-if="selectKey === 'B'">
            <a-date-picker @change="changeDate(form.date)" v-model="form.date" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转出部门/分馆：" prop="outDeptId" v-if="selectKey === 'B'">
            <!-- <a-tree-select
              style="min-width:120px;"
              v-model="form.outDeptId"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="schoolList"
              treeDefaultExpandAll
              @change="deptChange(form.outDeptId,'out')"
            /> -->
            <a-cascader
              @change="deptChange(form.outDeptId, 'out')"
              v-if="schoolList"
              style="width:100%;"
              :options="schoolList"
              :showSearch="true"
              :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
              changeOnSelect
              v-model="form.outDeptId"
              placeholder="请选择转出部门/分馆"
            />
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转出部门/分馆：" v-else>
            {{ showForm.deptName }}
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转出费用归类：" prop="feeItemOutId" v-if="selectKey === 'B'">
            <a-select
              v-model="form.feeItemOutId"
              style="width:100%;"
              option-filter-prop="children"
              :filter-option="filterOption"
              show-search
              @change="(param1, param2) => dataChange(param1, param2, form.feeItemOutId, 'out')"
            >
              <a-select-option v-for="(item, index) in runningTypesOut" :key="index" :value="item.id">{{ item.feeItemName }} </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转出费用归类：" v-else>
            {{ showForm.feeItemNameOut }}
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转出财务归类：" prop="financeNameOut" v-if="selectKey === 'B'">
            <a-input v-model="form.financeNameOut" :read-only="true" />
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转出财务归类：" v-else>
            {{ showForm.financeNameOut }}
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转出经营归类：" prop="operateNameOut" v-if="selectKey === 'B'">
            <a-input v-model="form.operateNameOut" :read-only="true" />
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转出经营归类：" v-else>
            {{ showForm.operateNameOut }}
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转出银行账户：" prop="outBankNo" v-if="selectKey === 'B'">
            <a-select
              v-model="form.outBankNo"
              style="width:100%;"
              @focus="focusAccount(form.outDeptId, 'out')"
              showSearch
              option-filter-prop="children"
              :filter-option="filterOption"
            >
              <a-select-option v-for="(item, index) in outBankNos" :key="index" :value="item.id">{{ item.bankNo }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转出银行账户：" v-else>
            {{ showForm.bankNo }}
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转出金额" prop="total" v-if="selectKey === 'B'">
            <a-input-number v-model="form.total" :min="1"></a-input-number>&nbsp;元
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转出金额" v-else>
            {{ form.total }}
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转入部门/分馆：" prop="inDeptId" v-if="selectKey === 'B'">
            <!-- <a-tree-select
              style="min-width:120px;"
              v-model="form.inDeptId"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="schoolList"
              treeDefaultExpandAll
              @change="deptChange(form.inDeptId,'in')"
            /> -->
            <a-cascader
              @change="deptChange(form.inDeptId, 'in')"
              v-if="schoolList"
              style="width:100%;"
              :options="schoolList"
              :showSearch="true"
              :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
              changeOnSelect
              v-model="form.inDeptId"
              placeholder="请选择转入部门/分馆"
            />
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转入部门/分馆：" v-else>
            {{ showForm.deptNameInto }}
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转入费用归类：" prop="feeItemIntoId" v-if="selectKey === 'B'">
            <a-select
              v-model="form.feeItemIntoId"
              style="width:100%;"
              option-filter-prop="children"
              :filter-option="filterOption"
              show-search
              @change="(param1, param2) => dataChange(param1, param2, form.feeItemIntoId, 'in')"
            >
              <a-select-option v-for="(item, index) in runningTypesIn" :key="index" :value="item.id">{{ item.feeItemName }} </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转入费用归类：" v-else>
            {{ showForm.feeItemNameInto }}
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转入财务归类：" prop="financeNameInto" v-if="selectKey === 'B'">
            <a-input v-model="form.financeNameInto" :read-only="true" />
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转入财务归类：" v-else>
            {{ showForm.financeNameInto }}
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转入经营归类：" prop="operateNameInto" v-if="selectKey === 'B'">
            <a-input v-model="form.operateNameInto" :read-only="true" />
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转入经营归类：" v-else>
            {{ showForm.operateNameInto }}
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="转入银行账户" prop="inBankNo" v-if="selectKey === 'B'">
            <a-select
              v-model="form.inBankNo"
              style="width:100%;"
              @focus="focusAccount(form.inDeptId, 'in')"
              showSearch
              option-filter-prop="children"
              :filter-option="filterOption"
            >
              <a-select-option v-for="(item, index) in inBankNos" :key="index" :value="item.id">{{ item.bankNo }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="转入银行账户" v-else>
            {{ showForm.bankNoInto }}
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-model-item v-bind="{ labelCol: { md: { span: 3 } }, wrapperCol: { md: { span: 16 } } }" label="备注" v-if="selectKey === 'B'">
            <a-input type="textarea" v-model="form.remark"></a-input>
          </a-form-model-item>
          <a-form-model-item v-bind="{ labelCol: { md: { span: 3 } }, wrapperCol: { md: { span: 16 } } }" label="备注" v-else>
            {{ form.remark }}
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>
<script>
import {
  listOrgDept,
  listBankByDeptId,
  confirmFinAccountFund,
  saveFinAccountFund,
  getAccountFundDetail,
  updateFinFund,
  listFeeItem
} from '@/api/education/card'
const defaultLayout = {
  labelCol: { md: { span: 6 } },
  wrapperCol: { md: { span: 16 } }
}
import moment from 'moment'
const defaultDate = moment()
  .subtract(0, 'days')
  .format('YYYY-MM-DD')
export default {
  data() {
    return {
      runningTypesIn: [], //费用归类调入
      runningTypesOut: [], //费用归类调出
      defaultLayout,
      title: null,
      modal: false,
      isloading: false,
      outBankNos: [],
      inBankNos: [],
      form: {
        date: moment(defaultDate, 'YYYY-MM-DD'),
        outDeptId: [],
        inDeptId: [],
        outBankNo: null,
        inBankNo: null,
        total: null,
        remark: null,
        feeItemOutId: null,
        feeItemNameOut: '',
        financeNameOut: '',
        operateNameOut: '',
        feeItemIntoId: null,
        feeItemNameInto: '',
        financeNameInto: '',
        operateNameInto: ''
      },
      rules: {
        date: [{ required: true, message: '请选择转出日期', trigger: 'change' }],
        outDeptId: [{ required: true, message: '请选择转出校区', trigger: 'change' }],

        inDeptId: [{ required: true, message: '请选择转入校区', trigger: 'change' }],
        total: [{ required: true, message: '请填写转出金额', trigger: 'change' }],
        inBankNo: [{ required: true, message: '请选择转入银行账户', trigger: 'change' }],
        outBankNo: [{ required: true, message: '请选择转出银行账户', trigger: 'change' }],
        feeItemOutId: [{ required: true, message: '请选择转出费用归类', trigger: 'change' }],
        // financeNameOut: [{ required: true, message: '请选择转出财务归类', trigger: 'blur' }],
        // operateNameOut: [{ required: true, message: '请选择转出费用归类', trigger: 'blur' }],
        feeItemIntoId: [{ required: true, message: '请选择转入费用归类', trigger: 'change' }]
        // financeNameInto: [{ required: true, message: '请选择转出费用归类', trigger: 'blur' }],
        // operateNameInto: [{ required: true, message: '请选择转出费用归类', trigger: 'blur' }]
      },
      id: null,
      schoolList: [],
      showForm: {}
    }
  },
  props: {
    selectKey: {
      type: String,
      default: ''
    }
  },
  watch: {
    modal(n, o) {
      console.log(n)
      if (!n) {
        this.id = null
        Object.keys(this.form).forEach(item => {
          if (item !== 'outDeptId' && item !== 'inDeptId') {
            this.form[item] = ''
          }
          this.form.outDeptId = []
          this.form.inDeptId = []
        })
        this.showForm = {}
      }
    }
  },
  methods: {
    dataChange(param1, param2, val, type) {
      if (type == 'out') {
        let costTypes = this.runningTypesOut.filter(item => {
          return item.id == param1
        })[0]
        // this.form.feeItemOutId = param1
        this.form.feeItemNameOut = costTypes ? costTypes.id : ''
        this.form.financeNameOut = costTypes ? costTypes.financeName : ''
        this.form.operateNameOut = costTypes ? costTypes.operateName : ''
      } else {
        let costTypes = this.runningTypesIn.filter(item => {
          return item.id == param1
        })[0]
        // this.form.feeItemIntoId = param1
        this.form.feeItemNameInto = costTypes ? costTypes.id : ''
        this.form.financeNameInto = costTypes ? costTypes.financeName : ''
        this.form.operateNameInto = costTypes ? costTypes.operateName : ''
      }
      console.log(this.form)
    },

    changeDate(date) {
      this.form.date = this.$tools.tailor.getDate(date)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    deptChange(val, type) {
      if (val) {
        let id = this.form.inDeptId[this.form.inDeptId.length - 1]
        if (type === 'out') {
          id = this.form.outDeptId[this.form.outDeptId.length - 1]
        }
        console.log(id)
        listBankByDeptId({ schoolId: id }).then(res => {
          if (res.code === 200) {
            if (type === 'out') {
              this.outBankNos = res.data
            } else {
              this.inBankNos = res.data
            }
          }
        })
      }
      if (!val) {
        if (type === 'out') {
          this.form.outBankNo = null
        } else {
          this.form.inBankNo = null
        }
        this.form.account = null
      }
    },
    focusAccount(deptId, type) {
      if (!deptId.length) {
        let msg = ''
        if (type === 'out') {
          this.form.outBankNos = []
          msg = '请先选择转出校区'
        } else {
          this.form.inBankNos = []
          msg = '请先选择转入校区'
        }
        return this.$notification['error']({
          message: '系统通知',
          description: msg
        })
      }
    },
    //获取分馆数据
    loadSchoolId() {
      //请求接口
      listOrgDept().then(res => {
        if (res.code === 200 && res.data) {
          this.schoolList = res.data
        }
      })
    },
    //处理分馆数据
    _handleData(data) {
      return data.map((item, index) => {
        let itemObj = {}
        itemObj.title = item.deptName
        itemObj.value = item.id
        itemObj.key = item.id
        if (item.children) {
          itemObj.children = this._handleData(item.children)
          itemObj.selectable = true
        }
        return itemObj
      })
    },
    async open(record) {
      this.loadSchoolId()
      // let res = await listBank()
      // if (res.code === 200) {
      //   this.BankNos = res.data
      // }
      let res2 = await listFeeItem({ inctype: 'A', operateName: '资金调入' })
      if (res2.code === 200) {
        this.runningTypesIn = res2.data
      }
      let res3 = await listFeeItem({ inctype: 'A', operateName: '资金调出' })
      if (res3.code === 200) {
        this.runningTypesOut = res3.data
      }
      if (this.selectKey === 'B') {
        this.title = '录入转出资金'
      } else {
        this.title = '接收转入资金'
      }
      if (record) {
        this.id = record.id
        getAccountFundDetail({ finAccountFundId: record.id }).then(res => {
          if (res.code === 200) {
            const { bankId, bankIdInto, deptId, deptIdInto, price, remark, date } = res.data
            this.deptChange(deptId, 'out')
            this.deptChange(deptIdInto, 'in')
            this.form.outBankNo = bankId
            this.form.date = date
            this.form.inBankNo = bankIdInto
            this.form.outDeptId = deptId
            this.form.inDeptId = deptIdInto
            this.form.total = price
            this.form.remark = remark
            this.form.feeItemOutId = res.data.feeItemOutId
            this.form.feeItemNameOut = res.data.feeItemNameOut
            this.form.financeNameOut = res.data.financeNameOut
            this.form.operateNameOut = res.data.operateNameOut
            this.form.feeItemIntoId = res.data.feeItemIntoId
            this.form.feeItemNameInto = res.data.feeItemNameInto
            this.form.financeNameInto = res.data.financeNameInto
            this.form.operateNameInto = res.data.operateNameInto
            if (this.selectKey !== 'B') {
              const { bankNo, bankNoInto, deptName, parentDeptName, parentDeptNameInto, deptNameInto } = res.data
              this.showForm = {
                bankNo: bankNo,
                bankNoInto: bankNoInto,
                deptName: parentDeptName + '-' + deptName,
                deptNameInto: parentDeptNameInto + '-' + deptNameInto,
                feeItemNameOut: res.data.feeItemNameOut,
                financeNameOut: res.data.financeNameOut,
                operateNameOut: res.data.operateNameOut,
                feeItemNameInto: res.data.feeItemNameInto,
                financeNameInto: res.data.financeNameInto,
                operateNameInto: res.data.operateNameInto
              }
            }
          }
        })
      }
      this.modal = true
    },
    submit() {
      if (this.selectKey === 'B') {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let request = saveFinAccountFund
            if (this.id) request = updateFinFund
            this.isloading = true
            request({
              date: this.form.date,
              bankId: this.form.outBankNo,
              bankIntoId: this.form.inBankNo,
              deptId: this.form.outDeptId[this.form.outDeptId.length - 1],
              deptIntoId: this.form.inDeptId[this.form.inDeptId.length - 1],
              price: this.form.total,
              remark: this.form.remark,
              id: this.id || '',
              feeItemOutId: this.form.feeItemOutId,
              feeItemIntoId: this.form.feeItemIntoId
              // bankIntoId:
            })
              .then(res => {
                if (res.code === 200) {
                  this.$emit('refresh')
                  this.$notification['success']({
                    message: '系统通知',
                    description: '操作成功'
                  })
                  this.modal = false
                }
              })
              .finally((this.isloading = false))
          }
        })
      } else {
        confirmFinAccountFund({ finAccountFundId: this.id })
          .then(res => {
            if (res.code === 200) {
              this.isloading = false
              this.$emit('refresh')
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.modal = false
            }
          })
          .finally((this.isloading = false))
      }
    }
  }
}
</script>
