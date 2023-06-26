<template>
  <div class="fin-profit-paytype-wrapper">
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :exportUrl="'/finance/spending/operatingExpenseFlowListByExportExcel'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { listSecondDept } from '@/api/education/card'
import { operatingExpenseFlowList } from '@/api/table/table'
import Vue from 'vue'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'cashJournal',
  data() {
    return {
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: []
        }
      ],
      //表内容
      loadData: [],
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '缴费时间',
          show: true,
          placeholder: '请选择缴费时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'deptIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: listSecondDept,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        }
      ],
      queryParam: {},
      //表格是否加载
      rpSpinning: false
    }
  },
  components: {
    ReportTable
  },
  created() {
    this.isSchoolId()
  },
  methods: {
    isSchoolId() {
      const userSchoolId = JSON.parse(Vue.ls.get('userSchoolId'))
      if (userSchoolId && userSchoolId.length > 0) {
        this.searchParams.forEach((item, index) => {
          if (item.key == 'deptIds') {
            this.searchParams.splice(index, 1)
          }
        })
        this.queryParam.deptIds = userSchoolId.map(item => item.deptId).join(',')
      }
    },
    async init(data) {
      this.rpSpinning = true
      let res = await operatingExpenseFlowList(data)
      //初始化表格内容
      this.headData[0].data = [
        {
          label: '校区名称/经营归类',
          rowspan: 1,
          colspan: 1,
          style: 'min-width: 120px;'
        }
      ]
      let headers = res.data.headers
      let rows = res.data.rows
      let count = res.data.count
      let loadData = []
      let totalCount = 0
      let total = [
        {
          key: '总计',
          label: '总计',
          rowspan: 1,
          colspan: 1,
          style: '',
          isClick: false,
          id: ''
        }
      ]

      if (res.data && Array.isArray(headers) && headers.length > 0) {
        headers.forEach((item, index) => {
          //获取表头
          this.headData[0].data.push({
            label: item,
            rowspan: 1,
            colspan: 1,
            style: 'min-width: 120px;'
          })
          //获取总计
          if (res.data.count)
            total.push({
              key: item,
              label: count[item] || 0,
              rowspan: 1,
              colspan: 1,
              style: 'color:#1BA97B;cursor:pointer;',
              isClick: true,
              id: ''
            })
        })
      }
      this.headData[0].data.push({
        label: '总计',
        rowspan: 1,
        colspan: 1,
        style: 'min-width: 120px;'
      })
      //获取总金额
      if (res.data && count) {
        for (let key in count) {
          totalCount += count[key]
        }
      }
      //获取表内容
      if (res.data && Array.isArray(rows) && rows.length > 0) {
        rows.forEach(item => {
          let data = [
            {
              key: '校区名称/经营归类',
              label: item.name,
              rowspan: 1,
              colspan: 1,
              style: '',
              isClick: false
            }
          ]
          item.value.sort((a, b) => {
            return headers.indexOf(a.operateName) - headers.indexOf(b.operateName)
          })
          item.value.forEach((col, colIndex) => {
            data.push({
              key: col.operateName,
              label: col.totalPrice,
              rowspan: 1,
              colspan: 1,
              style: 'color:#1BA97B;cursor:pointer;',
              isClick: true,
              id: item.deptId
            })
          })
          data.push({
            key: '总计',
            label: item.count,
            rowspan: 1,
            colspan: 1,
            style: '',
            isClick: false,
            id: ''
          })
          loadData.push({
            style: 'background:#fff;',
            data: JSON.parse(JSON.stringify(data))
          })
        })
      }
      total.push({
        key: '总计',
        label: totalCount ? totalCount.toFixed(3) : 0,
        rowspan: 1,
        colspan: 1,
        style: '',
        isClick: false,
        id: ''
      })
      loadData.push({
        style: 'background:#fff;',
        data: JSON.parse(JSON.stringify(total))
      })
      this.loadData = JSON.parse(JSON.stringify(loadData))
      this.rpSpinning = false
    },
    searchSubmit(data) {
      this.queryParam = Object.assign(this.queryParam, data)
      this.init(this.queryParam)
    },
    toDetail(data) {
      if (data.isClick) {
        let { endDate, startDate, deptIds } = this.queryParam
        let id = data.id || deptIds
        let key = data.key
        this.$router.push({
          name: 'cashJournalDetail',
          params: { type: key, startDate: startDate, endDate: endDate },
          query: {
            id: id
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
