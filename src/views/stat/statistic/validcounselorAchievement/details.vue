<template>
  <div class="reports-iframe-wrapper">
    <div ref="elementSearch" v-if="showSearch">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
    </div>
    <div class="table-wrapper">
      <a-card :bordered="false">
        <div class="mt10 mb10">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </div>
        <s-table
          :rowKey="(record, index) => index"
          ref="table"
          size="default"
          :pageSizeOptions="pageSizeOptions"
          :columns="columns"
          :data="loadData"
          :scroll="{ x: true }"
        >
          <span slot="finPrice" slot-scope="text, record">
            <a href="javascript:;" @click="tofinPrice(record)">{{ text }}</a>
          </span>
          <span slot="stuName" slot-scope="text, record">
            <a href="javascript:;" @click="toStuName(record)">{{ text }}</a>
          </span>
          <!-- 跳转当前详情页 -->
          <span slot="totalReceiptsfinInfoPrice" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'finInfoPrice')">{{ text }}</a>
          </span>
          <span slot="targetStuName" slot-scope="text, record">
            <span
              >{{ text }}
              <span class="ml10 mr10">转给</span>
              {{ record.targetStuName }}
            </span>
          </span>
          <span slot="validTargetStuName" slot-scope="text, record">
            <a href="javascript:;" @click="toValidTargetStuName(record)">{{ text }}</a>
          </span>
          <span slot="adviserNameOut" slot-scope="text, record">
            <div v-for="(item, index) in record.achievementRollOut" :key="index">{{ item.adviserName }}</div>
          </span>
          <span slot="deptNameOut" slot-scope="text, record">
            <div v-for="(item, index) in record.achievementRollOut" :key="index">{{ item.deptName }}</div>
          </span>
          <span slot="adviserNameIn" slot-scope="text, record">
            <div v-for="(item, index) in record.achievementInto" :key="index">{{ item.adviserName }}</div>
          </span>
          <span slot="deptNameIn" slot-scope="text, record">
            <div v-for="(item, index) in record.achievementInto" :key="index">{{ item.deptName }}</div>
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
  validCounselorAchievementFirstColumns,
  validCounselorAchievementSecondColumns,
  validCounselorAchievementThirdColumns,
  validCounselorAchievementFourthColumns,
  validCounselorAchievementFifthColumns,
  pageSizeOptions
} from '@/utils/tableDetails/details'
import { STable } from '@/components'
import { pageAdviserPerSale, pageRefundPer, pageFullRefundInfo, pageHalfRefundInfo, pageOutPer, pageIntoPer, pageNoAdviserPer } from '@/api/table/table'
import { SearchComPro } from '@/components'
let searchParams = [
  {
    type: 'text',
    key: 'adviserName', //包含date字段返回值不包含hh:mm:ss   包含time字段返回值包含hh:mm:ss
    label: '顾问姓名',
    placeholder: '请输入顾问姓名'
  },
  {
    type: 'text',
    key: 'studentName', //包含date字段返回值不包含hh:mm:ss   包含time字段返回值包含hh:mm:ss
    label: '学员姓名',
    placeholder: '请输入学员姓名'
  },
  {
    type: 'text',
    key: 'phone', //包含date字段返回值不包含hh:mm:ss   包含time字段返回值包含hh:mm:ss
    label: '手机号 ',
    placeholder: '请输入手机号 '
  }
]
let searchParamsOut = [
  {
    type: 'text',
    key: 'cardNo', //包含date字段返回值不包含hh:mm:ss   包含time字段返回值包含hh:mm:ss
    label: '卡号',
    placeholder: '请输入卡号'
  },
  {
    type: 'text',
    key: 'outAdviserName', //包含date字段返回值不包含hh:mm:ss   包含time字段返回值包含hh:mm:ss
    label: '转出顾问',
    placeholder: '请输入转出顾问'
  },
  {
    type: 'text',
    key: 'intoAdviserName', //包含date字段返回值不包含hh:mm:ss   包含time字段返回值包含hh:mm:ss
    label: '转入顾问',
    placeholder: '请输入转入顾问'
  }
]
export default {
  name: 'validcounselorAchievementDetails',
  props: {},
  components: {
    STable,
    SearchComPro
  },
  data() {
    return {
      type: '',
      queryParams: {},
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      columns: validCounselorAchievementFirstColumns,
      queryParam: {},
      columnList: [
        {
          type: ['salePerformance'],
          columns: validCounselorAchievementFirstColumns
        },
        {
          type: ['totalRefundPrice'],
          columns: validCounselorAchievementSecondColumns
        },
        {
          type: ['fullRefundPer', 'halfRefundPer', 'shopRefundPer', 'noAdviserPer'],
          columns: validCounselorAchievementThirdColumns
        },
        {
          type: ['outPer'],
          columns: validCounselorAchievementFourthColumns
        },
        {
          type: ['intoPer'],
          columns: validCounselorAchievementFifthColumns
        }
      ],
      loadData: parameter => {
        let { type } = this.$route.params
        let request = ''
        if (type == 'salePerformance') request = pageAdviserPerSale //销售业绩
        if (type == 'totalRefundPrice') request = pageRefundPer //分馆总退费
        if (type == 'fullRefundPer') request = pageFullRefundInfo //顾问退费全额业绩
        if (type == 'halfRefundPer') request = pageHalfRefundInfo //顾问退费减半业绩
        if (type == 'shopRefundPer') request = pageHalfRefundInfo //顾问退费店面承担
        if (type == 'outPer') request = pageOutPer //转出业绩
        if (type == 'intoPer') request = pageIntoPer //转入业绩
        if (type == 'noAdviserPer') request = pageNoAdviserPer //不扣顾问业绩

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
      searchParams: searchParams,
      showSearch: true,
      searchParamsList: [
        {
          type: ['salePerformance', 'fullRefundPer', 'halfRefundPer', 'shopRefundPer', 'noAdviserPer'],
          searchParams: searchParams
        },
        {
          type: ['outPer', 'intoPer'],
          searchParams: searchParamsOut
        }
      ]
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'validcounselorAchievementDetails') {
          let { type, endDate, startDate, id } = this.$route.params
          this.type = type
          this.columns = this.columnList.filter(item => item.type.includes(type))[0].columns
          if (type == 'totalRefundPrice') {
            this.showSearch = false
          } else {
            this.searchParams = this.searchParamsList.filter(item => item.type.includes(type))[0].searchParams
          }

          this.queryParam = {}
          this.queryParam.schoolIds = id
          this.queryParam.endDate = endDate
          this.queryParam.startDate = startDate
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
    searchSubmit(data) {
      console.log(777, data)
      // this.queryParam = Object.assign(this.queryParam, data)
      this.queryParam.adviserName = data.adviserName || null
      this.queryParam.studentName = data.studentName || null
      this.queryParam.phone = data.phone || null
      this.queryParam.cardNo = data.cardNo || null
      this.queryParam.outAdviserName = data.outAdviserName || null
      this.queryParam.intoAdviserName = data.intoAdviserName || null
      this.$refs.table.refresh()
    },
    //导出
    downloadStu() {
      let exportUrl = ''
      let { type } = this.$route.params
      if (type == 'salePerformance') exportUrl = '/finance/adviserefficient/downAdviserPer' //销售业绩
      if (type == 'totalRefundPrice') exportUrl = '/finance/adviserefficient/downTotalRefundPer' //分馆总退费
      if (type == 'fullRefundPer') exportUrl = '/finance/adviserefficient/downFullRefun' //顾问退费全额业绩
      if (type == 'halfRefundPer') exportUrl = '/finance/adviserefficient/downHalfRefund' //顾问退费减半业绩
      if (type == 'shopRefundPer') exportUrl = '/finance/adviserefficient/downShopRefund' //顾问退费店面承担
      if (type == 'outPer') exportUrl = '/finance/adviserefficient/downOutPer' //转出业绩
      if (type == 'intoPer') exportUrl = '/finance/adviserefficient/downIntoPer' //转入业绩
      if (type == 'noAdviserPer') exportUrl = '/finance/adviserefficient/downNoAdviserPer' //不扣顾问业绩
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
    //学员详情
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
      //deptId业绩分馆  finDeptId提交分馆
      let { deptId, stuPhone, finDeptId, positionName, tradeDate, userName, createDate } = record
      let { type } = this.$route.params
      let name = 'ahievement'
      if (positionName == '导师') {
        name = 'finaAuditionDeduct'
      }
      if (type == 'salePerformance' || type == 'fullRefundPer' || type == 'halfRefundPer' || type == 'shopRefundPer' || type == 'totalRefundPrice') {
        let endDate = tradeDate.slice(0, 10)
        let startDate = tradeDate.slice(0, 10)
        this.$router.push({
          name: name,
          query: {
            deptId: deptId,
            endPayDate: endDate,
            startPayDate: startDate,
            stuPhone: stuPhone,
            master: userName
          }
        })
      } else {
        let endDate = createDate.slice(0, 10)
        let startDate = createDate.slice(0, 10)
        this.$router.push({
          name: name,
          query: {
            deptId: deptId,
            endDate: endDate,
            startDate: startDate,
            stuPhone: stuPhone
          }
        })
      }
    },
    totalReceiptsfinInfoPrice(record, type) {
      let { deptId, userName } = record
      let id = deptId
      if (type == 'memberUserName') id = userName
      let { endDate, startDate } = this.queryParam
      this.$router.push({
        name: 'counselorAchievementDetails',
        params: {
          type: type,
          startDate: startDate,
          endDate: endDate,
          startSection: 0,
          endSection: 0,
          rate: 0,
          performanceType: 0
        },
        query: {
          id: id
        }
      })
    },
    toValidTargetStuName(record) {
      //deptId业绩分馆  finDeptId提交分馆
      let { rollOutDate, stuCardNo } = record
      let selectKey = '0'
      if (this.type == 'intoPer') selectKey = '1'
      let name = 'transferCardManagement'
      let endDate = rollOutDate.slice(0, 10)
      let startDate = rollOutDate.slice(0, 10)
      if (selectKey) this.selectKey = selectKey
      this.$router.push({
        name: name,
        query: {
          endDate: endDate,
          startDate: startDate,
          stuCard: stuCardNo,
          selectKey
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reports-iframe-wrapper {
}
</style>
