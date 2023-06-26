import { axios } from '@/utils/request'
import QS from 'qs'
const api = {
  // adviser相关接口
  getStuTableList: '/student/user/pageAdviserStuUser', // 获取意向学员(顾问)列表
  getStuUserById: '/student/user/getStuUserById', // 添加修改按钮,回填数据
  saveStuUser: '/student/user/saveStuUser', //新增保存
  saveStuUsercustomers: '/student/user/saveCsStuUser', //试听学员信息保存
  saveStuUserLog: '/student/userlog/saveStuUserLog', //新增沟通记录
  saveTryStuUser: '/student/audition/saveAudition', //试听学员信息保存
  pageStuUsserLog: '/student/userlog/listStuUserLog', //查询沟通时间轴
  getSchoolList: '/education/common/listOrgDept', //获得分馆
  saveChannelUsers: '/student/user/saveCsStuUserChannel', //渠道批量修改

  // service相关接口
  getServiceList: '/student/user/pageCsStuUser', // 获取意向学员(客服)列表
  pageCsStuUser: '/student/user/csStuUser', // 获取意向学员(客服)列表(登录权限)
  changeStuOrgUser: '/student/user/changeStuOrgUser', // 修改负责人
  enableStuUser: '/student/user/enableStuUser', //修改意向学员状态
  stuUserSetTag: '/student/user/stuUserSetTag', //删除意向学员

  // foreground相关接口
  pageSchoolStuUser: '/student/user/pageSchoolStuUser', // 获取意向学员(前台)列表
  changeAdviser: '/student/user/changeAdviser', //修改顾问
  listStuAudition: '/student/audition/listStuAudition', //查询意向学员试听列
  enableStuAudition: '/student/audition/enableStuAudition', //根据ID修改意向学员试听状态
  convert2Student: '/student/user/convert2Student', //转为正式学员
  batchStuUserLog: '/student/user/batchStuUserLog', // 顾问批量跟进功能

  //下载
  downloadStu: '/student/user/downCsStuUser',
  downloadForegroundStu: '/student/user/downSchoolStuUser',
  //
  markStuUser: '/student/user/markStuUser',
  bindStuUser: '/education/class-url/bindStuUser', //意向学员线上课绑卡
  unBindSutUser: '/education/class-url/unBindSutUser', //意向学员线上体验课作废
  //
  saveAnaBusiness: '/analysis/business/saveAnaBusiness', //商务通录入
  updateAnaBusiness: '/analysis/business/updateAnaBusiness', //商务通修改
  pageAnaBusiness: '/analysis/business/pageAnaBusiness', //商务通列表
  getChannelTreeByUser: '/analysis/business/getChannelTreeByUser', //推广组渠道
  newGetChannelTreeByUser: '/analysis/newmedia/getChannelTreeByUser', //新媒体渠道
  getAnaBusinessById: '/analysis/business/getAnaBusinessById', //商务通详情
  removeAnaBus: '/analysis/business/removeAnaBus', //商务通删除

  saveAnaNewMedia: '/analysis/newmedia/saveAnaNewMedia', //新媒体录入
  pageAnaNewMedia: '/analysis/newmedia/pageAnaNewMedia', //新媒体列表
  updateAnaNewMedia: '/analysis/newmedia/updateAnaNewMedia', //新媒体修改
  removeAnaMedia: '/analysis/newmedia/removeAnaMedia', //新媒体删除
  getAnaNewMediaById: '/analysis/newmedia/getAnaNewMediaById', //新媒体详情
  pageNetworkTarget: '/analysis/networktarget/pageNetworkTarget', //网络部目标管理列表
  getNetworkTarget: '/analysis/networktarget/getNetworkTarget', //网络部目标管理详情
  removeNetworkTarget: '/analysis/networktarget/removeNetworkTarget', //网络部目标管理删除
  saveNetworkTarget: '/analysis/networktarget/saveNetworkTarget', //网络部目标管理新增
  changeNetworkTarget: '/analysis/networktarget/changeNetworkTarget', //网络部目标管理新增
  pageNetworkTargetSummary: '/analysis/networktarget/pageNetworkTargetSummary', //网络部目标管理汇总分页列表
  confirmNetworkTarget: '/analysis/networktarget/confirmNetworkTarget', //网络部目标管理汇总确认
  refreshAnaSource: '/analysis/newmedia/refreshAnaSource', //新媒体刷新资源数
  busRefreshAnaSource: '/analysis/business/refreshAnaSource', //推广组刷新资源数
  repairAnalysis: '/analysis/business/repairAnalysis', //推广组刷新资源数
  getNewmedia: '/analysis/newmedia/getAnaNewMedia', //查询新媒体组汇总数据
  getAnaBusiness: '/analysis/business/getAnaBusiness', //查询推广组组汇总数据

  operationStuUser: '/student/user/operationStuUser', //无效资源恢复
  pageVoidStuUser: '/student/user/pageVoidStuUser', //无效资源查询

  bindStudentInfo: '/education/class-url/bindStudentInfo', //意向学员线上课绑卡

  removeStuUser: '/student/user/removeStuUser',
  //反馈
  saveFeedback: '/stuUserFeedback/saveFeedback', //新增反馈
  listFeedbackByStuUser: '/stuUserFeedback/listFeedbackByStuUser', //查询反馈
  listFeedback: '/stuUserFeedback/listFeedback', //查询反馈看板
  handlingFeedback: '/stuUserFeedback/handlingFeedback' //处理反馈
}
// 反馈
export function handlingFeedback(feedbackId) {
  return axios({
    url: `${api.handlingFeedback}/${feedbackId}`,
    method: 'get'
  })
}
export function listFeedback(params) {
  return axios({
    url: api.listFeedback,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function listFeedbackByStuUser(stuId) {
  return axios({
    url: `${api.listFeedbackByStuUser}/${stuId}`,
    method: 'get'
  })
}
export function saveFeedback(params) {
  return axios({
    url: `${api.saveFeedback}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function stuUserSetTag(params) {
  return axios({
    url: api.stuUserSetTag,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function bindStudentInfo(params) {
  return axios({
    url: api.bindStudentInfo,
    method: 'post',
    data: QS.stringify(params)
  })
}
// ---------------------------------------------------------------
//无效资源
export function operationStuUser(params) {
  return axios({
    url: api.operationStuUser,
    method: 'post',
    data: QS.stringify(params)
  })
}
// 查询
export function pageVoidStuUser(params) {
  return axios({
    url: api.pageVoidStuUser,
    method: 'get',
    params: params
  })
}
// adviser相关接口
export function saveChannelUsers(params) {
  return axios({
    url: api.saveChannelUsers,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function repairAnalysis(formData, contentType) {
  return axios({
    headers: { 'Content-Type': contentType },
    url: `${api.repairAnalysis}`,
    method: 'post',
    data: formData
  })
}

export function downloadStu(params) {
  return axios({
    url: `${api.downloadStu}`,
    method: 'post',
    data: QS.stringify(params),
    responseType: 'blob',
    timeout: 0
  })
}
export function downloadForegroundStu(params) {
  return axios({
    url: `${api.downloadForegroundStu}`,
    method: 'post',
    data: QS.stringify(params),
    responseType: 'blob',
    timeout: 0
  })
}

// 获取意向学员列表
export function getStuTableList(params) {
  return axios({
    url: api.getStuTableList,
    method: 'get',
    params: params
  })
}
// 添加修改按钮,回填数据
export function getStuUserById(params) {
  return axios({
    url: `${api.getStuUserById}/${params}`,
    method: 'get'
  })
}
//新增保存
export function saveStuUser(params) {
  return axios({
    url: api.saveStuUser,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function markStuUser(params) {
  return axios({
    url: api.markStuUser,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveStuUsercustomers(params) {
  return axios({
    url: api.saveStuUsercustomers,
    method: 'post',
    data: QS.stringify(params)
  })
}

//新增沟通
export function saveStuUserLog(params) {
  return axios({
    url: `${api.saveStuUserLog}/${params.stuId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//试听学员信息保存
export function saveTryStuUser(params) {
  return axios({
    url: `${api.saveTryStuUser}/${params.stuId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

// 查询沟通时间轴
export function pageStuUsserLog(params) {
  return axios({
    url: api.pageStuUsserLog,
    method: 'get',
    params: params
  })
}
// 获得分馆
export function getSchoolList(params) {
  return axios({
    url: api.getSchoolList,
    method: 'get',
    params: params
  })
}

// ---------------------------------------------------------------
// service相关接口
export function getServiceList(params) {
  return axios({
    url: api.getServiceList,
    method: 'get',
    params: params
  })
}
export function pageCsStuUser(params) {
  return axios({
    url: api.pageCsStuUser,
    method: 'get',
    params: params
  })
}
// 修改负责人
export function changeStuOrgUser(params) {
  return axios({
    url: api.changeStuOrgUser,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function enableStuUser(id, params) {
  return axios({
    url: `${api.enableStuUser}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function removeStuUser(id, params) {
  return axios({
    url: `${api.removeStuUser}/${id}`,
    method: 'delete'
  })
}

// ---------------------------------------------------------------
// foreground 相关接口
// 获取table列表
export function pageSchoolStuUser(params) {
  return axios({
    url: api.pageSchoolStuUser,
    method: 'get',
    params: params
  })
}
// 修改顾问
export function changeAdviser(params) {
  return axios({
    url: api.changeAdviser,
    method: 'post',
    data: QS.stringify(params)
  })
}

//查询意向学员试听列
export function listStuAudition(params) {
  return axios({
    url: `${api.listStuAudition}/${params}`,
    method: 'get'
  })
}
//根据ID修改意向学员试听状态
export function enableStuAudition(id, params) {
  return axios({
    url: `${api.enableStuAudition}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//转为正式学员
export function convert2Student(id) {
  return axios({
    url: `${api.convert2Student}/${id}`,
    method: 'post'
  })
}
//批量跟进功能
export function batchStuUserLog(params) {
  return axios({
    url: api.batchStuUserLog,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function bindStuUser(params) {
  return axios({
    url: api.bindStuUser,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function userUnBindSutUser(params) {
  return axios({
    url: '/student/user/unbindStuUser',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function unBindSutUser(params) {
  return axios({
    url: api.unBindSutUser,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveAnaBusiness(params) {
  return axios({
    url: api.saveAnaBusiness,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateAnaBusiness(params) {
  return axios({
    url: api.updateAnaBusiness,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageAnaBusiness(params) {
  return axios({
    url: api.pageAnaBusiness,
    method: 'get',
    params: params
  })
}
export function getChannelTreeByUser(params) {
  return axios({
    url: api.getChannelTreeByUser,
    method: 'get',
    params: params
  })
}
export function newGetChannelTreeByUser(params) {
  return axios({
    url: api.newGetChannelTreeByUser,
    method: 'get',
    params: params
  })
}
export function getAnaBusinessById(params) {
  return axios({
    url: api.getAnaBusinessById,
    method: 'get',
    params: params
  })
}
export function removeAnaBus(id) {
  return axios({
    url: `${api.removeAnaBus}/${id}`,
    method: 'delete'
  })
}
export function getNetworkTarget(params) {
  return axios({
    url: api.getNetworkTarget,
    method: 'get',
    params: params
  })
}
export function pageNetworkTarget(params) {
  return axios({
    url: api.pageNetworkTarget,
    method: 'get',
    params: params
  })
}
export function removeNetworkTarget(id) {
  return axios({
    url: `${api.removeNetworkTarget}/${id}`,
    method: 'delete'
  })
}
export function saveNetworkTarget(params) {
  return axios({
    url: api.saveNetworkTarget,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function changeNetworkTarget(params) {
  return axios({
    url: api.changeNetworkTarget,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveAnaNewMedia(params) {
  return axios({
    url: api.saveAnaNewMedia,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageAnaNewMedia(params) {
  return axios({
    url: api.pageAnaNewMedia,
    method: 'get',
    params: params
  })
}
export function getAnaNewMediaById(params) {
  return axios({
    url: api.getAnaNewMediaById,
    method: 'get',
    params: params
  })
}
export function pageNetworkTargetSummary(params) {
  return axios({
    url: api.pageNetworkTargetSummary,
    method: 'get',
    params: params
  })
}
export function updateAnaNewMedia(params) {
  return axios({
    url: api.updateAnaNewMedia,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function confirmNetworkTarget(id) {
  return axios({
    url: `${api.confirmNetworkTarget}/${id}`,
    method: 'post'
    //  data: QS.stringify(params)
  })
}
export function removeAnaMedia(id) {
  return axios({
    url: `${api.removeAnaMedia}/${id}`,
    method: 'delete'
  })
}
export function busRefreshAnaSource(id) {
  return axios({
    url: `${api.busRefreshAnaSource}/${id}`,
    method: 'post'
    //  data: QS.stringify(params)
  })
}
export function refreshAnaSource(id) {
  return axios({
    url: `${api.refreshAnaSource}/${id}`,
    method: 'post'
    //  data: QS.stringify(params)
  })
}

export function getNewmedia(params) {
  return axios({
    url: api.getNewmedia,
    method: 'get',
    params: params
  })
}
export function getAnaBusiness(params) {
  return axios({
    url: api.getAnaBusiness,
    method: 'get',
    params: params
  })
}
