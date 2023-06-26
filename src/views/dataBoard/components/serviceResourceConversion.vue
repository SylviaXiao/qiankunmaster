<template>
  <div>
    <div class="mb-10">
      <a-space>
        <a-button type="primary" @click="handleExport">导出</a-button>
        <a-button @click="loadData">刷新</a-button>
      </a-space>
    </div>
    <a-table
      ref="table"
      :columns="columns"
      :dataSource="dataSource"
      :scroll="{  }"
      :loading="loading"
      bordered
      :rowKey="(record, index) => index"
      :pagination="false"
    >
      <span slot="deptNameTitle">
        <div>客服组</div>
        <a class="py-16" @click="changeDeptNameFold">{{ deptName }}</a>
      </span>
      <span slot="serviceNameTitle">
        <div>客服</div>
        <a class="py-16" @click="changeServiceNameFold">{{ serviceName }}</a>
      </span>
    </a-table>
  </div>
</template>

<script>
import { getServiceResourceConversionReport, exportServiceResourceConversionReport } from '@/api/echart/analysisChannel'

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
      default: () => {}
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
          // title: '客服组',
          align: 'center',
          width: 150,
          fixed: 'left',
          ellipsis: false,
          dataIndex: 'deptName',
          customCell: noPaddingCell,
          scopedSlots: {
            title: 'deptNameTitle'
          },
          customRender: (value, record, index) => {
            const obj = {
              children: <div class="table-cell-y text-weight-b">{value}</div>,
              attrs: {}
            }
            if (this.isLastTotalRow(index)) {
              obj.attrs.colSpan = 2
            }
            return obj
          }
        },
        {
          // title: '客服',
          align: 'center',
          width: 150,
          fixed: 'left',
          ellipsis: false,
          dataIndex: 'serviceName',
          customCell: noPaddingCell,
          scopedSlots: {
            title: 'serviceNameTitle'
          },
          customRender: (value, record, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (this.isLastTotalRow(index)) {
              obj.attrs.colSpan = 0
            } else if (this.serviceOpens[index]) {
              obj.children = (
                <div>
                  {record.list.map(item => {
                    return <div class="table-cell-y">{item.serviceName}</div>
                  })}
                  {
                    <div class="table-cell-y text-weight-b background-grey">
                      {'合计'}
                      <a class="ml-8" onClick={() => this.changeServiceRowFold(index, 'close')}>
                        {'收起'}
                      </a>
                    </div>
                  }
                </div>
              )
            } else {
              obj.children = (
                <a onClick={() => this.changeServiceRowFold(index, 'open')}>
                  {'全部客服'}
                  <a-icon class="ml-8" type="menu-unfold" />
                </a>
              )
            }
            return obj
          }
        }
      ]
    }
  },
  computed: {
    isEmptyList() {
      let hasData = this.list?.length > 0
      return !hasData
    },
    dataSource() {
      if (this.list.length > 0) {
        if (this.deptNameOpen) return this.list
        return this.list.slice(-1)
      }
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
    this.fillColumns()
    this.loadData()
  },
  methods: {
    fillColumns() {
      const configs = [
        ['总引流数', 'netCount'],
        ['重复数', 'repeatCount'],
        ['重复率', 'repeatRate'],
        ['净引流数', 'netDrainage'],
        ['资源数', 'resourcesNumber'],
        ['客服转化率', 'conversionRate', 'bold'],
        ['总报名数', 'tEnrollNumber'],
        ['总报名率', 'totalEnrollRate'],
        ['客服业绩', 'servicePerformance'],
        ['报名金额', 'enrollAmount'],
        ['资源价值 ', 'resouceValue'],
        ['净引流价值', 'draingeValue']
      ]

      configs.forEach(arr => {
        const col = {
          title: arr[0],
          align: 'center',
          // width: 100,
          customCell: arr[2] === 'bold' ? noPaddingBoldCell : noPaddingCell,
          customRender: (value, record, index) => {
            return this.getDataRowCustomRender(arr[1], record, index)
          }
        }
        this.columns.push(col)
      })
    },
    async loadData() {
      this.loading = true
      try {
        let res = await getServiceResourceConversionReport(this.queryParams)
        this.list = res.data
      } finally {
        this.loading = false
      }
    },
    changeDeptNameFold() {
      this.deptNameOpen = !this.deptNameOpen
      this.serviceNameOpen = false
    },
    changeServiceNameFold() {
      this.deptNameOpen = true
      this.serviceNameOpen = !this.serviceNameOpen

      this.serviceOpens = []
      if (this.serviceNameOpen) {
        for (const index in this.dataSource) {
          this.serviceOpens[index] = true
        }
      }
    },
    changeServiceRowFold(index, action = 'open') {
      this.$set(this.serviceOpens, index, action === 'open')
      this.$forceUpdate()
    },
    isLastTotalRow(index) {
      // 非展开的情况下
      let cond1 = !this.deptNameOpen && index == 0
      // 展开的情况下最后一行
      let cond2 = this.deptNameOpen && this.list?.length - 1 == index
      return this.list?.length > 0 && (cond1 || cond2)
    },
    getDataRowCustomRender(dataIndex, record, index) {
      const obj = {
        children: (
          <div>
            <div class="table-cell-y">{this.getLocaleNum(record.count[dataIndex])}</div>
          </div>
        ),
        attrs: {}
      }
      if (this.isLastTotalRow(index) && this.serviceNameOpen) {
      } else if (this.serviceOpens[index]) {
        obj.children = (
          <div>
            {record.list.map(item => {
              return <div class="table-cell-y">{this.getLocaleNum(item[dataIndex])}</div>
            })}
            {<div class="table-cell-y background-grey">{this.getLocaleNum(record.count[dataIndex])}</div>}
          </div>
        )
      }
      return obj
    },
    getLocaleNum(val) {
      let num = Number(val)
      if (Number.isNaN(num)) return val
      return num.toLocaleString()
    },
    async handleExport() {
      let res = await exportServiceResourceConversionReport(this.queryParams)
      this.$tools.exportExcel(res, '客服引流资源报名转化表')
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
