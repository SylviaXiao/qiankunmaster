<template>
  <div>
    <div class="chart" :id="chartsId"></div>
  </div>
</template>

<script>
// import { COLOR_ARRAY } from '../color';
import echart from 'echarts'
import { DEFAULT_PIE_OPTION } from './chartsOptions'
/** setting
 * 1.圈中空心一直展示所有数据总和
 * // 外部setting里的series需设置为 
        series: {
        radius: ['50%', '70%'], //中间有没有圈
        label: {
          text: '引流数',//总条数前面的文字
          show: true,
          position:'center',
          formatter: 'all',
          alignTo: 'none',
          bleedMargin: 5
        },
        labelLine: {
          show: true
        }
      }
    2.圈外一直标出分类及相应的value
    series: {
            radius: ['50%', '70%'], //中间有没有圈
            label: {
              show: true,
              formatter: '{b}：{c}', 
              position: 'outer',
              alignTo: 'none',
              bleedMargin: 5
            },
            labelLine: {
              show: true
            }
          }
 
 **/
export default {
  name: 'ChartPie',
  props: {
    data: {
      type: [Object, Array],
      default: () => []
    },
    //横板展示，竖版展示
    axis: {
      type: String,
      default: 'x'
    },
    setting: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chartsId: `charts${Math.floor(Math.random() * 100000000000000)}`,
      chart: null,
      extraOption: {}
    }
  },
  watch: {
    data: {
      immediate: true,
      handler() {
        console.log(this.data)
        this.dataTreat()
        this.updateChartView()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const dom = document.getElementById(this.chartsId)
      if (dom) {
        this.chart = this.$charts.init(dom)
        this.data.series && this.dataTreat()
        this.updateChartView()
        window.addEventListener('resize', this.handleWindowResize)
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  computed: {
    allData() {
      let arr = this.data.series.map(item => Number(item.data))
      console.log(arr)
      let total = arr.reduce((a, b) => {
        return a + b
      }, 0)
      console.log(this.data.series)
      return `${this.setting.series.label.text}:${total}`
    }
  },
  methods: {
    /**
     * 将业务数据加入到基础样式配置中
     * @returns {Object} 完整的echart配置
     */
    //数据处理
    dataTreat() {
      // DEFAULT_PIE_OPTION[`${this.axis}Axis`][0].data = this.data.axises
      console.log(this.data)
      let data = this.data.series.map(item => {
        let todo = {
          value: item.data,
          name: item.name
        }
        return todo
      })
      let series = [
        {
          name: '',
          type: 'pie',
          // radius: ['50%', '70%'], //中间有没有圈
          label: {
            show: false,
            position: 'center'
          },
          // itemStyle: { color: '#F38A7C' },
          data
        }
      ]
      if (this.setting.series.label && this.setting.series.label.formatter) {
        let val = this.setting.series.label.formatter
        if (val === 'all') {
          this.setting.series.label.formatter = this.allData //all 圈中间显示总条数
        }
      }
      if (!this.extraOption.series) {
        this.$set(this.extraOption, 'series', series)
      } else {
        this.extraOption.series = series
      }
      Object.keys(this.setting).forEach(item => {
        let todo = {}
        switch (item) {
          
          case 'title':
            console.log(this.data.title)
            todo = {
              text: this.data.title,
              ...this.setting[item]
            }
            console.log(todo)
            return this.$set(this.extraOption, item, todo)
          case 'legend':
            todo = {
              data: this.data.series.length < 1 ? [] : this.data.series.map(item => item.name),
              ...this.setting[item]
            }
            return this.$set(this.extraOption, item, todo)
          case 'series':
            return (this.extraOption.series = this.extraOption.series.map(x => {
              return {
                ...x,
                ...this.setting[item]
              }
            }))
          case 'color':
              return this.$set(this.extraOption, item, this.setting[item])
        }
      })
    },
    // assembleDataToOption() {
    //   const formatter = name => {
    //     const total = this.seriesData.reduce((acc, cur) => acc + cur.value, 0)
    //     const data = this.seriesData.find(item => item.name === name) || {}
    //     const percent = data.value ? `${Math.round((data.value / total) * 100)}%` : '0%'

    //     return `{a|${name}}{b|${percent}}`
    //   }

    //   return
    //   let data = Object.assign(
    //     {},
    //     BASIC_OPTION,
    //     { color: COLOR_ARRAY },
    //     {
    //       legend: { formatter },
    //       series: [{ data: this.seriesData }]
    //     },
    //     this.extraOption
    //   )
    //   return data
    // },
    //echart配置
    assembleDataToOption() {
      console.log(DEFAULT_PIE_OPTION)
      let data = Object.assign({}, DEFAULT_PIE_OPTION, this.extraOption)
      return data
    },
    //更新echart视图
    updateChartView() {
      if (!this.chart) return
      const fullOption = this.assembleDataToOption()
      console.log(fullOption)
      this.chart.setOption(fullOption, true)
      this.handleWindowResize()
    },
    /**
     * 当窗口缩放时，echart动态调整自身大小
     */
    handleWindowResize() {
      if (!this.chart) return
      this.chart.resize()
    }
  }
}
</script>

<style lang="less" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
