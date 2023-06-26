<template>
  <div class="student-wrapper">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams" />
    </a-card>

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
            <div :style="'padding: 10px 0;' + record.style">
              <a :style="record.style ? 'color:#646566;' : ''" @click="toDetail(record, 'Y')">{{ record.total?record.total.entryNumber:"" }}</a>
            </div>
          </span>
          <span slot="studentCount" slot-scope="text, record">
            <div :style="'padding: 10px 0;' + record.style">
              <a :style="record.style ? 'color:#646566;' : ''" @click="toDetail(record, 'N')">{{ record.total? record.total.leaveNumber:'' }}</a>
            </div>
          </span>
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
import { listEduDance, treeEduClassType } from '@/api/common'
const date = new Date()
import { onMonthlyManpowerReport } from '@/api/table/table'
import { merge } from 'lodash'
const customHeaderCell1 = (column) => {
  return {
    style: {
      background: '#f7fbff',
    },
  }
}
const customHeaderCell2 = (column) => {
  return {
    style: {
      background: '#fafafa',
    },
  }
}
const defaultStart = moment().date(1).format('YYYY-MM-DD')
const defaultEnd = moment().format('YYYY-MM-DD')
export default {
  name: 'monthPeopleStatistic',
  data() {
    const columns = [
      {
        title: '地区',
        dataIndex: 'branchName',
        align: 'center',
        width: 120,
        customRender: (text, record, index) => {
          let rowSpan = record.rowSpan
          let colSpan = 1
          if (text==='合计') {
            colSpan = 0
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
          let children = <span >{text}</span>
          if(text==='合计'||text==='汇总'){
            children= <span style='color:red'>{text}</span>
          }
          if (text==='合计') {
            colSpan = 2
          }
          return {
            children: children,
            attrs: {
              colSpan: colSpan,
              rowSpan: rowSpan,
            },
          }
        },
      },
      {
        dataIndex: 'fullTimeTeacher',
        title: '全职老师',
        ellipsis: true,
        align: 'center',
        children: [
          {
            title: '可用人数',
            dataIndex: 'fullTimeMap.number',
            align: 'center',
            width: 150,
            customRender: (text, record, index) => {
              return record.fullTimeMap?.number
            },
          },
          {
            title: '上课人数',
            dataIndex: 'fullTimeMap.attendanceNumber',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            customRender: (text, record, index) => {
              return record.fullTimeMap?.attendanceNumber
            },
          },
          {
            title: '签到小时数',
            dataIndex: 'fullTimeMap.signClassHours',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            customRender: (text, record, index) => {
              return record.fullTimeMap?.signClassHours
            },
          },
          {
            title: '人均排课（小时）',
            dataIndex: 'fullTimeMap.avgArrangement',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            customRender: (text, record, index) => {
              return record.fullTimeMap?.avgArrangement
            },
          },
        ],
      },
      {
        dataIndex: 'reserveAFullTime',
        title: '储备全职',
        ellipsis: true,
        align: 'center',
        children: [
          {
            title: '可用人数',
            dataIndex: 'reserveMap.number',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            customRender: (text, record, index) => {
              return record.reserveMap?.number
            },
          },
          {
            title: '上课人数',
            dataIndex: 'reserveMap.attendanceNumber',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            customRender: (text, record, index) => {
              return record.reserveMap?.attendanceNumber
            },
          },
          {
            title: '签到小时数',
            dataIndex: 'reserveMap.signClassHours',
            width: 220,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            customRender: (text, record, index) => {
              return record.reserveMap?.signClassHours
            },
          },
          {
            title: '人均排课（小时）',
            dataIndex: 'reserveMap.avgArrangement',
            width: 220,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            customRender: (text, record, index) => {
              return record.reserveMap?.avgArrangement
            },
          },
        ],
      },
      {
        dataIndex: 'partTimeTeacher',
        title: '兼职老师',
        ellipsis: true,
        align: 'center',
        children: [
          {
            title: '可用人数',
            dataIndex: 'partTimeMap9',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            customRender: (text, record, index) => {
              return record.partTimeMap?.number
            },
          },
          {
            title: '上课人数',
            dataIndex: 'partTimeMap10',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            customRender: (text, record, index) => {
              return record.partTimeMap?.attendanceNumber
            },
          },
          {
            title: '签到小时数',
            dataIndex: 'partTimeMap11',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            customRender: (text, record, index) => {
              return record.partTimeMap?.signClassHours
            },
          },
          {
            title: '人均排课（小时）',
            dataIndex: 'partTimeMap12',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            customRender: (text, record, index) => {
              return record.partTimeMap?.avgArrangement
            },
          },
        ],
      },
      {
        dataIndex: 'fullData',
        title: '总体数据',
        ellipsis: true,
        align: 'center',
        children: [
          {
            title: '可用人数总数',
            dataIndex: 'partTimeMap13',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            customRender: (text, record, index) => {
              return record.total?.allNumber
            },
          },
          {
            title: '上课老师总数',
            dataIndex: 'partTimeMap14',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            customRender: (text, record, index) => {
              return record.total?.skNumber
            },
          },
          {
            title: '全职老师占比',
            dataIndex: 'partTimeMap15',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            customRender: (text, record, index) => {
              return record.total?.fullTimeRadio
            },
          },
          {
            title: '（全职+储备全职）占比',
            dataIndex: 'partTimeMap16',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            customRender: (text, record, index) => {
              return record.total?.fullTimeReserveRadio
            },
          },
          {
            title: '入职人数',
            dataIndex: 'partTimeMap17',
            width: 180,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'oneMonthNoCourse' },
            customHeaderCell: customHeaderCell2,
            // customRender: (text, record, index) => {
            //   return record.total?.entryNumber
            // },
          },
          {
            title: '离职人数',
            dataIndex: 'partTimeMap18',
            width: 150,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'studentCount' },
            customHeaderCell: customHeaderCell2,
            // customRender: (text, record, index) => {
            //   return record.total?.leaveNumber
            // },
          },
        ],
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
          key: 'Date',
          label: '时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          isDate: true,
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
        },
        {
          type: 'treeSelect',
          isShow: true,
          key: 'school_id',
          label: '地区',
          placeholder: '请选择地区',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          show: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
          },
        },
        {
          type: 'cascader',
          key: 'classTypeId',
          label: '签到班型',
          show: true,
          placeholder: '请选择班型',
          treeOps: {
            api: treeEduClassType,
            // type: 'D',
            label: 'name',
            value: 'id',
            children: 'children',
          },
        },
      ],
      queryParams: {
        startDate: defaultStart,
        endDate: defaultEnd,
      },
      //表格是否加载
      rpSpinning: false,
    }
  },
  components: {
    ReportTable,
    STable,
    SearchComPro,
  },
  created() {
    this.init()
  },
  methods: {
    toDetail(record, type) {
      let danceId = record.danceId ||''
      let deptId = record.branchId || this.queryParams.school_id||''
      let startDate = this.queryParams.startDate || ''
      let endDate = this.queryParams.endDate || ''
        const { href } = this.$router.resolve({
          name: 'teacherContract',
                  query: {
          danceId: danceId,
          areaId: deptId,
          status: type,
          startDate,
          endDate
        },
        })
        //结合open打开新的页面
        window.open(href, '_blank')
    },
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    //导出
    downloadStu() {
      // 导出的接口是换这个
      let exportUrl = '/education/signinlog/onMonthlyManpowerReportByExport'
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
    init() {
      this.spinning = true
      let that = this
      Promise.all([onMonthlyManpowerReport(this.queryParams)]).then((data) => {
        data.forEach((res) => {
          let loadData = []
          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach((item, idx) => {
              item.list.forEach((col, colIndex) => {
                let rowSpan = colIndex===0?item.list.length+1:0
                loadData.push(Object.assign(col, {branchId:item.branchId, branchName: item.branchName, rowSpan}))
              })
              if(item.total)loadData.push(Object.assign(item.total, {branchId:item.branchId,danceName:'汇总', branchName: item.branchName, rowSpan: 0}))})
          }
          that.loadData = loadData
        })
        that.spinning = false
        that.spinning = false
      })
    },
    searchSubmit(data, reset) {
      this.queryParams = data
      if (reset === 'isReset') {
        if (!!!this.$store.getters.school_id) {
          this.queryParams.startDate = defaultStart
          this.queryParams.endDate = defaultEnd
        }
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.init()
    },
  },
}
</script>

<style scoped lang="less">
/deep/.ant-table-tbody > tr > td {
  padding: 0 !important;
  height: 50px;
}
</style>
