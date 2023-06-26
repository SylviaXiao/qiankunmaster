<template>
  <div class="f-charts-wrapper" id="f-charts-wrapper">
    <div class="charts-main" :id="chartsId"></div>
  </div>
</template>

<script>
import { DEFAULT_BAR_OPTION, DEFAULT_LINE_OPTION } from './chartsOptions'
export default {
  name: 'FCharts',
  props: {
    toolTipValueFormatter: {
      type: Function,
      default: value => value
    },
    valueFormatter: {
      type: Function,
      default: params => params.value
    },
    showSeriesLabel: {
      type: Boolean,
      default: false
    },

    fontSizeX: {
      type: Number,
      default: 12
    },
    dataZoomShow: {
      type: Boolean,
      default: false
    },
    dataZoomStartValue: {
      type: Number,
      default: 0
    },
    dataZoomEndValue: {
      type: Number,
      default: 14
    },
    type: {
      type: String,
      required: true,
      default: 'bar',
      validator: value => {
        return value === 'line' ? 'line' : 'bar'
      }
    },
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    format: {
      type: Object,
      default: () => {}
    },
    tooltip: {
      type: String,
      default: null
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(n, o) {
        if (n) {
          if (this.ChartEcharts) {
            this.setOption()
          }
        }
      }
    }
  },
  data() {
    return {
      seriesLabel: {
        normal: {
          show: true,
          lineHeight: 10,
          formatter: this.valueFormatter ? this.valueFormatter : '{c}',
          position: 'top',
          textStyle: {
            color: '#000',
            fontSize: 10
          }
        }
      },
      chartsId: `charts${Math.floor(Math.random() * 100000000000000)}`,
      ChartEcharts: null
    }
  },
  mounted() {
    let that = this
    this.initCharts()
    window.addEventListener('resize', function() {
      if (that.ChartEcharts) {
        that.$nextTick(item => {
          that.geth()
        })
      }
    })
  },
  methods: {
    setOption() {
      const { formatData } = this
      const chartsOption = formatData()
      this.ChartEcharts.setOption(chartsOption)
    },
    geth() {
      let that = this
      setTimeout(function() {
        let docEl = document.getElementById('f-charts-wrapper')
        if(docEl){
          let w = docEl.clientWidth
          let h = docEl.clientHeight
          that.$nextTick(() => {
            that.ChartEcharts.resize({ width: w, height: h })
          })
        }
      }, 100)
    },
    initCharts() {
      const { chartsId, formatData } = this
      const dom = document.getElementById(chartsId)
      const myCharts = this.$charts.init(dom)
      const chartsOption = formatData()
      myCharts.setOption(chartsOption)
      this.ChartEcharts = myCharts
      this.geth()
    },
    formatData() {
      const { data, format, type, tooltip } = this
      const x = [],
        y = []
      data.map(item => {
        Object.keys(item).forEach(value => {
          if (value === format.x) {
            x.push(item[value])
          }
          if (value === format.y) {
            y.push(item[value])
          }
        })
      })
      const option = type === 'bar' ? DEFAULT_BAR_OPTION : type === 'line' ? DEFAULT_LINE_OPTION : {}
      option.xAxis[0] ? (option.xAxis[0].data = x) : (option.xAxis.data = x)
      option.xAxis[0] ? (option.xAxis[0].axisLabel.textStyle = { fontSize: this.fontSizeX }) : (option.xAxis.axisLabel.textStyle = { fontSize: this.fontSizeX })
      option.series[0].data = y
      option.series[0].name = tooltip
      option.series[0].label = this.showSeriesLabel ? this.seriesLabel : null
      option.tooltip.valueFormatter = value => (this.toolTipValueFormatter ? this.toolTipValueFormatter(value) : value)
      // option.tooltip.axisPointer = 'line'
      if (this.dataZoomShow && this.data.length > this.dataZoomEndValue) {
        option.dataZoom = [
          //滚动条
          {
            show: this.dataZoomShow,
            type: 'slider',
            realtime: true,
            startValue: this.dataZoomStartValue,
            endValue: this.dataZoomEndValue,
            xAxisIndex: [0],
            bottom: '10',
            left: '30',
            height: 10,
            borderColor: 'rgba(0,0,0,0)',
            textStyle: {
              color: '#05D5FF'
            }
          }
        ]
      }
      return option
    }
  }
}
</script>

<style lang="less" scoped>
.charts-main {
  height: 400px;
  width: 100%;
}
.f-charts-wrapper {
  height: 400px;
  width: 100%;
}
</style>
