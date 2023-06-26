<template>
  <div>
    <a-modal
      :confirmLoading="loading"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :width="1000"
      title="工资/社保支出录入"
      @ok="editSubmit"
      @cancel="editCancel"
      v-model="enterVisible"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="提交日期" prop="expendDate">
              <a-date-picker placeholder="请选择提交日期" style="width: 100%" v-model="form.expendDate" @change="changeDate(form.expendDate)" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="项目名称" prop="feeNameId">
              <a-select v-model="form.feeNameId" style="width:100%;" showSearch option-filter-prop="children" :filter-option="filterOption">
                <a-select-option v-for="(item, index) in costNames" :key="index" :value="item.id">{{ item.feeName }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item v-bind="defaultLayout" label="付款日期" prop="priceDate">
              <a-date-picker placeholder="请选择付款日期" style="width: 100%" v-model="form.priceDate" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-model-item v-bind="defaultLayout" label="总金额" prop="price">
              <a-input-number v-model="form.price" @blur="changeTotal(form.price)"></a-input-number>&nbsp;元
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item v-bind="defaultLayout" label="总人数" prop="number">
              <a-input-number v-model="form.number" :min="1"></a-input-number>&nbsp;人
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item v-bind="{ labelCol: { md: { span: 3 } }, wrapperCol: { md: { span: 16 } } }" label="备注" prop="remark">
              <a-input type="textarea" v-model="form.remark"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-divider />
        <a-row v-for="(item, index) in form.bank" :key="index">
          <a-col :span="8">
            <!--<span class="required">*</span>-->
            <a-form-model-item v-bind="defaultLayout" label="付款分馆" prop="payDeptId">
              <a-cascader
                style="width:100%;"
                :options="payDeptList"
                :showSearch="true"
                :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
                changeOnSelect
                v-model="item.payDeptId"
                placeholder="请选择付款分馆"
                @change="val => deptChange(val, index)"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <!--<span class="required">*</span>-->
            <a-form-model-item v-bind="defaultLayout" label="银行账户">
              <a-select v-model="item.bankId" style="width:100%;" showSearch option-filter-prop="children" :filter-option="filterOption">
                <a-select-option v-for="(todo, inx) in item._accounts" :key="inx" :value="todo.id">{{ todo.bankNo }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <!--<span class="required">*</span>-->
            <a-form-model-item v-bind="defaultLayout" label="打款金额">
              <a-input-number v-model="item.price" @blur="changeDeduction(item.price, index)"></a-input-number> 元
            </a-form-model-item>
          </a-col>
          <a-col :span="2">
            <a-icon type="plus-circle" class="icon" style="margin: 7px;" @click="add()" v-if="form.bank.length - 1 == index" />
            <a-icon type="minus-circle" class="icon" style="margin: 7px;" @click.stop="subtract(index)" v-if="form.bank.length !== 1" />
          </a-col>
        </a-row>
        <a-divider />
        <div>拆分情况</div>
        <!-- <filterMoney ref="filterMoney" :negative="true"></filterMoney> -->
        <FilterMoney ref="filterMoney" :bindType="bindType"></FilterMoney>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import FilterMoney from './FilterMoney/index'
import { listOrgDept, listFeeName, listBank, listFeeItem, saveFinance, getFinSpendingItem, updateFinSocial } from '@/api/education/card'
const defaultLayout = {
  labelCol: { md: { span: 8 } },
  wrapperCol: { md: { span: 14 } }
}
export default {
  data() {
    let validateIdeOperate = (rule, value, callback) => {
      if (!value || !value.length) {
        callback(new Error('请选择经营费用'))
      } else {
        callback()
      }
    }
    let validateIdeFinance = (rule, value, callback) => {
      if (!value || !value.length) {
        callback(new Error('请选择经营费用'))
      } else {
        callback()
      }
    }
    return {
      bindType: '工资社保',
      defaultLayout,
      enterVisible: false,
      form: {
        expendDate: null,
        feeNameId: null,
        priceDate: null,
        spendingItemId: '',
        price: null,
        number: null,
        remark: null,
        bank: [
          {
            payDeptId: null,
            _accounts: [],
            bankId: null,
            price: null
          }
        ]
      },
      costNames: [], //经营费用
      workExpends: [], //项目名称
      finaCosts: [], //财务名称
      costTypes: [], //成本归类
      payDeptList: [],
      rules: {
        expendDate: [{ required: true, message: '请选择提交日期', trigger: 'change' }],
        priceDate: [{ required: true, message: '请选择付款日期', trigger: 'change' }],
        feeNameId: [{ required: true, message: '请选择项目名称', trigger: 'blur' }],
        price: [{ required: true, message: '请填写总金额', trigger: 'blur' }],
        number: [{ required: true, message: '请填写总人数', trigger: 'blur' }],
        bank0: [{ required: true, message: '请选择银行账户', trigger: 'change' }],
        price0: [{ required: true, message: '请输入打款金额', trigger: 'change' }]
      },
      loading: false,
      finSpendingId: null,
      maxPrice: null
    }
  },
  computed: {
    // maxPrice() {
    //   // setTimeout(() => {
    //     let total = this.form.bank.map(item => item.price).reduce((a, b) => a + b)
    //     console.log(
    //       this.form.bank.map(item => item.price),
    //       total
    //     )
    //     this.$nextTick(() => {
    //       this.$refs.filterMoney.price = Number(total.toFixed(2))
    //     })
    //     return Number(total.toFixed(2))
    //   // }, 500)
    // }
  },
  components: {
    FilterMoney
  },
  watch: {
    'form.bank': {
      deep: true,
      handler(n, o) {
        let total = 0
        total = this.form.bank.map(item => item.price).reduce((a, b) => Number(a) + Number(b))
        if (total) {
          this.$nextTick(() => {
            this.$refs.filterMoney.price = total.toFixed(2)
          })
          this.maxPrice = total.toFixed(2)
        }
      }
    },
    enterVisible(n, o) {
      if (!n) {
        this.finSpendingId = ''
        this.form = {
          spendingItemId: '',
          expendDate: null,
          priceDate: null,
          feeNameId: null,
          price: null,
          number: null,
          remark: null,
          bank: [
            {
              payDeptId: null,
              _accounts: [],
              bankId: null,
              price: null
            }
          ]
        }
      }
    }
  },
  methods: {
    handleSearch(value) {
      fetch(value, data => (this.data = data))
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    dataFilter(inputValue, path) {
      return path.some(option => option.value.indexOf(inputValue) > -1)
    },
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
    changeDate(val) {
      this.form.expendDate = this.$tools.tailor.getDate(val)
    },
    changeDeduction(val, index) {
      if (this.maxPrice > this.form.price) {
        this.form.bank[index].price = this.form.price - (Number(this.maxPrice) - val)
        this.$notification['error']({
          message: '系统通知',
          description: '打款金额不得超过总金额'
        })
      }
    },
    editCancel() {},
    checkForm(arr, type) {
      let total = arr
        .map(item => item.price)
        .reduce((a, b) => {
          return a + b
        }, 0)
      let msgTotal = this.$refs.filterMoney.counselorInfo
        .map(item => item.splitPrice)
        .reduce((a, b) => {
          return a + b
        }, 0)

      // if (this.form.price !== Number(total.toFixed(2))) {
      //   this.$notification['error']({
      //     message: '系统通知',
      //     description: '打款金额的合必须等于总金额'
      //   })
      //   return Promise.reject()
      // }
      // console.log(this.maxPrice.toString(), msgTotal.toFixed(2).toString())
      if (this.maxPrice.toString() !== msgTotal.toFixed(2).toString()) {
        this.$notification['error']({
          message: '系统通知',
          description: '拆分金额的合必须等于打款金额的合'
        })
        return Promise.reject()
      }
      for (let i = 0; i < arr.length; i++) {
        for (let key in arr[i]) {
          if (key !== 'key' && !arr[i][key]) {
            if (key === 'price' && arr[i][key] === 0) {
              this.$notification['error']({
                message: '系统通知',
                description: '打款金额不能为0'
              })
              return Promise.reject()
            }

            if (!type) {
              this.$notification['error']({
                message: '系统通知',
                description: '请先填写完整表格'
              })
              return Promise.reject()
            }
          }
          // if(key!=='key' && !arr[i][key])
        }
      }
      let msg = JSON.parse(JSON.stringify(this.$refs.filterMoney.counselorInfo))
      for (let i = 0; i < msg.length; i++) {
        let item = msg[i]
        if (!item.operateName || !item.splitPrice || !item.feeItemName || !item.financeName) {
          this.$notification['error']({
            message: '系统通知',
            description: '请先填写完整拆分'
          })
          return Promise.reject()
        }
      }
      return Promise.resolve()
    },
    editSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let msg = JSON.parse(JSON.stringify(this.$refs.filterMoney.counselorInfo))
          // this.checkForm(msg, true)
          // .then(() =>
          this.checkForm(this.form.bank, false).then(() => {
            this.loading = true
            let finSpending = {
              finSpendingId: this.finSpendingId,
              date: this.form.expendDate,
              priceDate: this.form.priceDate,
              offset: '',
              invoice: ''
            }
            if (msg.length) {
              msg.forEach(x => {
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
            let form = JSON.parse(JSON.stringify(this.form))
            form.finSpendingItemSplits = msg
            form.spendingBanks = form.bank
            form.spendingBanks.forEach(item => {
              item.payDeptId = item.payDeptId[item.payDeptId.length - 1]
              delete item._accounts
            })
            delete form.bank
            // this.$set(this.form, 'finSpendingItemSplits', msg)
            // this.$set(this.form, 'spendingBanks', this.form.bank)
            let arr = []
            arr.push(form)
            let request = saveFinance
            if (this.finSpendingId) request = updateFinSocial
            request({
              ...finSpending,
              deptId: '',
              spendingItems: JSON.stringify(arr)
            })
              .then(res => {
                if (res.code === 200) {
                  this.$notification['success']({
                    message: '系统通知',
                    description: '操作成功'
                  })
                  this.enterVisible = false
                  this.$emit('refresh')
                }
              })
              .finally((this.loading = false))
          })
        }
      })
    },
    changeTotal(val) {
      // this.$nextTick(() => {
      //   this.$refs.filterMoney.price = val
      // })
    },
    subtract(index) {
      this.form.bank.splice(index, 1)
      // this.$nextTick(() => {
      //   delete this.rules['bank' + this.form.bank.length]
      //   delete this.rules['price' + this.form.bank.length]
      // })
    },
    treeSelectNormalizeObj() {
      listOrgDept().then(res => {
        this.payDeptList = res.data
      })
    },
    deptChange(value, index) {
      if (value && value.length > 0) {
        let schoolId = value[value.length - 1]
        listBank({ schoolId }).then(res => {
          if (res.code === 200) {
            this.form.bank[index]._accounts = res.data
          }
        })
      } else {
        this.form.bank[index]._accounts = []
        this.form.bank[index].bankId = null
      }
    },
    add() {
      // if (!this.rules['bank' + this.form.bank.length]) {
      //   this.rules['bank' + this.form.bank.length] = [{ required: true, message: '请选择银行账户', trigger: 'change' }]
      // }
      // if (!this.rules['price' + this.form.bank.length]) {
      //   this.rules['price' + this.form.bank.length] = [{ required: true, message: '请输入打款金额', trigger: 'change' }]
      // }
      this.form.bank.push({
        payDeptId: null,
        _accounts: [],
        bankId: null,
        price: null
      })
    },
    async open(id, finSpendingId) {
      this.treeSelectNormalizeObj()
      let res = await listFeeName({ type: 'B' })
      if (res.code === 200) {
        this.costNames = res.data
      }
      // let res1 = await listBank()
      // if (res1.code) {
      //   this.bankAccounts = res1.data
      // }
      let that = this
      if (id) {
        let data = await getFinSpendingItem({ finSpendingId: finSpendingId })
        if (data.code === 200) {
          this.enterVisible = true
          const { incType, price, listFinSpeBank, date, finSpendingItem, priceDate } = data.data
          this.form.expendDate = date
          this.form.priceDate = priceDate
          this.$nextTick(() => {
            that.$refs.filterMoney.counselorInfo = []
          })
          finSpendingItem.forEach(item => {
            // item.listFinSpeSplit.forEach((todo, index) => {
            //   todo.key = index
            //   todo.startDate = todo.date
            //   todo.endDate = todo.date
            //   todo.deptId = todo.deptId
            //   todo.parentDeptName = todo.parentDeptName
            //   todo.price = incType == 'B' ? -todo.price : todo.price
            // })
            item.mapQueryList.forEach((x, Xindex) => {
              x.key = Xindex
              x.spendingSplits = JSON.parse(JSON.stringify(x.finSpendingItemSplitList)) || []
              x.feeItemId = x.sysFeeItemId
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
                })
              }
            })
            this.$nextTick(() => {
              // that.$refs.filterMoney.counselorInfo = item.mapQueryList
              that.$refs.filterMoney.backData({
                finSpendingItemSplit: item.mapQueryList,
                price
              })
              // that.$refs.filterMoney.counselorkey = item.mapQueryList.length - 1
            })
            this.form.spendingItemId = item.id
            this.form.feeNameId = item.feeNameId
            this.form.price = item.price
            this.form.number = item.number
            this.form.unit = item.unit
            this.form.remark = item.remark
            this.form.bank = item.listFinSpeBank.map(item => {
              return {
                payDeptId: item.deptId,
                _accounts: [],
                bankId: item.bankId,
                price: item.price
              }
            })

            this.form.bank.forEach(item => {
              let schoolId = item.payDeptId[item.payDeptId.length - 1]
              listBank({ schoolId })
                .then(res => {
                  item._accounts = res.data || []
                })
            })
          })
        }

        this.finSpendingId = finSpendingId
      } else {
        this.enterVisible = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.icon {
  color: #1890ff;
  font-size: 16px;
}
.belongs-teacher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
/deep/.ant-input[disabled] {
  color: rgb(96 96 96);
  background-color: #fff;
}

.required {
  display: inline-block;
  color: rgb(245, 34, 45);
  font-size: 0.14rem;
  font-family: SimSun, sans-serif;
  line-height: 1;
  transform: translate(20px, 32px);
}
</style>
