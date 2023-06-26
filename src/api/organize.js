import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  //
  getUsersInDept: '/organize/user/getUsersInDept',
  //
  getALLDeptSchools: '/organize/dept/listSchool',
  deptTree: '/organize/dept/listOrgDeptTree',
  // userById: '/organize/user/pageOrgUser',
  userById: '/organize/user/pageDeptOrgUser',
  listOrgMenuTree: '/organize/menu/listOrgMenuTree',
  saveOrgMenu: '/organize/menu/saveOrgMenu',
  removeOrgMenu: '/organize/menu/removeOrgMenu',
  listOrgRole: '/organize/role/listOrgRole',
  listOrgRoleNew: '/organize/common/listOrgRole',
  removeRole: '/organize/role/removeOrgRole',
  saveOrgRole: '/organize/role/saveOrgRole',
  getRoleInfo: '/organize/role/getOrgRole',
  saveOrgDept: '/organize/dept/saveOrgDept',
  removeOrgDept: '/organize/dept/removeOrgDept',
  listOrgPosition: '/organize/position/listOrgPosition',
  listOrgPositionNew: '/organize/common/listOrgPosition',
  changePosState: '/organize/position/enableOrgPosition',
  saveOrgUser: '/organize/user/saveOrgUser',
  changeUserState: '/organize/user/onJob',

  removeOrgUser: '/organize/user/saveOrgUser',
  getUserInfo: '/organize/user/getOrgUser',
  saveOrgPosition: '/organize/position/saveOrgPosition',
  removeOrgPosition: '/organize/position/removeOrgPosition',
  getSysDictList: '/system/dict/getSysDictList',
  saveSysDict: '/system/dict/saveSysDict',
  removeSysDict: '/system/dict/removeSysDict/',

  listOrgPositionLog: '/organize/positionlog/listOrgPositionLog', //转岗记录
  updateOrgPositionLog: '/organize/positionlog/updateOrgPositionLog', //修改转岗时间

  //修改密码
  changePsw: '/organize/account/changePwd',

  //重置密码
  resetPwd: '/organize/user/resetUserPwd',
  changeUserLoginState: '/organize/user/onLogin',
  changeMenuStatus: '/organize/menu/enableOrgMenu',

  //登录日志
  allUserLog: '/organize/account/pageLoginLog',

  selectTree: '/organize/dept/listAllOrgDeptTree',
  verifyUserPhone: '/organize/user/verifyUserPhone', //验证是否为老员工
  verifyContacts: '/student/user/verifyContacts', //验证是否为老员工
  reset: '/organize/menu/reloadPerms',
  saveCurrentUser: '/organize/user/saveCurrentUser', //修改登录用户信息

  saveOrgUserRole: '/organize/user/saveOrgUserRole', //保存角色

  // ---------------- 教研人员地区分配
  pageEduUserAllocation: '/organize/allocation/pageEduUserAllocation', //人员分配地区列表
  removeEduUserAllocationById: '/organize/allocation/removeEduUserAllocationById', //删除人员分配
  saveEduUserAllocation: '/organize/allocation/saveEduUserAllocation', //添加人员分配地区
  findEduUserAllocation: '/organize/allocation/findEduUserAllocation', //查询教务人员分配详情

  // ---------------- 财务人员地区分配
  pageFinUserAllocation: '/organize/allocation/pageFinUserAllocation', //人员分配地区列表
  removeFinUserAllocation: '/organize/allocation/removeFinUserAllocation', //删除人员分配
  saveFinUserAllocation: '/organize/allocation/saveFinUserAllocation', //添加人员分配地区
  finUserAllocation: '/organize/allocation/finUserAllocation', // 财务人员分配详情

  removeReceiptBank: '/organize/receiptbank/delReceiptBank', //删除银行列表
  saveReceiptBank: '/organize/receiptbank/updateReceiptBank', //新增银行列表
  listReceiptBank: '/organize/receiptbank/pageReceiptBank', //新增银行列表

  updateUserDeptDate: '/organize/user/updateUserDeptDate', //修改转馆时间
  getDeptGroup: 'organize/dept/getDeptGroup', //获取客服小组数据
  queryCardChangeReport: '/studentCardChange/queryCardChangeReport',

  // 试课报名登记表
  auditionRegisterReport: '/auditionCourseEnroll/auditionCourseEnrollMasterReport',
  auditionRegisterReportDetails: '/auditionCourseEnroll/auditionCourseEnrollMasterReportDetails',

  // 私教199试课报名登记表
  personalAuditionRegisterReport: '/auditionCourseEnroll/privateEduAuditionCourseEnrollMasterReport',
  personalAuditionRegisterReportDetails1: '/auditionCourseEnroll/privateEduAuditionCourseEnrollMasterDetails1',
  personalAuditionRegisterReportDetails2: '/auditionCourseEnroll/privateEduAuditionCourseEnrollMasterDetails2',

  // 来访人数录入接口
  listDeptVisit: '/organize/deptVisit/listOrgDeptVisit',
  removeDeptVisit: '/organize/deptVisit/removeDeptVisit',
  saveDeptVisit: '/organize/deptVisit/saveOrUpdate',

  //总任务目标录入
  listTotalTaskTarget:'/totalTaskTarget/listTotalTaskTarget',//列表
  removeTotalTaskTarget:'/totalTaskTarget/removeTotalTaskTarget',//删除
  saveOrUpdate:'/totalTaskTarget/saveOrUpdate',//保存

  //线上收款
  pageFinOnline:'/finance/online/pageFinOnline',//线上收款分页查询
  addFinOnline:'/finance/online/addFinOnline',
  listIncomeType:'/finance/online/listIncomeType',
  listIncomePlatform:'/finance/online/listIncomePlatform',
  removeFinOnline:'/finance/online/removeFinOnline',
  addFinOnlineInfo:'/finance/online/addFinOnlineInfo',
  pageOnlineChannelInfo:'/finance/online/pageOnlineChannelInfo',
  comfirmFinOnlineInfo:'/finance/online/comfirmFinOnlineInfo',
  listOnline:'/finance/online/listOnline',
  removeFinOnlineInfo:'/finance/online/removeFinOnlineInfo',

  listDeptUserByService: '/organize/user/listDeptUserByService'
}
export function removeFinOnlineInfo(params) {
  return axios({
    url: api.removeFinOnlineInfo,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function listOnline(params) {
  return axios({
    url: api.listOnline,
    method: 'get',
    params: params
  })
}
export function comfirmFinOnlineInfo(params) {
  return axios({
    url: api.comfirmFinOnlineInfo,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageOnlineChannelInfo(params) {
  return axios({
    url: api.pageOnlineChannelInfo,
    method: 'get',
    params: params
  })
}
export function addFinOnlineInfo(params) {
  return axios({
    url: api.addFinOnlineInfo,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function removeFinOnline(params) {
  return axios({
    url: api.removeFinOnline,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function listIncomeType(params) {
  return axios({
    url: api.listIncomeType,
    method: 'get',
    params: params
  })
}
export function listIncomePlatform(params) {
  return axios({
    url: api.listIncomePlatform,
    method: 'get',
    params: params
  })
}
export function addFinOnline(params) {
  return axios({
    url: api.addFinOnline,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageFinOnline(params) {
  return axios({
    url: `${api.pageFinOnline}`,
    method: 'get',
    params: params
  })
}
export function listTotalTaskTarget(params) {
  return axios({
    url: api.listTotalTaskTarget,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function removeTotalTaskTarget(params) {
  return axios({
    url: `${api.removeTotalTaskTarget}/${params}`,
    method: 'delete'
  })
}
export function saveOrUpdate(params) {
  return axios({
    headers: { 'Content-Type': 'Application/json' },
    url: api.saveOrUpdate,
    method: 'post',
    data: params
  })
}
export function auditionRegisterReport(params) {
  return axios({
    url: api.auditionRegisterReport,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function auditionRegisterReportDetails(params) {
  return axios({
    url: api.auditionRegisterReportDetails,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function personalAuditionRegisterReport(params) {
  return axios({
    url: api.personalAuditionRegisterReport,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function personalAuditionRegisterReportDetails1(params) {
  return axios({
    url: api.personalAuditionRegisterReportDetails1,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function personalAuditionRegisterReportDetails2(params) {
  return axios({
    url: api.personalAuditionRegisterReportDetails2,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function listDeptVisit(params) {
  return axios({
    url: api.listDeptVisit,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function removeDeptVisit(id) {
  return axios({
    url: `${api.removeDeptVisit}/${id}`,
    method: 'delete'
  })
}
export function saveDeptVisit(params) {
  return axios({
    headers: { 'Content-Type': 'Application/json' },
    url: api.saveDeptVisit,
    method: 'post',
    data: params
  })
}
export function queryCardChangeReport(params) {
  return axios({
    url: api.queryCardChangeReport,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function getDeptGroup(params) {
  return axios({
    url: `${api.getDeptGroup}`,
    method: 'get',
    params: params
  })
}
export function updateOrgPositionLog(params) {
  return axios({
    url: `${api.updateOrgPositionLog}`,
    method: 'get',
    params: params
  })
}
export function listOrgPositionLog(params) {
  return axios({
    url: `${api.listOrgPositionLog}`,
    method: 'get',
    params: params
  })
}
export function updateUserDeptDate(params) {
  return axios({
    url: api.updateUserDeptDate,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function removeReceiptBank(params) {
  return axios({
    url: `${api.removeReceiptBank}/${params}`,
    method: 'delete'
  })
}
export function listReceiptBank(params) {
  return axios({
    url: `${api.listReceiptBank}`,
    method: 'get',
    params: params
  })
}
export function saveReceiptBank(params) {
  return axios({
    url: api.saveReceiptBank,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveOrgUserRole(params) {
  return axios({
    url: api.saveOrgUserRole,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function finUserAllocation(id) {
  return axios({
    url: `${api.finUserAllocation}/${id}`,
    method: 'get'
  })
}

export function resetMenu() {
  return axios({
    url: `${api.reset}`,
    method: 'get'
  })
}
export function resetPwd(params) {
  return axios({
    url: api.resetPwd,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getUsersInDept(position, params) {
  return axios({
    url: `${api.getUsersInDept}/${position}`,
    method: 'get',
    params: params
  })
}

export function getALLDeptSchools(params) {
  return axios({
    url: api.getALLDeptSchools,
    method: 'get',
    params: params
  })
}

export function getDeptTree(params) {
  return axios({
    url: api.deptTree,
    method: 'get',
    params: params
  })
}

export function getUserList(params) {
  return axios({
    url: api.userById,
    method: 'get',
    params: params
  })
}

export function getPermissionTree(params) {
  return axios({
    url: api.listOrgMenuTree,
    method: 'get',
    params: params
  })
}

export function selectTree(params) {
  return axios({
    url: api.selectTree,
    method: 'get',
    params: params
  })
}

export function saveOrgMenu(params) {
  return axios({
    url: api.saveOrgMenu,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeOrgMenu(params) {
  return axios({
    url: `${api.removeOrgMenu}/${params}`,
    method: 'delete'
  })
}

export function getOrgRole(params) {
  return axios({
    url: api.listOrgRole,
    method: 'get',
    params: params
  })
}

export function listOrgRole(params) {
  return axios({
    url: api.listOrgRole,
    method: 'get',
    params: params
  })
}

export function listOrgRoleNew(params) {
  return axios({
    url: api.listOrgRoleNew,
    method: 'get',
    params: params
  })
}

export function removeOrgRole(params) {
  return axios({
    url: `${api.removeRole}/${params}`,
    method: 'delete'
  })
}

export function saveOrgRole(params) {
  return axios({
    url: api.saveOrgRole,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getRoleInfo(params) {
  return axios({
    url: `${api.getRoleInfo}/${params}`,
    method: 'get'
  })
}

export function saveOrgDept(params) {
  return axios({
    url: api.saveOrgDept,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeOrgDept(params) {
  return axios({
    url: `${api.removeOrgDept}/${params}`,
    method: 'delete'
  })
}

export function listOrgPosition(params) {
  return axios({
    url: api.listOrgPosition,
    method: 'get',
    params: params
  })
}

export function listOrgPositionNew(params) {
  return axios({
    url: api.listOrgPositionNew,
    method: 'get',
    params: params
  })
}

export function saveOrgUser(params) {
  return axios({
    url: api.saveOrgUser,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getUserInfo(params) {
  return axios({
    url: `${api.getUserInfo}/${params}`,
    method: 'get'
  })
}

export function saveOrgPosition(params) {
  return axios({
    url: api.saveOrgPosition,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeOrgPosition(params) {
  return axios({
    url: `${api.removeOrgPosition}/${params}`,
    method: 'delete'
  })
}

export function getSysDictList(params) {
  return axios({
    url: api.getSysDictList,
    method: 'get',
    params: params
  })
}

export function saveSysDict(params) {
  return axios({
    url: api.saveSysDict,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeSysDict(params) {
  return axios({
    url: `${api.removeSysDict}/${params}`,
    method: 'delete'
  })
}

export function changePsw(params) {
  return axios({
    url: api.changePsw,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function changeMenuStatus(id, params) {
  return axios({
    url: `${api.changeMenuStatus}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function changeUserState(id, params) {
  return axios({
    url: `${api.changeUserState}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function changeUserLoginState(id, params) {
  return axios({
    url: `${api.changeUserLoginState}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function changePosState(id, params) {
  return axios({
    url: `${api.changePosState}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

//获取全部登陆日志
export function getAllUserLog(params) {
  return axios({
    url: api.allUserLog,
    method: 'post',
    data: QS.stringify(params)
  })
}

//获取当前登陆日志
export function getUserLog(params) {
  return axios({
    url: api.UserLog,
    method: 'post',
    data: QS.stringify(params)
  })
}

//验证手机号
export function verifyUserPhone(params) {
  return axios({
    url: api.verifyUserPhone,
    method: 'post',
    data: QS.stringify(params)
  })
}

//验证手机号
export function verifyContacts(params) {
  return axios({
    url: api.verifyContacts,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveCurrentUser(params) {
  return axios({
    url: api.saveCurrentUser,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageEduUserAllocation(params) {
  return axios({
    url: api.pageEduUserAllocation,
    method: 'get',
    params: params
  })
}
export function pageEduUserAllocationSetting(params) {
  return axios({
    url: '/organize/tas/allocation/pageEduUserAllocation',
    method: 'get',
    params: params
  })
}
export function removeEduUserAllocationSettingById(params) {
  return axios({
    url: `/organize/tas/allocation/removeEduUserAllocationById/${params}`,
    method: 'delete'
  })
}

export function saveEduUserAllocationSetting(params) {
  return axios({
    url:'/organize/tas/allocation/saveEduUserAllocation',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function removeEduUserAllocationById(params) {
  return axios({
    url: `${api.removeEduUserAllocationById}/${params}`,
    method: 'delete'
  })
}

export function saveEduUserAllocation(params) {
  return axios({
    url: api.saveEduUserAllocation,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function findEduUserAllocation(id) {
  return axios({
    url: `${api.findEduUserAllocation}/${id}`,
    method: 'get'
  })
}

export function pageFinUserAllocation(params) {
  return axios({
    url: api.pageFinUserAllocation,
    method: 'get',
    params: params
  })
}

export function removeFinUserAllocation(params) {
  return axios({
    url: `${api.removeFinUserAllocation}/${params}`,
    method: 'delete'
  })
}

export function saveFinUserAllocation(params) {
  return axios({
    url: api.saveFinUserAllocation,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listDeptUserByService(params) {
  return axios({
    url: api.listDeptUserByService,
    method: 'get',
    params: params
  })
}

// 获取报名199总人数&套报总人数详情
export const getAuditionprivateEduAuditionDetail = params => axios.post('/auditionCourseEnroll/privateEduAuditionDetail', QS.stringify(params))
// 获取报名199总人数&套报总人数详情导出
export const exportAuditionprivateEduAuditionDetail = params => axios.post('/auditionCourseEnroll/privateEduAuditionDetail/down', QS.stringify(params), { responseType: 'blob' })

// 私教199试课报名登记表（不含缴费）
export const noFinancePrivateEduAuditionCourseEnrollMasterReport = params => axios.post('/auditionCourseNoFinanceEnroll/privateEduAuditionCourseEnrollMasterReport', QS.stringify(params)) // 列表
export const noFinancePersonalAuditionRegisterReportDetails2 = params => axios.post('/auditionCourseNoFinanceEnroll/privateEduAuditionCourseEnrollMasterDetails2', QS.stringify(params))
// 详情

// 私教199试课报名登记表（合计）
export const totalPrivateEduAuditionCourseEnrollMasterReport = params => axios.post('/auditionCourseTotalEnroll/privateEduAuditionCourseEnrollMasterReport', QS.stringify(params))
export const totalPersonalAuditionRegisterReportDetails1 = params => axios.post('/auditionCourseTotalEnroll/privateEduAuditionCourseEnrollMasterDetails1', QS.stringify(params))// 试课详情
export const totalPersonalAuditionRegisterReportDetails2 = params => axios.post('/auditionCourseTotalEnroll/privateEduAuditionCourseEnrollMasterDetails2', QS.stringify(params))// 报名详情