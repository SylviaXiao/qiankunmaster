<template>
  <div class="body">
    <a-card :loading="loading" :body-style="{ padding: '0.2rem 0.24rem 0.08rem' }" :bordered="false">
      <div style="display:flex;justify-content: space-between;">
        <div v-if="allControl.search" style="display:flex;align-items:center;">
          <EchartSearch :searchParams="searchParams" style="margin-left:-0.1rem;margin-bottom:-0.4rem;" @searchSubmit="searchSubmit" />
          <!-- 选择时间 无限增加时间对比 -->
          <!-- <span v-for="(item, index) in contrastDateList" :key="index"> -->
          <!-- <a-range-picker
              renderExtraFooter="取消"
              v-model="item.contrastTime"
              @change="changeContrastTime(index)"
              v-if="item.show"
              :disabled-date="disabledDate"
              @calendarChange="calendarChange"
              @focus="focusContrast(index)"
              :open="endOpen"
            >
              <div class="active" style="margin-left:10px;cursor:pointer;width:100px;">+选择时间</div>
            </a-range-picker> -->
          <!-- </span> -->
          <!-- 选择时间 一条时间对比 -->
          <!-- <span v-for="(item, index) in contrastDateList" :key="index"> -->
          <div style="line-height:0.32rem;margin-bottom:0.05rem" v-if="contrastDateList[0].startDate">&nbsp;&nbsp;VS</div>
          <a-range-picker
            renderExtraFooter="取消"
            v-model="contrastDateList[0].contrastTime"
            @change="changeContrastTime(0)"
            :disabled-date="disabledDate"
            @calendarChange="calendarChange"
            @focus="focusContrast(0)"
            :open="endOpen"
          >
            <div class="active" style="margin-left:0.1rem;cursor:pointer;width:0.8rem;margin-bottom:0.05rem;" v-if="!contrastDateList[0].startDate">
              +选择时间
            </div>
            <div class="reducedTime" v-else>{{ contrastDateList[0].startDate }} ~ {{ contrastDateList[0].endDate }}</div>
          </a-range-picker>
          <a-tooltip placement="topLeft" title="请选择需要对比的时间终点，我们会自动给您计算起点">
            <a-icon type="question-circle" style="font-size:0.12rem;color:#999;margin:0 0.1rem 0.05rem 0.1rem;" />
          </a-tooltip>
          <template v-if="contrastDateList[0].startDate">
            <div class="active" @click="delectContrast(true)" style="margin-bottom:0.05rem;cursor:pointer;margin-left:0.1rem;">删除</div>
          </template>
        </div>
        <div v-else></div>
        <div v-if="allControl.TypeButton">
          <a-icon type="line-chart" class="icon" @click="changeType('ChartLine')" :class="{ active: type === 'ChartLine' }" style="margin-right:0.1rem;" />
          <a-icon type="bar-chart" class="icon" @click="changeType('ChartBar')" :class="{ active: type === 'ChartBar' }" />
        </div>
      </div>
      <!-- 场景提醒 -->
      <div class="echartTip" v-if="allControl.conditionTips">
        <div style="margin-right:0.1rem;">当前场景：{{ comparison.sceneText.join(',') || '' }}</div>
      </div>
      <a-divider v-if="!allControl.conditionTips && allControl.search"></a-divider>
      <div class="openPop">
        <!-- 选择具体类型 -->
        <div v-if="comparison && comparison.checkBoxFilter && comparison.checkBoxFilter.length !== 0">
          <a-button @click="checkBoxShow = !checkBoxShow">{{ filterType }}</a-button>
          <checkBoxList
            :style="{ display: checkBoxShow && comparison.checkBoxFilter && comparison.checkBoxFilter.length !== 0 ? 'block' : 'none' }"
            class="checkPop"
            :list="comparison.checkBoxFilter"
            @getcheckIds="getcheckIds"
          />
        </div>
        <div v-else></div>
        <a-select v-model="rankSelect" style="width: 1.3rem" @change="changeRankSelect(rankSelect)" v-if="allControl.rankShow">
          <a-select-option v-for="todo in rankSelectTypes" :key="todo.id"> {{ todo.name }} </a-select-option>
        </a-select>
      </div>
      <div style="display:flex;margin:0.1rem 0 0.2rem 0;" v-if="tabControl">
        <div v-for="(item, index) in tabControl" :key="index" class="tab" :class="{ active: item.id === tabSelect }" @click="changeTab(item.id)">
          {{ item.name }}
        </div>
      </div>
      <a-row>
        <a-spin :spinning="echartAllSet.loading">
          <a-col :span="item.crosswise" v-for="(item, index) in echartType" :key="index">
            <Echarts :data="item.seriesData" :type="item.type" :setting="echartAllSet.setting[item.type]" style="width:100%;height:4rem;"></Echarts>
          </a-col>
        </a-spin>
        <!-- 排行榜 -->
        <a-col :span="24 - allControl.crosswise - 1" v-if="allControl.seniority" class="seniority">
          <slot name="seniority" />
        </a-col>
      </a-row>
      <div class="active" style="margin-top:0.2rem;cursor:pointer;" @click="tableShow = !tableShow" v-if="allControl.showTable">展开查看更多明细</div>
      <template v-if="tableShow">
        <s-table
          ref="table"
          size="default"
          :columns="tableColumns"
          :data="detailTableSet.loadData"
          :alert="false"
          rowKey="key"
          :defaultPagination="true"
          showPagination="false"
          @result="result"
          :defaultRowKeys="true"
          :expand="defaultRowKeysExpand"
          :scroll="{ x: 150 * tableColumns.length, y: '1000px' }"
        >
          <template slot="subName1">
            <a-select v-model="schoolType" style="width: 1rem" @change="changeCondition">
              <a-select-option v-for="todo in selectArr['subName1Arr']" :key="todo.key">{{ todo.name }} </a-select-option>
            </a-select>
          </template>

          <template slot="name1">
            <a-select v-model="timeType" style="width: 1rem" @change="changeCondition">
              <a-select-option v-for="todo in selectArr['name1Arr']" :key="todo.key">{{ todo.name }} </a-select-option>
            </a-select>
          </template>

          <span v-for="(todo, index) in tableKey" :key="index" :slot="todo" slot-scope="text, record">
              <template v-if="text instanceof Array">
                <div style="display:flex;align-items:center;justify-content:center">
                  <div>
                    <div v-for="(item, inx) in text" :key="inx">
                      <a-tooltip placement="rightTop" v-if="detailTableSet.detailJudge(item.data)" :mouseEnterDelay="0.5">
                        <template slot="title">
                          <div style="margin-bottom:0.1rem;" v-if="reverse === null">
                            {{ todo.split(',')[0] }}
                            <span v-if="todo.split(',')[1]">{{ '~' + todo.split(',')[1] }}</span>
                          </div>
                          <div style="margin-bottom:0.1rem;" v-else>{{ record.name }}({{ record.subName || null }})</div>
                          <div v-for="(subItem, subIndex) in detailTableSet.tooltipButton" :key="subIndex" class="toolButton" @click="skip(item.name, record)">
                            {{ subItem.text }}
                          </div>
                        </template>
                        <div style="borderBottom:1px solid;text-align:center;">{{ item.data }}</div>
                      </a-tooltip>
                      <div style="text-align:center;" v-else>{{ item.data }}</div>
                    </div>
                  </div>
                  <div style="margin-left:0.1rem;">{{ ratio(text) }} %</div>
                </div>
              </template>

              <template v-else>
                <a-tooltip placement="rightTop" v-if="detailTableSet.detailJudge(text)" :mouseEnterDelay="0.5">
                  <template slot="title">
                    <div style="margin-bottom:0.1rem;" v-if="reverse === null">
                      {{ todo.split(',')[0] }}
                      <span v-if="todo.split(',')[1]">{{ '~' + todo.split(',')[1] }}</span>
                    </div>
                    <div style="margin-bottom:0.1rem;" v-else>{{ record.name }}({{ record.subName || null }})</div>
                    <div v-for="(item, index) in detailTableSet.tooltipButton" :key="index" class="toolButton" @click="skip(todo, record)">{{ item.text }}</div>
                  </template>
                  <span style="borderBottom:1px solid;text-align:center;">{{ text }}</span>
                </a-tooltip>
                <span style="text-align:center;" v-else>{{ text }}</span>
              </template>
          </span>
        </s-table>
      </template>
    </a-card>
  </div>
