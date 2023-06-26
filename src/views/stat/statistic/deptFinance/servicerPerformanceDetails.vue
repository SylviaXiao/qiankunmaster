<template>
  <div class="fin-profit-paytype-wrapper">
    <ReportTable
      @toDetail="toDetail"
      :headData="headData"
      :rpSpinning="rpSpinning"
      :searchParamsArray="searchParams"
      :loadData="loadData"
      :isFinanceTable="false"
      :exportUrl="'/finspending/capitalDaily/operatingExpenseFlowStatisticsSplitByExportExcel'"
    ></ReportTable>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import {
  listServicePer
} from '@/api/table/table'
import Vue from 'vue'
export default {
  name: 'servicerPerformanceDetails',
  data() {
    return {
      isSchoolIds: false,
      flag: false,
      typeList: ['A', 'B', 'C', 'D'],
      type: 'A', //经营费用类型
      level: 'B', //组织层级
      feeType: 'A', //归类层级
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
      searchParams: [],
      queryParam: { },
      //表格是否加载
      rpSpinning: false
    }
  },
  components: {
    ReportTable
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name === 'servicerPerformanceDetails') {
          let { type } = this.$route.params
          this.type = type
          this.initSearchParams()
          // this.columns = this.columnList.filter(item => item.type.includes(route.params.type))[0].columns
            this.init()
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
  },
  methods: {
    initSearchParams() {
      let {  endDate, startDate,id } = this.$route.query
      if(endDate&& startDate){
        this.queryParam.startDate = startDate
        this.queryParam.endDate = endDate
      }
      if(id){
        this.queryParam.deptId = id
      }
      this.$forceUpdate()
      // this._refreshTable()
    },
    async init() {
      this.rpSpinning = true
      let request = listServicePer
      let queryParam = this.queryParam
      let res = await request(queryParam)
        this.getListRandom(res)
    },
    getListRandom(res) {
      console.log(1111,res)
      //初始化表头
      this.headData[0].data = [
        {
          label: '地区',
          rowspan: 1,
          colspan: 1,
          style: 'min-width: 120px;',
          isClick: false
        },
        {
          label: '业绩分馆/客服',
          rowspan: 1,
          colspan: 1,
          style: 'min-width: 120px;',
          isClick: false
        }
      ]
      let organizeIndex = this.getIndex(this.level, this.typeList) + 1
      let headers = []
      if (res.data.length > 0) {
        headers = Object.keys(res.data[0].total)
      }
      console.log(8888,headers)
      let rows = res.data || []
      // let count = res.data || []
      let loadData = []
      let totalCount = Number(res.data.count) || 0
      // let itemParentName = ''
      // res.data.itemParentName || []
      //左下角总计
      let total = [
        {
          key: '总计',
          label: '总计',
          rowspan: 1,
          colspan: 1,
          style: '',
          isClick: false,
          type: 'colTotal',
          id: '',
          deptId: '',
        }
      ]
      if (res.data && Array.isArray(headers) && headers.length > 0) {
        headers.forEach((item, index) => {
          //获取表头
          this.headData[0].data.push({
            label: item,
            rowspan: 1,
            colspan: 1,
            style: 'min-width: 120px;font-weight:400;',
            isClick: false,
            id: '',
            costClassify: item,
            type: 'row'
          })
          //获取总计
          // if (res.data.count)
          //   total.push({
          //     key: item,
          //     label: count[item] || 0,
          //     rowspan: 1,
          //     colspan: 1,
          //     style: 'color:#1BA97B;cursor:pointer;',
          //     isClick: false
          //   })
        })
      }
      //右上角总计
      // this.headData[0].data.push({
      //   label: '合计',
      //   rowspan: 1,
      //   colspan: 1,
      //   style: 'min-width: 120px;font-weight:400;',
      //   isClick: false,
      //   type: 'rowTotal',
      //   id: '',
      //   costClassify: '',
      // })
      //获取表内容
      if (res.data && Array.isArray(rows) && rows.length > 0) {
        rows.forEach(item => {
          console.log(1111,item)
          if(item.list){
            item.list.forEach((col,colIndex)=>{
              let data = []
              data.push({
                key: '地区',
                label: item.name,
                rowspan: 1,
                colspan: 1,
                style: '',
                isClick: false,
                id: item.deptChildrenId,
                deptId: item.deptId,
                type: 'col'
              })
            })
          }

          // headers.forEach((col, colIndex) => {
          //   data.push({
          //     key: item.data[col],
          //     label: item.data[col],
          //     rowspan: 1,
          //     colspan: 1,
          //     style: 'color:#1BA97B;cursor:pointer;',
          //     isClick: false
          //   })
          // })
          // data.push({
          //   key: '总计',
          //   label: item.count,
          //   rowspan: 1,
          //   colspan: 1,
          //   style: 'color:#1BA97B;cursor:pointer;',
          //   isClick: false,
          //   type: 'col'
          // })
          // loadData.push({
          //   style: 'background:#fff;',
          //   data: JSON.parse(JSON.stringify(data))
          // })
        })
      }
      //右下角总计
      // total.push({
      //   key: '总计',
      //   type: 'all',
      //   label: totalCount ? totalCount.toFixed(3) : 0,
      //   rowspan: 1,
      //   colspan: 1,
      //   style: 'color:#1BA97B;cursor:pointer;',
      //   isClick: false,
      //   id: '',
      // })
      // loadData.push({
      //   style: 'background:#fff;',
      //   data: JSON.parse(JSON.stringify(total))
      // })
      this.loadData = JSON.parse(JSON.stringify(loadData))
      this.rpSpinning = false
    },
    getIndex(type, list) {
      let index = list.findIndex(function(val) {
        return val === type
      })
      return index
    },
    toDetail(data) {
      if (data.isClick) {

      }
    },
    toCostPricePrice(record) {
      let { date, finDeptId, feeName, price, splitDate, deptNo, bankId } = record
      // return
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

<style lang="less" scoped></style>
