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
          :pagination="false"
          :data-source="loadData"
          bordered
          :columns="columns"
          :rowKey="(record, index) => index"
          :rowClassName="rowClassName"
        >
          <span slot='totalRenew' slot-scope="text, record">
               <a href="javascript:;" @click="toContinuedDetails(record,'')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='totalRefundAmount' slot-scope="text, record">
               <a href="javascript:;" @click="toRefundDetails(record,'')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='coachClassTotalRenew' slot-scope="text, record">
               <a href="javascript:;" @click="toContinuedDetails(record,'A')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='coachClassTotalRefundAmount' slot-scope="text, record">
               <a href="javascript:;" @click="toRefundDetails(record,'A')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='regularClassTotalRenew' slot-scope="text, record">
               <a href="javascript:;" @click="toContinuedDetails(record,'E')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='regularClassTotalRefundAmount' slot-scope="text, record">
               <a href="javascript:;" @click="toRefundDetails(record,'E')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='personaltainerTotalRenew' slot-scope="text, record">
               <a href="javascript:;" @click="toContinuedDetails(record,'C')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='personaltainerTotalRefundAmount' slot-scope="text, record">
               <a href="javascript:;" @click="toRefundDetails(record,'C')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='assembleClassTotalRenew' slot-scope="text, record">
               <a href="javascript:;" @click="toContinuedDetails(record,'d5b119a6-d7df-403d-a9e1-cb3de7af1479')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='assembleClassTotalRefundAmount' slot-scope="text, record">
               <a href="javascript:;" @click="toRefundDetails(record,'d5b119a6-d7df-403d-a9e1-cb3de7af1479')" style="color:#02A7F0;">{{text}}</a>
          </span>

          <span slot='otherRenew' slot-scope="text, record">
               <a href="javascript:;" @click="toContinuedDetails(record,'-1')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='otherRefundAmount' slot-scope="text, record">
               <a href="javascript:;" @click="toRefundDetails(record,'-1')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='youngClassTotalRenew' slot-scope="text, record">
               <a href="javascript:;" @click="toContinuedDetails(record,'B')" style="color:#02A7F0;">{{text}}</a>
          </span>
          <span slot='youngClassTotalRefundAmount' slot-scope="text, record">
               <a href="javascript:;" @click="toRefundDetails(record,'B')" style="color:#02A7F0;">{{text}}</a>
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
import { danceRenewalData } from '@/api/finance/finance'
const date = new Date()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')
const customHeaderCell1 = column => {
  return {
    style: {
      background: '#1ba97b'
    }
  }
}
const defaultSchoolId =['0c18166a-679b-414e-ac2e-c05ba7a2f4c4', '8f63afe7-09ca-4d11-ac51-1187e4381e63', '407913a7-76ff-40ce-967f-0ce0bf0bcdd3', '8109e909-8c8e-463a-9e10-a0804bc59b79', '150d8748-87ab-4935-8f6f-7233d1294413', '4c58a4b3-157b-493f-8b72-707196a26453', 'e07cad7c-7415-421c-a77e-48146d33a3bc', '0c185455-7ae8-4207-a517-91a2f5f26030', '88c5e24d-15c1-4e7c-adfb-f5e291562c33', '5aa46e02-28b9-4e31-936f-60721e07696d', '2d30de5a-9e47-4669-a9e9-534085ab6353', '7b0f4b73-83d9-4d46-adb0-78138e7ed633', '080aabad-e46b-479e-b130-169e970427e0', '66298d15-894b-4e48-9551-5d3795470304', '4e94a672-0bbd-48cd-ab50-8db3a4f4a57f',  'b337887b-ce9d-49e6-89c5-4f822c94d457', '5c3f5874-f9aa-437a-b1cc-9c5cf6339c3f', '50232e74-16d1-438d-9c09-bc7454b13fe0', '999e8fb9-6c98-4cc5-bab3-2a2937a36836', 'd923d38e-1699-4137-8f2a-315dcf2fa017', '5c0f0a94-346f-4e82-8848-f8882a7ac0ae', '7aa9901b-6d7f-44a3-8640-e0935516514c', '1207948e-746c-4dc3-9dd8-ab9c4493b49e', '47a6e64a-c166-4bb6-874c-f7e5c91666d7', 'c066c789-e642-45c8-9486-d7e684d44dca', '457cadbe-f9a8-4d18-87b4-85051f99898b', '6209c9c1-9b8f-42f2-9214-a7db8d5ece5a', 'b29cfda3-9609-4939-a8c4-4fe240f54f91']
export default {
  name: 'danceContinuedCard',
  data() {
    const columns = [
      {
        title: '地区',
        dataIndex: 'deptName',
        align: 'center',
        width: 120,
        customRender: (text, record, index) => {
          let rowSpan = record.rowSpan
          let colSpan = 1

          if(record.isTotalAll||record.isTotal){
            rowSpan=0
            colSpan=0
          }
          let children = <span >{text}</span>
          if(text==='全国舞种合计'){
            children= <span style='color:red'>{text}</span>
          }
          return {
            children:children ,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
        fixed: 'left'
      },
      {
        title: '舞种',
        dataIndex: 'danceName',
        width: 100,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          let children = <span >{text}</span>
          if(record.isTotalAll||record.isTotal){
            rowSpan=1
            colSpan=2
            children= <span style='color:red'>{text}</span>
          }
            return {
              children:children ,
            attrs: {
              colSpan: colSpan,
              rowSpan:rowSpan
            }
          }
        },
        fixed: 'left'
      },
      {
        title: '总业绩',
        dataIndex: 'totalAch',
        align: 'center',
        width: 150,
        fixed: 'left'
      },
      {
        dataIndex: 'totalRenew',
        title: '总续费',
        width: 150,
        ellipsis: true,
        align: 'center',
        scopedSlots: { customRender: 'totalRenew' },
        fixed: 'left'
      },
      {
        dataIndex: 'totalRefundAmount',
        title: '总退费',
        width: 150,
        ellipsis: true,
        align: 'center',
        scopedSlots: { customRender: 'totalRefundAmount' },
        fixed: 'left'
      },
      {
        dataIndex: 'coachClass',
        title: '教练班',
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        children: [
          {
            dataIndex: 'coachClassTotalAch',
            title: '教练班总业绩',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'coachClassTotalRenew',
            title: '教练班总续费',
            width: 150,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'coachClassTotalRenew' }
          },
          {
            dataIndex: 'coachClassTotalRefundAmount',
            title: '教练班总退费',
            width: 150,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'coachClassTotalRefundAmount' }
          },
          {
            dataIndex: 'coachClassToCoachClass',
            title: '教练班续教练班',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'coachClassToRegularClass',
            title: '教练班续常规班',
            width: 180,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'coachClassToPersonaltainer',
            title: '教练班续私教',
            width: 220,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'coachClassToAssembleClass',
            title: '教练班续集训班',
            width: 220,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'coachClassToOther',
            title: '教练班续其他',
            width: 220,
            ellipsis: true,
            align: 'center',
          }
        ]
      },
      {
        dataIndex: 'coachClassStatics',
        title: '常规班',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'regularClassTotalAch',
            title: '常规班总业绩',
            width: 180,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'regularClassTotalRenew',
            title: '常规班总续费',
            width: 150,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'regularClassTotalRenew' }
          },
          {
            dataIndex: 'regularClassTotalRefundAmount',
            title: '常规班总退费',
            width: 150,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'regularClassTotalRefundAmount' }
          },
          {
            dataIndex: 'regularClassToRegularClass',
            title: '常规班续常规班',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'regularClassToCoachClass',
            title: '常规班续教练班',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'regularClassToPersonaltainer',
            title: '常规班续私教',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'regularClassToOther',
            title: '常规班续其他',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
        ]
      },
      {
        dataIndex: 'sourceStatics',
        title: '私教',
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        children: [
          {
            dataIndex: 'personaltainerTotalAch',
            title: '私教总业绩',
            width: 180,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'personaltainerTotalRenew',
            title: '私教总续费',
            width: 150,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'personaltainerTotalRenew' }
            
          },
          {
            dataIndex: 'personaltainerTotalRefundAmount',
            title: '私教总退费',
            width: 150,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'personaltainerTotalRefundAmount' }
          },
          {
            dataIndex: 'adultPersonaltainerToPersonaltainer',
            title: '成人私教续私教',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'adultPersonaltainerToCoachClass',
            title: '成人私教续教练班',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'adultPersonaltainerToRegularClass',
            title: '成人私教续常规班',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'adultPersonaltainerToOther',
            title: '成人私教续其他',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'youngPersonaltainerToPersonaltainer',
            title: '少儿私教续私教',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'youngPersonaltainerToOther',
            title: '少儿私教续其他',
            width: 150,
            ellipsis: true,
            align: 'center',
          }
        ]
      },
      {
        dataIndex: 'cardTypeStatics',
        title: '少儿班',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'youngClassTotalAch',
            title: '少儿班总业绩',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'youngClassTotalRenew',
            title: '少儿班总续费',
            ellipsis: true,
            width: 150,
            align: 'center',
            scopedSlots: { customRender: 'youngClassTotalRenew' }
          },
          {
            dataIndex: 'youngClassTotalRefundAmount',
            title: '少儿班总退费',
            width: 150,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'youngClassTotalRefundAmount' }
            
          },
          {
            dataIndex: 'youngClassToYoungClass',
            title: '少儿班续少儿班',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'youngClassToPersonaltainer',
            title: '少儿班续私教',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'youngClassToOther',
            title: '少儿班续其他',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
        ]
      },
      {
        dataIndex: 'cardNextStatics',
        title: '集训班',
        ellipsis: true,
        align: 'center',
        customHeaderCell: customHeaderCell1,
        children: [
          {
            dataIndex: 'assembleClassTotalAch',
            title: '集训班总业绩',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'assembleClassTotalRenew',
            title: '集训班总续费',
            width: 180,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'assembleClassTotalRenew' }
          },
          {
            dataIndex: 'assembleClassTotalRefundAmount',
            title: '集训班总退费',
            width: 180,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'assembleClassTotalRefundAmount' }
            
          },
          {
            dataIndex: 'assembleClassToAssembleClass',
            title: '集训班续集训班',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'assembleClassToCoachClass',
            title: '集训班续教练班',
            width: 180,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'assembleClassToRegularClass',
            title: '集训班续常规班',
            width: 180,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'assembleClassToPersonaltainer',
            title: '集训班续私教',
            width: 150,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'assembleClassToOther',
            title: '集训班续其他',
            width: 180,
            ellipsis: true,
            align: 'center',
          },
        ]
      },
      {
        dataIndex: 'cardNextStatics1',
        title: '其他',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'otherTotalAch',
            title: '其他总业绩',
            width: 180,
            ellipsis: true,
            align: 'center',
          },
          {
            dataIndex: 'otherRenew',
            title: '其他总续费',
            width: 150,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'otherRenew' }
          },
          {
            dataIndex: 'otherRefundAmount',
            title: '其他总退费',
            width: 180,
            ellipsis: true,
            align: 'center',
            scopedSlots: { customRender: 'otherRefundAmount' }
          },
        ]
      }
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
          type: 'date',
          key: 'Date',
          label: '时间',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        }
      ],
      queryParam: {
        startDate: defaultStart,
        endDate: defaultEnd,
        schoolId:defaultSchoolId.join(',')
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
    this.initData()
  },
  methods: {
    toRefundDetails(record,type){
        let { endDate, startDate } = this.queryParam
        const { href } = this.$router.resolve({
          name: 'totalRefundDetails',
          query: {
            startDate: startDate,
            endDate: endDate,
            deptId: record.schoolIds,
            danceId:record.danceId,
            type
          }
        })
        //结合open打开新的页面
        window.open(href, '_blank')
    },
    toContinuedDetails(record,type){
      let { endDate, startDate } = this.queryParam
      const { href } = this.$router.resolve({
        name: 'totalContinuedDetails',
        query: {
          startDate: startDate,
          endDate: endDate,
          deptId: record.schoolIds,
          danceId:record.danceId,
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
      let exportUrl = '/finance/target/danceRenewalDataDown'
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
      Promise.all([danceRenewalData(this.queryParam)]).then(data => {
        data.forEach((res, index) => {
          let loadData = []
          let lengthAll = 0
          if (Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach((item, index) => {
              item.columns={}
              let length = item.data.length-1
              lengthAll+=length-2
              item.data.forEach((col, colIndex) => {
                col.rowSpan=colIndex===0?length:0
                if(col.danceName==='地区合计'||col.danceName==='全国合计')col.isTotal=true
                col.deptName=item.deptName
              })
              loadData=[...loadData,...item.data]
            })
          }
          that.loadData = loadData
        })
        that.spinning = false
      })
    },
    searchSubmit(data, reset) {
      this.queryParam = data
      if (reset == 'isReset') {
        this.queryParam.startDate = defaultStart
        this.queryParam.endDate = defaultEnd
        this.queryParam.schoolId=defaultSchoolId.join(',')
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
