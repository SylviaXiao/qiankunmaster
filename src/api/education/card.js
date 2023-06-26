import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  getList: '/education/common/pageEduCard', //总部卡列表
  getTitleList: 'education/common/getTitleList', //邀请码作废标题
  pageOnLineCard: '/education/common/pageOnLineCard', //线上卡列表
  pageOnLineExperience: '/education/common/pageOnLineExperience', //线上卡列表
  edit: '/education/card/getEduCardById', //编辑
  delById: '/education/card/removeEduCard', //删除
  isOpen: '/education/card/enableEduCard', //是否启用
  save: '/education/card/saveEduCard', //保存
  getSchoolList: '/education/common/listOrgDept', //获得校区卡
  listOrgDeptByUser: '/education/common/listOrgDeptByUser', //获得校区根据当前登录人

  cardTypeList: '/education/common/listEduClassType', //卡种类型列表
  danceList: '/education/common/listEduDance', //舞蹈列表
  classList: '/education/common/listEduClass', //班级列表
  roomList: '/education/common/listEduRoom', //教室列表

  saveEduDeptCard: '/education/card/grantEduDeptCard', //授权分馆
  listEduDeptCardById: '/education/card/listEduDeptById', //授权分馆详情
  getStuUserClassUrl: '/education/class-url/getStuUserClassUrl', //上课码表格
  listStuCardNoClass: '/student/common/listStuCardNoClass', //续卡卡种下拉

  listOrgDept: '/system/common/listOrgDept', //选择校区
  listSecondDept: '/organize/dept/listSecondDept', //选择校区
  listThirdDept: '/organize/dept/listThirdDept', //选择校区
  pageListBank: '/system/bank/pageListBank', //银行列表
  saveBank: '/system/bank/saveBank', //银行新增
  removeBank: '/system/bank/removeBank', //银行删除
  changeBank: '/system/bank/changeBank', //银行修改
  feenameList: '/system/feename/pageFeeName', //费用名称列表
  saveFeeName: '/system/feename/saveFeeName', //费用名称新增
  feenameRemove: '/system/feename/removeBank', //费用名称删除
  changeFeeName: '/system/feename/changeFeeName', //费用名称修改
  changeFeeNameState: '/system/feename/changeFeeNameState', //费用名称状态修改
  pageListIncomeItem: '/system/incomeitem/pageListIncomeItem', //收支项列表
  saveIncomeItem: '/system/incomeitem/saveIncomeItem', //收支项新增
  removeIncomeItem: '/system/incomeitem/removeIncomeItem', //收支项删除
  changeIncomeItem: '/system/incomeitem/changeIncomeItem', //收支项修改
  pageFeeItem: '/system/feeitem/pageFeeItem', //费用类型列表
  saveFeeItem: '/system/feeitem/saveFeeItem', //费用类型新增
  removeFeeItem: '/system/feeitem/removeFeeItem', //费用类型删除
  changeFeeItem: '/system/feeitem/changeFeeItem', //费用类型修改
  changeFeeItemState: '/system/feeitem/changeFeeItemState', //费用类型状态修改
  listFeeName: '/system/common/listFeeName', //费用名称下拉
  listBank: '/system/common/listBank', //银行列表下拉
  listBankByDeptId: '/system/common/listBankByDeptId', //账户借还款银行列表下拉
  listIncomeItem: '/system/common/listIncomeItem', //收支项列表下拉
  listFeeItem: '/system/common/listFeeItem', //经营费用列表下拉
  saveFinance: '/finance/spending/saveFinSocial', //社保录入
  saveFinSpending: '/finance/spending/saveFinance', //财务支出录入
  pageFinSpending: '/finance/spending/pageFinSpending', //支出列表
  removeFinSpendingItem: '/finance/spending/removeFinSpendingItem', //支出删除
  getFinSpendingItem: '/finance/spending/getFinSpendingItem', //支出详情
  pageDeptFinSpending: '/finance/spending/pageDeptFinSpending', //分馆财务支出分页列表
  pageListBorrow: '/finance/borrow/pageListBorrow', //借还款列表
  removeBnk: '/finance/borrow/removeBorrow', //借还款删除
  saveBorrow: '/finance/borrow/saveBorrow', //借还款新增
  getFinBorrowById: '/finance/borrow/getFinBorrowById', //借还款详情
  pageFinAccountFund: '/finance/fund/pageFinFund', //账户资金转出分页列表
  pageFinAccountFundInto: '/finance/fund/pageFinFundInto', //账户资金转入分页列表
  confirmFinAccountFund: '/finance/fund/confirmFinFund', //确认
  removeFinAccountFund: '/finance/fund/removeFinFund', //删除
  saveFinAccountFund: '/finance/fund/saveFinFund', //新增
  getAccountFundDetail: '/finance/fund/getFinFundDetail', //详情

  pageSpendingBank: '/finance/spendingbank/pageSpendingBank', //银行收支明细列表
  getSpendingBank: '/finance/spendingbank/getSpendingBank', //查询财务收支账户信息
  pageBankDetails: '/finance/spendingbank/pageBankDetails', //收支明细弹窗列表
  bankPrice: '/finance/spendingbank/bankPrice', //收支明细弹窗汇总金额
  removeSpendingBank: '/finance/spendingbank/removeSpendingBank', //银行收支明细列表删除
  removeFinSpendingBank: '/finance/spendingbank/removeFinSpendingBank', //收支明细弹窗删除
  updateBorrow: '/finance/borrow/updateBorrow', //录入
  saveSpendingBank: '/finance/spendingbank/saveSpendingBank', //录入
  listSchool: '/finance/dept/listSchool', //获取校区列表
  updateFinance: '/finance/spending/updateFinance', //修改财务支出
  updateFinFund: '/finance/fund/updateFinFund', //修改账户资金转入转出
  updateSpendingBank: '/finance/spendingbank/updateSpendingBank', //修改银行信息
  updateFinSocial: '/finance/spending/updateFinSocial', //修改社保支出
  batchAssociateSchool: '/student/info/batchAssociateSchool', //共享学员
  getAllSysFeeItem: '/system/common/getAllSysFeeItem', //获得全部去重类型

  pageSpendDetails: '/finance/spending/pageSpendDetails', //财政费用明细
  pagePaySpending: '/finance/spending/pagePaySpending', //付款明细
  activateInvitationCode: '/education/class-url/active', //激活邀请码
}

