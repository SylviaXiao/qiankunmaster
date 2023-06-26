import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  listEduCardType: '/education/common/listEduClassType',
  listEduDance: '/education/common/listEduDance',
  pageDeptCard: '/education/common/pageDeptCard',
  listClass: '/education/common/listClass',
  listEduRoom: '/education/common/listEduRoom',
  listEduType: '/education/common/listEduType',
  listChannelTree: '/system/channel/listChannelTree',
  getChannelTreeByUser: '/system/channel/getChannelTreeByUser',
  getCustomerGroups: '/system/channel/getCustomerGroups',
  treeEduClassType: '/education/common/treeEduClassType',
  salTypeListById: '/salary/common/salTypeListById',
  salTypeListByEduType: '/salary/common/salTypeListByEduType',
  pageStudent: '/student/common/pageStudent', // 学员列表
  pageCoachClassStudent: '/student/info/pageStudent/list', // 教练班学员列表
  pageStudentInvoice: '/student/common/pageStudentInvoice', //挑选学院
  pageClassCardLog: '/student/common/pageClassCardLog', //挑选学员 没有分页
  //获取验证码
  kaptcha: '/common/kaptcha',
  //短信验证码
  noteCode: '/common/sms-retrieve',
  //短信验证码
  retrievePwd: '/common/retrieve-pwd',

  //查询导师
  pageTeachers: '/salary/common/pageTeachers',
  //查询地区
  listArea: '/organize/common/listArea',
  //驗證老師手機號碼
  verifyTeaPhone: '/salary/common/verifyPhone',
  //特殊舞种
  scopeDanceList: '/education/common/scopeAreaDanceList',
  //特殊地区
  scopeListArea: '/organize/common/scopeListArea',
  scopeListAreaAndChildren: '/organize/common/scopeListAreaAndChildren',
  getUsersInDept: '/organize/common/getUsersInDept',
  pageStuCardChangeLog: '/student/common/pageStuCardChangeLog', //学员转卡列表
  userById: '/organize/user/pageDeptOrgUser',
  pageTeacherDemand: '/salary/common/pageTeacherDemand', //查看面试缺口
  listDept: 'education/common/listDept',
  feeItemList: '/system/common/feeItemList',
  saveExtValidStudentCard: '/student/card/valid/saveExtValidStudentCard', //学员卡延期
  //学员卡延期列表
  listStuCardExtVaildLog: '/student/card/valid/listStuCardExtVaildLog',
  //删除未上课课表
  removeEduDancePlanSchool: '/education/plan/removeEduDancePlanSchool',

  /* 分馆/公司配置 */
  listAllFinCompany: '/finance/common/listAllFinCompany', //分页查询公司
  listFinCompany: '/finance/common/listFinCompany', //通过分馆查询公司

  listSysValConf: '/system/common/listSysValConf', //查询系统变量Key
  pageSysValConf: '/sys/valconf/pageSysValConf', //续卡分类查询全部
  saveSysValConf: '/sys/valconf/saveSysValConf', //续卡分类保存
  delSysValConf: '/sys/valconf/delSysValConf', //续卡分类删除

  checkCardbin: '/organize/user/checkCardbin', //银行卡验证归属地
  checkCardImage: '/organize/user/checkCardImage', //银行卡图片验证

  commonDetailAchievement: '/finance/common/detail', //查看绩效
  commonPageSignInLogById: '/pageSignInLog', //查询学员签到记录(公共)
  getStudentPhone: '/student/info/getStudentPhone',

  commonPreUpload: '/common/cert/preUpload',
  commonViewUpload: '/common/cert/view',
  commonWx_sign: '/common/cert/wx_sign', //微信小程序文件鉴权
  checkStuOpenId: '/common/qr/checkStuOpenId',

  getRefundDetail: '/common/refund/getRefundDetail', //退费详情新接口
  listAllByArea: '/organize/dept/listAllByArea' ,//获取所有二级地区
  listAllByAreaDept:'/education/common/orgDeptList',

  treeCoachClassType: '/education/common/treeCoachClassType'//教练班班型树列表
}
//财政分摊校区列表
export function listFinOrgDept(params) {
  return axios({
    url: `/system/common/listFinOrgDept`,
    method: 'get',
    params: params
  })
}
export function deptFinReportListOrgDept(params) {
  return axios({
    url: `/system/common/deptFinReportListOrgDept`,
    method: 'get',
    params: params
  })
}
export function listAllByAreaDept(params) {
  return axios({
    url: `${api.listAllByAreaDept}`,
    method: 'get',
    params: params
  })
}
export function listAllByArea(params) {
  return axios({
    url: `${api.listAllByArea}`,
    method: 'get',
    params: params
  })
}
export function commonWx_sign(params) {
  return axios({
    url: `${api.commonWx_sign}`,
    method: 'get',
    params: params
  })
}
export function commonViewUpload(params) {
  return axios({
    url: `${api.commonViewUpload}`,
    method: 'get',
    params: params
  })
}
export function commonPreUpload(params) {
  return axios({
    url: `${api.commonPreUpload}`,
    method: 'get',
    params: params
  })
}
export function getStudentPhone(key) {
  return axios({
    url: `${api.getStudentPhone}/${key}`,
    method: 'get'
  })
}
export function listSysValConf(key, params = {}) {
  return axios({
    url: `${api.listSysValConf}/${key}`,
    method: 'get',
    params
  })
}
export function pageSysValConf(params) {
  return axios({
    url: api.pageSysValConf,
    method: 'get',
    params: params
  })
}
export function saveSysValConf(params) {
  return axios({
    url: api.saveSysValConf,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function delSysValConf(id) {
  return axios({
    url: `${api.delSysValConf}/${id}`,
    method: 'delete'
  })
}
export function removeEduDancePlanSchool(params) {
  return axios({
    url: `${api.removeEduDancePlanSchool}`,
    method: 'delete',
    params: params
  })
}
export function listStuCardExtVaildLog(params) {
  return axios({
    url: api.listStuCardExtVaildLog,
    method: 'get',
    params: params
  })
}
export function saveExtValidStudentCard(params) {
  return axios({
    url: api.saveExtValidStudentCard,
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

export function verifyTeaPhone(params) {
  return axios({
    url: api.verifyTeaPhone,
    method: 'get',
    params: params
  })
}

export function listArea(params) {
  return axios({
    url: api.listArea,
    method: 'get',
    params: params
  })
}

export function listEduCardType() {
  return axios({
    url: `${api.listEduCardType}`,
    method: 'get'
  })
}

export function listEduDance(params) {
  return axios({
    url: `${api.listEduDance}`,
    method: 'get',
    params: params
  })
}
export function classGradePointList(params) {
  return axios({
    url: `/education/classGradePoint/selectList`,
    method: 'get',
    params: params
  })
}
export function scopeDanceList(params) {
  return axios({
    url: `${api.scopeDanceList}`,
    method: 'get',
    params: params
  })
}

export function scopeListArea(params) {
  return axios({
    url: `${api.scopeListArea}`,
    method: 'get',
    params: params
  })
}
export function scopeListAreaAndChildren(params) {
  return axios({
    url: `${api.scopeListAreaAndChildren}`,
    method: 'get',
    params: params
  })
}

export function pageDeptCard(params) {
  if (params.cardName) params.cardName = encodeURI(params.cardName)
  return axios({
    url: `${api.pageDeptCard}`,
    method: 'get',
    params: params
  })
}

export function salTypeListById(params) {
  return axios({
    url: `${api.salTypeListById}`,
    method: 'get',
    params: params
  })
}

export function salTypeListByEduType(params) {
  return axios({
    url: `${api.salTypeListByEduType}`,
    method: 'get',
    params: params
  })
}

export function listClass(params) {
  return axios({
    url: `${api.listClass}`,
    method: 'get',
    params: params
  })
}

export function listEduRoom() {
  return axios({
    url: `${api.listEduRoom}`,
    method: 'get'
  })
}

export function listEduType() {
  return axios({
    url: `${api.listEduType}`,
    method: 'get'
  })
}

export function listChannelTree() {
  return axios({
    url: `${api.listChannelTree}`,
    method: 'get'
  })
}
export function getChannelTreeByUser() {
  return axios({
    url: `${api.getChannelTreeByUser}`,
    method: 'get'
  })
}

export function treeEduClassType(params) {
  return axios({
    url: `${api.treeEduClassType}`,
    method: 'get',
    params: params
  })
}

export function pageStudent(params) {
  return axios({
    url: `${api.pageStudent}`,
    method: 'get',
    params: params
  })
}

export function pageCoachClassStudent(params) {
  return axios({
    url: `${api.pageCoachClassStudent}`,
    method: 'get',
    params: params
  })
}

export function pageStudentInvoice(params) {
  return axios({
    url: `${api.pageStudentInvoice}`,
    method: 'get',
    params: params
  })
}
export function pageClassCardLog(params) {
  return axios({
    url: `${api.pageClassCardLog}`,
    method: 'get',
    params: params
  })
}

//获取验证码
export function getKaptcha() {
  return axios({
    url: `${api.kaptcha}`,
    method: 'get'
  })
}

//获取验证码
export function getNoteCode(params) {
  return axios({
    url: `${api.noteCode}`,
    method: 'get',
    params: params
  })
}

//修改密码
export function retrievePwd(params) {
  return axios({
    url: `${api.retrievePwd}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageTeachers(params) {
  return axios({
    url: `${api.pageTeachers}`,
    method: 'get',
    params: params
  })
}

export function pageStuCardChangeLog(params) {
  return axios({
    url: `${api.pageStuCardChangeLog}`,
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

export function pageTeacherDemand(params) {
  return axios({
    url: api.pageTeacherDemand,
    method: 'get',
    params: params
  })
}
export function getCustomerGroups(params) {
  return axios({
    url: api.getCustomerGroups,
    method: 'get',
    params: params
  })
}
export function listDept(params) {
  return axios({
    url: api.listDept,
    method: 'get',
    params: params
  })
}
export function feeItemList(params) {
  return axios({
    url: api.feeItemList,
    method: 'get',
    params: params
  })
}
export function listAllFinCompany(params) {
  return axios({
    url: api.listAllFinCompany,
    method: 'post'
  })
}
export function listFinCompany(params) {
  return axios({
    url: api.listFinCompany,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function checkCardbin(params) {
  return axios({
    url: api.checkCardbin,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function checkCardImage(params) {
  return axios({
    url: api.checkCardImage,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function commonDetailAchievement(params) {
  return axios({
    url: `${api.commonDetailAchievement}/${params}`,
    method: 'get'
  })
}
export function commonPageSignInLogById(params) {
  return axios({
    url: api.commonPageSignInLogById,
    method: 'get',
    params: params
  })
}
export function checkStuOpenId(params) {
  return axios({
    url: api.checkStuOpenId,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function getRefundDetail(params) {
  return axios({
    url: api.getRefundDetail,
    method: 'get',
    params: params
  })
}
export function treeCoachClassType(params) {
  return axios({
    url: api.treeCoachClassType,
    method: 'get',
    params: params
  })
}
export function getStudentInfoByIdCommon(classId) {
  return axios({
    url: `/common/student/getStudentInfoById/${classId}`,
    method: 'get',
  })
}
export function getStudentInfoById(classId) {
  return axios({
    url: `/student/questionnaireInfo/getStudentInfoById/${classId}`,
    method: 'get',
  })
}
export function questionnaireInfo(params) {
  return axios({
    url: `/common/student/questionnaireInfo`,
    method: 'get',
    params
  })
}
export function questionnaireInfoSave(params) {
  return axios({
    url: '/common/student/questionnaireInfo/save',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function commonListEduDance(params) {
  return axios({
    url: `/common/classPlan/listEduDance`,
    method: 'get',
    params
  })
}
export function commonListEduType(params) {
  return axios({
    url: `/common/classPlan/listEduType`,
    method: 'get',
    params
  })
}
