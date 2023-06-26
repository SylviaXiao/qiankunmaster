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
        <a-table ref="table" class="mt20" bordered :pagination="false" :locale="locale" :data-source="loadData" :columns="columns"
          :rowKey="(record, index) => index" :rowClassName="rowClassName">
          <span slot="oneMonthNoCourse" slot-scope="text, record">
            <div :style='"padding: 10px 0;" + record.style'> <a :style='record.style ? "color:red;" : ""'
                @click="toDetail(record, 'A')">{{ text }}</a></div>
          </span>
          <span slot="studentCount" slot-scope="text, record">
            <div :style='"padding: 10px 0;" + record.style'> <a :style='record.style ? "color:red;" : ""'
                @click="toDetail(record, 'B')">{{ text }}</a></div>
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
import { listEduDance } from '@/api/common'
const date = new Date()
import { privateEduVariousPlacesReport } from '@/api/table/table'
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
const defaultSchoolId = [
  "0c18166a-679b-414e-ac2e-c05ba7a2f4c4",
  "8f63afe7-09ca-4d11-ac51-1187e4381e63",
  "407913a7-76ff-40ce-967f-0ce0bf0bcdd3",
  "8109e909-8c8e-463a-9e10-a0804bc59b79",
  "150d8748-87ab-4935-8f6f-7233d1294413",
  "4c58a4b3-157b-493f-8b72-707196a26453",
  "e07cad7c-7415-421c-a77e-48146d33a3bc",
  "0c185455-7ae8-4207-a517-91a2f5f26030",
  "88c5e24d-15c1-4e7c-adfb-f5e291562c33",
  "5aa46e02-28b9-4e31-936f-60721e07696d"
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
          let style = 'display:block;padding: 10px 0;'
          if (record.rowSpan) {
            rowSpan = record.rowSpan >= 1 ? record.rowSpan : 0
          }
          if (record.colSpan) {
            colSpan = record.colSpan
            style += 'color:red;'
          }
          if (record.isTotal) {
            colSpan = 3
          }
          if (record.style) {
            style += 'background:#52a552;color:#000;'
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan: rowSpan
            }
          }
        },
      },
      {
        title: '分馆',
        dataIndex: 'branchName',
        align: 'center',
        width: 150,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          if (record.rowSpan1) {
            rowSpan = record.rowSpan1 >= 1 ? record.rowSpan1 : 0
          }
          if (record.colSpan || record.isTotal) {
            colSpan = 0
          }
          return {
            children: <span>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan: rowSpan
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
          if (record.isTotal) {
            colSpan = 0
          }
          return {
            children: <span>{text}</span>,
            attrs: {
              colSpan: colSpan,
              rowSpan: rowSpan
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①卡种：班型=私教；卡类型=正式卡；上课分馆=当前分馆；舞种：优先取卡种上课班级舞种，不存在班级取卡种舞种</div>
            <div>②卡种办卡日期：属于筛选时间段内</div>
            <div>③卡种状态=使用中，卡种数量</div>
          </template>
          开卡人数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'openCardCount',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①开卡卡数对应的学员数量，去重</div>
            <div>②地区合计/全国合计人数：均去重（因为学员存在跨舞种-多张卡）</div>
          </template>
          开卡学员人数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'openCardStudentCount',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①卡种：班型=私教；卡类型=正式卡；上课分馆=当前分馆；舞种：优先取卡种上课班级舞种，不存在班级取卡种舞种</div>
            <div>②种办卡日期：属于筛选时间段内</div>
            <div>③卡种状态=未使用，的卡种数量</div>
          </template>
          未开卡卡数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'onOpenCardCount',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①未开卡卡数对应的学员数量，去重</div>
          </template>
          未开卡学员人数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'onOpenCardStudentCount',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①卡种：班型=私教；卡类型=正式卡；上课分馆=当前分馆；舞种：优先取卡种上课班级舞种，不存在班级取卡种舞种</div>
            <div>②种办卡日期：属于筛选时间段内</div>
            <div>③卡种状态=停课，的卡种数量</div>
          </template>
          停卡卡数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'stopCardCount',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①停课卡数对应的学员数量，去重</div>
          </template>
          停卡学员人数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'stopCardStudentCount',
        width: 220,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①卡种：班型=私教；卡类型=正式卡；上课分馆=当前分馆；舞种：优先取卡种上课班级舞种，不存在班级取卡种舞种</div>
            <div>②卡种办卡日期：属于筛选时间段内；卡种状态=【使用中】/【停课】</div>
            <div>③若学员只有其一状态的卡，则判断这张卡【最新一次签到记录-上课时间】距离当前日期超过一个月，则算1个人头</div>
            <div>④若学员含有此两种卡，均超过一个月未签到，则算1个人头。</div>
          </template>
          1个月未上课人数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'oneMonthNoCourse',
        width: 220,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        scopedSlots: { customRender: 'oneMonthNoCourse' }
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①卡种：班型=私教；卡类型=正式卡；上课分馆=当前分馆；舞种：优先取卡种上课班级舞种，不存在班级取卡种舞种</div>
            <div>②卡种办卡日期：属于筛选时间段内</div>
            <div>③含有【卡种状态=使用中/未使用/停课】】最少一种卡种状态的学员数量</div>
          </template>
          学员总人数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'studentCount',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
        scopedSlots: { customRender: 'studentCount' }
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①卡种：班型=私教；卡类型=正式卡；上课分馆=当前分馆；舞种：优先取卡种上课班级舞种，不存在班级取卡种舞种</div>
            <div>②卡种办卡日期：属于筛选时间段内</div>
            <div>③报名：新报的卡种总次数</div>
            <div>④卡种状态=使用中/未使用/停课，总次数取【学员卡管理-总次数】；</div>
            <div>卡种状态=退卡、结转，总次数取【学员卡管理-使用次数】</div>
            <div>卡种状态=撤销，总次数=0</div>
          </template>
          新报课时数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'xEnrollNumber',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①卡种：班型=私教；卡类型=正式卡；上课分馆=当前分馆；舞种：优先取卡种上课班级舞种，不存在班级取卡种舞种</div>
            <div>②卡种办卡日期：属于筛选时间段内</div>
            <div>③报名：续报的卡种总次数</div>
            <div>④卡种状态=使用中/未使用/停课，总次数取【学员卡管理-总次数】；</div>
            <div>卡种状态=退卡、结转，总次数取【学员卡管理-使用次数】</div>
            <div>卡种状态=撤销，总次数=0</div>
          </template>
          续报课时数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'xuEnrollNumber',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①卡种：班型=私教；卡类型=正式卡；舞种：优先取卡种上课班级舞种，不存在班级取卡种舞种；签到分馆=当前分馆</div>
            <div>②卡种办卡日期不限制；即含往期报名，当月签到的数据</div>
            <div>③取签到记录的数据，签到记录上课时间=当前月</div>
            <div>当前俩字段要和【各地私教】本月导师上课总节数-总数：对上</div>
          </template>
          本月消耗课时<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'bMonthPENumber',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①卡种：班型=私教；卡类型=正式卡；舞种：优先取卡种上课班级舞种，不存在班级取卡种舞种；签到分馆=当前分馆</div>
            <div>②卡种办卡日期不限制；即含往期报名，上个月签到的数据</div>
            <div>③取签到记录的数据，签到记录上课时间=上个月</div>
            <div>当前俩字段要和【各地私教】本月导师上课总节数-总数：对上</div>
          </template>
          上月消耗课时<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'sMonthPENumber',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
      {
        title: <a-tooltip>
          <template slot="title">
            <div>①卡种：班型=私教；卡类型=正式卡；上课分馆/舞种=当前分馆/舞种</div>
            <div>②卡种办卡日期：属于筛选时间段内</div>
            <div>③卡种的剩余节数；退卡 结业 撤销这三种状态卡种， 剩余节数都是0</div>
          </template>
          总剩余私教课时数<a-icon class="ml-4" type="info-circle" />
        </a-tooltip>,
        dataIndex: 'remainNumber',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2,
        customRender: (text, record, index) => {
          let style = 'display:block;padding: 10px 0;'
          if (record.style) {
            style += record.style
          }
          return {
            children: <span style={style}>{text}</span>,
            attrs: {
              colSpan: 1,
              rowSpan: 1
            }
          }
        },
      },
    ]
    return {
      spinning: false,
      columns: columns,
      //表内容
      loadData: [],
      locale: { emptyText: <div style='font-size: 30px;padding: 100px 0;'>请选择相关筛选条件后，再查询信息哦</div> },
      //搜索项
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'schoolId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          show: true,
          defaultVal: defaultSchoolId,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select', //动态select框
          key: 'danceIds',
          show: true,
          label: '舞种',
          mode: 'multiple',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance, // promise类型的接口
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'date',
          key: 'Date',
          label: '办卡日期',
          show: true,
          placeholder: '请选择日期',
          format: 'YYYY-MM-DD',
          isDate: true
        },
        {
          type: 'select', // 静态select框
          key: 'userType',
          label: '人群',
          show: true,
          placeholder: '请选择人群',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '成人',
              value: 'A'
            },
            {
              string: '少儿',
              value: 'B'
            }
          ]
        }
      ],
      queryParams: {
        schoolId: !!!this.$store.getters.school_id ? defaultSchoolId.join(',') : ''
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
    // this.init()
  },
  methods: {
    toDetail(record, type) {
      let danceId = record.danceId || this.queryParams.danceIds || 'all'
      let deptId = record.deptId || this.queryParams.schoolId || 'all'
      let startDate = this.queryParams.startDate || 'all'
      let endDate = this.queryParams.endDate || 'all'
      const { href } = this.$router.resolve({
        name: 'eduTeacherPrivateEducationCardDetails',
        params: { type: type, dance: danceId, startDate: startDate, endDate: endDate, deptId: deptId }
      })
      // localStorage.setItem('eduTeacherPrivateEducationCardDetailsId', data.deptId)
      //结合open打开新的页面
      window.open(href, '_blank')
    },
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    //导出
    downloadStu() {
      let exportUrl = '/privateEduVariousPlaces/reportByExport'
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
      Promise.all([privateEduVariousPlacesReport(this.queryParams)]).then(data => {
        data.forEach(res => {
          let loadData = []
          if (res.data && Array.isArray(res.data.list1) && res.data.list1.length > 0) {
            res.data.list1.forEach((item, idx) => {
              let index = idx
              let deptId = []
              item.rowspan = 0
              item.list.forEach((col, colIndex) => {
                item.rowspan += col.list.length
              })
              item.list.forEach((col, colIndex) => {
                deptId.push(col.list[0].deptId)
                col.list.forEach((row, rowIndex) => {
                  let rowSpan = colIndex === 0 && rowIndex === 0 ? item.rowspan : -1
                  let rowSpan1 = rowIndex === 0 ? col.list.length : -1
                  loadData.push(Object.assign(row, { regionName: item.regionName, rowSpan, rowSpan1 }))
                })
              })
              res.data.list2[index].list.forEach((row, rowIndex) => {
                let rowSpan = rowIndex === 0 ? res.data.list2[index].list.length : -1
                loadData.push(Object.assign(row, { regionName: '地区舞种合计', rowSpan, colSpan: 2, deptId: deptId.join(',') }))
              })
              loadData.push(Object.assign(res.data.list2[index].total, { regionName: '地区合计', isTotal: true, deptId: deptId.join(','), style: 'background:#5bc0de;' }))
            })
          }
          loadData.push(Object.assign(res.data.total, { regionName: '合计', isTotal: true, style: 'background:#52a552;' }))
          that.loadData = loadData
        })
        that.spinning = false
      })
    },
    searchSubmit(data, reset) {
      this.queryParams = data
      if (reset === 'isReset') {
        this.loadData=[]
        if (!!!this.$store.getters.school_id) {
          this.queryParams.schoolId = defaultSchoolId.join(',')
        }
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.init()
    }
  }
}
</script>

<style scoped lang="less">
///deep/.ant-table-tbody > tr > td{
//  padding: 0!important;
//}
</style>