//财政收支班型舞种列表
export function listFinspendingSplitProjects(params) {
  return axios({
    url: '/finance/spending/listProject',
    method: 'get',
    params: params
  })
}
//二次分摊费用归类
export function SecondSplitPageFee(params) {
  return axios({
    url: '/finance/secspl/pageFee',
    method: 'get',
    params: params
  })
}
//二次分摊明细
export function pageSecondSplitInfo(params) {
  return axios({
    url: '/finance/secspl/pageSecondSplitInfo',
    method: 'get',
    params: params
  })
}
//修改分摊金额
export function updateSecSplit(params) {
  return axios({
    url: '/finance/secspl/updateSecSplit',
    method: 'post',
    data: QS.stringify(params)
  })
}
//维护规则
export function saveRule(params) {
  return axios({
    url: '/finance/secspl/saveRule',
    method: 'post',
    data: QS.stringify(params)
  })
}
//修改规则
export function updateSplitRule(params) {
  return axios({
    url: '/finance/secspl/updateSplitRule',
    method: 'post',
    data: QS.stringify(params)
  })
}
//新增规则
export function saveSplitRule(params) {
  return axios({
    url: '/finance/secspl/saveSplitRule',
    method: 'post',
    data: QS.stringify(params)
  })
}
//删除规则
export function removeRule(params) {
  return axios({
    url: '/finance/secspl/removeRule',
    method: 'post',
    data: QS.stringify(params)
  })
}
//规则维护
export function pageSplitRule(params) {
  return axios({
    url: '/finance/secspl/pageSplitRule',
    method: 'get',
    params: params
  })
}
//二次分摊
export function secSaveSplitRule(params) {
  return axios({
    url: '/finance/secspl/secSaveSplitRule',
    method: 'post',
    data: QS.stringify(params)
  })
}
// headers: { 'Content-Type': 'Application/json' },
//未分摊
export function pageFinSecondSplit(params) {
  return axios({
    url: '/finance/secspl/pageFinSecondSplit',
    method: 'get',
    params: params
  })
}
//激活邀请码
export function activateInvitationCode(cardId) {
  return axios({
    url: `${api.activateInvitationCode}/${cardId}`,
    method: 'post'
  })
}
// 付款明细
export function pagePaySpending(params) {
  return axios({
    url: api.pagePaySpending,
    method: 'get',
    params: params
  })
}
// 财政费用明细
export function pageSpendDetails(params) {
  return axios({
    url: api.pageSpendDetails,
    method: 'get',
    params: params
  })
}
// 获得全部去重类型
export function getAllSysFeeItem(params) {
  return axios({
    url: api.getAllSysFeeItem,
    method: 'get',
    params: params
  })
}
//共享学员
export function batchAssociateSchool(params) {
  return axios({
    url: `${api.batchAssociateSchool}`,
    method: 'post',
    params: params
  })
}
//授权分馆
export function saveEduDeptCard(params) {
  return axios({
    url: `${api.saveEduDeptCard}/${params.cardId}`,
    method: 'post',
    params: params
  })
}

