<template>
  <div>
    <a-spin :spinning="bodyLoading">
      <div style="display:flex;justify-content: space-between;align-items:center;margin-bottom:0.2rem;">
        <div style="font-size:0.2rem;font-weight:bold;">运营部数据指标</div>
        <a-radio-group v-model="resource" button-style="solid" @change="changeType(resource)">
          <a-radio-button :value="item.id" v-for="item in resourceList" :key="item.id" @click="chooseType">{{ item.text }}</a-radio-button>
        </a-radio-group>
      </div>
      <a-card :bordered="false">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div></div>
          <div style="display:flex;margin-bottom:0.1rem;align-items:center;">
            <div style="margin-right:0.1rem;cursor:pointer;" :class="{ active: dateDefaultType === 'lastMonth' }" @click="changeDateType('lastMonth')">
              上月
            </div>
            <div style="margin-right:0.1rem;cursor:pointer;" :class="{ active: dateDefaultType === 'month' }" @click="changeDateType('month')">本月</div>
            <div style="margin-right:0.1rem;cursor:pointer;" :class="{ active: dateDefaultType === 'week' }" @click="changeDateType('week')">上周</div>
            <div style="margin-right:0.1rem;cursor:pointer;" :class="{ active: dateDefaultType === 'yesterday' }" @click="changeDateType('yesterday')">
              昨日
            </div>
            <EchartSearch
              :searchParams="searchParams"
              style="margin-right:0.1rem;height:0.3rem;"
              @searchSubmit="searchSubmitBox"
              v-show="dateSearch"
              @resetParams="resetParams"
            />
            <div class="iconButton" style="margin-right:0.1rem;">
              <a-icon type="calendar" class="icon" @click="dateSearch = !dateSearch" />
            </div>
            <!-- <div class="iconButton" style="margin-right:0.1rem;">
              <a-icon type="filter" class="icon" @click="screen" />
            </div> -->
            <div class="iconButton">
              <a-icon type="tool" class="icon" @click="setterIndicator" />
            </div>
          </div>
        </div>
        <!-- <a-divider></a-divider> -->
        <Echarts
          :data="seriesData"
          :type="'eightSquare'"
          style="width:100%;"
          ref="chart"
          :targetSetter="targetSetterlist"
          v-if="seriesData.series.length && echartshow"
          @targetShowList="targetShowList"
        ></Echarts>
      </a-card>
      <a-row :gutter="15" v-if="resource === 2">
        <a-col :xs="24" :sm="12" :md="12" :lg="12">
          <a-card :body-style="{ padding: '0.2rem 0.24rem 0.8rem' }" :bordered="false" style="margin-top:0.1rem;">
            <div style="display:flex;justify-content: space-between;">
              <div>
                办卡卡种数量排行榜
                <a-tooltip
                  placement="topLeft"
                  title="按学员办卡时间进行统计的办卡数量，包括新学员办卡、老学员续卡、前台录入的老卡、前台提交的卡种变更的卡，包括所有状态的卡种（使用中、未使用、结业、停课、撤销）"
                >
                  <a-icon type="question-circle" style="font-size:0.12rem;color:#999;" />
                </a-tooltip>
              </div>
              <a-radio-group @change="loadNumTable" v-model="numType">
                <a-radio-button :value="item.id" v-for="item in radios" :key="item.id">{{ item.text }}</a-radio-button>
              </a-radio-group>
            </div>
            <div style="margin-bottom:0.1rem;font-size:0.12rem;">{{ searchData.startDate }}~{{ searchData.endDate }}</div>
            <s-table
              ref="tableNum"
              size="default"
              :columns="NumTableColumns"
              :data="numLoadData"
              rowKey="serialNum"
              :defaultPagination="true"
              showPagination="false"
              v-if="this.searchData.startDate"
              :scroll="{ y: '300px' }"
            >
            </s-table>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="12" :lg="12">
          <a-card :body-style="{ padding: '0.2rem 0.24rem 0.8rem' }" :bordered="false" style="margin-top:0.1rem;">
            <div style="display:flex;justify-content: space-between;">
              <div>
                办卡卡种金额排行榜
                <a-tooltip
                  placement="topLeft"
                  title="按学员办卡时间进行统计的办卡金额，包括新学员办卡、老学员续卡、前台录入的老卡、前台提交的卡种变更的卡，包括所有状态的卡种（使用中、未使用、结业、停课、撤销）"
                >
                  <a-icon type="question-circle" style="font-size:0.12rem;left:0.1rem;color:#999;" />
                </a-tooltip>
              </div>
              <a-radio-group @change="loadPriceTable" v-model="priceType">
                <a-radio-button :value="item.id" v-for="item in radios" :key="item.id">{{ item.text }}</a-radio-button>
              </a-radio-group>
            </div>

            <div style="margin-bottom:0.1rem;font-size:0.12rem;">{{ searchData.startDate }}~{{ searchData.endDate }}</div>
            <s-table
              ref="tablePrice"
              size="default"
              :columns="priceTableColumns"
              :data="priceLoadData"
              rowKey="serialNum"
              :defaultPagination="true"
              showPagination="false"
              v-if="this.searchData.startDate"
              :scroll="{ y: '300px' }"
            >
            </s-table>
          </a-card>
        </a-col>
      </a-row>
      <echartTemplate
        :detailTableSet="detailTableSet"
        :allControl="allControl"
        :echartAllSet="echartAllSet"
        :tabControl="tabControl"
        @changeCondition="changeCondition"
        @tableEnd="tableLoading = false"
      >
        <!-- @changeRank="changeRank" -->
        <div slot="seniority">
          <template v-if="allControl.seniority">
            <echartRankingList :tabList="rankTab" @changeRank="changeRank" :tableTitle="rankTitle" :tableList="rankList" :allRankMsg="allRankMsg" />
          </template>
        </div>
      </echartTemplate>
      <propertyScreen ref="propertyScreen" />
    </a-spin>
  </div>
