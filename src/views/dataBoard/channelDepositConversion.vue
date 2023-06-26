<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :searchParams="searchParams" @searchSubmit="searchSubmit"></search-com-pro>
    </a-card>

    <a-card :bordered="false">
      <s-table ref="table" :columns="columns" :data="loadData" :autoLoad="false" :locale="locale"
        :rowKey="(record, index) => index" :showPagination="false">
      </s-table>
    </a-card>



    <a-modal title="定金数明细" :maskClosable="false" destroyOnClose width="90%" :visible="detailVisible"
      @ok="detailVisible = false" @cancel="detailVisible = false">
      <a-table ref="detailTable" :loading="detailTableLoading" :columns="detailCols" :dataSource="detailList"
        :rowKey="(record, index) => index" :pagination="false"></a-table>
    </a-modal>
  </div>
</template>

<script>
import { STable, SearchComPro } from '@/components'
import { getSchoolList } from '@/api/education/card'
import { listEduDance, treeEduClassType, listChannelTree } from '@/api/common'
import FCharts from '@/components/FCharts/FCharts'
import { channelDepositConversion, channelDepositConversionDetail } from '@/api/echart/analysisChannel'
import moment from 'moment'
let defaultChannel = ['1ae98845-de06-4870-8161-d47559cfdd7e', '65c45032-6fd4-4778-b6fb-08b3b6b8ed8f']
const noPaddingCell = (record, rowIndex) => {
  return {
    style: {
      padding: '0px!important'
    }
  }
}
export default {
  name: 'channelDepositConversion',
  components: {
    STable,
    SearchComPro,
    FCharts
  },
  data() {
    return {
      moment,
      searchParams: [
        {
          type: 'treeSelect',
          isShow: !this.$store.getters.school_id,
          key: 'deptIds',
          label: '分配分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          treeCheckable: true,
          selectFather: true,
          show: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'month',
          key: 'startDate',
          show: true,
          isShow: true,
          label: '报名月份',
          placeholder: '月份',
          format: 'YYYY-MM',
        },
        {
          type: 'month',
          key: 'closingDate',
          show: true,
          isShow: true,
          label: '定金截止月份',
          placeholder: '月份',
          format: 'YYYY-MM',
        },
        {
          type: 'treeSelect',
          key: 'channelIds',
          isShow: true,
          label: '资源渠道',
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
          type: 'select',
          key: 'resourcesType',
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
          type: 'select',
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
          type: 'select',
          key: 'isYouGe',
          label: '是否包含优鸽',
          show: true,
          placeholder: '请选择是否包含优鸽',
          initialValue: 'N',
          initialIndex: 1,
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
          initialValue: 'Y',
          initialIndex: 0,
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
        // {
        //   type: 'select',
        //   key: 'isPrevious',
        //   label: '是否含往期资源报名',
        //   show: true,
        //   placeholder: '是否含往期资源报名',
        //   initialValue: 'N',
        //   initialIndex: 1,
        //   staticArr: [
        //     {
        //       string: '包含',
        //       value: 'Y'
        //     },
        //     {
        //       string: '不包含',
        //       value: 'N'
        //     }
        //   ]
        // },
        {
          type: 'cascader',
          key: 'resourcesClassType',
          label: '资源班型',
          placeholder: '请选择班型',
          show: true,
          treeOps: {
            api: treeEduClassType,
            type: 'D',
            label: 'name',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'resourcesDance',
          label: '资源舞种',
          placeholder: '请选择舞种',
          show: true,
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
      ],
      queryParams: {
        channelIds: defaultChannel.join(','),
      },
      columns: [
      ],
      locale: { emptyText: <div style='font-size: 30px;padding: 100px 0;'>请选择相关筛选条件后，再查询信息哦</div> },
      loadData: parameter => {
        const params = { ...parameter, ...this.queryParams }
        return channelDepositConversion(params).then(res => {
          return this.configColumns(res)
        })
      },
      detailVisible: false,
      detailTableLoading: false,
      detailCols: [],
      detailList: [],
      detailParams: {}
    }
  },
  computed: {
  },
  methods: {
    _refreshTable() {
      this.$refs.table.refresh()
    },
    configColumns(res) {
      const { data, queryMonth, resourcesCount } = res?.data

      if (!(data?.length > 0)) return

      this.columns = [
        {
          title: '渠道',
          fixed: 'left',
          colSpan: 1,
          align: 'center',
          customCell: noPaddingCell,
          width: 180,
          dataIndex: 'channelName',
        },
        {
          title: '查询月份',
          align: 'center',
          fixed: 'left',
          children: [
            {
              title: '资源数',
              align: 'center',
              children: [
                {
                  // title: <div>
                  //   <div style="height:45px"></div>
                  //   <div>报名月份</div>
                  // </div>,
                  title: ' ',
                  align: 'center',
                  width: 120,
                  customCell: noPaddingCell,
                  customRender: (value, record, index) => {
                    const obj = {
                      children: value,
                      attrs: {}
                    }
                    obj.children = (
                      <div>
                        <div class="table-cell-y">报名月份</div>
                        <div class="table-cell-y">新增报名数</div>
                        <div class="table-cell-y">新增全款数</div>
                        <div class="table-cell-y">新增定金数</div>
                        <div class="table-cell-y">新增补余数</div>
                        <div class="table-cell-y">累计补余数</div>
                        <div class="table-cell-y">累计补余率</div>
                        <div class="table-cell-y">全款金额</div>
                        <div class="table-cell-y">定金金额</div>
                        <div class="table-cell-y">补余金额</div>
                        <div class="table-cell-y">累计汇总报名金额</div>
                        <div class="table-cell-y">补余后资源价值</div>
                      </div>
                    )
                    return obj
                  },
                }
              ]
            }
          ]
        },
      ]


      let firstData = data[0]
      let monthCols = {
        title: queryMonth,
        align: 'center',
        children: [
          {
            title: resourcesCount,
            align: 'center',
            children: [
              {
                title: '转化数据',
                align: 'center',
                customCell: noPaddingCell,
                customRender: (value, record, index) => {
                  const obj = {
                    children: '',
                    attrs: {}
                  }
                  obj.children = (
                    <div class="flex">
                      {
                        record.months.map(monthData => {
                          return <div class="flex-1">
                            <div class="table-cell-y">{monthData.month}</div>
                            <div class="table-cell-y">{monthData.enrollNumber}</div>
                            <div class="table-cell-y">{monthData.fullNumber}</div>
                            {monthData.month == '累计' ? <a class="table-cell-y text-bold" onClick={() => this.openDetail(record)}>{monthData.depositNumber}</a> : <div class="table-cell-y">{monthData.depositNumber}</div>}
                            <div class="table-cell-y">{monthData.makeNumber}</div>
                            <div class="table-cell-y">{monthData.accumulateMakeNumber}</div>
                            <div class="table-cell-y">{monthData.accumulateMakeNumberRate}</div>
                            <div class="table-cell-y">{monthData.fullPrice}</div>
                            <div class="table-cell-y">{monthData.depositPrice}</div>
                            <div class="table-cell-y">{monthData.makePrice}</div>
                            <div class="table-cell-y">{monthData.enrollPrice}</div>
                            <div class="table-cell-y">{monthData.resoucesValue}</div>
                          </div>
                        })
                      }
                    </div>
                  )
                  return obj
                }
              }
            ]
          }
        ]
      }
      this.columns.push(monthCols)
      return res.data
    },
    openDetail(record) {
      this.detailParams = { ...this.queryParams, channelIds: record.channelId }
      this.detailVisible = true
      this.detailList = []
      this.detailTableLoading = true
      channelDepositConversionDetail(this.detailParams).then(res => {
        this.configDetailColumns(res)
      }).finally(() => {
        this.detailTableLoading = false
      })
    },
    configDetailColumns(res) {
      const { data } = res
      this.detailList = data
      this.detailCols = [
        {
          title: '资源录入日期',
          align: 'center',
          width: 180,
          dataIndex: 'createDate',
        },
        {
          title: '学员姓名',
          align: 'center',
          dataIndex: 'studentName',
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'studentPhone',
        },
        {
          title: '定金缴费金额（不含体验卡）',
          align: 'center',
          width: 120,
          dataIndex: 'depositPrice',
        },
        {
          title: '第一笔定金缴费日期',
          align: 'center',
          dataIndex: 'depositFristDate',
        },
      ]

      if (!(data?.length > 0)) return
      let firstDetailData = data[0]
      for (const monthIndex in firstDetailData.months) {
        let col = {
          title: firstDetailData.months[monthIndex].month,
          align: 'center',
          customRender: (value, record, index) => {
            let monthData = record.months[monthIndex]
            const obj = {
              children: monthData.makePrice,
              attrs: {}
            }
            return obj
          }
        }
        this.detailCols.push(col)
      }

      this.detailCols.push(
        {
          title: '合计',
          align: 'center',
          dataIndex: 'totalPrice',
        },
      )
    },
    searchSubmit(data, type) {
      if (type == 'isReset') {
        this.queryParams = {
          isYouGe: false,
          channelIds: defaultChannel.join(','),
        }
        return
      }

      const { closingDate, startDate } = data
      if (!startDate) {
        return this.$notification['warning']({
          message: '提示',
          description:
            '请选择报名月份',
        })
      }

      if (moment(closingDate).isBefore(moment(startDate))) {
        return this.$notification['warning']({
          message: '提示',
          description:
            '定金截止月份不能早于报名月份',
        })
      }

      this.queryParams = data
      this._refreshTable()
    },


  }
}
</script>

<style lang="less" scoped>
.table-cell-y {
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid #e8e8e8;
  // border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;

  padding: 0 20px;
  height: 48px;
}

div .table-cell-y:last-child {
  border-bottom: 0px;
}

.bottom-line {
  border-bottom: 1px solid #e8e8e8;
}

.font-bold {
  font-weight: bold;
}
</style>