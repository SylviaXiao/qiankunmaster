import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  //员工列表
  getUserTree: '/organize/user/getOrgDeptUserTree',

  courseList: '/education/course/pageEduCourse',
  //舞种 //
  getDanceList: '/education/dance/listEduDance',
  saveDance: '/education/dance/saveEduDance',
  removeDance: '/education/dance/delEduDance',
  changeDanceState: '/education/dance/enableEduDance',
  // 教室
  getRoomList: '/education/room/listEduRoomByDeptId',
  changeRoomState: '/education/room/enableEduRoom',
  saveRoom: '/education/room/saveEduRoom',
  removeRoom: '/education/room/removeEduDept',
  //班级
  classBatchSuspend: '/student/card/classBatchSuspend', //班级学员卡批量停课
  getClassList: '/education/class/pageEduClass',
  getClassOnLineList: '/education/class/pageEduClassOnLine',
  listClass: '/education/common/listClass', //根据分馆查询班级列表
  changeClass: '/education/class/changeClass', //学员转班
  refundClassStatus: '/education/class/refundClassStatus', //学员退班
  saveClassP: '/education/class/saveEduPersonalClass',
  saveClass: '/education/class/saveEduClass',
  removeClass: '/education/class/removeEduClass',
  getClassInfo: '/education/class/getEduClassById',
  getCardInfoDuration: '/education/class/getCardInfoDuration', // 根据舞种/类型/班型 获取卡种信息

  saveClassOnLine: '/education/class/saveEduClassOnLine',
  removeClassOnLine: '/education/class/removeEduClassOnLine',

  getClassUnselected: '/education/class/pageUnClassStudent', //查询未选班级学员分页列表
  getClassStuList: '/education/class/listClassStudent', //获取班级内学生数据
  getClassPlanList: '/education/plan/pageEduClassDetailPlan', //获取班级排课列表
  removeClassPlan: '/education/plan/removeEduDancePlan', //删除一条课程表计划
  editAddClassPlan: '/education/plan/saveEduDancePlan', //添加/修改单次课程
  getCardLogPrice: '/student/card/getCardLogPrice', //添加/修改单次课程
  updatePlanTime: '/education/plan/updatePlanTime', //修改课时
  repairPlan: '/education/plan/repair',
  saveStuToClass: '/education/class/saveStuToClass',
  listClassWeekPlan: '/education/plan/listClassWeekPlan',

  graduateEduClass: '/education/class/graduateEduClass', // 班级结业
  actEduClass: '/education/class/actEduClass', // 重新激活

  // 卡种
  getCardList: '/education/deptcard/pageDeptCardById',
  // 卡种类型
  getTypeList: '/education/type/listEduType',
  getClassTypeList: '/education/classtype/listEduClassType',
  // 支付类型
  getPayMethods: '/system/dict/listSysDict',
  getStudentBalance: '/student/info/getStudentBalance', //查询正式学员余额
  //类型
  listEduType: '/education/type/listEduType',
  saveEduType: '/education/type/saveEduType',
  enableType: '/education/type/enableType',
  removeEduType: '/education/type/removeEduType',
  //班型
  pageEduClassType: '/education/classtype/pageEduClassType', //条数
  removeEduClassType: '/education/classtype/removeEduClassType', //删除
  enableClassType: '/education/classtype/enableClassType', //是否启用
  saveEduClassType: '/education/classtype/saveEduClassType', //保存
  //私教
  getPersonalClassList: '/education/class/pageEduPersonalClass',

  //操作记录
  classChangeLog: '/education/class/listCardChangeLog', // 查看班级的操作记录<education:class:view>
  listCardChangeLogFile: 'education/class/listCardChangeLogFile', //操作日志附件
  listChangeLogFile: 'student/userlog/listChangeLogFile', //意向学员跟进附件

  //学员卡操作日志
  studentChangeLog: '/student/info/listCardChangeLog', // 查看卡的操作记录<student:info:view>
  delCardChangeLog: '/student/info/delCardChangeLog', // 删除卡的操作记录<student:info:delchangeLog>
  getListChangeLog: '/student/card/getListChangeLog', // 转卡日志<student:card:view>
  getChangeCardInfo: 'student/card/getChangeCardInfo', // 转卡日志详情<student:card:view>

  //薪酬
  listSalType: '/salary/type/listSalType',
  listSalEduType: '/education/common/listEduType',
  removeSalType: '/salary/type/removeSalType',
  saveSalType: '/salary/type/saveSalType',
  salTypeList: '/salary/common/salTypeList',

  saveSalary: '/salary/template/saveSalTemplate',
  salaryPage: '/salary/template/pageSalTemplate',
  salaryList: '/salary/template/listSalTemplate',
  listTeacherSalary: '/salary/template/listTeacherSalary',
  removeSalaryList: '/salary/template/removeSalTemplate',
  listTemplateItemLog: '/salary/template/listTemplateItemLog', // 薪酬变更记录
  findApplySalType: '/salary/template/findApplySalType', // 通过上课时长,班型id匹配薪酬类型

  //是否允许登录
  changeUserLoginState: '/salary/template/onLogin',
  //重置密码
  resetPwd: '/salary/template/resetUserPwd',

  //批量授权
  listGrantEduCard: '/education/card/listGrantEduCard', //批量授权列表
  batchGrantEduCards: '/education/card/batchGrantEduCards', //批量授权提交

  stopClassList: '/education/class/listSuspend',
  stopClass: '/education/class/suspendClass',
  removeStopClass: '/education/class/removeSuspendClass',

  //补课学生列表
  pageReplenishesPlan: '/education/class/pageReplenishesPlan',

  //班级补课记录
  getReplenishesPlan: '/education/class/replenishesPlanClass',
  saveReplenishesPlan: '/education/class/saveReplenishesPlan',
  deleteReplenishesPlan: '/student/signinlog/removeStuSignInLog',

  // 未分配的业绩
  listUnassignedIncomes: '/finance/info/listUnassignedIncomes',

  // 老师招聘需求管理
  listTeacherDemand: '/salary/teacher/demand/listTeacherDemand',
  removeTeacherDemand: '/salary/teacher/demand/removeTeacherDemand/',
  saveTeacherDemand: '/salary/teacher/demand/saveTeacherDemand',

  // 应聘阶层管理
  listInterviewPhase: '/salary/interview/listInterviewPhase',
  removeInterviewPhase: '/salary/interview/removeInterviewPhase',
  saveInterviewPhase: '/salary/interview/saveInterviewPhase',

  // 面试等级管理
  listInterviewLog: '/salary/interview/listInterviewLog',
  removeInterviewLog: '/salary/interview/removeInterviewLog',
  saveInterviewLog: '/salary/interview/saveInterviewLog',
  getInterviewLog: '/salary/interview/getInterviewLog',
  feedbackInterviewLog: '/salary/interview/feedbackInterviewLog',

  // 导师合同
  pageTeacherContract: '/salary/template/pageTeacherContract',
  removeSalTemplate: '/salary/template/removeSalTemplate',
  saveSalTemplate: '/salary/template/saveSalTemplate',
  saveSalTemplateItem: '/salary/template/saveSalTemplateItem',
  saveSalTemplateItemAdmin: '/salary/template/saveSalTemplateItemAdmin',
  enableSalTemplate: '/salary/template/enableSalTemplate',

  // 面试等级渠道管理
  listSalChannel: '/salary/channel/listSalChannel',
  saveSalChannel: '/salary/channel/saveSalChannel',
  removeSalChannel: '/salary/channel/removeSalChannel',
  getCancelClassUrl: '/education/class-url/getCancelClassUrl',
  confirmUnBindSutUser: '/education/class-url/confirmUnBindSutUser',

  // 私教绩效报表-私教课耗
  pageEduReport: '/eduscore/report/pageEduReport', // 私教课耗列表
  getReportInfo: '/eduscore/report/getReportInfo', // 查询详情
  removeReport: '/eduscore/report/removeReport', // 删除私教报表
  saveReport: '/eduscore/report/saveReport', // 保存
  updateStatus: '/eduscore/report/updateStatus', // 修改审核状态
  downEduReport: '/eduscore/report/downEduReport', // 导出报表

  // 私教绩效报表-私教成果考核
  pageAchieveScore: '/eduscore/achievescore/pageAchieveScore', // 私教成果考核列表
  saveEduAchieveScore: '/eduscore/achievescore/saveEduAchieveScore', // 保存报表
  removeAchieveScore: '/eduscore/achievescore/removeReport', // 删除成果考核报表
  getAchieveScoreInfo: '/eduscore/achievescore/getReportInfo', // 查询详情
  saveScore: '/eduscore/achievescore/saveScore', // 保存评分
  updateAchieveScoreStatus: '/eduscore/achievescore/updateStatus', // 修改审核状态

  // 少儿绩效报表
  listAchievement: '/achievement/children/listAchievement', // 查询列表
  saveAchievement: '/achievement/children/saveAchievement', // 新建报表
  deleteAchievements: '/achievement/children/deleteAchievements', // 批量删除
  listAchievementDetail: '/achievement/children/listAchievement/detail', // 少儿绩效详情
  listAchievementRenewalCard: '/achievement/children/listAchievement/renewalCard', // 应续卡列表
  listAchievementLossRenewalCard: '/achievement/children/listAchievement/lossRenewalCard', // 流失续卡列表
  listAchievementCard: '/achievement/children/listAchievement/card', // 到期,未到期,延期列表

  //续卡规则配置
  saveConfig: '/education/renewalCard/saveConfig',
  listConfig: '/education/renewalCard/listConfig',
  removeConfig: '/education/renewalCard/removeConfig',
  listEduCardType: '/education/card/listEduCardType',
  cardNext: '/system/common/listSysValConf/cardNext',
  cardNextType: '/system/common/listSysValConf/cardNextType',
  getConfig: '/education/renewalCard/getConfig', //续卡类型
  getStuCardNextLogTeacher: '/student/common/getStuCardNextLogTeacher',
  teacherSalaryList: '/salary/template/teacherSalaryList', //查询薪酬列表
  removeSalTemplateByBatch: '/salary/template/removeSalTemplateByBatch', //批量删除

  socialSecurityRecord: '/social/security/socialSecurityRecord',
  querySalTemplateDetails: '/salary/template/querySalTemplateDetails',

  //社保办理
  pageSocialSecurityTransact: '/social/security/pageSocialSecurityTransact',
  handleTransact: '/social/security/transact',
  socialDetail: '/social/security/detail',
  socialSecurityUntreatedNum: '/social/security/socialSecurityUntreatedNum',
  //社保停办
  socialStop: '/social/security/stop',
  pageSocialSecurityStop: '/social/security/pageSocialSecurityStop',

  //合同续签
  contractRenewal: '/social/security/contractRenewal',
  pageContractRenewal: '/social/security/pageContractRenewal',

  // 参考值录入
  referenceEntryPage: '/reference/value/page',
  referenceEntrySave: '/reference/value/save',
  referenceEntryUpdate: '/reference/value/update',
  referenceEntryDelete: '/reference/value/delete',
  referenceEntryDetail: '/reference/value/detail',
  getCardValue: '/student/card/getCardValue',

  // 教练班绩效管理
  pageCoachClass: '/education/instruct/pageCoachClass',
  listAchClassStudent: '/education/instruct/listAchClassStudent', //编辑-上课人数列表
  listAchClassStudentSpecial: '/education/instruct/listAchClassStudent/special', //编辑-特殊续卡/往期续卡列表
  listSysValConf: '/system/common/listSysValConf',
  getCardLog: '/student/card/instruct/getCardLog',
  listAchClassStudentStateSave: '/education/instruct/listAchClassStudent/state/save', //编辑-学员状态保存
  listAchClassStudentContinuitySave: '/education/instruct/listAchClassStudent/continuity/save', //编辑-是否连报保存
  listAchClassStudentSpecialSave: '/education/instruct/listAchClassStudent/special/save', //编辑-特殊续卡/往期续卡保存
  performanceScoreList: '/education/instruct/listAchClassStudent/score', //教练班班级绩效评分表-上课人数列表
  performanceScoreDelete: '/education/instruct/removeRenewal/card', //教练班班级绩效评分表-上课人数删除续卡
  performanceScoreSpecialList: '/education/instruct/listAchClassStudent/special/score', //教练班班级绩效评分表-特殊续卡/往期续卡列表
  performanceScoreSpecialDelete: '/education/instruct/removeRenewal/specialCard' //教练班班级绩效评分表-特殊续卡/往期续卡删除续卡
}
//修改转全职时间
export function editTransferDate(params) {
  return axios({
    url: '/salary/template/editTransferDate',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageCoachClass(params) {
  return axios({
    url: `${api.pageCoachClass}`,
    method: 'get',
    params
  })
}
export function listAchClassStudent(params) {
  return axios({
    url: `${api.listAchClassStudent}`,
    method: 'get',
    params
  })
}
export function listAchClassStudentSpecial(params) {
  return axios({
    url: `${api.listAchClassStudentSpecial}`,
    method: 'get',
    params
  })
}
export function listSysValConf(key) {
  return axios({
    url: `${api.listSysValConf}/${key}`,
    method: 'get'
  })
}
export function listAchClassStudentStateSave(params) {
  return axios({
    url: `${api.listAchClassStudentStateSave}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function listAchClassStudentContinuitySave(params) {
  return axios({
    url: `${api.listAchClassStudentContinuitySave}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function getCardLog(params) {
  return axios({
    url: `${api.getCardLog}`,
    method: 'get',
    params
  })
}
export function listAchClassStudentSpecialSave(params) {
  return axios({
    url: `${api.listAchClassStudentSpecialSave}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function getCardValue(params) {
  return axios({
    url: `${api.getCardValue}`,
    method: 'get',
    params
  })
}
export function performanceScoreList(params) {
  return axios({
    url: `${api.performanceScoreList}`,
    method: 'get',
    params
  })
}
export function performanceScoreDelete(params) {
  return axios({
    url: `${api.performanceScoreDelete}`,
    method: 'delete',
    params
  })
}
export function performanceScoreSpecialList(params) {
  return axios({
    url: `${api.performanceScoreSpecialList}`,
    method: 'get',
    params
  })
}
export function performanceScoreSpecialDelete(params) {
  return axios({
    url: `${api.performanceScoreSpecialDelete}`,
    method: 'delete',
    params
  })
}
export function referenceEntryPage(params) {
  return axios({
    url: `${api.referenceEntryPage}`,
    method: 'get',
    params
  })
}
export function referenceEntrySave(params) {
  return axios({
    url: `${api.referenceEntrySave}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function referenceEntryUpdate(params) {
  return axios({
    url: `${api.referenceEntryUpdate}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function referenceEntryDelete(id) {
  return axios({
    url: `${api.referenceEntryDelete}/${id}`,
    method: 'get'
  })
}
export function referenceEntryDetail(id) {
  return axios({
    url: `${api.referenceEntryDetail}/${id}`,
    method: 'get'
  })
}
//合同续签
export function pageContractRenewal(params) {
  return axios({
    url: `${api.pageContractRenewal}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function contractRenewal(params) {
  return axios({
    url: `${api.contractRenewal}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//社保停办
export function pageSocialSecurityStop(params) {
  return axios({
    url: `${api.pageSocialSecurityStop}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function socialStop(params) {
  return axios({
    url: `${api.socialStop}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//社保办理
export function socialSecurityUntreatedNum(params) {
  return axios({
    url: `${api.socialSecurityUntreatedNum}`,
    method: 'get',
    params: params
  })
}
export function socialDetail(params) {
  return axios({
    url: `${api.socialDetail}`,
    method: 'get',
    params: params
  })
}
export function handleTransact(params) {
  return axios({
    url: `${api.handleTransact}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageSocialSecurityTransact(params) {
  return axios({
    url: `${api.pageSocialSecurityTransact}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function querySalTemplateDetails(params) {
  return axios({
    url: `${api.querySalTemplateDetails}`,
    method: 'get',
    params: params
  })
}
export function socialSecurityRecord(params) {
  return axios({
    url: `${api.socialSecurityRecord}`,
    method: 'get',
    params: params
  })
}
export function teacherSalaryList(params) {
  return axios({
    url: `${api.teacherSalaryList}`,
    method: 'get',
    params: params
  })
}
export function removeSalTemplateByBatch(params) {
  return axios({
    url: `${api.removeSalTemplateByBatch}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
// 获取续卡老师
export function getStuCardNextLogTeacher(params) {
  return axios({
    url: `${api.getStuCardNextLogTeacher}`,
    method: 'get',
    params: params
  })
}
//续卡规则配置
export function getConfig(params) {
  return axios({
    url: `${api.getConfig}`,
    method: 'get',
    params: params
  })
}
export function cardNextType(params) {
  return axios({
    url: `${api.cardNextType}`,
    method: 'get',
    params: params
  })
}
export function cardNext(params) {
  return axios({
    url: `${api.cardNext}`,
    method: 'get',
    params: params
  })
}
export function listEduCardType(params) {
  return axios({
    url: `${api.listEduCardType}`,
    method: 'get',
    params: params
  })
}
export function removeConfig(id) {
  return axios({
    url: `${api.removeConfig}/${id}`,
    method: 'delete'
  })
}
export function listConfig(params) {
  return axios({
    url: `${api.listConfig}`,
    method: 'get',
    params: params
  })
}
export function saveConfig(params) {
  return axios({
    url: `${api.saveConfig}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function getCardLogPrice(params) {
  return axios({
    url: `${api.getCardLogPrice}`,
    method: 'get',
    params: params
  })
}
export function changeUserLoginState(id, params) {
  return axios({
    url: `${api.changeUserLoginState}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function resetPwd(params) {
  return axios({
    url: api.resetPwd,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listSalChannel(params) {
  return axios({
    url: `${api.listSalChannel}`,
    method: 'get',
    params: params
  })
}

export function removeSalChannel(id) {
  return axios({
    url: `${api.removeSalChannel}/${id}`,
    method: 'delete'
  })
}

export function saveSalChannel(params) {
  return axios({
    url: `${api.saveSalChannel}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function feedbackInterviewLog(params) {
  return axios({
    url: `${api.feedbackInterviewLog}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getInterviewLog(id) {
  return axios({
    url: `${api.getInterviewLog}/${id}`,
    method: 'get'
  })
}
export function pageTeacherContract(params) {
  return axios({
    url: `${api.pageTeacherContract}`,
    method: 'get',
    params: params
  })
}
export function removeSalTemplate(params) {
  return axios({
    url: `${api.removeSalTemplate}`,
    method: 'delete',
    params: params
  })
}
export function saveSalTemplate(params) {
  return axios({
    url: `${api.saveSalTemplate}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveSalTemplateItem(params) {
  return axios({
    url: `${api.saveSalTemplateItem}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveSalTemplateItemAdmin(params) {
  return axios({
    url: `${api.saveSalTemplateItemAdmin}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function enableSalTemplate(params) {
  return axios({
    url: `${api.enableSalTemplate}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listInterviewLog(params) {
  return axios({
    url: `${api.listInterviewLog}`,
    method: 'get',
    params: params
  })
}
export function removeInterviewLog(deleteId) {
  return axios({
    url: `${api.removeInterviewLog}/${deleteId}`,
    method: 'delete'
  })
}
export function saveInterviewLog(params) {
  return axios({
    url: `${api.saveInterviewLog}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listInterviewPhase() {
  return axios({
    url: `${api.listInterviewPhase}`,
    method: 'get'
  })
}
export function removeInterviewPhase(deleteId) {
  return axios({
    url: `${api.removeInterviewPhase}/${deleteId}`,
    method: 'delete'
  })
}
export function saveInterviewPhase(params) {
  return axios({
    url: `${api.saveInterviewPhase}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listTeacherDemand(params) {
  return axios({
    url: `${api.listTeacherDemand}`,
    method: 'get',
    params: params
  })
}
export function removeTeacherDemand(deleteId) {
  return axios({
    url: `${api.removeTeacherDemand}/${deleteId}`,
    method: 'delete'
  })
}
export function saveTeacherDemand(params) {
  return axios({
    url: `${api.saveTeacherDemand}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listUnassignedIncomes(params) {
  return axios({
    url: `${api.listUnassignedIncomes}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageReplenishesPlan(params) {
  return axios({
    url: `${api.pageReplenishesPlan}`,
    method: 'get',
    params: params
  })
}

export function getReplenishesPlan(params) {
  return axios({
    url: `${api.getReplenishesPlan}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveReplenishesPlan(params) {
  return axios({
    url: `${api.saveReplenishesPlan}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function deleteReplenishesPlan(stuSignInLogId) {
  return axios({
    url: `${api.deleteReplenishesPlan}/${stuSignInLogId}`,
    method: 'get'
  })
}

export function stopClassList(params) {
  return axios({
    url: api.stopClassList,
    method: 'get',
    params
  })
}

export function removeStopClass(params) {
  return axios({
    url: api.removeStopClass,
    method: 'delete',
    params
  })
}

export function stopClass(params) {
  return axios({
    url: api.stopClass,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function batchGrantEduCards(params) {
  return axios({
    url: api.batchGrantEduCards,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listGrantEduCard(params) {
  return axios({
    url: api.listGrantEduCard,
    method: 'get',
    params: params
  })
}

export function getUserTree(params) {
  return axios({
    url: api.getUserTree,
    method: 'get',
    params: params
  })
}

export function getCourseList(params) {
  return axios({
    url: api.courseList,
    method: 'get',
    params: params
  })
}

export function getDanceList(params) {
  return axios({
    url: api.getDanceList,
    method: 'get',
    params: params
  })
}

export function saveDance(params) {
  return axios({
    url: api.saveDance,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeDance(params) {
  return axios({
    url: `${api.removeDance}/${params}`,
    method: 'delete'
  })
}

export function changeDanceState(id, params) {
  return axios({
    url: `${api.changeDanceState}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getRoomList(params) {
  return axios({
    url: api.getRoomList,
    method: 'get',
    params: params
  })
}

export function saveRoom(params) {
  return axios({
    url: api.saveRoom,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeRoom(params) {
  return axios({
    url: `${api.removeRoom}/${params}`,
    method: 'delete'
  })
}

export function changeRoomState(id, params) {
  return axios({
    url: `${api.changeRoomState}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function modifyGradePoint(id, params) {
  return axios({
    url: `/education/class/modifyGradePoint/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function getClassList(params) {
  return axios({
    url: api.getClassList,
    method: 'get',
    params: params
  })
}
export function pageChildClass(params) {
  return axios({
    url: '/education/deptcard/pageChildClass',
    method: 'post',
    params: params
  })
}
export function nextEduClassGradePoint(params) {
  return axios({
    url: '/education/classGradePoint/nextEduClassGradePoint',
    method: 'get',
    params: params
  })
}
export function saveChildClass(params) {
  return axios({
    url: `/education/deptcard/saveChildClass`,
    method: 'post',
    params: params
  })
}
export function getClassOnLineList(params) {
  return axios({
    url: api.getClassOnLineList,
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

export function changeClass(classId, params) {
  return axios({
    url: `${api.changeClass}/${classId}`,
    method: 'post',
    params: params
  })
}

export function refundClassStatus(stuCardId, params) {
  return axios({
    url: `${api.refundClassStatus}/${stuCardId}`,
    method: 'post',
    params: params
  })
}

export function saveClass(params) {
  return axios({
    url: api.saveClass,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveClassP(params) {
  return axios({
    url: api.saveClassP,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeClass(params) {
  return axios({
    url: `${api.removeClass}/${params}`,
    method: 'delete'
  })
}

export function saveClassOnLine(params) {
  return axios({
    url: api.saveClassOnLine,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function removeClassOnLine(params) {
  return axios({
    url: `${api.removeClassOnLine}/${params}`,
    method: 'delete'
  })
}

export function getClassInfo(params) {
  return axios({
    url: `${api.getClassInfo}/${params}`,
    method: 'get'
  })
}

export function getCardInfoDuration(params) {
  return axios({
    url: api.getCardInfoDuration,
    method: 'get',
    params
  })
}

export function getClassUnselected(params) {
  return axios({
    url: api.getClassUnselected,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getClassStuList(params) {
  return axios({
    url: `${api.getClassStuList}/${params}`,
    method: 'get'
  })
}

export function getClassPlanList(params, classId) {
  return axios({
    url: `${api.getClassPlanList}/${classId}`,
    method: 'get',
    params: params
  })
}

export function removeClassPlan(params) {
  return axios({
    url: `${api.removeClassPlan}?ids=${params}`,
    method: 'delete'
  })
}
export function checkClassIsExistsStudent(classId) {
  return axios({
    url: `/education/class/checkClassIsExistsStudent/${classId}`,
    method: 'get'
  })
}
export function editAddClassPlan(params) {
  return axios({
    url: api.editAddClassPlan,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updatePlanTime(params) {
  return axios({
    url: api.updatePlanTime,
    method: 'post',
    params: params
  })
}
// 修复课表
export function repairPlan(classId) {
  return axios({
    url: `${api.repairPlan}/${classId}`,
    method: 'get'
  })
}
export function saveStuToClass(url, studentCardIds) {
  console.log(QS.stringify(studentCardIds))
  return axios({
    url: `${api.saveStuToClass}/${url}`,
    method: 'post',
    params: {
      studentCardIds: studentCardIds
    }
  })
}

export function getCardList(params) {
  return axios({
    url: api.getCardList,
    method: 'get',
    params: params
  })
}

export function getTypeList(params) {
  return axios({
    url: api.getTypeList,
    method: 'get',
    params: params
  })
}

export function getClassTypeList(params) {
  return axios({
    url: api.getClassTypeList,
    method: 'get',
    params: params
  })
}

export function getPayMethods(params) {
  return axios({
    url: `${api.getPayMethods}`,
    method: 'get',
    params: params
  })
}

export function getStudentBalance(params) {
  return axios({
    url: `${api.getStudentBalance}/${params}`,
    method: 'get'
  })
}

export function listClassWeekPlan(params) {
  return axios({
    url: api.listClassWeekPlan,
    method: 'get',
    params: params
  })
}
export function weekSchedule(params) {
  return axios({
    url: `/education/plan/weekSchedule`,
    method: 'get',
    params: params
  })
}
export function listHistoryStudents(id) {
  return axios({
    url: `/education/class/listHistoryStudents/${id}`,
    method: 'get'
  })
}
export function listChildClass(params) {
  return axios({
    url: `/education/deptcard/listChildClass`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//班级结业
export function graduateEduClass(params) {
  return axios({
    url: `${api.graduateEduClass}/${params}`,
    method: 'post'
  })
}

//重新激活班级
export function actEduClass(params) {
  return axios({
    url: `${api.actEduClass}/${params}`,
    method: 'post'
  })
}

//类型
export function listEduType(params) {
  return axios({
    url: api.listEduType,
    method: 'get',
    params: params
  })
}

export function listSalEduType(params) {
  return axios({
    url: api.listSalEduType,
    method: 'get',
    params: params
  })
}

export function removeEduType(params) {
  return axios({
    url: `${api.removeEduType}/${params}`,
    method: 'delete'
  })
}

export function enableType(id, params) {
  return axios({
    url: `${api.enableType}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveEduType(params) {
  return axios({
    url: api.saveEduType,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function classBatchSuspend(params) {
  return axios({
    url: api.classBatchSuspend,
    method: 'post',
    data: QS.stringify(params)
  })
}

//班型
export function pageEduClassType(params) {
  return axios({
    url: api.pageEduClassType,
    method: 'get',
    params: params
  })
}

export function removeEduClassType(params) {
  return axios({
    url: `${api.removeEduClassType}/${params}`,
    method: 'delete'
  })
}

export function enableClassType(id, params) {
  return axios({
    url: `${api.enableClassType}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveEduClassType(params) {
  return axios({
    url: api.saveEduClassType,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getPersonalClassList(params) {
  return axios({
    url: api.getPersonalClassList,
    method: 'get',
    params: params
  })
}

export function classChangeLog(classId) {
  return axios({
    url: `${api.classChangeLog}/${classId}`,
    method: 'get'
  })
}

export function studentChangeLog(params) {
  return axios({
    url: `${api.studentChangeLog}`,
    method: 'get',
    params
  })
}

export function delCardChangeLog(params) {
  return axios({
    url: `${api.delCardChangeLog}/${params}`,
    method: 'delete'
  })
}

export function getListChangeLog(params) {
  return axios({
    url: `${api.getListChangeLog}`,
    method: 'get',
    params
  })
}

export function getChangeCardInfo(params) {
  return axios({
    url: `${api.getChangeCardInfo}`,
    method: 'get',
    params
  })
}

export function listCardChangeLogFile(logId) {
  return axios({
    url: `${api.listCardChangeLogFile}/${logId}`,
    method: 'get'
  })
}

export function listChangeLogFile(logId) {
  return axios({
    url: `${api.listChangeLogFile}/${logId}`,
    method: 'get'
  })
}

export function listSalType(params) {
  return axios({
    url: api.listSalType,
    method: 'get',
    params: params
  })
}

export function saveSalType(params) {
  return axios({
    url: api.saveSalType,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeSalType(params) {
  return axios({
    url: `${api.removeSalType}/${params}`,
    method: 'delete'
  })
}

export function salTypeList(params) {
  return axios({
    url: api.salTypeList,
    method: 'get',
    params: params
  })
}

export function saveSalary(params) {
  return axios({
    url: api.saveSalary,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function salaryList(params) {
  return axios({
    url: api.salaryList,
    method: 'get',
    params: params
  })
}
export function listTeacherSalary(params) {
  return axios({
    url: api.listTeacherSalary,
    method: 'get',
    params: params
  })
}

export function salaryPage(params) {
  return axios({
    url: api.salaryPage,
    method: 'get',
    params: params
  })
}

export function removeSalaryList(params) {
  return axios({
    url: `${api.removeSalaryList}`,
    method: 'delete',
    params: params
  })
}

export function listTemplateItemLog(params) {
  return axios({
    url: `${api.listTemplateItemLog}`,
    method: 'get',
    params: params
  })
}

export function findApplySalType(params) {
  return axios({
    url: api.findApplySalType,
    method: 'get',
    params: params
  })
}

export function getCancelClassUrl(params) {
  return axios({
    url: api.getCancelClassUrl,
    method: 'get',
    params: params
  })
}
export function confirmUnBindSutUser(id, params) {
  return axios({
    url: `${api.confirmUnBindSutUser}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageEduReport(params) {
  return axios({
    url: api.pageEduReport,
    method: 'get',
    params
  })
}
export function getReportInfo(reportId) {
  return axios({
    url: `${api.getReportInfo}/${reportId}`,
    method: 'get'
  })
}
export function removeReport(reportIds) {
  return axios({
    url: `${api.removeReport}/${reportIds}`,
    method: 'delete'
  })
}
export function saveReport(params) {
  return axios({
    url: api.saveReport,
    method: 'post',
    params
  })
}
export function updateStatus(params) {
  return axios({
    url: api.updateStatus,
    method: 'post',
    params
  })
}
export function downEduReport(params) {
  return axios({
    url: api.downEduReport,
    method: 'post',
    params
  })
}

export function pageAchieveScore(params) {
  return axios({
    url: api.pageAchieveScore,
    method: 'get',
    params
  })
}
export function saveEduAchieveScore(params) {
  return axios({
    url: api.saveEduAchieveScore,
    method: 'post',
    params
  })
}
export function removeAchieveScore(eduAchieveScoreIds) {
  return axios({
    url: `${api.removeAchieveScore}/${eduAchieveScoreIds}`,
    method: 'delete'
  })
}
export function refreshAchieveScore(params) {
  return axios({
    url: `/eduscore/achievescore/refreshAchieveScore`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function getAchieveScoreInfo(eduAchieveScoreId) {
  return axios({
    url: `${api.getAchieveScoreInfo}/${eduAchieveScoreId}`,
    method: 'get'
  })
}
export function saveScore(params) {
  return axios({
    url: api.saveScore,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateAchieveScoreStatus(params) {
  return axios({
    url: api.updateAchieveScoreStatus,
    method: 'post',
    params
  })
}

export function listAchievement(params) {
  return axios({
    url: api.listAchievement,
    method: 'get',
    params
  })
}
export function saveAchievement(params) {
  return axios({
    url: api.saveAchievement,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function deleteAchievements(ids) {
  return axios({
    url: api.deleteAchievements,
    method: 'post',
    params: {
      ids
    }
  })
}
export function listAchievementDetail(params) {
  return axios({
    url: api.listAchievementDetail,
    method: 'get',
    params
  })
}
export function listAchievementRenewalCard(params) {
  return axios({
    url: api.listAchievementRenewalCard,
    method: 'get',
    params
  })
}
export function listAchievementLossRenewalCard(params) {
  return axios({
    url: api.listAchievementLossRenewalCard,
    method: 'get',
    params
  })
}
export function listAchievementCard(params) {
  return axios({
    url: api.listAchievementCard,
    method: 'get',
    params
  })
}

// 教练班绩效列表导出
export const exportAchClassList = params => axios.post('/education/instruct/down', QS.stringify(params), { responseType: 'blob' })
// 教练班绩效修改结业日期
export const editAchClassRealEndDate = params => axios.post('/education/instruct/listAchClassStudent/realEndDate/edit', QS.stringify(params))
// 教练班绩效表单反馈
export const getAchClassFeedback = params => axios.get(`/education/achclass/listStudentFeedback`, { params })
// 导出教练班表单
export const exportAchClassFeedback = params => axios.post(`/education/achclass/studentFeedbackDown`, QS.stringify(params), { responseType: 'blob' })
// 删除教练班绩效
export const deleteAchClassScore = params => axios.delete('/education/instruct/removeAuditionLog', { params })
// 教练班绩效基本信息
export const getAchClassStudentDetail = params => axios.get(`/education/instruct/listAchClassStudent/detail`, { params })
// 教练班续卡人头
export const getAchClassStudentDetailRenweList = params => axios.get(`/education/instruct/listAchClassStudent/renewCard/user`, { params })

// 修改续卡人头
export const saveRenewCardNum = params => axios.post(`/education/instruct/listAchClassStudent/renewCardNum/save`, QS.stringify(params))
// 教练班绩效评分明细
export const getAchClassStudentEvaluate = params => axios.get(`/education/instruct/achClassStudent/score/evaluate`, { params })
// 保存教练班绩效评分
export const saveAchClassScore = params => axios.post(`/education/instruct/listAchClassStudent/score/save`, QS.stringify(params))
// 确认教练班绩效评分
export const confirmAchClassScore = params => axios.post(`/education/instruct/listAchClassStudent/confirm`, QS.stringify(params))

// 教练班续卡统计列表
export const getCoachClassRenewalDetails = params => axios.get('/education/coachClassRenewal/reportClassDetails', { params })
// 教练班续卡统计列表导出
export const exportCoachClassRenewalDetails = params =>
  axios.post('/education/coachClassRenewal/reportClassDetailsByExport', QS.stringify(params), { responseType: 'blob' })

// 班级停课详情
export const getSuspendInfoList = params => axios.get('/education/class/listSuspendInfo', { params })
// 班级复课
export const restartClass = params => axios.post('/education/class/restartClass', QS.stringify(params))

// 保存薪酬配置
export const saveSalTemplateSingleItem = params => axios.post(`/salary/template/saveSalTemplateSingleItem`, QS.stringify(params))

// 学员和导师的签到都取消（替换以前的取消签到）
export const removeSignInLog = planId => axios.delete(`/student/signinlog/removeSignInLog/${planId}`)

// 获取续卡类型（根据名称搜索）
export const getNextCardTypeList = params => axios.get('/education/renewalCard/selectList', { params })

// 少儿绩效-私教 少儿绩效-199私教
export const getChildReferenceValue = params => axios.get('/achievement/children/getPriAchReferenceValue', { params })

// 少儿绩效
export const getChildrenPerformanceList = params => axios.post('/achievement/children/queryByPage', QS.stringify(params))
export const childrenPerformanceGenerateReport = params => axios.post('/achievement/children/generateReport', QS.stringify(params)) // 生成报表
export const childrenPerformanceDeleteBatch = params => axios.post('/achievement/children/generateReport/deleteBatch', QS.stringify(params)) // 批量删除
export const scoreChildrenPerformanceById = params => axios.post(`/achievement/children/grade/${params.reportId}`, params) // 评分
export const childrenPerformanceUnGrade = id => axios.delete(`/achievement/children/unGrade/${id}`) // 取消评分
export const getChildrenPerformanceGradeList = reportId => axios.get(`/achievement/children/queryGrade/${reportId}`) // 获取评分项
export const getChildrenPerformanceReportDetail = reportId => axios.get(`/achievement/children/queryById/${reportId}`) // 获取评分详情
export const deleteChildrenPerformanceClassStudent = params => axios.post(`/achievement/children/deleteClassStudent`, {}, { params }) // 删除学员
export const getChildrenPerformanceTeacherSignInRecordList = params => axios.get(`/achievement/children/queryTeacherSignInRecordList`, { params }) // 获取总课时数
export const childrenPerformanceBatchUpdateCourseTime = params => axios.post(`/achievement/children/batchUpdateCourseTime`, params)
export const getChildrenPerformanceCourseEditList = params => axios.get(`/achievement/children/queryTeacherCourseTimeRecordList`, { params }) // 获取变更记录
export const childrenPerformanceExportList = params => axios.post('/achievement/children/exportReportList', QS.stringify(params), { responseType: 'blob' })
export const childrenPerformanceExportDetail = params => axios.post('/achievement/children/exportReportDetails', QS.stringify(params), { responseType: 'blob' })
export const batchDeleteChildrenPerformance = params => axios.post('/achievement/children/deleteBatch', QS.stringify(params))

// 排课管理
export const exportEducationPlan = params =>
  axios.post('/education/plan/down', QS.stringify(params), { responseType: 'blob' })// 导出

// 判断排课薪酬和老师关系
export const checkPlanClass = params => axios.post('/education/class/checkPlanClass', QS.stringify(params))