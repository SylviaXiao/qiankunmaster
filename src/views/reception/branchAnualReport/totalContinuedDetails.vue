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
                  <span slot="cardType" slot-scope="text, record">
            <span>
              {{ getCardType(record) }}
            </span>
          </span>
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
import {  totalRenewPriceDetail } from '@/api/finance/finance'
import { listEduDance, listSysValConf, treeEduClassType } from '@/api/common'
let cardNextTypeList = [
  { string: '本期续卡', value: 'A' },
  { string: '往期续卡', value: 'B' },
  { string: '到期续卡', value: 'C' },
  { string: '未到期续卡', value: 'D' },
  { string: '延期续卡', value: 'E' }
]
const date = new Date()
export default {
  name: 'totalContinuedDetails',
  data() {
    const columns = [
      {
        title: '地区（往期卡）',
        dataIndex: 'areaName',
        align: 'center',
        width: 120,
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
        title: '上课分馆（往期卡）',
        dataIndex: 'deptName',
        width: 120,
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
        dataIndex: 'lastCardNo',
        title: '卡号',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'lastCardName',
        title: '卡种名称',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'lastDanceName',
        title: '卡舞种',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'lastType',
        title: '卡班型',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'lastStatus',
        title: '卡状态',
        width: 180,
        ellipsis: true,
        align: 'center',
        customRender: (text, record, index) => {
          let flag = text==='A'?'未使用':text==='B'?'使用中': text==='C'?'停课': text==='D'?'退卡': text==='E'?'结业': text==='F'?'撤销': text === 'G' ? '结转':''
          return flag
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
        dataIndex: 'signTeacherName',
        title: '签到老师',
        width: 220,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'renewDate',
        title: '续卡日期',
        width: 220,
        ellipsis: true,
        align: 'center',
        customRender: (text, record, index) => {
          if(text)return text.slice(0,10)
          return ''
        },
      },
      {
        dataIndex: 'newCardNo',
        title: '续卡卡号',
        width: 180,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'newCardName',
        title: '续卡卡种名称',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'newType',
        title: '续卡班型',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'newDanceName',
        title: '续卡舞种',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'newCrowdType',
        title: '续卡人群',
        width: 150,
        ellipsis: true,
        align: 'center',
        customRender: (text, record, index) => {
          let flag = text==='A'?'成人':text==='B'?'少儿':''
          return flag
        },
      },
      {
        dataIndex: 'newCardType',
        title: '续卡类型',
        width: 150,
        ellipsis: true,
        align: 'center',
        scopedSlots: { customRender: 'cardType' }
      },

      {
        dataIndex: 'newStatus',
        title: '续卡状态',
        width: 180,
        ellipsis: true,
        align: 'center',
        customRender: (text, record, index) => {
          let flag = text==='A'?'未使用':text==='B'?'使用中': text==='C'?'停课': text==='D'?'退卡': text==='E'?'结业': text==='F'?'撤销': text === 'G' ? '结转':''
          return flag
        },
      },
      {
        dataIndex: 'newNum',
        title: '续卡个数',
        width: 220,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'newPrice',
        title: '续卡实缴金额',
        width: 220,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'newSumPrice',
        title: '续卡总实缴金额',
        width: 220,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'newTotalPrice',
        title: '续卡应缴金额',
        width: 180,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'newPayOff',
        title: '续卡是否缴清',
        width: 150,
        ellipsis: true,
        align: 'center',
        customRender: (text, record, index) => {
          let flag = text===true?'缴清':text===false?'未缴清':''
          return flag
        },
      },
      {
        dataIndex: 'newPayDate',
        title: '续卡缴清日期',
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
        title: '续卡提交退费日期',
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
        title: '续卡退费打款金额',
        width: 150,
        ellipsis: true,
        align: 'center',
      },
      {
        dataIndex: 'remitDate',
        title: '续卡退费打款日期',
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
        return totalRenewPriceDetail(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      //搜索项
      searchParams: [
        {
          type: 'select',
          key: 'lastdanceId',
          noRepeat:true,
          label: '往期卡舞种',
          placeholder: '请选择往期卡舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'lastclasstype',
          label: '往期卡班型',
          placeholder: '请选择往期卡班型',
          apiOption: {
            api: treeEduClassType,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'laststatus',
          label: '往期卡状态',
          placeholder: '请选择往期卡状态',
          staticArr: [
            {
              string: '未使用',
              value: 'A'
            },
            {
              string: '使用中',
              value: 'B'
            },
            {
              string: '停课',
              value: 'C'
            },
            {
              string: '退卡',
              value: 'D'
            },
            {
              string: '结业',
              value: 'E'
            },
            {
              string: '撤销',
              value: 'F'
            },
            {
              string: '结转',
              value: 'G'
            }
          ]
        },
        {
          type: 'date',
          key: 'lastDate',
          label: '往期卡第一次签到',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'date',
          key: 'RemitDate',
          label: '续卡日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          customRender: (text, record, index) => {
            if(text)return text.slice(0,10)
            return ''
          },
        },
        {
          type: 'select',
          key: 'newdanceId',
          label: '续卡舞种',
          placeholder: '请选择续卡舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'newclasstype',
          label: '续卡班型',
          placeholder: '请选择续卡班型',
          apiOption: {
            api: treeEduClassType,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'newstatus',
          label: '本期卡状态',
          placeholder: '请选择本期卡状态',
          staticArr: [
            {
              string: '未使用',
              value: 'A'
            },
            {
              string: '使用中',
              value: 'B'
            },
            {
              string: '停课',
              value: 'C'
            },
            {
              string: '退卡',
              value: 'D'
            },
            {
              string: '结业',
              value: 'E'
            },
            {
              string: '撤销',
              value: 'F'
            },
            {
              string: '结转',
              value: 'G'
            }
          ]
        },
        {
          type: 'date',
          key: 'ReturnDate',
          label: '续卡退费日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          customRender: (text, record, index) => {
            if(text)return text.slice(0,10)
            return ''
          },
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
        {
          type: 'date',
          key: 'Date',
          label: '实缴日期',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          customRender: (text, record, index) => {
            if(text)return text.slice(0,10)
            return ''
          },
        },
      ],
      queryParam: {
      },
      //表格是否加载
      rpSpinning: false,
      cardNextList:[]
    }
  },
  components: {
    ReportTable,
    STable,
    SearchComPro
  },
  created() {
    this.initSearchParams()
    this.getCardNextList()
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.name === 'totalContinuedDetails') {
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
    getCardNextList() {
      listSysValConf('cardNext').then(res => {
        if (res.data) {
          let arr = this._handleTreeData(res.data, { label: 'name', value: 'id', children: 'children' })
          this.cardNextList = cardNextTypeList.concat(arr)
        } else {
          this.cardNextList = cardNextTypeList
        }
        this.$forceUpdate()
        this.showSearch = true
      })
    },
    getCardType(record) {
      if (record.newCardType) {
        let name = ''
        name = this.cardNextList.filter(item => item.value == record.newCardType)[0].string
        return name
      } else {
        return ''
      }
    },
    _handleTreeData(data, itemObj) {
      let { label, value, children } = itemObj
      return data.map((item, index) => {
        let temObj = {}
        temObj.string = item[label]
        temObj.value = item[value]
        if (item[children]) {
          temObj.children = this._handleTreeData(item.children, itemObj)
        }
        return temObj
      })
    },
    initSearchParams(){
      let { deptId,danceId,type,endDate, startDate} = this.$route.query
      this.queryParam.endDate = endDate
      this.queryParam.startDate = startDate
      this.queryParam.schoolId = deptId
      this.queryParam.lastdanceId = danceId
      if(startDate)this.searchParams[10].defaultVal=[moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]
      if(deptId)this.searchParams[9].defaultVal=deptId.split(',')
      if(danceId) this.searchParams[0].initialValue=danceId
      console.log(999,danceId)
      if(type)this.queryParam.queryClassType=type
    },
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    //导出
    downloadStu() {
      let exportUrl = '/finance/target/totalRenewPriceDetailDown'
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
