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
        </a-table>
      </a-spin>
    </a-card>

    <a-card :bordered="false">
<!--      <div class="mt10 mb10">-->
<!--        <a-button type="primary" icon="download" @click.native="downloadStu"> 导出 </a-button>-->
<!--      </div>-->
      <a-spin tip="加载中..." :spinning="spinning">
        <a-table
          ref="table"
          class="mt20"
          bordered
          :pagination="false"
          :data-source="loadData1"
          :columns="columnsNext"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
        >
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
import { storeAdviserRanking } from '@/api/finance/finance'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
const defaultEnd1 = defaultStart===defaultEnd?defaultEnd: moment(date).subtract(1,'days').format('YYYY-MM-DD')
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
const schoolIds =['0c18166a-679b-414e-ac2e-c05ba7a2f4c4', '8f63afe7-09ca-4d11-ac51-1187e4381e63', '407913a7-76ff-40ce-967f-0ce0bf0bcdd3', '8109e909-8c8e-463a-9e10-a0804bc59b79', '150d8748-87ab-4935-8f6f-7233d1294413', '4c58a4b3-157b-493f-8b72-707196a26453', 'e07cad7c-7415-421c-a77e-48146d33a3bc', '0c185455-7ae8-4207-a517-91a2f5f26030', '88c5e24d-15c1-4e7c-adfb-f5e291562c33', '5aa46e02-28b9-4e31-936f-60721e07696d', '2d30de5a-9e47-4669-a9e9-534085ab6353', '7b0f4b73-83d9-4d46-adb0-78138e7ed633', '080aabad-e46b-479e-b130-169e970427e0', '66298d15-894b-4e48-9551-5d3795470304', '4e94a672-0bbd-48cd-ab50-8db3a4f4a57f',  'b337887b-ce9d-49e6-89c5-4f822c94d457', '5c3f5874-f9aa-437a-b1cc-9c5cf6339c3f', '50232e74-16d1-438d-9c09-bc7454b13fe0', '999e8fb9-6c98-4cc5-bab3-2a2937a36836', 'd923d38e-1699-4137-8f2a-315dcf2fa017', '5c0f0a94-346f-4e82-8848-f8882a7ac0ae', '7aa9901b-6d7f-44a3-8640-e0935516514c', '1207948e-746c-4dc3-9dd8-ab9c4493b49e', '47a6e64a-c166-4bb6-874c-f7e5c91666d7', 'c066c789-e642-45c8-9486-d7e684d44dca', '457cadbe-f9a8-4d18-87b4-85051f99898b', '6209c9c1-9b8f-42f2-9214-a7db8d5ece5a', 'b29cfda3-9609-4939-a8c4-4fe240f54f91']
export default {
  name: 'balanceConsumpution',
  data() {
    let  defaultSchoolId= this.$store.getters.school_id ? [this.$store.getters.school_id] : schoolIds
    const columns = [
      {
        title: '序号',
        dataIndex: 'sort',
        width: 50,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          if (record.deptRegion==='合计'||record.deptRegion==='平均值'){
            return {
              attrs: {
                colSpan: 0
              }
            }
          }
          return <span>{index+1}</span>
        },
        fixed: 'left'
      },
      {
        title: '地区',
        dataIndex: 'deptRegion',
        align: 'center',
        width: 60,
        customRender: (text, record, index) => {
          if (record.deptRegion==='合计'||record.deptRegion==='平均值') {
            return {
              children: <span>{text}</span>,
              attrs: {
                colSpan: 3
              }
            }
          }
          return <span>{text}</span>
        },
        fixed: 'left'
      },
      {
        title: '分馆',
        dataIndex: 'deptName',
        align: 'center',
        width: 150,
        customRender: (text, record, index) => {
          if (record.deptRegion==='合计'||record.deptRegion==='平均值'){
            return {
              attrs: {
                colSpan: 0
              }
            }
          }
          return <span>{text}</span>
        },
        fixed: 'left'
      },
      {
        dataIndex: 'fullMoney',
        title: '总业绩',
        width: 150,
        ellipsis: true,
        align: 'center',
        fixed: 'left',
        customHeaderCell: customHeaderCell1
      },
      {
        dataIndex: 'championName',
        title: '销冠',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
      },
      {
        dataIndex: 'championMoney',
        title: '销冠业绩',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1
      },
      {
        dataIndex: 'stage',
        title: '一阶段目标',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1
      },
      {
        dataIndex: 'fullStage',
        title: '总任务目标',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1
      },
      {
        dataIndex: 'growthRate',
        title: '增长幅度',
        width: 220,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record) => {
          return text + '%'
        }
      },
      {
        dataIndex: 'progress',
        title: '完成进度',
        width: 220,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record) => {
          return text + '%'
        }
      },
      {
        dataIndex: 'refundMoney',
        title: '退费',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2
      },
      {
        dataIndex: 'effectiveAdviserMoney',
        title: '有效业绩',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2
      }
    ]
    const  columnsNext =[
      {
        title: '地区',
        dataIndex: 'region',
        align: 'center',
        width: 60,
        customRender: (text, record, index) => {
          if (record.isTotal) {
            return {
              attrs: {
                colSpan: 0
              }
            }
          }
          return <span>{text}</span>
        }
      },
      {
        title: '总任务目标',
        dataIndex: 'fullStage',
        align: 'center',
        width: 150,
        customRender: (text, record, index) => {
          if (record.isTotal) {
            return {
              attrs: {
                colSpan: 0
              }
            }
          }
          return <span>{text}</span>
        }
      },
      {
        dataIndex: 'stage',
        title: '一阶段目标',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1
      },
      {
        dataIndex: 'adviserMoney',
        title: '总业绩',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
      },
      {
        dataIndex: 'adviserAvgMoney',
        title: '业绩平均值',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1
      },
      {
        dataIndex: 'growthRate',
        title: '增长幅度',
        width: 150,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record) => {
          return text + '%'
        }
      },
      {
        dataIndex: 'progress',
        title: '完成进度',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        customRender: (text, record) => {
          return text + '%'
        }
      },
      {
        dataIndex: 'refundMoney',
        title: '退费',
        width: 220,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1
      },
      {
        dataIndex: 'effectiveAdviserMoney',
        title: '有效业绩',
        width: 220,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1
      },
      {
        dataIndex: 'effectiveAdviserAvgMoney',
        title: '有效业绩平均值',
        width: 180,
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell2
      }
    ]
    return {
      defaultSchoolId:defaultSchoolId,
      columnsNext:columnsNext,
      spinning: false,
      columns: columns,
      //表内容
      loadData: [],
      loadData1: [],
      //搜索项
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'school_id',
          label: '分馆',
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
          type: 'date',
          key: 'Date',
          label: '时间日期',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'date',
          key: 'ContrastDate',
          label: '对比日期',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd1, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'select',
          key: 'isRefund',
          label: '是否包含退费',
          show: true,
          placeholder: '请选择是否包含退费',
          staticArr: [
            {
              string: '包含',
              value: 'Y'
            },
            {
              string: '不包含',
              value: 'N'
            }
          ]
        },

      ],
      queryParams: {
        startDate: defaultStart,
        endDate: defaultEnd,
        startContrastDate: defaultStart,
        endContrastDate: defaultEnd1,
        school_id:defaultSchoolId.join(',')
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
    this.init()
  },
  methods: {
    rowClassName(record, index) {
      if (index % 2 === 1) return 'ant-table-even'
    },
    //导出
    downloadStu() {
      let exportUrl ='/storeAdviserRanking/reportByExport'
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

      if(this.queryParams.endDate){
        let date = new Date(this.queryParams.endDate).getDate()
        let monthStart = new Date(this.queryParams.startDate).getMonth()
        let monthEnd = new Date(this.queryParams.endDate).getMonth()
        let title = ''
        if(monthStart===monthEnd){
          if(date<=10){
            title='一阶段目标'
          }else if(date<=20){
            title='二阶段目标'
          }else {
            title='三阶段目标'
          }
        }
        this.columns[6].title=title
        this.columnsNext[2].title=title
      }
      Promise.all([storeAdviserRanking(this.queryParams)]).then(data => {
        data.forEach((res, index) => {
          let loadData = res.data?.list||[]
          let loadData1 = res.data?.avg||[]
          that.loadData = loadData
          that.loadData1 = loadData1
        })
        that.spinning = false
      })
    },
    searchSubmit(data, reset) {
      this.queryParams = data
      if (reset === 'isReset') {
        this.queryParams.startDate = defaultStart
        this.queryParams.endDate = defaultEnd
        this.queryParams.startContrastDate= defaultStart
        this.queryParams.endContrastDate= defaultEnd1
        this.queryParams.school_id=this.defaultSchoolId.join(',')
      }
      this._refreshTable()
    },
    _refreshTable() {
      this.init()
    }
  }
}
</script>

<style scoped lang="less"></style>
