<template>
  <div>
    <div style="display:flex;justify-content: space-between;align-items:center;margin-bottom:0.2rem;">
      <div style="font-size:0.2rem;font-weight:bold;">目标数据</div>
      <a-radio-group v-model="resource" button-style="solid">
        <a-radio-button :value="item.id" v-for="item in resourceList" :key="item.id">{{ item.text }}</a-radio-button>
      </a-radio-group>
    </div>
    <a-card :bordered="false" style="margin-bottom:0.2rem;">
      <EchartSearch :searchParams="searchParams" style="margin-left:-0.1rem;margin-bottom:-0.4rem;height:0.8rem;" @searchSubmit="searchSubmit" />
    </a-card>
    <a-card :bordered="false" style="margin-bottom:0.2rem;"> 当前时间进度： {{ dateRatio }}%(已过天数/当月总天数) </a-card>
    <!-- <a-card :bordered="false"> -->
    <a-spin :spinning="echartLoading">
      <a-row :gutter="12">
        <a-col :span="8" v-for="(item, index) in echartAllSet.echartType" :key="index" style="margin-bottom:0.2rem;">
          <a-card style="position:relactive;">
            <div v-if="total(item.seriesData, item.type)" class="total">目标计划：{{ total(item.seriesData, item.type) }}</div>
            <Echarts
              :data="item.seriesData"
              :type="item.type"
              :setting="echartAllSet.setting[item.type]"
              style="width:100%;height:4rem;"
              v-if="item.seriesData.series"
            ></Echarts>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
    <!-- </a-card> -->
    <!-- <draggable class="list-group" tag="div" v-model="templateList" v-bind="{ animation: 0, group: 'description', sort: true }">
      <span v-for="(item, index) in templateList" :key="index" style="border:1px solid ;">{{ item.text }}</span>
    </draggable> -->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Echarts from '@/components/Echarts/index.vue'
import EchartSearch from '@/components/EchartSearch/index.vue'
import {
  analysisNetworkTarget,
  analysisNetworkTargetPrice,
  analysisTarget,
  analysisTargetDept,
  analysisNetworkTargetDept,
  analysisNetworkTargetPriceDept
} from '@/api/echart/analysisChannel'

