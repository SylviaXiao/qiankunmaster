export const DEFAULT_BAR_OPTION = {
  color: ['#3398DB'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
        interval:0,
        rotate:-30
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '金额',
      type: 'bar',
      barWidth: '60%',
      data: []
    }
  ]
}

export const DEFAULT_LINE_OPTION = {
  color: ['#3398DB'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      alignWithLabel: true
    },
    axisLabel: {
      interval:0,
      rotate:-30//文字倾斜
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name:'数量',
    data: [],
    type: 'line'
  }]
};
export const DEFAULT_PIE_OPTION = {
         tooltip: {
           trigger: 'item',
           formatter: '{a} <br/>{b}: {c} ({d}%)'
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
             radius: ['50%', '70%'],
             avoidLabelOverlap: false,
             label: {
               show: false,
               position: 'center'
             },
             emphasis: {
               label: {
                 show: true,
                 fontSize: '30',
                 fontWeight: 'bold'
               }
             },
             labelLine: {
               show: false
             },
             data: [
               { value: 335, name: '直接访问' },
               { value: 310, name: '邮件营销' },
               { value: 234, name: '联盟广告' },
               { value: 135, name: '视频广告' },
               { value: 1548, name: '搜索引擎' }
             ]
           }
         ]
       }
