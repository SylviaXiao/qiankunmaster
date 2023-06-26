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
          <span slot='customRender1' slot-scope="text, record">
            <span :style="record.isTotal||record.isTotalAll?'color:red;':''">{{text}}</span>
          </span>
          <span slot='customRender2' slot-scope="text, record">
            <span :style="record.isTotal||record.isTotalAll?'color:red;':''">
              {{text}}%
            </span>
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
import { areaOperationData } from '@/api/finance/finance'
const date = new Date()
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
const defaultSchoolId =['0c18166a-679b-414e-ac2e-c05ba7a2f4c4', '8f63afe7-09ca-4d11-ac51-1187e4381e63', '407913a7-76ff-40ce-967f-0ce0bf0bcdd3', '8109e909-8c8e-463a-9e10-a0804bc59b79', '150d8748-87ab-4935-8f6f-7233d1294413', '4c58a4b3-157b-493f-8b72-707196a26453', 'e07cad7c-7415-421c-a77e-48146d33a3bc', '0c185455-7ae8-4207-a517-91a2f5f26030', '88c5e24d-15c1-4e7c-adfb-f5e291562c33', '5aa46e02-28b9-4e31-936f-60721e07696d', '2d30de5a-9e47-4669-a9e9-534085ab6353', '7b0f4b73-83d9-4d46-adb0-78138e7ed633', '080aabad-e46b-479e-b130-169e970427e0', '66298d15-894b-4e48-9551-5d3795470304', '4e94a672-0bbd-48cd-ab50-8db3a4f4a57f',  'b337887b-ce9d-49e6-89c5-4f822c94d457', '5c3f5874-f9aa-437a-b1cc-9c5cf6339c3f', '50232e74-16d1-438d-9c09-bc7454b13fe0', '999e8fb9-6c98-4cc5-bab3-2a2937a36836', 'd923d38e-1699-4137-8f2a-315dcf2fa017', '5c0f0a94-346f-4e82-8848-f8882a7ac0ae', '7aa9901b-6d7f-44a3-8640-e0935516514c', '1207948e-746c-4dc3-9dd8-ab9c4493b49e', '47a6e64a-c166-4bb6-874c-f7e5c91666d7', 'c066c789-e642-45c8-9486-d7e684d44dca', '457cadbe-f9a8-4d18-87b4-85051f99898b', '6209c9c1-9b8f-42f2-9214-a7db8d5ece5a', 'b29cfda3-9609-4939-a8c4-4fe240f54f91']
export default {
  name: 'balanceConsumpution',
  data() {
    const columns = [
      {
        title: '地区',
        dataIndex: 'schoolArea',
        align: 'center',
        width: 60,
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
        fixed: 'left'
      },
      {
        title: '序号',
        dataIndex: 'sort',
        width: 50,
        align: 'center',
        ellipsis: true,
        customRender: (text, record, index) => {
          let rowSpan = 1
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
        fixed: 'left'
      },
      {
        title: '分馆',
        dataIndex: 'schoolName',
        align: 'center',
        width: 150,
        customRender: (text, record, index) => {
          let rowSpan = 1
          let colSpan = 1
          let style = false
          if(record.isTotal){
            colSpan=2
            style = true
          }
          if(record.isTotalAll){
            colSpan=3
            style = true
          }
          let children = <span >{text}</span>
          if(style){
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
        dataIndex: 'achievement',
        title: '业绩统计',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'sumAch',
            title: '总业绩',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }

          },
          {
            dataIndex: 'targetRatio',
            title: '年度目标完成进度',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender2' }
          },
          {
            dataIndex: 'refundAmount',
            title: '退卡金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'splitCardPrice',
            title: '转卡差额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'validAch',
            title: '有效业绩',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'singleApplyNum',
            title: '199单报人数（不含套报）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'coachClassNum',
            title: '教练班新招人数（含暑期集训）',
            width: 220,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerClassConsumeNum',
            title: '私教课耗节数',
            width: 220,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          }
        ]
      },
      {
        dataIndex: 'coachClassStatics',
        title: '教练班退卡数',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'coachClassRefundNum',
            title: '教练班',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'enhancementClassRefundNum',
            title: '精进班',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'studyClassRefundNum',
            title: '进修班',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
        ]
      },
      {
        dataIndex: 'sourceStatics',
        title: '渠道金额统计',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'serviceAmount',
            title: '客服金额（不含网课）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'networkServiceAmount',
            title: '客服金额（含网课）',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'personalAmount',
            title: '个人开发金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'renewalAmount',
            title: '续卡金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'memberAmount',
            title: '会员介绍金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'otherAmount',
            title: '其他渠道金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          }
        ]
      },
      {
        dataIndex: 'cardTypeStatics',
        title: '班型金额统计',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'coachClassAmount',
            title: '教练班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'regularClassAmount',
            title: '常规班金额',
            ellipsis: true,
            width: 150,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'youngClassAmount',
            title: '少儿班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerAdultAmount',
            title: '私教金额（成人）',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerYoungAmount',
            title: '私教金额（少儿）',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'networkClassAmount',
            title: '网课总业绩',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'otherClassAmount',
            title: '其他班型金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          }
        ]
      },{
        dataIndex: 'cardNextStatics',
        title: '续卡统计',
        ellipsis: true,
        align: 'center',
        children: [
          {
            dataIndex: 'tocoachContinueNum',
            title: '教练班续非教练班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'coachContinueNum',
            title: '非教练班续教练班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'coachToCoachContinueNum',
            title: '教练班续教练班人数',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'tocoachContinueAmount',
            title: '教练班续非教练班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'coachContinueAmount',
            title: '非教练班续教练班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'coachToCoachContinueAmount',
            title: '教练班续教练班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainingClassContinueAmount',
            title: '集训班续卡金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1
          },
          {
            dataIndex: 'toRegularClassContinueNum',
            title: '常规班续非常规班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'regularClassContinueNum',
            title: '非常规班续常规班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'regularToRegularContinueNum',
            title: '常规班续常规班人数',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'toRegularClassContinueAmount',
            title: '常规班续非常规班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'regularClassContinueAmount',
            title: '非常规班续常规班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'regularToRegularContinueAmount',
            title: '常规班续常规班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },

          {
            dataIndex: 'toYoungClassContinueNum',
            title: '少儿班续非少儿班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'youngClassContinueNum',
            title: '非少儿班续少儿班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'youngToYoungContinueNum',
            title: '少儿班续少儿班人数',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'toYoungClassContinueAmount',
            title: '少儿班续非少儿班金额',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'youngClassContinueAmount',
            title: '非少儿班续少儿班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'youngToYoungContinueAmount',
            title: '少儿班续少儿班金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },

          {
            dataIndex: 'toTrainerAdultContinueNum',
            title: '私教续非私教人数（成人）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerAdultContinueNum',
            title: '非私教续私教人数（成人）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerAdultToTrainerAdultContinueNum',
            title: '私教（成人）续私教（成人）人数',
            width: 240,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'toTrainerAdultContinueAmount',
            title: '私教续非私教金额（成人）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerAdultContinueAmount',
            title: '非私教续私教金额（成人）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerAdultToTrainerAdultContinueAmount',
            title: '私教（成人）续私教（成人）金额',
            width: 240,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },

          {
            dataIndex: 'toTrainerYoungContinueNum',
            title: '私教续非私教人数（少儿）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerYoungContinueNum',
            title: '非私教续私教人数（少儿）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerYoungToTrainerYoungContinueNum',
            title: '私教（少儿）续私教（少儿）人数',
            width: 240,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'toTrainerYoungContinueAmount',
            title: '私教续非私教金额（少儿）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerYoungContinueAmount',
            title: '非私教续私教金额（少儿）',
            width: 180,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'trainerYoungToTrainerYoungContinueAmount',
            title: '私教（少儿）续私教（少儿）金额',
            width: 240,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell1,
            scopedSlots: { customRender: 'customRender1' }
          },

          {
            dataIndex: 'otherContinueNum',
            title: '其他续卡人数',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'otherContinueAmount',
            title: '其他续卡金额',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          },
          {
            dataIndex: 'sumNum',
            title: '续卡总人数',
            width: 150,
            ellipsis: true,
            align: 'center',
            customHeaderCell: customHeaderCell2,
            scopedSlots: { customRender: 'customRender1' }
          }
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
        // {
        //   type: 'singledate',
        //   key: 'year',
        //   label: '年份',
        //   show: true,
        //   mode: 'year',
        //   placeholder: '请选择时间',
        //   format: 'YYYY',
        //   defaultVal: defaultStart
        // }
      ],
      queryParams: {
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
      Promise.all([areaOperationData(this.queryParams)]).then(data => {
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
          let average = { schoolName: '平均值', isTotalAll: true }
          Object.keys(columns).forEach(key => {
            if (key != 'sort' && key != 'schoolArea' && key != 'schoolName') {
              total[key] = columns[key].toFixed(2)
              average[key] = (columns[key] / lengthAll).toFixed(2)
            }
          })
          total.targetRatio=targetPrice===0?0:(targetTotalPrice/targetPrice*100).toFixed(2)
          average.targetRatio=targetPrice===0?0:(targetTotalPrice/targetPrice/res.data.length*100).toFixed(2)
          loadData.push(total)
          loadData.push(average)
          that.loadData = loadData
        })
        that.spinning = false
      })
    },
    searchSubmit(data, reset) {
      this.queryParams = data
      if (reset == 'isReset') {
        this.queryParams.startDate = defaultStart
        this.queryParams.endDate = defaultEnd
        this.queryParams.schoolId=defaultSchoolId.join(',')
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