</template>

<script>
import EchartSearch from '@/components/EchartSearch/index.vue'
import Echarts from '@/components/Echarts/index.vue'
import echartRankingList from '@/components/echartRankingList/echartRankingList.vue'
import echartTemplate from '@/components/echartTemplate/echartTemplate'
import { STable } from '@/components'
import { queryAchievement, achFindAllModule, achievementChartStat, achievementTable } from '@/api/echart/achievement'
import { cardPriceRankings, cardNumberRankings, queryCard, cardFindAllModule, cardTable, cardChartStat, showOn } from '@/api/echart/studentCard'
import { queryResource, resourcefindAllModule, rankingBySchool, rankingByAdvise, resourceChartStat, resourceTable } from '@/api/echart/resourceValue'
import propertyScreen from '@/components/propertyScreen/propertyScreen'

const NumTableColumns = [
  {
    title: '序号',
    dataIndex: 'serialNum',
    width: 80,
    // sorter: true,
    scopedSlots: { customRender: 'feeName' }
  },
  {
    title: '班型',
    dataIndex: 'typeName',
    ellipsis: true,
    sorter: true,
    width: 100,
    scopedSlots: { customRender: 'typeName' }
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    sorter: true,
    ellipsis: true,
    scopedSlots: { customRender: 'cardName' }
  },
  {
    title: '合计数量',
    dataIndex: 'cardCount',
    sorter: true,
    ellipsis: true,
    scopedSlots: { customRender: 'cardCount' }
  }
]
const priceTableColumns = [
  {
    title: '序号',
    dataIndex: 'serialNum',
    width: 80,
    // sorter: true,
    scopedSlots: { customRender: 'feeName' }
  },
  {
    title: '班型',
    dataIndex: 'typeName',
    ellipsis: true,
    sorter: true,
    width: 100,
    scopedSlots: { customRender: 'typeName' }
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    ellipsis: true,
    sorter: true,
    scopedSlots: { customRender: 'cardName' }
  },
  {
    title: '实收金额',
    dataIndex: 'paidPrice',
    sorter: true,
    ellipsis: true,
    scopedSlots: { customRender: 'paidPrice' }
  },
  {
    title: '应收金额',
    dataIndex: 'totalPrice',
    sorter: true,
    ellipsis: true,
    scopedSlots: { customRender: 'totalPrice' }
  }
]
const columns = [
  {
    fixed: 'left',
    // title: '时间',
    select: [
      {
        key: 'time',
        name: '按天'
      },
      {
        key: 'total',
        name: '合计'
      }
    ],
    dataIndex: 'name',
    width: 200,
    className: 'column-money',
    scopedSlots: { title: 'name1' }
  },
  {
    fixed: 'left',
    select: [
      {
        key: 'school',
        name: '分馆'
      },
      {
        key: 'total',
        name: '所有'
      }
    ],
    // title: '时间',
    dataIndex: 'subName',
    width: 200,
    className: 'column-money',
    scopedSlots: { title: 'subName1' }
  }
]
export default {
  data() {
    return {
      columns,
      NumTableColumns,
      priceTableColumns,
      numLoadData: parameter => {
        let obj = {
          startDate: this.searchData.startDate,
          endDate: this.searchData.endDate,
          sorter: {
            sortField: parameter.sortField,
            sortOrder: parameter.sortOrder
          },
          cardType: this.numType
        }
        return cardNumberRankings(Object.assign(obj, this.tableParams)).then(res => {
          return res
        })
      },
      priceLoadData: parameter => {
        // debugger
        let obj = {
          startDate: this.searchData.startDate,
          endDate: this.searchData.endDate,
          sorter: {
            sortField: parameter.sortField,
            sortOrder: parameter.sortOrder
          },
          cardType: this.priceType
        }
        return cardPriceRankings(Object.assign(obj, this.tableParams)).then(res => {
          return res
        })
      },
      NumTableloading: false,
      priceTableloading: false,
      radios: [{ id: 'A', text: '正常' }, { id: 'B', text: '续卡' }, { id: 'C', text: '老卡' }],
      numType: 'A',
      priceType: 'A',
      loadData: parameter => {
        let obj = {
          sorter: {
            sortField: parameter.sortField,
            sortOrder: parameter.sortOrder
          }
        }
        let request = resourceTable
        if (this.resource === 2) request = cardTable
        if (this.resource === 3) request = achievementTable
        this.tableLoading = true
        console.log(this.tableLoading)
        return request(Object.assign(obj, this.tableData)).then(res => {
          return res
        })
      },
      searchParams: [
        {
          type: 'date',
          key: 'Date',
          label: '',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultDaySection: 7,
          defaultLastWeek: false,
          defaultLastMonth: false,
          disabledDate: true,
          allowClear: false
        }
      ],
      seriesData: {
        // title: 'name',
        series: []
      },
      echartAllSet: {
        loading: false,
        allRankMsg: false,
        // seniorityList: [],
        echartType: [],
        setting: {
          ChartLine: {
            title: {
              left: 'center'
            },
            legend: {
              x: 'center',
              y: 'bottom'
            }
          },
          ChartBar: {
            title: {
              left: 'center'
            },
            legend: {
              x: 'center',
              y: 'bottom'
            }
          }
        }
      },
      tabControl: [
        { name: '总成单率', id: 'resource-sumCompleteNum,resource-sumResourceNum' },
        { name: '总资源数', id: 'resource-sumResourceNum' },
        { name: '总成单数', id: 'resource-sumCompleteNum' },
        { name: '总成单金额', id: 'resource-sumCompletePrice' },
        { name: '总成单价值', id: 'resource-sumCompletePrice,resource-sumCompleteNum' }
      ],
      allControl: {
        showTable: true,
        TypeButton: true,
        crosswise: 16,
        // search: true,
        seniority: true
      },
      detailJudge: params => {
        if (typeof params === 'number') {
          if (params !== 0) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      searchData: {},
      dateSearch: false,
      flag: false,
      type: 'A',
      allData: {},
      resourceList: [{ id: 1, text: '资源' }, { id: 2, text: '学员卡' }, { id: 3, text: '业绩' }],
      resource: 1,
      // crosswise: 16,
      dateDefaultType: '', //时间区间类型
      dataFlag: false,
      rankTab: [{ seniorityType: 'A', text: '分馆排行' }, { seniorityType: 'B', text: '顾问排行' }],
      rankTitle: ['序号', '分馆', '总成单率'],
      rankList: [],
      allRankMsg: false,
      seniority: true,
      targetSetterlist: [],
      tableLoading: false,
      bodyLoading: true,
      echartshow: true //强制刷新方块数据组件
    }
  },

  components: {
    EchartSearch,
    Echarts,
    echartTemplate,
    STable,
    propertyScreen,
    echartRankingList
  },

  computed: {
    echartData() {
      return {
        statCode: this.allData.tabSelect ? this.allData.tabSelect : this.tabControl[0].id,
        dateType: 'day',
        endDate: this.searchData.endDate || null,
        startDate: this.searchData.startDate || null
      }
    },
    tableData() {
      return {
        statCode: this.allData.tabSelect ? this.allData.tabSelect : this.tabControl[0].id,
        dateType: this.allData.timeType ? (this.allData.timeType === 'total' ? null : 'day') : null,
        endDate: this.searchData.endDate || null,
        startDate: this.searchData.startDate || null,
        dimension: this.allData.schoolType || 'total'
      }
    },
    detailTableSet() {
      return {
        loadTableData: this.resource === 1 ? 'resourceDetail' : this.resource === 2 ? 'cardDetail' : 'achievementDetail', //表中表的调用接口名称
        tooltipButton: [
          { text: '查看明细', id: 1 }
          // { text: '查看顾问明细', id: 1 },
          // { text: '查看用户明细', id: 2 },
          // { text: '查看客服明细', id: 3 },
          // { text: '查看运营明细', id: 3 }
        ], //表格悬停的案件列表
        tableParams: this.tableData, //接口所需参数
        loadData: this.loadData, //接口
        columns: this.columns, //表头
        detailJudge: this.detailJudge, //表格数据下划线加悬停效果的数据校验
        perm: 'databoard:operation:export' //导出权限
      }
    },
    //监听所有拦截器
    intercept() {
      return {
        tableLoading: this.tableLoading,
        dataFlag: this.dataFlag,
        echartLoading: this.echartAllSet.loading
      }
    }
  },

  created() {},
  watch: {
    echartData: {
      deep: true,
      handler(n, o) {
        this.allControl.seniority = false
        n && this.getEchartsData()
        if (n.startDate != o.startDate) {
          this.getGridData()
        }
      }
    },
    intercept(n) {
      if (!n.tableLoading && !n.dataFlag && !n.echartLoading) {
        this.bodyLoading = false
      }
    }
  },
  methods: {
    // 设定展示指标
    targetShowList(val) {
      this.echartshow = false
      showOn({
        module: this.resource === 1 ? 'resource' : this.resource === 2 ? 'stuCard' : 'ach',
        codes: val
      }).then(res => {
        if (res.code === 200) {
          this.echartshow = true
          this.getGridData()
          this.$refs.chart.$refs.echart.handleCancel()
        }
      })
    },
    // 切换日期范围
    changeDateType(val) {
      if (this.dateDefaultType === val) return
      this.dateDefaultType = val
      let arr = [
        {
          type: 'date',
          key: 'Date',
          label: '',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD',
          defaultDaySection: 0,
          defaultLastWeek: false,
          defaultSelectMonth: false,
          defaultYesterday: false,
          defaultLastMonth: false,
          disabledDate: true,
          allowClear: false
        }
      ]
      switch (val) {
        case 'week':
          arr[0].defaultLastWeek = true
          break
        case 'month':
          arr[0].defaultSelectMonth = true
          break
        case 'yesterday':
          arr[0].defaultYesterday = true
          break
        case 'lastMonth':
          arr[0].defaultLastMonth = true
          break
      }
      this.searchParams = arr
    },
    chooseType() {
      if (!this.dataFlag || !this.echartAllSet.loading || !this.tableLoading) {
        this.bodyLoading = true
      }
    },
    //修改类型
    changeType() {
      if (this.resource === 1) {
        this.tabControl = [
          { name: '总成单率', id: 'resource-sumCompleteNum,resource-sumResourceNum' },
          { name: '总资源数', id: 'resource-sumResourceNum' },
          { name: '总成单数', id: 'resource-sumCompleteNum' },
          { name: '总成单金额', id: 'resource-sumCompletePrice' },
          { name: '总成单价值', id: 'resource-sumCompletePrice,resource-sumCompleteNum' }
        ]
        this.allData = []
        this.allControl.crosswise = 16
      } else if (this.resource === 2) {
        this.tabControl = [
          { name: '卡数量', id: 'stuCard-addCardNum' },
          { name: '新卡数量', id: 'stuCard-addNewCardNum' },
          { name: '续卡数量', id: 'stuCard-addNextCardNum' },
          { name: '网课卡数量', id: 'stuCard-addOnlineCardNum' },
          { name: '老卡数量', id: 'stuCard-addOldCardNum' },
          { name: '到期卡数量', id: 'stuCard-addEndCardNum' },
          { name: '特殊卡数量', id: 'stuCard-addSpecialCardNum' }
        ]
        this.allData = []
        this.allControl.crosswise = 24
      } else {
        this.tabControl = [
          { name: '教练班金额', id: 'ach-coachClassPrice' },
          { name: '私教班金额', id: 'ach-privateClassPrice' },
          { name: '收入业绩', id: 'ach-incomeAch' },
          { name: '续卡金额', id: 'ach-nextCardPrice' },
          { name: '会员介绍', id: 'ach-memberIntroducePrice' },
          { name: '有效业绩', id: 'ach-effectiveAch' },
          { name: '公司资源金额', id: 'ach-companyResourcePrice' },
          { name: '退款业绩', id: 'ach-refundAch' }
        ]
        this.allData = []
        this.allControl.crosswise = 24
      }
      this.getGridData()
    },
    //筛选
    screen() {
      this.$refs.propertyScreen.open()
    },
    changeCondition(data) {
      //如果是报名率就展示排行榜
      if (data.tabSelect === 'resource-sumCompleteNum,resource-sumResourceNum') {
        this.allControl.crosswise = 16
      } else {
        this.allControl.crosswise = 24
      }
      this.allData = data
    },
    getEchartsData() {
      this.echartAllSet.loading = true
      let request = resourceChartStat
      if (this.resource === 2) {
        request = cardChartStat
      } else if (this.resource === 3) {
        request = achievementChartStat
      }
      request(this.echartData).then(res => {
        if (res.code === 200) {
          this.echartAllSet.echartType = [
            {
              type: this.allData.echartType ? this.allData.echartType : 'ChartLine',
              seriesData: res.data,
              crosswise: this.allControl.crosswise
            }
          ]
          if ((this.allData.tabSelect === 'resource-sumCompleteNum,resource-sumResourceNum' || !this.allData.tabSelect) && this.resource === 1) {
            this.allControl.seniority = true
          }
        }
        this.echartAllSet.loading = false
      })
    },
    //切换排行榜
    changeRank(val) {
      if (val === 'B') {
        this.rankTitle = ['序号', '分馆', '顾问', '总成单率']
      } else {
        this.rankTitle = ['序号', '分馆', '总成单率']
      }
      this.rankList = []
      this.allRankMsg = false
      this.type = val
      if (val === 'A') {
        this.getSchoolRank()
      } else {
        this.getAdviserank()
      }
    },
    // 分馆排行
    getSchoolRank() {
      if (this.searchData.endDate) {
        rankingBySchool({
          startDate: this.searchData.startDate,
          endDate: this.searchData.endDate,
          dateType: 'day'
        }).then(res => {
          console.log(res.data)
          if (res.code === 200) {
            if (res.data.length) {
              this.rankList = res.data.map(item => {
                return {
                  name: item.schoolName,
                  rate: item.compareRate
                }
              })
            } else {
              this.rankList = []
              this.allRankMsg = true
              //显示暂无数据
            }
          }
        })
      }
    },
    //顾问排行
    getAdviserank() {
      if (this.searchData.endDate) {
        rankingByAdvise({
          startDate: this.searchData.startDate,
          endDate: this.searchData.endDate,
          dateType: 'day'
        }).then(res => {
          if (res.code === 200) {
            if (!res.data.length) {
              return (this.allRankMsg = true)
            }
            this.rankList = res.data.map(item => {
              return {
                name: item.schoolName,
                username: item.username,
                rate: item.statValue
              }
            })
          }
        })
      }
    },
    setterIndicator() {
      this.$refs.chart.open()
    },
    //格子数据表
    async getGridData() {
      if (this.dataFlag) return
      this.dataFlag = true
      let res = this.resource === 1 ? await resourcefindAllModule({}) : this.resource === 2 ? await cardFindAllModule({}) : await achFindAllModule({})
      if (res.code === 200) {
        this.targetSetterlist = res.data.map(item => {
          return {
            name: item.title,
            code: item.code,
            show: item.show
          }
        })
        console.log(this.targetSetterlist)
        console.log(res.data)
        this.echartshow = false
        this.seriesData.series = res.data
          .map(item => {
            if (item.show) {
              return {
                name: item.title,
                startDate: this.searchData.startDate,
                endDate: this.searchData.endDate,
                total: '',
                remark: item.remark,
                code: item.code
              }
            }
          })
          .filter(item => item)
        console.log(this.seriesData.series)
        this.echartshow = true

        let codeList = this.seriesData.series.map(item => {
          return item.code
        })
        if (this.searchData.endDate) {
          let num = 0
          codeList.forEach(item => {
            let request = queryResource
            if (this.resource === 2) {
              request = queryCard
            } else if (this.resource === 3) {
              request = queryAchievement
            }
            request({
              endDate: this.searchData.endDate || null,
              startDate: this.searchData.startDate || null,
              statCode: item
            }).then(res => {
              if (res.code === 200) {
                //拦截全部接口走完
                num++
                console.log(num, codeList.length)
                if (num === codeList.length) {
                  this.dataFlag = false
                }
                this.seriesData.series.find(todo => todo.code === item).total = res.data.statValue
              }
            })
          })
        }
      }
    },
    loadPriceTable() {
      this.$refs.tablePrice.refresh()
    },
    loadNumTable() {
      this.$refs.tableNum.refresh()
    },
    //手动选择时间清空时间区间
    resetParams() {
      this.dateDefaultType = ''
    },
    searchSubmitBox(val) {
      if (!val.startDate) return
      this.allRankMsg = false
      this.rankList = []
      this.searchData = val
      this.dateSearch = false
      this.getGridData()
      if (this.type === 'A') {
        this.getSchoolRank()
      } else {
        this.getAdviserank()
      }
      if (this.flag && this.resource === 2) {
        this.$nextTick(() => {
          this.loadPriceTable()
          this.loadNumTable()
        })
      }
      this.flag = true
    }
  }
}
</script>
<style lang="less" scoped>
.iconButton {
  margin-top: 6px;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    font-size: 16px;
    padding: 6px;
    color: #999;
  }
}
.active {
  color: #1890ff;
}
</style>
