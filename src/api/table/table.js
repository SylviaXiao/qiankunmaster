import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  //部门财报
  listDeptFinReport: '/finance/salarycheck/listDeptFinReport', //部门财报
  pageAdviserPer: '/finance/salarycheck/pageAdviserPer', //顾问业绩（唯一）
  pageCost: '/finance/salarycheck/pageCost', //成本费用
  pageFinInfo: '/finance/salarycheck/pageFinInfo', //收入明细
  pageRefundPay: '/finance/salarycheck/pageRefundPay', //退费支付
  pageRefundSub: '/finance/salarycheck/pageRefundSub', //退费提交
  pageReimbursePay: '/finance/salarycheck/pageReimbursePay', //报销支付
  pageReimburseSub: '/finance/salarycheck/pageReimburseSub', //报销提交
  pageServicePer: '/finance/salarycheck/pageServicePer', //客服业绩(重复)
  pageShopItem: '/finance/salarycheck/pageShopItem', //其他收入
  pageTeacheRepeat: '/finance/salarycheck/pageTeacheRepeat', //导师业绩(重复)
  pageTeacherPer: '/finance/salarycheck/pageTeacherPer', //导师业绩(唯一)
  pageTotalPer: '/finance/salarycheck/pageTotalPer', //总业绩
  pageTotalRefund: '/finance/salarycheck/pageTotalRefund', //分馆总退费
  totalReceipts: '/finance/salarycheck/totalReceipts', //总收款

  //顾问业绩
  listAdviserCheck: '/finance/advisercheck/listAdviserCheck', //顾问业绩验算
  pageAdviserInfo: '/finance/advisercheck/pageAdviserInfo', //顾问业绩验算表人数
  pageAdviserPerFormance: '/finance/advisercheck/pageAdviserPer', //顾问业绩
  adviserPageIntoPer: '/finance/advisercheck/pageIntoPer', //转入业绩
  adviserPageOutPer: '/finance/advisercheck/pageOutPer', //转出业绩
  listAch: '/finance/advisercheck/listAch', //销售业绩和负业绩

  //有效顾问业绩表
  listAdviserEfficient: '/finance/adviserefficient/listAdviserEfficient', //有效顾问业绩表
  pageAdviserPerSale: '/finance/adviserefficient/pageAdviserPer', //销售业绩
  pageRefundPer: '/finance/adviserefficient/pageRefundPer', //退费总业绩
  pageFullRefundInfo: '/finance/adviserefficient/pageFullRefundInfo', //顾问退费全额业绩
  pageHalfRefundInfo: '/finance/adviserefficient/pageHalfRefundInfo', //顾问退费减半业绩
  pageOutPer: '/finance/adviserefficient/pageOutPer', //转出业绩
  pageIntoPer: '/finance/adviserefficient/pageIntoPer', //转入业绩
  pageNoAdviserPer: '/finance/adviserefficient/pageNoAdviserPer', //转入业绩

  //导师业绩验算表
  listTeacherCheck: '/finance/teachercheck/listTeacherCheck', //导师业绩验算表
  pageTeachercheckInfo: '/finance/teachercheck/pageTeachercheckInfo',

  //导师课时统计
  pageTeachersalary: '/finance/teachersalary/pageTeachersalary', //导师课时统计
  pageSalaryInfo: '/finance/teachersalary/pageSalaryInfo', //导师课程统计详情

  //分馆排课课时统计表
  listClassSign: '/finance/classSign/listClassSign', //分馆排课课时统计表
  pageDancePlan: '/finance/classSign/pageDancePlan', //排课课时数
  pageTeacherSign: '/finance/classSign/pageTeacherSign', //导师签到课时数
  pageStuSign: '/finance/classSign/pageStuSign', //学员签到课时数
  pageEfficientSign: '/finance/classSign/pageEfficientSign', //有效课时数

  //经营费用流水统计表
  operatingExpenseFlowList: '/finance/spending/operatingExpenseFlowList', //经营费用流水统计表
  operatingExpenseFlowListDetails: '/finance/spending/operatingExpenseFlowListDetails', //经营费用流水统计表详情

  //财务费用流水统计
  financialExpenseFlowList: '/finance/spending/financialExpenseFlowList', //财务费用流水统计
  financialExpenseFlowListDetails: '/finance/spending/financialExpenseFlowListDetails', //财务费用流水统计详情

  //部门费用统计表调整前
  deptExpenseFlowList: '/finance/spending/deptExpenseFlowList', //财务费用流水统计
  deptExpenseFlowListDetails: '/finance/spending/deptExpenseFlowListDetails', //财务费用流水统计

  //资源分析表
  resourceAnalysisList: '/student/user/resourceAnalysisList',
  //经营归类分摊表
  operatingExpenseFlowStatisticsSplit: '/finspending/capitalDaily/operatingExpenseFlowStatisticsSplit', //经营归类
  operatingExpenseFlowStatisticsSplitByCostClassify: '/finspending/capitalDaily/operatingExpenseFlowStatisticsSplitByCostClassify', //费用归类
  operatingExpenseFlowStatisticsSplitDetails: '/finspending/capitalDaily/operatingExpenseFlowStatisticsSplitDetails', //项目名称

  //经营归类流水表
  operatingExpenseFlowStatistics: '/finspending/capitalDaily/operatingExpenseFlowStatistics', //经营归类
  operatingExpenseFlowStatisticsByCostClassify: '/finspending/capitalDaily/operatingExpenseFlowStatisticsByCostClassify', //费用归类
  operatingExpenseFlowStatisticsDetails: '/finspending/capitalDaily/operatingExpenseFlowStatisticsDetails', //项目名称

  //财务归类流水表
  financeExpenseFlowStatistics: '/finspendingFinance/capitalDaily/financeExpenseFlowStatistics', //财务归类
  financeExpenseFlowStatisticsByCostClassify: '/finspendingFinance/capitalDaily/financeExpenseFlowStatisticsByCostClassify', //费用归类
  financeExpenseFlowStatisticsDetails: '/finspendingFinance/capitalDaily/financeExpenseFlowStatisticsDetails', //项目名称

  //成本归类流水表
  costExpenseFlowStatistics: '/finspendingCost/capitalDaily/costExpenseFlowStatistics', //成本归类
  costExpenseFlowStatisticsByCostClassify: '/finspendingCost/capitalDaily/costExpenseFlowStatisticsByCostClassify', //费用归类
  costExpenseFlowStatisticsDetails: '/finspendingCost/capitalDaily/costExpenseFlowStatisticsDetails', //项目名称

  //财务归类分摊表
  financeExpenseFlowStatisticsSplit: '/finspendingFinance/capitalDaily/financeExpenseFlowStatisticsSplit', //成本归类
  financeExpenseFlowStatisticsSplitByCostClassify: '/finspendingFinance/capitalDaily/financeExpenseFlowStatisticsSplitByCostClassify', //费用归类
  financeExpenseFlowStatisticsSplitDetails: '/finspendingFinance/capitalDaily/financeExpenseFlowStatisticsSplitDetails', //项目名称

  //成本归类分摊表
  costExpenseFlowStatisticsSplit: '/finspendingCost/capitalDaily/costExpenseFlowStatisticsSplit', //成本归类
  costExpenseFlowStatisticsSplitByCostClassify: '/finspendingCost/capitalDaily/costExpenseFlowStatisticsSplitByCostClassify', //费用归类
  costExpenseFlowStatisticsSplitDetails: '/finspendingCost/capitalDaily/costExpenseFlowStatisticsSplitDetails', //项目名称

  getSysFeeItem: 'finspending/capitalDaily/getSysFeeItem', //获取项目名称
  listAllOrgDeptTreeNoSchoolId: '/organize/dept/listAllOrgDeptTreeNoSchoolId', //获取全部分馆

  //学员统计
  collectStudent: '/student/stat/collectStudent', //汇总
  detailStudent: '/student/stat/detailStudent', //汇总
  //卡种统计
  collectStudentCard: '/student/card/stat/collectStudentCard', //学员卡汇总
  detailStudentCard: '/student/card/stat/detailStudentCard', //学员卡汇总详情
  //收入统计
  stuIncomeStatistics: '/student/stat/stuIncomeStatistics', //收入统计汇总
  stuIncomeStatisticsDetails: '/student/stat/stuIncomeStatisticsDetails', //收入统计详情
  //退费统计
  refundStatistics: '/refund/statistics/pageRefundStatistics',
  refundStatisticsDetails: '/refund/statistics/pageCardRefund',
  //消耗余额表
  consumeBalance: '/student/card/consume/balance', //消耗余额汇总表
  beginBalance: '/student/card/consume/beginBalance', //期初消耗余额
  middleBalance: '/student/card/consume/middleBalance', //期中消耗余额
  consumeBalanceStat: '/student/card/consume/consumeBalanceStat', //期中消耗余额

  //业绩表
  firstLevelReport: '/finance/achievementReport/firstLevelReport',
  //业绩表明细
  secondLevelReport: 'finance/achievementReport/secondLevelReport',
  auditStat: '/refund/auditStat', //退费审核量统计    post
  procdefList: '/refund/procdefList', //单据类型    get
  pageClassStat:'/class/pageClassStat',

  //导师上课明细
  pageSignStat:'/class/pageSignStat',
  pageSignDetail:'/class/pageSignDetail',

  //教师使用统计
  roomUseShoolStat:'/class/roomUseShoolStat',//教室使用统计-分馆
  pageRoomUseStat:'/class/pageRoomUseStat',//教室使用统计-教室
  pageRoomUseTimeDetail:'/class/pageRoomUseTimeDetail'//教室使用统计-明细
}
export function expireContinuationCardDetails(params) {
  return axios({
    url: '/student/card/expireContinuationCardDetails',
    method: 'get',
    params: params
  })
}

