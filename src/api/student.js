import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  getAuthList: '/student/audition/listStuAudition',
  removeStuUser: '/student/user/removeStuUser',
  saveStuUser: '/student/user/saveStuUser',
  saveTryStuUser: '/student/audition/saveAudition', //试听学员信息保存
  saveTry: '/student/audition/saveStuAuditionById',
  getStuUserById: '/student/user/getStuUserById',
  saveStuUserStatus: '/student/user/saveStuUserStatus/', //更改客户状态
  pageStuUsserLog: '/student/userlog/listStuUserLog', //查询沟通时间轴
  listSysDict: '/system/dict/listSysDict', //获取招生来源列表
  pageStuUser: '/student/user/pageCsStuUser',
  saveToStudent: '/student/user/saveToStudent', //转正式
  toAuditionNo: '/student/user/toAuditionNo', //转预约试听
  toAuditionYo: '/student/user/toAuditionYo', //转已试听
  saveStuUserLog: '/student/userlog/saveStuUserLog', //新增沟通记录
  saveOrgName: '/student/user/changeStuOrgUser', //保存负责人
  getUsersInDept: '/organize/user/getUsersInDept', //获取负责人

  //
  getStuAvatar: '/student/info/avatar',
  studentRefund: '/student/info/studentRefund', //学员退费
  saveStuLog: '/student/log/saveStudentLog',
  listStuLog: '/student/log/listStudentLog',

  //学生签到
  saveStuSignInLog: '/student/signinlog/getClassStuCard', //添加常规班签到学生卡
  recognizeFile: '/student/signinlog/recognizeFile', //学员签到照片记录
  stuSignUpdateRemark: '/student/signinlog/updateRemark', //学员签到备注

  //学生试听
  dancePlanAuditionLog: '/student/auditionlog/dancePlanAuditionLog',
  removeAuditionLog: '/student/auditionlog/removeAuditionLog',
  saveAuditionLog: '/student/auditionlog/saveAuditionLog', // 意向学员添加试课
  signAuditionLog: '/student/auditionlog/signAuditionLog', // 试课签到
  insertRemark: '/student/card/insertRemark', // 备注新增
  updateRemark: '/student/card/updateRemark', // 备注修改
  deleteRemark: '/student/card/deleteRemark', // 备注删除
  allCardRemark: '/student/card/allCardRemark', // 备注列表
  saveTrialClass: '/student/auditionlog/saveTrialClass', // 学员添加试课
  updateAuditionLogClass: '/student/auditionlog/updateAuditionLogClass', // 修改试课

  updateStuCard: '/student/card/updateStuCard', // 修改学员卡信息

  changeStuUser: '/student/user/changeStuUser', // 资源变更绑定的正式学员
  listStuUserChangeLog: '/student/user/listStuUserChangeLog', // 变更学员记录

  getRepeatStuUser: '/student/user/getRepeatStuUser', //查看已存在重复学员信息
  studentCardLogById: '/student/card/studentCardLogById'
}
export function studentCardLogById(id, params) {
  return axios({
    url: `${api.studentCardLogById}/${id}`,
    method: 'get',
    params: params
  })
}
export function signAuditionLog(parameter) {
  return axios({
    url: api.signAuditionLog,
    method: 'post',
    data: QS.stringify(parameter)
  })
}

export function dancePlanAuditionLog(params) {
  return axios({
    url: api.dancePlanAuditionLog,
    method: 'get',
    params: params
  })
}

export function recognizeFile(params) {
  return axios({
    url: `${api.recognizeFile}`,
    method: 'get',
    params: params
  })
}

