import { axios } from '@/utils/request'
import QS from 'qs'
const api = {
  getPageList: '/student/info/pageStudent',
  deleteStudent: '/student/info/removeStudent',
  getStudentInfo: '/student/info/getStudentById',
  saveStudentLimit: '/student/info/saveStudentLimit',
  saveStudentNoLimit: '/student/info/saveStudentNoLimit',
  getSelectStuSourceData: '/system/stusource/listSysStuSource',

  listStudentCard: '/student/card/listStudentCard', //查询学员卡列表
  pageStuPaidLog: '/student/info/pageStuPaidLog', //获取学员的流水记录
  pageSignInLogById: '/student/signinlog/pageSignInLog', //查询卡种在某班的签到记录
  studentCardByLogDate: '/student/card/studentCardByLogDate', //试课管理：绑定学员查询卡号列表

  listStuLeave: '/student/leave/listStuLeave', //学员请假列表

  removeStuLeave: '/student/leave/removeStuLeave', //学员请假列表
  batchSaveStuLeave: '/student/leave/batchSaveStuLeave', //批量保存
  manualEndLeave: '/student/leave/manualEndLeave', //结束请假
  listLeaveFile: '/student/leave/listLeaveFile', //请假附件列表

  pageAuditionLog: '/student/auditionlog/pageAuditionLog', // 学生试听列表
  unbindAuditionLog: '/student/auditionlog/unbindAuditionLog', // 解除关联记录
  bindAuditionLog: '/student/auditionlog/bindAuditionLog', // 绑定学员
  updateAuditionLogRemark: '/student/auditionlog/updateAuditionLogRemark', // 修改备注

  pageSalDeducts: '/salary/deduct/pageSalDeducts', //查询扣费扣次记录<salary:deduct:view>
  removeSalDeduct: '/salary/deduct/removeSalDeduct/', //删除记录<salary:deduct:delete></salary>
  saveSalDeduct: '/salary/deduct/saveSalDeduct', //保存扣费扣次<salary:deduct:save>

  synchronousStuAvatar: '/student/info/synchronousStuAvatar', //同步学员头像<student:info:synchronous>
  listActiveStudentCard: '/student/card/listActiveStudentCard', // 新增请假table列表
  pageCardNextLog: '/student/cardnextlog/pageCardNextLog', // 学员续卡table列表
  saveStuTeacherScore: '/student/cardnextlog/saveFinCardNextLogStatus', // 作废+确认
  listStuCardNextLog: '/student/common/listStuCardNextLog', // 往期卡种下拉
  saveStuCardNextLog: '/student/cardnextlog/saveStuCardNextLog', // 续卡弹窗修改
  removeStuCardNextLog: '/student/cardnextlog/removeStuCardNextLog', // 续卡删除

  listSalCreationFee: '/salary/creationfee/listSalCreationFee', //创编费列表
  getSalCreationFee: '/salary/creationfee/getSalCreationFee', //创编费详情
  saveSalCreationFee: '/salary/creationfee/saveSalCreationFee', //创编费保存
  changeSalCreationFee: '/salary/creationfee/changeSalCreationFee', //创编费修改
  removeSalCreationFee: '/salary/creationfee/removeSalCreationFee', //创编费删除
  removeEduClassCreationFee: '/education/class/removeEduClassCreationFee', //取消创编费
  pageClassCreationFee: '/education/class/pageClassCreationFee', //创编费列表
  confirmStuCardNextLog: '/student/cardnextlog/confirmStuCardNextLog', //续卡修改并确认
  saveNextCard: '/student/cardnextlog/saveNextCard',
  delStuCardNext: '/student/cardnextlog/delStuCardNext',
  pageNextLog: '/student/cardnextlog/pageNextLog', // 前台学员续卡table列表

  updateListAdvise: '/student/info/updateListAdvise', // 批量修改学员顾问

  pageStuOut: '/student/out/pageStuOut', //学员输出/接收列表
  saveStuOut: '/student/out/save', //学员输出保存
  deleteStuOut: '/student/out/delete', //学员输出删除
  confirmStuOut: '/student/out/confirm', //学员接收确认
  downStuOut: '/student/out/downStuOut', //学员输送导出

  getStudentCardFin: '/student/refund/getStudentCardFin', //退费学员卡和上级缴费记录
  getStudentCardSign: '/student/refund/getStudentCardSign', //退费学员卡签到记录
  refundApprovalStudentCardLog: '/student/card/refundApprovalStudentCardLog', //退费学员卡修改记录(修改次数和修改有效期)

  pageStuRefundFile: '/student/refund/pageStuRefundFile', //附件上传列表
  reStartFastdpRefund: '/student/refund/reStartFastdpRefund', //驳回后重新启动
  adminStartRufund: '/student/refund/adminStartRufund', //退费学员提交审批(管理员专用)

  getParentingList: '/student/info/pageStudent/parentage', //绑定亲子关系弹框查询列表
  bindParenting: '/student/info/save/parentage', //绑定亲子关系
  unbindParenting: '/student/info/unbind/parentage',

  // 199试课转化报名
  pagePersonalAuditionRegisterChange: '/student/auditionConversion/pageAuditionLog',
  bindPersonalAuditionRegister: '/student/auditionConversion/bindAuditionLog',
  unbindPersonalAuditionRegister: '/student/auditionConversion/unbindAuditionLog'
}

