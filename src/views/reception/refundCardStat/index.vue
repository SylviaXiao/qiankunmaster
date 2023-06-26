<template>
  <div>
    <a-card style="margin: 20px 0;">
      <search-com-pro ref="searchForm" :style="{ padding: '10px 0' }" :searchParams="searchParams" @searchSubmit="searchSubmit" />
    </a-card>
    <a-card>
      <div class="mb-10">
        <a-space>
          <a-button @click="handleExport">导出</a-button>
        </a-space>
      </div>
      <a-table
        ref="table"
        :columns="columns"
        :dataSource="dataSource"
        :scroll="{}"
        :loading="loading"
        bordered
        :rowKey="(record, index) => index"
        :pagination="false"
      >
        <span slot="regionNameTitle">
          <div>地区</div>
          <a class="py-16" @click="changeRegionNameFold">{{ regionName }}</a>
        </span>
        <span slot="branchNameTitle">
          <div>分馆</div>
          <a class="py-16" @click="changeBranchNameFold">{{ branchName }}</a>
        </span>
        <template v-for="columns in secondTitles">
          <template v-for="(item, innerIndex) in columns">
            <span :slot="item[1]">
              <a-tooltip v-if="item[2]">
                <template slot="title">
                  <div v-for="content in item[2]">{{ content }}</div>
                </template>
                {{ item[0] }}
              </a-tooltip>
              <div v-else>{{ item[0] }}</div>
            </span>
          </template>
        </template>
        <span>
          <a-tooltip>
            <template slot="title">
              prompt text
            </template>
            Tooltip will show when mouse enter.
          </a-tooltip>
        </span>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { getRefundCardList, exportRefundCard } from '@/api/recep'
import { listOrgDept, getAllSysFeeItem, pageSplitRule, getSchoolList, removeRule } from '@/api/education/card'
import { treeEduClassType, listEduDance, listEduType } from '@/api/common'
import moment from 'moment'
import { SearchComPro } from '@/components'

const customHeaderCell1 = column => {
  return {
    style: {
      background: '#Eefbff'
    }
  }
}

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

const defaultStart = moment()
  .startOf('month')
  .format('YYYY-MM-DD')
const defaultEnd = moment().format('YYYY-MM-DD')

// FIXME: 搜索组件重构，默认选择逻辑放入到搜索子组件种
const schoolIds = [
  '0c18166a-679b-414e-ac2e-c05ba7a2f4c4',
  '8f63afe7-09ca-4d11-ac51-1187e4381e63',
  '407913a7-76ff-40ce-967f-0ce0bf0bcdd3',
  '8109e909-8c8e-463a-9e10-a0804bc59b79',
  '150d8748-87ab-4935-8f6f-7233d1294413',
  '4c58a4b3-157b-493f-8b72-707196a26453',
  'e07cad7c-7415-421c-a77e-48146d33a3bc',
  '0c185455-7ae8-4207-a517-91a2f5f26030',
  '88c5e24d-15c1-4e7c-adfb-f5e291562c33',
  '5aa46e02-28b9-4e31-936f-60721e07696d',
  '2d30de5a-9e47-4669-a9e9-534085ab6353',
  '7b0f4b73-83d9-4d46-adb0-78138e7ed633',
  '080aabad-e46b-479e-b130-169e970427e0',
  '66298d15-894b-4e48-9551-5d3795470304',
  '4e94a672-0bbd-48cd-ab50-8db3a4f4a57f',
  
  'b337887b-ce9d-49e6-89c5-4f822c94d457',
  '5c3f5874-f9aa-437a-b1cc-9c5cf6339c3f',
  '50232e74-16d1-438d-9c09-bc7454b13fe0',
  '999e8fb9-6c98-4cc5-bab3-2a2937a36836',
  'd923d38e-1699-4137-8f2a-315dcf2fa017',
  '5c0f0a94-346f-4e82-8848-f8882a7ac0ae',
  '7aa9901b-6d7f-44a3-8640-e0935516514c',
  '1207948e-746c-4dc3-9dd8-ab9c4493b49e',
  '47a6e64a-c166-4bb6-874c-f7e5c91666d7',
  'c066c789-e642-45c8-9486-d7e684d44dca',
  '457cadbe-f9a8-4d18-87b4-85051f99898b',
  '6209c9c1-9b8f-42f2-9214-a7db8d5ece5a',
  'b29cfda3-9609-4939-a8c4-4fe240f54f91'
]

