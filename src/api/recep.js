import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  getListMonthPlan: '/education/plan/listMonthPlan',
  getListDayPlan: '/education/plan/listDayPlan',

  pageDayPlan: '/education/plan/pageDayPlan',

  //studentApply
  verifyStudent: '/student/info/verifyStudent',
  verifyUpdateStudent: '/student/info/verifyUpdateStudent',
  listEduDance: '/education/deptcard/listEduDance',
  listEduDeptCard: '/education/deptcard/listEduDeptCard',
  pageDeptCard: '/education/deptcard/pageDeptCard',
  listEduCardType: '/education/deptcard/listEduClassType',
  listClass: '/education/class/listClass',
  saveStuRegistration: '/student/info/saveStuRegistration',
  savePastPeriodStudent: '/student/info/savePastPeriodStudent',

  //stuCards
  pageStudentCard: '/student/card/pageStudentCard',
  listStudentCard: '/student/card/listStudentCard',
  listUnPayoffCard: '/student/card/listUnPayoffCard',
  proposalAchievementInfo: '/student/card/proposalAchievementInfo', // 建议绩效信息
  getStuInfo: '/student/info/getStudentById',
  paidStuCards: '/student/info/studentCardPaid',
  refundStuCard: '/student/card/refundStuCard', //学员退卡
  changeEndDate: '/student/card/changeEndDate', //修改学员卡有效期
  saveChangeDate: '/student/card/saveChangeDate', //修改学员卡时间

  activeStuCard: '/student/card/activeStuCard', //激活卡(结业状态重新激活)
  removeStudentCard: '/student/card/removeStudentCard', //删除卡
  activeStuCardById: '/student/card/activeStuCardById', //激活卡
  frozenStuCardById: '/student/card/frozenStuCardById', //还原卡
  changeNumStudentCard: '/student/card/changeNumStudentCard', //修改卡次数
  listStuCardNumLog: '/student/card/listStuCardNumLog', // 修改卡记录
  graduationStuCardById: '/student/card/graduationStuCardById', //手工结业卡
  stopStuCardById: '/student/card/stopStuCardById', //手工停卡
  changeAdviser: '/student/card/changeAdviser', //分配顾问

  //ahievement
  //  /finance/achievement/pageAchievement  查询列表<finance:achievement:view>
  // /finance/achievement/change/{financeId}   修改业绩归属 <finance:achievement:change>
  // /finance/achievement/detail/{financeId}   业绩归属详情<finance:achievement:view>
  pageAchievement: '/finance/achievement/adviser/pageAchievement',
  changeAchievement: '/finance/achievement/change',
  changeSpending: '/finance/achievement/changeSpending',
  detailAchievement: '/finance/achievement/detail',

  //員工簽到
  userSign: '/education/organizesigninlog/listSignInLog',
  saveUserSign: '/education/organizesigninlog/saveSignInLog',
  //设置分馆休息日
  listOrgDeptRestDay: '/education/organizedeptrestday/listOrgDeptRestDay', //分馆休息天数列表
  saveDeptRestDay: '/education/organizedeptrestday/savedeptrestday', //保存分馆休息天数

  //全库查询stu
  allStuList: '/student/info/retrieval',
  //分馆休息
  // schoolRest: '/education/organizedeptrestday/listDeptRestDay',
  schoolRest: '/education/common/listDeptRestDay',
  saveSchoolRest: '/education/organizedeptrestday/savedeptrestday',
  batchSignInLog: '/education/organizesigninlog/batchSignInLog ',
  pageClassSignSummary: '/education/signinlog/pageClassSignSummary',
  // 班级列表(根据班级做筛选,)
  listSignInClass: '/student/signinlog/listSignInClass',
  //学员添加特殊卡
  saveSpecialCard: '/student/info/saveSpecialCard',
  //退班退卡退费
  refundClassStatus: '/student/info/refund',

  // 转班
  changeCardClass: '/student/card/changeCardClass',
  // 退班记录
  listRefundClassLog: '/education/class/listRefundClassLog',

  //退卡（卡撤销）
  refundCard: '/student/card/refundStuCard',
  //预退卡并退费
  previousRefundCard: '/student/card/previousRefundCard',
  //退卡并退费
  refundCardAll: '/student/card/refundStuCardAll',
  listValidStudentCard: '/student/card/listValidStudentCard', // 查询有效的卡列表
  //退费
  drawback: '/student/info/studentRefund',
  // 修改计次
  signCountEduDancePlan: '/education/plan/signCountEduDancePlan',
  // 修改薪酬类型
  salTypeEduDancePlan: '/education/plan/salTypeEduDancePlan',

  //导师业绩列表
  pageFinTeacher: '/finance/achievement/teacher/pageAchievement',
  finTeacherDetail: '/finance/achievement/teacher/detail',
  finTeacherChange: '/finance/achievement/teacher/change',
  finTeacherDelete: '/finance/achievement/teacher/delete',

  // 大师课管理
  pageMasterClass: '/education/masterclass/pageMasterClass',
  getMasterClass: '/education/masterclass/getMasterClass',
  saveMasterClass: '/education/masterclass/saveMasterClass',
  removeMasterClass: '/education/masterclass/removeMasterClass',
  pageStuMasterClass: '/student/masterclass/pageStuMasterClass', // 大师课选人
  removeStuMasterClass: '/student/masterclass/removeStuMasterClass', //删除
  saveStuMasterClass: '/student/masterclass/saveStuMasterClass', //保存
  listClassSpending: '/education/masterclassspending/listClassSpending', // 大师课支出列表
  removeMasterClassSpending: '/education/masterclassspending/removeMasterClassSpending', // 删除这条记录
  saveClassSpending: '/education/masterclassspending/saveClassSpending', // 保存
  getStuCardInfo: '/student/card/getStudentCardById',

  pageOnLineStudentCard: '/education/class-url/pageOnLineStudentCard', // 线上课卡分页列表
  pageOnStudentCard: '/education/class-url/pageOnStudentCard', // 教练预习课，资料包分页列表

  importLiveAddrCsvData: '/education/class-url/import', // 数据导入
  bindLiveStudentCard: '/education/class-url/bindStudentCard', // 绑定学员卡
  unBindLiveStudentCard: '/education/class-url/unBindStudentCard', // 解绑定学员卡
  liveAddressImport: '/education/class-url/import', // 上传文件
  // listEduClassOnLineUrl: '/education/class-url/pageClassOnLineUrl', // 上课码列表
  listEduClassOnLineUrl: '/education/class-url/listEduClassOnLineUrl', // 上课码列表', // 上课码列表
  removeClassUrl: '/education/class-url/removeClassUrl', // 上课码删除
  pageSubstituteTeacher: '/education/substitute-teacher/pageSubstituteTeacher', // 代课老师签到列表
  getStuOrStuUser: '/student/info/getStuOrStuUser', //获取学员列表
  changeStudentCardNew: '/student/info/changeStudentCard', //学员卡结转
  listStudentInfoEduClassUrl: '/education/class-url/listStudentInfoEduClassUrl', // 教练预习课，资料包分页列表
  saveRemark: '/education/organizesigninlog/saveRemark', //员工签到添加备注
  checkGuaranteedEmployees: '/education/organizesigninlog/checkGuaranteedEmployees',
  pageGuaranteedEmployees: '/education/organizesigninlog/pageGuaranteedEmployees',
  listGuaranteedEmployees: '/education/organizesigninlog/listGuaranteedEmployees'
}
export function listGuaranteedEmployees(params) {
  return axios({
    url: `${api.listGuaranteedEmployees}`,
    method: 'get',
    params: params
  })
}
export function pageGuaranteedEmployees(params) {
  return axios({
    url: `${api.pageGuaranteedEmployees}`,
    method: 'get',
    params: params
  })
}
export function listStudentInfoEduClassUrl(params) {
  return axios({
    url: `${api.listStudentInfoEduClassUrl}`,
    method: 'get',
    params: params
  })
}
export function changeStudentCardNew(params) {
  return axios({
    url: `${api.changeStudentCardNew}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function getStuOrStuUser(params) {
  return axios({
    url: `${api.getStuOrStuUser}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function listValidStudentCard(params) {
  return axios({
    url: `${api.listValidStudentCard}/${params}`,
    method: 'get'
  })
}
export function previousRefundCard(params) {
  return axios({
    url: `${api.previousRefundCard}/${params}`,
    method: 'get'
  })
}
export function listEduClassOnLineUrl(params) {
  return axios({
    url: `${api.listEduClassOnLineUrl}`,
    method: 'get',
    params: params
  })
}
export function signCountEduDancePlan(params) {
  return axios({
    url: `${api.signCountEduDancePlan}`,
    method: 'get',
    params: params
  })
}

export function salTypeEduDancePlan(params) {
  return axios({
    url: `${api.salTypeEduDancePlan}`,
    method: 'get',
    params: params
  })
}

export function listSignInClass(params) {
  return axios({
    url: `${api.listSignInClass}`,
    method: 'get',
    params: params
  })
}

export function getStuCardInfo(id) {
  return axios({
    url: `${api.getStuCardInfo}/${id}`,
    method: 'get'
  })
}

export function proposalAchievementInfo(params) {
  return axios({
    url: `${api.proposalAchievementInfo}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function changeCardClass(params) {
  return axios({
    url: `${api.changeCardClass}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function liveAddressImport(formData, contentType) {
  return axios({
    headers: { 'Content-Type': contentType },
    url: `${api.liveAddressImport}`,
    method: 'post',
    data: formData
  })
}

export function saveClassSpending(params) {
  return axios({
    url: `${api.saveClassSpending}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeMasterClassSpending(params) {
  return axios({
    url: `${api.removeMasterClassSpending}/${params}`,
    method: 'delete'
  })
}

export function listClassSpending(params) {
  return axios({
    url: `${api.listClassSpending}`,
    method: 'get',
    params: params
  })
}

export function saveStuMasterClass(params) {
  return axios({
    url: `${api.saveStuMasterClass}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeClassUrl(formData, contentType) {
  return axios({
    headers: { 'Content-Type': contentType },
    url: `${api.removeClassUrl}`,
    method: 'delete',
    data: formData
  })
}

export function removeStuMasterClass(params) {
  return axios({
    url: `${api.removeStuMasterClass}/${params}`,
    method: 'delete'
  })
}

export function pageStuMasterClass(params) {
  return axios({
    url: `${api.pageStuMasterClass}`,
    method: 'get',
    params: params
  })
}

export function listStuCardNumLog(params) {
  return axios({
    url: `${api.listStuCardNumLog}/${params}`,
    method: 'get'
  })
}

export function pageMasterClass(params) {
  return axios({
    url: `${api.pageMasterClass}`,
    method: 'get',
    params: params
  })
}

export function getMasterClass(params) {
  return axios({
    url: `${api.getMasterClass}`,
    method: 'get',
    params: params
  })
}

export function saveMasterClass(params) {
  return axios({
    url: `${api.saveMasterClass}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeMasterClass(params) {
  return axios({
    url: `${api.removeMasterClass}/${params}`,
    method: 'delete'
  })
}

export function pageFinTeacher(params) {
  return axios({
    url: `${api.pageFinTeacher}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function finTeacherDelete(financeId, params) {
  return axios({
    url: `${api.finTeacherDelete}/${financeId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function finTeacherDetail(financeId) {
  return axios({
    url: `${api.finTeacherDetail}/${financeId}`,
    method: 'get'
  })
}

export function finTeacherChange(financeId, params) {
  return axios({
    url: `${api.finTeacherChange}/${financeId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listRefundClassLog(stuId, params) {
  return axios({
    url: `${api.listRefundClassLog}/${stuId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function refundCard(params) {
  return axios({
    url: `${api.refundCard}/${params.stuCardId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function refundCardAll(params) {
  return axios({
    url: `${api.refundCardAll}/${params.stuCardId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageExpendRefundMap(params) {
  return axios({
    url: `/finance/info/pageExpendRefundMap`,
    method: 'get',
    params: params
    // data: QS.stringify(params)
  })
}
export function drawback(params) {
  return axios({
    url: `${api.drawback}/${params.studentId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function refundClassStatus(params) {
  return axios({
    url: `${api.refundClassStatus}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveSpecialCard(params) {
  return axios({
    url: `${api.saveSpecialCard}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageClassSignSummary(params) {
  return axios({
    url: `${api.pageClassSignSummary}`,
    method: 'get',
    params: params
    // data: QS.stringify(params)
  })
}

export function schoolRest(params) {
  return axios({
    url: `${api.schoolRest}`,
    method: 'get',
    params: params
  })
}

export function saveSchoolRest(params) {
  return axios({
    url: `${api.saveSchoolRest}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function batchSignInLog(params) {
  return axios({
    url: `${api.batchSignInLog}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getListMonthPlan(month, params) {
  return axios({
    url: `${api.getListMonthPlan}/${month}`,
    method: 'get',
    params: params
  })
}

export function getListDayPlan(day, params) {
  return axios({
    url: `${api.getListDayPlan}/${day}`,
    method: 'get',
    params: params
  })
}

export function pageDayPlan(day, params) {
  return axios({
    url: `${api.pageDayPlan}/${day}`,
    method: 'get',
    params: params
  })
}

export function verifyStudent(params) {
  return axios({
    url: api.verifyStudent,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function verifyUpdateStudent(params) {
  return axios({
    url: api.verifyUpdateStudent,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function activeStuCard(params) {
  return axios({
    url: api.activeStuCard,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function allStuList(params) {
  return axios({
    url: api.allStuList,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listEduDance(params) {
  return axios({
    url: api.listEduDance,
    method: 'get',
    params: params
  })
}

export function listEduDeptCard(params) {
  return axios({
    url: api.listEduDeptCard,
    method: 'get',
    params: params
  })
}

export function pageDeptCard(params) {
  return axios({
    url: api.pageDeptCard,
    method: 'get',
    params: params
  })
}

export function listEduCardType(params) {
  return axios({
    url: api.listEduCardType,
    method: 'get',
    params: params
  })
}

export function listClass(params) {
  return axios({
    url: api.listClass,
    method: 'get',
    params: params
  })
}

export function saveStuRegistration(params) {
  return axios({
    url: api.saveStuRegistration,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function savePastPeriodStudent(params) {
  return axios({
    url: api.savePastPeriodStudent,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function changeEndDate(params) {
  return axios({
    url: api.changeEndDate,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveChangeDate(params) {
  return axios({
    url: api.saveChangeDate,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function changeNumStudentCard(params, id) {
  return axios({
    url: `${api.changeNumStudentCard}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageStudentCard(params) {
  return axios({
    url: api.pageStudentCard,
    method: 'get',
    params: params
  })
}

export function listStudentCard(params) {
  return axios({
    url: api.listStudentCard,
    method: 'get',
    params: params
  })
}

export function listUnPayoffCard(params) {
  return axios({
    url: api.listUnPayoffCard,
    method: 'get',
    params: params
  })
}

export function getStuInfo(stuId) {
  return axios({
    url: `${api.getStuInfo}/${stuId}`,
    method: 'get'
  })
}

export function paidStuCards(params) {
  return axios({
    url: api.paidStuCards,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function refundStuCard(params) {
  return axios({
    url: api.refundStuCard,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeStudentCard(params) {
  return axios({
    url: `${api.removeStudentCard}/${params}`,
    method: 'delete'
  })
}

export function activeStuCardById(params) {
  return axios({
    url: api.activeStuCardById,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function frozenStuCardById(params) {
  return axios({
    url: api.frozenStuCardById,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function graduationStuCardById(params) {
  return axios({
    url: api.graduationStuCardById,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function changeAdviser(params) {
  return axios({
    url: api.changeAdviser,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function stopStuCardById(params) {
  return axios({
    url: api.stopStuCardById,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageAchievement(params) {
  return axios({
    url: api.pageAchievement,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function detailAchievement(params) {
  return axios({
    url: `${api.detailAchievement}/${params}`,
    method: 'get'
  })
}

export function changeAchievement(id, params) {
  return axios({
    url: `${api.changeAchievement}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function changeSpending(id, params) {
  return axios({
    url: `${api.changeSpending}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveUserSign(id, params) {
  return axios({
    url: `${api.saveUserSign}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listOrgDeptRestDay(params) {
  return axios({
    url: api.listOrgDeptRestDay,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveDeptRestDay(params) {
  return axios({
    url: api.saveDeptRestDay,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function checkGuaranteedEmployees(params) {
  return axios({
    url: `${api.checkGuaranteedEmployees}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveRemark(params) {
  return axios({
    url: `${api.saveRemark}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function userSign(params) {
  return axios({
    url: `${api.userSign}`,
    method: 'get',
    params: params
  })
}

export function pageOnLineStudentCard(params) {
  return axios({
    url: `${api.pageOnLineStudentCard}`,
    method: 'get',
    params: params
  })
}
export function pageOnStudentCard(params) {
  return axios({
    url: `${api.pageOnStudentCard}`,
    method: 'get',
    params: params
  })
}

export function importLiveAddrCsvData(params) {
  return axios({
    url: `${api.importLiveAddrCsvData}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function bindLiveStudentCard(params) {
  return axios({
    url: `${api.bindLiveStudentCard}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function unBindLiveStudentCard(params) {
  return axios({
    url: `${api.unBindLiveStudentCard}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageSubstituteTeacher(params) {
  return axios({
    url: `${api.pageSubstituteTeacher}`,
    method: 'get',
    params: params
  })
}

// 查询学员卡信息
export const getCardByStuId = params => axios.get(`/student/card/getCardByStuId`, { params })
// 根据学员卡查询操作日志
export const getCardLogByCardId = params => axios.get('/student/card/getCardLogByCardId', { params })

// 退卡统计
export const getRefundCardList = params => axios.post(`/finance/refundcard/listRefundCard`, QS.stringify(params))
// 导出退卡统计
export const exportRefundCard = params => axios.post(`/finance/refundcard/down`, QS.stringify(params), { responseType: 'blob' })
// 冻结/解冻学员卡
export const changeCardFreeze = params => axios.get('/student/card/studentCardByShowHide', { params })

// 排课异常反馈列表
export const getAbnormalFeedbackList = params => axios.get('/education/plan/abnormalFeedbackList', { params }) 
// 处理异常反馈
export const updateAbnormalState = params => axios.post(`/education/plan/updateAbnormalState`, QS.stringify(params))
// 导师批量签到
export const batchteaSignInLog = params => axios.post(`/education/signinlog/batchteaSignInLog`, QS.stringify(params))
// 学员批量签到
export const studentBatchsign = params => axios.post(`/student/signinlog/stuSignInLog/batchsign`, QS.stringify(params))