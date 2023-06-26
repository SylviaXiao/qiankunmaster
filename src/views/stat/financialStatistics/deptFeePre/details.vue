<template>
  <div class="reports-iframe-wrapper">
    <div class="table-wrapper">
      <a-card :bordered="false">
        <div class="mt10 mb10">
          <a-button type="primary" icon="download" @click.native="downloadStu">
            导出
          </a-button>
        </div>
        <s-table ref="table" size="default" :pageSizeOptions="pageSizeOptions" :columns="columns" :data="loadData" :rowKey="(record, index) => index">
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
import { deptFeePreFirstColumns, pageSizeOptions } from '@/utils/tableDetails/details'
import { STable } from '@/components'
import { deptExpenseFlowListDetails } from '@/api/table/table'
export default {
  name: 'deptFinanceDetails',
  props: {},
  components: {
    STable
  },
  data() {
    return {
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      columns: deptFeePreFirstColumns,
      queryParam: {},
      loadData: parameter => {
        let { type, endDate, startDate } = this.$route.params
        let { id } = this.$route.query
        this.queryParam.endDate = endDate
        this.queryParam.startDate = startDate
        this.queryParam.deptIds = id
        this.queryParam.typeName = type

        let request = deptExpenseFlowListDetails
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
        if (route.name == 'deptFeePreDetail') {
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
      let exportUrl = '/finance/spending/deptExpenseFlowListDetailsByExportExcel'
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
    toCostPricePrice(record) {
      //  startMonth,
      //   endMonth
      let { date, finDeptId, feeName, price, splitDate, deptNo, bankId } = record
      //    deptId: deptNo,
      // endDate: date.slice(0, 10),
      // startDate: date.slice(0, 10),
      this.$router.push({
        name: 'spendManagement',
        query: {
          feeName: feeName,
          price: price,
          startMonth: splitDate.slice(0, 7),
          endMonth: splitDate.slice(0, 7),
          bankId: bankId
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