export function getCoachNum(params) {
  return axios({
    url: '/education/coachplan/getCoachNum',
    method: 'get',
    params: params
  })
}
export function listCoachPlan(params) {
  return axios({
    url: '/education/coachplan/listCoachPlan',
    method: 'get',
    params: params
  })
}
export function updatePlanDate(params) {
  return axios({
    url:'/education/coachplan/updatePlanDate',
    method: 'get',
    params: params
  })
}
export function pageCoachPlan(params) {
  return axios({
    url: '/education/coachplan/pageCoachPlan',
    method: 'get',
    params: params
  })
}
export function expireContinuationCard(params) {
  return axios({
    url: '/student/card/expireContinuationCard',
    method: 'get',
    params: params
  })
}
export function getSecCost(params) {
  return axios({
    url: '/finance/salarycheck/secCost',
    method: 'get',
    params: params
  })
}
export function getFirstCost(params) {
  return axios({
    url: '/finance/salarycheck/firstCost',
    method: 'get',
    params: params
  })
}
export function privateEduVariousPlacesReportDetails(params) {
  return axios({
    url: '/privateEduVariousPlaces/reportDetails',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function onMonthlyManpowerReport(params) {
  return axios({
    url: '/education/signinlog/onMonthlyManpowerReport',  // api 替换
    method: 'post',
    data: QS.stringify(params)
  })
}
export function privateEduVariousPlacesReport(params) {
  return axios({
    url: '/privateEduVariousPlaces/report',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageRoomUseTimeDetail(params) {
  return axios({
    url: api.pageRoomUseTimeDetail,
    method: 'get',
    params: params
  })
}
export function pageRoomUseStat(params) {
  return axios({
    url: api.pageRoomUseStat,
    method: 'get',
    params: params
  })
}
export function roomUseShoolStat(params) {
  return axios({
    url: api.roomUseShoolStat,
    method: 'get',
    params: params
  })
}
export function pageSignStat(params) {
  return axios({
    url: api.pageSignStat,
    method: 'get',
    params: params
  })
}
export function pageSignDetail(params) {
  return axios({
    url: api.pageSignDetail,
    method: 'get',
    params: params
  })
}
export function pageClassStat(params) {
  return axios({
    url: api.pageClassStat,
    method: 'get',
    params: params
  })
}
//退费审核量统计
export function auditStat(params) {
  return axios({
    url: `${api.auditStat}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function procdefList(params) {
  return axios({
    url: api.procdefList,
    method: 'get',
    params: params
  })
}
//业绩表
export function secondLevelReport(params) {
  return axios({
    url: `${api.secondLevelReport}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function firstLevelReport(params) {
  return axios({
    url: `${api.firstLevelReport}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//消耗余额表
export function consumeBalanceStat(params) {
  return axios({
    url: `${api.consumeBalanceStat}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function middleBalance(params) {
  return axios({
    url: `${api.middleBalance}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function beginBalance(params) {
  return axios({
    url: `${api.beginBalance}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function consumeBalance(params) {
  return axios({
    url: `${api.consumeBalance}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//成本归类分摊表
export function costExpenseFlowStatisticsSplitDetails(params) {
  return axios({
    url: `${api.costExpenseFlowStatisticsSplitDetails}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function costExpenseFlowStatisticsSplitByCostClassify(params) {
  return axios({
    url: `${api.costExpenseFlowStatisticsSplitByCostClassify}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function costExpenseFlowStatisticsSplit(params) {
  return axios({
    url: `${api.costExpenseFlowStatisticsSplit}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//财务归类分摊表
export function financeExpenseFlowStatisticsSplitDetails(params) {
  return axios({
    url: `${api.financeExpenseFlowStatisticsSplitDetails}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function financeExpenseFlowStatisticsSplitByCostClassify(params) {
  return axios({
    url: `${api.financeExpenseFlowStatisticsSplitByCostClassify}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function financeExpenseFlowStatisticsSplit(params) {
  return axios({
    url: `${api.financeExpenseFlowStatisticsSplit}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//成本归类流水表
export function costExpenseFlowStatisticsDetails(params) {
  return axios({
    url: `${api.costExpenseFlowStatisticsDetails}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function costExpenseFlowStatisticsByCostClassify(params) {
  return axios({
    url: `${api.costExpenseFlowStatisticsByCostClassify}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function costExpenseFlowStatistics(params) {
  return axios({
    url: `${api.costExpenseFlowStatistics}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//财务归类流水表
export function financeExpenseFlowStatisticsDetails(params) {
  return axios({
    url: `${api.financeExpenseFlowStatisticsDetails}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function financeExpenseFlowStatisticsByCostClassify(params) {
  return axios({
    url: `${api.financeExpenseFlowStatisticsByCostClassify}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function financeExpenseFlowStatistics(params) {
  return axios({
    url: `${api.financeExpenseFlowStatistics}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//学员统计
export function detailStudent(params) {
  return axios({
    url: api.detailStudent,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function collectStudent(params) {
  return axios({
    url: api.collectStudent,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function collectStudentCard(params) {
  return axios({
    url: api.collectStudentCard,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function detailStudentCard(params) {
  return axios({
    url: api.detailStudentCard,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function stuIncomeStatistics(params) {
  return axios({
    url: api.stuIncomeStatistics,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function stuIncomeStatisticsDetails(params) {
  return axios({
    url: api.stuIncomeStatisticsDetails,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function listAllOrgDeptTreeNoSchoolId(params) {
  return axios({
    url: api.listAllOrgDeptTreeNoSchoolId,
    method: 'get',
    params: params
  })
}
//经营归流水表
export function operatingExpenseFlowStatisticsDetails(params) {
  return axios({
    url: `${api.operatingExpenseFlowStatisticsDetails}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function operatingExpenseFlowStatisticsByCostClassify(params) {
  return axios({
    url: `${api.operatingExpenseFlowStatisticsByCostClassify}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function operatingExpenseFlowStatistics(params) {
  return axios({
    url: `${api.operatingExpenseFlowStatistics}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//经营归类分摊表
export function getSysFeeItem(params) {
  return axios({
    url: api.getSysFeeItem,
    method: 'get',
    params: params
  })
}
export function operatingExpenseFlowStatisticsSplitDetails(params) {
  return axios({
    url: `${api.operatingExpenseFlowStatisticsSplitDetails}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function operatingExpenseFlowStatisticsSplitByCostClassify(params) {
  return axios({
    url: `${api.operatingExpenseFlowStatisticsSplitByCostClassify}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function operatingExpenseFlowStatisticsSplit(params) {
  return axios({
    url: `${api.operatingExpenseFlowStatisticsSplit}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//资源分析表
export function resourceAnalysisList(params) {
  return axios({
    url: `${api.resourceAnalysisList}`,
    method: 'post',
    params: params
  })
}
//部门费用统计表调整前
export function deptExpenseFlowListDetails(params) {
  return axios({
    url: `${api.deptExpenseFlowListDetails}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function deptExpenseFlowList(params) {
  return axios({
    url: `${api.deptExpenseFlowList}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//财务费用流水统计
export function financialExpenseFlowListDetails(params) {
  return axios({
    url: `${api.financialExpenseFlowListDetails}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function financialExpenseFlowList(params) {
  return axios({
    url: `${api.financialExpenseFlowList}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//经营费用流水统计表
export function operatingExpenseFlowListDetails(params) {
  return axios({
    url: `${api.operatingExpenseFlowListDetails}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function operatingExpenseFlowList(params) {
  return axios({
    url: `${api.operatingExpenseFlowList}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//分馆排课课时统计表
export function pageEfficientSign(params) {
  return axios({
    url: api.pageEfficientSign,
    method: 'get',
    params: params
  })
}
export function pageStuSign(params) {
  return axios({
    url: api.pageStuSign,
    method: 'get',
    params: params
  })
}
export function pageTeacherSign(params) {
  return axios({
    url: api.pageTeacherSign,
    method: 'get',
    params: params
  })
}
export function pageDancePlan(params) {
  return axios({
    url: api.pageDancePlan,
    method: 'get',
    params: params
  })
}
export function listClassSign(params) {
  return axios({
    url: api.listClassSign,
    method: 'get',
    params: params
  })
}

//导师课时统计
export function pageSalaryInfo(params) {
  return axios({
    url: api.pageSalaryInfo,
    method: 'get',
    params: params
  })
}
export function pageTeachersalary(params) {
  return axios({
    url: api.pageTeachersalary,
    method: 'get',
    params: params
  })
}
//导师业绩验算表
export function pageTeachercheckInfo(params) {
  return axios({
    url: api.pageTeachercheckInfo,
    method: 'get',
    params: params
  })
}
export function listTeacherCheck(params) {
  return axios({
    url: api.listTeacherCheck,
    method: 'get',
    params: params
  })
}
//有效顾问业绩表
export function pageNoAdviserPer(params) {
  return axios({
    url: api.pageNoAdviserPer,
    method: 'get',
    params: params
  })
}
export function pageIntoPer(params) {
  return axios({
    url: api.pageIntoPer,
    method: 'get',
    params: params
  })
}

export function pageOutPer(params) {
  return axios({
    url: api.pageOutPer,
    method: 'get',
    params: params
  })
}
export function pageHalfRefundInfo(params) {
  return axios({
    url: api.pageHalfRefundInfo,
    method: 'get',
    params: params
  })
}
export function pageFullRefundInfo(params) {
  return axios({
    url: api.pageFullRefundInfo,
    method: 'get',
    params: params
  })
}
export function pageRefundPer(params) {
  return axios({
    url: api.pageRefundPer,
    method: 'get',
    params: params
  })
}
export function pageAdviserPerSale(params) {
  return axios({
    url: api.pageAdviserPerSale,
    method: 'get',
    params: params
  })
}
export function listAdviserEfficient(params) {
  return axios({
    url: api.listAdviserEfficient,
    method: 'get',
    params: params
  })
}

//顾问业绩
export function adviserPageIntoPer(params) {
  return axios({
    url: api.adviserPageIntoPer,
    method: 'get',
    params: params
  })
}
export function adviserPageOutPer(params) {
  return axios({
    url: api.adviserPageOutPer,
    method: 'get',
    params: params
  })
}
export function listAch(params) {
  return axios({
    url: api.listAch,
    method: 'get',
    params: params
  })
}
export function pageAdviserPerFormance(params) {
  return axios({
    url: api.pageAdviserPerFormance,
    method: 'get',
    params: params
  })
}
export function pageAdviserInfo(params) {
  return axios({
    url: api.pageAdviserInfo,
    method: 'get',
    params: params
  })
}
export function listAdviserCheck(params) {
  return axios({
    url: api.listAdviserCheck,
    method: 'get',
    params: params
  })
}
//部门财报
export function totalReceipts(params) {
  return axios({
    url: api.totalReceipts,
    method: 'get',
    params: params
  })
}
export function pageTotalRefund(params) {
  return axios({
    url: api.pageTotalRefund,
    method: 'get',
    params: params
  })
}
export function pageTotalPer(params) {
  return axios({
    url: api.pageTotalPer,
    method: 'get',
    params: params
  })
}
export function pageTeacherPer(params) {
  return axios({
    url: api.pageTeacherPer,
    method: 'get',
    params: params
  })
}
export function pageTeacheRepeat(params) {
  return axios({
    url: api.pageTeacheRepeat,
    method: 'get',
    params: params
  })
}

export function pageServicePer(params) {
  return axios({
    url: api.pageServicePer,
    method: 'get',
    params: params
  })
}
export function listDeptFinReport(params) {
  return axios({
    url: api.listDeptFinReport,
    method: 'get',
    params: params
  })
}
export function pageAdviserPer(params) {
  return axios({
    url: api.pageAdviserPer,
    method: 'get',
    params: params
  })
}
// export function pageCost(params) {
//   return axios({
//     url: api.pageCost,
//     method: 'get',
//     params: params
//   })
// }
export function pageFinInfo(params) {
  return axios({
    url: api.pageFinInfo,
    method: 'get',
    params: params
  })
}
export function pageRefundPay(params) {
  return axios({
    url: api.pageRefundPay,
    method: 'get',
    params: params
  })
}
export function pageRefundSub(params) {
  return axios({
    url: api.pageRefundSub,
    method: 'get',
    params: params
  })
}
export function pageReimbursePay(params) {
  return axios({
    url: api.pageReimbursePay,
    method: 'get',
    params: params
  })
}
export function pageReimburseSub(params) {
  return axios({
    url: api.pageReimburseSub,
    method: 'get',
    params: params
  })
}
export function refundStatistics(params) {
  return axios({
    url: api.refundStatistics,
    method: 'get',
    params: params
  })
}
export function refundStatisticsDetails(params) {
  return axios({
    url: api.refundStatisticsDetails,
    method: 'get',
    params: params
  })
}
//顾问业绩唯一一级详情
export function listOnlyAdviserPer(params) {
  return axios({
    url: `/finance/salarycheck/listOnlyAdviserPer`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//顾问业绩唯一二级详情
export function listOnlyAdviserPerInfo(params) {
  return axios({
    url: `/finance/salarycheck/listOnlyAdviserPerInfo`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//导师业绩唯一一级详情
export function listOnlyTeacherPer(params) {
  return axios({
    url: `/finance/salarycheck/listOnlyTeacherPer`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//导师业绩唯一二级详情
export function listOnlyTeacherPerInfo(params) {
  return axios({
    url: `/finance/salarycheck/listOnlyTeacherPerInfo`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//总业绩唯一一级详情
export function listTotalPer(params) {
  return axios({
    url: `/finance/salarycheck/listTotalPer`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//客服业绩重复一级详情
export function listServicePer(params) {
  return axios({
    url: `/finance/salarycheck/listServicePer`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//客服业绩重复二级详情
export function listServicePerInfo(params) {
  return axios({
    url: `/finance/salarycheck/listServicePerInfo`,
    method: 'post',
    data: QS.stringify(params)
  })
}

//导师业绩重复一级详情
export function listRepeatTeacherPer(params) {
  return axios({
    url: `/finance/salarycheck/listRepeatTeacherPer`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//导师业绩重复二级详情
export function listRepeatTeacherPerInfo(params) {
  return axios({
    url: `/finance/salarycheck/listRepeatTeacherPerInfo`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//其他收入一级详情
export function listShopItem(params) {
  return axios({
    url: `/finance/salarycheck/listShopItem`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//其他收入二级详情
export function pageShopItem(params) {
  return axios({
    url: api.pageShopItem,
    method: 'post',
    data: QS.stringify(params)
  })
}
//成本费用一级详情
export function listCost(params) {
  return axios({
    url: `/finance/salarycheck/listCost`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//成本费用二级详情
export function pageCost(params) {
  return axios({
    url: `/finance/salarycheck/pageCost`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//分馆总退费一级详情
export function listRefund(params) {
  return axios({
    url: `/finance/salarycheck/listRefund`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//分馆总退费二级详情
export function listRefundInfo(params) {
  return axios({
    url: `/finance/salarycheck/listRefundInfo`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//退费提交一级详情
export function listSubmitRefund(params) {
  return axios({
    url: `/finance/salarycheck/listSubmitRefund`,
    method: 'post',
    data: QS.stringify(params)
  })
}
//退费提交二级详情
export function listSubmitRefundInfo(params) {
  return axios({
    url: `/finance/salarycheck/listSubmitRefundInfo`,
    method: 'post',
    data: QS.stringify(params)
  })
}
