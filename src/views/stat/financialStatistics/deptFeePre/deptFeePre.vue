<template>
  <div class="fin-profit-paytype-wrapper">
    <ReportTable
      @searchSubmit="searchSubmit"
      @toDetail="toDetail"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :exportUrl="'/finance/spending/deptExpenseFlowListByExportExcel'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { listThirdDept } from '@/api/education/card'
import { deptExpenseFlowList } from '@/api/table/table'
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
  name: 'financeIncomeTable',
  data() {
    return {
      //表头
      headData: [
        {
          style: 'background:#eee;', //每一行样式配置
          data: []
        },
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
          key: 'deptIds',
          label: '选择分馆',
          placeholder: '请选择分馆',
          isShowThird: true,
          expandAll: true,
          mutiple: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: listThirdDept,
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
      let res = await deptExpenseFlowList(data)
      //初始化表格内容
      this.headData[0].data = [
        {
          label: '费用归类/区域',
          rowspan: 2,
          colspan: 1,
          style: 'min-width: 120px;'
        }
      ]
      this.headData[1].data = []
      let leftList = []
      let loadData = []
      let totalData = [
        {
          label: '合计',
          rowspan: 1,
          colspan: 1,
          style: 'min-width: 120px;'
        }
      ]
      let total = 0
      if (Array.isArray(res.data.data) && res.data.data.length > 0) {
        leftList = res.data.data[0].rows[0].rows.map(item => item.operateName)
        leftList.forEach(item => {
          loadData.push({
            style: 'background:#fff;',
            data: [
              {
                key: item,
                label: item,
                rowspan: 1,
                colspan: 1,
                style: '',
                isClick: false
              }
            ]
          })
        })
        res.data.data.forEach(item => {
          this.headData[0].data.push({
            label: item.name,
            rowspan: 1,
            colspan: item.rows.length,
            style: 'min-width: 120px;'
          })

          item.rows.forEach((col, colIndex) => {
            this.headData[1].data.push({
              label: col.deptName,
              rowspan: 1,
              colspan: 1,
              style: 'min-width: 120px;'
            })
            col.rows.sort((a, b) => {
              return leftList.indexOf(a.operateName) - leftList.indexOf(b.operateName)
            })
            //表格内容
            leftList.forEach((leftListItem, leftListItemIndex) => {
              let dataRows = col.rows.filter(dataRowsItem => {
                return dataRowsItem.operateName == leftListItem
              })[0]
              loadData[leftListItemIndex].data.push({
                key: dataRows.operateName,
                label: dataRows.totalPrice,
                rowspan: 1,
                colspan: 1,
                style: 'color:#1BA97B;cursor:pointer;',
                isClick: true,
                id: col.deptId
              })
            })
            totalData.push({
              key: '合计',
              label: col.count,
              rowspan: 1,
              colspan: 1,
              style: '',
              isClick: false
            })
            total += Number(col.count)
          })
        })
      }

      //增加横向合计
      this.headData[0].data.push({
        label: '合计',
        rowspan: 2,
        colspan: 1,
        style: 'min-width: 120px;'
      })
      leftList.forEach((leftListItem, leftListItemIndex) => {
        loadData[leftListItemIndex].data.push({
          key: '合计',
          label: res.data.count[leftListItem],
          rowspan: 1,
          colspan: 1,
          style: '',
          isClick: false,
          id: ''
        })
      })
      //总合计
      totalData.push({
        key: '合计',
        label: total.toFixed(3),
        rowspan: 1,
        colspan: 1,
        style: '',
        isClick: false
      })
      //竖向合计
      loadData.push({
        style: 'background:#fff;',
        data: JSON.parse(JSON.stringify(totalData))
      })

      console.log(6666, totalData)
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
          name: 'deptFeePreDetail',
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
