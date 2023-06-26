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
          :rowKey="(record, index) => index"
          :scroll="{ x: true }"
        >
          <span slot="finPrice" slot-scope="text, record">
            <a href="javascript:;" @click="tofinPrice(record)">{{ text }}</a>
          </span>
          <span slot="stuName" slot-scope="text, record">
            <a href="javascript:;" @click="toStuName(record)">{{ text }}</a>
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
import { teacherAchievementFirstColumns, pageSizeOptions } from '@/utils/tableDetails/details'
import { STable } from '@/components'
import { pageTeachercheckInfo } from '@/api/table/table'
export default {
  name: 'teacherAchievementDetails',
  props: {},
  components: {
    STable
  },
  data() {
    return {
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      columns: teacherAchievementFirstColumns,
      queryParam: {},
      columnList: [
        {
          type: ['sevenPrice', 'fivePrice', 'twoPrice', 'sevenRefund', 'fiveRefund', 'twoRefund'],
          columns: teacherAchievementFirstColumns
        }
      ],
      loadData: parameter => {
        let { type, endDate, startDate, itemType, targ } = this.$route.params
        let { id } = this.$route.query
        this.queryParam.endDate = endDate
        this.queryParam.startDate = startDate
        this.queryParam.schoolId = id
        this.queryParam.type = itemType
        this.queryParam.targ = targ
        let request = pageTeachercheckInfo
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
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'teacherAchievementDetails') {
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
    //导出
    downloadStu() {
      let exportUrl = '/finance/teachercheck/downTeachercheckinfo'
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
      let { deptId, stuPhone, finDeptId, userName, tradeDate } = record
      let endDate = tradeDate.slice(0, 10)
      let startDate = tradeDate.slice(0, 10)
      this.$router.push({
        name: 'finaAuditionDeduct',
        query: {
          endDate: endDate,
          startDate: startDate,
          stuPhone: stuPhone,
          teacher: userName
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
