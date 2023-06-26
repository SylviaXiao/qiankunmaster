<template>
  <div class="fin-profit-paytype-wrapper">
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :exportUrl="'/finance/adviserefficient/downAdviserEfficient'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import { listAdviserEfficient } from '@/api/table/table'
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
  name: 'validcounselorAchievement',
  data() {
    return {
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: [
            {
              label: '分馆',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '销售业绩',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '分馆总退费',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '顾问退费全额业绩',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '顾问退费减半业绩',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '顾问退费店面承担',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '顾问退费一次业绩',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '顾问退费二次金额',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '顾问退费二次业绩',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '顾问退费总业绩',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '上月未扣除业绩',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '转出业绩',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '转入业绩',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '不扣顾问业绩',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '实际提成业绩',
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
          key: 'deptName',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'salePerformance',
          value: '',
          isTotal: true,
          isClick: true
        },
        {
          key: 'totalRefundPrice',
          value: '',
          isTotal: true,
          isClick: true
        },
        {
          key: 'fullRefundPer',
          value: '',
          isTotal: true,
          isClick: true
        },
        {
          key: 'halfRefundPer',
          value: '',
          isTotal: true,
          isClick: true
        },
        {
          key: 'shopRefundPer',
          value: '',
          isTotal: true,
          isClick: true
        },
        {
          key: 'firstRefundPer',
          value: '',
          isTotal: true,
          isClick: false
        },
        {
          key: 'secondRefundPrice',
          value: '',
          isTotal: true,
          isClick: false
        },
        {
          key: 'secondRefundPer',
          value: '',
          isTotal: true,
          isClick: false
        },
        {
          key: 'totalRefundPer',
          value: '',
          isTotal: true,
          isClick: false
        },
        {
          key: 'negativePrice',
          value: '',
          isTotal: true,
          isClick: false
        },
        {
          key: 'outPer',
          value: '',
          isTotal: true,
          isClick: true
        },
        {
          key: 'intoPer',
          value: '',
          isTotal: true,
          isClick: true
        },
        {
          key: 'noAdviserPer',
          value: '',
          isTotal: true,
          isClick: true
        },
        {
          key: 'commission',
          value: '',
          isTotal: true,
          isClick: false
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
          key: 'schoolIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
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
          if (item.key == 'schoolIds') {
            this.searchParams.splice(index, 1)
          }
        })
        this.queryParam.schoolIds = userSchoolId.map(item => item.deptId).join(',')
      }
    },
    async init(data) {
      this.rpSpinning = true
      this.headList.forEach((col, colIndex) => {
        if (col.isTotal) col.value = 0
      })
      let res = await listAdviserEfficient(data)
      if (Array.isArray(res.data) && res.data.length > 0) {
        let loadDataA = this.getList(res.data)
        this.loadData = [...loadDataA]
      }
      this.rpSpinning = false
    },
    getList(data) {
      let loadData = []
      let length = data.length
      data.forEach((item, index) => {
        let data = []
        this.headList.forEach((col, colIndex) => {
          if (col.isTotal) col.value += item[col.key]
          let datavalue = {
            key: col.key,
            label: item[col.key],
            rowspan: 1,
            colspan: 1,
            style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
            isClick: col.isClick
          }
          if (col.isClick) datavalue.id = item.deptId
          data.push(datavalue)
        })
        loadData.push({
          style: 'background:#fff;',
          data: JSON.parse(JSON.stringify(data))
        })
      })
      let total = []
      this.headList.forEach((col, colIndex) => {
        let totalData = {
          key: col.key,
          label: col.value,
          rowspan: 1,
          colspan: 1,
          style: '',
          isClick: false,
          id: ''
        }
        if (col.isTotal) totalData.label = col.value.toFixed(2)
        total.push(totalData)
      })
      total[0].label = '合计'
      loadData.push({
        style: 'background:#fff;',
        data: JSON.parse(JSON.stringify(total))
      })
      return JSON.parse(JSON.stringify(loadData))
    },
    searchSubmit(data) {
      this.queryParam = Object.assign(this.queryParam, data)
      this.init(this.queryParam)
    },
    toDetail(data) {
      if (data.isClick) {
        let { endDate, startDate } = this.queryParam
        let { key } = data
        const { href } = this.$router.resolve({
          name: 'validcounselorAchievementDetails',
          params: {
            type: key,
            startDate: startDate,
            endDate: endDate,
            id: data.id
          }
        })
        //结合open打开新的页面
        window.open(href, '_blank')
        return
        this.$router.push({
          name: 'validcounselorAchievementDetails',
          params: {
            type: key,
            startDate: startDate,
            endDate: endDate,
            id: data.id
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
