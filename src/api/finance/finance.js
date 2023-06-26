import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  getList: '/education/card/pageEduCard', //总部卡列表
  updateFinance: '/finance/info/updateFinance', //总部卡列表

  pageIncome: '/finance/info/pageIncome', // 获取收入明细列表
  pageExpend: '/finance/info/pageExpend', // 获取支出明细列表
  detail: '/finance/info/detail', //查看收支详情

  publicConfirm: '/finance/info/public/confirm', //确认收入(确认人确认)
  bathConfirm: '/finance/info/public/bathConfirm', //批量确认

  privateConfirm: '/finance/info/private/confirm', //确认收入(审核人确认)
  batchPrivateConfirm: '/finance/info/private/batchConfirm', //确认收入(审核人确认)

  privateSummary: '/finance/info/privateSummary', //收入

  listPublicApprove: '/finance/info/public/listPublicApprove', //对公汇总核对
  publicApproveConfirm: '/finance/info/public/publicApproveConfirm', //对公汇总核对（确认）
  publicApproveCancel: '/finance/info/public/publicApproveCancel', //对公汇总核对（取消）
  PublicApproveDetail: '/finance/info/public/PublicApproveDetail', //对公汇总核对（确认）

  listPublicApproveDetail: '/finance/info/public/listPublicApproveDetail', //对公汇总核对（详情列表收入明细）
  listPublicApproveDetail2: '/finance/info/public/listPublicApproveDetail2', //对公汇总核对（详情列表店面收入）
  publicApproveSingleConfirm: '/finance/info/public/publicApproveSingleConfirm', //对公汇总核对（详情列表收入明细）
  publicApproveSingCancel: '/finance/info/public/publicApproveSingCancel', //对公汇总核对（详情列表收入明细）
  publicApproveSingleConfirmShop: '/finance/info/public/publicApproveSingleConfirm/shop', //对公汇总核对（详情列表店面收入）确认
  publicApproveSingCancelShop: '/finance/info/public/publicApproveSingCancel/shopitem ', //对公汇总核对（详情列表店面收入）取消

  removeDetailed: '/finance/info/remove', ///finance/info/remove/{id}    删除<finance:info:del>

  pageAchievement: '/finance/achievement/pageAchievement', // 业绩统计
  changeAchievement: '/finance/info/changeAchievement', //修改业绩归属

  pageFinShop: '/finance/shop/pageFinShop', //分页查询店面收入列表<finance:shop:view>
  saveFinShop: '/finance/shop/saveFinShop', //添加店面收入<finance:shop:save>
  removeFinShop: '/finance/shop/removeFinShop', //删除店面收入<finance:shop:del>
  changeFinance: '/finance/info/changeFinance', //修改支付方式
  changeFinanceDesk: '/finance/info/changeFinanceDesk',
  updateAttachment: '/finance/info/updateAttachment',
  refundDetail: '/finance/info/refundDetail', //查看退款详情
  saveRefundAttachment: '/finance/info/saveRefundAttachment', //退款提交
  listSalConfig: '/finance/config/listSalConfig', //职位下拉
  saveSalConfig: '/finance/config/saveSalConfig', //工资配置保存，
  pageSalConfig: '/finance/config/pageSalConfig', //工资配置列表，
  removeSalConfig: '/finance/config/removeSalConfig', //工资配置列表删除
  updateFinDate: '/finance/info/public/updateFinDate', //批量修改确认时间
  saveFinShopToBankDetail: '/finance/shop/saveFinShopToBankDetail', //店面收入 确认/取消确认

  /* 分馆/公司配置 */
  pageFinCompany: '/finance/company/pageFinCompany', //分页查询公司
  finCompanyInfo: '/finance/company/finCompanyInfo', //公司详情
  addFinCompany: '/finance/company/addFinCompany', //添加财务公司信息
  updateFinCompany: '/finance/company/updateFinCompany', //修改财务公司信息
  deleteFinCompany: '/finance/company/deleteFinCompany', //删除财务公司信息
  listFinCompany: '/finance/company/listFinCompany', //通过分馆查询公司

  pageEmployeeRecord: '/finance/employeeRecord/pageEmployeeRecord', //员工数据录入列表
  updateEmployeeRecord: '/finance/employeeRecord/updateEmployeeRecord', //员工数据录入修改

  pageFinTarget: '/finance/target/pageFinTarget', //分馆目标管理-分页查询
  saveFinTarget: '/finance/target/saveFinTarget', //分馆目标管理-保存
  removeFinTarget: '/finance/target/removeFinTarget', //分馆目标管理-删除
  updateFinTarget: '/finance/target/updateFinTarget', //分馆目标管理-修改

  statFirstData: '/finance/target/statFirstData', //分馆经营报表查询
  statSecondData: '/finance/target/statSecondData' ,//分馆经营报表查询
  schoolOperationData:'/finance/target/schoolOperationData', //分馆经营报表
  areaOperationData:'/finance/target/areaOperationData ', //地区经营报表
  saveClassPlan:'/finance/classPlan/save',//开班计划录入
  classPlanPage:'/finance/classPlan/page',//开班录入列表
  classPlanDelete:'/finance/classPlan/del',//开班录入删除
  classPlanDetail:'/finance/classPlan/detail',
  classPlanUpdate:'/finance/classPlan/update',
  pageAdviserData:'/finance/adviserData/pageAdviserData',//顾问业绩数据表
  storeAdviserRanking:'/storeAdviserRanking/report'//店面业绩排名报表
}
export function saveOrUpdate(params) {
  return axios({
    headers: { 'Content-Type': 'Application/json' },
    url: '/personalDevelopmentNumber/saveOrUpdate',
    method: 'post',
    data: params
  })
}
export function removeFinPersonalDevelopmentNumber(id) {
  return axios({
    url: `/personalDevelopmentNumber/removeFinPersonalDevelopmentNumber/${id}`,
    method: 'delete'
  })
}
export function listFinPersonalDevelopmentNumber(params) {
  return axios({
    url: '/personalDevelopmentNumber/listFinPersonalDevelopmentNumber',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function totalRenewPriceDetail(params) {
  return axios({
    url: '/finance/target/totalRenewPriceDetail',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function totalReturnPriceDetail(params) {
  return axios({
    url: '/finance/target/totalReturnPriceDetail',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function danceRenewalData(params) {
  return axios({
    url: '/finance/target/danceRenewalData',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function storeAdviserRanking(params) {
  return axios({
    url: api.storeAdviserRanking,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageAdviserData(params) {
  return axios({
    url: api.pageAdviserData,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageChannelData(params) {
  return axios({
    url: '/finance/adviserData/pageChannelData',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageEduTypeData(params) {
  return axios({
    url: '/finance/adviserData/pageEduTypeData',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageMemberData(params) {
  return axios({
    url: '/finance/adviserData/pageMemberData',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageResourcesData(params) {
  return axios({
    url: '/finance/adviserData/pageResourcesData',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function classPlanUpdate(params) {
  return axios({
    url: api.classPlanUpdate,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function classPlanDetail(id) {
  return axios({
    url: api.classPlanDetail+'/'+id,
    method: 'get',
  })
}
export function classPlanDelete(id) {
  return axios({
    url: api.classPlanDelete+'/'+id,
    method: 'get',
  })
}
export function classPlanPage(params) {
  return axios({
    url: api.classPlanPage,
    method: 'get',
    params
  })
}
export function saveClassPlan(params) {
  return axios({
    url: api.saveClassPlan,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function onNotIncludedOnlineCourse(params) {
  return axios({
    url:'/finance/target/onNotIncludedOnlineCourse',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function onOnlineCourse(params) {
  return axios({
    url:'/finance/target/onOnlineCourse',
    method: 'post',
    data: QS.stringify(params)
  })
}
export function schoolOperationData(params) {
  return axios({
    url: api.schoolOperationData,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function areaOperationData(params) {
  return axios({
    url: api.areaOperationData,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function statSecondData(params) {
  return axios({
    url: api.statSecondData,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function statFirstData(params) {
  return axios({
    url: api.statFirstData,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function pageEmployeeRecord(params) {
  return axios({
    url: api.pageEmployeeRecord,
    method: 'get',
    params
  })
}
export function updateEmployeeRecord(params) {
  return axios({
    url: api.updateEmployeeRecord,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateFinDate(params) {
  return axios({
    url: api.updateFinDate,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveFinShopToBankDetail(params) {
  return axios({
    url: api.saveFinShopToBankDetail,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveRefundAttachment(params) {
  return axios({
    url: api.saveRefundAttachment,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateFinance(params) {
  return axios({
    url: api.updateFinance,
    method: 'post',
    data: QS.stringify(params)
  })
}

//授权分馆
export function pageAchievement(params) {
  return axios({
    url: api.pageAchievement,
    method: 'post',
    params: params
  })
}
export function updateAttachment(params) {
  return axios({
    url: api.updateAttachment,
    method: 'post',
    params: params
  })
}

// 获得分馆
export function pageIncome(params) {
  return axios({
    url: api.pageIncome,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageExpend(params) {
  return axios({
    url: api.pageExpend,
    method: 'post',
    data: QS.stringify(params)
  })
}

// 提交
export function privateConfirm(params) {
  return axios({
    url: api.privateConfirm,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function publicConfirm(params) {
  return axios({
    url: api.publicConfirm,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function bathConfirm(params) {
  return axios({
    url: api.bathConfirm,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function batchPrivateConfirm(params) {
  return axios({
    url: api.batchPrivateConfirm,
    method: 'post',
    data: QS.stringify(params)
  })
}

// 保存
export function save(params) {
  return axios({
    url: api.save,
    method: 'post',
    data: params
  })
}

// 详情
export function detail(id) {
  return axios({
    url: `${api.detail}/${id}`,
    method: 'get'
  })
}

// 详情
export function refundDetail(id) {
  return axios({
    url: `${api.refundDetail}/${id}`,
    method: 'get'
  })
}

// 修改业绩归属
export function changeAchievement(id, params) {
  return axios({
    url: `${api.changeAchievement}/${id}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function privateSummary(params) {
  return axios({
    url: api.privateSummary,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listPublicApprove(params) {
  return axios({
    url: api.listPublicApprove,
    method: 'get',
    params
  })
}
export function PublicApproveDetail(params) {
  return axios({
    url: api.PublicApproveDetail,
    method: 'get',
    params
  })
}
export function publicApproveConfirm(params) {
  return axios({
    url: api.publicApproveConfirm,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function publicApproveCancel(params) {
  return axios({
    url: api.publicApproveCancel,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listPublicApproveDetail(params) {
  return axios({
    url: api.listPublicApproveDetail,
    method: 'get',
    params
  })
}
export function listPublicApproveDetail2(params) {
  return axios({
    url: api.listPublicApproveDetail2,
    method: 'get',
    params
  })
}

export function publicApproveSingleConfirm(params) {
  return axios({
    url: api.publicApproveSingleConfirm,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function publicApproveSingCancel(params) {
  return axios({
    url: api.publicApproveSingCancel,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function publicApproveSingleConfirmShop(params) {
  return axios({
    url: api.publicApproveSingleConfirmShop,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function publicApproveSingCancelShop(params) {
  return axios({
    url: api.publicApproveSingCancelShop,
    method: 'post',
    data: QS.stringify(params)
  })
}
// 删除
export function removeDetailed(id) {
  return axios({
    url: `${api.removeDetailed}/${id}`,
    method: 'delete'
  })
}

export function pageFinShop(params) {
  return axios({
    url: api.pageFinShop,
    method: 'get',
    params: params
  })
}

// save
export function saveFinShop(params) {
  return axios({
    url: api.saveFinShop,
    method: 'post',
    data: QS.stringify(params)
  })
}

// 删除
export function removeFinShop(id) {
  return axios({
    url: `${api.removeFinShop}/${id}`,
    method: 'delete'
  })
}

// save
export function changeFinance(params) {
  return axios({
    url: api.changeFinance,
    method: 'post',
    data: QS.stringify(params)
  })
}

// save
export function changeFinanceDesk(params) {
  return axios({
    url: api.changeFinanceDesk,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listSalConfig(params) {
  return axios({
    url: api.listSalConfig,
    method: 'get',
    params: params
  })
}
export function saveSalConfig(params) {
  return axios({
    url: api.saveSalConfig,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageSalConfig(params) {
  return axios({
    url: api.pageSalConfig,
    method: 'get',
    params: params
  })
}
export function removeSalConfig(params) {
  return axios({
    url: `${api.removeSalConfig}`,
    method: 'delete',
    params: params
  })
}

export function pageFinCompany(params) {
  return axios({
    url: api.pageFinCompany,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function finCompanyInfo(params) {
  return axios({
    url: api.finCompanyInfo,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function addFinCompany(params) {
  return axios({
    url: api.addFinCompany,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateFinCompany(params) {
  return axios({
    url: api.updateFinCompany,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function deleteFinCompany(params) {
  return axios({
    url: api.deleteFinCompany,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function listFinCompany(params) {
  return axios({
    url: api.listFinCompany,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageFinTarget(params) {
  return axios({
    url: api.pageFinTarget,
    method: 'get',
    params: params
  })
}

export function saveFinTarget(params) {
  return axios({
    url: api.saveFinTarget,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeFinTarget(id) {
  return axios({
    url: `${api.removeFinTarget}/${id}`,
    method: 'delete'
  })
}

export function updateFinTarget(params) {
  return axios({
    url: api.updateFinTarget,
    method: 'post',
    data: QS.stringify(params)
  })
}
