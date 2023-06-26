<template>
  <div class="reports-iframe-wrapper">
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
          <span slot="salTypeName" slot-scope="text, record">
            <a href="javascript:;" @click="toSalTypeName(record)">{{ text }}</a>
          </span>
          <span slot="num" slot-scope="text, record">
            <a href="javascript:;" @click="toNum(record)">{{ text }}</a>
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
import { teacherClassFirstColumns, pageSizeOptions } from '@/utils/tableDetails/details'
import { STable } from '@/components'
import { pageSalaryInfo } from '@/api/table/table'
export default {
  name: 'teacherClassDetails',
  props: {},
  components: {
    STable
  },
  data() {
    return {
      totalList: [],
      pageSizeOptions: pageSizeOptions,
      columns: teacherClassFirstColumns,
      queryParam: {},
      columnList: [
        {
          type: ['totalPrice'],
          columns: teacherClassFirstColumns
        }
      ],
      loadData: parameter => {
        let { type, endDate, startDate } = this.$route.params
        let { id, salTypeName, salary } = this.$route.query
        this.queryParam.endDate = endDate
        this.queryParam.startDate = startDate
        this.queryParam.schoolId = id
        this.queryParam.salTypeName = salTypeName
        if (salary) this.queryParam.salary = parseFloat(salary)
        let request = ''
        if (type == 'totalPrice') request = pageSalaryInfo //导师课时统计

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
      type: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'deptFinanceDetails') {
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
      let exportUrl = ''
      let { type } = this.$route.params
      if (type == 'totalPrice') exportUrl = '/finance/teachersalary/downTeachersalaryInfo' //顾问业绩唯一

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
    toSalTypeName(record) {
      let { teacherName, eduTypeId } = record
      this.$router.push({
        name: 'teacherSalary',
        query: {
          name: teacherName,
          eduTypeId: eduTypeId
        }
      })
    },
    toNum(record) {
      let { className, startDate } = record
      this.$router.push({
        name: 'course',
        query: {
          day: startDate.slice(0, 10),
          className: className
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
