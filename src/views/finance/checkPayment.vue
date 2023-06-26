<template>
  <div class="check-payment wrapper">
    <a-card :bordered="false" style="margin: 20px 0;">
      <div class="search-wrapper">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </div>
    </a-card>
    <a-card :bordered="false" style="margin: 20px 0;">
      <perm-box perm="finance:info:private:confirm">
        <div style="text-align:right; margin: 10px 0;">
          <a-radio-group @change="changeCheck" :default-value="queryParam.isEndConfirm" button-style="solid" v-model="queryParam.isEndConfirm">
            <a-radio-button :value="false">待确认</a-radio-button>
            <a-radio-button :value="true">已确认</a-radio-button>
          </a-radio-group>
        </div>
      </perm-box>
      <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange" style="margin-bottom: 10px;">
        全选
      </a-checkbox>
      <a-checkbox-group @change="changePayway" style="width: 100%;" v-model="payTypeId">
        <a-row type="flex">
          <a-col :xxl="3" :xl="4" :md="6" :sm="8" :xs="12" v-for="(item, index) in payways" :key="index">
            <a-checkbox :value="item.id" style="margin-bottom:10px;">{{ item.dictValue }}</a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
      <s-table ref="table" size="default" :columns="columns" :data="loadData" :alert="false" rowKey="id" showPagination="false" :defaultPagination="true">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="finance:info:private:confirm">
            <a href="javascript:;" v-if="!queryParam.isEndConfirm" @click="checkPrice(text, record, 'Y')">确认</a>
            <a href="javascript:;" v-if="queryParam.isEndConfirm" @click="checkPrice(text, record, 'N')">取消</a>
          </perm-box>
        </span>
      </s-table>
    </a-card>

    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      title="确认信息"
      v-model="modal"
      width="600px"
      okText="保存"
      cancelText="取消"
      @ok="submit"
      @cancel="cancel"
      :confirmLoading="isloading"
    >
      <div style="margin-bottom:10px;">时间：{{ Msg.date }}</div>
      <div style="margin-bottom:10px;">分馆：{{ Msg.deptName }}</div>
      <div style="margin-bottom:10px;">应收金额：{{ Msg.totalPrice }}</div>
      <div style="margin-bottom:10px;">到账金额：{{ Msg.totalFeePrice }}</div>
    </a-modal>
  </div>
</template>

