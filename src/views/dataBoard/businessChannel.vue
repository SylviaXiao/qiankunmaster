<template>
  <div>
    <div ref="elementSearch" :style="{ padding: '20px 0' }">
      <a-card :bordered="false">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" ref="elementSearch" :searchParams="searchParams"> </search-com-pro>
      </a-card>
    </div>
    <div ref="elementTable" :style="{ padding: '20px 0' }">
      <a-card :bordered="false">
        <a-tabs default-active-key="1" v-model="tabIndex">
          <a-tab-pane key="1" tab="引流资源报名转化趋势报表">
            <div class="mt10 mb10">
              <a-button type="primary" icon="download" @click.native="downloadStu">
                导出
              </a-button>
            </div>
            <a-table :columns="columns" :data-source="loadData" :loading="loading" bordered :rowKey="(record, index) => index" :pagination="false">
              <template slot="name" slot-scope="text">
                <a>{{ text }}</a>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="2" tab="引流资源报名转化趋势看板" force-render>
            <div>
              <div style="display:flex;margin:0.1rem 0 0.2rem 0;">
                <div v-for="(item, index) in tabControl" :key="index" class="tab" :class="{ active: item.selected }" @click="changeTab(item.value)">
                  <span v-if="!item.selected">{{ item.label }}</span>
                  <a v-else href="javascript:;">{{ item.label }}</a>
                </div>
              </div>
            </div>
            <div>
              <a-row>
                <template v-for="item in tabControl">
                  <a-col :span="12" v-if="item.selected">
                    <div>{{ item.label }}</div>
                    <div style="width:90%;" v-if="!chartLoading">
                      <!-- !item.chartLoading -->
                      <a-spin :spinning="item.chartLoading">
                        <f-charts
                          :dataZoomEndValue="15"
                          :fontSizeX="10"
                          :dataZoomShow="true"
                          :type="item.type"
                          :data="item.chartsValue"
                          :format="item.format"
                          :tooltip="item.tooltip"
                          :showSeriesLabel="true"
                          :toolTipValueFormatter="item.toolTipValueFormatter"
                          :valueFormatter="item.valueFormatter"
                        ></f-charts>
                      </a-spin>
                    </div>
                  </a-col>
                </template>
              </a-row>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="客服引流资源报名转化表">
            <service-resource-conversion ref="conversionTable" :queryParams="queryParams" />
          </a-tab-pane>
          <a-tab-pane key="4" tab="客服引流资源报名对比表">
            <service-resource-contrast ref="contrastTable" :queryParams="queryParams" />
          </a-tab-pane>
          <a-tab-pane key="5" tab="引流资源报名转化趋势报表（明细）">
            <serviceResourceTrendDetail ref="trendTable" :queryParams="queryParams" />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { SearchComPro } from '@/components'
import FCharts from '@/components/FCharts/FCharts'
import { listChannelTree } from '@/api/common'
import { ageBracketNoPermissionList, stuTagNoPermissionList } from '@/api/system'
import { listDeptUserByService } from '@/api/organize'
import serviceResourceConversion from './components/serviceResourceConversion.vue'
import serviceResourceContrast from './components/serviceResourceContrast.vue'
import serviceResourceTrendDetail from './components/serviceResourceTrendDetail.vue'
import {
  businessReport,
  cleanAnalysis,
  anaSource,
  servicePercent,
  applyAmount,
  applyPercent,
  enrollmentRate,
  customerUnitPrice,
  resourceValue,
  analysisValue
} from '@/api/echart/analysisChannel'
const date = new Date()
let day = date.getDate()
const defaultStart = moment(date)
  .date(1)
  .format('YYYY-MM-DD')
let defaultEnd = moment()
  .subtract(1, 'days')
  .format('YYYY-MM-DD')
if (day == 1) {
  defaultEnd = defaultStart
}
// FIXME:
let defaultChannel = ['1ae98845-de06-4870-8161-d47559cfdd7e', '65c45032-6fd4-4778-b6fb-08b3b6b8ed8f','9fc327ae-5e78-4022-92f5-c168e3036bac', 'a5fc3fc4-fb96-4135-917a-7904392ff87a', 'a8ec28b3-903d-4597-aaa6-561b067eb606', 'ad07e674-d47d-4478-b511-d74008354fc0', 'e78f0c4e-0e8f-401b-9a6e-6f6e9b988a3f']

