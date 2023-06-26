import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  getAuthList: '/student/audition/listStuAudition',
  listSysChannel: '/system/channel/listSysChannel', // 获取渠道
  listChannel: '/system/channel/listChannel', // 获取渠道
  removeSysChannel: '/system/channel/removeSysChannel', // 删除渠道
  saveSysChannel: '/system/channel/saveSysChannel', // 保存渠道
  getSysStuSourceList: '/system/stusource/getSysStuSourceList', //获取招生来源
  removeSysStuSource: '/system/stusource/removeSysStuSource', //删除招生来源
  saveSysStuSource: '/system/stusource/saveSysStuSource', //保存招生来源
  getSysDictList: '/system/dict/getSysDictList', //获取支付方式,
  getAllSysDictList: '/system/dict/getAllSysDictList', //获取支付方式,
  removeSysDict: '/system/dict/removeSysDict', //删除支付方式
  saveSysDict: '/system/dict/saveSysDict', //保存支付方式
  synchronousStuAvatar: '/student/info/synchronousStuAvatar', //修复课表
  saveWorkflowOwner: '/workflow/saveWorkflowOwner',
  saveWorkflowRole: '/workflow/saveWorkflowRole',
  listWorkflowRoleDetail: '/workflow/listWorkflowRoleDetail', // 列表数据
  listWorkflowRoleUserDetail: '/workflow/listWorkflowRoleUserDetail', // 列表数据
  removeWorkflowRole: '/workflow/removeWorkflowRole',
  removeWorkflowOwner: '/workflow/removeWorkflowOwner',
  saveWorkflow: '/workflow/info/saveWorkflow',
  saveWorkflowStep: '/workflow/info/saveWorkflowStep',
  delWorkflow: '/workflow/info/delWorkflow',
  delWorkflowStep: '/workflow/info/delWorkflowStep',
  listWorkflowRole: '/workflow/listWorkflowRole',
  listWorkflow: '/workflow/info/listWorkflow',
  listWorkflowDetail: '/workflow/info/listWorkflowDetail',
  listScoreItem: '/education/scoreitem/listScoreItem', //教务评分项列表
  removeScoreItem: '/education/scoreitem/removeScoreItem', //删除教务评分项
  saveScoreItem: '/education/scoreitem/saveScoreItem', //保存教务评分项
  getScoreItem: '/education/scoreitem/getScoreItem', //教务评分项详情
  saveWorkflowParams: '/workflow/info/saveWorkflowParams', //key参数保存
  getWorkflowParams: '/workflow/info/getWorkflowParams', //key参数详情

  /* 私教奖金设置 */
  listEduBonusItem: '/eduscore/bonusItem/listEduBonusItem', //私教奖金配置项列表
  removeEduBonusItem: '/eduscore/bonusItem/removeEduBonusItem', //删除私教奖金配置项
  saveEduBonusItem: '/eduscore/bonusItem/saveEduBonusItem', //保存私教奖金配置项

  /* 成果考核配置 */
  listEduAchieveItem: '/eduscore/achieveitem/listEduAchieveItem', //成果考核配置项列表
  saveEduAchieveItem: '/eduscore/achieveitem/saveEduAchieveItem', //保存成果考核配置项
  removeEduAchieveItem: '/eduscore/achieveitem/removeEduAchieveItem', //删除成果考核配置项

  /* 评分总分配置 */
  listCommonEduConfig: 'eduscore/achieveitem/listCommonEduConfig', //无权限
  listEduConfig: '/eduscore/achieveitem/listEduConfig',
  saveEduConfig: '/eduscore/achieveitem/saveEduConfig',

  //招生年龄段
  ageBracketNoPermissionList: '/system/ageBracket/noPermission/list', //查询列表
  ageBracketList: '/system/ageBracket/list', //查询列表
  ageBracketRemove: '/system/ageBracket/remove', //删除
  ageBracketSave: '/system/ageBracket/save', //查询列表
  //招生标签
  stuTagNoPermissionList: '/system/stuTag/noPermission/list', //查询列表
  stuTagList: '/system/stuTag/list', //查询列表
  stuTagRemove: '/system/stuTag/remove', //删除
  stuTagSave: '/system/stuTag/save', //查询列表
  queryChangeLog: '/system/dict/queryChangeLog' //变更记录
}
export function queryChangeLog(id, params) {
  return axios({
    url: `${api.queryChangeLog}/${id}`,
    method: 'get',
    params: params
  })
}
export function ageBracketNoPermissionList(params) {
  return axios({
    url: api.ageBracketNoPermissionList,
    method: 'get',
    params: params
  })
}
//招生年龄段
export function stuTagNoPermissionList(params) {
  return axios({
    url: api.stuTagNoPermissionList,
    method: 'get',
    params: params
  })
}
export function stuTagSave(params) {
  return axios({
    url: api.stuTagSave,
    method: 'post',
    data: params,
    headers: { 'Content-Type': 'Application/json' }
  })
}
export function stuTagRemove(id) {
  return axios({
    url: `${api.stuTagRemove}/${id}`,
    method: 'delete'
  })
}
export function stuTagList(params) {
  return axios({
    url: api.stuTagList,
    method: 'get',
    params: params
  })
}
//招生年龄段
export function ageBracketSave(params) {
  return axios({
    url: api.ageBracketSave,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function ageBracketRemove(id) {
  return axios({
    url: `${api.ageBracketRemove}/${id}`,
    method: 'delete'
  })
}
export function ageBracketList(params) {
  return axios({
    url: api.ageBracketList,
    method: 'get',
    params: params
  })
}
// 工作流
export function saveWorkflowStep(params) {
  return axios({
    url: api.saveWorkflowStep,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveWorkflow(params) {
  return axios({
    url: api.saveWorkflow,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveWorkflowOwner(params) {
  return axios({
    url: api.saveWorkflowOwner,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveWorkflowRole(params) {
  return axios({
    url: api.saveWorkflowRole,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function listWorkflowRole(params) {
  return axios({
    url: api.listWorkflowRole,
    method: 'get',
    params: params
  })
}
export function listWorkflow(params) {
  return axios({
    url: api.listWorkflow,
    method: 'get',
    params: params
  })
}
export function listWorkflowDetail(params) {
  return axios({
    url: api.listWorkflowDetail,
    method: 'get',
    params: params
  })
}
export function listWorkflowRoleDetail(params) {
  return axios({
    url: api.listWorkflowRoleDetail,
    method: 'get',
    params: params
  })
}
export function listWorkflowRoleUserDetail(params) {
  return axios({
    url: api.listWorkflowRoleUserDetail,
    method: 'get',
    params: params
  })
}
export function delWorkflowStep(id) {
  return axios({
    url: `${api.delWorkflowStep}/${id}`,
    method: 'delete'
  })
}
export function delWorkflow(id) {
  return axios({
    url: `${api.delWorkflow}/${id}`,
    method: 'delete'
  })
}
export function removeWorkflowRole(id) {
  return axios({
    url: `${api.removeWorkflowRole}/${id}`,
    method: 'delete'
  })
}
export function removeWorkflowOwner(params) {
  return axios({
    url: `${api.removeWorkflowOwner}/${params.roleId}`,
    method: 'delete',
    params: params
  })
}

export function synchronousStuAvatar(params) {
  return axios({
    url: api.synchronousStuAvatar,
    method: 'post',
    data: QS.stringify(params)
  })
}

// 获取渠道
export function listSysChannel(params) {
  return axios({
    url: api.listSysChannel,
    method: 'get',
    params: params
  })
}
// 获取渠道
export function listChannel(params) {
  return axios({
    url: api.listChannel,
    method: 'get',
    params: params
  })
}

// 删除渠道
export function removeSysChannel(params) {
  return axios({
    url: `${api.removeSysChannel}/${params}`,
    method: 'delete'
  })
}

// 保存渠道
export function saveSysChannel(params) {
  return axios({
    url: api.saveSysChannel,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getSysStuSourceList(params) {
  return axios({
    url: api.getSysStuSourceList,
    method: 'get',
    params: params
  })
}

export function removeSysStuSource(id) {
  return axios({
    url: `${api.removeSysStuSource}/${id}`,
    method: 'delete'
  })
}

export function saveSysStuSource(params) {
  return axios({
    url: api.saveSysStuSource,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getAllSysDictList(params) {
  return axios({
    url: api.getAllSysDictList,
    method: 'get',
    params: params
  })
}
export function getSysDictList(params) {
  return axios({
    url: api.getSysDictList,
    method: 'get',
    params: params
  })
}

export function removeSysDict(id) {
  return axios({
    url: `${api.removeSysDict}/${id}`,
    method: 'delete'
  })
}

export function saveSysDict(params) {
  return axios({
    url: api.saveSysDict,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listScoreItem(params) {
  return axios({
    url: api.listScoreItem,
    method: 'get',
    params: params
  })
}

export function removeScoreItem(id) {
  return axios({
    url: `${api.removeScoreItem}/${id}`,
    method: 'delete'
  })
}

export function saveScoreItem(params) {
  return axios({
    url: api.saveScoreItem,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getScoreItem(params) {
  return axios({
    url: api.getScoreItem,
    method: 'get',
    params: params
  })
}
export function getWorkflowParams(params) {
  return axios({
    url: api.getWorkflowParams,
    method: 'get',
    params: params
  })
}

export function saveWorkflowParams(params) {
  return axios({
    url: api.saveWorkflowParams,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listEduBonusItem() {
  return axios({
    url: api.listEduBonusItem,
    method: 'get'
  })
}
export function removeEduBonusItem(id) {
  return axios({
    url: `${api.removeEduBonusItem}/${id}`,
    method: 'delete'
  })
}
export function saveEduBonusItem(params) {
  return axios({
    url: api.saveEduBonusItem,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listEduAchieveItem() {
  return axios({
    url: api.listEduAchieveItem,
    method: 'get'
  })
}
export function saveEduAchieveItem(params) {
  return axios({
    url: api.saveEduAchieveItem,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function removeEduAchieveItem(id) {
  return axios({
    url: `${api.removeEduAchieveItem}/${id}`,
    method: 'delete'
  })
}

export function listCommonEduConfig() {
  return axios({
    url: api.listCommonEduConfig,
    method: 'get'
  })
}
export function listEduConfig() {
  return axios({
    url: api.listEduConfig,
    method: 'get'
  })
}
export function saveEduConfig(params) {
  return axios({
    url: api.saveEduConfig,
    method: 'post',
    data: QS.stringify(params)
  })
}

// 下载学员卡延期管理附件
export const downloadCardValid = params => axios.post('/student/card/valid/down', QS.stringify(params), { responseType: 'blob' })

// 少儿绩效 - 绩点
export const getChildrenGradePointList = params => axios.get(`/education/classGradePoint/queryList`, { params })
export const createChildrenGradePoint = params => axios.post(`/education/classGradePoint/create`, params)
export const updateChildrenGradePoint = params => axios.post(`/education/classGradePoint/update`, params)
export const deleteChildrenGradePointList = params => axios.delete(`/education/classGradePoint/delete`, { params })

// 少儿绩效 - 参考值
export const getChildrenPriAchValueConfigList = params => axios.get(`/achievement/children/listPriAchValueConfig`, { params })
export const updateChildrenPriAchValueConfigList = params => axios.post(`/achievement/children/priAchValueConfigUpdate`, {}, { params })

// 少儿绩效 - 评估
export const getChildrenScoreConfigList = params => axios.get('/achievement/children/score/config/list', { params })
export const createChildrenScoreConfig = params => axios.post(`/achievement/children/score/config/create`, params)
export const updateChildrenScoreConfig = params => axios.post('/achievement/children/score/config/update', params)
export const deleteChildrenScoreItem = id => axios.delete(`/achievement/children/score/config/delete/${id}`)