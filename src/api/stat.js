import { axios } from '@/utils/request'
import QS from 'qs'

// 私教签到异常统计表
export const getPersonalSignInList = params => axios.get(`/education/personalSignAbnormal/pageSignPersonalAbnormal`, { params })
// 导出私教签到异常统计表
export const exportPersonalSignIn = params => axios.post(`/education/personalSignAbnormal/signPersonalAbnormalExcel`, QS.stringify(params), {responseType: 'blob'})
// 资产负债表 地区分馆
export const getBalanceByBranch = params => axios.post(`/finance/liabilities/listIncome`, QS.stringify(params))
// 资产负债表 舞种班型
export const getBalanceByDance = params => axios.post(`/finance/liabilities/typeAndDanceListIncome`, QS.stringify(params))
