<template>
  <div class="reports-iframe-wrapper">
    <div ref="elementSearch" :style="{ padding: '20px 0' }" v-if="type == 'member'">
      <a-card :bordered="false">
        <search-com-pro :hideReset="true" :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="elementSearch" :searchParams="searchParams">
        </search-com-pro>
      </a-card>
    </div>
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
          :rowKey="(record, index) => index"
          :scroll="{ x: true }"
        >
          <span slot="finPrice" slot-scope="text, record">
            <a href="javascript:;" @click="tofinPrice(record)">{{ text }}</a>
          </span>
          <span slot="stuName" slot-scope="text, record">
            <a href="javascript:;" @click="toStuName(record)">{{ text }}</a>
          </span>
          <span slot="totalReceiptsfinInfoPrice" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'finInfoPrice')">{{ text }}</a>
          </span>
          <span slot="serviceSource" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'serviceSource', '客服')">{{ text }}</a>
          </span>
          <span slot="networkSource" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'networkSource', '个人网络')">{{ text }}</a>
          </span>
          <span slot="memberIntroduceSource" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'memberIntroduceSource', '会员介绍')">{{ text }}</a>
          </span>
          <span slot="memberReorderSource" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'memberReorderSource', '会员续卡')">{{ text }}</a>
          </span>
          <span slot="passSource" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'passSource', '传单')">{{ text }}</a>
          </span>
          <span slot="natureSource" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'natureSource', '自然来访')">{{ text }}</a>
          </span>
          <span slot="incomeSource" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'incomeSource', '店面收入')">{{ text }}</a>
          </span>
          <span slot="danceSource" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'danceSource', '舞林一分钟')">{{ text }}</a>
          </span>

          <span slot="teacherSource" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'teacherSource', '导师转化')">{{ text }}</a>
          </span>
          <span slot="intoPer" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'intoPer')">{{ text }}</a>
          </span>
          <span slot="outPer" slot-scope="text, record">
            <a href="javascript:;" @click="totalReceiptsfinInfoPrice(record, 'outPer')">{{ text }}</a>
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
  counselorAchievementFirstColumns,
  counselorAchievementSecondColumns,
  counselorAchievementThirdColumns,
  counselorAchievementFourthColumns,
  pageSizeOptions
} from '@/utils/tableDetails/details'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import { pageAdviserInfo, pageAdviserPerFormance, adviserPageIntoPer, adviserPageOutPer } from '@/api/table/table'

