<template>
  <div class="payment-count-wrapper">
    <a-row :gutter="16">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
        <a-card :bordered="false">
          <template slot="title">
            <span class="title">缴费</span>
            <!-- 待分配业绩入口,暂时注释 -->
            <!-- <a-button style="margin-left:15px" v-if="studentInfo && studentInfo.id" @click="unassignedHandle">
              {{ unassignedText }}
            </a-button> -->
            <span class="date-picker-title">
              <span style="margin-right: 8px;">
                <span
                  style="display: inline-block;
                        margin-right: 4px;
                        content: '*';
                        font-family: SimSun;
                        line-height: 1;
                        font-size: 14px;
                        color: #f5222d;"
                >
                  *
                </span>
                报名缴费和业绩归属时间:
              </span>
              <a-date-picker :placeholder="today" :disabledDate="disabledDate" style="width: 150px;" v-model="enrollDate" />
            </span>
          </template>
          <a-form class="payment-count-form" :form="payForm">
            <a-row v-if="showUnassigned">
              <a-table
                :rowKey="financeId"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
                :pagination="false"
                :columns="financeColumns"
                :dataSource="financeDataList"
              />
            </a-row>
            <a-row v-else>
              <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <!-- 实缴金额 -->
                <a-row type="flex" align="middle">
                  <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <a-form-item label="实缴金额" v-bind="formItemLayout" style="position: relative;">
                      <!-- :min="0"
                        :max="shouldPayMoney" -->
                      <a-input-number
                        @change="getBalance"
                        style="width: 100%;"
                        :disabled="disabled"
                        :formatter="value => `￥ ${value}`"
                        v-decorator="[
                          'price',
                          {
                            initialValue: '0',
                            rules: [{ required: true, message: '请输入实缴金额' }, { validator: $verify.isNum }]
                          }
                        ]"
                      />
                      <span v-if="isFullMoney && oldStudent" class="tips">
                        <span>余额：￥ {{ stuBalance }} 元</span>
                        <a-icon v-if="balanceIcon" class="iconye" type="sync" @click="refreshStuBalance" />
                        <a-icon v-else class="iconye" type="sync" spin />
                      </span>
                    </a-form-item>
                  </a-col>
                  <a-col class="radio-yu" :span="8"> </a-col>
                </a-row>
                <a-row>
                  <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="hasTypeValue">
                    <a-form-item label="缴费类型" v-bind="formItemLayout">
                      <a-select v-decorator="['priceType', { initialValue: 'A', rules: [{ required: true, message: '请选择缴费类型' }] }]">
                        <a-select-option :allowClear="true" value="A">全款</a-select-option>
                        <a-select-option :allowClear="true" value="B">定金</a-select-option>
                        <a-select-option :allowClear="true" value="C">补缴</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <a-form-item label="支付类型" v-bind="formItemLayout">
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
                </a-row>
                <a-row>
                  <a-col>
                    <!-- 备注 -->
                    <a-form-item
                      label="缴费备注"
                      :label-col="{
                        lg: { span: 4 },
                        md: { span: 4 },
                        xs: { span: 8 },
                        sm: { span: 8 }
                      }"
                      :wrapper-col="{
                        lg: { span: 20 },
                        md: { span: 20 },
                        xs: { span: 16 },
                        sm: { span: 16 }
                      }"
                    >
                      <a-textarea style="width: 100%;" placeholder="请输入备注" :rows="1" v-decorator="['remark']" />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="12" v-if="!quickApplayShow">
        <a-card :bordered="false">
          <template slot="title">
            <span class="title">业绩归属</span>
            <span class="date-picker-title">
              <a-input style="opacity: 0;" />
            </span>
          </template>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <BelongsTable
              ref="belongsTable"
              :studentCards="studentCards"
              :studentNewCards="studentNewCards"
              :courseType="courseType"
              :total="totalBelongs"
              :financePrice="financePrice"
              :stu-info="studentInfo"
              :isShowSource="true"
              :specialCard="specialCard"
              :backPayment="backPayment"
              :hideSourceDetailList="hideSourceDetailList"
              :allowChangeService="allowChangeService"
              @changeSource="handleChangeSource"
            ></BelongsTable>
          </a-col>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
import { getPayMethods, getStudentBalance, listUnassignedIncomes } from '@/api/education'
import BelongsTable from '@/components/BelongsTable'

const formItemLayout = {
  labelCol: {
    lg: { span: 8 },
    md: { span: 6 },
    xs: { span: 8 },
    sm: { span: 8 }
  },
  wrapperCol: {
    lg: { span: 16 },
    md: { span: 18 },
    xs: { span: 16 },

    sm: { span: 16 }
  }
}