<script>
import { ReportsSearch, STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import { privateSummary, batchPrivateConfirm } from '@/api/finance/finance'
import { getPayMethods } from '@/api/education'
import { getSchoolList, listBank } from '@/api/education/card'
import moment from 'moment'

const PAY_TYPE = 'pay_type'
const columns = [
  {
    title: '分馆',
    dataIndex: 'schoolName'
  },
  {
    title: '应收',
    dataIndex: 'totalPrice'
  },
  {
    title: '到账',
    dataIndex: 'totalFeePrice',
    customRender: (text, record) => {
      const { totalPrice, totalFeePrice } = record
      return (totalPrice - totalFeePrice).toFixed(2)
    }
  },
  {
    title: '操作',
    key: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]
const defaultDate = [
  moment()
    .subtract(1, 'days')
    .format('YYYY-MM-DD'),
  moment()
    .subtract(1, 'days')
    .format('YYYY-MM-DD')
]
export default {
  name: 'checkPayment',
  props: {
    income: {
      type: Boolean,
      default: true
    }
  },
  components: {
    SearchComPro,
    ReportsSearch,
    STable,
    PermBox
  },
  computed: {},
  data() {
    return {
      moment,
      columns,
      defaultDate,
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'date',
          key: 'Date',
          label: '选择时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [
            moment(
              moment()
                .subtract(1, 'days')
                .format('YYYY-MM-DD'),
              'YYYY-MM-DD'
            ),
            moment(
              moment()
                .subtract(1, 'days')
                .format('YYYY-MM-DD'),
              'YYYY-MM-DD'
            )
          ]
        }
      ],

      queryParam: {
        startDate: defaultDate[0],
        endDate: defaultDate[1],
        school_id: '',
        isEndConfirm: (() => {
          return !this.$tools.checkPerm('finance:info:private:confirm')
        })()
      },
      tableLoading: false,

      showDate: null,
      indeterminate: false,
      loadData: parameter => {
        if (this.payTypeId.length) {
          let payType = this.payTypeId.join(',')
          return privateSummary(Object.assign(parameter, this.queryParam, { payType })).then(res => {
            return res
          })
        }
      },
      modal: false,
      Msg: {
        date: null,
        deptName: null,
        price: null,
        schoolId: null,
        payType: null,
        bankNo: null
      },
      isloading: false,
      bankNos: [],
      payTypeId: [],
      payways: [],
      checkAll: true,
      type: null
    }
  },
  created() {
    this.getPayWay(true)
  },
  watch: {
    payTypeId(n, o) {
      if (!n.length) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请选择支付方式'
        })
      }
    }
  },
  methods: {
    cancel() {},
    submit() {
      this.isloading = true
      let params = {
        school: this.Msg.schoolId || null,
        payType: this.payTypeId.join(','),
        bankId: this.Msg.bankNo,
        startDate: this.defaultDate[0],
        endDate: this.defaultDate[1]
      }
      let confirmApi = batchPrivateConfirm
      confirmApi(Object.assign(params, this.queryParam, { state: this.type }))
        .then(res => {
          this.modal = false
          this.$notification['success']({
            message: '系统通知',
            description: res.msg
          })
          this.getIncome()
        })
        .finally((this.isloading = false))
    },
    getPayWay(type) {
      getPayMethods({ type: 'B' }).then(res => {
        if (res.code === 200) {
          this.payways = res.data
          if (type) {
            //全选默认
            this.payTypeId = this.payways.map(item => item.id)
            this.$refs.table.refresh()
          }
        }
      })
    },
    //全选
    onCheckAllChange(e) {
      Object.assign(this, {
        payTypeId: e.target.checked ? this.payways.map(item => item.id) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
      console.log(this.payTypeId)
    },
    //多选
    changePayway() {
      this.indeterminate = !!this.payTypeId.length && this.payTypeId.length < this.payways.map(item => item.id).length
      this.checkAll = this.payTypeId.length === this.payways.map(item => item.id).length
      console.log(this.payTypeId)
    },
    searchSubmit(data) {
      console.log(data)
      this.queryParam.startDate = data.startDate
      this.queryParam.endDate = data.endDate
      this.queryParam.school_id = data.school_id
      this.getIncome()
    },
    getIncome() {
      this.$refs.table.refresh()
    },
    checkPrice(text, record, type) {
      console.log(record)
      this.type = type
      this.Msg = {
        date: this.queryParam.startDate + '~' + this.queryParam.endDate,
        deptName: record.schoolName,
        totalPrice: record.totalPrice,
        totalFeePrice: record.totalPrice - record.totalFeePrice,
        schoolId: record.schoolId || null,
        payType: record.payTypeId,
        bankNo: null
      }
      if (type === 'N') {
        let that = this
        return that.$confirm({
          title: '系统提示',
          content: '是否取消该条数据',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            that.submit()
          }
        })
      }
      const _this = this
      const { $confirm, defaultDate, queryParam, getIncome, $notification, isEndConfirm } = this
      let confirmMsg
      if (queryParam.startDate && queryParam.endDate) {
        confirmMsg = queryParam.startDate + '~' + queryParam.endDate
      } else {
        confirmMsg = defaultDate[0] + '~' + defaultDate[1]
      }
      listBank({ schoolId: record.schoolId }).then(res => {
        if (res.code === 200) {
          this.bankNos = res.data
          this.modal = true
        }
      })
    },
    changeCheck(e) {
      const val = e.target.value
      this.queryParam.isEndConfirm = val
      this.getIncome()
    },
    getKeyList(data) {
      this.keyList = data
    }
  }
}
</script>

<style lang="less" scoped>
.radio-wrapper {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: baseline;

  .date-content {
    line-height: 40px;
  }
}

.check-payment-table-wrapper {
  .uncheck-price {
    min-width: 248px;
  }

  .ant-table-thead > tr:first-child > th:first-child {
    min-width: 150px !important;
  }
}
</style>