export default {
  name: 'refundCardStat',
  components: {
    SearchComPro
  },
  data() {
    let defaultSchoolId = this.$store.getters.school_id ? [this.$store.getters.school_id] : schoolIds
    return {
      defaultSchoolId,
      list: [],
      loading: false,
      regionNameOpen: false,
      branchNameOpen: false,
      branchOpens: [],
      firstTitles: [],
      secondTitles: [],
      queryParams: {
        startDate: defaultStart,
        endDate: defaultEnd
      },
      searchParams: [
        {
          type: 'treeSelect',
          isShow: true,
          show: true,
          key: 'deptIds',
          label: '分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
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
          label: '退费时间',
          isShow: true,
          show: true,
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultVal: [moment(defaultStart, 'YYYY-MM-DD'), moment(defaultEnd, 'YYYY-MM-DD')],
          isDate: true
        },
        {
          type: 'select',
          key: 'danceId',
          show: true,
          label: '舞种',
          mode: 'multiple',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'eduTypeId',
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
          type: 'select',
          key: 'isExperience',
          isShow: true,
          label: '含体验卡',
          show: true,
          placeholder: '请选择',
          staticArr: [
            {
              string: '包含',
              value: ''
            },
            {
              string: '不含',
              value: 0
            }
          ]
        }
      ],
      columns: [
        {
          // title: '地区',
          align: 'center',
          // width: 160,
          // fixed: 'left',
          // ellipsis: true,
          customCell: noPaddingCell,
          dataIndex: 'regionName',
          scopedSlots: {
            title: 'regionNameTitle'
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
          // title: '分馆',
          align: 'center',
          width: 150,
          // fixed: 'left',
          // ellipsis: true,
          customCell: noPaddingCell,
          dataIndex: 'branchName',
          scopedSlots: {
            title: 'branchNameTitle'
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
                    return <div class="table-cell-y">{item.branchName}</div>
                  })}
                  {
                    <div class="table-cell-y text-weight-b background-grey">
                      {'总计'}
                      <a class="ml-8" onClick={() => this.changeBranchRowFold(index, 'close')}>
                        {'收起'}
                      </a>
                    </div>
                  }
                </div>
              )
            } else {
              obj.children = (
                <a onClick={() => this.changeBranchRowFold(index, 'open')}>
                  {'全部分馆'}
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
        if (this.regionNameOpen) return this.list
        return this.list.slice(-1)
      }
      return this.list
    },
    regionName() {
      return this.regionNameOpen ? '收起' : '展开全部'
    },
    branchName() {
      return this.branchNameOpen ? '收起' : '展开全部'
    }
  },
  created() {
    this.fillColumns()
    this.loadData()
  },
  methods: {
    searchSubmit(data, type) {
      this.queryParams = data
      if (type == 'isReset') {
        this.queryParams = {
          startDate: defaultStart,
          endDate: defaultEnd
        }
      }
      this.loadData()
    },
    fillColumns() {
      this.firstTitles = ['新报退卡', '续报退卡']
      this.secondTitles = [
        [
          [
            '开卡卡数',
            'newUseNumber',
            [
              '1、开卡卡数（一个学员退卡数量不去重',
              '1）取退费时间筛选段内的退卡卡数',
              '2）退卡卡种：',
              '①退费资源来源≠会员续卡；',
              '②退卡时间=筛选时间段内；退费业绩分馆=当前分馆；',
              '③退卡卡种含有课程消耗的卡数量（使用次数>0）；',
              '④卡种数量=分馆退费业绩/卡种总退费业绩',
              '例如：筛选时间段内学员退了A卡（存在课耗）,提交退费业绩：菱角湖500，江汉路500，则开卡卡数各取0.5'
            ]
          ],
          [
            '开卡人数',
            'newUseRs',
            ['2、开卡学员人数（去重）', '2、开卡学员人数（去重）', '①开卡卡数对应的学员数量，去重', '②开卡人数=分馆退费业绩/该学员总退费业绩；']
          ],
          [
            '开卡金额',
            'newUseMoney',
            [
              '3、开卡金额',
              '①取筛选时间段内，各分馆提交退费业绩',
              '例如：筛选时间段内学员退了A卡（存在课耗）,提交退费业绩：菱角湖500，江汉路500，则开卡金额各取500'
            ]
          ],
          ['未开卡卡数', 'newNumber', ['同左侧逻辑', '未开卡：退卡卡种退费资源来源≠会员续卡；不含课程消耗（使用次数=0）']],
          ['未开卡人数', 'newRs'],
          ['未开卡金额', 'newMoney']
        ],
        [
          ['开卡卡数', 'oldUseNumber', ['同左侧逻辑', '开卡：退卡卡种退费资源来源=会员续卡；含有课程消耗（使用次数>0）']],
          ['开卡人数', 'oldUseRs'],
          ['开卡金额', 'oldUseMoney'],
          ['未开卡卡数', 'oldNumber', ['同左侧逻辑', '未开卡：退卡卡种退费资源来源=会员续卡；不含课程消耗（使用次数0）']],
          ['未开卡人数', 'oldRs'],
          ['未开卡金额', 'oldMoney']
        ]
      ]

      this.firstTitles.forEach((firstTitle, firstIndex) => {
        const firstCol = {
          title: firstTitle,
          children: []
        }
        this.secondTitles[firstIndex].forEach((arr, innerIndex) => {
          const col = {
            // title: arr[0],
            align: 'center',
            width: 116,
            customCell: noPaddingCell,
            customHeaderCell: innerIndex < 3 ? customHeaderCell1 : null,
            customRender: (value, record, index) => {
              return this.getDataRowCustomRender(arr[1], record, index)
            },
            slots: {
              title: `${arr[1]}`
            }
          }
          firstCol.children.push(col)
        })
        this.columns.push(firstCol)
      })
    },
    async loadData() {
      this.loading = true
      try {
        let res = await getRefundCardList(this.queryParams)
        this.list = res.data
      } finally {
        this.loading = false
      }
    },
    changeRegionNameFold() {
      this.regionNameOpen = !this.regionNameOpen
      this.branchNameOpen = false
    },
    changeBranchNameFold() {
      this.regionNameOpen = true
      this.branchNameOpen = !this.branchNameOpen

      this.branchOpens = []
      if (this.branchNameOpen) {
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
      let cond1 = !this.regionNameOpen && index == 0
      // 展开的情况下最后一行
      let cond2 = this.regionNameOpen && this.list?.length - 1 == index
      return this.list?.length > 0 && (cond1 || cond2)
    },
    getDataRowCustomRender(dataIndex, record, index) {
      const obj = {
        children: (
          <div>
            <div class="table-cell-y">{this.getLocaleNum(record.total[dataIndex])}</div>
          </div>
        ),
        attrs: {}
      }
      if (this.isLastTotalRow(index) && this.branchNameOpen) {
      } else if (this.branchOpens[index]) {
        obj.children = (
          <div>
            {record.list.map(item => {
              return <div class="table-cell-y">{this.getLocaleNum(item[dataIndex])}</div>
            })}
            {<div class="table-cell-y background-grey">{this.getLocaleNum(record.total[dataIndex])}</div>}
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
    handleExport() {
      exportRefundCard(this.queryParams).then(data => {
        this.$tools.exportExcel(data, '退卡统计表')
      })
      // })
    }
  }
}
</script>

<style lang="less" scoped>
// .fixedTotal {
//   position: sticky;
//   z-index: 100000;
//   bottom: 0;
// }

.table-cell-y {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;

  height: 48px;
}

div .table-cell-y:last-child {
  border-bottom: 0px;
}

.background-grey {
  background: rgba(0, 0, 0, 0.1);
}

.sep-color {
  background-color: #d2effc;
}
</style>