// 获得分馆
export function listOrgDeptByUser(params) {
  return axios({
    url: api.listOrgDeptByUser,
    method: 'get',
    params: params
  })
}

export function getSchoolList(params) {
  return axios({
    url: api.getSchoolList,
    method: 'get',
    params: params
  })
}

// 获得校区
export function listOrgDept(params) {
  return axios({
    url: api.listOrgDept,
    method: 'get',
    params: params
  })
}
// 获得校区
export function listSecondDept(params) {
  return axios({
    url: api.listSecondDept,
    method: 'get',
    params: params
  })
}
// 获得校区
export function listThirdDept(params) {
  return axios({
    url: api.listThirdDept,
    method: 'get',
    params: params
  })
}

//获得舞种条目
export function danceList(params) {
  return axios({
    url: api.danceList,
    method: 'get',
    params: params
  })
}

//获得班级条目
export function classList(params) {
  return axios({
    url: api.classList,
    method: 'get',
    params: params
  })
}

//获得教室条目
export function roomList(params) {
  return axios({
    url: api.roomList,
    method: 'get',
    params: params
  })
}

//获得卡种条目
export function cardTypeList(params) {
  return axios({
    url: api.cardTypeList,
    method: 'get',
    params: params
  })
}

//获得条目
export function getList(params) {
  return axios({
    url: api.getList,
    method: 'get',
    params: params
  })
}

//线上卡列表
export function pageOnLineCard(params) {
  return axios({
    url: api.pageOnLineCard,
    method: 'get',
    params: params
  })
}

//线上卡列表
export function pageOnLineExperience(params) {
  return axios({
    url: api.pageOnLineExperience,
    method: 'get',
    params: params
  })
}

// 编辑
export function editeditById(params) {
  return axios({
    url: `${api.edit}/${params}`,
    method: 'get'
  })
}

// 授权分馆详情
export function listEduDeptCardById(params) {
  return axios({
    url: `${api.listEduDeptCardById}/${params}`,
    method: 'get'
  })
}

//删除
export function delById(params) {
  return axios({
    url: `${api.delById}/${params}`,
    method: 'delete'
  })
}

//是否启用
export function isOpen(params) {
  return axios({
    url: api.isOpen,
    method: 'post',
    params: params
  })
}

// 保存
export function save(params) {
  return axios({
    url: api.save,
    method: 'post',
    data: QS.stringify(params)
  })
}

// 上课码列表
export function getStuUserClassUrl(params) {
  return axios({
    url: `${api.getStuUserClassUrl}/${params}`,
    method: 'get'
  })
}

export function pageListBank(params) {
  return axios({
    url: api.pageListBank,
    method: 'get',
    params: params
  })
}

