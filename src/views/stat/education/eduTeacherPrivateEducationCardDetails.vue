<template>
  <div class="student-wrapper">
    <a-card :bordered="false">
      <div class="mt10 mb10">
        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>
      </div>
      <a-spin tip="加载中..." :spinning="spinning">
        <a-table
          ref="table"
          class="mt20"
          bordered
          :pagination="false"
          :data-source="loadData"
          :columns="columns"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
        >
          <span slot="oneMonthNoCourse" slot-scope="text, record">
           <div :style='"padding: 10px 0;"+record.style'> <a :style='record.style?"color:#646566;":""' @click="toDetail(record,'A')">{{text}}</a></div>
          </span>
          <span slot="studentCount" slot-scope="text, record">
            <div :style='"padding: 10px 0;"+record.style'>  <a :style='record.style?"color:#646566;":""' @click="toDetail(record,'B')">{{text}}</a></div>
          </span>
          <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#1ba97b' : undefined }" />
          <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="column_search_wrap">
            <template v-if="column.dataIndex === 'stuCardStatus'">
              <a-checkbox-group
                :value="selectedKeys&&selectedKeys[0]"
                :default-value="queryParams.cardStatus.split(',')"
                @change="e => setSelectedKeys(e&&e.length>0 ? [e] : [])"
              >
                <a-checkbox
                  class="column_search_checkbox"
                  v-for="(option, optioni) in statusOptions"
                  :key="optioni"
                  :value="option.value"
                  :checked="queryParams.cardStatus.includes(option.value)"
                >
                  {{ option.label }}
                </a-checkbox>
              </a-checkbox-group>
            </template>
            <span class="between mt10">
          <a-button type="primary" size="small" @click="() => handleSearch(clearFilters, selectedKeys[0], confirm, column.dataIndex)">
            搜索
          </a-button>
          <a-button size="small" @click="() => handleReset(clearFilters, setSelectedKeys, column.dataIndex)">
            重置
          </a-button>
        </span>
          </div>
        </a-table>
      </a-spin>
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
import { listEduDance } from '@/api/common'
const date = new Date()
import {  privateEduVariousPlacesReportDetails } from '@/api/table/table'
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
const customHeaderCell1 = column => {
  return {
    style: {
      background: '#f7fbff'
    }
  }
}
const customHeaderCell2 = column => {
  return {
    style: {
      background: '#fafafa'
    }
  }
}
const statusOptions = [
  { value: 'A', label: '未使用' },
  { value: 'B', label: '使用中' },
  { value: 'C', label: '停课' },
  { value: 'D', label: '退卡' },
  { value: 'E', label: '结业' }
]
export default {
  name: 'eduTeacherPrivateEducationCard',
  data() {
    const columns = [
      {
        title: '地区',
        dataIndex: 'regionName',
        align: 'center',
        width: 120,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan){
            rowSpan=record.rowSpan>=1?record.rowSpan:0
          }
          if(record.regionName==='合计'){
            colSpan=3
          }
          return {
            children: <span >{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
      },
      {
        title: '上课分馆',
        dataIndex: 'branchName',
        align: 'center',
        width: 150,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan1){
            rowSpan=record.rowSpan1>=1?record.rowSpan1:0
          }
          if(record.regionName==='合计'){
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
        title: '舞种',
        dataIndex: 'danceName',
        width: 120,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1

          if(record.rowSpan2){
            rowSpan=record.rowSpan2>=1?record.rowSpan2:0
          }
          if(record.regionName==='合计'){
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
        title: '学员姓名',
        dataIndex: 'stuName',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan3){
            rowSpan=record.rowSpan3>=1?record.rowSpan3:0
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
        title: '联系方式',
        dataIndex: 'stuPhone',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan3){
            rowSpan=record.rowSpan3>=1?record.rowSpan3:0
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
        title: '学员人群',
        dataIndex: 'stuType',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if(record.rowSpan3){
            rowSpan=record.rowSpan3>=1?record.rowSpan3:0
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
        title: '卡号',
        dataIndex: 'stuCard',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
      },
      {
        title: '卡状态',
        dataIndex: 'stuCardStatus',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        scopedSlots: {
          customRender: 'stuCardStatus',
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon'
        },
      },
      {
        title: '上课导师',
        dataIndex: 'courseTeacher',
        width: 220,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
      },
      {
        title: '班级顾问',
        dataIndex: 'courseAdviser',
        width: 220,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
      },
      {
        title: '开卡时间',
        dataIndex: 'openCardDate',
        width: 220,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
      },
      {
        title: '续卡日期',
        dataIndex: 'renewalDate',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
      },
      {
        title: '报名课时数',
        dataIndex: 'classHour',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
      },
      {
        title: '上个月已上私教节数',
        dataIndex: 'lastMonthClassHour',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
      },
      {
        title: '本月已上私教节数',
        dataIndex: 'thisMonthClassHour',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
      },
      {
        title: '剩余私教节数',
        dataIndex: 'remainClassHour',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
      }
    ]
    return {
      statusOptions,
      spinning: false,
      columns: columns,
      //表内容
      loadData: [],
      loadData1: [],
      //搜索项
      queryParams: {
        cardStatus:''
      },
      //表格是否加载
      rpSpinning: false,
      selectedKeys:[]
    }
  },
  components: {
    ReportTable,
    STable,
    SearchComPro
  },
  created() {
    this.initQuery()
    this.init()
  },
  methods: {
    initQuery(){
      let { type, endDate, startDate ,dance,deptId} = this.$route.params
      this.queryParams={
        cardStatus:'A,B,C',
        type, endDate:endDate==='all'?'':endDate, startDate:startDate==='all'?'':startDate ,danceIds:dance==='all'?'':dance,schoolId:deptId==='all'?'':deptId
      }
    },
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    //导出
    downloadStu() {
      let exportUrl = '/privateEduVariousPlaces/reportDetailsByExport'
      const queryParams = this.queryParams
      const token = Vue.ls.get(ACCESS_TOKEN)
      let fields = [{ name: 'auth_token', value: token }]
      for (let k in queryParams) {
        if (k !== 'page' && k != 'limit' && queryParams[k]) fields.push({ name: k, value: queryParams[k] })
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
    init() {
      this.spinning = true
      let that = this
      Promise.all([privateEduVariousPlacesReportDetails(this.queryParams)]).then(data => {
        data.forEach(res => {
          let loadData = []
          if(Array.isArray(res.data)&&res.data.length>0){
            res.data.forEach((item,idx)=>{
              //地区
              item.rowspan=0
              //地区合并
              item.list.forEach((col)=>{
                col.list.forEach((row)=>{
                  row.userList.forEach((userItem)=>{
                    item.rowspan+=userItem.cardList.length
                  })
                })
              })
              item.list.forEach((col,colIndex)=>{
                //分馆
                item.rowSpan1=0
                //分馆合并
                col.list.forEach((row)=>{
                  row.userList.forEach((userItem)=>{
                    item.rowSpan1+=userItem.cardList.length
                  })
                })
                col.list.forEach((row,rowIndex)=>{
                  //舞种
                  item.rowSpan2=0
                  //舞种合并
                  row.userList.forEach((userItem)=>{
                    item.rowSpan2+=userItem.cardList.length
                  })
                  row.userList.forEach((userItem,userItemIndex)=>{
                    // 学员
                    userItem.cardList.forEach((cardItem,cardItemIndex)=>{
                      //学员卡
                      let rowSpan = colIndex===0&&rowIndex===0&&userItemIndex===0&&cardItemIndex===0?item.rowspan:-1
                      let rowSpan1 = rowIndex===0&&userItemIndex===0&&cardItemIndex===0?item.rowSpan1:-1
                      let rowSpan2 = userItemIndex===0&&cardItemIndex===0?item.rowSpan2:-1
                      let rowSpan3 = cardItemIndex===0?userItem.cardList.length:-1
                      loadData.push(Object.assign(cardItem,{regionName:item.regionName,branchName:col.branchName,danceName:row.danceName,
                        stuName:userItem.stuName,stuPhone:userItem.stuPhone,stuType:userItem.stuType,rowSpan,rowSpan1,rowSpan2,rowSpan3}))
                    })
                  })
                })
              })
              // res.data.list2[index].list.forEach((row,rowIndex)=>{
              //   let rowSpan=rowIndex===0?res.data.list2[index].list.length:-1
              //   loadData.push(Object.assign(row,{regionName:'地区舞种合计',rowSpan,colSpan:2,deptId}))
              // })
              // loadData.push(Object.assign(res.data.list2[index].total,{regionName:'地区合计',isTotal:true,deptId,style:'background:#5bc0de;'}))
            })
          }
          // loadData.push(Object.assign(res.data.total,{regionName:'全国合计',isTotal:true,style:'background:#52a552;'}))
          that.loadData = loadData
        })
        that.spinning = false
      })
    },
    // 搜索
    handleSearch(clearFilters, value, confirm, dataIndex) {
      if (dataIndex === 'stuCardStatus') {
        this.queryParams.cardStatus = value ? value.join(',') : 'A,B,C'
      } else {
        this.queryParams[dataIndex] = value
      }
      Vue.ls.set('STUDENT_INFO_CARD_LIST_PARAM', JSON.stringify(this.queryParams))
      this.clearFilters = clearFilters
      confirm()
      this.init()
    },
    // 重置
    handleReset(clearFilters, setSelectedKeys, dataIndex) {
      if (clearFilters && dataIndex) {
        clearFilters()
        if (dataIndex === 'stuCardStatus') {
          const cardStatus = ['A', 'B', 'C']
          this.queryParams.cardStatus = cardStatus.join(',')
          if (setSelectedKeys) setSelectedKeys([cardStatus])
        } else {
          this.queryParams[dataIndex] = undefined
        }
      } else {
        this.clearFilters ? this.clearFilters() : ''
        this.queryParams = {
          cardStatus: ''
        }
        Vue.ls.remove('STUDENT_INFO_CARD_LIST_PARAM')
      }
      this.init()
    },
  }
}
</script>

<style scoped lang="less">
.column_search_wrap {
  width: 220px;
  padding: 10px;

  .column_search_input {
    display: block;
    width: 100%;
  }

  .column_search_checkbox {
    display: block;
    height: 30px;
    line-height: 30px;
    margin-left: 0;
  }
}
.checkIcon {
  margin-right: 10px;
  font-size: 14px;
  font-weight: 500;
}
.checkIcon.check {
  color: #1ba97b;
  margin-left: 6px;
}
</style>