export default {
  data() {
    return {
      templateList: [
        { text: '时间', id: 1 },
        { text: '课程', id: 2 },
        { text: '导师', id: 3 },
        { text: '上课时间', id: 4 },
        { text: '111', id: 5 },
        { text: '2222', id: 6 }
      ],
      resourceList: [
        { id: 'channel', text: '客服组' },
        { id: 'channel-business', text: '推广组' },
        { id: 'channel-newmedia', text: '新媒体组' }
      ],
      resource: 'channel',
      searchParams: [
        {
          type: 'date',
          key: 'Month',
          label: '',
          mode: ['month', 'month'],
          placeholder: '请选择时间',
          format: 'YYYY-MM',
          defaultSelectMonth: true,
          disabledMonth: true,
          allowClear: false
        }
      ],
      searchData: {},
      echartAllSet: {
        echartType: [
          {
            type: 'ChartPie',
            seriesData: []
          },
          {
            type: 'ChartPie',
            seriesData: []
          },
          {
            type: 'ChartPie',
            seriesData: []
          },
          {
            type: 'ChartBar',
            seriesData: []
          },
          {
            type: 'ChartBar',
            seriesData: []
          },
          {
            type: 'ChartBar',
            seriesData: []
          }
        ],
        loading: false,
        codeList: [],
        allData: {},
        dateSearch: {},
        setting: {
          ChartPie: {
            title: {
              show: true,
              textStyle: {
                fontSize: 16
              }
              //   left: 'center'
            },
            grid: {
              // left: '3%',
              // right: '10%',
              bottom: '-10%', //距离底部
              containLabel: true
            },
            legend: {
              x: 'center',
              y: 'bottom'
            },
            color: ['#FA8072', '#87CEFA'],

            //外标分类及value
            series: {
              // name: '访问来源',
              radius: ['30%', '40%'], //中间有没有圈
              center: ['50%', '50%'],
              label: {
                show: true,
                formatter: '{b}：\n{c}({d}%)',
                position: 'outer',
                alignTo: 'none',
                bleedMargin: 5
              },
              labelLine: {
                show: true
              }
            }
          },
          ChartBar: {
            title: {
              show: true,
              textStyle: {
                fontSize: 16
              }
            },
            color: ['#dcf1b3', '#FA8080', '#87cefa', '#b8f1cc', '#ca8622'],
            legend: {
              x: 'center',
              y: 'bottom'
            }
            // series: {
            //   itemStyle: {
            //     normal: {
            //       //这里是重点
            //       color: function(params) {
            //         console.log(params)
            //         //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
            //         var colorList = ['#f1ccb8', '#f1f1b8', '#b8f1ed', '#b8f1cc', '#ca8622']
            //         return colorList[params.componentIndex]
            //       }
            //     }
            //   }
            // },
            // color: function(params) {
            //         console.log(params)
            //         //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
            //         var colorList = ['#f1ccb8', '#f1f1b8', '#b8f1ed', '#b8f1cc', '#ca8622']
            //         return colorList[params.componentIndex]
            //       }
          }
        }
      },
      echartLoading: false,
      echartType: []
    }
  },

  computed: {
    //时间占比
    dateRatio() {
      let MonthDay = this.mGetDate()
      let date = new Date().getDate()
      return ((date / MonthDay)* 100).toFixed(2) 
    },
    echartData() {
      return {
        module: this.resource,
        endDate: this.searchData.endMonth + '-01' || null,
        startDate: this.searchData.startMonth + '-01' || null
      }
    }
  },
  watch: {
    echartData: {
      deep: true,
      handler(n) {
        n && this.getEchartData()
        // n && this.getGridData()
      }
    },
    templateList: {
      deep: true,
      handler(n) {
        console.log(n)
      }
    }
  },

  created() {},

  methods: {
    total(data, type) {
      if (data && data.series && data.series.length && type === 'ChartPie') {
        let total = data.series
          .map(item => item.data)
          .reduce((a, b) => {
            return a * 1 + b * 1
          }, 0)
        return total
      } else {
        return false
      }
    },
    getEchartData() {
      this.echartLoading = true
      analysisNetworkTarget(this.echartData).then(res => {
        if (res.code === 200) {
          this.echartAllSet.echartType[0].seriesData = res.data
        }
      })
      analysisTarget(this.echartData).then(res => {
        if (res.code === 200) {
          this.echartAllSet.echartType[2].seriesData = res.data
        }
      })
      analysisNetworkTargetPrice(this.echartData).then(res => {
        if (res.code === 200) {
          res.data.series.forEach(item => {
            item.data = (item.data / 10000).toFixed(2)
          })
          this.echartAllSet.echartType[1].seriesData = res.data
        }
      })
      if (this.resource === 'channel') {
        analysisTargetDept(this.echartData).then(res => {
          if (res.code === 200) {
            this.echartAllSet.echartType[3].seriesData = res.data
          }
        })
        analysisNetworkTargetDept(this.echartData).then(res => {
          if (res.code === 200) {
            this.echartAllSet.echartType[4].seriesData = res.data
          }
        })
        analysisNetworkTargetPriceDept(this.echartData).then(res => {
          if (res.code === 200) {
            res.data.series.forEach(item => {
              item.data = item.data.map(todo => {
                todo = (todo / 10000).toFixed(2)
                return todo
              })
            })
            this.echartAllSet.echartType[5].seriesData = res.data
          }
        })
      } else {
        this.echartAllSet.echartType.filter(item => item.type === 'ChartBar').forEach(item => (item.seriesData = []))
      }
      this.echartLoading = false
    },
    mGetDate() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var d = new Date(year, month, 0)
      return d.getDate()
    },
    searchSubmit(val) {
      this.searchData = val
      // this.changeCondition()
    }
  },
  components: {
    Echarts,
    EchartSearch,
    draggable
    // STable,
  }
}
</script>
<style lang="less" scoped>
.total {
  position: absolute;
  top: 40px;
  left: 25px;
}
</style>
