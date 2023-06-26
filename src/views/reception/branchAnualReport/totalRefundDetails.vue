<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
    </a-card>
    <a-card :bordered="false">
      <div class="mt10 mb10">
        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>
      </div>
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :rowKey="(record, index) => index"
        :scroll="{ x: true }"
      >
      </s-table>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import ReportTable from '@/components/ReportsTable/ReportsTable.vue'
import { getSchoolList } from '@/api/education/card'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STable } from '@/components'
import { SearchComPro } from '@/components'
import {  totalReturnPriceDetail } from '@/api/finance/finance'
import { listEduDance, treeEduClassType } from '@/api/common'
const date = new Date()
export default {
  name: 'totalRefundDetails',
  data() {
    const columns = [
      {
        title: '地区',
        dataIndex: 'areaName',
        align: 'center',
        width: 100,
        customRender: (text, record, index) => {
          let rowSpan = record.rowSpan
          let colSpan = 1
          return {
            children: <span>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
        fixed: 'left'
      },
      {
        title: '业绩分馆',
        dataIndex: 'deptName',
        width: 100,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = record.rowSpan
          let colSpan = 1
          return {
            children: <span>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
        fixed: 'left'
      },
      {
        title: '学员姓名',
        dataIndex: 'stuName',
        align: 'center',
        width: 150,
      },
      {
        dataIndex: 'stuPhone',
        title: '手机号',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'adviser',
        title: '学员顾问',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'cardNo',
        title: '退卡卡号',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'cardName',
        title: '退卡卡种名称',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'danceName',
        title: '退卡舞种',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'typeName',
        title: '退卡班型',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'activatedDate',
        title: '激活时间',
        width: 180,
        ellipsis: true,
        align: 'center',
        customRender: (text, record, index) => {
          if(text)return text.slice(0,10)
          return ''
        },
      },
      {
        dataIndex: 'teacherName',
        title: '上课老师',
        width: 220,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'adviserPrice',
        title: '退卡业绩金额',
        width: 220,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'paidPrice',
        title: '退卡总实缴金额',
        width: 220,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'totalPrice',
        title: '退卡应缴金额',
        width: 180,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'payOff',
        title: '退卡是否缴清',
        width: 150,
        ellipsis: true,
        align: 'center',
        customRender: (text, record, index) => {
          let flag = text?'是':'否'
          return flag
        },
      },
      {
        dataIndex: 'payDate',
        title: '退卡缴清日期',
        width: 150,
        ellipsis: true,
        align: 'center',
        customRender: (text, record, index) => {
          if(text)return text.slice(0,10)
          return ''
        },
      },
      {
        dataIndex: 'returnDate',
        title: '提交退费日期',
        width: 150,
        ellipsis: true,
        align: 'center',
        customRender: (text, record, index) => {
          if(text)return text.slice(0,10)
          return ''
        },
      },
      {
        dataIndex: 'remitPrice',
        title: '退费打款金额',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'remitDate',
        title: '退卡退费打款日期',
        width: 150,
        ellipsis: true,
        align: 'center',
        customRender: (text, record, index) => {
          if(text)return text.slice(0,10)
          return ''
        },
      },
    ]
    return {
      spinning: false,
      columns: columns,
      loadData: parameter => {
        let {type} = this.$route.query
        if(type)this.queryParam.queryClassType=type
        return totalReturnPriceDetail(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      //搜索项
      searchParams: [
        {
          type: 'select',
          key: 'danceId',
          label:'退卡舞种',
          placeholder: '请选择退卡舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'cascader',
          key: 'classtype',
          label: '退卡班型',
          placeholder: '请选择退卡班型',
          treeOps: {
            api: treeEduClassType,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'activatedState',
          label: '激活状态',
          placeholder: '请选择激活状态',
          staticArr: [
            {
              string: '是',
              value: 'Y'
            },
            {
              string: '否',
              value: 'N'
            }
          ]
        },
        {
          type: 'date',
          key: 'Date',
          label: '第一次签到',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'date',
          key: 'RemitDate',
          label: '退费打款日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'schoolId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
      ],
      queryParam: {
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
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name === 'totalRefundDetails') {
          this.initSearchParams()
          this.$forceUpdate()
          // if (this.$refs.table) this.$refs.table.refresh()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initSearchParams(){
      let { deptId,danceId,type,endDate, startDate} = this.$route.query
      this.queryParam.endRemitDate = endDate
      this.queryParam.startRemitDate = startDate
      this.queryParam.schoolId = deptId
      this.queryParam.danceId = danceId
      if(startDate)this.searchParams[4].defaultVal=[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      if(deptId)this.searchParams[5].defaultVal=deptId.split(',')
      if(danceId) this.searchParams[0].initialValue=danceId
      if(type)this.queryParam.queryClassType=type
    },
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    //导出
    downloadStu() {
      let exportUrl = '/finance/target/totalReturnPriceDetailDown'
      const queryParam = this.queryParam
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
      Promise.all([totalReturnPriceDetail(this.queryParam)]).then(data => {
        data.forEach((res, index) => {
          let columns = {}
          let columnsNow = JSON.parse(JSON.stringify(that.columns))
          columnsNow.forEach(item => {
            if (item.children) {
              item.children.forEach(col => {
                columns[col.dataIndex] = 0
              })
            } else {
              columns[item.dataIndex] = 0
            }
          })
          let loadData = []
          let lengthAll = 0
          let targetPrice = 0
          let targetTotalPrice = 0
          if (Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach((item, index) => {
              item.columns={}
              let length = item.data.length
              lengthAll+=length-2
              item.data.forEach((col, colIndex) => {
                col.sort = colIndex + 1
                col.schoolArea=item.area
                col.isErea= colIndex===0?true:false
                col.rowSpan=colIndex===0?length:0
                item.columns={}
                if(col.schoolName==='合计'||col.schoolName==='平均值'){
                  col.isTotal=true
                }else{
                  targetPrice+=col.targetPrice
                  targetTotalPrice+=col.ach
                  Object.keys(columns).forEach(key => {
                    if (key != 'sort' && key != 'schoolArea' && key != 'schoolName') {
                      let value = item.columns[key]||0
                      item.columns[key] =value +col[key]
                      columns[key]+=col[key]
                    }
                  })
                }
              })
              loadData=[...loadData,...item.data]
            })
          }
          let total = { schoolName: '合计', isTotalAll: true }
          // let average = { schoolName: '平均值', isTotalAll: true }
          Object.keys(columns).forEach(key => {
            if (key != 'sort' && key != 'schoolArea' && key != 'schoolName') {
              total[key] = columns[key].toFixed(2)
              // average[key] = (columns[key] / lengthAll).toFixed(2)
            }
          })
          total.targetRatio=targetPrice===0?0:(targetTotalPrice/targetPrice*100).toFixed(2)
          // average.targetRatio=targetPrice===0?0:(targetTotalPrice/targetPrice/res.data.length*100).toFixed(2)
          loadData.push(total)
          // loadData.push(average)
          that.loadData = loadData
        })
        that.spinning = false
      })
    },
    searchSubmit(data, reset) {
      this.queryParam = data
      if (reset == 'isReset') {
        this.initSearchParams()
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less"></style>
