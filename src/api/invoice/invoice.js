import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  saveInvoice: '/finance/invoice/saveInvoice', //保存开票设置
  pageInvoice: '/finance/invoice/pageInvoice', //开票表格
  listStuInvoice: '/finance/invoice/listStuInvoice', //开票列表
  removeInvoice: '/finance/invoice/removeInvoice', //开票信息删除
  approveInvoice: '/finance/invoice/approveInvoice', //审核开票
  getInvoiceAttachments: '/finance/invoice/getInvoiceAttachments', //附件详情
  pageInvoiceCancel: '/finance/invoiceCancel/pageInvoiceCancel', //作废开票列表
  saveInvoiceCancel: '/finance/invoiceCancel/saveInvoiceCancel', //作废开票新增修改
  removeInvoiceCancel: '/finance/invoiceCancel/removeInvoiceCancel', //作废开票列表删除
  cancelInvoice: '/finance/invoiceCancel/cancelInvoice', // 作废
  getInvoiceDetail: '/finance/invoice/getInvoiceDetail', // 确认发票
  listStuInvoiceLog: '/finance/invoice/listStuInvoiceLog', //查看学员发票记录
  confirmCancel: '/finance/invoiceCancel/confirmCancel', //确定作废
  getFinanceInvoice: '/finance/invoice/getFinanceInvoice', //弹窗开票列表
  saveFinInvoice: '/finance/invoice/saveFinInvoice' //保存发票

  // pageStudentInvoice: '/student/common/pageStudentInvoice', //挑选学院
}

export function saveInvoice(params) {
  return axios({
    url: api.saveInvoice,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageInvoice(parameter) {
  return axios({
    url: api.pageInvoice,
    params: parameter,
    method: 'get'
  })
}

///finance/invoice/listStuInvoice/{stuId}
export function listStuInvoice(parameter) {
  return axios({
    url: `${api.listStuInvoice}/${parameter}`,
    method: 'get'
  })
}

// 删除
export function removeInvoice(finInvoiceId) {
  return axios({
    url: `${api.removeInvoice}/${finInvoiceId}`,
    method: 'delete'
  })
}
// 删除

export function approveInvoice(params) {
  return axios({
    url: api.approveInvoice,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getInvoiceAttachments(params) {
  return axios({
    url: api.getInvoiceAttachments,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageInvoiceCancel(parameter) {
  return axios({
    url: api.pageInvoiceCancel,
    params: parameter,
    method: 'get'
  })
}

export function saveInvoiceCancel(params) {
  return axios({
    url: api.saveInvoiceCancel,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeInvoiceCancel(finInvoiceId) {
  return axios({
    url: `${api.removeInvoiceCancel}/${finInvoiceId}`,
    method: 'delete'
  })
}

export function cancelInvoice(params) {
  return axios({
    url: api.cancelInvoice,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getInvoiceDetail(params, parameter) {
  return axios({
    url: api.getInvoiceDetail,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listStuInvoiceLog(parameter) {
  return axios({
    url: `${api.listStuInvoiceLog}/${parameter}`,
    method: 'get'
  })
}

export function confirmCancel(parameter) {
  return axios({
    url: `${api.confirmCancel}/${parameter}`,
    method: 'post'
  })
}
export function saveFinInvoice(params) {
  return axios({
    url: `${api.saveFinInvoice}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getFinanceInvoice(id, parameter) {
  return axios({
    url: `${api.getFinanceInvoice}/${id}`,
    method: 'get',
    params: parameter
  })
}

// 新增开票回显详情
export const getSaveStuInvoice = params => axios.post('/finance/invoice/getSaveStuInvoice', {}, { params })
// 保存开票(新)
export const saveInvoiceNew = params => axios.post('/finance/invoice/saveInvoice', params)
// 发票列表
export const getInvoiceList = params => axios.post('/finance/invoice/pageInvoices', null, { params })
// 暂不开票
export const invoiceCheckStatus = params => axios.post('/finance/invoice/checkStatus', null, { params })
// 批量上传发票
export const uploadInvoices = params => axios.post('/finance/invoice/upInvoices', params, { ignoreSchoolId: true })

// 撤销发票
export const revokeInvoice = params => axios.post('/finance/invoice/revokeInvoice', null, { params })
// 删除发票
export const deleteInvoices = params => axios.post('/finance/invoice/removeInvoices', null, { params })

// 批量导出发票
export const exportInvoices = params => axios.post('/finance/invoice/down', null, { params, responseType: 'blob' })

// 上传发票（回显信息）
export const uploadGetInvoiceInfo = params => axios.post('/finance/invoice/getInvoiceInfo', null, { params })

// 单独上传发票
export const uploadOneInvoice = params => axios.post('/finance/invoice/upOneInvoice', params)

// 撤销修改的回显信息
export const getUpdateStuInvoice = params => axios.post('/finance/invoice/getUpdateStuInvoice', null, { params })

// 获取发票附件
export const getInvoiceAttachment = params => axios.post('/finance/invoice/getInvoiceAttachments', null, { params })

// 上传反馈
export const uploadInvoiceFeedback = params => axios.post('/finance/invoice/feedback', null, { params })

// 作废发票
export const discardInvoice = params => axios.post('/finance/invoice/discardedInvoice', null, { params })

// 批量下载发票zip
export const downloadZipInvoices = params => axios.post('/finance/invoice/downZip', null, { params, responseType: 'blob' })

// 查询公司下拉
export const getCompanyList = params => axios.post('/finance/invoice/pageFinCompany', null, { params })
