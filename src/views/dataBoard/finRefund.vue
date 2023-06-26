<template>
  <div>
    <div style="font-size:0.2rem;font-weight:bold;margin-bottom:0.2rem;">事件分析</div>
    <a-card>
      <div style="display:flex;width:100%;">
        <div style="width:0.9rem;">学员退费：</div>
        <div style="width:100%;">
          <div>
            <a-radio-group v-model="checked">
              <a-row>
                <a-col :span="8">
                  <a-radio value="count">总次数</a-radio>
                </a-col>
                <a-col :span="8">
                  <a-radio value="countStu">总人数</a-radio>
                </a-col>
                <a-col :span="8">
                  <a-radio value="sumPrice">总金额</a-radio>
                </a-col>
              </a-row>
            </a-radio-group>
          </div>
          <MsgSelect :options="options" @changeList="changeList"></MsgSelect>
        </div>
      </div>
      <div style="display:flex;width:100%;align-items:center;">
        <div style="width:0.9rem;">公用属性：</div>
        <div style="width:100%;">
          按
          <a-select v-model="globalFilter" style="width: 1rem" @change="changeCheckList(globalFilter)">
            <a-select-option v-for="todo in filterSelect" :key="todo.id"> {{ todo.name }} </a-select-option>
          </a-select>
          查看
        </div>
      </div>
    </a-card>
    <echartTemplate
      ref="echartTemplate"
      :allControl="allControl"
      :echartAllSet="echartAllSet"
      :detailTableSet="detailTableSet"
      @searchSubmit="searchSubmit"
      @changeCondition="changeCondition"
      :comparison="comparison"
    />
  </div>
</template>

<script>
import moment from 'moment'
import echartTemplate from '@/components/echartTemplate/echartTemplate'
import MsgSelect from '@/components/MsgSelect/MsgSelect'
import { refundCount, refundStatBySchool, refundDetail } from '@/api/echart/refundStat'
import { selectAllEduDance, selectAllEduType, selectSchoolTree, selectAllArea } from '@/api/echart/common'

// const columns = [
//   {
//     fixed: 'left',
//     // title: '时间',
//     dataIndex: 'school1',
//     width: 130,
//     className: 'column-money',
//     scopedSlots: { title:'school' }
//   },
//   {
//     fixed: 'left',
//     // title: '时间',
//     dataIndex: 'time1',
//     width: 130,
//     className: 'column-money',
//     scopedSlots: { title:'time' }
//   }
//   // {
//   //   title: '合计',
//   //   dataIndex: 'total',
//   //   width: 120,
//   //   sorter: true,
//   //   scopedSlots: { customRender: 'total' },

