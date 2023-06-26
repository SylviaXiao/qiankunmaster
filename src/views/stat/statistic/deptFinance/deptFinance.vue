<template>
  <div>
    <a-card style="margin: 20px 0;">
      <search-com-pro ref="searchForm" :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit" />
    </a-card>
    <a-card>
      <div class="mt10 mb10">
        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>
      </div>
      <a-table
        ref="table"
        :columns="columns"
        :dataSource="dataSource"
        :scroll="{ x: 1000 }"
        :loading="loading"
        bordered
        :rowKey="(record, index) => index"
        :pagination="false"
      >
        <span slot="regionNameTitle">
          <div>类别</div>
          <a class="py-16" @click="changeRegionNameFold">{{ regionName }}</a>
        </span>
        <span slot="branchNameTitle">
          <div>公司/地区/部门</div>
          <a class="py-16" @click="changeBranchNameFold">{{ branchName }}</a>
        </span>
        <span slot="branchDeptNameTitle">
          <div>分馆/区域部门</div>
          <a class="py-16" @click="changeDeptNameFold">{{ deptName }}</a>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { SearchComPro } from '@/components'
import { getBalance } from '@/api/stat'
import {  listOrgDept } from '@/api/education/card'
import { listDeptFinReport } from '@/api/table/table'
import {deptFinReportListOrgDept} from '@/api/common'
import moment from 'moment'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
const date = new Date()
const defaultStart = moment(date)
  .startOf('month')
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')

const noPaddingCell = (record, rowIndex) => {
  return {
    style: {
      padding: '0px!important'
    }
  }
}

const noPaddingBoldCell = (record, rowIndex) => {
  let cell = noPaddingCell(record, rowIndex)
  cell.style.fontWeight = 'bold'
  return cell
}

