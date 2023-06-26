import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  getSiteById: '/cer/site/getSiteById', //查询分馆考点详情
  listSite: '/cer/site/listSite', //查询分馆考点集合
  listSiteById: '/cer/organizer/listCerOrganizer', //查询分馆考点列表
  removeSiteById: '/cer/organizer/removeCerOrganizer', //删除分馆考点信息
  saveSite: '/cer/organizer/saveOrganizer', //添加分馆考点信息

  getGradingById: '/cer/grading/getGradingById', //查询考级学员详情
  pageGrading: '/cer/site/pageSite', //查询考级学员分页列表
  saveAndPaidGrading: '/cer/grading/saveAndPaidGrading', //批量添加考级学员
  saveClassPaidGrading: '/cer/grading/saveClassPaidGrading', //批量添加班级考级学员
  certSaveSite: '/cer/site/saveSite', //保存考点
  removeCertSiteById: '/cer/site/removeSiteById', //删除考点
  removeGrading: '/cer/grading/removeGrading', //删除考级学员
  getCertSiteById: '/cer/site/getSiteById', //考点详情
  pageGradingInfo: '/cer/grading/pageGrading', //考级详情列表
  downGrading: '/cer/grading/downGrading', //导出

  commonCerDanceList: '/education/dance/commonCerDanceList', //考级舞种
  saveGrading: '/common/cert/saveGrading', //新增考级
  //考点地区管理
  saveCerArea: '/cer/area/saveCerArea',
  removeCerArea: '/cer/area/removeCerArea',
  listCerOrganizer: '/cer/area/listCerOrganizer',

  //公共接口
  commonSiteById: '/common/cert/getSiteById',
  listOrgDept: '/common/cert/listOrgDept',
  getGradingByIdCard: '/common/cert/getGradingByIdCard'
}
// 待审批导出
export function downGrading(params) {
  return axios({
    url: api.downGrading,
    method: 'post',
    responseType: 'blob',
    data: QS.stringify(params)
  })
}
export function pageGradingInfo(params) {
  return axios({
    url: api.pageGradingInfo,
    method: 'get',
    params: params
  })
}
export function getGradingByIdCard(params) {
  return axios({
    url: api.getGradingByIdCard,
    method: 'get',
    params: params
  })
}
export function listOrgDept(params) {
  return axios({
    url: api.listOrgDept,
    method: 'get',
    params: params
  })
}
export function commonSiteById(params) {
  return axios({
    url: api.commonSiteById,
    method: 'get',
    params: params
  })
}
export function getCertSiteById(params) {
  return axios({
    url: api.getCertSiteById,
    method: 'get',
    params: params
  })
}
export function removeCertSiteById(params) {
  return axios({
    url: api.removeCertSiteById,
    method: 'delete',
    params: params
  })
}
export function certSaveSite(params) {
  return axios({
    url: api.certSaveSite,
    method: 'post',
    data: QS.stringify(params)
  })
}
//考点地区管理
export function saveCerArea(params) {
  return axios({
    url: api.saveCerArea,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function removeCerArea(params) {
  return axios({
    url: api.removeCerArea,
    method: 'delete',
    params: params
  })
}
export function listCerOrganizer(params) {
  return axios({
    url: api.listCerOrganizer,
    method: 'get',
    params: params
  })
}
//考级舞种
export function commonCerDanceList(params) {
  return axios({
    url: api.commonCerDanceList,
    method: 'get',
    params: params
  })
}
//查询分馆考点详情
export function getSiteById(params) {
  return axios({
    url: api.getSiteById,
    method: 'get',
    params: params
  })
}

//查询分馆考点集合下拉框
export function listSite(params) {
  return axios({
    url: api.listSite,
    method: 'get',
    params: params
  })
}

//查询分馆考点列表
export function listSiteById(params) {
  return axios({
    url: api.listSiteById,
    method: 'get',
    params: params
  })
}

// 删除分馆考点信息
export function removeSiteById(params) {
  return axios({
    url: api.removeSiteById,
    method: 'delete',
    params: params
  })
}

//添加分馆考点信息
export function saveSite(params) {
  return axios({
    url: api.saveSite,
    method: 'post',
    data: QS.stringify(params)
  })
}
//查询考级学员详情
export function getGradingById(params) {
  return axios({
    url: api.getGradingById,
    method: 'get',
    params: params
  })
}

//查询考级学员分页列表
export function pageGrading(params) {
  return axios({
    url: api.pageGrading,
    method: 'get',
    params: params
  })
}

//批量添加考级学员
export function saveAndPaidGrading(params) {
  return axios({
    url: api.saveAndPaidGrading,
    method: 'post',
    data: QS.stringify(params)
  })
}

//批量添加班级考级学员
export function saveClassPaidGrading(params) {
  return axios({
    url: api.saveClassPaidGrading,
    method: 'post',
    data: QS.stringify(params)
  })
}

//添加考级学员
export function saveGrading(params) {
  return axios({
    url: api.saveGrading,
    method: 'post',
    data: QS.stringify(params)
  })
}

//删除考级学员
export function removeGrading(params) {
  return axios({
    url: api.removeGrading,
    method: 'delete',
    params: params
  })
}
