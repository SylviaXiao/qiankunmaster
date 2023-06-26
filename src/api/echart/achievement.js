import { echartAxios } from '@/utils/request'

const api = {
  queryAchievement: '/erp/achievement/queryAchievement', //运营部数据看板业绩格子图
  findAllModule: '/erp/achievement/findAllModule', //全部板块
  achievementChartStat: '/erp/achievement/achievementChartStat', //运营部数据看板业绩折线图
  achievementTable: '/erp/achievement/achievementTable', //图表明细
  achievementDetail: '/erp/achievement/achievementDetail' //图表明细
}

export function achFindAllModule(params) {
  return echartAxios({
    url: api.findAllModule,
    method: 'post',
    data: params
  })
}
export function queryAchievement(params) {
  return echartAxios({
    url: api.queryAchievement,
    method: 'post',
    data: params
  })
}
export function achievementChartStat(params) {
  return echartAxios({
    url: api.achievementChartStat,
    method: 'post',
    data: params
  })
}
export function achievementTable(params) {
  return echartAxios({
    url: api.achievementTable,
    method: 'post',
    data: params
  })
}
export function achievementDetail(params) {
  return echartAxios({
    url: api.achievementDetail,
    method: 'post',
    data: params
  })
}
export default api