export default {
  name: 'balanceSheet',
  components: {
    SearchComPro
  },
  data() {
    return {
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
            api: deptFinReportListOrgDept,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        }
      ],
      queryParams: {
        startDate: defaultStart,
        endDate: defaultEnd
      },
      columns: [
        {
          align: 'center',
          width: 80,
          fixed: 'left',
          ellipsis: true,
          dataIndex: 'deptName',
          customCell: noPaddingCell,
          scopedSlots: {
            title: 'regionNameTitle'
          },
          customRender: (text, record, index) => {
            let rowSpan = 1
            let colSpan = 1
            let style = 'display:block;padding: 10px 0;'
            if(record.rowSpan){
              rowSpan=record.rowSpan>=1?record.rowSpan:0
            }
            if(!this.branchNameOpen&&this.branchOpens[record.colIndex]&&record.isTotal1){
              colSpan=0
            }
            if(record.isTotal){
              colSpan=3
            }
            if(record.style){
              style+='background:#52a552;color:#000;'
            }
            return {
              children: <span style={style}>{text}</span>,
              attrs: {
                colSpan: colSpan,
                rowSpan:rowSpan
              }
            }
          }
        },
        {
          // title: '分馆',
          align: 'center',
          width: 100,
          fixed: 'left',
          ellipsis: true,
          dataIndex: 'deptName1',
          customCell: noPaddingCell,
          scopedSlots: {
            title: 'branchNameTitle'
          },
          customRender: (text, record, index) => {
            let rowSpan = 1
            let colSpan = 1
            if(record.rowSpan1){
              rowSpan=record.rowSpan1>=1?record.rowSpan1:0
            }
            if(record.colSpan||record.isTotal){
              colSpan=0
            }
            if(record.isTotal1&&this.branchOpens[record.colIndex]){
              colSpan=2
            }
            let children =  <span>{text}</span>
            if(!this.branchOpens[record.colIndex]){
              children = (
                (<a onClick={() => this.changeBranchRowFold(record.colIndex, 'open')}>
                  {'展开全部'}
                  <a-icon className='ml-8' type='menu-unfold' />
                </a>)
              )
            }
            if(this.branchOpens[record.colIndex]&&record.isTotal1){
              children = (
                <div  class="table-cell-y text-weight-b background-grey">
                  {'小计'}
                  <a class='ml10' onClick={() => this.changeBranchRowFold(record.colIndex, 'close')}>
                  {'收起'}
                </a>
                </div>)
            }
            return {
              children:children,
              attrs: {
                colSpan: colSpan,
                rowSpan:rowSpan
              }
            }
          }
        },
        {
          align: 'center',
          width: 300,
          fixed: 'left',
          ellipsis: true,
          dataIndex: 'deptName2',
          customCell: noPaddingCell,
          scopedSlots: {
            title: 'branchDeptNameTitle'
          },
          customRender: (text, record, index) => {
            let rowSpan = 1
            let colSpan = 1
            if(record.isTotal||(record.isTotal1&&this.branchOpens[record.colIndex])){
              colSpan=0
            }
            let children =  <span>{text}</span>
            if(!(this.depthOpens[record.colIndex]&&this.depthOpens[record.colIndex][record.rowIndex])){
              children =
                (<div>
                  <a onClick={() => this.changeDeptRowFold(record.colIndex, 'open',record.rowIndex)}>
                    {'展开全部'}
                    <a-icon className='ml-8' type='menu-unfold' />
                  </a>
                </div>)
            }
            if(!this.branchOpens[record.colIndex]){
              children =
                (<div>
                  <a onClick={() => this.changeDeptRowFold(record.colIndex, 'open','all')}>
                    {'展开全部'}
                    <a-icon className='ml-8' type='menu-unfold' />
                  </a>
                </div>)
            }
            if(this.depthOpens[record.colIndex]&&this.depthOpens[record.colIndex][record.rowIndex]&&record.isTotal2){
              children = (
                <div  class="table-cell-y text-weight-b background-grey">
                  {'小计'}
                  <a class='ml10' onClick={() => this.changeDeptRowFold(record.colIndex, 'close',record.rowIndex)}>
                    {'收起'}
                  </a>
                </div>)
            }
            return {
              children:children,
              attrs: {
                colSpan: colSpan,
                rowSpan:rowSpan
              }
            }
          }
        },
        {
          title: '业绩模块',
          children: [
            {
              title: '顾问业绩（唯一）',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'adviserPerformance',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('adviserPerformance', record, index)
              }
            },
            {
              title: '导师业绩（唯一）',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'teacherPerformance',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('teacherPerformance', record, index)
              }
            },
            {
              title: '总业绩',
              align: 'center',
              width: 140,
              customCell: noPaddingBoldCell,
              dataIndex: 'totalPerformance',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('totalPerformance', record, index)
              }
            },
            {
              title: '客服业绩（重复）',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'servicePerformance',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('servicePerformance', record, index)
              }
            },
            {
              title: '导师业绩（重复）',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'teacherRepeat',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('teacherRepeat', record, index)
              }
            },
            {
              title: '其他收入',
              align: 'center',
              width: 140,
              customCell: noPaddingBoldCell,
              dataIndex: 'shopItemPrice',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('shopItemPrice', record, index)
              }
            }
          ]
        },
        {
          title: '利润模块',
          children: [
            {
              title: '总收入',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'totalRevenue',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('totalRevenue', record, index)
              }
            },
            {
              title: '成本费用',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'costPrice',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('costPrice', record, index)
              }
            },
            {
              title: '总部分摊',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'head',
            },
            {
              title: '区域分摊',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'area',
            },
            {
              title: '广告费',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'advertisement',
            },
            {
              title: '分馆总退费',
              align: 'center',
              width: 140,
              customCell: noPaddingBoldCell,
              dataIndex: 'deptTotalRefund',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('deptTotalRefund', record, index)
              }
            },
            {
              title: '毛利润',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'grossProfit',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('grossProfit', record, index)
              }
            },
          ]
        },
        {
          title: '流水收支',
          children: [
            {
              title: '总收款',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'totalReceipts',
              customRender: (value, record, index) => {
                return value
                // return this.getDataRowCustomRender('totalReceipts', record, index)
              }
            },
            {
              title: '报销提交',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'reimburseSub',
              // customRender: (value, record, index) => {
              //   return this.getDataRowCustomRender('reimburseSub', record, index)
              // }
            },
            {
              title: '报销支付',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'reimbursePay',
              // customRender: (value, record, index) => {
              //   return this.getDataRowCustomRender('reimbursePay', record, index)
              // }
            },
            {
              title: '退费提交',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'refundSub',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('refundSub', record, index)
              }
            },
            {
              title: '退费支付',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              dataIndex: 'refundPay',
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('refundPay', record, index)
              }
            },
          ]
        },
      ],
      list: [],
      loading: false,
      regionNameOpen: false,
      branchNameOpen: false,
      deptNameOpen:false,
      branchOpens: [],
      depthOpens:[],
      // dataSource:[]
    }
  },
  computed: {
    dataSource() {
      let dataList = JSON.parse(JSON.stringify(this.list))
      let dataSource=[]
      if (dataList.length > 0) {
        if (this.regionNameOpen){
          // if(this.deptNameOpen){
            //三级展开
            dataList.forEach((item,idx)=>{
              let index = idx
              // let deptId = []
              item.rowspan=1
              if(item.list) {
                if(this.branchOpens[index]){
                  item.list.forEach((col, colIndex) => {
                    if(this.depthOpens&&this.depthOpens[index]&&this.depthOpens[index][colIndex]){
                      item.rowspan += col.list.length+1
                    }else{
                      item.rowspan += 1
                    }
                  })
                  item.list.forEach((col, colIndex) => {
                    if(this.deptNameOpen||this.depthOpens&&this.depthOpens[index]&&this.depthOpens[index][colIndex]){
                      if(this.depthOpens[index]&&this.depthOpens[index][colIndex]){
                        col.list.forEach((row, rowIndex) => {
                          let rowSpan = colIndex === 0 && rowIndex === 0 ? item.rowspan : -1
                          let rowSpan1 = rowIndex === 0 ? col.list.length+1 : -1
                          dataSource.push(Object.assign(row,row.count, { deptName: item.deptName, deptName1: col.deptName, deptName2: row.deptName, rowSpan, rowSpan1,colIndex:index,rowIndex:colIndex }))
                        })
                      }
                    }
                    let rowspan11 = colIndex === 0?item.rowspan:(-1)
                    let rowspan22 = 1
                    if(this.depthOpens[index]&&this.depthOpens[index][colIndex]){
                      rowspan11=-1
                      rowspan22=-1
                    }
                    let datas = Object.assign(col.count,{deptName:item.deptName,deptName1:col.deptName,deptId:col.deptId,rowSpan1:rowspan22,rowSpan: rowspan11,isTotal2:true,deptName2:'小计',colIndex:index,rowIndex:colIndex})
                    dataSource.push(datas)
                  })
                }
              }
              let rows = Object.assign(item.count,{deptName :item.deptName,deptId:item.deptId,colIndex:index,rowSpan:1,rowSpan1:1})
              if(index===dataList.length-1){
                rows.isTotal=true
                rows.deptName='合计'
              }else{
                rows.isTotal1=true
                rows.deptName1='总计'
                if(this.branchNameOpen){
                  rows.rowSpan=this.branchOpens[index]?-1:1
                }
              }
              dataSource.push(rows)
            })
          // dataSource.forEach((item,idnex)=>{
          //   console.log('index',idnex+1,item.rowSpan,item.rowSpan1)
          // })
          // console.log(0,'dataSource',dataSource)
          // }
          // else if(this.branchNameOpen){
          //   //二级展开
          //   dataList.forEach((item,index)=>{
          //     item.rowspan=1
          //     if(item.list){
          //       item.rowspan=item.list.length+1
          //       item.list.forEach((col,colIndex)=>{
          //         let rowSpan = colIndex === 0 ? item.rowspan : -1
          //         let row = Object.assign(col.count,{deptName:item.deptName,deptName1:col.deptName,deptId:col.deptId,rowSpan:rowSpan,rowSpan1:1,colIndex:index,rowIndex:colIndex})
          //         dataSource.push(row)
          //       })
          //     }
          //     let rows = Object.assign(item.count,{deptName:item.deptName,deptId:item.deptId,rowSpan:1,rowSpan1:1,isTotal1:true,deptName1:'全部',colIndex:index})
          //     if(index===dataList.length-1){
          //       rows.isTotal=true
          //       rows.rowSpan1=-1
          //     }
          //     dataSource.push(rows)
          //   })
          // }
          // else{
          //   //一级展开
          //   dataList.forEach((item,index)=>{
          //     let row = Object.assign(item.count,{deptId:item.deptId,rowSpan:1,rowSpan1:1,deptName1:'',deptName:item.deptName,colIndex:index})
          //     if(index===dataList.length-1)row.isTotal=true
          //     dataSource.push(row)
          //   })
          // }
          // this.dataSource =dataSource
        }
        else{
          let row = dataList.slice(-1)[0]
          let list=Object.assign(row.count,{deptName:row.deptName},{deptId:row.deptId},{isTotal:true})
          dataSource = [
            list
          ]
        }
      }
      return dataSource
    },
    regionName() {
      return this.regionNameOpen ? '收起' : '展开全部'
    },
    branchName() {
      return this.branchNameOpen ? '收起' : '展开全部'
    },
    deptName() {
      return this.deptNameOpen ? '收起' : '展开全部'
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/finance/salarycheck/downDeptFinReport'
      const queryParam = this.queryParams
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParam) {
        if (k !== 'page' && k !== 'limit' && queryParam[k]) fields.push({ name: k, value: queryParam[k] })
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
    async loadData() {
      this.loading = true
      try {
        let res = await listDeptFinReport(this.queryParams)
        this.list = res.data
        this.initData()
      } finally {
        this.loading = false
      }
    },
    initData(){

    },
    searchSubmit(e, type) {
      if (type == 'isReset') {
        this.queryParams = {
          startDate: defaultStart,
          endDate: defaultEnd
        }
      } else {
        this.queryParams = e
      }
      this.loadData()
    },
    changeRegionNameFold() {
      this.branchOpens = []
      this.depthOpens=[]
      this.regionNameOpen = !this.regionNameOpen
      this.branchNameOpen = false
      this.deptNameOpen=false
      this.initData()
    },
    changeBranchNameFold() {
      this.branchOpens = []
      this.depthOpens=[]
      if (!this.branchNameOpen) {
        for (const index in this.list) {
          // this.branchOpens[index] = true
          // this.depthOpens[index] = []
          this.$set(this.branchOpens, index, true)
          this.$set(this.depthOpens, index, [])
        }
      }
      this.regionNameOpen = true
      this.branchNameOpen = !this.branchNameOpen
      this.deptNameOpen=false

      this.initData()
    },
    changeDeptNameFold() {
      for (const index in this.list) {
        this.$set(this.branchOpens, index, true)
        this.$set(this.depthOpens, index, [])
      }
      if (!this.deptNameOpen) {
        this.list.forEach((item,index)=>{
          if(item.list){
            item.list.forEach((col,colIndex)=>{
              this.$set(this.depthOpens[index], colIndex, true)
            })
          }
        })
      }
      this.branchNameOpen = true
      this.regionNameOpen = true
      this.deptNameOpen = !this.deptNameOpen
      this.$forceUpdate()
    },
    changeBranchRowFold(index, action = 'open') {
      this.$set(this.branchOpens, index, action === 'open')
      this.$forceUpdate()
    },
    changeDeptRowFold(index, action = 'open',indexRow) {
      if (this.depthOpens.length<=0) {
        for (const index in this.list) {
          this.$set(this.depthOpens, index, [])
        }
      }
      if(indexRow==='all'){
        if(action === 'open')this.$set(this.branchOpens, index, action === 'open')
        this.list[index].list.forEach((item,idx)=>{
          this.$set(this.depthOpens[index], idx, action === 'open')
        })
      }else{
        this.$set(this.depthOpens[index], indexRow, action === 'open')
      }
      this.$forceUpdate()
    },
    isLastTotalRow(index) {
      // 非展开的情况下
      let cond1 = !this.regionNameOpen && index == 0
      // 展开的情况下最后一行
      let cond2 = this.regionNameOpen && this.list?.length - 1 == index
      return this.list?.length > 0 && (cond1 || cond2)
    },
    toDetail(data,key) {
      console.log(1,key,data.deptId)
      // if (data.isClick) {
        let { endDate, startDate, schoolIds } = this.queryParams
        let id = data.deptId?data.deptId.join(',') : schoolIds
        if(key==='costPrice'){
          const { href } = this.$router.resolve({
            name: 'deptFinanceCostTypeTotalDetails',
            query: {
              startDate: startDate,
              endDate: endDate,
              id: id,
              type:key
            }
          })
          //结合open打开新的页面
          window.open(href, '_blank')
        }else{
          this.$router.push({
            name: 'deptFinanceDetails',
            params: { type: key},
            query: {
              id: id, startDate: startDate, endDate: endDate
            }
          })
        }
    },
    getDataRowCustomRender(dataIndex, record, index) {
      let arr = ['totalRevenue','grossProfit']
      const obj = {
        children: (
            <div class="table-cell-y">
              {this.getCurrencyString(record[dataIndex])}
            </div>
        ),
        attrs: {}
      }
      if(!arr.includes(dataIndex)){
        obj.children= (
          <div class="table-cell-y">
            <a className='ml10' onClick={() => this.toDetail(record, dataIndex)}>{this.getCurrencyString(record[dataIndex])}</a>
          </div>
        )
      }
      return obj
      //展开三级
      if(this.deptNameOpen){
        if(!record.list){
          return obj
        }
        obj.children = (
          <div>
            {record.list.map(item => {
              return (
                (item.list.map(col => {
                 return (col.list.map(row => {
                   return <div class="table-cell-y">{row[dataIndex]}</div>
                 }))
               }))
                // (<div className='table-cell-y background-grey'>{this.getCurrencyString(item.count[dataIndex])}</div>)
              )
            })}
            {<div class="table-cell-y background-grey">{this.getCurrencyString(record.count[dataIndex])}</div>}
          </div>
        )
        return obj
      }
      if (this.isLastTotalRow(index) && this.branchNameOpen) {
      } else if (this.branchOpens[index]) {
        obj.children = (
          <div>
            {record.list.map(item => {
              return <div class="table-cell-y">{this.getCurrencyString(item.count[dataIndex])}</div>
            })}
            {<div class="table-cell-y background-grey">{this.getCurrencyString(record.count[dataIndex])}</div>}
          </div>
        )
      }
      return obj
    },
    getCurrencyString(val) {
      let result = Number(val).toFixed(2).toLocaleString()
      return result
    }
  }
}
</script>

<style lang="less" scoped>
.table-cell-y {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 400;
  height: 48px;
}
.pointer{
  cursor:pointer;
}
.table-cell-r {
  justify-content: flex-end;
}
.table-cell-l {
  justify-content: flex-start;
}
div .table-cell-y:last-child {
  border-bottom: 0px;
}

.background-grey {
  background: #e5e5e5;
}
</style>
