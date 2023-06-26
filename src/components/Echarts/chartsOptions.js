export const DEFAULT_BAR_OPTION = {
  tooltip: {
    textStyle: {
      fontSize: 12
    },
    padding: 10,
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    data: []
  },
  grid: {
    left: '3%',
    right: '10%',
    bottom: '8%', //距离底部
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {}
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: []
}

export const DEFAULT_LINE_OPTION = {
  //  color: ['#3398DB'],
  grid: {
    left: '3%',
    right: '10%',
    bottom: '8%', //距离底部
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    textStyle: {
      fontSize: 12
    },
    padding: 10,

    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'line' // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    data: []
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      alignWithLabel: true
    }
    //  axisLabel: {
    //    interval:0,
    //    rotate:-30//文字倾斜
    //  }
  },
  yAxis: {
    type: 'value'
  },
  series: []
}
export const DEFAULT_PIE_OPTION = {
  tooltip: {
    trigger: 'item'
    //  formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 10,
    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',

      // radius: ['50%', '70%'], //中间有没有圈
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          formatter: '1111', //中间固定值
          fontSize: '30',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
}
