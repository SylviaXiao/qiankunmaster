import { echartAxios, axios } from '@/utils/request'
import QS from 'qs'
const api = {
  analysisChannel: '/erp/analysis-channel/analysisChannel', //公司渠道数据
  findAllModule: '/erp/analysis-channel/findAllModule', //查询所有
  analysisColourPieStat: '/erp/analysis-channel/analysisColourPieStat', //引流颜色数据图表（饼图
  analysisColourChartStat: '/erp/analysis-channel/analysisColourChartStat', //引流颜色数据图表（折线图）
  analysisColourStat: '/erp/analysis-channel/analysisColourStat', //引流颜色数据明细
  analysisChannelStat: '/erp/analysis-channel/analysisChannelStat', //公司渠道数据（折线图）
  analysisChannelDetail: '/erp/analysis-channel/analysisChannelDetail', //公司渠道数据明细
  analysisNetworkTarget: '/erp/analysis-channel/analysisNetworkTarget', //资源目标数饼图
  analysisNetworkTargetPrice: '/erp/analysis-channel/analysisNetworkTargetPrice', //资源目标金额饼图
  analysisTarget: '/erp/analysis-channel/analysisTarget', //引流目标数图表（饼图）
  analysisTargetDept: '/erp/analysis-channel/analysisTargetDept', //引流目标数小组情况图表（柱状图）
  analysisNetworkTargetDept: '/erp/analysis-channel/analysisNetworkTargetDept', //资源目标数小组情况图表（柱状图）
  analysisNetworkTargetPriceDept: '/erp/analysis-channel/analysisNetworkTargetPriceDept', //资源目标金额小组情况图表(柱状图)
  analysisResourceDetail: '/erp/analysis-channel/analysisResourceDetail', //渠道数据明细详情
  findAllModuleByDept: '/erp/analysis-channel/findAllModuleByDept', //部门分组查询所有
  businessReport: '/analysis/business/drainingResourcesAnalysisReport', //引流资源报名转化趋势报表
  cleanAnalysis: '/analysis/business/cleanAnalysis', //  净引流数
  anaSource: '/analysis/business/anaSource', //资源数
  servicePercent: '/analysis/business/servicePercent', //客服转化率
  applyAmount: '/analysis/business/applyAmount', //报名金额
  applyPercent: '/analysis/business/applyPercent', //报名率
  enrollmentRate: '/analysis/business/enrollmentRate', //总报名率、当期报名率（isPreviousPeriod = Y: 当期）
  customerUnitPrice: '/analysis/business/customerUnitPrice', //客单价
  resourceValue: '/analysis/business/resourceValue', //资源价值
  analysisValue: '/analysis/business/analysisValue' //引流价值
}
export function analysisValue(params) {
  return axios({
    url: api.analysisValue,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function resourceValue(params) {
  return axios({
    url: api.resourceValue,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function customerUnitPrice(params) {
  return axios({
    url: api.customerUnitPrice,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function applyPercent(params) {
  return axios({
    url: api.applyPercent,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function enrollmentRate(params) {
  return axios({
    url: api.enrollmentRate,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function applyAmount(params) {
  return axios({
    url: api.applyAmount,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function servicePercent(params) {
  return axios({
    url: api.servicePercent,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function anaSource(params) {
  return axios({
    url: api.anaSource,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function cleanAnalysis(params) {
  return axios({
    url: api.cleanAnalysis,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function businessReport(params) {
  return axios({
    url: api.businessReport,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function analysisChannel(params) {
  return echartAxios({
    url: api.analysisChannel,
    method: 'post',
    data: params
  })
}
export function AnalysisfindAllModule(params) {
  return echartAxios({
    url: api.findAllModule,
    method: 'post',
    data: params
  })
}
export function analysisColourPieStat(params) {
  return echartAxios({
    url: api.analysisColourPieStat,
    method: 'post',
    data: params
  })
}
export function analysisColourChartStat(params) {
  return echartAxios({
    url: api.analysisColourChartStat,
    method: 'post',
    data: params
  })
}
export function analysisColourStat(params) {
  return echartAxios({
    url: api.analysisColourStat,
    method: 'post',
    data: params
  })
}
export function analysisChannelStat(params) {
  return echartAxios({
    url: api.analysisChannelStat,
    method: 'post',
    data: params
  })
}
export function analysisChannelDetail(params) {
  return echartAxios({
    url: api.analysisChannelDetail,
    method: 'post',
    data: params
  })
}
export function analysisNetworkTarget(params) {
  return echartAxios({
    url: api.analysisNetworkTarget,
    method: 'post',
    data: params
  })
}
export function analysisNetworkTargetPrice(params) {
  return echartAxios({
    url: api.analysisNetworkTargetPrice,
    method: 'post',
    data: params
  })
}
export function analysisTarget(params) {
  return echartAxios({
    url: api.analysisTarget,
    method: 'post',
    data: params
  })
}
export function analysisTargetDept(params) {
  return echartAxios({
    url: api.analysisTargetDept,
    method: 'post',
    data: params
  })
}
export function analysisNetworkTargetDept(params) {
  return echartAxios({
    url: api.analysisNetworkTargetDept,
    method: 'post',
    data: params
  })
}
export function analysisNetworkTargetPriceDept(params) {
  return echartAxios({
    url: api.analysisNetworkTargetPriceDept,
    method: 'post',
    data: params
  })
}
export function analysisResourceDetail(params) {
  return echartAxios({
    url: api.analysisResourceDetail,
    method: 'post',
    data: params
  })
}
export function findAllModuleByDept(params) {
  return echartAxios({
    url: api.findAllModuleByDept,
    method: 'post',
    data: params
  })
}

// 客服引流资源报名转化表
export const getServiceResourceConversionReport = params => axios.post(`/analysis/custDrainage/custDrainageReport`, QS.stringify(params))
//  ~~~~导出
export const exportServiceResourceConversionReport = params =>
  axios.post('/analysis/custDrainage/custDrainageReportByExport', QS.stringify(params), { responseType: 'blob' })

// 客服引流资源报名对比表
export const getServiceResourceContrastReport = params => axios.post('/analysis/custDrainage/custContrastReport', QS.stringify(params))
// ~~~~导出
export const exportServiceResourceContrastReport = params =>
  axios.post('/analysis/custDrainage/custContrastReportByExport', QS.stringify(params), { responseType: 'blob' })

// 渠道资源报名转化表
export const resourcesEnrollConversion  = params => axios.post('/analysis/channelConversion/resourcesEnrollConversion', QS.stringify(params))

// 渠道资源报名转化折线表
export const resourcesEnrollConversionReport  = params => axios.post('/analysis/channelConversion/resourcesEnrollConversionReport', QS.stringify(params))

// 渠道定金转化周期表
export const channelDepositConversion = params => axios.post('/analysis/channelConversion/depositConversion', QS.stringify(params))  

// 渠道定金转化周期表明细 
export const channelDepositConversionDetail = params => axios.post('/analysis/channelConversion/depositConversionDetails', QS.stringify(params))  

// 引流资源报名转化趋势报表（明细）
export const businessReportDetail = params => axios.post('analysis/business/drainingResourcesAnalysisTreeReport', QS.stringify(params))

// 引流资源报名转化趋势报表（明细）导出
export const exportbusinessReportDetail = params => axios.post('analysis/business/drainingResourcesAnalysisTreeReportByExport', QS.stringify(params), { responseType: 'blob' })

export default api