export function stuSignUpdateRemark(params) {
  return axios({
    url: api.stuSignUpdateRemark,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveAuditionLog(params) {
  return axios({
    url: api.saveAuditionLog,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeAuditionLog(params) {
  return axios({
    url: `${api.removeAuditionLog}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageStuUser(params) {
  return axios({
    url: api.pageStuUser,
    method: 'get',
    params: params
  })
}

//获取招生来源列表
export function listSysDict() {
  return axios({
    url: `${api.listSysDict}`,
    method: 'get'
  })
}

// 查询试听详情
export function getAuthList(params) {
  return axios({
    url: `${api.getAuthList}/${params}`,
    method: 'get'
  })
}

//
export function saveToStudent(params) {
  return axios({
    url: `${api.saveToStudent}/${params}`,
    method: 'post'
  })
}

//保存负责人
export function saveOrgName(params) {
  return axios({
    url: api.saveOrgName,
    method: 'post',
    data: QS.stringify(params)
  })
}

// 更改客户状态
export function saveStuUserStatus(params) {
  return axios({
    url: `${api.saveStuUserStatus}/${params}`,
    method: 'post'
  })
}

// 试听修改
export function saveTry(params) {
  return axios({
    url: `${api.saveTry}/${params.id}/${params.auditionType}`,
    method: 'post'
  })
}

//
export function toAuditionNo(params) {
  return axios({
    url: `${api.toAuditionNo}/${params}`,
    method: 'post'
  })
}

export function toAuditionYo(params) {
  return axios({
    url: `${api.toAuditionYo}/${params}`,
    method: 'post'
  })
}

// export function getUserList(params) {
//   return axios({
//     url: api.userById,
//     method: 'get',
//     params: params
//   })
// }

export function getPermissionTree(params) {
  return axios({
    url: api.listOrgMenuTree,
    method: 'get',
    params: params
  })
}

export function saveTryStuUser(params) {
  return axios({
    url: `${api.saveTryStuUser}/${params.userId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeStuUser(params) {
  return axios({
    url: `${api.removeStuUser}/${params}`,
    method: 'delete'
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

//退费
export function studentRefund(params) {
  return axios({
    url: api.studentRefund,
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

export function getStuUserById(params) {
  return axios({
    url: `${api.getStuUserById}/${params}`,
    method: 'get'
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

export function getStuAvatar(params) {
  return axios({
    url: `${api.getStuAvatar}/${params}`,
    method: 'get'
  })
}

export function saveStuLog(params) {
  return axios({
    url: `${api.saveStuLog}/${params.stuId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listStuLog(params) {
  return axios({
    url: api.listStuLog,
    method: 'get',
    params: params
  })
}

//学生签到添加人
export function saveStuSignInLog(params) {
  return axios({
    url: api.saveStuSignInLog,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function allCardRemark(params) {
  return axios({
    url: api.allCardRemark,
    method: 'get',
    params: params
  })
}
export function saveTrialClass(parameter) {
  return axios({
    url: api.saveTrialClass,
    method: 'post',
    data: QS.stringify(parameter)
  })
}
export function updateAuditionLogClass(parameter) {
  return axios({
    url: api.updateAuditionLogClass,
    method: 'post',
    data: QS.stringify(parameter)
  })
}

export function insertRemark(params) {
  return axios({
    url: api.insertRemark,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateRemark(params) {
  return axios({
    url: api.updateRemark,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function deleteRemark(params) {
  return axios({
    url: api.deleteRemark,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateStuCard(parameter) {
  return axios({
    url: api.updateStuCard,
    method: 'post',
    data: QS.stringify(parameter)
  })
}

export function changeStuUser(params) {
  return axios({
    url: api.changeStuUser,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function listStuUserChangeLog(params) {
  return axios({
    url: api.listStuUserChangeLog,
    method: 'get',
    params
  })
}
export function getRepeatStuUser(params) {
  return axios({
    url: api.getRepeatStuUser,
    method: 'get',
    params
  })
}

// 学员和导师的签到都取消（取消签到二次确认操作）
export const removeSignAuditionLog = params => axios.post(`/student/auditionlog/signAuditionLog/remove`, QS.stringify(params))

// 学员和导师的签到都取消（删除试课/取消预约二次确认操作）
export const deleteSignAuditionLog = params => axios.post(`/student/auditionlog/auditionLog/removeAll`, QS.stringify(params)) 

// 获取签到记录
export const getCardNextLog = params => axios.get('/student/cardnextlog/querySigninLog', { params })
// 获取绩点
export const getClassGradePoint = params => axios.get('/education/classGradePoint/selectList', { params })