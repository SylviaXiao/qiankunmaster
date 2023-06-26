<template>
  <div>
    <a-card style="margin: 20px 0;">
      <search-com-pro ref="searchForm" :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit" />
    </a-card>
    <a-card>
      <a-table
        ref="table"
        :columns="columns"
        :dataSource="dataSource"
        :scroll="{ x: 1000, y: 520 }"
        :loading="loading"
        bordered
        :rowKey="(record, index) => index"
        :pagination="false"
      >
        <span slot="classTypeNameTitle">
          <div>班型</div>
          <a class="py-16" @click="changeClassTypeNameFold">{{ classTypeName }}</a>
        </span>
        <span slot="danceTypeNameTitle">
          <div>舞种</div>
          <a class="py-16" @click="changeDanceTypeNameFold">{{ danceTypeName }}</a>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { SearchComPro } from '@/components'
import { getBalanceByDance } from '@/api/stat'
import { getSchoolList } from '@/api/education/card'
import { listEduDance, listEduType } from '@/api/common'
import moment from 'moment'
const date = new Date()
const defaultStart = moment(date)
  .startOf('month')
  .format('YYYY-MM-DD')
const defaultEnd = moment(date).format('YYYY-MM-DD')

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
  name: 'balanceSheetDanceType',
  components: {
    SearchComPro
  },
  data() {
    return {
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '时间',
          show: true,
          placeholder: '请选择时间',
          allowClear: false,
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          disabledType: 'disableBefore20221001'
        },
        {
          type: 'treeSelect',
          key: 'deptIds',
          label: '分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          isShow: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'danceIds',
          label: '舞种',
          placeholder: '请选择舞种',
          mode: 'multiple',
          show: true,
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'classTypeIds',
          label: '班级类型',
          placeholder: '请选择班级类型',
          mode: 'multiple',
          show: true,
          apiOption: {
            api: listEduType,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'treeSelect',
          key: 'cardStatus',
          label: '卡状态',
          placeholder: '请选择卡状态',
          mode: 'multiple',
          expandAll: true,
          mutiple: true,
          isShow: true,
          show: true,
          treeCheckable: true,
          selectFather: true,
          treeOps: {
            label: 'label',
            value: 'value',
            children: 'children',
            staticOptions: [
              {
                label: '未开卡',
                value: 'A'
              },
              {
                label: '已开卡',
                value: 'B',
                children: [
                  {
                    label: '结业',
                    value: 'E'
                  },
                  {
                    label: '已缴清',
                    value: 1
                  },
                  {
                    label: '未缴清',
                    value: 0
                  },
                  {
                    label: '转卡',
                    value: 'G'
                  },
                  {
                    label: '停课',
                    value: 'C'
                  },
                  {
                    label: '退卡',
                    value: 'D'
                  },            {
                    string: '撤销',
                    value: 'F'
                  },
                  {
                    string: '结转',
                    value: 'G'
                  }
                ]
              }
            ]
          }
        }
      ],
      queryParams: {
        startDate: defaultStart,
        endDate: defaultEnd
      },
      columns: [
        {
          // title: '班型',
          align: 'center',
          width: 150,
          fixed: 'left',
          ellipsis: true,
          dataIndex: 'typeName',
          customCell: noPaddingCell,
          scopedSlots: {
            title: 'classTypeNameTitle'
          },
          customRender: (value, record, index) => {
            const obj = {
              children: <div class="table-cell-y text-weight-b">{value}</div>,
              attrs: {}
            }
            if (this.isLastTotalRow(index)) {
              // obj.children = <div class="text-weight-b">{value}</div>
              obj.children = (
                <div class="table-cell-y-double flex">
                  <div class="text-weight-b flex-1">{value}</div>
                  <div style="width: 1px;height:100%;background: #e8e8e8;" />
                  <div class="f-col" style="width:100px;height: 100%">
                    <div class="table-cell-y">卡数</div>
                    <div class="table-cell-y">金额</div>
                  </div>
                </div>
              )
              obj.attrs.colSpan = 2
            }
            return obj
          }
        },
        {
          // title: '舞种',
          align: 'center',
          width: 200,
          fixed: 'left',
          ellipsis: true,
          dataIndex: 'danceTypeName',
          customCell: noPaddingCell,
          scopedSlots: {
            title: 'danceTypeNameTitle'
          },
          customRender: (value, record, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            if (this.isLastTotalRow(index)) {
              obj.attrs.colSpan = 0
            } else if (this.branchOpens[index]) {
              obj.children = (
                <div>
                  {record.list.map(item => {
                    return (
                      <div class="flex align-stretch table-cell-border-bottom">
                        <div class="flex-1">{item.danceName}</div>
                        <div class="divider" />
                        <div class="f-col" style="width:100px;height: 100%">
                          <div class="table-cell-y">卡数</div>
                          <div class="table-cell-y">金额</div>
                        </div>
                      </div>
                    )
                  })}
                  {
                    <div class="flex background-grey">
                      <div class="flex-1 table-cell-y text-weight-b">
                        {'总计'}
                        <a class="ml-8" onClick={() => this.changeBranchRowFold(index, 'close')}>
                          {'收起'}
                        </a>
                      </div>
                      <div class="divider" />
                      <div class="f-col" style="width:100px;height: 100%">
                        <div class="table-cell-y">卡数</div>
                        <div class="table-cell-y">金额</div>
                      </div>
                    </div>
                  }
                </div>
              )
            } else {
              obj.children = (
                <div class="table-cell-y-double flex">
                  <a class="flex-1" onClick={() => this.changeBranchRowFold(index, 'open')}>
                    {'全部舞种'}
                    <a-icon class="ml-8" type="menu-unfold" />
                  </a>
                  <div class="divider" />
                  <div class="f-col" style="width:100px;height: 100%">
                    <div class="table-cell-y">卡数</div>
                    <div class="table-cell-y">金额</div>
                  </div>
                </div>
              )
            }
            return obj
          }
        },
        {
          title: '收入',
          children: [
            {
              title: '未开卡',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('sNoOpenCard', record, index)
              }
            },
            {
              title: '已开卡',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('sOpenCard', record, index)
              }
            },
            {
              title: '（合计收入）',
              align: 'center',
              width: 140,
              customCell: noPaddingBoldCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('sCountCard', record, index)
              }
            }
          ]
        },
        {
          title: '退费',
          children: [
            {
              title: '未开卡',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('tNoOpenCard', record, index)
              }
            },
            {
              title: '已开卡',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('tOpenCard', record, index)
              }
            },
            {
              title: '（合计退费）',
              align: 'center',
              width: 140,
              customCell: noPaddingBoldCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('tCountCard', record, index)
              }
            }
          ]
        },
        {
          title: '课耗',
          children: [
            {
              title: '结业',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('graduationList', record, index)
              }
            },
            {
              title: '使用中',
              children: [
                {
                  title: '已缴清',
                  align: 'center',
                  width: 140,
                  customCell: noPaddingCell,
                  customRender: (value, record, index) => {
                    return this.getDataRowCustomRender('useInPaidUpYes', record, index)
                  }
                },
                {
                  title: '未缴清',
                  align: 'center',
                  width: 140,
                  customCell: noPaddingCell,
                  customRender: (value, record, index) => {
                    return this.getDataRowCustomRender('useInPaidUpNo', record, index)
                  }
                }
              ]
            },
            {
              title: '转卡',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('carryForward', record, index)
              }
            },
            {
              title: '停课',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('suspendClass', record, index)
              }
            },
            {
              title: '退卡',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('cardRefund', record, index)
              }
            },
            {
              title: '（合计课耗）',
              align: 'center',
              width: 140,
              customCell: noPaddingBoldCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('countConsume', record, index)
              }
            }
          ]
        },
        {
          title: '累计总负债',
          children: [
            {
              title: '未开卡',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('countNoOpenCard', record, index)
              }
            },
            {
              title: '已开卡',
              align: 'center',
              width: 140,
              customCell: noPaddingCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('cardOpened', record, index)
              }
            },
            {
              title: '（合计总负债）',
              align: 'center',
              width: 140,
              customCell: noPaddingBoldCell,
              customRender: (value, record, index) => {
                return this.getDataRowCustomRender('count', record, index)
              }
            }
          ]
        }
      ],
      list: [],
      loading: false,
      classTypeNameOpen: false,
      danceTypeNameOpen: false,
      branchOpens: []
    }
  },
  computed: {
    dataSource() {
      if (this.list.length > 0) {
        if (this.classTypeNameOpen) return this.list
        return this.list.slice(-1)
      }
      return this.list
    },
    classTypeName() {
      return this.classTypeNameOpen ? '收起' : '展开全部班型'
    },
    danceTypeName() {
      return this.danceTypeNameOpen ? '收起' : '展开全部舞种'
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        let res = await getBalanceByDance(this.queryParams)
        this.list = res.data
      } finally {
        this.loading = false
      }
    },
    searchSubmit(e, type) {
      if (type == 'isReset') {
        this.queryParams = {
          startDate: defaultStart,
          endDate: defaultEnd
        }
      } else {
        this.queryParams = e
      }
      this.loadData()
    },
    changeClassTypeNameFold() {
      this.classTypeNameOpen = !this.classTypeNameOpen
      this.danceTypeNameOpen = false
      for (const index in this.dataSource) {
          this.branchOpens[index] = false
      }
    },
    changeDanceTypeNameFold() {
      this.classTypeNameOpen = true
      this.danceTypeNameOpen = !this.danceTypeNameOpen

      this.branchOpens = []
      if (this.danceTypeNameOpen) {
        for (const index in this.dataSource) {
          this.branchOpens[index] = true
        }
      }
    },
    changeBranchRowFold(index, action = 'open') {
      this.$set(this.branchOpens, index, action === 'open')
      this.$forceUpdate()
    },
    isLastTotalRow(index) {
      // 非展开的情况下
      let cond1 = !this.classTypeNameOpen && index == 0
      // 展开的情况下最后一行
      let cond2 = this.classTypeNameOpen && this.list?.length - 1 == index
      return this.list?.length > 0 && (cond1 || cond2)
    },
    getDataRowCustomRender(dataIndex, record, index) {
      const obj = {
        children: (
          <div>
            <div class="table-cell-y">{this.getCurrencyString(record.numberCount[dataIndex])}</div>
            <div class="table-cell-y table-cell-border-bottom">{this.getCurrencyString(record.moneyCount[dataIndex])}</div>
          </div>
        ),
        attrs: {}
      }
      if (this.isLastTotalRow(index) && this.danceTypeNameOpen) {
      } else if (this.branchOpens[index]) {
        obj.children = (
          <div>
            {record.list.map(item => {
              return (
                <div class="table-cell-border-bottom">
                  <div class="table-cell-y">{this.getCurrencyString(item.numberMap[dataIndex])}</div>
                  <div class="table-cell-y">{this.getCurrencyString(item.moneyMap[dataIndex])}</div>
                </div>
              )
            })}
            <div>
              <div class="table-cell-y background-grey">{this.getCurrencyString(record.numberCount[dataIndex])}</div>
              <div class="table-cell-y background-grey">{this.getCurrencyString(record.moneyCount[dataIndex])}</div>
            </div>
          </div>
        )
      }
      return obj
    },
    getCurrencyString(val) {
      let result = Number(parseInt(val)).toLocaleString()
      return result
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

.table-cell-border-bottom {
  border-bottom: 1px solid #e8e8e8;
}

.table-cell-y-double:extend(.table-cell-y) {
  border-bottom: 0px;
  height: 96px;
}

.divider {
  width: 1px;
  height: 96px;
  background: #e8e8e8;
}

.background-grey {
  background: rgba(0, 0, 0, 0.1);
}
</style>
