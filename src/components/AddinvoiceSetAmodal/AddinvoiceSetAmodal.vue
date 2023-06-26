<template>
  <a-modal :title="title" :width="1000" :visible="invoiceSetModal" :confirmLoading="invoiceSetModalLoading"
    @ok="saveInvoiceSet('ruleForm')" @cancel="close">

    <a-form-model ref="ruleForm" :model="invoiceSetForm" :rules="rules">
      <a-row v-if="chooseSchool">
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="学员分馆" prop="deptId">
            <a-tree-select style="width:100%;" v-model="invoiceSetForm.deptId" :allowClear="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="schoolList" treeDefaultExpandAll />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="学员姓名" v-if="invoiceSetForm.stuName">
            {{ invoiceSetForm.stuName }}
          </a-form-model-item>
          <a-form-model-item v-bind="defaultLayout" label="学员姓名" v-if="!invoiceSetForm.stuName">
            <span @click="openChoosePop">
              <a-input style="cursor: 'pointer';color: '#000'" disabled placeholder="请选择学员姓名"
                v-model="invoiceSetForm.stuName">
                <a-icon slot="addonAfter" type="search" />
              </a-input>
            </span>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="手机号码" v-if="invoiceSetForm.stuName">
            {{ invoiceSetForm.stuPhone }}
          </a-form-model-item>
        </a-col>
      </a-row>
      <div v-if="detail" style="font-size: 14px; line-height: 24px;margin-bottom:20px;text-align: center;">
        <a-row>
          <a-col :span="6">
            总缴费金额：{{ detail.price }}
          </a-col>
          <a-col :span="6">
            总退费金额：{{ detail.refundPrice }}
          </a-col>
          <a-col :span="6">
            往期已开票金额：{{ detail.actualTotalPrice }}
          </a-col>
          <a-col :span="6">
            补录开票金额：{{ detail.supplePrice }}
          </a-col>
          <a-col :span="6">
            剩余开票金额：{{ availableInvoice }}
          </a-col>
        </a-row>
      </div>
      <span v-if="handlePermBox('finance:invoice:view')">
        <a-table :columns="columns" :dataSource="financeInvoices" :rowKey="(record, index) => index" :pagination="false"
          :loading="tableLoading" bordered :scroll="{ x: 600 }" style="padding-bottom:10px;"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectionChange }">
          <span slot="nowPrice" slot-scope="text, record, index">
            <!-- 本次开票金额小于等于缴费金额-往期开票金额 -->
            <a-input-number v-model="record.nowPrice" style="width:100%" :precision="2" :min="0"
               :max="calMaxNowPrice(record)"/>
          </span>
          <span slot="surplus" slot-scope="text, record">
            {{ calSurplus(record) }}
          </span>
        </a-table>
        <div class="flex space-between">
          <div>本次已勾选 <span class="text-bold">{{ selectedRowKeys.length || 0 }}</span> <span>条</span></div>
          <div style="font-size:16px;">
            本次申请开票金额（列表勾选后填写）：<span style="font-weight:bold;color:red;">{{ nowPriceTotal }}</span>
          </div>
        </div>
      </span>
      <a-divider></a-divider>
      <a-row>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="开票方式" prop="method" required>
            <a-select v-model="invoiceSetForm.method" @change="handleMethodChange">
              <a-select-option v-for="(type, index) in methodList" :key="type.value" :value="type.value">{{ type.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="开票类型" prop="type" required>
            <a-select v-model="invoiceSetForm.type" @change="handleTypeChange">
              <a-select-option v-for="(type, index) in typeList" :value="type.value" :key="type.value">
                {{ type.name }}
              </a-select-option>
            </a-select>
            <div>个人只能开普票，企业可开普票或者专票</div>
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item v-bind="invoiceLayout" label="发票抬头" prop="title">
            <a-input v-model.trim="invoiceSetForm.title" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item v-bind="invoiceLayout" :label="isIndividual ? '身份证号' : '税号'" prop="ideNumber">
            <a-input v-model.trim="invoiceSetForm.ideNumber" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item v-bind="invoiceLayout" label="发票内容" prop="content">
            <a-popover placement="top" trigger="click">
              <template slot="content">
                <div class="auto-complete-group">
                  <div v-for="(content, index) in invoiceAutoComplete" :key="index" class="auto-complete-item"
                    @click="invoiceSetForm.content = content">{{ content }}</div>
                </div>
              </template>
              <a-input v-model.trim="invoiceSetForm.content" />
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col v-if="!isIndividual" :span="24">
          <a-form-model-item v-bind="invoiceLayout" label="开户行" prop="bank">
            <a-input v-model.trim="invoiceSetForm.bank" />
          </a-form-model-item>
        </a-col>
        <a-col v-if="!isIndividual" :span="24">
          <a-form-model-item v-bind="invoiceLayout" label="开票地址" prop="address">
            <a-input v-model.trim="invoiceSetForm.address" />
          </a-form-model-item>
        </a-col>
        <a-col v-if="!isIndividual" :span="24">
          <a-form-model-item v-bind="invoiceLayout" label="开户账号" prop="bankNumber">
            <a-input v-model.trim="invoiceSetForm.bankNumber" />
          </a-form-model-item>
        </a-col>
        <a-col v-if="!isIndividual" :span="24">
          <a-form-model-item v-bind="invoiceLayout" label="开票电话" prop="phone">
            <a-input v-model.trim="invoiceSetForm.phone" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item v-bind="invoiceLayout" label="备注" prop="remark">
            <a-input v-model="invoiceSetForm.remark" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <ChooseStu ref="choosestu" :autoLoad="false" :multiple="false" @getBackData="getStuData" :invoiceList="true"
      :noArea="true" :branch="true" :studentNumber="true"></ChooseStu>
  </a-modal>
</template>
<script>
import { saveInvoiceNew, getFinanceInvoice, getSaveStuInvoice, getUpdateStuInvoice } from '@/api/invoice/invoice'
import ChooseStu from '@/components/ChooseStu'
import { getSchoolList } from '@/api/education/card'
import Decimal from "decimal.js"
import Vue from 'vue'
import TestChild from '@/views/test/TestChild.vue'
const defaultLayout = {
  labelCol: { md: { span: 6 } },
  wrapperCol: { md: { span: 14 } }
}
const invoiceLayout = {
  labelCol: { md: { span: 3 } },
  wrapperCol: { md: { span: 20 } }
}

export default {
  components: {
    ChooseStu
  },
  props: {
    studentInfo: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    let validateIdeNumber = (rule, value, callback) => {
      let regPerson = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/
      if (this.invoiceSetForm.method === 'false' && this.invoiceSetForm.ideNumber === '') {
        callback(new Error('请输入身份证号'))
      } else if (this.invoiceSetForm.method === 'false' && !regPerson.test(value)) {
        callback(new Error('请输入正确的格式'))
      } else if (this.invoiceSetForm.method === 'true' && this.invoiceSetForm.ideNumber === '') {
        callback(new Error('请输入税号'))
      } else {
        callback()
      }
    }

    return {
      invoiceLayout,
      defaultLayout,
      invoiceSetModal: false, //开票设置弹窗
      currentInvoicePrice: 0,
      invoiceSetModalLoading: false, //开票设置确认按钮
      detail: null,       // 请求的回显数据
      invoiceSetForm: {
        stuId: null,      // 学员id
        deptId: null,     // 分馆id
        price: 0,         // 申请开票金额
        method: 0,        // 开票方式
        type: 'A',        // 开票类型
        title: null,      // 抬头
        number: null,     // 税号/身份证号
        content: null,    // 发票内容
        bank: null,       // 开户行（专票） 
        address: null,    // 开票地址（专票）
        bankNumber: null, // 开户行账号（专票）
        phone: null,      // 开票电话（专票）
        remark: null,     // 备注

        // 
        stuName: '',
        stuPhone: '',
        invoicePrice: '',
      },
      financeInvoices: [],
      methodList: [
        {
          name: '个人',
          value: 0
        },
        {
          name: '企业',
          value: 1
        }
      ],
      title: '新增',
      columns: [
        {
          title: '缴费日期',
          width: 190,
          align: 'center',
          dataIndex: 'tradeDate',
        },
        {
          title: '缴费金额',
          width: 120,
          align: 'center',
          dataIndex: 'price',
        },
        {
          title: '缴费方式',
          width: 120,
          align: 'center',
          dataIndex: 'type',
          customRender: (text, record) => {
            return text === 'A' ? '全款' : 'B' ? '定金' : 'C' ? '补缴' : ''
          }
        },
        {
          title: '支付方式',
          width: 120,
          align: 'center',
          dataIndex: 'dictValue',
        },
        {
          title: '往期开票金额',
          width: 120,
          align: 'center',
          dataIndex: 'actualPrice',
        },
        {
          title: '本次开票金额',
          align: 'center',
          scopedSlots: { customRender: 'nowPrice' }
        },
        {
          title: '剩余开票金额（参考）',
          align: 'center',
          scopedSlots: { customRender: 'surplus' }
        }
      ],
      tableLoading: false,
      tableData: [],
      selectedRowKeys: [],
      selectedRows: [],
      refundPrice: 0,
      schoolList: [], //分馆树状数据
      chooseSchool: false,
      invoiceAutoComplete: [],
    }
  },
  computed: {
    school_id() {
      return this.$store.getters.school_id
    },
    // 个人发票
    isIndividual() {
      return this.invoiceSetForm.method == 0
    },
    // 专票
    isSpecialInvoice() {
      return this.invoiceSetForm.type == 'B'
    },
    // 个人普票
    isIndividualAndNotSpecialInvoice() {
      return this.isIndividual && !this.isSpecialInvoice
    },
    // 企业专票
    isEnterpriseSpecialInvoice() {
      return !this.isIndividual && this.isSpecialInvoice
    },
    // 开票类型下拉
    typeList() {
      if (this.isIndividual) {
        return [
          {
            name: '普票',
            value: 'A'
          },

        ]
      }
      return [{
        name: '普票',
        value: 'A'
      },
      {
        name: '专票',
        value: 'B'
      }
      ]

    },
    // 不同类型票不同验证字段
    rules() {
      let required = !!this.isEnterpriseSpecialInvoice
      let rules = {
        deptId: [{ required: true, message: '请选择学员分馆', trigger: 'change' }],
        title: [{ required: true, message: '请填写发票抬头', trigger: 'blur' }],
        ideNumber: [{ required: false, trigger: 'blur' }],
        content: [{ required: false, message: '请填写开票内容', trigger: 'blur' }],
        bank: [{ required, message: '请填写开户行', trigger: 'blur' }],
        address: [{ required, message: '请填写开票地址', trigger: 'blur' }],
        bankNumber: [{ required, message: '请填写开户账号', trigger: 'blur' }],
        phone: [{ required, message: '请填写开票电话', trigger: 'blur' }],
      }
      return rules
    },
    // 剩余可开票金额
    availableInvoice() {
      if (!this.detail) return 0
      const { price, refundPrice, actualTotalPrice } = this.detail
      return Decimal(price).add(Decimal(refundPrice)).sub(Decimal(actualTotalPrice)).toNumber()
    },
    // 本次申请开票金额
    nowPriceTotal() {
      let total = Decimal(0)
      for (let i = 0; i < this.selectedRows.length; i++) {
        const item = this.selectedRows[i]
        let nowPrice = item.nowPrice || 0
        total = total.add(Decimal(nowPrice))
      }
      return total.toNumber()
    }
  },
  watch: {
    invoiceSetModal(n, o) {
      if (n) {
        if (JSON.parse(Vue.ls.get('userSchoolId')) == null || !JSON.parse(Vue.ls.get('userSchoolId')).length) {
          this.chooseSchool = true
        }
        this.treeSelectNormalizeObj()
        this.invoiceAutoComplete = Vue.ls.get('autoComplete_invoice') || []
      }
    }
  },
  mounted() {
    console.log(JSON.parse(Vue.ls.get('userSchoolId')))
  },
  // watch:{
  //   studentInfo(n,o) {
  //     console.log(this.studentInfo)
  //     console.log(n)
  //     this.currentInvoicePrice = this.studentInfo.invoicePrice
  //   }
  // },
  methods: {
    reset() {
      this.invoiceSetForm = {
        stuId: null,      // 学员id
        deptId: null,     // 分馆id
        price: 0,         // 申请开票金额
        method: 0,        // 开票方式
        type: 'A',        // 开票类型
        title: null,      // 抬头
        number: null,     // 税号/身份证号
        content: null,    // 发票内容
        bank: null,       // 开户行（企业普票  专票） 
        address: null,    // 开票地址（企业普票  专票）
        bankNumber: null, // 开户行账号（企业普票  专票）
        phone: null,      // 开票电话（企业普票  专票）
        remark: null,     // 备注
      }
      this.detail = null
      this.resetTableList()
    },
    resetTableList() {
      this.financeInvoices = []
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    // 获取学员信息（发票开票管理入口）
    open(record) {
      this.reset()
      this.invoiceSetModal = true
      if (record) {
        this.title = '修改'
        this.queryStudentInfo(record)
      } else {
        this.title = '新增'
      }
    },
    // 修改获取学员信息
    queryStudentInfo(record) {
      const params = { finInvoiceId: record.finInvoiceId }
      getUpdateStuInvoice(params).then(res => {
        const { refundPrice, finInvoice, finMapList, stuName, stuPhone, stuId } = res.data
        this.detail = res.data
        this.refundPrice = refundPrice
        // 修改时，兼容本次申请金额
        this.financeInvoices = finMapList
        for (const item of this.financeInvoices) {
            this.$set(item, 'nowPrice', item.infoPrice)
        }
        // this.$set(this, 'financeInvoices', finMapList)
        // this.financeInvoices = finMapList
        
        this.invoiceSetForm = finInvoice
        // 兼容数据
        this.invoiceSetForm.method = finInvoice.method ? 1 : 0
        this.invoiceSetForm.stuId = stuId
        this.invoiceSetForm.stuName = stuName
        this.invoiceSetForm.stuPhone = stuPhone
      })
    },
    getStudentInfo(type) {
      // 兼容原来学员详情页进入的逻辑
      if (type == 'studentInfo') {
        this.reset()
      }
      this.resetTableList()
      getSaveStuInvoice({ stuId: this.invoiceSetForm.stuId || this.studentInfo.stuId }).then(res => {
        if (res.data?.price >= 0 ) {
          const { refundPrice, actualTotalPrice, price, supplePrice } = res.data
          this.refundPrice = refundPrice
          this.financeInvoices = res.data.finMapList || []
          this.invoiceSetForm.title = this.invoiceSetForm.stuName
          this.detail = {
            price,
            refundPrice,
            actualTotalPrice,
            supplePrice
          }
        }
      })
      // this.$nextTick(() => {
      let arr = ['invoicePrice', 'stuPhone', 'stuName', 'stuId']
      // let obj = JSON.parse(JSON.stringify(this.studentInfo))
      Object.keys(this.studentInfo).forEach(item => {
        if (arr.includes(item)) {
          this.invoiceSetForm[item] = this.studentInfo[item]
        }
      })
      this.invoiceSetForm = Object.assign({}, this.invoiceSetForm, {})
      this.currentInvoicePrice = this.studentInfo.invoicePrice
      // this.$set(this.invoiceSetForm, 'type', 'A')
      // this.$set(this.invoiceSetForm, 'method', 'false')
      // })
    },
    treeSelectNormalizeObj() {
      // let { api } = itemObj.treeOps
      // let selectFather = itemObj.selectFather
      getSchoolList().then(res => {
        const renderArr = this.handleTreeData(res.data)
        this.schoolList = renderArr
      })
      console.log(this.schoolList)
    },
    handleTreeData(data) {
      return data.map((item, index) => {
        let temObj = {}
        temObj.title = item.deptName
        temObj.value = item.deptId
        temObj.key = item.deptId
        if (item.children) {
          temObj.children = this.handleTreeData(item.children)
          temObj.disabled = true
        }
        return temObj
      })
    },
    // 选择学员后
    getStuData(data) {
      this.invoiceSetForm.stuId = data.stuId
      this.invoiceSetForm.stuName = data.stuName
      this.invoiceSetForm.stuPhone = data.stuPhone
      this.getStudentInfo(true)
      // this.queryStudentInfo()
      // this.studentInfo.invoicePrice = data.price
      // this.title = '新增'
      // let arr = ['stuName', 'stuPhone', 'stuId']
      // arr.forEach(item => (this.studentInfo[item] = data[item]))
      // this.studentInfo.invoicePrice = data.price
      // this.$nextTick(() => {
      //   this.invoiceSetModal = true
      //   this.getStudentInfo(true)
      // })
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    onSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    rulesChange() {
      let validateIdeNumber = (rule, value, callback) => {
        if (this.invoiceSetForm.method === 'false' && this.invoiceSetForm.ideNumber === '') {
          callback(new Error('请输入身份证号'))
        } else if (this.invoiceSetForm.method === 'false' && !regPerson.test(value)) {
          callback(new Error('请输入正确的格式'))
        } else if (this.invoiceSetForm.method === 'true' && this.invoiceSetForm.ideNumber === '') {
          callback(new Error('请输入税号'))
        } else {
          callback()
        }
      }
      let val = false
      if (this.invoiceSetForm.type === 'B' && this.invoiceSetForm.method === 'true') {
        val = true
      }
      return (this.rules = {
        //   price: [{ required: true, message: '请填写需开票金额', trigger: 'blur' }],
        deptId: [{ required: true, message: '请选择学员分馆', trigger: 'change' }],
        title: [{ required: true, message: '请填写发票抬头', trigger: 'blur' }],
        number: [{ required: false, trigger: 'blur' }],
        bank: [{ required: val, message: '请填写开户行', trigger: 'blur' }],
        address: [{ required: val, message: '请填写开票地址', trigger: 'blur' }],
        bankNumber: [{ required: val, message: '请填写开户账号', trigger: 'blur' }],
        phone: [{ required: val, message: '请填写开票电话', trigger: 'blur' }],
        content: [{ required: false, message: '请填写开票内容', trigger: 'blur' }]
      })
    },
    openChoosePop() {
      this.$refs.choosestu.open()
    },
    handleMethodChange(val) {
      // 个人
      if (val == 0) {
        this.invoiceSetForm.title = this.invoiceSetForm.stuName
      } else {
        // 企业
        this.invoiceSetForm.title = ''
      }
    },
    //切换普票专票清空数据
    handleTypeChange(data) {
      let arr = ['address', 'bank', 'bankNumber', 'phone']
      arr.forEach(item => this.$set(this.invoiceSetForm, item, ''))
      // this.rulesChange()
    },
    close() {
      // this.currentInvoicePrice = 0
      // Object.keys(this.invoiceSetForm).forEach(item => {
      //   this.invoiceSetForm[item] = ''
      // })
      // this.$set(this.invoiceSetForm, 'type', 'A')
      // this.$set(this.invoiceSetForm, 'method', 'false')
      // console.log(this.invoiceSetForm.stuName)
      // this.financeInvoices = []
      // this.selectedRowKeys = []
      this.invoiceSetModal = false
    },

    //数据回显
    MsgShow(data) {
      console.log(data)
      this.$nextTick(() => {
        getSaveStuInvoice(this.studentInfo.stuId || data.stuId, { invoiceId: data.id }).then(res => {
          if (res.code === 200) {
            this.refundPrice = res.data.refundPrice
            this.financeInvoices = res.data.financeList
            this.invoiceSetForm.deptId = res.data.schoolId
            this.financeInvoices.forEach((item, index) => {
              if (item.needInvoicePrice !== 0) {
                this.selectedRowKeys.push(index)
              }
            })
            console.log(this.financeInvoices)
          }
        })
        this.currentInvoicePrice = data.financePrice || 0
        Object.keys(data).forEach(item => (this.invoiceSetForm[item] = data[item]))
        this.invoiceSetForm.method = data.method + ''
        // this.invoiceSetForm.invoicePrice = typeof(data.financePrice)=='number'?data.financePrice: data.invoicePrice
      })
    },
    handleTotalPrice(value) {
      this.showPayment = value
    },
    // 
    saveInvoiceSet(formName) {
      if (this.nowPriceTotal == 0) {
        return this.$notification.error({
          message: '系统通知',
          description: '本次申请开票金额不能为0'
        })
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.invoiceSetModalLoading = true
          //处理数据
          const { stuId, deptId, price, method, type, title, ideNumber, content, bank, address, bankNumber, phone, remark } = this.invoiceSetForm
          let params = {
            stuId,
            deptId: deptId || this.school_id,
            price: this.nowPriceTotal,
            method,
            type,
            title,
            ideNumber,
            content,
            bank,
            address,
            bankNumber,
            phone,
            remark
          }
          let finInfoList = []
          this.financeInvoices.forEach((item, index) => {
            if (this.selectedRowKeys.includes(index)) {
              let todo = {
                finId: item.finId,
                nowPrice: item.nowPrice
              }
              finInfoList.push(todo)
            }
          })
          params.finInfoList = finInfoList
          params.finInvoiceId = this.detail?.finInvoice?.id
          saveInvoiceNew(params)
            .then(res => {
              this.saveInvoiceAutoComplete()
              this.$emit('updateTable')
              this.$notification['success']({
                message: '系统通知',
                description: '开票信息设置成功'
              })
              this.close()
            })
            .catch(err => {
              console.log('提交失败', this.invoiceSetForm)
              console.log(err)
            })
            .finally(() => {
              this.invoiceSetModalLoading = false
            })
        }
      })
    },
    saveInvoiceAutoComplete() {
      let autoComplete = this.invoiceAutoComplete
      let currentContent = this.invoiceSetForm.content
      if (autoComplete.includes(currentContent)) {
        console.log('选择已填写内容')
      } else {
        autoComplete = [currentContent, ...autoComplete]
        Vue.ls.set('autoComplete_invoice', autoComplete.length > 5 ? autoComplete.slice(0, 5) : autoComplete)
      }
    },
    // 计算本次开票金额最大值
    calMaxNowPrice(record) {
      const { price = 0, actualPrice = 0 } = record
      // 缴费金额-往期开票金额
      let max = Decimal(price).sub(Decimal(actualPrice)).toNumber()
      return max
    },
    // 计算剩余开票可开票金额
    calSurplus(record) {
      const { price = 0, actualPrice = 0, nowPrice = 0 } = record
      // 缴费金额-往期开票金额-本次开票金额
      let surplus = Decimal(price).sub(Decimal(actualPrice)).sub(Decimal(nowPrice || 0)).toNumber()
      // 修复本次开票金额回显数据大于(缴费金额-往期开票金额)
      if (surplus < 0) {
        record.nowPrice = this.calMaxNowPrice(record)
        return 0
      }
      return surplus
    }
  }
}
</script>

<style lang="less" scoped>
.auto-complete-group {
  margin: -12px -16px;
  padding: 4px 0;

  .auto-complete-item {
    cursor: pointer;
    padding: 5px 12px;
    font-weight: normal;
    font-size: 14px;
    line-height: 22px;
    max-width: 180px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    &:hover {
      background-color: #dae8e1;
    }
  }
}
</style>
