<template>
  <div>
    <div :id="chartsId" class="chart" ref="chartsId"></div>
  </div>
</template>

<script>
import { DEFAULT_LINE_OPTION } from './chartsOptions'
// import { delete } from 'node_modules/vue/types/umd'
// setting:{
//  属性配置
//         title:{
//           left: 'center',
//         },
//         legend: {
//             x: 'right',
//             y: 'bottom'
//           }
//       }
export default {
  name: 'ChartLine',
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
      extraOption: {},
      seriesData: [],
      formatter: null
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.dataTreat()
        this.updateChartView()
      }
    }
  },
  mounted() {
    const dom = this.$refs.chartsId
    this.chart = this.$charts.init(dom)
    this.data.series && this.dataTreat()
    this.updateChartView()
    window.addEventListener('resize', this.handleWindowResize)
  },
  methods: {
    //数据处理
    dataTreat() {
      DEFAULT_LINE_OPTION[`${this.axis}Axis`].data = this.data.axises
      let series = this.data.series.map(item => {
        let todo = {
          type: 'line',
          data: item.data,
          name: item.name,
          smooth: true,
          lineStyle: {
            type: 'solid'
          }
        }
        if (item.group == 1) {
          todo.lineStyle.type = 'dashed'
        }
        return todo
      })
      if (!this.extraOption.series) {
        this.$set(this.extraOption, 'series', series)
      } else {
        this.extraOption.series = series
      }
      // let tooltip = {
      //   formatter(params) {
      //     console.log(params)
      //   }
      // }
      // this.$set(this.extraOption, 'tooltip', tooltip)

      // this.extraOption.console.log(this.setting)
      let setting = JSON.parse(JSON.stringify(this.setting))
      Object.keys(setting).forEach(item => {
        let todo = {}
        switch (item) {
          case 'title':
            todo = {
              text: this.data.title,
              ...setting[item]
            }
            return this.$set(this.extraOption, item, todo)
          case 'legend':
            todo = {
              data: this.data.series.length < 1 ? [] : this.data.series.map(item => item.name),
              selected: this.defaultSelect,
              ...setting[item]
            }
            return this.$set(this.extraOption, item, todo)
          case 'series':
            return (this.extraOption.series = this.extraOption.series.map(x => {
              return {
                ...x,
                ...setting[item]
              }
            }))
          case 'tooltip':
            todo = {
              ...this.setting[item]
            }
            console.log(setting[item])
          return this.$set(this.extraOption, item, todo)
        }
      })
    },
    //echart配置
    assembleDataToOption() {
      let data = Object.assign({}, DEFAULT_LINE_OPTION, this.extraOption)
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
  },
  computed: {
    defaultSelect() {
      let obj = {}
      if (this.data.series[0].group!==null) {
        let arr = this.data.series.map(item => {
          if (item.group === '0') {
            return item
          }
        })
        arr
          .filter(item => item)
          .forEach((item, index) => {
            console.log(item, index ,this.setting.defaultSelect)
            this.$set(obj, item.name, index < this.setting.defaultSelect)
          })
      } else {
        if (this.setting.defaultSelect) {
          this.data.series.forEach((item, index) => {
            // if(item)
            console.log(index , this.setting.defaultSelect)
            this.$set(obj, item.name, index < this.setting.defaultSelect)
          })
        } else {
          this.data.series.forEach(item => {
            this.$set(obj, item.name, true)
          })
        }
      }
      return obj
    }
  }
}
</script>
<style lang="less" scoped>
.chart {
  background-color: #fff;
  width: 100%;
  height: 100%;
}
</style>
