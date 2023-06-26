<template>
  <div class="fin-profit-paytype-wrapper">
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :exportUrl="'/finance/advisercheck/downAdviserCheck'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import { listAdviserCheck } from '@/api/table/table'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment()
  .add(1, 'months')
  .date(0)
  .format('YYYY-MM-DD')
export default {
  name: 'counselorAchievement',
  data() {
    return {
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: [
            {
              label: '类型',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '业绩类型',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '区间',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '提点',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '人数',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '业绩合计',
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            },
            {
              label: '提成合计',
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
          key: 'dataType',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'performanceType',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'startSection',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'rate',
          value: '',
          isTotal: false,
          isClick: false
        },
        {
          key: 'member',
          value: '',
          isTotal: false,
          isClick: true
        },
        {
          key: 'price',
          value: '',
          isTotal: true,
          isClick: false
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
          show: true,
          isShow: true,
          type: 'month',
          key: 'month',
          label: '缴费时间',
          placeholder: '请选择缴费时间',
          format: 'YYYY-MM',
          defaultVal: this.getMonth()
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
  created() {},
  methods: {
    getMonth() {
      let date = new Date()
      var myyear = date.getFullYear()
      var mymonth = date.getMonth() + 1
      if (mymonth < 10) {
        mymonth = '0' + mymonth
      }
      return myyear + '-' + mymonth
    },
    async init(data) {
      this.rpSpinning = true
      this.headList.forEach((col, colIndex) => {
        if (col.isTotal) col.value = 0
      })
      let res = await listAdviserCheck(data)
      if (Array.isArray(res.data) && res.data.length > 0) {
        let dataA = res.data.filter(item => item.type == 'A')
        let dataB = res.data.filter(item => item.type == 'B')
        let loadDataA = this.getList(dataA).sort(function(a, b) {
          return a.rate - b.rate
        })
        let loadDataB = this.getList(dataB)
        this.loadData = [...loadDataA, ...loadDataB]
      }
      this.rpSpinning = false
    },
    getList(data) {
      let loadData = []
      let length = data.length + 1
      data.forEach((item, index) => {
        let data = []
        if (index == 0) {
          item.dataType = item.type == 'A' ? '单色' : '优鸽'
        } else {
          item.dataType = ''
        }
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
          if (col.isClick) {
            datavalue.startSection = item.startSection
            datavalue.endSection = item.endSection
            datavalue.rate = item.rate
            datavalue.performanceType = item.performanceType
          }
          if (colIndex == 0) {
            if (index == 0) {
              datavalue.rowspan = length
              data.push(datavalue)
            }
          } else {
            if (col.key == 'startSection') datavalue.label = item[col.key] + '-' + item.endSection + '万'
            if (col.key == 'rate') datavalue.label = item[col.key] + '%'
            if (col.key == 'performanceType') {
              datavalue.label = item[col.key]
                .replace('A', '新报')
                .replace('B', '续报')
                .replace(',', '+')
            }
            data.push(datavalue)
          }
        })
        loadData.push({
          style: 'background:#fff;',
          data: JSON.parse(JSON.stringify(data))
        })
      })
      let total = []
      this.headList.forEach((col, colIndex) => {
        if (col.isTotal || colIndex == 0) {
          let totalValue = {
            key: col.key,
            label: col.value,
            rowspan: 1,
            colspan: 1,
            style: col.isClick ? 'color:#1BA97B;cursor:pointer;' : '',
            isClick: col.isClick
          }
          if (col.isTotal) totalValue.label = col.value.toFixed(2)
          total.push(totalValue)
        }
      })
      total[0].label = '合计'
      total[0].colspan = 4
      loadData.push({
        style: 'background:#fff;',
        data: JSON.parse(JSON.stringify(total))
      })
      return JSON.parse(JSON.stringify(loadData))
    },
    searchSubmit(data) {
      let { schoolIds, month } = data
      const date = new Date(month)
      const defaultStart = moment(date)
        .date(1)
        .format('YYYY-MM-DD')
      const defaultEnd = moment(date)
        .add(1, 'months')
        .date(0)
        .format('YYYY-MM-DD')
      this.queryParam = {
        schoolIds,
        startDate: defaultStart,
        endDate: defaultEnd
      }
      this.init(this.queryParam)
    },
    toDetail(data) {
      if (data.isClick) {
        let { endDate, startDate, schoolIds } = this.queryParam
        let { startSection, endSection, key, rate, performanceType } = data
        this.$router.push({
          name: 'counselorAchievementDetails',
          params: {
            type: key,
            startDate: startDate,
            endDate: endDate,
            startSection: startSection,
            endSection: endSection,
            rate: rate,
            performanceType: performanceType
          },
          query: {
            id: schoolIds
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