export function saveBank(params) {
  console.log(params)
  return axios({
    url: api.saveBank,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeBank(params) {
  return axios({
    url: `${api.removeBank}/${params}`,
    method: 'delete'
  })
}

export function changeBank(params) {
  return axios({
    url: api.changeBank,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function feenameList(params) {
  return axios({
    url: api.feenameList,
    method: 'get',
    params: params
  })
}

export function saveFeeName(params) {
  console.log(params)
  return axios({
    url: api.saveFeeName,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function feenameRemove(params) {
  return axios({
    url: `${api.feenameRemove}/${params}`,
    method: 'delete'
  })
}

export function changeFeeName(params) {
  return axios({
    url: api.changeFeeName,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function changeFeeNameState(params) {
  return axios({
    url: api.changeFeeNameState,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageListIncomeItem(params) {
  return axios({
    url: api.pageListIncomeItem,
    method: 'get',
    params: params
  })
}

export function saveIncomeItem(params) {
  return axios({
    url: api.saveIncomeItem,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeIncomeItem(params) {
  return axios({
    url: `${api.removeIncomeItem}/${params}`,
    method: 'delete'
  })
}

export function changeIncomeItem(params) {
  return axios({
    url: api.changeIncomeItem,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageFeeItem(params) {
  return axios({
    url: api.pageFeeItem,
    method: 'get',
    params: params
  })
}

export function saveFeeItem(params) {
  return axios({
    url: api.saveFeeItem,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeFeeItem(params) {
  return axios({
    url: `${api.removeFeeItem}/${params}`,
    method: 'delete'
  })
}

export function changeFeeItem(params) {
  return axios({
    url: api.changeFeeItem,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function changeFeeItemState(params) {
  return axios({
    url: api.changeFeeItemState,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listFeeName(params) {
  return axios({
    url: api.listFeeName,
    method: 'get',
    params: params
  })
}

export function listBank(params) {
  return axios({
    url: api.listBank,
    method: 'get',
    params: params
  })
}
export function listBankByDeptId(params) {
  return axios({
    url: api.listBankByDeptId,
    method: 'get',
    params: params
  })
}

export function listIncomeItem(params) {
  return axios({
    url: api.listIncomeItem,
    method: 'get',
    params: params
  })
}

export function listFeeItem(params) {
  return axios({
    url: api.listFeeItem,
    method: 'get',
    params: params
  })
}

export function saveFinance(params) {
  return axios({
    url: api.saveFinance,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function saveFinSpending(params) {
  return axios({
    url: api.saveFinSpending,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function pageFinSpending(params) {
  return axios({
    url: api.pageFinSpending,
    method: 'get',
    params: params
  })
}

export function removeFinSpendingItem(params) {
  return axios({
    url: `${api.removeFinSpendingItem}/${params}`,
    method: 'delete'
  })
}

export function getFinSpendingItem(params) {
  return axios({
    url: `${api.getFinSpendingItem}`,
    method: 'get',
    params: params
  })
}

export function pageDeptFinSpending(params) {
  return axios({
    url: `${api.pageDeptFinSpending}`,
    method: 'get',
    params: params
  })
}

export function pageListBorrow(params) {
  return axios({
    url: `${api.pageListBorrow}`,
    method: 'get',
    params: params
  })
}

export function removeBnk(params) {
  return axios({
    url: `${api.removeBnk}/${params}`,
    method: 'delete'
  })
}

export function saveBorrow(params) {
  return axios({
    url: api.saveBorrow,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getFinBorrowById(params) {
  return axios({
    url: `${api.getFinBorrowById}`,
    method: 'get',
    params: params
  })
}

export function pageFinAccountFund(params) {
  return axios({
    url: `${api.pageFinAccountFund}`,
    method: 'get',
    params: params
  })
}

export function pageFinAccountFundInto(params) {
  return axios({
    url: `${api.pageFinAccountFundInto}`,
    method: 'get',
    params: params
  })
}

export function confirmFinAccountFund(params) {
  return axios({
    url: api.confirmFinAccountFund,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function removeFinAccountFund(params) {
  return axios({
    url: `${api.removeFinAccountFund}/${params}`,
    method: 'delete'
  })
}

export function saveFinAccountFund(params) {
  return axios({
    url: api.saveFinAccountFund,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function getAccountFundDetail(params) {
  return axios({
    url: `${api.getAccountFundDetail}`,
    method: 'get',
    params: params
  })
}

export function pageSpendingBank(params) {
  return axios({
    url: `${api.pageSpendingBank}`,
    method: 'get',
    params: params
  })
}

export function getSpendingBank(params) {
  return axios({
    url: `${api.getSpendingBank}`,
    method: 'get',
    params: params
  })
}

export function pageBankDetails(params) {
  return axios({
    url: `${api.pageBankDetails}`,
    method: 'get',
    params: params
  })
}

export function bankPrice(params) {
  return axios({
    url: `${api.bankPrice}`,
    method: 'get',
    params: params
  })
}

export function removeSpendingBank(params) {
  return axios({
    url: `${api.removeSpendingBank}/${params}`,
    method: 'delete'
  })
}

export function removeFinSpendingBank(params) {
  return axios({
    url: `${api.removeFinSpendingBank}/${params}`,
    method: 'delete'
  })
}

export function saveSpendingBank(params) {
  return axios({
    url: api.saveSpendingBank,
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
export function updateBorrow(params) {
  return axios({
    url: api.updateBorrow,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateFinFund(params) {
  return axios({
    url: api.updateFinFund,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateSpendingBank(params) {
  return axios({
    url: api.updateSpendingBank,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function updateFinSocial(params) {
  return axios({
    url: api.updateFinSocial,
    method: 'post',
    data: QS.stringify(params)
  })
}

export function listSchool(params) {
  return axios({
    url: `${api.listSchool}`,
    method: 'get',
    params: params
  })
}

export function getTitleList(params) {
  return axios({
    url: `${api.getTitleList}`,
    method: 'get',
    params: params
  })
}


// 财务支出列表
export const getFiscalChargesList = params => axios.get('/finance/spending/pageFinSpending/payment', { params })
// 财务支出录入
export const saveFiscalCharges = params => axios.post('/finance/spending/saveFinance/payment', QS.stringify(params))
// 财务支出班型舞种列表
export const getFinspendingSplitProjectsList = params => axios.get('/finance/spending/listProject/payment', { params })
// 修改财务支出明细
export const updateFiscalChargesFinance = params => axios.post('/finance/spending/updateFinance/payment', QS.stringify(params))
// 删除财务支出明细
export const deleteFiscalCharge = params => axios.delete(`/finance/spending/removeFinSpendingItem/payment/${params}`, { params })

// 银行账户下拉列表
export const getBankList = params => axios.get('/system/common/distinct/listBank', { params })