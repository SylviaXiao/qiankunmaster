<template>
  <div :id="chartsId" class="chart"></div>
</template>

<script>
import { merge } from 'lodash'
import { DEFAULT_BAR_OPTION } from './chartsOptions'
export default {
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
      immediate: true,
      handler() {
        console.log(this.data)
        this.dataTreat()
        this.updateChartView()
      }
    }
  },
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
  mounted() {
    const dom = document.getElementById(this.chartsId)
    this.chart = this.$charts.init(dom)
    this.data.series && this.dataTreat()

    this.updateChartView()
    window.addEventListener('resize', this.handleWindowResize)
  },
  computed: {
    defaultSelect() {
      let obj = {}
      if (this.data.series[0].group) {
        let arr = this.data.series.map(item => {
          if (item.group == 1) {
            return item
          }
        })
        arr
          .filter(item => item)
          .forEach((item, index) => {
            console.log(item, index < this.setting.defaultSelect)
            this.$set(obj, item.name, index < this.setting.defaultSelect)
          })
      } else {
        if (this.setting.defaultSelect) {
          this.data.series.forEach((item, index) => {
            // if(item)
            console.log(item)
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
  },
  methods: {
    //数据处理
    dataTreat() {
      DEFAULT_BAR_OPTION[`${this.axis}Axis`][0].data = this.data.axises
      let series = this.data.series.map(item => {
        let todo = {
          type: 'bar',
          data: item.data,
          name: item.name
        }
        return todo
      })
      if (!this.extraOption.series) {
        this.$set(this.extraOption, 'series', series)
      } else {
        this.extraOption.series = series
      }
      if (this.setting) {
        Object.keys(this.setting).forEach(item => {
          let todo = {}
          switch (item) {
            case 'title':
              todo = {
                text: this.data.title,
                ...this.setting[item]
              }
              return this.$set(this.extraOption, item, todo)
            case 'legend':
              todo = {
                data: this.data.series.length < 1 ? [] : this.data.series.map(item => item.name),
                selected: this.defaultSelect,
                ...this.setting[item]
              }
              return this.$set(this.extraOption, item, todo)
            case 'series':
              return (this.extraOption.series = this.extraOption.series.map(x => {
                console.log(this.setting[item])
                return {
                  ...x,
                  ...this.setting[item]
                }
              }))
            case 'color':
              return this.$set(this.extraOption, item, this.setting[item])
          }
        })
      }
    },
    //echart配置
    assembleDataToOption() {
      let data = Object.assign({}, DEFAULT_BAR_OPTION, this.extraOption)
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
  background-color: #fff;
  width: 100%;
  height: 100%;
}
</style>
