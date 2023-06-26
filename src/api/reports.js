import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  reports: '/education/stat/card',
  excel: '/framework/report/excel',
  finance: '/finance/stat/income',//财务报表
  paytype: '/finance/stat/paytype',//收款方式统计
  incomeDetail: '/finance/stat/incomeDetail',//收支明细
  deductionReason: '/finance/stat/deductionReason',//扣费金额统计
  // service: '/finance/stat/commission/service',//客服绩效统计
  service: '/finance/stat/achievement/service',//客服绩效统计
  master: '/finance/stat/commission/master',//顾问绩效统计
  branchAchievement: '/finance/stat/branchAchievement', //分馆业绩统计

  classtype: '/education/stat/classtype',//卡种业绩统计表
  type: '/education/stat/type',//收款方式统计
  dance: '/education/stat/dance',//收款方式统计
  masterAchievement: '/finance/stat/achievement/master',//顾问业绩统计
  nextCardTypeCount: '/education/stat/nextCardTypeCount',//收款方式统计
  nextCardCount: '/education/stat/nextCardCount',//收款方式统计
  cardCount: '/education/stat/newCardCount',//收款方式统计
  cardTypeCount: '/education/stat/newCardTypeCount',//收款方式统计
  classIncome: '/education/stat/classIncome',//收款方式统计
  refundReason: '/finance/stat/refundReason',//退费原因统计
  // 客服
  newResource: '/student/user-stat/new/cs',//每日资源统计
  newResourcePersonal: '/student/user-stat/new/cs-personal',//每日资源统计(个人)
  schoolResource: '/student/user-stat/school/resource/cs',//分馆月资源统计
  channelCs: '/student/user-stat/channel/cs',//(总)渠道来源统计 kefu
  resourcePersonal: '/student/user-stat/school/resource/cs-personal',//(个人)分馆资源月统计
  csPersonal: '/student/user-stat/channel/cs-personal',//(个人)渠道来源统计
  danceCs: '/student/user-stat/dance/cs',//舞种班别统计
  // 分馆
  schoolPrice: '/student/user-stat/school/price',//分馆金额统计
  studentCard: '/student/stat/card',//学生卡
  cardPackage: '/student/stat/cardPackage',// 学员卡套餐统计
  //導出
  excelReport: '/framework/report/excel',
  //薪酬
  ///salary/stat/templates    导出薪酬库<salary:stat:teacher:template>
  salaryTemplates: 'salary/stat/teacher/templates',//导师薪酬库
  salarySummary: '/salary/stat/teacher/summary',//导师薪酬汇总
  teacherTimes: '/salary/stat/teacher/times',//   导师课时统计

  //班级详情
  stuSignInLog: '/student/stat/stuSignInLog', //学员签到统计
  //员工签到
  userSignLog: '/education/stat/signSummary',
  //助教簽到統計
  teasignSummary: '/education/stat/teasignSummary',
  teachetDollars: '/education/stat/teachetDollars',
  //店面收入统计
  finShop:'/finance/stat/finShop',
  //收款方式汇总(公私)
  paytypePrivate:'/finance/stat/paytypePrivate',
  // 续卡绩效汇总(教研)
  nextCardPriceJy:'/education/stat/nextCardPriceJy',
  // 客服业绩明细
  serviceItem:'/finance/stat/achievement/serviceitem',
  orgUser:'/organize/stat/orgUser',
  profit:'/finance/stat/profit',
  profitcard:'/finance/stat/profitcard',

  generateUserSalary: '/report/usersalary/generateUserSalary', //工资手动录入

  areaClass: '/report/edu/areaClass', //私教课耗统计
  areaStudent: '/report/edu/areaStudent', //私教课耗统计明细
}

export function excelReport(params) {
  return axios({
    url: `${api.excelReport}`,
    method: 'post',
    data: QS.stringify(params),
    responseType: 'blob'
  })
}

export function getReports(params) {
  return axios({
    url: `${api.reports}`,
    method: 'get'
  })
}

export function getExcel(name) {
  return axios({
    url: `${api.excel}/${name}`,
    method: 'get',
    responseType: 'blob'
  })
}

export function finance(params) {
  return axios({
    url: `${api.finance}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function orgUser(params) {
  return axios({
    url: `${api.orgUser}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function nextCardPriceJy(params) {
  return axios({
    url: `${api.nextCardPriceJy}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function serviceItem(params) {
  return axios({
    url: `${api.serviceItem}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function incomeDetail(params) {
  return axios({
    url: `${api.incomeDetail}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function deductionReason(params) {
  return axios({
    url: `${api.deductionReason}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function paytype(params) {
  return axios({
    url: `${api.paytype}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function service(params) {
  return axios({
    url: `${api.service}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function master(params) {
  return axios({
    url: `${api.master}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function branchAchievement(params) {
  return axios({
    url: `${api.branchAchievement}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function classtype(params) {
  return axios({
    url: `${api.classtype}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function type(params) {
  return axios({
    url: `${api.type}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function dance(params) {
  return axios({
    url: `${api.dance}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function masterAchievement(params) {
  return axios({
    url: `${api.masterAchievement}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function nextCardTypeCount(params) {
  return axios({
    url: `${api.nextCardTypeCount}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function nextCardCount(params) {
  return axios({
    url: `${api.nextCardCount}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function cardTypeCount(params) {
  return axios({
    url: `${api.cardTypeCount}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function cardCount(params) {
  return axios({
    url: `${api.cardCount}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function classIncome(params) {
  return axios({
    url: `${api.classIncome}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function refundReason(params) {
  return axios({
    url: `${api.refundReason}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function newResource(params) {
  return axios({
    url: `${api.newResource}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function newResourcePersonal(params) {
  return axios({
    url: `${api.newResourcePersonal}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function schoolPrice(params) {
  return axios({
    url: `${api.schoolPrice}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function schoolResource(params) {
  return axios({
    url: `${api.schoolResource}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function channelCs(params) {
  return axios({
    url: `${api.channelCs}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function resourcePersonal(params) {
  return axios({
    url: `${api.resourcePersonal}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function csPersonal(params) {
  return axios({
    url: `${api.csPersonal}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function danceCs(params) {
  return axios({
    url: `${api.danceCs}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function studentCard(params) {
  return axios({
    url: `${api.studentCard}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function cardPackage(params) {
  return axios({
    url: `${api.cardPackage}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function salaryTemplates(params) {
  return axios({
    url: `${api.salaryTemplates}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function salarySummary(params) {
  return axios({
    url: `${api.salarySummary}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function teacherTimes(params) {
  return axios({
    url: `${api.teacherTimes}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function stuSignInLog(params) {
  return axios({
    url: `${api.stuSignInLog}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function userSignLog(params) {
  return axios({
    url: `${api.userSignLog}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function teasignSummary(params) {
  return axios({
    url: `${api.teasignSummary}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function teachetDollars(params) {
  return axios({
    url: `${api.teachetDollars}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function finShop(params) {
  return axios({
    url: `${api.finShop}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function paytypePrivate(params) {
  return axios({
    url: `${api.paytypePrivate}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function profit(params) {
  return axios({
    url: `${api.profit}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function profitcard(params) {
  return axios({
    url: `${api.profitcard}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function generateUserSalary(params) {
  return axios({
    url: `${api.generateUserSalary}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function areaClass(params) {
  return axios({
    url: `${api.areaClass}`,
    method: 'get',
    params
  })
}

export function areaStudent(params) {
  return axios({
    url: `${api.areaStudent}`,
    method: 'get',
    params
  })
}