// 客服组id
let serviceId = `5e55b8e2-88a7-4f2c-89d2-80d50902ade5`


const renderContent1 = (value, row, index) => {
  const obj = {
    children: value,
    attrs: {}
  }
  if (row.isTotal || row.isTotalAll) {
    obj.attrs.colSpan = 0
  }
  return obj
}
export default {
  name: 'businessChannel',
  components: {
    FCharts,
    SearchComPro,
    serviceResourceConversion,
    serviceResourceContrast,
    serviceResourceTrendDetail
  },
  data() {
    return {
      tabIndex: '1',
      chartLoading: true,
      loadData: [],
      columns: [
        {
          align: 'center',
          title: '渠道',
          width: 200,
          dataIndex: 'channelNames',
          customRender: (text, row, index) => {
            return {
              children: row.channelNames === '合计' ? <span style="color:red;font-size:18px;">{text}</span> : <span style="font-size:16px;">{text}</span>,
              attrs: {}
            }
          }
        },
        {
          title: '总引流数',
          colSpan: 1,
          align: 'center',
          dataIndex: 'netCount'
        },
        {
          title: '重复数',
          colSpan: 1,
          align: 'center',
          dataIndex: 'repeatCount'
        },
        {
          title: '重复率',
          colSpan: 1,
          align: 'center',
          dataIndex: 'repeatRate'
        },
        {
          title: '净引流数',
          colSpan: 1,
          align: 'center',
          dataIndex: 'netDrainage'
        },
        {
          title: '资源数',
          colSpan: 1,
          align: 'center',
          dataIndex: 'resourcesNumber'
        },
        {
          title: '客服转化率',
          align: 'center',
          dataIndex: 'conversionRate',
          colSpan: 1,
          customRender: (text, record) => {
            return text + '%'
          }
        },
        {
          title: '试课数',
          align: 'center',
          dataIndex: 'auditionNumber',
          colSpan: 1
        },
        {
          title: '试课率',
          align: 'center',
          dataIndex: 'auditionRate',
          colSpan: 1,
          customRender: (text, record) => {
            return text + '%'
          }
        },
        {
          title: '试课报名数',
          align: 'center',
          dataIndex: 'auditionEnrollNumber',
          colSpan: 1
        },
        {
          title: '试课报名率',
          align: 'center',
          dataIndex: 'auditionEnrollRate',
          colSpan: 1,
          customRender: (text, record) => {
            return text + '%'
          }
        },
        {
          title: '总报名数',
          align: 'center',
          dataIndex: 'tEnrollNumber',
          colSpan: 1
        },
        {
          title: '总报名率',
          dataIndex: 'totalEnrollRate',
          align: 'center',
          colSpan: 1,
          customRender: (text, record) => {
            return text + '%'
          }
        },
        {
          title: '当期报名数',
          align: 'center',
          dataIndex: 'cEnrollNumber',
          colSpan: 1
        },
        {
          title: '当期报名率',
          dataIndex: 'previousEnrollRate',
          align: 'center',
          colSpan: 1,
          customRender: (text, record) => {
            return text + '%'
          }
        },
        {
          title: '报名金额',
          align: 'center',
          dataIndex: 'enrollAmount',
          colSpan: 1
        },
        {
          title: '客单价',
          align: 'center',
          dataIndex: 'perTicketValue',
          colSpan: 1
        },
        {
          title: '资源价值',
          align: 'center',
          dataIndex: 'resouceValue',
          colSpan: 1
        },
        {
          title: '净引流价值',
          align: 'center',
          dataIndex: 'draingeValue',
          colSpan: 1
        }
      ],
      queryParams: {
        channelIds: defaultChannel.join(','),
        serviceId: null,
        startDate: defaultStart,
        endDate: defaultEnd
      },
      //搜索项
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '资源录入日期',
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'treeSelect',
          key: 'channelIds',
          isShow: true,
          label: '渠道',
          placeholder: '请选择渠道',
          expandAll: false,
          mutiple: true,
          search: true,
          show: true,
          selectFather: true,
          noBranch: true,
          defaultVal: defaultChannel,
          treeOps: {
            api: listChannelTree,
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'treeSelect',
          key: 'serviceId',
          isShow: true,
          label: '客服',
          placeholder: '请选择客服',
          expandAll: false,
          mutiple: true,
          search: true,
          show: true,
          selectFather: true,
          noBranch: true,
          treeCheckable: true,
          defaultVal: [],
          treeOps: {
            api: listDeptUserByService,
            label: 'name',
            value: 'id',
            children: 'orgUser'
          }
        },
        {
          type: 'select', // 静态select框
          key: 'isYouGe',
          label: '是否包含优鸽',
          show: true,
          placeholder: '请选择是否包含优鸽',
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
        {
          type: 'select',
          key: 'isRefund',
          label: '是否含退费',
          show: true,
          placeholder: '请选择是否含退费',
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
        {
          type: 'select', // 静态select框
          key: 'resourceType',
          label: '资源类型',
          show: true,
          placeholder: '请选择资源类型',
          staticArr: [
            {
              string: '全部',
              value: ''
            },
            {
              string: '线上课',
              value: 'A'
            },
            {
              string: '线下课',
              value: 'B'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'regionalAttribution',
          label: '地域归属',
          show: true,
          placeholder: '请选择地域归属',
          staticArr: [
            {
              string: '本地资源',
              value: 'A'
            },
            {
              string: '地级市资源',
              value: 'B'
            },
            {
              string: '外地资源',
              value: 'C'
            }
          ]
        },
        {
          type: 'select', // 静态select框
          key: 'ageBracket',
          label: '年龄段',
          show: true,
          placeholder: '请选择年龄段',
          apiOption: {
            api: ageBracketNoPermissionList, // promise类型的接口
            string: this.getAgeList,
            value: 'id'
          }
        },
        {
          type: 'select', //动态select框
          key: 'stuTag',
          show: true,
          label: '标签',
          placeholder: '请选择标签',
          apiOption: {
            api: stuTagNoPermissionList, // promise类型的接口
            string: 'tagName',
            value: 'id'
          }
        }
      ],
      tabControl: [
        {
          label: '净引流数',
          value: 1,
          selected: true,
          type: 'bar',
          chartsValue: [],
          format: { x: 'time', y: 'data' },
          tooltip: '净引流数',
          chartLoading: false
        },
        { label: '资源数', value: 2, selected: true, type: 'bar', chartsValue: [], format: { x: 'time', y: 'data' }, tooltip: '资源数' },
        {
          label: '客服转化率',
          value: 3,
          selected: true,
          type: 'line',
          chartsValue: [],
          format: { x: 'time', y: 'data' },
          tooltip: '客服转化率',
          chartLoading: false,
          toolTipValueFormatter: this.toolTipValueFormatter,
          valueFormatter: this.valueFormatter
        },
        {
          label: '报名金额',
          value: 4,
          selected: true,
          type: 'bar',
          chartsValue: [],
          format: { x: 'time', y: 'data' },
          tooltip: '报名金额',
          chartLoading: false
        },
        // {
        //   label: '报名率',
        //   value: 5,
        //   selected: true,
        //   type: 'line',
        //   chartsValue: [],
        //   format: { x: 'time', y: 'data' },
        //   tooltip: '报名率',
        //   chartLoading: false,
        //   toolTipValueFormatter: this.toolTipValueFormatter,
        //   valueFormatter: this.valueFormatter
        // },
        {
          label: '总报名率',
          value: 5,
          selected: true,
          type: 'line',
          chartsValue: [],
          format: { x: 'time', y: 'data' },
          tooltip: '报名率',
          chartLoading: false,
          toolTipValueFormatter: this.toolTipValueFormatter,
          valueFormatter: this.valueFormatter
        },
        {
          label: '当期报名率',
          value: 6,
          selected: true,
          type: 'line',
          chartsValue: [],
          format: { x: 'time', y: 'data' },
          tooltip: '报名率',
          chartLoading: false,
          toolTipValueFormatter: this.toolTipValueFormatter,
          valueFormatter: this.valueFormatter
        },
        { label: '客单价', value: 7, selected: true, type: 'bar', chartsValue: [], format: { x: 'time', y: 'data' }, tooltip: '客单价', chartLoading: false },
        {
          label: '资源价值',
          value: 8,
          selected: true,
          type: 'bar',
          chartsValue: [],
          format: { x: 'time', y: 'data' },
          tooltip: '资源价值',
          chartLoading: false
        },
        {
          label: '引流价值',
          value: 9,
          selected: true,
          type: 'bar',
          chartsValue: [],
          format: { x: 'time', y: 'data' },
          tooltip: '引流价值',
          chartLoading: false
        }
      ],
      loading: false
    }
  },
  computed: {
    isService() {
      if (this.$store.getters.isLeader) return false
      let depts = this.$store.getters.userInfo?.depts
      if (!depts) return false
      let isService = false
      for (const item of depts) {
        const {parentDeptId} = item
        if (parentDeptId === serviceId) {
          isService = true
          break
        }
      }
      return isService
    }
  },
  created() {
    if (this.isService) {
      let serviceIdSearchItem = this.searchParams.find(item => item.key == 'serviceId')
      let userId = this.$store.getters.userInfo.user.id
      serviceIdSearchItem.defaultVal = [userId]
      this.queryParams.serviceId = userId
    }
    this.init()
  },
  watch: {},
  methods: {
    //导出
    downloadStu() {
      let exportUrl = '/analysis/business/drainingResourcesAnalysisReportByExport'
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
    toolTipValueFormatter(a) {
      return Number(Number(a) * 100).toFixed(2) + '%'
    },
    valueFormatter(a) {
      return Number(a.value * 100).toFixed(2) + '%'
    },
    async init() {
      this.loading = true
      this.tabControl.forEach(item => {
        item.chartLoading = true
      })
      let that = this
      Promise.all([
        businessReport(this.queryParams),
        cleanAnalysis(this.queryParams),
        anaSource(this.queryParams),
        servicePercent(this.queryParams),
        applyAmount(this.queryParams),
        // applyPercent(this.queryParams),
        enrollmentRate(this.queryParams),
        enrollmentRate(Object.assign({ isPreviousPeriod: 'Y' }, this.queryParams)),
        customerUnitPrice(this.queryParams),
        resourceValue(this.queryParams),
        analysisValue(this.queryParams)
      ]).then(res => {
        res.forEach((data, index) => {
          if (index == 0) {
            that.loadData = data.data
            that.loading = false
          } else {
            that.tabControl[index - 1].chartsValue = data.data
            that.tabControl[index - 1].chartLoading = false
          }
        })
        that.chartLoading = false
      })
    },
    changeTab(val) {
      this.tabControl.forEach((item, index) => {
        if (item.value == val) {
          item.selected = !item.selected
        }
      })
    },
    getAgeList(item) {
      return item.ageStart + '-' + item.ageEnd
    },
    searchSubmit(data, reset) {
      this.queryParams = data
      if (reset == 'isReset') {
        this.queryParams = {
          channelIds: defaultChannel.join(','),
          startDate: defaultStart,
          endDate: defaultEnd
        }
      }
      if (this.queryParams.startDate) {
        this.$nextTick(() => {
          if (this.tabIndex == '3') {
            this.$refs.conversionTable.loadData()
          } else if (this.tabIndex === '4') {
            this.$refs.contrastTable.loadData()
          } else if (this.tabIndex === '5') {
            this.$refs.trendTable.loadData()
          } else {
            this.init()
          }
        })
      } else {
        this.$notification['error']({
          message: '系统通知',
          description: '请输入资源录入时间'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tab {
  text-align: center;
  border: 1px solid #ddd;
  padding: 5px 15px;
  min-width: 90px;
  cursor: pointer;
  &.active {
    border: 1px solid #1ba97b;
  }
}
</style>
