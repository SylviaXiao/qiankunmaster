import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  getTodayPlanList: '/home/edu/plan/today', // 获取今日课程安排表
  getStuSignInList: '/student/signinlog/listStuSignInLog', //根据planId获得学生列表
  getTeaSignInList: '/education/signinlog/listTeaSignLog', // 根据planId获取导师表单数据
  SignInStuList: '/student/signinlog/stuSignInLog', // 学生列表签到
  SignReInStuList: '/student/signinlog/stuSignInLogUp', // 学生列表补签
  SignInTeaList: '/education/signinlog/teaSignInLog', // 导师列表签到
  SignReInTeaList: '/education/signinlog/teaSignInLog/supplement', // 导师列表签到
  saveSalDeduct: '/salary/deduct/saveSalDeduct', // 保存导师扣除
  actualMembers: '/student/signinlog/actualMembers', // 设置实到人数
  substTeaSave: '/education/signinlog/saveSubstituteTeacher' // 设置实到人数
}

export function updateClassTeacher(params) {
  return axios({
    url: `/education/plan/updateClassTeacher`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function actualMembers(params, planId) {
  return axios({
    url: `${api.actualMembers}/${planId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getTodayPlanList(parameter) {
  return axios({
    url: `${api.getTodayPlanList}`,
    method: 'get'
  })
}

export function getStuSignInList(params) {
  return axios({
    url: api.getStuSignInList,
    method: 'get',
    params: params
  })
}

export function getTeaSignInList(params) {
  return axios({
    url: api.getTeaSignInList,
    method: 'get',
    params: params
  })
}

export function SignInStuList(params, planId) {
  return axios({
    url: `${api.SignInStuList}/${planId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function SignReInStuList(params, planId) {
  return axios({
    url: `${api.SignReInStuList}/${planId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function SignInTeaList(params) {
  return axios({
    url: api.SignInTeaList,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function substTeaSave(params) {
  return axios({
    url: api.substTeaSave,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function saveSalDeduct(params) {
  return axios({
    url: api.saveSalDeduct,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function SignReInTeaList(params) {
  return axios({
    url: api.SignReInTeaList,
    method: 'post',
    data: QS.stringify(params)
  })
}
// 导师批量签到
export const batchteaSignInLog = params => axios.post(`/education/signinlog/batchteaSignInLog`, QS.stringify(params))