import { echartAxios } from '@/utils/request'

const api = {
  refundCount: 'erp/refund-stat/refundCount', //退费可视数据
  refundStatBySchool: '/erp/refund-stat/refundStatBySchool', //退费统计-图表明细
  refundDetail: '/erp/refund-stat/refundDetail' //明细表
}

export function refundCount(params) {
  return echartAxios({
    url: api.refundCount,
    method: 'post',
    data: params
  })
}
export function refundStatBySchool(params) {
  return echartAxios({
    url: api.refundStatBySchool,
    method: 'post',
    data: params
  })
}
export function refundDetail(params) {
  return echartAxios({
    url: api.refundDetail,
    method: 'post',
    data: params
  })
}
export default api