</template>

<script>
import Echarts from '@/components/Echarts/index.vue'
import EchartSearch from '@/components/EchartSearch/index.vue'
import checkBoxList from '@/components/checkBoxList/checkBoxList.vue'
import moment from 'moment'
import { TreeSelect } from 'ant-design-vue'
import { STable } from '@/components'
import { pageFinSpending } from '@/api/education/card'
import { selectSchoolTree } from '@/api/echart/common'
import { refundDetail } from '@/api/echart/refundStat'

const SHOW_PARENT = TreeSelect.SHOW_PARENT

export default {
  data() {
    return {
      type: 'ChartLine',
      defaultSelectDate: {
        startDate: moment()
          .startOf('day')
          .subtract(7, 'days'),
        endDate: moment()
          .endOf('day')
          .subtract(0, 'days')
      },
      echartType: [],
      date: null,
      dateType: 'day',
      staticArr: [
        {
          string: '日',
          value: 'day'
        },
        {
          string: '周',
          value: 'week'
        },
        {
          string: '月',
          value: 'month'
        },
        {
          string: '年',
          value: 'year'
        }
      ],
      contrastList: [{ string: '分馆对比', value: 'A' }, { string: '时间对比', value: 'B' }],
      contrast: [],
      contrastDateList: [
        {
          startDate: '',
          endDate: '',
          contrastTime: [],
          show: true
        }
      ],
      SHOW_PARENT,
      schoolId: null,
      schoolList: [],
      tableShow: false,
      endOpen: false, //日期选择弹窗开启
      searchParams: [
        {
          disabledDate: true,
          defaultSelect: 'day',
          placeholder: '',
          type: 'dateAndSelect',
          key: 'Date',
          selectKey: 'dateType',
          label: '',
          pllotaceholder: '请选择时间',
          format: 'YYYY-MM-DD',
          lg: 0,
          md: 0,
          sm: 0,
          staticArr: [
            {
              string: '按日',
              value: 'day'
            },
            {
              string: '按周',
              value: 'week'
            },
            {
              string: '按月',
              value: 'month'
            }
          ]
        }
      ],

      searchData: {},
      status: false,
      contrastIndex: null,

      tabSelect: 1, //选项卡
      loading: false,
      sceneArr: [], //场景数组
      tableColumns: [], //明细表头
      tableKey: [], //明细key
      transitionName: 'list-toRight',
      checkBoxShow: false, //控制多选弹窗展示
      checkIds: [],
      rankSelectTypes: [
        { id: 5, name: '排名前五' },
        { id: 10, name: '排名前十' },
        { id: 15, name: '排名前十五' },
        { id: 20, name: '排名前二十' },
        { id: 25, name: '排名前二十五' },
        { id: 30, name: '排名前三十' }
      ],
      rankSelect: 5, //默认排行榜选中前几条
      reverse: '', //是否取key
      schoolType: 'total',
      timeType: 'total',
      tableLoading: true,
      selectArr: {} //表头下拉选择
    }
  },
  props: {
    //所有对比相关数据
    // {
    //   sceneText //场景对比数据
    //   checkBoxFilter 全局筛选的弹窗数据
    // }
    comparison: {
      type: Object,
      default: () => {}
    },
    //所有明细表配置
    // {
    // loadTableData //表中表的调用接口名称
    // tooltipButton //表格悬停的案件列表
    // tableParams 表格接口参数
    // loadData 接口
    // columns 表头
    // detailJudge 表格数据下划线加悬停效果的数据校验
    // }
    detailTableSet: {
      type: Object,
      default: () => {}
    },
    //所有echart配置
    // {
    // seriesData echart数据
    // setting 图表配置
    // chartTypes 图表类型
    // loading 图表加载
    // resetType 重置echart类型

    // }
    echartAllSet: {
      type: Object,
      default: () => {}
    },
    //所有展示按钮的控制 true/false
    // {
    // showTable 显示明细表格
    // TypeButton 切换图标类型按钮是否显示
    //search 搜索是否显示
    // conditionTips 当前场景提醒显示
    // crosswise echart宽度 Number类型
    // seniority 是否展示排行榜
    // }
    allControl: {
      type: Object,
      default: () => {}
    },
    // //场景选择信息
    // sceneText: {
    //   type: Array,
    //   default: () => []
    // },
    //选项卡数据
    tabControl: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Echarts,
    EchartSearch,
    STable,
    checkBoxList
  },
  mounted() {},
  watch: {
    echartAllSet: {
      immediate: true,
      deep: true,
      handler(n, o) {
        if (this.echartAllSet.echartType) {
          this.echartType = this.echartAllSet.echartType
          if (this.echartAllSet.resetType) {
            this.type = this.echartAllSet.echartType[0] ? this.echartAllSet.echartType[0].type : ''
          }
        }
      }
    },
    'detailTableSet.tableParams': {
      deep: true,
      handler(n, o) {
        this.tableShow && n && this.loadTable()
      }
    },
    'comparison.checkBoxFilter'(n) {
      this.checkIds = []
      if (n.length !== 0) {
        this.checkBoxShow = false
      }
    },
    tabControl: {
      deep: true,
      immediate: true,
      handler(n) {
        if (this.tabControl.length) this.tabSelect = this.tabControl[0].id
      }
    }
  },

  created() {
    this.loadSchoolId()
  },
  computed: {
    filterType() {
      switch (this.detailTableSet.tableParams.dimension) {
        case 'type':
          return '班型'
        case 'area':
          return '地区'
        case 'dance':
          return '舞种'
        case 'school':
          return '分馆'
      }
    }
  },
  methods: {
    ratio(text) {
      if (text[0].data == 0 && text[1].data != 0) {
        return '-100'
      } else if (text[1].data == 0 && text[0].data != 0) {
        return '100'
      } else if (text[0].data == 0 && text[1].data == 0) {
        return '0'
      } else {
        return (((text[0].data - text[1].data) / text[1].data) * 100).toFixed(2)
      }
    },
    changeRankSelect() {
      this.changeCondition()
    },
    //全局筛选
    getcheckIds(data) {
      this.checkBoxShow = false
      this.checkIds = data
      this.changeCondition()
      console.log(data)
    },
    changeSeniorityType(val) {
      this.seniorityType = val
      this.$emit('changeRank', val)
    },
    //跳转列表详情页面
    skip(key, record) {
      console.log('skip', key, record)
      let startDate = ''
      let endDate = ''
      console.log(this.reverse)
      if (!this.reverse) {
        if (key.includes(',')) {
          let date = key.split(',')
          startDate = date[0]
          endDate = date[1]
        } else {
          startDate = key.replace(/\./g, '-')
          endDate = key.replace(/\./g, '-')
        }
      } else {
        if (record.key.includes(',')) {
          let date = record.key.split(',')
          startDate = date[0]
          endDate = date[1]
        } else {
          startDate = record.key.replace(/\./g, '-')
          endDate = record.key.replace(/\./g, '-')
        }
      }
      // let data = {
      //   sceneData: JSON.stringify(this.detailTableSet.tableParams.sceneData) || null,
      //   loadTableData: this.detailTableSet.loadTableData,
      //   id: this.detailTableSet.tableParams.operate|| null,
      //   dimensionValue:JSON.stringify(record.key),
      //   dimension:this.detailTableSet.tableParams.dimension || null,
      //   title: this.detailTableSet.title,
      //   key,
      //   startDate,
      //   endDate
      // }
      console.log(this.detailTableSet.tableParams.dimension || null)
      let routeData = this.$router.resolve({
        path: `/dataBoard/tableDetail/${this.detailTableSet.tableParams.operate || null}/${this.detailTableSet.loadTableData}/${JSON.stringify(
          this.detailTableSet.tableParams.sceneData
        ) || null}/${JSON.stringify(record.key)}/${startDate}/${endDate}/${this.detailTableSet.tableParams.dimension || null}/${key || null}/${this
          .detailTableSet.tableParams.module || null}/${this.detailTableSet.perm}`
      })
      // let routeData = this.$router.resolve({
      //   path: `/dataBoard/tableDetail/${JSON.stringify(data)}`
      // })
      window.open(routeData.href)
    },
    //让列表二级可以收缩
    defaultRowKeysExpand(expanded, record) {
      if (expanded) {
        // 设置展开窗Key
        this.$refs.table.defaulKeys.push(record.key)
      } else {
        if (this.$refs.table.defaulKeys.length) {
          this.$refs.table.defaulKeys = this.$refs.table.defaulKeys.filter(v => {
            return v != record.key
          })
        }
      }
    },
    //列表接口数据
    result(res) {
      this.reverse = res.data.reverse //传参方式取所在行的key还是列的key
      let keys = []
      if (this.detailTableSet.columns && this.detailTableSet.columns.length) {
        keys = this.detailTableSet.columns.map(item => item.dataIndex)
      }
      let arr = res.data.headers
        .map(item => {
          if (!keys.includes(item.key)) {
            return {
              title: item.name,
              dataIndex: item.key,
              sorter: item.sortable,
              scopedSlots: {
                customRender: item.key
              },
              width: 200,
              className: 'column-money',
              fixed: item.fixed ? 'left' : ''
            }
          }
        })
        .filter(item => item)
      if (this.detailTableSet.columns) {
        let columns = this.detailTableSet.columns.map(item => {
          //如果表头是下拉选项
          if (item.select && item.select.length > 0) {
            this.$set(this.selectArr, `${item.scopedSlots.title}Arr`, item.select)
            const { select, ...data } = item
            return data
          } else {
            return item
          }
        })
        this.tableColumns = [...columns, ...arr]
      } else {
        this.tableColumns = arr
      }
      this.tableColumns.forEach(item => {
        if (item.dataIndex !== 'key') {
          this.tableKey.push(item.dataIndex)
        }
      })
      console.log(this.tableColumns)
      this.tableLoading = false
      this.$emit('tableEnd')
    },
    //修改任意条件调用
    changeCondition() {
      let date = []
      if (this.contrastDateList.length) {
        // date = this.contrastDateList
        //   .filter((item, index) => index !== this.contrastDateList.length - 1)
        //   .map(item => {
        //     return {
        //       startDate: item.startDate,
        //       endDate: item.endDate
        //     }
        //   })
        date = this.contrastDateList.map(item => {
          return {
            startDate: item.startDate,
            endDate: item.endDate
          }
        })
      }
      let obj = {
        schoolType: this.schoolType,
        timeType: this.timeType,
        checkIds: this.checkIds,
        searchData: this.searchData,
        tabSelect: this.tabControl ? this.tabSelect : null,
        contrastDate: date.length ? date : null,
        schoolId: this.schoolId ? this.schoolId : null,
        rankSelect: this.rankSelect, //排名选择前几
        echartType: this.type //当前echart图表类型
        // tableLoading: this.tableLoading //表格是否加载完成
      }
      this.$emit('changeCondition', obj)
    },
    changeTab(val) {
      if (this.tabSelect === val) return
      this.tabSelect = val
      this.changeCondition()
    },
    //获取将要修改的值的index
    focusContrast(index) {
      console.log(this.endOpen, 111)
      this.endOpen = true
      console.log(this.endOpen)

      this.contrastIndex = index
      //新增一个可取消的按钮
      setTimeout(() => {
        this.$nextTick(() => {
          let id = document.getElementsByClassName('ant-calendar-footer-extra')[0]
          id.style.cursor = 'pointer'
          id.style.color = '#1890ff'
          id.onclick = () => {
            this.endOpen = false
          }
        })
      }, 0)
    },
    //计算天数差
    DateDiff(sDate1, sDate2) {
      //sDate1和sDate2是2002-12-18格式
      let aDate, oDate1, oDate2, iDays
      aDate = sDate1.split('-')
      oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为12-18-2002格式
      aDate = sDate2.split('-')
      oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
      iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
      return iDays
    },
    //时间戳转xxxx-xx-xx格式
    formatDate(timestamp) {
      var date = new Date(timestamp)
      var year = date.getFullYear()
      var month = this.addZero(date.getMonth() + 1)
      var day = this.addZero(date.getDate())
      return year + '-' + month + '-' + day
    },
    addZero(num) {
      return num < 10 ? '0' + num : num
    },
    //时间选择器面板选择结束时间后
    calendarChange(dates, dateStrings) {
      let date = this.DateDiff(this.searchData.startDate, this.searchData.endDate)
      let endDate = this.$tools.tailor.getDate(dates[0])
      let aDate = endDate.split('-')
      let iDays = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
      let data = iDays - 1000 * 60 * 60 * 24 * date
      let val = this.$tools.tailor.dateToMoment(this.formatDate(data))
      this.contrastDateList[this.contrastIndex].contrastTime = [val, dates[0]]
      this.endOpen = false
      this.changeContrastTime(this.contrastIndex)
    },
    //超过今天不能选择
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    //搜索结果
    searchSubmit(val) {
      this.searchData = val
      if (this.contrastDateList[0].startDate) {
        this.delectContrast()
      }
      this.$emit('searchSubmit', val)
      this.changeCondition()
    },
    //修改对比分馆
    changeSchoolId() {
      this.changeCondition()
    },
    //获取分馆数据
    loadSchoolId() {
      //请求接口
      selectSchoolTree({}).then(res => {
        if (res.code === 200 && res.data) {
          this.schoolList = this._handleData(res.data)
        }
      })
    },
    //处理分馆数据
    _handleData(data) {
      return data.map((item, index) => {
        let itemObj = {}
        itemObj.title = item.name
        itemObj.value = item.deptNo
        itemObj.key = item.deptNo
        if (item.children) {
          itemObj.children = this._handleData(item.children)
          itemObj.selectable = true
        }
        return itemObj
      })
    },
    delectContrast(type) {
      //时间数据
      if (this.contrastDateList[0].contrastTime.length) {
        this.contrastDateList = [
          {
            startDate: '',
            endDate: '',
            contrastTime: [],
            show: true
          }
        ]
      }
      this.schoolId = null
      if (type || !this.contrast) {
        this.changeCondition()
      }
    },
    //修改对比时间
    changeContrastTime(index) {
      // this.echartType = this.echartType[0].type
      // this.type = this.echartType[0].type
      // this.contrastDateList[index].show = false
      this.contrastDateList[index].startDate = this.$tools.tailor.getDate(this.contrastDateList[index].contrastTime[0])
      this.contrastDateList[index].endDate = this.$tools.tailor.getDate(this.contrastDateList[index].contrastTime[1])
      // this.contrastDateList.push({
      //   startDate: '',
      //   endDate: '',
      //   contrastTime: [],
      //   show: true
      // })
      this.changeCondition()
    },
    changeType(type) {
      if (this.contrastDateList[0].startDate)
        return this.$notification['error']({
          message: '系统通知',
          description: '柱状图无法对比'
        })
      if (type !== this.type) {
        console.log(type)
        this.type = type
        this.echartType = this.echartType[0].type = type
      }
    },
    loadTable() {
      this.tableLoading = true
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/style/index.less';
.reducedTime {
  margin-left: 10px;
  margin-bottom: 9px;
  text-align: center;
  line-height: 32px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.toolButton {
  color: #fff;
  border: 1px solid #999;
  padding: 2px 5px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}
.body {
  margin: 20px 0;
  .icon {
    font-size: 22px;
  }
  .active {
    color: #1890ff;
  }
  .contrast {
    line-height: 40px;
    color: #1890ff;
    cursor: pointer;
  }
  .echartTip {
    display: flex;
    align-items: center;
    background-color: #f0f2f5;
    padding: 5px 10px;
    margin: 10px 0;
  }
  .openPop {
    display: flex;
    justify-content: space-between;
    position: relative;
    .button {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .checkPop {
      position: absolute;
      top: 40px;
      z-index: 9999;
      background-color: #fff;
    }
  }
  .tab {
    text-align: center;
    border: 1px solid #ddd;
    padding: 5px 15px;
    min-width: 90px;
    cursor: pointer;
    &.active {
      border: 1px solid #1890ff;
    }
  }
  // /deep/ .ant-table-content {
  //   font-size: 12px;
  // }
  /deep/ th.column-money,
  /deep/ td.column-money {
    text-align: center !important;
  }
  // .seniority::-webkit-scrollbar {
  /* / 滚动条整体样式 / */
  /* width: 10px; / 高宽分别对应横竖滚动条的尺寸 / */
  //   height: 10px;px
  // }
  // .seniority::-webkit-scrollbar-thumb {
  /* / 滚动条里面小方块 / */
  //   border-radius: 10px;
  //   -webkit-box-shadow: inset 0 0 5px  #1890ff;
  //   background:  #1890ff;
  // }
  // .seniority::-webkit-scrollbar-track {
  /* / 滚动条里面轨道 / */
  //   -webkit-box-shadow: inset 0 0 5px  #1890ff;
  //   border-radius: 10px;
  //   background: #ededed;
  // }
}
</style>
