import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  externalResource: '/home/stu/resource/external', //今日外部资源 home:stu:resource:external
  internalResource: '/home/stu/resource/internal', //今日内部资源 home:stu:resource:internal
  totalFinance: '/home/finance/total', //今日收入  home:finance:total
  adviserAchi: '/home/achievement/adviser', //今日顾问业绩 home:achievement:adviser
  csAchi: '/home/achievement/cs', //今日客服业绩 home:achievement:cs
  addedStu: '/home/finance/added', //今日报名/退款数 home:finance:added
  expireCard: '/home/student/card/expire', //今日到期卡 home:student:card:expire
  cardCount: '/home/edu/card/count', //最近一年新增卡数<home:edu:card:yearcount>
  yeartotal: '/home/finance/yeartotal', //最近一年收款金额<home:finance:yeartotal>
  yearcount: '/home/stu/resource/yearcount', //最近一年资源数量<home:stu:resource:yearcount>
  monthcount: '/home/stu/resource/monthcount', //最近一年资源数量<home:stu:resource:yearcount>
}

export function externalResource(params) {
  return axios({
    url: api.externalResource,
    method: 'get',
    params: params
  })
}

export function cardCount(params) {
  return axios({
    url: api.cardCount,
    method: 'get',
    params: params
  })
}

export function yeartotal(params) {
  return axios({
    url: api.yeartotal,
    method: 'get',
    params: params
  })
}

export function yearcount(params) {
  return axios({
    url: api.yearcount,
    method: 'get',
    params: params
  })
}

export function monthcount(params) {
  return axios({
    url: api.monthcount,
    method: 'get',
    params: params
  })
}

export function internalResource(params) {
  return axios({
    url: api.internalResource,
    method: 'get',
    params: params
  })
}

export function totalFinance(params) {
  return axios({
    url: api.totalFinance,
    method: 'get',
    params: params
  })
}

export function adviserAchi(params) {
  return axios({
    url: api.adviserAchi,
    method: 'get',
    params: params
  })
}

export function csAchi(params) {
  return axios({
    url: api.csAchi,
    method: 'get',
    params: params
  })
}

export function addedStu(params) {
  return axios({
    url: api.addedStu,
    method: 'get',
    params: params
  })
}

export function cancel(entryId) {
  return axios({
    url: `${api.cancel}/${entryId}`,
    method: 'post'
  })
}

// 消息通知列表
export const getNotificationList = params => axios.get(`/education/message/listEduMessage`, { params })
// 消息通知已读
export const checkNotification = params => axios.post('/education/message/check', QS.stringify(params))