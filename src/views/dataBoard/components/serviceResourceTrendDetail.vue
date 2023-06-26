<template>
  <div>
    <div class="mb-10">
      <a-space>
        <a-button type="primary" @click="handleExport">导出</a-button>
        <a-button @click="loadData">刷新</a-button>
      </a-space>
    </div>
    <a-table ref="table" :columns="columns" :dataSource="dataSource" :loading="loading" :scroll="{}" bordered
      :rowKey="(record, index) => index" :pagination="false">
      <template slot="name" slot-scope="text">
        <a>{{ text }}</a>
      </template>
    </a-table>
  </div>
</template>

<script>

import {
  businessReportDetail,
  exportbusinessReportDetail
} from '@/api/echart/analysisChannel'

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
  name: 'serviceResourceConversion',
  components: {},
  props: {
    queryParams: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      deptNameOpen: false,
      serviceNameOpen: false,
      serviceOpens: [],
      columns: [
        {
          align: 'center',
          title: '一级渠道',
          width: 120,
          dataIndex: 'channelName1',
        },
        {
          align: 'center',
          title: '二级渠道',
          width: 120,
          dataIndex: 'channelName2',
        },
        {
          align: 'center',
          title: '三级渠道',
          width: 120,
          dataIndex: 'channelName3',
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
    }
  },
  computed: {
    isEmptyList() {
      let hasData = this.list?.length > 0
      return !hasData
    },
    dataSource() {
      // if (this.list.length > 0) {
      //   if (this.deptNameOpen) return this.list
      //   return this.list.slice(-1)
      // }
      return this.list
    },
    deptName() {
      return this.deptNameOpen ? '收起' : '展开全部'
    },
    serviceName() {
      return this.serviceNameOpen ? '收起' : '展开全部'
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        let res = await businessReportDetail(this.queryParams)
        this.list = res.data
      } finally {
        this.loading = false
      }
    },
    getLocaleNum(val) {
      let num = Number(val)
      if (Number.isNaN(num)) return val
      return num.toLocaleString()
    },
    async handleExport() {
      let res = await exportbusinessReportDetail(this.queryParams)
      this.$tools.exportExcel(res, `${this.queryParams.startDate}~${this.queryParams.endDate}引流资源报名转化趋势报表（明细）`)
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

  // padding: 0 20px;
  height: 48px;
}

div .table-cell-y:last-child {
  border-bottom: 0px;
}

.background-grey {
  background: rgba(0, 0, 0, 0.1);
}
</style>
