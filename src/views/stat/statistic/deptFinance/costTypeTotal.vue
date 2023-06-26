<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
    </a-card>
    <a-card :bordered="false">
<!--      <div class="mt10 mb10">-->
<!--        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>-->
<!--      </div>-->
      <a-spin tip="加载中..." :spinning="spinning">
        <a-table
          ref="table"
          class="mt20"
          :pagination="false"
          :data-source="loadData"
          bordered
          :columns="columns"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
        >
          <span slot='serviceAmount' slot-scope="text, record">
               <a href="javascript:;" @click="toDetails(record,'月份合计')" >{{text}}</a>
          </span>
          <span slot='sumAch' slot-scope="text, record">
               <a href="javascript:;" @click="toDetails(record,'本馆支出')" >{{text}}</a>
          </span>
          <span slot='targetRatio' slot-scope="text, record">
               <a href="javascript:;" @click="toDetails(record,'总部分摊')" >{{text}}</a>
          </span>
          <span slot='refundAmount' slot-scope="text, record">
               <a href="javascript:;" @click="toDetails(record,'区域分摊')" >{{text}}</a>
          </span>
          <span slot='validAch' slot-scope="text, record">
               <a href="javascript:;" @click="toDetails(record,'广告费')" >{{text}}</a>
          </span>
        </a-table>
      </a-spin>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { listOrgDept } from '@/api/education/card'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import { getFirstCost } from '@/api/table/table'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
export default {
  name: 'deptFinanceCostTypeTotal',
  data() {
    const columns = [
      {
        title: '地区',
        dataIndex: 'areaName',
        align: 'center',
        customRender: (text, record, index) => {
          let rowSpan = record.rowSpan
          let colSpan = 1

          if(record.isTotalAll||record.isTotal){
            rowSpan=0
            colSpan=0
          }
          return {
            children: <span>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '分摊分馆',
        dataIndex: 'deptName',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '分摊月份',
        dataIndex: 'date',
        align: 'center',
      },
      {
        dataIndex: 'total',
        title: '月份合计',
        ellipsis: true,
        align: 'center',
        scopedSlots: { customRender: 'serviceAmount' }
      },
      {
        dataIndex: 'achievement',
        title: '支出类型',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'deptPrice',
            title: '本馆支出',
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'sumAch' }

          },
          {
            dataIndex: 'head',
            title: '总部分摊',
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'targetRatio' }
          },
          {
            dataIndex: 'area',
            title: '区域分摊',
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'refundAmount' }
          },
          {
            dataIndex: 'advertisement',
            title: '广告费',
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'validAch' }
          }
        ]
      },
    ]
    return {
      spinning: false,
      columns: columns,
      //表内容
      loadData: [],
      loadData1: [],
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Month',
          label: '分摊月份',
          placeholder: '请选择时间',
          format: 'YYYY-MM',
          mode: ['month', 'month']
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'deptId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: listOrgDept,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        }
      ],
      queryParams: {
      },
      //表格是否加载
      rpSpinning: false
    }
  },
  components: {
    ReportTable,
    STable,
    SearchComPro
  },
  created() {
    this.initSearchParams()
    this.initData()
  },
  methods: {
    initSearchParams() {
      let {  endDate, startDate,id } = this.$route.query
      if(endDate&& startDate){
        this.queryParams.startDate = startDate
        this.queryParams.endDate = endDate
        this.searchParams[0].defaultVal=[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      }
      if(id){
        this.queryParams.deptId = id
        this.searchParams[1].defaultVal=id.split(',')
      }
      this.$forceUpdate()
      this._refreshTable()
    },
    toDetails(record,type){
      console.log(record,type)
        let { endDate, startDate } = this.queryParams
        const { href } = this.$router.resolve({
          name: 'deptFinanceCostTypeTotalDetails',
          query: {
            startDate: startDate,
            endDate: endDate,
            id: record.deptId,
            type
          }
        })
        //结合open打开新的页面
        window.open(href, '_blank')
    },
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    //导出
    downloadStu() {
      let exportUrl = '/finance/target/statDataDown'
      const queryParam = this.queryParams
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
    initData() {
      this.spinning = true
      let that = this
      getFirstCost(this.queryParams).then(res => {
        let loadData = []
        if (Array.isArray(res.data) && res.data.length > 0) {
          res.data.forEach((item, index) => {
            item.columns={}
            let length = item.deptSplMapList.length
            let deptId = ''
            item.deptSplMapList.forEach((col, colIndex) => {
              if(col.deptId)deptId+=((deptId?',':'')+col.deptId)
              col.rowSpan=colIndex===0?length:0
              if(col.deptName==="地区合计"){
                col.isTotal=true
                col.deptId=deptId
              }
            })
            loadData=[...loadData,...item.deptSplMapList]
          })
        }
        that.loadData = loadData
        that.spinning = false
      })
    },
    searchSubmit(data, reset) {
      this.queryParams = data
      if(data.startMonth){
        this.queryParams.startDate = data.startMonth+'-01'
        let endDate = moment(data.endMonth,"YYYY-MM")
          .add(1, 'months')
          .date(0)
          .format('YYYY-MM-DD')
        this.queryParams.endDate =endDate
        delete this.queryParams.startMonth
        delete this.queryParams.endMonth
      }
      if (reset == 'isReset') {
        this.initSearchParams()
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.initData()
    }
  }
}
</script>

<style scoped lang="less"></style>
