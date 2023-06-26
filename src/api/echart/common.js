import { echartAxios } from '@/utils/request'
import QS from 'qs'

const api = {
  selectAllEduDance: '/erp/common/selectAllEduDance', //获取所有舞种
  selectAllEduType: '/erp/common/selectAllEduType', //获取所有班型
  selectSchoolTree: '/erp/common/selectSchoolTree', //获取所有分馆
  selectAllArea: '/erp/common/selectAllArea', //获取所有地区
}

export function selectAllEduDance(params) {
  return echartAxios({
    url: api.selectAllEduDance,
    method: 'post',
    data: params
  })
}
export function selectAllEduType(params) {
  return echartAxios({
    url: api.selectAllEduType,
    method: 'post',
    data: params
  })
}
export function selectSchoolTree(params) {
  return echartAxios({
    url: api.selectSchoolTree,
    method: 'post',
    data: params
  })
}
export function selectAllArea(params) {
  return echartAxios({
    url: api.selectAllArea,
    method: 'post',
    data: params
  })
}
