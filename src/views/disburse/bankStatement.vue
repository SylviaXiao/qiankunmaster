<template>
  <div>
    <a-card :bordered="false" style="margin: 20px 0 ;">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <div style="display:flex;">
      <div class="priceText">
        当前账户总金额
        <div class="totalPrice">{{ price }}</div>
      </div>
      <div class="priceText">
        总到账金额
        <div class="totalPrice">{{ incomePrice }}</div>
      </div>
      <div class="priceText">
        总支出金额
        <div class="totalPrice">{{ paidPrice }}</div>
      </div>
    </div>
    <a-card :bordered="false" style="margin-top:20px;">
      <div class="btnClass">
        <perm-box perm="finance:spendingbank:save">
          <a-button type="primary" icon="plus-circle" @click.native="openModal()">收支录入</a-button>
        </perm-box>
        <perm-box perm="finance:bank:down">
            <a-button class="ml10" type="primary" icon="download" @click.native="downloadStu">
              导出
            </a-button>
        </perm-box>
      </div>
      <perm-box perm="finance:spendingbank:view">
        <s-table ref="table" :columns="columns" :data="loadData" :rowKey="(record, index) => index">
          <span slot="action" slot-scope="text, record">
            <perm-box perm="finance:spendingbank:view">
              <a href="javascript:;" @click="incomeDetail(record)">收支明细</a>
            </perm-box>
          </span>
        </s-table>
      </perm-box>
    </a-card>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="收支明细"
      v-model="detailModal"
      width="1000px"
      okText="保存"
      cancelText="取消"
      @ok="detailSubmit"
      :confirmLoading="isloading"
      :footer="null"
    >
      <a-spin :spinning="spinning">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="innerSearchSubmit" :searchParams="innerSearchParams" ref="search"></search-com-pro>
        <a-card :bordered="false" style="margin: 20px 0 ;background-color:#f0f2f5;">
          <a-row>
            <a-col :span="12">
              <div class="text">
                <span style="font-weight: bold;">收支部门/分馆：{{ innerMsg.parentDeptName }}-{{ innerMsg.deptName }}</span>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="text">
                <span style="font-weight: bold;">收支账户：{{ innerMsg.bankNo }}</span>
              </div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <div class="text">
                <span style="font-weight: bold;">当前账户汇总：{{ innerMsg.price ? innerMsg.price.toFixed(2) : '' }}</span>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="text">收入：{{ innerMsg.incomePrice ? innerMsg.incomePrice.toFixed(2) : '' }}</div>
            </a-col>
            <a-col :span="8">
              <div class="text">支出：{{ innerMsg.paidPrice ? innerMsg.paidPrice.toFixed(2) : '' }}</div>
            </a-col>
          </a-row>
        </a-card>
        <perm-box perm="finance:spendingbank:view">
          <s-table v-if="detailModal" ref="innerTable" :columns="innerColumns" :data="innerLoadData" :rowKey="(record, index) => index">
            <span slot="action" slot-scope="text, record">
              <perm-box perm="finance:spendingbank:update">
                <a href="javascript:;" @click="openModal(record)" v-if="isSuper || !record.defaultItem">修改</a>
              </perm-box>
              <perm-box perm="finance:spendingbank:del">
                <a href="javascript:;" @click="delect(record, 'in')" v-if="isSuper || !record.defaultItem">删除</a>
              </perm-box>
            </span>
          </s-table>
        </perm-box>
      </a-spin>
    </a-modal>
    <!-- 编辑 -->
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
            <a-form-model-item v-bind="defaultLayout" label="付款日期：" prop="date">
              <a-date-picker placeholder="请选择付款日期" style="width: 100%" v-model="form.date" @change="changeDate(form.date)" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="收支部门/分馆：" prop="deptId">
              <a-cascader
                v-if="title !== '修改收支信息'"
                style="width:100%;"
                :options="schoolList"
                :showSearch="true"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                changeOnSelect
                v-model="form.deptId"
                placeholder="请选择提交部门/分馆"
              />
              <!-- <a-tree-select
                  style="min-width:120px;"
                  v-model="form.deptId"
                  :allowClear="true"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="schoolList"
                  treeDefaultExpandAll
                  @change="deptChange(form.deptId)"
                  v-if="title !== '修改收支信息'"
              /> -->
              <span v-else>{{ editMsg.deptName }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="收支账户：" prop="bankNo">
              <a-select
                v-model="form.bankNo"
                style="width:100%;"
                @focus="focusAccount(form.deptId)"
                v-if="title !== '修改收支信息'"
                showSearch
                option-filter-prop="children"
                :filter-option="filterOption"
              >
                <a-select-option v-for="(item, index) in bankNos" :key="index" :value="item.id">{{ item.bankNo }}</a-select-option>
              </a-select>
              <span v-else>{{ editMsg.bankNo }}</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="收支金额：" prop="total">
              <a-input-number v-model="form.total"></a-input-number>&nbsp;元
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <!-- <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="收支类型：" prop="paymentType">
                <a-select v-model="form.paymentType" style="width:100%;">
                <a-select-option   value="Y">收入</a-select-option>
                <a-select-option   value="N">支出</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col> -->
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="收支项：" prop="paymentTerm">
              <a-select v-model="form.paymentTerm" style="width:100%;">
                <a-select-option v-for="(item, index) in paymentTerms" :key="index" :value="item.id">{{ item.incItem }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-model-item v-bind="{ labelCol: { md: { span: 3 } }, wrapperCol: { md: { span: 16 } } }" label="备注">
              <a-input type="textarea" v-model="form.remark"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import tools from '@/tools/common'
import {
  listOrgDept,
  getBankList,
  listIncomeItem,
  pageSpendingBank,
  getSpendingBank,
  pageBankDetails,
  bankPrice,
  saveSpendingBank,
  removeFinSpendingBank,
  removeSpendingBank,
  updateSpendingBank
} from '@/api/education/card'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
const columns = [
  {
    title: '部门/分馆',
    dataIndex: 'parentDeptName',
    customRender: (text, record) => {
      const { deptName, parentDeptName } = record
      return parentDeptName + '-' + deptName
    }
  },
  {
    title: '银行账户',
    dataIndex: 'bankNo'
  },
  {
    title: '账户金额',
    dataIndex: 'price',
    customRender: (text, record) => {
      return text.toFixed(2)
    }
  },
  {
    title: '收入金额',
    dataIndex: 'incomePrice',
    customRender: (text, record) => {
      return text.toFixed(2)
    }
  },
  {
    title: '支出金额',
    dataIndex: 'paidPrice',
    customRender: (text, record) => {
      return text.toFixed(2)
    }
  },
  // {
  //   title: '操作人',
  //   dataIndex: 'userName'
  // },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const innerColumns = [
  {
    title: '付款日期',
    dataIndex: 'date'
  },
  {
    title: '收支金额',
    dataIndex: 'price'
  },
  {
    title: '收支类型',
    dataIndex: 'incType',
    customRender: (text, record) => {
      let value = ''
      const { incType, financeInfoId } = record
      if (incType === 'A') {
        value = '收入'
      } else {
        value = '支出'
      }
      if (financeInfoId) {
        return value + ' ↹'
      }
      return value
    }
  },
  {
    title: '收支项',
    dataIndex: 'incItem'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  },
  {
    title: '操作人',
    dataIndex: 'userName'
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const defaultLayout = {
  labelCol: { md: { span: 6 } },
  wrapperCol: { md: { span: 16 } }
}
export default {
  data() {
    return {
      columns,
      innerColumns,
      defaultLayout,
      searchParams: [
        {
          type: 'cascader',
          key: 'deptKey',
          label: '部门/分馆',
          placeholder: '请选择部门',
          search: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'key',
            children: 'children'
          }
        },
        {
          type: 'date',
          key: 'Date',
          label: '日期',
          placeholder: '请选择月份',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select', //动态select框
          key: 'bankId',
          mode: 'multiple',
          label: '银行账户',
          search: true,
          placeholder: '请选择银行账户',
          apiOption: {
            api: getBankList, // promise类型的接口
            string: 'bankNo',
            value: 'id'
          }
        }
      ],
      innerSearchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '付款日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'select', // 静态select框
          key: 'type',
          label: '收支类型',
          placeholder: '请选择收支类型',
          staticArr: [
            {
              string: '收入',
              value: 'A'
            },
            {
              string: '支出',
              value: 'B'
            }
          ]
        },
        {
          type: 'select', //动态select框
          key: 'incomeItemId',
          label: '收支项',
          placeholder: '请选择收支项',
          apiOption: {
            api: listIncomeItem, // promise类型的接口
            string: 'incItem',
            value: 'id'
          }
        }
      ],
      loadData: parameter => {
        return pageSpendingBank(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      innerLoadData: parameter => {
        return pageBankDetails(Object.assign(parameter, this.innerQueryParam)).then(res => {
          return res
        })
      },
      innerQueryParam: {
        deptId: '',
        bankId: '',
        incomeItemId: '',
        type: '',
        startDate: '',
        endDate: ''
      },
      queryParam: {},
      title: null,
      modal: false,
      isloading: false,
      schoolList: [],
      id: null,
      form: {
        date: null,
        deptId: null,
        bankNo: null,
        // paymentType: null,
        paymentTerm: null,
        total: null,
        remark: null
      },
      rules: {},
      bankNos: [
        {
          id: 1,
          text: 1
        },
        {
          id: 2,
          text: 2
        }
      ],
      detailMsg: {}, //收支信息
      detailModal: false,
      paymentTerms: [],
      incomePrice: null,
      price: null,
      paidPrice: null,
      spinning: false,
      innerMsg: {},
      editMsg: {
        deptName: null,
        bankNo: null
      }
    }
  },

  components: {
    STable,
    SearchComPro,
    PermBox
  },
  watch: {
    modal(n, o) {
      if (!n) {
        this.id = null
        Object.keys(this.form).forEach(item => {
          if (item === 'deptId') {
            this.form[item] = []
          } else {
            this.form[item] = ''
          }
        })
        this.editMsg = {
          deptName: null,
          bankNo: null
        }
      }
    },
    detailModal(n, o) {
      if (n) {
        this.getBankPrice()
        this.$nextTick(() => {
          this.$refs.innerTable.refresh()
        })
      } else {
        this.$refs.search.reset()
      }
    }
  },
  created() {
    this.getSpendBank()
  },
  methods: {
    downloadStu() {
      let exportUrl = '/finance/spending/downSpendingBank'
      const { queryParam } = this
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k != 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
      }
      fields.push({ name: 'page', value: 0 })
      fields.push({ name: 'limit', value: 0 })
      const form = document.createElement('form')
      form.action = `${process.env.VUE_APP_URL}${exportUrl}`
      form.method = 'POST'
      form.target = 'downloadFrame'
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        const f = document.createElement('input')
        f.type = 'hidden'
        f.name = field.name
        f.value = field.value
        form.appendChild(f)
      }
      document.body.appendChild(form)
      form.submit()
      this.$message.success('正在下载...')
      document.body.removeChild(form)
    },
    isSuper() {
      return tools.isSuper()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    rulesChange(type) {
      let val = type ? false : true
      return (this.rules = {
        date: [{ required: true, message: '请选择付款日期', trigger: 'change' }],
        deptId: [{ required: val, message: '请选择收支校区', trigger: 'change' }],
        bankNo: [{ required: val, message: '请选择银行账户', trigger: 'change' }],
        // paymentType: [{ required: true, message: '请选择收支账户', trigger: 'change' }],
        paymentTerm: [{ required: true, message: '请选择收支类型', trigger: 'change' }],
        total: [{ required: true, message: '请填写收支金额', trigger: 'change' }]
      })
    },
    getBankPrice() {
      this.spinning = true
      bankPrice(this.innerQueryParam).then(res => {
        if (res.code === 200) {
          this.innerMsg = res.data
          this.spinning = false
        }
      })
    },
    getSpendBank(data) {
      const schoolId = Vue.ls.get('userDefaultId') || ''
      let obj = {}
      if (data) {
        obj = {
          school_id: schoolId || null,
          ...data
        }
      } else {
        obj = {
          school_id: schoolId || null
        }
      }
      getSpendingBank(obj).then(res => {
        if (res.code === 200) {
          this.incomePrice = res.data.incomePrice.toFixed(2)
          this.paidPrice = res.data.paidPrice.toFixed(2)
          this.price = res.data.price.toFixed(2)
        }
      })
    },
    deptChange(val) {
      if (val) {
        listBank({ schoolId: this.form.deptId }).then(res => {
          if (res.code === 200) {
            this.bankNos = res.data
          }
        })
      }
      if (!val) {
        this.form.bankNo = null
      }
    },
    focusAccount(deptId) {
      if (!deptId) {
        this.bankNos = []
        return this.$notification['error']({
          message: '系统通知',
          description: '请先选择校区'
        })
      }
    },
    detailSubmit() {},
    // 收支明细
    incomeDetail(record) {
      this.detailModal = true
      this.innerQueryParam.bankId = record.bankId
      this.innerQueryParam.deptId = record.deptId
      this.detailMsg = record
    },
    changeDate(val) {
      this.form.date = this.$tools.tailor.getDate(val)
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log(this.form)
          this.isloading = true
          const { total, remark, date, bankNo, paymentTerm } = this.form
          let request = saveSpendingBank
          if (this.id) request = updateSpendingBank
          request({
            price: total,
            remark,
            bankId: bankNo,
            deptId: this.form.deptId[this.form.deptId.length - 1],
            incomeItemId: paymentTerm,
            date,
            id: this.id || ''
          })
            .then(res => {
              if (res.code === 200) {
                if ((this.title = '修改收支信息')) {
                  this._refreshInnerTable()
                } else {
                  this._refreshTable()
                }
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
    },
    async openModal(record, type) {
      this.loadSchoolId()
      let res = await listBank()
      if (res.code === 200) {
        this.bankNos = res.data
      }
      let res1 = await listIncomeItem()
      if (res1.code === 200) {
        this.paymentTerms = res1.data
      }
      this.rulesChange(record)
      if (record) {
        this.id = record.spendingBankId
        this.editMsg = {
          deptName: `${this.innerMsg.parentDeptName}-${this.innerMsg.deptName}`,
          bankNo: this.innerMsg.bankNo
        }
        this.form.remark = record.remark
        this.form.date = record.date
        this.form.total = Math.abs(record.price)
        this.form.paymentTerm = record.incItemId
        this.form.bankNo = this.innerMsg.bankId
        this.form.deptId = this.innerMsg.deptId
        this.title = '修改收支信息'
      } else {
        this.title = '录入收支信息'
      }
      this.modal = true
    },
    delect(record, type) {
      this.$confirm({
        title: '系统提示',
        content: '确定要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          let request = type === 'out' ? removeSpendingBank : removeFinSpendingBank
          let id = type === 'out' ? record.bankId : record.spendingBankId

          request(id).then(res => {
            this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            if (type === 'out') {
              this._refreshTable()
            } else {
              this._refreshInnerTable()
            }
          })
        }
      })
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
    searchSubmit(data) {
      // if (data.cardName) delete data.cardName
      if (Object.keys(data).length === 0) {
        this.routeQuery = this.$route.query
      }
      if (data.deptKey) {
        let val = data.deptKey.split(',')
        data.deptKey = val[val.length - 1]
      }
      this.queryParam = data
      this.getSpendBank(data)
      this._refreshTable()
    },
    innerSearchSubmit(data) {
      if (Object.keys(data).length === 0) {
        this.routeQuery = this.$route.query
      }
      this.innerQueryParam.incomeItemId = data.incomeItemId
      this.innerQueryParam.type = data.type
      this.innerQueryParam.startDate = data.startDate
      this.innerQueryParam.endDate = data.endDate
      this.getBankPrice()
      this._refreshInnerTable()
    },
    _refreshTable() {
      this.$nextTick(() => {
        this.$refs.table.refresh()
      })
    },
    _refreshInnerTable() {
      this.$nextTick(() => {
        this.$refs.innerTable.refresh()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.btnClass {
  margin-bottom: 10px;
}
/deep/ .ant-calendar-footer-btn {
  /deep/ .ant-calendar-time-picker-btn {
    display: none !important;
  }
}
.priceText {
  padding: 10px;
  width: 180px;
  height: 90px;
  background-color: #fff;
  margin-right: 15px;
}
.totalPrice {
  margin-left: 50px;
  margin-top: 10px;
  font-weight: bold;
  font-size: 17px;
}
/deep/ .ant-calendar-picker {
  // width: 300px !important;
}
.text {
  padding: 10px;
  display: flex;
  align-items: center;
}
</style>
