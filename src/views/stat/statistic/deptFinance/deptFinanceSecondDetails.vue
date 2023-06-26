<template>
  <div class="reports-iframe-wrapper">
    <div class="table-wrapper">
      <a-card :bordered="false">
        <div class="mt10 mb10">
          <a-button v-if="type !== 'totalReceipts'" type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </div>
          <s-table
            ref="table"
            size="default"
            :pageSizeOptions="pageSizeOptions"
            :columns="columns"
            :data="loadData"
            :defaultPagination='defaultPagination'
            :rowKey="(record, index) => index"
            :scroll="{ x: true }"
          >
                      <span slot="finPrice" slot-scope="text, record">
                        <a href="javascript:;" @click="tofinPrice(record)">{{ text }}</a>
                      </span>
                      <span slot="shopItemPricePrice" slot-scope="text, record">
                        <a href="javascript:;" @click="toShopItemPricePrice(record)">{{ text }}</a>
                      </span>
                      <span slot="costPricePrice" slot-scope="text, record">
                        <a href="javascript:;" @click="toCostPricePrice(record)">{{ text }}</a>
                      </span>
          </s-table>
        <div v-for="item in totalList" :key="item.key">{{ item.title }}：{{ item.totalValue }}</div>
      </a-card>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import {
  firstColumns,
  secondColumns,
  thirdColumns,
  fourthColumns,
  fifthColumns,
  sixthColumns,
  seventhColumns,
  eighthColumns,
  nighthColumns,
  tenthColumns,
  pageSizeOptions
} from '@/utils/tableDetails/details'
import { SearchComPro, STable } from '@/components'
import {
  pageShopItem,
  pageAdviserPer,
  pageCost,
  pageFinInfo,
  pageRefundPay,
  pageRefundSub,
  pageReimbursePay,
  pageReimburseSub,
  pageServicePer,
  pageTeacheRepeat,
  pageTeacherPer,
  pageTotalPer,
  pageTotalRefund,
  totalReceipts,
  listOnlyAdviserPerInfo, listOnlyTeacherPerInfo, listOnlyAdviserPer, listOnlyTeacherPer,
  listServicePerInfo,
  listRepeatTeacherPerInfo, listRefundInfo, listSubmitRefundInfo
} from '@/api/table/table'
import moment from 'moment'
import { getAllSysFeeItem, listOrgDept } from '@/api/education/card'
export default {
  name: 'deptFinanceSecondDetails',
  props: {},
  components: {
    STable,
    SearchComPro
  },
  data() {
    return {
      type:'',
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      columns: firstColumns,
      queryParam: {},
      columnList: [
        {
          type: ['adviserPerformance','servicePerformance'],
          columns: firstColumns
        },
        {
          type: ['teacherPerformance','teacherRepeat'],
          columns: secondColumns
        },
        {
          type: ['servicePerformance'],
          columns: nighthColumns
        },
        {
          type: ['shopItemPrice'],
          columns: thirdColumns
        },
        {
          type: ['costPrice'],
          columns: fourthColumns
        },
        {
          type: ['deptTotalRefund','refundSub','refundPay'],
          columns: fifthColumns
        },
        {
          type: ['reimburseSub'],
          columns: sixthColumns
        },
        {
          type: ['reimbursePay'],
          columns: seventhColumns
        },
      ],
      loadData: parameter => {
        let { type} = this.$route.params
        let request = ''
        if (type === 'adviserPerformance') request = listOnlyAdviserPerInfo //顾问业绩唯一
        if (type === 'teacherPerformance') request = listOnlyTeacherPerInfo //导师业绩唯一
        if (type === 'totalPerformance') request = pageTotalPer //总业绩
        if (type === 'servicePerformance') request = listServicePerInfo //客服业绩重复
        if (type === 'teacherRepeat') request = listRepeatTeacherPerInfo //导师业绩重复
        if (type === 'shopItemPrice') request = pageShopItem //其他收入
        if (type === 'costPrice') request = pageCost //成本费用
        if (type === 'deptTotalRefund') request = listRefundInfo //分馆总退费
        if (type === 'totalReceipts') request = totalReceipts //总收款
        if (type === 'reimburseSub') request = pageReimburseSub //报销提交
        if (type === 'reimbursePay') request = pageReimbursePay //报销支付
        if (type === 'refundSub') request = listSubmitRefundInfo //退费提交
        if (type === 'refundPay') request = listRefundInfo //退费支付
        if (type === 'finInfoPrice') request = pageFinInfo //业绩收入
        return request(Object.assign(parameter, this.queryParam)).then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.totalList = this.columns.filter(item => {
              if (item.isTotal) {
                item.totalValue = res.data.map(col => col[item.key]).reduce((a, b) => parseFloat(a) + parseFloat(b))
                item.totalValue = item.totalValue?.toFixed(2)
              }
              return item.isTotal
            })
          } else {
            this.totalList = []
          }

          return res
        })
      },
      defaultPagination:true
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name === 'deptFinanceSecondDetails') {
          let { type } = this.$route.params
          let arr = ['costPrice','shopItemPrice']
          this.defaultPagination=!arr.includes(type)
          this.type = type
          this.initSearchParams()
          this.columns = this.columnList.filter(item => item.type.includes(route.params.type))[0].columns
          this.$forceUpdate()
          if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    initData() {
      this.spinning = true
        let { type} = this.$route.params
        let request = ''
        if (type === 'adviserPerformance') request = listOnlyAdviserPerInfo //顾问业绩唯一
        if (type === 'teacherPerformance') request = listOnlyTeacherPerInfo //导师业绩唯一
        if (type === 'totalPerformance') request = pageTotalPer //总业绩
        if (type === 'servicePerformance') request = listServicePerInfo //客服业绩重复
        if (type === 'teacherRepeat') request = listRepeatTeacherPerInfo //导师业绩重复
        if (type === 'shopItemPrice') request = pageShopItem //其他收入
        if (type === 'costPrice') request = pageCost //成本费用
        if (type === 'deptTotalRefund') request = pageTotalRefund //分馆总退费
        if (type === 'totalReceipts') request = totalReceipts //总收款
        if (type === 'reimburseSub') request = pageReimburseSub //报销提交
        if (type === 'reimbursePay') request = pageReimbursePay //报销支付
        if (type === 'refundSub') request = pageRefundSub //退费提交
        if (type === 'refundPay') request = pageRefundPay //退费支付
        if (type === 'finInfoPrice') request = pageFinInfo //业绩收入
         request(this.queryParam).then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.loadData=res.data
            this.totalList = this.columns.filter(item => {
              if (item.isTotal) {
                item.totalValue = res.data.map(col => col[item.key]).reduce((a, b) => parseFloat(a) + parseFloat(b))
                item.totalValue = item.totalValue?.toFixed(2)
              }
               return item.isTotal
            })
          } else {
            this.totalList = []
            this.loadData=[]
          }
        })
    },
    initSearchParams(){
      let { type} = this.$route.params
      let { id,costType ,totalType, endDate, startDate ,source,userId} = this.$route.query
      this.queryParam.endDate = endDate
      this.queryParam.startDate = startDate
      this.queryParam.deptId = id

      this.queryParam.userId = userId
      if (type === 'deptTotalRefund'||type === 'refundPay')  this.queryParam.status='A'
      if (type === 'refundSub') this.queryParam.status='B'
      let  arr2 = ['deptTotalRefund','refundPay','refundSub']
      if(arr2.includes(type)){
        this.queryParam.type = source
      }else{
        this.queryParam.source = source
      }
        if(costType){
          this.queryParam.operateName =costType
        }
        if(totalType)this.queryParam.type=totalType
    },
    searchSubmit(data, reset) {
      if (reset === 'isReset') {
        this.initSearchParams()
      }else{
        if(!data.schoolId)return this.$notification['error']({
          message: '系统通知',
          description: `请选择分摊分馆`
        })
        this.queryParam = data
        if(data.startMonth){
          this.queryParam.startDate = data.startMonth+'-01'
          let endDate = moment(data.endMonth,"YYYY-MM")
            .add(1, 'months')
            .date(0)
            .format('YYYY-MM-DD')
          this.queryParam.endDate =endDate
          delete this.queryParam.startMonth
          delete this.queryParam.endMonth
        }
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    },
    //导出
    downloadStu() {
      let exportUrl = ''
      let { type } = this.$route.params
      if (type === 'adviserPerformance') exportUrl = '/finance/salarycheck/downOnlyAdviserPerInfo' //顾问业绩唯一
      if (type === 'teacherPerformance') exportUrl = '/finance/salarycheck/downOnlyTeacherPerInfo' //导师业绩唯一
      if (type === 'totalPerformance') exportUrl = '/finance/salarycheck/downTotalPer' //总业绩
      if (type === 'servicePerformance') exportUrl = '/finance/salarycheck/downServicePerInfo' //客服业绩重复
      if (type === 'teacherRepeat') exportUrl ='/finance/salarycheck/downRepeatTeacherPerInfo' //导师业绩重复
      if (type === 'shopItemPrice') exportUrl = '/finance/salarycheck/downShopItemInfo' //其他收入
      if (type === 'costPrice') exportUrl = '/finance/salarycheck/downPageCost' //成本费用
      if (type === 'deptTotalRefund') exportUrl = '/finance/salarycheck/downRefundInfo' //分馆总退费
      if (type === 'reimburseSub') exportUrl = '/finance/salarycheck/downReimburseSub' //报销提交
      if (type === 'reimbursePay') exportUrl = '/finance/salarycheck/downReimbursePay' //报销支付
      if (type === 'refundSub') exportUrl = '/finance/salarycheck/downSubmitRefundInfo' //退费提交
      if (type === 'refundPay') exportUrl = '/finance/salarycheck/downRefundInfo' //退费支付
      if (type === 'finInfoPrice') exportUrl = '/finance/salarycheck/downFinInfo' //业绩收入
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
    totalReceiptsfinInfoPrice(record, type) {
      let { finDeptId } = record
      let { endDate, startDate } = this.queryParam
      this.$router.push({
        name: 'deptFinanceDetails',
        params: { type: type, startDate: startDate, endDate: endDate },
        query: {
          id: finDeptId
        }
      })
    },
    toCostPricePrice(record) {
      let { date, finDeptId, feeName, price, splitDate, deptNo, splitDeptNo } = record
      this.$router.push({
        name: 'spendManagement',
        query: {
          // deptId: deptNo,
          // splitDeptKey: splitDeptNo,
          endDate: date.slice(0, 10),
          startDate: date.slice(0, 10),
          feeName: feeName,
          price: Math.abs(price),
          startMonth: splitDate.slice(0, 7),
          endMonth: splitDate.slice(0, 7)
        }
      })
    },
    toShopItemPricePrice(record) {
      let { name, deptId, payTypeId } = record
      this.$router.push({
        name: 'storeRevenue',
        query: {
          deptId: deptId,
          endDate: record.createDate.slice(0,10),
          startDate:  record.createDate.slice(0,10),
          name: name,
          payTypeId: payTypeId
        }
      })
    }, //学员详情
    toStuName(record) {
      let { studentId } = record
      this.$router.push({
        name: 'studentInfo',
        params: {
          id: studentId
        }
      })
    },
    tofinPrice(record) {
      //payDeptId业绩分馆  finDeptId提交分馆
      let {payDeptId, deptId, stuPhone, finDeptId, positionName, tradeDate,userId ,userName,ratio,teacherName} = record
      let endDate = tradeDate.slice(0, 10)
      let startDate = tradeDate.slice(0, 10)
      let { type } = this.$route.params
      if (type === 'teacherPerformance'||type==='teacherRepeat') {
      this.$router.push({
        name: 'finaAuditionDeduct',
        query: {
          endDate: endDate,
          startDate: startDate,
          stuPhone: stuPhone,
          teacherRatio:ratio,
          teacher:teacherName,
        }
      })
      }else {
        let name = 'ahievement'
        this.$router.push({
          name: name,
          query: {
            orgDeptId: payDeptId,
            endPayDate: endDate,
            startPayDate: startDate,
            stuPhone: stuPhone,
            masterId:userId,
            master:userName
          }
        })
      }
    },

  }
}
</script>

<style lang="less" scoped>
.reports-iframe-wrapper {
}
</style>
