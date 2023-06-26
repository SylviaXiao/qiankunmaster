import { echartAxios } from '@/utils/request'

const api = {
  cardNumberRankings: '/erp/card-rankings/cardNumberRankings', //办卡卡种数量排行榜
  cardPriceRankings: '/erp/card-rankings/cardPriceRankings', //办卡卡种金额排行榜
  findAllModule: '/erp/card/findAllModule', //查询所有
  queryCard: '/erp/card/queryCard', //学员卡运营数据指标
  cardTable: '/erp/card/cardTable', //学员卡运营数据明细表
  cardChartStat: '/erp/card/cardChartStat', //学员卡运营数据折线图
  cardDetail: '/erp/card/cardDetail', //学员卡明细表
  showOn: '/erp/card/showOn' //展示指标设置
}

export function cardNumberRankings(params) {
  return echartAxios({
    url: api.cardNumberRankings,
    method: 'post',
    data: params
  })
}
export function cardPriceRankings(params) {
  return echartAxios({
    url: api.cardPriceRankings,
    method: 'post',
    data: params
  })
}
export function cardFindAllModule(params) {
  return echartAxios({
    url: api.findAllModule,
    method: 'post',
    data: params
  })
}
export function queryCard(params) {
  return echartAxios({
    url: api.queryCard,
    method: 'post',
    data: params
  })
}
export function cardTable(params) {
  return echartAxios({
    url: api.cardTable,
    method: 'post',
    data: params
  })
}
export function cardChartStat(params) {
  return echartAxios({
    url: api.cardChartStat,
    method: 'post',
    data: params
  })
}
export function cardDetail(params) {
  return echartAxios({
    url: api.cardDetail,
    method: 'post',
    data: params
  })
}
export function showOn(params) {
  return echartAxios({
    url: api.showOn,
    method: 'post',
    data: params
  })
}
export default api