export function bindTrialCard(parameter) {
  return axios({
    url: `/student/auditionlog/bindTrialCard`,
    method: 'post',
    data: QS.stringify(parameter)
  })
}
export function queryTrialCardBindList(parameter) {
  return axios({
    url:'/student/auditionlog/queryTrialCardBindList',
    method: 'get',
    params: parameter
  })
}
export function attendanceDetailsList(params) {
  return axios({
    url: `/education/attendance/pageList/detail`,
    method: 'get',
    params
  })
}
export function pagePersonalAuditionRegisterChange(parameter) {
  return axios({
    url: `${api.pagePersonalAuditionRegisterChange}`,
    method: 'post',
    data: QS.stringify(parameter)
  })
}

export function bindPersonalAuditionRegister(parameter) {
  return axios({
    url: `${api.bindPersonalAuditionRegister}`,
    method: 'post',
    data: QS.stringify(parameter)
  })
}

export function unbindPersonalAuditionRegister(id) {
  return axios({
    url: `${api.unbindPersonalAuditionRegister}/${id}`,
    method: 'get'
  })
}

export function getParentingList(params) {
  return axios({
    url: api.getParentingList,
    method: 'get',
    params
  })
}
export function bindParenting(parameter) {
  return axios({
    url: api.bindParenting,
    method: 'post',
    data: QS.stringify(parameter)
  })
}
export function unbindParenting(parameter) {
  return axios({
    url: api.unbindParenting,
    method: 'post',
    data: QS.stringify(parameter)
  })
}
export function pageNextLog(parameter) {
  return axios({
    url: api.pageNextLog,
    method: 'get',
    params: parameter
  })
}
export function saveNextCard(parameter) {
  return axios({
    url: api.saveNextCard,
    method: 'post',
    data: QS.stringify(parameter)
  })
}
export function delStuCardNext(parameter) {
  return axios({
    url: `${api.delStuCardNext}/${parameter}`,
    method: 'delete'
  })
}

export function removeSalDeduct(parameter) {
  return axios({
    url: `${api.removeSalDeduct}/${parameter}`,
    method: 'delete'
  })
}

export function pageSalDeducts(parameter) {
  return axios({
    url: `${api.pageSalDeducts}`,
    params: parameter,
    method: 'get'
  })
}

export function listActiveStudentCard(parameter) {
  return axios({
    url: `${api.listActiveStudentCard}/${parameter}`,
    params: parameter,
    method: 'get'
  })
}

export function saveSalDeduct(parameter) {
  return axios({
    url: api.saveSalDeduct,
    method: 'post',
    data: QS.stringify(parameter)
  })
}