const financeColumns = [
  {
    title: '缴费时间',
    dataIndex: 'createDate'
  },
  {
    title: '缴费金额',
    dataIndex: 'price',
    customRender: v => {
      return v + '元'
    }
  },
  {
    title: '缴费类型',
    dataIndex: 'type',
    customRender: v => {
      if (v === 'A') {
        return '全款'
      }
      if (v === 'B') {
        return '定金'
      }
      if (v === 'C') {
        return '补缴'
      }
      return '其他'
    }
  }
]

export default {
  name: 'PaymentCount',
  components: {
    BelongsTable
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    quickApplayShow: {
      type: Boolean,
      default: false
    },
    hasTypeValue: {
      type: Boolean,
      default: true
    },
    studentInfo: {
      type: Object,
      default: () => {}
    },
    studentCards: {
      type: Array,
      default: () => []
    },
    studentNewCards: {
      type: Array,
      default: () => []
    },
    courseType: {
      type: Number,
      default: null
    },
    shouldPayMoney: {
      type: Number,
      default: 0
    },
    paidPrice: {
      type: Number,
      default: 0
    },
    // 特殊续卡
    specialCard: {
      type: Boolean,
      default: false
    },
    // 补缴
    backPayment: {
      type: Boolean,
      default: false
    },
    // 不展示资源来源 = 会员续卡时的列表
    hideSourceDetailList: {
      type: Boolean,
      default: false
    },
    // 当资源来源=客服，可以修改客服人员
    allowChangeService: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    studentInfo(nv, ov) {
      const hasStuBalance = !!nv && !!(nv.stuBalance || nv.balance)
      const {
        payForm: { getFieldValue, resetFields }
      } = this
      // resetFields()
      // 余额相关
      if (nv.id) {
        const params = {
          studentId: nv.id
        }
        listUnassignedIncomes(params).then(res => {
          this.financeDataList = res.data
        })
      }
      hasStuBalance
        ? this.$nextTick(() => {
            this.stuBalance = nv.stuBalance || nv.balance
            // let price = parseFloat(value) + parseFloat(stuBalance)
            let price = parseFloat(this.stuBalance ?? 0) + parseFloat(getFieldValue('price') ?? 0)
            this.totalPrice = price
            this.$emit('getBalancePrice', price)
          })
        : this.$nextTick(() => {
            this.totalPrice = getFieldValue('price')
            this.stuBalance = 0
            this.$emit('getBalancePrice', this.totalPrice)
          })
      // 分配相关
    },
    paidPrice: {
      deep: true,
      handler(nv) {
        let price1 = nv
        if (!price1) {
          price1 = 0
        }
        let price = price1
        if (this.stuBalance) {
          price = price1 - this.stuBalance > 0 ? price1 - this.stuBalance : 0
        }
        this.payForm.setFieldsValue({ ['price']: price })
        this.getBalance(price)
      }
    },
    oldStudent(nv) {
      if (!nv) this.$emit('getBalancePrice', 0)
    }
  },
  computed: {
    oldStudent() {
      return !!this.studentInfo && (!!this.studentInfo.stuBalance || !!this.studentInfo.balance)
    }
  },
  data() {
    return {
      formItemLayout,
      //时间title
      today: moment()
        .subtract(0, 'days')
        .format('YYYY-MM-DD'),
      enrollDate: null,
      //支付类型
      payMethods: [],
      //所属人表格list
      belongsList: [],
      //当前open的imdoal的key
      openedKey: null,
      //余额
      stuBalance: 0,
      //总额
      totalPrice: 0,
      //余额属性icon
      balanceIcon: true,
      //是否全款
      isFullMoney: true,
      //额外参数
      formValues: {},
      // 分单金额
      totalBelongs: 0,
      unassignedText: '待分配业绩',
      showUnassigned: false,
      selectedRowKeys: [],
      financeDataList: [],
      financeColumns: financeColumns,
      financeId: '',
      financePrice: 0
    }
  },
  beforeCreate() {
    this.payForm = this.$form.createForm(this)
  },
  created() {
    this.getAllPayMethods()
  },
  methods: {
    setTeacherHandle(data) {
      this.$refs.belongsTable.setTeacherHandle(data)
    },
    unassignedHandle() {
      if (this.unassignedText === '待分配业绩') {
        this.unassignedText = '正常缴费'
        this.resetForm()
        this.resetFinance()
        this.showUnassigned = true
      } else {
        this.unassignedText = '待分配业绩'
        this.resetForm()
        this.resetFinance()
        this.showUnassigned = false
      }
    },
    onSelectChange(selectedRowKeys, record) {
      this.selectedRowKeys = selectedRowKeys
      const finaceInfo = record[0]
      this.financeId = finaceInfo.financeId
      this.financePrice = finaceInfo.price
    },
    financeIdHandle(e) {
      this.financeId = e.target.value
      this.financePrice = this.financeDataList.filter(item => this.financeId === item.financeId)[0].price
    },
    resetFinance() {
      this.selectedRowKeys = []
      this.financeId = ''
      this.financePrice = 0
    },
    //获取并设置支付类型
    getAllPayMethods() {
      const {
        payForm: { setFieldsValue }
      } = this
      getPayMethods()
        .then(res => {
          this.payMethods = res.data
          if (!!res.data) {
            return res.data[0].id
          }
        })
        .then(id => this.$nextTick(() => setFieldsValue({ payTypeId: id })))
    },
    disabledDate(current) {
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
    //刷新余额
    refreshStuBalance() {
      if (this.studentInfo) {
        const {
          studentInfo: { id }
        } = this
        this.balanceIcon = false
        getStudentBalance(id)
          .then(res => {
            this.stuBalance = res.data
          })
          .finally(() => (this.balanceIcon = true))
      }
    },
    // changeTitleDate() {
    //   this.formValues.enrollDate = this.enrollDate ? this.$tools.tailor.getDate(this.enrollDate) : this.enrollDate
    // },
    getBalance(value) {
      const { stuBalance } = this
      const payInfo = {
        balancePrice: stuBalance || 0,
        payPrice: value
      }
      this.totalBelongs = value
      this.$emit('getBalancePrice', value)
    },
    buildResult() {
      const {
        payForm: { getFieldsValue }
      } = this
      let value = getFieldsValue()
      value.financeId = this.financeId
      return !this.quickApplayShow
        ? this.$refs.belongsTable.getAllValue().then(res => {
            this.formValues.enrollDate = this.enrollDate
              ? this.$tools.tailor.getDate(this.enrollDate)
              : moment()
                  .subtract(0, 'days')
                  .format('YYYY-MM-DD')
            this.formValues = Object.assign({}, this.formValues, value)
            this.formValues = Object.assign({}, this.formValues, res)
            if (res.stuUserId) {
              this.formValues.stuUserId = res.stuUserId
            }
          })
        : Promise.resolve().then(res => {
            this.formValues.enrollDate = this.enrollDate
              ? this.$tools.tailor.getDate(this.enrollDate)
              : moment()
                  .subtract(0, 'days')
                  .format('YYYY-MM-DD')
            this.formValues = Object.assign(this.formValues, value)
            // if (res.stuUserId) {
            //   this.formValues.stuUserId = res.stuUserId
            // }
          })
    },
    getAccountsFormData() {
      return this.payForm
        .validateFields()
        .then(this.buildResult)
        .then(() => {
          return this.formValues
        })
    },
    // 手动回显belongtable
    backDataBelongsTable(data) {
      this.$refs.belongsTable.setBelongsValues(data)
    },
    // 不做复杂逻辑仅仅取值
    getValueSimple() {
      const {
        payForm: { getFieldsValue, validateFields }
      } = this
      let result = {}
      return validateFields()
        .then(res => {
          result = Object.assign({}, res)
          result.enrollDate = this.$tools.tailor.getNowFormat()
          result.enrollDate = this.$tools.tailor.getDate(this.enrollDate)
          return result
        })
        .then(this.$refs.belongsTable.getAllValue)
        .then(belongValue => {
          result = Object.assign({}, result, belongValue)
          return result
        })
    },
    // 初始化顾问业绩
    initAdviser() {
      this.$refs.belongsTable.initAdviser()
    },
    // 初始化导师业绩
    initTeacher() {
      this.$refs.belongsTable.initTeacher()
      this.$refs.belongsTable.isShowTeacher = false
    },
    // 手动重置belongstable
    initBelongsTable() {
      this.$refs.belongsTable.initBelongs()
    },
    resetForm() {
      const {
        payForm: { resetFields }
      } = this
      resetFields()
      this.showUnassigned = false
      this.enrollDate = null
      this.financeId = ''
    },
    setSourceValue(data) {
      this.$refs.belongsTable.setSourceValue(data)
    },
    // 业绩归属发生变化
    handleChangeSource(value, option) {
      this.$emit('changeSource', value)
    }
  }
}
</script>

<style scoped lang="less" scoped>
@import '~@/assets/style/index';

.payment-count-wrapper {
  margin-bottom: 15px;
  /deep/.ant-card-head-title {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .date-picker-title {
    // float: right;
    // margin-right: 15px;
    display: flex;
    flex-wrap: wrap;
  }

  .tips {
    position: absolute;
    right: -150px;
    color: rgb(223, 39, 62);
    padding: 0;

    .iconye {
      position: relative;
      left: 8px;
      cursor: pointer;
      color: #000;
    }
  }
}
.title {
  font-size: 16px;
  font-weight: bold;
  background-color: #fff;
}
</style>
