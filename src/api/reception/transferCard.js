import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  pageAchievementInto: '/finance/achievementChange/pageAchievementInto', // 顾问转入业绩列表
  pageAchievementRollOut: '/finance/achievementChange/pageAchievementRollOut', //顾问转出业绩列表
  removeAchievementChangeLog: '/finance/achievementChange/removeAchievementChangeLog', // 删除顾问业绩变更记录
  confirmAchievement: '/finance/achievementChange/confirmAchievement', // 分配顾问业绩
  achievementRollOut: '/finance/achievementChange/achievementRollOut', // 保存修改顾问转出记录
  getRollOutAchievementChangeLog: '/finance/achievementChange/getRollOutAchievementChangeLog', //转出业绩归属详情
  getIntoAchievementChangeLog: '/finance/achievementChange/getIntoAchievementChangeLog', //转出业绩归属详情
  ratioEduPersonalClass: '/education/class/ratioEduPersonalClass' //私教班级成本分摊
}

export function pageAchievementInto(parameter) {
  return axios({
    url: api.pageAchievementInto,
    params: parameter,
    method: 'get'
  })
}
export function pageAchievementRollOut(parameter) {
  return axios({
    url: api.pageAchievementRollOut,
    params: parameter,
    method: 'get'
  })
}
export function cancelAchievement(parameter) {
  return axios({
    url: '/finance/achievementChange/cancelAchievement',
    params: parameter,
    method: 'get'
  })
}
export function removeAchievementChangeLog(finInvoiceId) {
  return axios({
    url: `${api.removeAchievementChangeLog}/${finInvoiceId}`,
    method: 'delete',
  })
}

 export function confirmAchievement(params) {
  return axios({
    url: api.confirmAchievement,
    method: 'post',
    data: QS.stringify(params)
  })
}

 export function achievementRollOut(params) {
  return axios({
    url: api.achievementRollOut,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getRollOutAchievementChangeLog(parameter) {
  return axios({
    url: `${api.getRollOutAchievementChangeLog}/${parameter}`,
    method: 'get'
  })
}

export function getIntoAchievementChangeLog(parameter) {
  return axios({
    url: `${api.getIntoAchievementChangeLog}/${parameter}`,
    method: 'get'
  })
}

 export function ratioEduPersonalClass(params) {
  return axios({
    url: api.ratioEduPersonalClass,
    method: 'post',
    data: QS.stringify(params)
  })
}