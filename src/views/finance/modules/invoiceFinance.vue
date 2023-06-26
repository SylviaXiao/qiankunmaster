<template>
  <a-modal
    :maskClosable="$store.state.modalMaskClickEnable"
    :title="title"
    :width="800"
    :visible="invoiceSetModal"
    :confirmLoading="invoiceSetModalLoading"
    @ok="saveInvoiceSet('ruleForm')"
    @cancel="close"
  >
    <a-form-model ref="ruleForm" :model="invoiceSetForm" :rules="rules">
      <a-row v-if="chooseSchool">
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="学员分馆" prop="schoolId">
            <a-tree-select
              style="width:100%;"
              v-model="invoiceSetForm.schoolId"
              :allowClear="true"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="schoolList"
              treeDefaultExpandAll
            />
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
              <a-input style="cursor: 'pointer', color: '#000'" disabled placeholder="请选择学员姓名" v-model="invoiceSetForm.stuName">
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
        <!-- </a-row> -->
        <!-- <a-row> -->
        <!-- <div>
          <a-col :span="12">
            <a-form-item v-bind="defaultLayout" label="可开票金额：" v-if="invoiceSetForm.stuName">
              <span>{{ currentInvoicePrice || 0 }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12" style="margin-left:-15px;">
            <a-form-item v-bind="{ labelCol: { md: { span: 7 } }, wrapperCol: { md: { span: 14 } } }" label="该学员退费金额：" v-if="invoiceSetForm.stuName">
              <span style="font-weight:bold;color:red;">{{ refundPrice || 0 }}</span>
            </a-form-item>
          </a-col>
        </div> -->
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="发票时间" style="text-align: left;" prop="applyDate">
            <a-date-picker @change="changeDate(invoiceSetForm.applyDate)" v-model="invoiceSetForm.applyDate" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="需开票金额" style="text-align: left;" prop="price">
            <a-input-number v-model="invoiceSetForm.price" :min="1" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="开票方式" prop="method" required>
            <a-select :allowClear="true" default-value="个人" v-model="invoiceSetForm.method" @change="changeinvoiceMethod">
              <a-select-option v-for="type in invoiceTypeList" :value="type.id" :key="type.id">
                {{ type.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item v-bind="defaultLayout" label="开票类型" prop="type" required>
            <a-select :allowClear="true" default-value="普票" v-model="invoiceSetForm.type" @change="change">
              <a-select-option v-for="type in invoiceTypes" :value="type.id" :key="type.id">
                {{ type.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>

        <a-col :span="24">
          <a-form-model-item v-bind="invoiceLayout" label="发票抬头" style="text-align: left;" prop="title">
            <a-input autocomplete="name" v-model.trim="invoiceSetForm.title" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item v-bind="invoiceLayout" :label="invoiceSetForm.method === 'false' ? '身份证号' : '税号'" style="text-align: left;" prop="ideNumber">
            <a-input autocomplete="name" v-model="invoiceSetForm.ideNumber" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item v-bind="invoiceLayout" label="发票内容" style="text-align: left;" prop="content">
            <a-popover placement="top" trigger="click">
                <template slot="content">
                  <div class="auto-complete-group">
                    <div v-for="(content, index) in invoiceAutoComplete" :key="index" class="auto-complete-item" @click="invoiceSetForm.content = content">{{ content }}</div>
                  </div>
                </template>
                <a-input autocomplete="name" v-model="invoiceSetForm.content" />
            </a-popover>
          </a-form-model-item>
        </a-col>
        <a-col :span="24" v-if="invoiceSetForm.method === 'true'">
          <a-form-model-item v-bind="invoiceLayout" label="开户行" style="text-align: left;" prop="bank">
            <a-input autocomplete="name" v-model="invoiceSetForm.bank" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" v-if="invoiceSetForm.method === 'true'">
          <a-form-model-item v-bind="invoiceLayout" label="开票地址" style="text-align: left;" prop="address">
            <a-input autocomplete="name" v-model="invoiceSetForm.address" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" v-if="invoiceSetForm.method === 'true'">
          <a-form-model-item v-bind="invoiceLayout" label="开户账号" style="text-align: left;" prop="bankNumber">
            <a-input autocomplete="name" v-model="invoiceSetForm.bankNumber" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24" v-if="invoiceSetForm.method === 'true'">
          <a-form-model-item v-bind="invoiceLayout" label="开票电话" style="text-align: left;" prop="phone">
            <a-input autocomplete="name" v-model="invoiceSetForm.phone" />
          </a-form-model-item>
        </a-col>
        <a-col :span="24">
          <a-form-model-item v-bind="invoiceLayout" label="备注" style="text-align: left;">
            <a-input autocomplete="name" v-model="invoiceSetForm.remark" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <Attachment :files="attachments" :delectOpen="true" ref="Attachment" @finalFiles="finalFiles"></Attachment>
      <a-form-model :form="editForm">
        <a-divider orientation="left">
          <span :style="{ color: 'rgba(1,1,1,.3)' }">上传附件</span>
        </a-divider>
          <a-form-model-item v-bind="{ labelCol: { span: 3 }, wrapperCol: { span: 16 } }" label="附件">
            <upload-sth ref="uploadsth" :multiple="true" :required="false" btn-text="附件上传" filePath="reason" @uploadFilesNum="uploadFilesNum"></upload-sth>
            <div class="uploadedFile" v-for="(item, idx) in newUploadFiles" :key="idx">
              <span style="display: flex;flex-flow: row nowrap;justify-content: space-between;">
                <span>{{ item.fileName }}</span>
                <span style="margin-left: 15px;" class="close" @click="deleteFile(item)"><a-icon type="close" style="font-size: 10px;"/></span>
              </span>
            </div>
          </a-form-model-item>
              <a-form-model-item v-if="showCompany" v-bind="{ labelCol: { span: 3 }, wrapperCol: { span: 16 } }" label="开票公司" required :rules="[{ required: true, message: '请选择开票公司', trigger: 'blur' }]">
              <a-select v-model="invoiceSetForm.companyId" show-search option-filter-prop="children" :filter-option="filterOption">
                <a-select-option v-for="( item, index ) in  companyOptions " :key="index" :value="item.id">{{ item.companyName }}</a-select-option>
              </a-select>
            </a-form-model-item>
      </a-form-model>
    </a-form-model>
    <ChooseStu ref="choosestu" :multiple="false" @getBackData="getStuData" :invoiceList="true" :noArea="true" :branch="true" :studentNumber="true"></ChooseStu>
  </a-modal>
</template>
<script>
import { saveFinInvoice, getFinanceInvoice, getInvoiceAttachments, getSaveStuInvoice, getCompanyList } from '@/api/invoice/invoice'
import ChooseStu from '@/components/ChooseStu'
import { getSchoolList } from '@/api/education/card'
import { Attachment } from '@/components'
import UploadSth from '@/components/UploadSth'

import Vue from 'vue'
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
    ChooseStu,
    Attachment,
    UploadSth
  },
  props: {
    studentInfo: {
      type: Object,
      default: () => {}
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
      invoiceSetForm: {
        stuName: '',
        stuPhone: '',
        invoicePrice: '',
        // price: '',
        method: 'false',
        type: 'A',
        title: '',
        stuId: '',
        bank: '',
        address: '',
        bankNumber: '',
        phone: '',
        ideNumber: '',
        content: '',
        schoolId: '',
        applyDate: '',
        price: '',
        companyId: '',
      },
      invoiceTypeList: [
        {
          name: '个人',
          id: 'false'
        },
        {
          name: '企业',
          id: 'true'
        }
      ],
      invoiceTypes: [
        {
          name: '普票',
          id: 'A'
        }
      ],
      rules: {
        applyDate: [{ required: true, message: '请选择开票日期', trigger: 'change' }],
        price: [{ required: true, message: '请选择需开票金额', trigger: 'change' }],
        schoolId: [{ required: true, message: '请选择学员分馆', trigger: 'change' }],
        title: [{ required: true, message: '请填写发票抬头', trigger: 'blur' }],
        ideNumber: [{ required: false, trigger: 'blur' }],// validator: validateIdeNumber,
        content: [{ required: false, message: '请填写开票内容', trigger: 'blur' }]
      },
      title: '新增',
      columns: [
        {
          title: '缴费日期',
          key: 'createDate',
          dataIndex: 'createDate',
          scopedSlots: { customRender: 'createDate' },
          customRender: (text, record) => {
            return text.split(' ')[0]
          }
        },
        {
          title: '缴费金额',
          key: 'price',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '缴费方式',
          key: 'type',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          customRender: (text, record) => {
            return text === 'A' ? '全款' : 'B' ? '定金' : 'C' ? '补缴' : ''
          }
        },
        {
          title: '支付方式',
          key: 'dictValue',
          dataIndex: 'dictValue',
          scopedSlots: { customRender: 'dictValue' }
        },
        {
          title: '往期开票金额',
          key: 'invoicePrice',
          dataIndex: 'invoicePrice',
          scopedSlots: { customRender: 'invoicePrice' }
        },
        {
          title: '本次开票金额',
          key: 'needInvoicePrice',
          dataIndex: 'needInvoicePrice',
          scopedSlots: { customRender: 'needInvoicePrice' }
        },
        {
          title: '剩余开票金额（参考）',
          key: 'surplus',
          dataIndex: 'surplus',
          scopedSlots: { customRender: 'surplus' }
        }
        // {
        //   title: '操作',
        //   key: 'action',
        //   dataIndex: 'action',
        //   scopedSlots: { customRender: 'action' }
        // },
      ],
      tableLoading: false,
      tableData: [],
      selectedRowKeys: [],
      refundPrice: 0,
      schoolList: [], //分馆树状数据
      chooseSchool: false,
      finalAttachments: [],
      attachments: [],
      filesNum: 0,
      newUploadFiles: [],
      invoiceAutoComplete: [],
      companyOptions: [],
    }
  },
  created() {
    this.editForm = this.$form.createForm(this)
  },
  computed: {
    school_id() {
      return this.$store.getters.school_id
    },
    showCompany() {
      return (this.filesNum > 0)
    },
  },
  watch: {
    invoiceSetForm: {
      handler() {
        console.log(this.invoiceSetForm)
        //do something
      },
      deep: true
    },
    invoiceSetModal(n, o) {
      if (n) {
        if (JSON.parse(Vue.ls.get('userSchoolId')) == null || !JSON.parse(Vue.ls.get('userSchoolId')).length) {
          this.chooseSchool = true
        }
        this.treeSelectNormalizeObj()
        this.invoiceAutoComplete = Vue.ls.get('autoComplete_invoice') || []
        this.queryCompanyOptions()
      }
    }
  },
  mounted() {
    console.log(this.invoiceSetForm.stuName, 11)
  },
  // watch:{
  //   studentInfo(n,o) {
  //     console.log(this.studentInfo)
  //     console.log(n)
  //     this.currentInvoicePrice = this.studentInfo.invoicePrice
  //   }
  // },
  methods: {
    deleteFile(item) {
      this.newUploadFiles.remove(item)
    },
    //接受新上传文件的总数量
    uploadFilesNum(num) {
      this.filesNum = num
      if (num > 0) {
        this.invoiceSetForm.companyId = null
      }
    },
    //删除后的文件数组
    finalFiles(files) {
      this.finalAttachments = files.map(item => {
        return item.id
      })
    },
    changeDate(date) {
      this.invoiceSetForm.applyDate = this.$tools.tailor.getDate(date)
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
    queryCompanyOptions() {
      getCompanyList({ page: 0, limit: 0 }).then(res => {
        this.companyOptions = res.data || []
      })
    },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
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
    getStuData(data) {
      console.log(data)
      this.title = '新增'
      let arr = ['stuName', 'stuPhone', 'stuId']
      arr.forEach(item => (this.studentInfo[item] = data[item]))
      this.studentInfo.invoicePrice = data.price
      this.$nextTick(() => {
        this.invoiceSetModal = true
        this.getStudentInfo(true)
      })
    },
    handlePermBox(str) {
      return this.$tools.checkPerm(str)
    },
    select(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
        schoolId: [{ required: true, message: '请选择学员分馆', trigger: 'change' }],
        title: [{ required: true, message: '请填写发票抬头', trigger: 'blur' }],
        ideNumber: [{ required: false, trigger: 'blur' }],//validator: validateIdeNumber,
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
    changeinvoiceMethod(val) {
      if (val === 'false') {
        this.invoiceTypes.splice(1, 1)
        this.invoiceSetForm.type = 'A'
        this.invoiceSetForm.title=this.invoiceSetForm.stuName
      } else {
        this.invoiceSetForm.title=''
        this.invoiceTypes.push({
          name: '专票',
          id: 'B'
        })
      }
    },
    //切换普票专票清空数据
    change(data) {
      let arr = ['address', 'bank', 'bankNumber', 'phone']
      arr.forEach(item => this.$set(this.invoiceSetForm, item, ''))
      this.rulesChange()
    },
    close() {
      this.currentInvoicePrice = 0
      Object.keys(this.invoiceSetForm).forEach(item => {
        this.invoiceSetForm[item] = ''
      })
      this.$set(this.invoiceSetForm, 'type', 'A')
      this.$set(this.invoiceSetForm, 'method', 'false')
      if (this.$refs.uploadsth) {
        this.$refs.uploadsth.reset()
      }
      this.finalAttachments = []
      this.filesNum = 0
      this.financeId = ''
      this.attachments = []
      this.selectedRowKeys = []
      this.invoiceSetModal = false
      this.newUploadFiles = []
      this.companyId = null
    },
    getStudentInfo(type) {
      getSaveStuInvoice(this.studentInfo.stuId).then(res => {
        if (res.code === 200) {
          this.refundPrice = res.data.refundPrice
          if (!type) {
            this.invoiceSetForm.schoolId = res.data.schoolId
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
      this.$set(this.invoiceSetForm, 'type', 'A')
      this.$set(this.invoiceSetForm, 'method', 'false')
      this.$set(this.invoiceSetForm, 'title', this.invoiceSetForm.stuName)
      // })
    },
    //数据回显
    MsgShow(data) {
      console.log(data)
      this.$nextTick(() => {
        getSaveStuInvoice(this.studentInfo.stuId || data.stuId, { invoiceId: data.id }).then(res => {
          if (res.code === 200) {
            this.refundPrice = res.data.refundPrice
            this.invoiceSetForm.schoolId = res.data.schoolId
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
    saveInvoiceSet(formName) {
      this.$refs.Attachment.finalAttach()
      console.log(this.filesNum === 0, this.finalAttachments.length)
      // if (this.filesNum === 0 && !this.finalAttachments.length) {
      //   this.$notification['error']({
      //     message: '系统通知',
      //     description: '请上传附件'
      //   })
      //   return
      // }
      if (this.filesNum !== 0) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 有附件则必须有开票公司
            if (this.showCompany && !this.invoiceSetForm.companyId) {
             return this.$notification.error({
                message: '系统通知',
                description: '请选择开票公司'
              })
            }
            this.invoiceSetModalLoading = true
            //处理数据
            let data = this.invoiceSetForm
            // delete( data['invoicePrice','stuPhone','stuName'])
            data.stuId = this.invoiceSetForm.stuId
            if ((this.title = '编辑')) {
              data.id = data.id || ''
            } else {
              data.id = ''
            }
            this.$refs.uploadsth
              .multipleHandleUpload()
              .then(res => {
                let arr = [...this.finalAttachments, res.split(',')].join(',')
                console.log(Object.assign(data, { attachment: arr }))
                return saveFinInvoice(Object.assign(data, { attachment: arr }))
              })
              .then(() => {
                this.$notification.success({
                  message: '系统通知',
                  description: '开票信息设置成功'
                })
                this.$emit('updateTable')
                this.$refs.uploadsth.reset()
                this.close()
              })
              .catch(err => {
                console.log(err)
              })
              .finally(() => {
                this.invoiceSetModalLoading = false
              })
            // saveInvoice(data)
            //   .then(res => {
            //     if (res.code === 200) {
            //       this.close()
            //       this.$emit('updateTable')
            //       this.$notification['success']({
            //         message: '系统通知',
            //         description: '开票信息设置成功'
            //       })
            //     }
            //   })
            //   .catch(err => {
            //     console.log(this.invoiceSetForm)
            //     console.log(err)
            //   })
            //   .finally(() => {
            //     this.invoiceSetModalLoading = false
            //   })
          }
        })
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            console.log(this.invoiceSetForm.price)
            this.invoiceSetModalLoading = true
            let data = this.invoiceSetForm
            // delete( data['invoicePrice','stuPhone','stuName'])
            data.stuId = this.invoiceSetForm.stuId
            if ((this.title = '编辑')) {
              data.id = data.id || ''
            } else {
              data.id = ''
            }
            saveFinInvoice(Object.assign(data, { attachment: '' }))
              .then(() => {
                this.$notification.success({
                  message: '系统通知',
                  description: '开票信息设置成功'
                })
                this.saveInvoiceAutoComplete()
                this.$emit('updateTable')
                this.$refs.uploadsth.reset()
                this.close()
              })
              .catch(err => {
                console.log(err)
              })
              .finally(() => {
                this.invoiceSetModalLoading = false
              })
          }
        })
      }
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