//   // },
// ]
export default {
  data() {
    return {
      // columns,
      checked: 'count',
      options: [
        //属性下拉选项
        { name: '班型', value: 'typeId', children: [], operates: [], type: 'select' },
        { name: '舞种', value: 'danceId', children: [], operates: [], type: 'select' },
        {
          name: '是否开卡',
          value: 'cardUsed',
          children: [
            { name: '已开卡', data: 1 },
            { name: '未开卡', data: 0 }
          ],
          operates: [],
          type: 'whether'
        },
        {
          name: '报名情况',
          value: 'refundDuration',
          children: [
            { name: '新报', data: 0 },
            { name: '续报名', data: 1 }
          ],
          operates: [],
          type: 'select'
        },
        {
          name: '报名时间',
          value: 'refundPeriod',
          children: [],
          operates: [],
          type: 'number'
        },
        {
          name: '上课情况',
          value: 'refundDuration1',
          children: [
            { name: '已上课', data: 0 },
            { name: '未上课', data: 1 }
          ],
          operates: [],
          type: 'select'
        },
        {
          name: '上课老师',
          value: 'refundDuration2',
          children: [],
          operates: [],
          type: 'select'
        },
        {
          name: '退费原因',
          value: 'refundReason',
          children: [
            { name: '个人原因', data: '个人原因' },
            { name: '老师教学', data: '老师教学' },
            { name: '店面服务', data: '店面服务' },
            { name: '环境卫生', data: '环境卫生' },
            { name: '产品成果', data: '产品成果' },
            { name: '夸大宣传', data: '夸大宣传' },
            { name: '其他', data: '其他' }
          ],
          operates: [],
          type: 'select'
        }
      ],
      selectType: null,
      scene: [],
      searchData: {}, //搜索数据
      // seriesData: {}, //echart数据
      // sceneText: [], //对比数据
      condition: {},
      detailJudge: params => {
        console.log(typeof params)
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
      loadData: parameter => {
        let obj = {
          sorter: {
            sortField: parameter.sortField,
            sortOrder: parameter.sortOrder
          }
        }
        if(this.echartData.startDate) {
          return refundStatBySchool(Object.assign(obj, this.echartData)).then(res => {
            return res
          })
        }
      },
      allControl: {
        // showTable: true,
        conditionTips: true,
        search: true,
        TypeButton: true,
        rankShow: true
      },
      echartAllSet: {
        setting: {
          ChartLine: {
            defaultSelect: 5,
            title: {
              left: 'center'
            },
            legend: {
              show: true,
              type: 'scroll',
              orient: 'vertical',
              right: 10,
              top: 20,
              bottom: 20
            },
            tooltip: {
              show: true,
              trigger: 'axis',
              textStyle: {
                fontSize: 12
              },
              formatter: params => {
                let arr = []
                params.forEach(item => {
                  console.log(item)
                  console.log(this.referenceAxises)
                  let index = arr.findIndex(todo => todo[0].seriesName === item.seriesName)
                  let obj = {
                    date:
                      item.componentIndex === 0
                        ? item.name
                        : this.referenceAxises[item.dataIndex] ,
                    marker: item.marker,
                    seriesName: item.seriesName,
                    value: item.value
                  }
                  if (index === -1) {
                    arr.push([obj])
                  } else {
                    arr[index].push(obj)
                  }
                })
                let innerHtml = []
                arr.forEach(item => {
                  console.log(item)
                  innerHtml.push(
                    `<div>
                    <div>${item[0].date}${item.length>1?' ( '+item[1].date+' )':''}</div>
                    <div>${item[0].marker}${item[0].seriesName}:${item[0].value}${item.length>1?' ( '+item[1].value+' )':''}</div>
                    </div>`
                  )
                })
                return innerHtml.join(' ')
              },
              axisPointer: {
                type: 'line'
              }
            }
          },
          ChartBar: {
            defaultSelect: 5,
            title: {
              left: 'center'
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              right: 10,
              top: 20,
              bottom: 20
            },
            series: {
              barWidth: 30,
              stack: '堆叠'
            }
          }
        },
        echartType: [],
        loading: false,
        resetType: true
      },
      globalFilter: '',
      filterSelect: [
        { id: '', name: '总体' },
        { id: 'type', name: '班型' },
        { id: 'area', name: '地区' },
        { id: 'school', name: '分馆' },
        { id: 'dance', name: '舞种' }
      ],
      comparison: {
        sceneText: [], //对比数据
        checkBoxFilter: []
      },
      referenceAxises:[]
    }
  },
  mounted() {
    this.$refs.echartTemplate.tableShow = true
  },
  components: {
    echartTemplate,
    MsgSelect
  },

  computed: {
    echartData() {
      let dimensionValue = this.condition.checkIds || (this.globalFilter === 'school' ? this.condition.schoolId : null)
      return {
        dateType: this.searchData.dateType || null,
        dimension: this.globalFilter || null,
        endDate: this.searchData.endDate || null,
        indicator: this.checked || 'count',
        operate: this.selectType || 'AND',
        sceneData: this.scene.length ? this.scene : [],
        dimensionValue: dimensionValue && dimensionValue.length ? dimensionValue : null,
        startDate: this.searchData.startDate || null,
        compare: this.condition.contrastDate && this.condition.contrastDate[0].startDate ? this.condition.contrastDate : null
      }
    },
    detailTableSet() {
      return {
        loadTableData: 'refundDetail', //表中表的调用接口名称
        tooltipButton: [{ text: '用户退费明细', id: 1 }], //表格悬停的案件列表
        tableParams: this.echartData, //接口所需参数
        loadData: this.loadData, //接口
        // columns: this.columns, //表头
        detailJudge: this.detailJudge, //表格数据下划线加悬停效果的数据校验
        perm:'databoard:base:export'//导出权限
      }
    }
  },

  created() {
    // this.getData()
  },
  watch: {
    echartData: {
      deep: true,
      handler(n) {
        n && this.getData()
      }
    },
    'condition.rankSelect'() {
      this.echartAllSet.setting.ChartLine.defaultSelect = this.condition.rankSelect
      this.echartAllSet.setting.ChartBar.defaultSelect = this.condition.rankSelect
    }
  },
  methods: {
    //分馆
    getselectSchoolTree() {
      selectSchoolTree({}).then(res => {
        this.comparison.checkBoxFilter = []
        res.data.forEach(item => {
          item.children.forEach(todo => {
            todo.data = todo.deptNo
            this.comparison.checkBoxFilter.push(todo)
          })
        })
      })
    },
    //班型
    getselectAllEduType() {
      selectAllEduType({}).then(res => {
        this.comparison.checkBoxFilter = res.data
      })
    },
    //舞种
    getselectAllEduDance() {
      selectAllEduDance({}).then(res => {
        this.comparison.checkBoxFilter = res.data
      })
    },
    //地区
    selectAllArea() {
      selectAllArea({}).then(res => {
        this.comparison.checkBoxFilter = res.data
      })
    },
    //更改筛选列表
    changeCheckList(val) {
      if (val === 'type') {
        this.getselectAllEduType()
      } else if (val === 'area') {
        this.selectAllArea()
      } else if (val === 'school') {
        this.getselectSchoolTree()
      } else if (val === 'dance') {
        this.getselectAllEduDance()
      } else {
        this.comparison.checkBoxFilter = []
      }
    },
    changeCondition(data) {
      this.condition = data
    },
    //搜索结果
    searchSubmit(val) {
      console.log(val)
      this.searchData = val
    },
    getData() {
      if (this.searchData.startDate) {
        if (this.globalFilter === '' && this.echartData.dimensionValue && this.echartData.dimensionValue.length) return
        this.echartAllSet.loading = true
        refundCount(this.echartData).then(res => {
          //对比时间X轴
          this.referenceAxises = res.data.referenceAxises?res.data.referenceAxises[0]:[]
          //一条数据不显示图例
          this.echartAllSet.setting.ChartLine.legend.show = res.data.series.length > 1
          this.echartAllSet.setting.ChartBar.legend.show = res.data.series.length > 1

          this.echartAllSet.echartType = [
            {
              // type: this.condition.echartType ? this.condition.echartType : 'ChartLine',
              type: 'ChartLine',
              seriesData: res.data
            }
          ]
          this.echartAllSet.loading = false
        })
      }
    },
    changeList(type, data) {
      this.selectType = type
      this.comparison.sceneText = []
      if (data.length) {
        this.scene = data
          .filter(item => item.scene.length !== 0)
          .map(item => {
            return {
              key: item.kind,
              operate: item.operate,
              value: item.scene
            }
          })
        data
          .filter(item => item.scene.length !== 0)
          .forEach(item => {
            this.comparison.sceneText = this.comparison.sceneText.concat(item.sceneText)
          })
      }
    },
    onChange(checkedValues) {
      this.checked = checkedValues
    }
  }
}
</script>
<style lang="less" scoped>
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
  background-color: #dddddd52;
  padding: 5px 10px;
  margin: 10px 0;
}
</style>
