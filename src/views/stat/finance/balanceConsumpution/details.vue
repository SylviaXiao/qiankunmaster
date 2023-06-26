<template>
  <div class="reports-iframe-wrapper">
    <ReportTable
      @toDetail="toDetail"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :loadData="loadData"
      :total="total"
      :searchParamsArray="[]"
      :exportUrl="exportUrl"
    ></ReportTable>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import { beginBalance, middleBalance } from '@/api/table/table'
import { listEduDance } from '@/api/common'
import moment from 'moment'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
import DISTRICTS from '@/tools/citydata'
const addressOptions = DISTRICTS
export default {
  name: 'balanceConsumputionDetail',
  props: {},
  components: {
    ReportTable
  },
  data() {
    return {
      exportUrl: '/student/card/consume/beginBalanceDown',
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: [
            {
              label: '办卡分馆',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '上课分馆',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '班型',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '舞种',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '学员',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '卡号',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '操作时间',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '缴费/消耗进度',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            // {
            //   label: '期初',
            //   rowspan: 1,
            //   colspan: 1,
            //   style: 'min-width: 120px;'
            // },
            {
              label: '收入',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '消耗',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '退费',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '结转',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '余额',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            }
          ]
        }
      ],
      //表内容字段
      headList: [
        {
          key: 'applyDeptName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'classDeptName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'typeName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'danceName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'stuName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'cardNo',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'createDate',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'type',
          value: '',
          isTotal: false,
          isClick: false,
          formatValue: this.getType
        },
        // {
        //   key: 'beginRemainAmount',
        //   value: 0,
        //   isTotal: true,
        //   isClick: false,
        //   formatValue: this.formateNumber
        // },
        {
          key: 'addAmount',
          value: '',
          isTotal: false,
          clearTotal: true,
          isClick: false,
          formatValue: this.formateNumber
        },
        {
          key: 'consumeAmount',
          value: 0,
          isTotal: true,
          isClick: false,
          formatValue: this.formateNumber
        },
        {
          key: 'returnPrice',
          value: 0,
          isTotal: false,
          isClick: false,
          isTotal: true,
          getLast: true,
          formatValue: this.formateNumber
        },
        {
          key: 'changeCard',
          value: 0,
          isTotal: false,
          isClick: false,
          isTotal: true,
          getLast: true,
          formatValue: this.formateNumber
        },
        {
          key: 'balance',
          value: 0,
          isTotal: false,
          isClick: false,
          isTotal: true,
          getLast: true,
          formatValue: this.formateNumber
        }
      ],
      //表内容
      loadData: [],
      queryParam: { limit: 20, page: 1 },
      //表格是否加载
      rpSpinning: false,
      total: 0
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name == 'balanceConsumputionDetail') {
          let { type, startDate, endDate, id, beginRemainAmount } = this.$route.params
          this.queryParam.startDate = startDate
          this.queryParam.stuCardId = id
          if (type == 'consumeAmount') {
            this.queryParam.endDate = endDate
            this.queryParam.beginRemainAmount = beginRemainAmount
          }
          if (type == 'beginRemainAmount') {
            this.exportUrl = '/student/card/consume/beginBalanceDown'
          }
          if (type == 'consumeAmount') {
            this.exportUrl = '/student/card/consume/middleBalanceDown'
          }
          this.init(this.queryParam)
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
    formateNumber(recoed, key) {
      if (recoed[key]) {
        return Number(recoed[key]).toFixed(2)
      } else {
        return recoed[key]
      }
    },
    getType(record) {
      if (record.type == 'A') {
        return '全款'
      } else if (record.type == 'B') {
        return '定金'
      } else if (record.type == 'C') {
        return '补缴'
      } else if (record.type == 'D') {
        return '消耗'
      } else {
        return ''
      }
    },
    async init(data) {
      let { type } = this.$route.params
      this.rpSpinning = true
      this.headList.forEach((col, colIndex) => {
        if (col.isTotal) col.value = 0
      })
      let res = null
      if (type == 'beginRemainAmount') {
        res = await beginBalance(data)
      }
      if (type == 'consumeAmount') {
        res = await middleBalance(data)
      }
      if (res) {
        this.total = res.count
        if (Array.isArray(res.data) && res.data.length > 0) {
          let loadData = []
          res.data.forEach((item, index) => {
            let data = []
            this.headList.forEach((col, colIndex) => {
              if (col.isTotal) {
                if (col.getLast) {
                  col.value = item[col.key] ? Number(item[col.key]) : 0
                } else {
                  col.value += item[col.key] ? Number(item[col.key]) : 0
                }
              }
              let dataItem = {
                key: col.key,
                label: col.formatValue ? col.formatValue(item, col.key) : item[col.key],
                rowspan: 1,
                colspan: 1,
                style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
                isClick: col.isClick,
                id: item.deptId,
                salTypeName: item.salTypeName,
                salary: item.salary
              }
              data.push(dataItem)
            })
            loadData.push({
              style: 'background:#fff;',
              data: JSON.parse(JSON.stringify(data))
            })
          })
          let total = []
          this.headList.forEach((col, colIndex) => {
            if (colIndex == 0 || col.isTotal || col.clearTotal) {
              let totalData = {
                key: col.key,
                label: col.value,
                rowspan: 1,
                colspan: colIndex == 0 ? 8 : 1,
                style: '',
                isClick: false,
                id: ''
              }
              if (col.isTotal) totalData.label = Number(col.value).toFixed(2)
              total.push(totalData)
            }
          })
          total[0].label = '总计'
          total[0].isClick = false
          loadData.push({
            style: 'background:#fff;',
            data: JSON.parse(JSON.stringify(total))
          })
          this.loadData = JSON.parse(JSON.stringify(loadData))
        } else {
          this.loadData = []
        }
      }

      this.rpSpinning = false
    },
    onShowSizeChange(data) {
      this.queryParam = Object.assign(this.queryParam, data)
      this.init(this.queryParam)
    },
    searchSubmit(data) {
      this.queryParam = data
      this.queryParam.startDate = data.startDate || defaultStart
      this.queryParam.endDate = data.endDate || defaultEnd
      this.init(this.queryParam)
    },
    toDetail(data) {
      if (data.isClick) {
        let { endDate, startDate } = this.queryParam
        let { key } = data
        //  query: {
        //     id: id,
        //   }
        // const { href } = this.$router.resolve({
        //   name: 'balanceConsumputionDetail'
        // })
        // localStorage.setItem('balanceConsumputionSearchParams', JSON.stringify(this.queryParam))
        //结合open打开新的页面
        // window.open(href, '_blank')
        this.$router.push({
          name: 'balanceConsumputionDetail',
          params: { type: key, startDate: startDate, endDate: endDate }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.reports-iframe-wrapper {
}
</style>
