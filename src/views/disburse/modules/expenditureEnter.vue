<template>
  <div>
    <a-modal
      :confirmLoading="loading"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="1400"
      :title="title"
      @ok="editSubmit"
      @cancel="editCancel"
      v-model="enterVisible"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="8">
            <a-form-model-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" label="收支类型" required prop="incomeItemId">
              <a-select v-model="form.incomeItemId" style="width:100%;" :disabled="this.finSpendingId ? true : false || incomeDisabled">
                <a-select-option value="K">收入</a-select-option>
                <a-select-option value="A">支出</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" label="提交日期" required prop="date">
              <a-date-picker placeholder="请选择提交日期" style="width: 100%" v-model="form.date" @change="changeDate(form.date, 'date')" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" label="提交部门/分馆" required prop="deptId">
              <a-cascader
                style="width:100%;"
                :options="schoolList"
                :showSearch="true"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                changeOnSelect
                v-model="form.deptId"
                placeholder="请选择提交部门/分馆"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" label="付款分馆" required prop="payDeptId">
              <a-cascader
                style="width:100%;"
                :options="payDeptList"
                :showSearch="true"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                changeOnSelect
                v-model="form.payDeptId"
                placeholder="请选择付款分馆"
                @change="deptChange"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" label="付款账户" required prop="account">
              <a-select v-model="form.account" style="width:100%;" showSearch option-filter-prop="children" :filter-option="filterOption">
                <a-select-option v-for="(item, index) in accounts" :key="index" :value="item.id">{{ item.bankNo }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" label="付款日期" required prop="priceDate">
              <a-date-picker placeholder="请选择付款日期" style="width: 100%" v-model="form.priceDate" @change="changeDate(form.priceDate, 'priceDate')" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" label="付款金额" required prop="price">
              <a-input-number placeholder="请输入付款金额" style="width: 100%;" :min="0" v-model="form.price" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" label="开票公司" prop="companyId">
              <a-select
                style="width:100%;"
                v-model="form.companyId"
                placeholder="请输入开票公司"
                showSearch
                :filter-option="filterOption"
                @change="(value, option) => (form.companyName = option.componentOptions.children[0].text.trim())"
              >
                <a-select-option v-for="(item, index) in companyList" :key="item.id" :value="item.id">
                  {{ item.companyName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.incomeItemId !== 'K'">
            <a-form-model-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" label="是否有发票" required prop="invoice">
              <a-select v-model="form.invoice" style="width:100%;">
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
                <a-select-option value="2">不需要</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="form.incomeItemId !== 'K'">
            <a-form-model-item v-bind="{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }" label="是否抵票" required prop="deduction">
              <a-select v-model="form.deduction" style="width:100%;">
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <a-table :columns="columns" :dataSource="tableData" :rowKey="(record, index) => index" :pagination="false" :loading="tableLoading" bordered>
        <div slot="numUnit" style="display:flex;">
          <div style="margin-right:80px;">数量</div>
          <div>单位</div>
        </div>
        <span slot="name" slot-scope="text, record">
          <a-select
            style="width:100%"
            v-model="record.feeNameId"
            @change="changeName(record.feeNameId)"
            showSearch
            option-filter-prop="children"
            :filter-option="filterOption"
          >
            <a-select-option v-for="(item, index) in names" :key="index" :value="item.id">{{ item.feeName }} </a-select-option>
          </a-select>
        </span>
        <span slot="total" slot-scope="text, record, index">
          <a-input-number v-model="record.price" style="width:100%" :min="0" @blur="changeTotal(record, index)" />
        </span>
        <span slot="num" slot-scope="text, record, index">
          <a-input-number v-model="record.number" style="width:calc(100% - 60px);" :min="0" />
          <a-select v-model="record.unit" style="width: 60px; margin-left: -1px;" @focus="unitFocus(record)" @change="changeUnit(record.unit, index)">
            <a-select-option v-for="(item, index) in units" :key="index" :value="item.id">{{ item.id }} </a-select-option>
          </a-select>
        </span>
        <span slot="detail" slot-scope="text, record">
          <div v-for="(item, index) in record.finSpendingItemSplit" :key="index">
            {{ item.splitPrice }}/{{ item.feeItemName }}/{{ item.financeName }}/{{ item.operateName }}{{ item.costName ? '/' + item.costName : '' }}
            <a-popover title="分摊" v-show="item.spendingSplits && item.spendingSplits.length > 0">
              <template slot="content">
                <div v-for="(items, index) in item.spendingSplits" :key="index">
                  {{ items.startDate }}<span v-if="items.startDate !== items.endDate">~{{ items.endDate }}</span
                  >/{{ items.parentDeptName || '' }}<span v-if="items.parentDeptName">/</span>{{ items.deptName }}/{{ items.price }}
                </div>
              </template>
              <a href="#">分摊</a>
            </a-popover>
          </div>
        </span>
        <span slot="remark" slot-scope="text, record">
          <a-input v-model="record.remark" />
        </span>
        <span slot="action" slot-scope="text, record, index">
          <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add(index)" v-if="tableData.length - 1 == index" />
          <a-icon type="minus-circle" class="icon" style="margin: 7px;" @click.stop="subtract(index, index)" v-if="tableData.length !== 1" />
          <a href="#" @click="apportion(record, index)">拆分</a>
        </span>
      </a-table>
      <div class="text">
        合计金额：<span>{{ totalPrice | fixTofloat }}元</span>
      </div>
    </a-modal>
    <!-- 拆分弹窗 -->
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="拆分情况"
      width="1000px"
      v-model="apportionModal"
      okText="保存"
      cancelText="取消"
      @ok="saveApportionPlans()"
      @cancel="ApportionPlansClose()"
    >
      <FilterMoney v-if="apportionModal" ref="filterMoney" :bindType="bindType"></FilterMoney>
      <!-- <contributions ref="contributions" @closeAchiModal="ApportionPlansClose" :schoolId="schoolId"></contributions> -->
    </a-modal>
  </div>
</template>


<script>
import { SearchComPro } from '@/components'
import FilterMoney from './FilterMoney/index'
import { listOrgDept, listFeeName, listBank, listFeeItem, saveFinSpending, getFinSpendingItem, updateFinance } from '@/api/education/card'
import { getClassInfo } from '@/api/education'
import { listAllFinCompany } from '@/api/common'
export default {
  data() {
    return {
      incomeDisabled: false,  // 收支类型禁止切换
      title: '收支录入',
      bindType: '财务收支',
      spinning: false, //加载
      enterVisible: false, //录入弹窗
      loading: false,
      columns: [
        {
          title: '项目名称',
          key: 'name',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          width: 200
        },
        {
          title: '总金额',
          key: 'total',
          dataIndex: 'total',
          scopedSlots: { customRender: 'total' },
          width: 120
        },
        {
          // title: '数量',
          key: 'num',
          dataIndex: 'num',
          scopedSlots: { title: 'numUnit', customRender: 'num' },
          width: 160
        },
        // {
        //   title: '单位',
        //   key: 'unit',
        //   dataIndex: 'unit',
        //   scopedSlots: { customRender: 'unit' },
        //   width: 120
        // },

        {
          title: '拆分明细',
          key: 'detail',
          dataIndex: 'detail',
          scopedSlots: { customRender: 'detail' },
          width: 500
        },
        {
          title: '备注',
          key: 'remark',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' },
          width: 200
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableLoading: false,
      // runningTypes: [], //财务归类
      // financialTypes: [], //经营归类
      // costTypes: [], //成本归类
      tableData: [
        {
          spendingItemId: '',
          feeNameId: null,
          price: null,
          number: null,
          unit: null,

          finSpendingItemSplit: [],
          remark: null
        }
      ],
      apportionModal: false, //分摊
      form: {
        date: null,
        deptId: null,
        price: null,
        payDeptId: null,
        account: null,
        deduction: null,
        invoice: null,
        priceDate: null,
        incomeItemId: null,
        companyId: null,
        companyName: null
      },
      schoolList: [], //分馆树状数据
      payDeptList: [],
      accounts: [],
      rules: {
        incomeItemId: [{ required: true, message: '请选择收支类型', trigger: 'change' }],
        priceDate: [{ required: true, message: '请选择付款日期', trigger: 'change' }],
        date: [{ required: true, message: '请选择提交日期', trigger: 'change' }],
        deptId: [{ required: true, message: '请选择提交部门/分馆', trigger: 'change' }],
        price: [{ required: true, message: '请填写付款金额', trigger: 'change' }],
        payDeptId: [{ required: true, message: '请填写付款分馆', trigger: 'change' }],
        account: [{ required: true, message: '请选择付款账户', trigger: 'change' }],
        deduction: [{ required: true, message: '请选择发票状态', trigger: 'change' }],
        invoice: [{ required: true, message: '请选择抵扣状态', trigger: 'change' }]
      },
      row: null,
      units: [], //单位
      names: [],
      schoolId: null,
      finSpendingId: null,
      companyList: [] //开票公司
    }
  },
  components: {
    SearchComPro,
    FilterMoney
  },
  computed: {
    //已填写金额总和
    totalPrice() {
      return this.tableData.map(item => item.price).reduce((a, b) => a + b)
    }
  },
  watch: {
    // enterVisible(n,o) {
    //   if(n) {
    //     this.treeSelectNormalizeObj()
    //   }
    // }
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleSearch(value) {
      fetch(value, data => (this.data = data))
    },
    deptChange(value) {
      if (value && value.length > 0) {
        let schoolId = value[value.length - 1]
        listBank({ schoolId }).then(res => {
          if (res.code === 200) {
            this.accounts = res.data
          }
        })
      } else {
        this.accounts = []
        this.form.account = null
      }
    },
    // focusAccount(deptId) {
    //   if (!deptId.length) {
    //     this.accounts = []
    //     return this.$notification['error']({
    //       message: '系统通知',
    //       description: '请先选择校区'
    //     })
    //   }
    // },
    dataFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
    //修改总金额
    changeTotal(record, index) {
      if (!this.form.price) {
        this.tableData[index].price = null
        return this.$notification['error']({
          message: '系统通知',
          description: '请先填写打款金额'
        })
      }
      if (this.tableData.length) {
        let total = this.tableData.map(item => item.price).reduce((a, b) => a + b)
        if (this.form.price < Number(total.toFixed(2))) {
          this.tableData[index].price = null
          return this.$notification['error']({
            message: '系统通知',
            description: '总金额的合必须等于打款金额'
          })
        }
      }
      if (this.form.price < record.price) {
        this.tableData[index].price = this.form.price
        return this.$notification['error']({
          message: '系统通知',
          description: '总金额不能大于打款金额'
        })
      }
    },
    changeDate(val, key) {
      this.form[key] = this.$tools.tailor.getDate(val)
    },
    //修改项目名称联动单位
    changeName(val) {
      this.units = []
      let obj = {}
      if (this.names.find(item => item.id === val).feeUnit.includes(';')) {
        let arr = this.names.find(item => item.id === val).feeUnit.split(';')
        arr.forEach(item => {
          this.units.push({ id: item })
        })
      } else {
        obj.id = this.names.find(item => item.id === val).feeUnit
        this.units.push(obj)
      }
    },
    changeUnit(val, index) {
      this.tableData[index].unit = val
    },
    changeNum(val, index) {
      let reg = /^[0-9]*[1-9][0-9]*$/
      if (!reg.test(val)) {
        this.$notification['error']({
          message: '系统通知',
          description: '请填写正整数'
        })
        this.tableData[index].number = null
      }
    },
    unitFocus(record) {
      if (!record.feeNameId) {
        this.units = []
        return this.$notification['error']({
          message: '系统通知',
          description: '请先选择项目名称'
        })
      }
    },
    treeSelectNormalizeObj() {
      listOrgDept().then(res => {
        // const renderArr = this._handleData(res.data)
        this.schoolList = res.data
        this.payDeptList = res.data
      })
    },
    // _handleData(data, type) {
    //   return data.map((item, index) => {
    //     let itemObj = {}
    //     itemObj.title = item.deptName
    //     itemObj.value = item.id
    //     itemObj.key = item.id
    //     if (item.children) {
    //       itemObj.children = this._handleData(item.children)
    //       itemObj.selectable = true
    //     }
    //     return itemObj
    //   })
    // },
    selectCompanyList() {
      listAllFinCompany().then(res => {
        this.companyList = res.data || []
      })
    },
    editCancel() {
      this.accounts = []
      this.finSpendingId = null
      this.form = {
        date: null,
        deptId: null,
        price: null,
        payDeptId: null,
        account: null,
        deduction: null,
        invoice: null,
        priceDate: null
      }
      this.tableData = [
        {
          spendingItemId: '',
          feeNameId: null,
          price: null,
          number: null,
          unit: null,
          finSpendingItemSplit: [],
          remark: null
        }
      ]
    },
    editSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].finSpendingItemSplit && this.tableData[i].finSpendingItemSplit.length) {
              let totalPrice = this.tableData[i].finSpendingItemSplit.map(item => item.splitPrice).reduce((a, b) => a + b)
              if (this.tableData[i].price !== Math.abs(Number(totalPrice.toFixed(2)))) {
                return this.$notification['error']({
                  message: '系统通知',
                  description: '总金额必须等于拆分总金额'
                })
              }
            }
            for (let key in this.tableData[i]) {
              if (
                key !== 'remark' &&
                key !== 'spendingItemId' &&
                key !== 'finSpendingItemSplit' &&
                (this.tableData[i][key] === null || this.tableData[i][key] === '' || this.tableData[i][key] === undefined)
              ) {
                return this.$notification['error']({
                  message: '系统通知',
                  description: '请先填写完整表格'
                })
              }
            }
          }

          let total = this.tableData
            .map(item => item.price)
            .reduce((a, b) => {
              return a + b
            }, 0)
          if (this.form.price !== Number(total.toFixed(2))) {
            return this.$notification['error']({
              message: '系统通知',
              description: '打款金额必须等于总金额的合'
            })
          }
          this.loading = true

          let finSpending = {
            finSpendingId: this.finSpendingId,
            date: this.form.date,
            offset: this.form.deduction,
            invoice: this.form.invoice,
            priceDate: this.form.priceDate,
            incomeItemId: this.form.incomeItemId,
            companyId: this.form.companyId,
            companyName: this.form.companyName
          }

          let tableData = JSON.parse(JSON.stringify(this.tableData))
          let arr = tableData.map(item => {
            const { spendingItemId, feeNameId, price, number, unit, remark } = item
            if (item.finSpendingItemSplit && item.finSpendingItemSplit.length) {
              item.finSpendingItemSplit.forEach(x => {
                delete x.key
                delete x.feeItemName
                delete x.financeName
                delete x.costName
                delete x.operateName
                if (x.spendingSplits && x.spendingSplits.length) {
                  x.spendingSplits.forEach(y => {
                    delete y.key
                  })
                }
              })
            }
            let spendingBanks = [
              {
                payDeptId: this.form.payDeptId[this.form.payDeptId.length - 1],
                bankId: this.form.account,
                price
              }
            ]
            let todo = {
              spendingItemId,
              feeNameId,
              price,
              number,
              unit,
              finSpendingItemSplits: item.finSpendingItemSplit,
              remark,
              spendingBanks: spendingBanks
            }
            return todo
          })
          let request = saveFinSpending
          if (this.finSpendingId) {
            request = updateFinance
          }
          // spendingBanks: JSON.stringify(spendingBanks),
          request({
            ...finSpending,

            deptId: this.form.deptId[this.form.deptId.length - 1],
            spendingItems: JSON.stringify(arr)
          })
            .then(res => {
              if (res.code === 200) {
                this.$notification['success']({
                  message: '系统通知',
                  description: '操作成功'
                })
                this.enterVisible = false
                this.editCancel()
                this.$emit('refresh')
              }
            })
            .finally((this.loading = false))
        }
      })
    },
    ApportionPlansClose() {
      this.schoolId = null
      // this.$refs.contributions.clear()
      this.apportionModal = false
    },
    saveApportionPlans() {
      let msg = JSON.parse(JSON.stringify(this.$refs.filterMoney.counselorInfo))
      for (let i = 0; i < msg.length; i++) {
        let item = msg[i]
        if (!item.operateName || !item.splitPrice || !item.feeItemName || !item.financeName) {
          return this.$notification['error']({
            message: '系统通知',
            description: '请先填写完整'
          })
        }
      }
      if (msg.length > 0) {
        let total = msg
          .map(item => item.splitPrice)
          .reduce((a, b) => {
            return a + b
          }, 0)
        if (this.tableData[this.row].price !== Number(total.toFixed(2))) {
          return this.$notification['error']({
            message: '系统通知',
            description: '拆分金额的和必须等于总金额'
          })
        }
      }
      msg.forEach(item => {
        item.feeItemName = item.feeItemName?.name || ''
        item.operateName = item.operateName?.name || ''
        item.financeName = item.financeName?.name || ''
        item.costName = item.costName?.name || ''
      })
      this.tableData[this.row].finSpendingItemSplit = msg
      this.ApportionPlansClose()
      // this.$refs.contributions.save()
    },
    getClassFormValue(data) {
      const { id } = data
      return new Promise((resolve, reject) => {
        getClassInfo(id)
          .then(res => resolve(res))
          .catch(err => reject(err))
      })
    },
    //拆分
    apportion(record, index) {
      if (!record.price) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请先填写总金额'
        })
      }
      this.row = index
      this.apportionModal = true
      this.$nextTick(() => {
        this.$refs.filterMoney.backData(record)
        // this.$refs.contributions.backData(record)
      })
      // }
    },
    //减去多选一行
    subtract(index) {
      this.tableData.splice(index, 1)
    },
    //新增多选部分
    add(index) {
      this.tableData.push({
        spendingItemId: '',
        feeNameId: null,
        price: null,
        number: null,
        unit: null,

        finSpendingItemSplit: [],
        remark: null
      })
    },
    loadTable() {},
    async open(id, finSpendingId, incomeItemId, title = '收支录入') {
      this.title = title
      this.treeSelectNormalizeObj()
      this.selectCompanyList()
      let res = await listFeeName({ type: 'A' })
      if (res.code === 200) {
        this.names = res.data
      }
      // let res1 = await listBank()
      // if (res1.code) {
      //   this.accounts = res1.data
      // }
      let res2 = await listFeeItem({ inctype: 'A' })
      // if (res2.code === 200) {
      //   this.runningTypes = res2.data
      // }
      // let res3 = await listFeeItem({ feeItemType: 'A', inctype: 'A' })
      // if (res3.code === 200) {
      //   this.financialTypes = res3.data
      // }
      // let res4 = await listFeeItem({ feeItemType: 'C', inctype: 'C' })
      // if (res4.code === 200) {
      //   this.costTypes = res4.data
      // }
      if (incomeItemId) {
        this.form.incomeItemId = incomeItemId
        this.incomeDisabled = true
      }
      if (id) {
        let data = await getFinSpendingItem({ finSpendingId: finSpendingId })
        if (data.code === 200) {
          const { date, offset, invoice, priceDate, finSpendingItem, deptId, incomeItemId, companyId, companyName, incType } = data.data
          this.form.priceDate = priceDate
          this.form.date = date
          this.form.deduction = offset ? '1' : '0'
          this.form.invoice = invoice ? '1' : '0'
          this.form.deptId = deptId
          this.form.incomeItemId = incomeItemId
          this.form.companyId = companyId
          this.form.companyName = companyName

          this.tableData = finSpendingItem.map(item => {
            item.mapQueryList.forEach((x, Xindex) => {
              x.key = Xindex
              x.spendingSplits = JSON.parse(JSON.stringify(x.finSpendingItemSplitList)) || []
              x.feeItemId = x.sysFeeItemId
              x.splitPrice = -x.splitPrice //拆分金额需要取反
              delete x.sysFeeItemId
              delete x.finSpendingItemSplitList
              if (x.spendingSplits && x.spendingSplits.length > 0) {
                x.spendingSplits.forEach((todo, index) => {
                  todo.key = index
                  todo.startDate = todo.date
                  todo.endDate = todo.date
                  todo.parentDeptName = todo.parentDeptName
                  todo.price = incType == 'B' ? -todo.price : todo.price
                  todo._deptId = todo.deptId.includes(',') ? todo.deptId.split(',')[todo.deptId.split(',').length - 1] : todo.deptId
                  todo.deptId = todo._deptId[todo._deptId.length - 1]
                  // console.log(11,todo)
                  if(todo.spendingSplitProjects&&todo.spendingSplitProjects.length>0){
                    todo.spendingSplitProjects.forEach((col, index) => {
                      col.price = incType == 'B' ? -col.price : col.price
                      console.log(11,col)
                    })
                  }
                })
              }
            })
            return {
              spendingItemId: item.id,
              feeNameId: item.feeNameId,
              price: item.price,
              number: item.number,
              unit: item.unit,
              remark: item.remark,
              finSpendingItemSplit: item.mapQueryList,
              listFinSpeBank: item.listFinSpeBank
            }
          })
          this.form.payDeptId = this.tableData[0].listFinSpeBank[0].deptId
          if (Array.isArray(this.form.payDeptId) && this.form.payDeptId.length > 0) {
            let schoolId = this.form.payDeptId[this.form.payDeptId.length - 1]
            let res1 = await listBank({ schoolId })
            if (res1.code) {
              this.accounts = res1.data
            }
          }
          this.form.account = this.tableData[0].listFinSpeBank[0].bankId
          let total = this.tableData.map(item => item.price).reduce((a, b) => this.$number(a).plus(b), this.$number(0))
          this.form.price = total.toNumber()
        }
        this.finSpendingId = finSpendingId
      }
      this.enterVisible = true
    },
    _refreshTable() {
      this.$nextTick(() => {
        // this.$refs.table.refresh()
        this.loadTable()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.icon {
  color: #1890ff;
  font-size: 16px;
}
.text {
  margin-top: 20px;
  font-size: 16px;
  span {
    color: red;
  }
}
/deep/ .ant-select-arrow {
  color: rgba(0, 0, 0, 0.55);
}
/deep/.ant-input[disabled] {
  color: rgb(96 96 96);
  background-color: #fff;
}
</style>