export function getSelectStuSourceData() {
  return axios({
    url: api.getSelectStuSourceData,
    method: 'get'
  })
}

export function getPageList(parameter, ignoreSchoolId = false) {
  return axios({
    url: api.getPageList,
    method: 'get',
    params: parameter,
    ignoreSchoolId
  })
}

export function deleteStudent(parameter) {
  return axios({
    url: `${api.deleteStudent}/${parameter}`,
    method: 'delete'
  })
}

export function removeStuCardNextLog(parameter) {
  return axios({
    url: `${api.removeStuCardNextLog}/${parameter}`,
    method: 'delete'
  })
}

export function getStudentInfo(parameter) {
  return axios({
    url: `${api.getStudentInfo}/${parameter}`,
    method: 'get'
  })
}

export function saveStudentNoLimit(parameter) {
  return axios({
    url: api.saveStudentNoLimit,
    method: 'post',
    data: QS.stringify(parameter)
  })
}
export function saveStudentLimit(parameter) {
  return axios({
    url: api.saveStudentLimit,
    method: 'post',
    data: QS.stringify(parameter)
  })
}

// 查询学员列表
export function listStudentCard(parameter) {
  return axios({
    url: api.listStudentCard,
    method: 'get',
    params: parameter
  })
}

export function studentCardByLogDate(params) {
  return axios({
    url: `${api.studentCardByLogDate}`,
    method: 'get',
    params
  })
}

// 查询学员列表
export function pageSignInLogById(params) {
  return axios({
    url: api.pageSignInLogById,
    method: 'get',
    params: params
  })
}

//获取学员的流水记录
export function pageStuPaidLog(parameter) {
  return axios({
    url: api.pageStuPaidLog,
    method: 'post',
    params: parameter
  })
}

export function listStuLeave(parameter) {
  return axios({
    url: api.listStuLeave,
    method: 'get',
    params: parameter
  })
}

export function manualEndLeave(parameter) {
  return axios({
    url: api.manualEndLeave,
    method: 'get',
    params: parameter
  })
}

export function pageAuditionLog(parameter,ignoreSchoolId=false) {
  return axios({
    url: api.pageAuditionLog,
    method: 'get',
    params: parameter,
    ignoreSchoolId: ignoreSchoolId
  })
}

export function unbindAuditionLog(parameter) {
  return axios({
    url: `${api.unbindAuditionLog}/${parameter}`,
    method: 'get'
  })
}

export function bindAuditionLog(parameter) {
  return axios({
    url: `${api.bindAuditionLog}/${parameter.auditionId}`,
    params: parameter,
    method: 'post'
  })
}