import { getSchoolList } from '@/api/education/card'
export default {
  name: 'counselorAchievementDetails',
  props: {},
  components: {
    STable,
    SearchComPro
  },
  data() {
    return {
      queryParams: {},
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      columns: counselorAchievementFirstColumns,
      queryParam: {},
      columnList: [
        {
          type: ['member'],
          columns: counselorAchievementFirstColumns
        },
        {
          type: [
            'serviceSource',
            'networkSource',
            'memberIntroduceSource',
            'memberReorderSource',
            'passSource',
            'natureSource',
            'incomeSource',
            'danceSource',
            'teacherSource'
          ],
          columns: counselorAchievementSecondColumns
        },
        {
          type: ['intoPer'],
          columns: counselorAchievementThirdColumns
        },

        {
          type: ['outPer'],
          columns: counselorAchievementFourthColumns
        }
      ],
      loadData: parameter => {
        let { type, endDate, startDate, startSection, endSection, rate, performanceType } = this.$route.params
        let { id } = this.$route.query

        let request = ''
        this.queryParam = {}
        //顾问业绩验算表人数
        if (type == 'member') {
          this.queryParam.schoolIds = this.queryParams.schoolIds || id
          this.queryParam.startSection = startSection
          this.queryParam.endSection = endSection
          this.queryParam.rate = rate
          this.queryParam.type = performanceType
          this.queryParam.adviserName = this.queryParams.adviserName
          request = pageAdviserInfo
        }
        //详情资源来源
        if (
          type == 'serviceSource' ||
          type == 'networkSource' ||
          type == 'memberIntroduceSource' ||
          type == 'memberReorderSource' ||
          type == 'passSource' ||
          type == 'natureSource' ||
          type == 'incomeSource' ||
          type == 'danceSource' ||
          type == 'teacherSource'
        ) {
          this.queryParam.schoolIds = rate
          this.queryParam.source = performanceType
          this.queryParam.adviserId = endSection
          request = pageAdviserPerFormance
        }
        //转入业绩
        if (type == 'intoPer') {
          this.queryParam.schoolIds = rate
          this.queryParam.userId = endSection
          request = adviserPageIntoPer
        }
        //转出业绩
        if (type == 'outPer') {
          this.queryParam.schoolIds = rate
          this.queryParam.userId = endSection
          request = adviserPageOutPer
        }
        this.queryParam.endDate = endDate
        this.queryParam.startDate = startDate
        return request(Object.assign(parameter, this.queryParam)).then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            if (type == 'member') {
              res.data.forEach(item => {
                if (Array.isArray(item.mapQuerySqlList) && item.mapQuerySqlList.length > 0) {
                  item.mapQuerySqlList.forEach(col => {
                    if (col.source == '客服') item.serviceSource = col.price
                    if (col.source == '个人网络') item.networkSource = col.price
                    if (col.source == '会员介绍') item.memberIntroduceSource = col.price
                    if (col.source == '会员续卡') item.memberReorderSource = col.price
                    if (col.source == '传单') item.passSource = col.price
                    if (col.source == '自然来访') item.natureSource = col.price
                    if (col.source == '店面收入') item.incomeSource = col.price
                    if (col.source == '舞林一分钟') item.danceSource = col.price
                    if (col.source == '导师转化') item.teacherSource = col.price
                  })
                }
              })
              res.data.forEach(item => {
                if (!item.serviceSource) item.serviceSource = 0
                if (!item.networkSource) item.networkSource = 0
                if (!item.memberIntroduceSource) item.memberIntroduceSource = 0
                if (!item.memberReorderSource) item.memberReorderSource = 0
                if (!item.passSource) item.passSource = 0
                if (!item.natureSource) item.natureSource = 0
                if (!item.incomeSource) item.incomeSource = 0
                if (!item.danceSource) item.danceSource = 0
                if (!item.teacherSource) item.teacherSource = 0
              })
            }
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
      }, //搜索项
      searchParams: [
        {
          type: 'treeSelect',
          isShow: true,
          key: 'schoolIds',
          label: '地区/分馆',
          placeholder: '请选择地区/分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'text',
          key: 'adviserName',
          label: '顾问',
          show: true,
          placeholder: '请输入顾问'
        }
      ]
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'counselorAchievementDetails') {
          let { type } = this.$route.params
          this.type = type
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
    searchSubmit(data) {
      this.queryParams = data
      this.$refs.table.refresh()
    },
    //导出
    downloadStu() {
      let exportUrl = ''
      let { type } = this.$route.params
      if (type == 'member') exportUrl = '/finance/advisercheck/downAdviserInfo' //顾问业绩详情
      if (
        type == 'serviceSource' ||
        type == 'networkSource' ||
        type == 'memberIntroduceSource' ||
        type == 'memberReorderSource' ||
        type == 'passSource' ||
        type == 'natureSource' ||
        type == 'incomeSource' ||
        type == 'danceSource' ||
        type == 'teacherSource'
      )
        exportUrl = '/finance/advisercheck/downAdviserPer' //顾问业绩(资源来源)导出
      if (type == 'intoPer') exportUrl = '/finance/advisercheck/downIntoPer' //转入业绩
      if (type == 'outPer') exportUrl = '/finance/advisercheck/downOutPer' //转出业绩
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
      let { deptId, stuPhone, finDeptId, positionName, tradeDate } = record
      // let { endDate, startDate } = this.queryParam
      let endDate = tradeDate.slice(0, 10)
      let startDate = tradeDate.slice(0, 10)
      let { type } = this.$route.params
      let name = 'ahievement'
      if (positionName == '导师') {
        name = 'finaAuditionDeduct'
      }
      this.$router.push({
        name: name,
        query: {
          deptId: deptId,
          endDate: endDate,
          startDate: startDate,
          stuPhone: stuPhone
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
    },
    totalReceiptsfinInfoPrice(record, type, source) {
      let { deptId, userName, userId } = record
      let id = deptId
      let { endDate, startDate } = this.queryParam
      this.$router.push({
        name: 'counselorAchievementDetails',
        params: {
          type: type,
          startDate: startDate,
          endDate: endDate,
          startSection: 0,
          endSection: userId,
          rate: id,
          performanceType: source || 0
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
