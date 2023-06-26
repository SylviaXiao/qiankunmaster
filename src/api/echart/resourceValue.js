import { echartAxios } from '@/utils/request'

const api = {
  findAllModule: '/erp/resource-value/findAllModule', //查询所有
  queryResource: '/erp/resource-value/queryResource', //根据编码 时间查询总计 资源数
  rankingBySchool: '/erp/resource-value/rankingBySchool', //分馆排行
  rankingByAdvise: '/erp/resource-value/rankingByAdvise', //顾问排行
  resourceChartStat: '/erp/resource-value/resourceChartStat', //资源统计图表（折线图）
  resourceTable: '/erp/resource-value/resourceTable', //明细表
  resourceDetail: '/erp/resource-value/resourceDetail' //跳转明细表
}

export function queryResource(params) {
  return echartAxios({
    url: api.queryResource,
    method: 'post',
    data: params
  })
}
export function resourcefindAllModule(params) {
  return echartAxios({
    url: api.findAllModule,
    method: 'post',
    data: params
  })
}
export function rankingBySchool(params) {
  return echartAxios({
    url: api.rankingBySchool,
    method: 'post',
    data: params
  })
}
export function rankingByAdvise(params) {
  return echartAxios({
    url: api.rankingByAdvise,
    method: 'post',
    data: params
  })
}
export function resourceChartStat(params) {
  return echartAxios({
    url: api.resourceChartStat,
    method: 'post',
    data: params
  })
}
export function resourceTable(params) {
  return echartAxios({
    url: api.resourceTable,
    method: 'post',
    data: params
  })
}
export function resourceDetail(params) {
  return echartAxios({
    url: api.resourceDetail,
    method: 'post',
    data: params
  })
}
export default api