export function updateAuditionLogRemark(params) {
  return axios({
    url: api.updateAuditionLogRemark,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeStuLeave(parameter) {
  return axios({
    url: `${api.removeStuLeave}/${parameter}`,
    method: 'delete'
  })
}
export function listLeaveFile(parameter) {
  console.log(parameter)
  return axios({
    url: `${api.listLeaveFile}/${parameter}`,
    method: 'get'
  })
}

export function batchSaveStuLeave(params) {
  return axios({
    url: api.batchSaveStuLeave,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function synchronousStuAvatar(params) {
  return axios({
    url: api.synchronousStuAvatar,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageCardNextLog(parameter) {
  return axios({
    url: api.pageCardNextLog,
    method: 'get',
    params: parameter
  })
}

export function saveStuTeacherScore(params) {
  return axios({
    url: api.saveStuTeacherScore,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveStuCardNextLog(params) {
  return axios({
    url: api.saveStuCardNextLog,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listStuCardNextLog(parameter) {
  return axios({
    url: api.listStuCardNextLog,
    method: 'get',
    params: parameter
  })
}

export const listStuCardNextLog2 = params => axios.get(`/student/common/listStuCardNextLog2`, { params })


export function listSalCreationFee(parameter) {
  return axios({
    url: `${api.listSalCreationFee}`,
    method: 'get'
  })
}

export function getSalCreationFee(parameter) {
  return axios({
    url: `${api.getSalCreationFee}`,
    method: 'get',
    params: parameter
  })
}

export function saveSalCreationFee(params) {
  return axios({
    url: api.saveSalCreationFee,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function changeSalCreationFee(params) {
  return axios({
    url: api.changeSalCreationFee,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function confirmStuCardNextLog(params) {
  return axios({
    url: api.confirmStuCardNextLog,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeSalCreationFee(parameter) {
  return axios({
    url: `${api.removeSalCreationFee}/${parameter}`,
    method: 'delete'
  })
}
export function removeEduClassCreationFee(parameter) {
  return axios({
    url: `${api.removeEduClassCreationFee}/${parameter}`,
    method: 'delete'
  })
}

export function pageClassCreationFee(parameter) {
  return axios({
    url: `${api.pageClassCreationFee}`,
    method: 'get',
    params: parameter
  })
}

// 批量修改学员顾问
export function updateListAdvise(parameter) {
  return axios({
    url: api.updateListAdvise,
    method: 'post',
    data: QS.stringify(parameter)
  })
}

export function pageStuOut(parameter) {
  return axios({
    url: api.pageStuOut,
    method: 'post',
    params: parameter
  })
}
export function saveStuOut(parameter) {
  return axios({
    url: api.saveStuOut,
    method: 'post',
    data: QS.stringify(parameter)
  })
}
export function deleteStuOut(stuOutId) {
  return axios({
    url: `${api.deleteStuOut}?stuOutId=${stuOutId}`,
    method: 'post'
  })
}
export function confirmStuOut(parameter) {
  return axios({
    url: api.confirmStuOut,
    method: 'post',
    data: QS.stringify(parameter)
  })
}
export function downStuOut(parameter) {
  return axios({
    url: api.downStuOut,
    method: 'post',
    data: QS.stringify(parameter)
  })
}
export function getStudentCardFin(params) {
  return axios({
    url: `${api.getStudentCardFin}`,
    method: 'get',
    params
  })
}
export function getStudentCardSign(params) {
  return axios({
    url: `${api.getStudentCardSign}`,
    method: 'get',
    params
  })
}
export function refundApprovalStudentCardLog(params) {
  return axios({
    url: `${api.refundApprovalStudentCardLog}/${params}`,
    method: 'get'
  })
}

export function pageStuRefundFile(params) {
  return axios({
    url: `${api.pageStuRefundFile}`,
    method: 'get',
    params
  })
}
export function reStartFastdpRefund(params) {
  return axios({
    url: api.reStartFastdpRefund,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function adminStartRufund(params) {
  return axios({
    url: api.adminStartRufund,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function remvoeStuRefund(params) {
  return axios({
    url: `/student/refund/remvoeStuRefund`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function revocationStuRefund(params) {
  return axios({
    url: `/student/refund/revocationStuRefund`,
    method: 'post',
    data: QS.stringify(params)
  })
}


// 资源来源 = 会员续卡时，获取该学员续卡
export const getStudentNextCardList = params => axios.get('/student/cardnextlog/getNextCard', { params })

// 资源来源 = 会员续卡时，获取续卡下拉
export const getListStuCardNextLog = params => axios.get('/student/common/getListStuCardNextLog', { params })

// 取消试课
export const cancelAuditionlog = params => axios.post('/student/auditionConversion/signAuditionLog/cancel', QS.stringify(params))

// 199试课转化报名(不含缴费)
export const getAuditionConversionNoFinancePageAuditionLog = params => axios.post('/student/auditionConversion/noFinance/pageAuditionLog', QS.stringify(params)) // 列表
export const auditionConversionUnbindAuditionLog = id => axios.get(`/student/auditionConversion/noFinance/unbindAuditionLog/${id}`) // 取消绑定
export const auditionConversionNoFinanceBindAuditionLog = params => axios.post('/student/auditionConversion/noFinance/bindAuditionLog', QS.stringify(params))// 绑定报名