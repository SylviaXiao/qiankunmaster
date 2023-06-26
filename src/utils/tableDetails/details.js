import moment from 'moment'

export const pageSizeOptions = ['10', '20', '50', '100', '150', '200']
//部门财报
export const firstColumns = [
  {
    title: '业绩分馆',
    dataIndex: 'perDeptName',
    key: 'perDeptName',
    width: 170
  },
  {
    title: '收/付款日期',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    width: 170
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    width: 100
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 100,
    key: 'stuName'
  },
  {
    title: '学员手机号',
    dataIndex: 'stuPhone',
    width: 120,
    key: 'stuPhone'
  },
  {
    title: '缴费类型',
    dataIndex: 'payType',
    key: 'payType',
    width: 70,
    customRender: (text, record) => {
      if (text == 'A') {
        return '全款'
      } else if (text == 'B') {
        return '定金'
      } else if (text == 'C') {
        return '补缴'
      } else {
        return ''
      }
    }
  },
  {
    title: '支付方式',
    dataIndex: 'dictValue',
    width: 100,
    key: 'dictValue'
  },
  {
    title: '收款分馆',
    dataIndex: 'payDeptName',
    width: 100,
    key: 'payDeptName',
  },
  {
    title: '收/付款金额',
    dataIndex: 'finPrice',
    width: 100,
    key: 'finPrice',
  },
  {
    title: '绩效金额',
    dataIndex: 'achPrice',
    width: 100,
    key: 'achPrice',
    isTotal: true,
    scopedSlots: { customRender: 'finPrice' }
  },
  {
    title: '所属顾问',
    dataIndex: 'userName',
    width: 120,
    key: 'userName'
  },
  {
    title: '资源来源',
    dataIndex: 'source',
    width: 100,
    key: 'source'
  },
  {
    title: '是否客服',
    dataIndex: 'isService',
    width: 150,
    key: 'isService'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 100
  },
]
export const secondColumns = [
  {
    title: '分馆名称',
    dataIndex: 'perDeptName',
    key: 'perDeptName',
    width: 170,
    align:'center'
  },
  {
    title: '日期',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    width: 120,
    align:'center'
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    width: 100,
    align:'center'
  },
  {
    title: '学员姓名 ',
    dataIndex: 'stuName',
    width: 100,
    key: 'stuName',
    align:'center'
  },
  {
    title: '手机号码',
    dataIndex: 'stuPhone',
    width: 120,
    key: 'stuPhone',
    align:'center'
  },
  {
    title: '收支类型',
    dataIndex: 'payType',
    key: 'payType',
    width: 70,
    customRender: (text, record) => {
      if (text == 'A') {
        return '全款'
      } else if (text == 'B') {
        return '定金'
      } else if (text == 'C') {
        return '补缴'
      } else {
        return ''
      }
    },
    align:'center'
  },
  {
    title: '收支金额',
    dataIndex: 'finPrice',
    width: 100,
    key: 'finPrice',
    customRender: (text, record) => {
      return text||text===0?Number(text).toFixed(2):''
    },
    align:'center'
  },
  {
    title: '收支方式',
    dataIndex: 'dictValue',
    width: 100,
    key: 'dictValue',
    align:'center'
  },
  {
    title: '导师名称',
    dataIndex: 'teacherName',
    width: 120,
    key: 'teacherName',
    align:'center'
  },
  {
    title: '业绩金额',
    dataIndex: 'teacherPrice',
    width: 100,
    key: 'teacherPrice',
    // customRender: (text, record) => {
    //   return text||text===0?Number(text).toFixed(2):''
    // },
    scopedSlots: { customRender: 'finPrice' },
    isTotal: true,
    align:'center'
  },
  {
    title: '提成比例(%)',
    dataIndex: 'ratio',
    width: 150,
    key: 'ratio',
    customRender: (text, record) => {
      return text?(text+'%'):''
    },
    align:'center'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    key: 'remark',
    align:'center'
  }
]
export const thirdColumns = [
  {
    title: '分馆',
    dataIndex: 'deptName',
    width: 120,
    key: 'deptName',

  },
  {
    title: '缴费时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 70,
    // customRender: (text, record) => {
    //   return text.slice(0, 10)
    // }
  },
  {
    title: '收入项',
    dataIndex: 'name',
    key: 'name',
    width: 100
  },
  {
    title: '支付方式',
    dataIndex: 'dictValue',
    width: 100,
    key: 'dictValue'
  },
  {
    title: '收支金额',
    dataIndex: 'price',
    key: 'price',
    width: 170,
    scopedSlots: { customRender: 'shopItemPricePrice' }
  },
  {
    title: '手续费',
    dataIndex: 'serviceCharge',
    key: 'serviceCharge',
    width: 170
  },
  {
    title: '到账金额',
    dataIndex: 'accountPrice',
    width: 100,
    key: 'accountPrice',
    isTotal: true
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    key: 'remark'
  }
]
export const fourthColumns = [
  {
    title: '分摊月份',
    dataIndex: 'splitDate',
    key: 'splitDate',
    width: 170,
    customRender: (text, record) => {
      return text.slice(0, 7)
    }
  },
  {
    title: '分摊校区',
    dataIndex: 'splitDeptName',
    key: 'splitDeptName',
    width: 170
  },
  {
    title: '项目名称',
    dataIndex: 'feeName',
    key: 'feeName',
    width: 100
  },
  {
    title: '费用归类',
    dataIndex: 'feeItemName',
    width: 100,
    key: 'feeItemName'
  },
  {
    title: '提交部门/分馆',
    dataIndex: 'deptName',
    width: 120,
    key: 'deptName'
  },
  {
    title: '提交时间',
    dataIndex: 'date',
    key: 'date',
    width: 70
  },
  {
    title: '分摊金额',
    dataIndex: 'price',
    width: 100,
    key: 'price',
    isTotal: true,
    // scopedSlots: { customRender: 'costPricePrice' }
  },
  // {
  //   title: '总金额',
  //   dataIndex: 'price1',
  //   width: 100,
  //   key: 'price1',
  //   customRender: (text, record) => {
  //     return record.price
  //   }
  // },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    key: 'remark'
  }
]
export const fifthColumns = [
  {
    title: '业绩分馆/资源来源',
    dataIndex: 'branchName',
    key: 'branchName',
    width: 170
  },
  {
    title: '客服',
    dataIndex: 'one',
    key: 'one',
    width: 170,
  },
  {
    title: '个人网络',
    dataIndex: 'two',
    key: 'two',
    width: 100,
  },
  {
    title: '会员介绍',
    dataIndex: 'three',
    width: 100,
    key: 'three'
  },  {
    title: '会员续卡',
    dataIndex: 'four',
    key: 'four',
    width: 170
  },
  {
    title: '传单',
    dataIndex: 'five',
    key: 'five',
    width: 170
  },
  {
    title: '自然来访',
    dataIndex: 'six',
    key: 'six',
    width: 100
  },
  {
    title: '舞林一分钟',
    dataIndex: 'seven',
    width: 100,
    key: 'seven'
  },
  {
    title: '店面收入',
    dataIndex: 'eigth',
    key: 'eigth',
    width: 100
  },
  {
    title: '导师转化',
    dataIndex: 'nine',
    width: 100,
    key: 'nine'
  },
  {
    title: '合计',
    dataIndex: 'total',
    width: 120,
    key: 'total'
  },
]
export const sixthColumns = [
  {
    title: '提交部门',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 170
  },
  {
    title: '提交日期',
    dataIndex: 'date',
    key: 'date',
    width: 170
  },
  {
    title: '项目名称',
    dataIndex: 'feeName',
    key: 'feeName',
    width: 100
  },
  {
    title: '费用归类',
    dataIndex: 'price',
    width: 100,
    key: 'price',
    scopedSlots: { customRender: 'reimburseSubPrice' },
    isTotal: true
  },

  {
    title: '经营归类',
    dataIndex: 'priceDate',
    key: 'priceDate',
    width: 100
  },
  {
    title: '单号',
    dataIndex: 'priceDate',
    key: 'priceDate',
    width: 100
  },
  {
    title: '付款日期',
    dataIndex: 'priceDate',
    key: 'priceDate',
    width: 100
  },
  {
    title: '金额',
    dataIndex: 'remark',
    width: 100,
    key: 'remark'
  }
]
export const seventhColumns = [
  {
    title: '付款分馆',
    dataIndex: 'bankDeptName',
    key: 'bankDeptName',
    width: 170
  },
  {
    title: '付款日期',
    dataIndex: 'date',
    key: 'date',
    width: 170
  },
  {
    title: '项目名称',
    dataIndex: 'feeName',
    key: 'feeName',
    width: 100
  },
  {
    title: '费用归类',
    dataIndex: 'bankPrice',
    width: 100,
    key: 'bankPrice',
    scopedSlots: { customRender: 'reimbursePayPrice' },
    isTotal: true
  },
  {
    title: '经营归类',
    dataIndex: 'priceDate',
    key: 'priceDate',
    width: 100
  },
  {
    title: '单号',
    dataIndex: 'remark',
    width: 100,
    key: 'remark'
  },
  {
    title: '提交部门',
    dataIndex: 'bankPrice1',
    width: 100,
    key: 'bankPrice1',
    scopedSlots: { customRender: 'reimbursePayPrice' },
    isTotal: true
  },
  {
    title: '提交日期',
    dataIndex: 'priceDate1',
    key: 'priceDate1',
    width: 100
  },
  {
    title: '金额',
    dataIndex: 'remark1',
    width: 100,
    key: 'remark1'
  }
]
export const eighthColumns = [
  {
    title: '业绩分馆/资源来源',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 170
  },
  {
    title: '客服',
    dataIndex: 'finInfoPrice',
    key: 'finInfoPrice',
    width: 170,
    scopedSlots: { customRender: 'totalReceiptsfinInfoPrice' }
  },
  {
    title: '个人网络',
    dataIndex: 'shopItemPrice',
    key: 'shopItemPrice',
    width: 100,
    scopedSlots: { customRender: 'totalReceiptsshopItemPrice' }
  },
  {
    title: '会员介绍',
    dataIndex: 'totalReceipts',
    width: 100,
    key: 'totalReceipts'
  },  {
    title: '会员续卡',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 170
  },
  {
    title: '传单',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 170
  },
  {
    title: '自然来访',
    dataIndex: 'stuNo',
    key: 'stuNo',
    width: 100
  },
  {
    title: '导师转化',
    dataIndex: 'stuName',
    width: 100,
    key: 'stuName'
  },
  {
    title: '合计',
    dataIndex: 'stuPhone',
    width: 120,
    key: 'stuPhone'
  },
]
export const nighthColumns = [
  {
    title: '业绩分馆',
    dataIndex: 'perDeptName',
    key: 'perDeptName',
    width: 170
  },
  {
    title: '收/付款日期',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    width: 170
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    width: 100
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 100,
    key: 'stuName'
  },
  {
    title: '学员手机号',
    dataIndex: 'stuPhone',
    width: 120,
    key: 'stuPhone'
  },
  {
    title: '缴费类型',
    dataIndex: 'payType',
    key: 'payType',
    width: 70,
    customRender: (text, record) => {
      if (text == 'A') {
        return '全款'
      } else if (text == 'B') {
        return '定金'
      } else if (text == 'C') {
        return '补缴'
      } else {
        return ''
      }
    }
  },
  {
    title: '支付方式',
    dataIndex: 'dictValue',
    width: 100,
    key: 'dictValue'
  },
  {
    title: '收款分馆',
    dataIndex: 'payDeptName',
    width: 100,
    key: 'payDeptName',
  },
  {
    title: '收/付款金额',
    dataIndex: 'finPrice',
    width: 100,
    key: 'finPrice',
  },
  {
    title: '绩效金额',
    dataIndex: 'achPrice',
    width: 100,
    key: 'achPrice',
    isTotal: true
  },
  {
    title: '所属顾问',
    dataIndex: 'userName',
    width: 120,
    key: 'userName'
  },
  {
    title: '资源来源',
    dataIndex: 'source',
    width: 100,
    key: 'source'
  },
  {
    title: '是否客服',
    dataIndex: 'isService',
    width: 150,
    key: 'isService'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 100
  },
]
export const tenthColumns = [
  {
    title: '提交分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 170
  },
  {
    title: '退费提交时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 170
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    width: 100
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 100,
    key: 'stuName'
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120,
    key: 'stuPhone'
  },
  {
    title: '退费金额',
    dataIndex: 'price',
    key: 'price',
    width: 70,
    scopedSlots: { customRender: 'refundSubPrice' },
    isTotal: true
  },
  {
    title: '资源来源',
    dataIndex: 'source',
    width: 100,
    key: 'source'
  },
  {
    title: '付款时间',
    dataIndex: 'tradeDate',
    width: 100,
    key: 'tradeDate'
  }
]
//顾问业绩
export const counselorAchievementFirstColumns = [
  {
    title: '分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 170
  },
  {
    title: '顾问',
    dataIndex: 'userName',
    key: 'userName',
    width: 170
  },
  {
    title: '客服',
    dataIndex: 'serviceSource',
    key: 'serviceSource',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'serviceSource' }
  },
  {
    title: '个人网络',
    dataIndex: 'networkSource',
    key: 'networkSource',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'networkSource' }
  },
  {
    title: '会员介绍',
    dataIndex: 'memberIntroduceSource',
    key: 'memberIntroduceSource',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'memberIntroduceSource' }
  },
  {
    title: '会员续卡',
    dataIndex: 'memberReorderSource',
    key: 'memberReorderSource',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'memberReorderSource' }
  },
  {
    title: '传单',
    dataIndex: 'passSource',
    key: 'passSource',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'passSource' }
  },
  {
    title: '自然来访',
    dataIndex: 'natureSource',
    key: 'natureSource',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'natureSource' }
  },
  {
    title: '店面收入',
    dataIndex: 'incomeSource',
    key: 'incomeSource',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'incomeSource' }
  },
  {
    title: '舞林一分钟',
    dataIndex: 'danceSource',
    key: 'danceSource',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'danceSource' }
  },
  {
    title: '导师转化',
    dataIndex: 'teacherSource',
    key: 'teacherSource',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'teacherSource' }
  },
  {
    title: '转入',
    dataIndex: 'intoPer',
    key: 'intoPer',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'intoPer' }
  },
  {
    title: '转出',
    dataIndex: 'outPer',
    key: 'outPer',
    width: 170,
    isTotal: true,
    scopedSlots: { customRender: 'outPer' }
  },
  {
    title: '业绩合计',
    dataIndex: 'totalPer',
    width: 100,
    key: 'totalPer',
    isTotal: true
  },
  {
    title: '提成合计',
    dataIndex: 'commission',
    width: 120,
    key: 'commission',
    isTotal: true
  }
]
export const counselorAchievementSecondColumns = [
  {
    title: '业绩分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 170
  },
  {
    title: '缴费时间',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    width: 170
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    width: 100
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 100,
    key: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120,
    key: 'stuPhone'
  },
  {
    title: '缴费类型',
    dataIndex: 'finType',
    key: 'finType',
    width: 70,
    customRender: (text, record) => {
      if (text == 'A') {
        return '全款'
      } else if (text == 'B') {
        return '定金'
      } else if (text == 'C') {
        return '补缴'
      } else {
        return ''
      }
    }
  },
  {
    title: '支付方式',
    dataIndex: 'dictValue',
    width: 100,
    key: 'dictValue'
  },
  {
    title: '收款金额',
    dataIndex: 'finPrice',
    width: 100,
    key: 'finPrice'
  },
  {
    title: '绩效',
    dataIndex: 'achPrice',
    width: 100,
    key: 'achPrice',
    isTotal: true,
    scopedSlots: { customRender: 'finPrice' }
  },
  {
    title: '所属人',
    dataIndex: 'userName',
    width: 120,
    key: 'userName'
  },
  {
    title: '角色',
    dataIndex: 'positionName',
    key: 'positionName',
    width: 100
  },
  {
    title: '资源来源',
    dataIndex: 'source',
    width: 100,
    key: 'source'
  },
  {
    title: '提交分馆',
    dataIndex: 'finDeptName',
    width: 150,
    key: 'finDeptName'
  }
]
export const counselorAchievementThirdColumns = [
  {
    title: '业绩转入分馆',
    dataIndex: 'deptNameIn',
    width: 170,
    key: 'deptNameIn',
    scopedSlots: { customRender: 'deptNameIn' }
  },
  {
    title: '转入日期',
    dataIndex: 'rollOutDate',
    key: 'rollOutDate',
    width: 170
  },
  {
    title: '学员转卡信息',
    dataIndex: 'stuName',
    key: 'stuName',
    width: 100,
    scopedSlots: { customRender: 'targetStuName' }
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    width: 100,
    key: 'stuCardNo',
    scopedSlots: { customRender: 'validTargetStuName' }
  },
  {
    title: '卡名称',
    dataIndex: 'cardName',
    width: 120,
    key: 'cardName'
  },
  {
    title: '业绩金额',
    dataIndex: 'achPrice',
    key: 'achPrice',
    width: 70
  },
  {
    title: '转入业绩顾问',
    dataIndex: 'adviserNameIn',
    width: 120,
    key: 'adviserNameIn',
    scopedSlots: { customRender: 'adviserNameIn' }
  },
  {
    title: '业绩转出分馆',
    dataIndex: 'deptNameOut',
    key: 'deptNameOut',
    width: 170,
    scopedSlots: { customRender: 'deptNameOut' }
  },
  {
    title: '转出业绩顾问',
    dataIndex: 'adviserNameOut',
    width: 100,
    key: 'adviserNameOut',
    scopedSlots: { customRender: 'adviserNameOut' }
  }
]
export const counselorAchievementFourthColumns = [
  {
    title: '业绩转出分馆',
    dataIndex: 'deptNameOut',
    key: 'deptNameOut',
    width: 170,
    scopedSlots: { customRender: 'deptNameOut' }
  },
  {
    title: '转出日期',
    dataIndex: 'rollOutDate',
    key: 'rollOutDate',
    width: 170
  },
  {
    title: '学员转卡信息',
    dataIndex: 'stuName',
    key: 'stuName',
    width: 170,
    scopedSlots: { customRender: 'targetStuName' }
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    width: 100,
    key: 'stuCardNo',
    scopedSlots: { customRender: 'validTargetStuName' }
  },
  {
    title: '卡名称',
    dataIndex: 'cardName',
    width: 120,
    key: 'cardName'
  },
  {
    title: '业绩金额',
    dataIndex: 'achPrice',
    key: 'achPrice',
    width: 70,
    isTotal: true
  },
  {
    title: '转出业绩顾问',
    dataIndex: 'adviserNameOut',
    width: 100,
    key: 'adviserNameOut',
    scopedSlots: { customRender: 'adviserNameOut' }
  },
  {
    title: '业绩转入分馆',
    dataIndex: 'deptNameIn',
    width: 100,
    key: 'deptNameIn',
    scopedSlots: { customRender: 'deptNameIn' }
  },
  {
    title: '转入业绩顾问',
    dataIndex: 'adviserNameIn',
    width: 120,
    key: 'adviserNameIn',
    scopedSlots: { customRender: 'adviserNameIn' }
  }
]
export const counselorAchievementFifthColumns = [
  {
    title: '本月业绩',
    dataIndex: 'deptNameOut',
    key: 'deptNameOut',
    width: 170,
    scopedSlots: { customRender: 'deptNameOut' }
  },
  {
    title: '上月末抵扣业绩',
    dataIndex: 'rollOutDate',
    key: 'rollOutDate',
    width: 170
  },
  {
    title: '提成合计',
    dataIndex: 'stuName',
    key: 'stuName',
    width: 170,
    scopedSlots: { customRender: 'targetStuName' }
  }
]
export const validCounselorAchievementFirstColumns = [
  {
    title: '业绩分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 170
  },
  {
    title: '缴费时间',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    width: 170
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    width: 100
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 100,
    key: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120,
    key: 'stuPhone'
  },
  {
    title: '缴费类型',
    dataIndex: 'finType',
    key: 'finType',
    width: 70,
    customRender: (text, record) => {
      if (text == 'A') {
        return '全款'
      } else if (text == 'B') {
        return '定金'
      } else if (text == 'C') {
        return '补缴'
      } else {
        return ''
      }
    }
  },
  {
    title: '支付方式',
    dataIndex: 'dictValue',
    width: 100,
    key: 'dictValue'
  },
  {
    title: '收款金额',
    dataIndex: 'finPrice',
    width: 100,
    key: 'finPrice'
  },
  {
    title: '绩效',
    dataIndex: 'achPrice',
    width: 100,
    key: 'achPrice',
    isTotal: true,
    scopedSlots: { customRender: 'finPrice' }
  },
  {
    title: '所属人',
    dataIndex: 'userName',
    width: 120,
    key: 'userName'
  },
  {
    title: '角色',
    dataIndex: 'positionName',
    key: 'positionName',
    width: 100
  },
  {
    title: '资源来源',
    dataIndex: 'source',
    width: 100,
    key: 'source'
  },
  {
    title: '提交分馆',
    dataIndex: 'finDeptName',
    width: 150,
    key: 'finDeptName'
  }
]
export const validCounselorAchievementSecondColumns = [
  {
    title: '业绩分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 170
  },
  {
    title: '退费提交时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 170
  },
  {
    title: '付款时间',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    width: 170
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    width: 100
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 100,
    key: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120,
    key: 'stuPhone'
  },
  {
    title: '退费金额',
    dataIndex: 'finPrice',
    width: 100,
    key: 'finPrice'
  },
  {
    title: '绩效',
    dataIndex: 'achPrice',
    width: 100,
    key: 'achPrice',
    isTotal: true,
    scopedSlots: { customRender: 'finPrice' }
  },

  {
    title: '资源来源',
    dataIndex: 'source',
    width: 100,
    key: 'source'
  },
  {
    title: '提交分馆',
    dataIndex: 'finDeptName',
    key: 'finDeptName',
    width: 170
  }
]
export const validCounselorAchievementThirdColumns = [
  {
    title: '业绩分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 170
  },
  {
    title: '退费提交时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 170
  },
  {
    title: '付款时间',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    width: 170
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    width: 100
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 100,
    key: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120,
    key: 'stuPhone'
  },
  {
    title: '缴费类型',
    dataIndex: 'finType',
    key: 'finType',
    width: 70,
    customRender: (text, record) => {
      if (text == 'A') {
        return '全款'
      } else if (text == 'B') {
        return '定金'
      } else if (text == 'C') {
        return '补缴'
      } else if (text == 'D') {
        return '退费'
      } else {
        return ''
      }
    }
  },
  {
    title: '退费金额',
    dataIndex: 'finPrice',
    width: 100,
    key: 'finPrice'
  },
  {
    title: '绩效',
    dataIndex: 'achPrice',
    width: 100,
    key: 'achPrice',
    isTotal: true,
    scopedSlots: { customRender: 'finPrice' }
  },
  {
    title: '所属人',
    dataIndex: 'userName',
    width: 120,
    key: 'userName'
  },
  {
    title: '资源来源',
    dataIndex: 'source',
    width: 100,
    key: 'source'
  },
  {
    title: '提交分馆',
    dataIndex: 'finDeptName',
    width: 150,
    key: 'finDeptName'
  }
]
export const validCounselorAchievementFourthColumns = [
  {
    title: '业绩转出分馆',
    dataIndex: 'deptNameOut',
    key: 'deptNameOut',
    width: 170,
    scopedSlots: { customRender: 'deptNameOut' }
  },
  {
    title: '转出时间',
    dataIndex: 'rollOutDate',
    key: 'rollOutDate',
    width: 170
  },
  {
    title: '学员转卡信息',
    dataIndex: 'stuName',
    key: 'stuName',
    width: 170,
    scopedSlots: { customRender: 'targetStuName' }
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    width: 100,
    key: 'stuCardNo',
    scopedSlots: { customRender: 'validTargetStuName' }
  },
  {
    title: '卡名称',
    dataIndex: 'cardName',
    width: 120,
    key: 'cardName'
  },
  {
    title: '业绩金额',
    dataIndex: 'achPrice',
    key: 'achPrice',
    width: 70,
    isTotal: true
  },
  {
    title: '转出业绩顾问',
    dataIndex: 'adviserNameOut',
    width: 100,
    key: 'adviserNameOut',
    scopedSlots: { customRender: 'adviserNameOut' }
  },
  {
    title: '业绩转入分馆',
    dataIndex: 'deptNameIn',
    width: 100,
    key: 'deptNameIn',
    scopedSlots: { customRender: 'deptNameIn' }
  },
  {
    title: '转入业绩顾问',
    dataIndex: 'adviserNameIn',
    width: 120,
    key: 'adviserNameIn',
    scopedSlots: { customRender: 'adviserNameIn' }
  }
]
export const validCounselorAchievementFifthColumns = [
  {
    title: '业绩转入分馆',
    dataIndex: 'deptNameIn',
    width: 170,
    key: 'deptNameIn',
    scopedSlots: { customRender: 'deptNameIn' }
  },
  {
    title: '转入时间',
    dataIndex: 'rollOutDate',
    key: 'rollOutDate',
    width: 170
  },
  {
    title: '学员转卡信息',
    dataIndex: 'stuName',
    key: 'stuName',
    width: 170,
    scopedSlots: { customRender: 'targetStuName' }
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    width: 100,
    key: 'stuCardNo',
    scopedSlots: { customRender: 'validTargetStuName' }
  },
  {
    title: '卡名称',
    dataIndex: 'cardName',
    width: 120,
    key: 'cardName'
  },
  {
    title: '业绩金额',
    dataIndex: 'achPrice',
    key: 'achPrice',
    width: 70,
    isTotal: true
  },
  {
    title: '转入业绩顾问',
    dataIndex: 'adviserNameIn',
    width: 120,
    key: 'adviserNameIn',
    scopedSlots: { customRender: 'adviserNameIn' }
  },
  {
    title: '业绩转出分馆',
    dataIndex: 'deptNameOut',
    key: 'deptNameOut',
    width: 170,
    scopedSlots: { customRender: 'deptNameOut' }
  },
  {
    title: '转出业绩顾问',
    dataIndex: 'adviserNameOut',
    width: 100,
    key: 'adviserNameOut',
    scopedSlots: { customRender: 'adviserNameOut' }
  }
]
//导师业绩验算表
export const teacherAchievementFirstColumns = [
  {
    title: '业绩分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 170
  },
  {
    title: '缴费时间',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    width: 170
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    width: 100
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    width: 100,
    key: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    width: 120,
    key: 'stuPhone'
  },
  {
    title: '缴费类型',
    dataIndex: 'finType',
    key: 'finType',
    width: 70,
    customRender: (text, record) => {
      if (text == 'A') {
        return '全款'
      } else if (text == 'B') {
        return '定金'
      } else if (text == 'C') {
        return '补缴'
      } else {
        return ''
      }
    }
  },
  {
    title: '支付方式',
    dataIndex: 'dictValue',
    width: 100,
    key: 'dictValue'
  },
  {
    title: '收款金额',
    dataIndex: 'finPrice',
    width: 100,
    key: 'finPrice'
  },
  {
    title: '绩效',
    dataIndex: 'achPrice',
    width: 100,
    key: 'achPrice',
    isTotal: true,
    scopedSlots: { customRender: 'finPrice' }
  },
  {
    title: '提成比例',
    dataIndex: 'ratio',
    key: 'ratio',
    width: 100
  },
  {
    title: '所属人',
    dataIndex: 'userName',
    width: 120,
    key: 'userName'
  },

  {
    title: '资源来源',
    dataIndex: 'source',
    width: 100,
    key: 'source'
  },
  {
    title: '提交分馆',
    dataIndex: 'finDeptName',
    width: 150,
    key: 'finDeptName'
  }
]
//导师课时统计(店面)
export const teacherClassFirstColumns = [
  {
    title: '导师姓名',
    dataIndex: 'teacherName',
    key: 'teacherName',
    width: 170
  },
  {
    title: '班型',
    dataIndex: 'eduTypeName',
    key: 'eduTypeName',
    width: 170
  },
  {
    title: '上课时间',
    dataIndex: 'startDate',
    key: 'startDate',
    width: 200,
    customRender: (text, record) => {
      return text.slice(0, 16) + '~' + record.endDate.slice(12, 16)
    }
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    width: 100,
    key: 'className'
  },
  {
    title: '薪酬类型',
    dataIndex: 'salTypeName',
    width: 120,
    key: 'salTypeName',
    scopedSlots: { customRender: 'salTypeName' }
  },
  {
    title: '薪酬',
    dataIndex: 'salary',
    key: 'salary',
    width: 70
  },
  {
    title: '签到计次',
    dataIndex: 'num',
    width: 100,
    key: 'num',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '薪酬总额',
    dataIndex: 'totalPrice',
    width: 100,
    key: 'totalPrice'
  }
]
//分管排课课时统计表
export const branchClassFirstColumns = [
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className',
    width: 170
  },
  {
    title: '上课时间',
    dataIndex: 'startDate',
    key: 'startDate',
    width: 200,
    customRender: (text, record) => {
      return text.slice(0, 16) + '~' + record.endDate.slice(11, 16)
    }
  },
  {
    title: '计划上课老师',
    dataIndex: 'planTeachers',
    width: 100,
    key: 'planTeachers',
    ellipsis: true,
    customRender: (text, record) => {
      if (Array.isArray(text) && text.length > 0) {
        let data = text.map(item => item.teacherName).join(',')
        return data
      } else {
        return ''
      }
    }
  },
  {
    title: '签到计次',
    dataIndex: 'signCount',
    width: 100,
    key: 'signCount',
    scopedSlots: { customRender: 'num' }
  }
]
export const branchClassScondColumns = [
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className',
    width: 170
  },
  {
    title: '上课时间',
    dataIndex: 'startDate',
    key: 'startDate',
    width: 200,
    customRender: (text, record) => {
      return text.slice(0, 16) + '~' + record.endDate.slice(11, 16)
    }
  },
  {
    title: '计划上课老师',
    dataIndex: 'planTeachers',
    width: 100,
    key: 'planTeachers',
    ellipsis: true,
    customRender: (text, record) => {
      if (Array.isArray(text) && text.length > 0) {
        let data = text.map(item => item.teacherName).join(',')
        return data
      } else {
        return ''
      }
    }
  },
  {
    title: '签到老师',
    dataIndex: 'signTeachers',
    width: 100,
    key: 'signTeachers',
    ellipsis: true,
    customRender: (text, record) => {
      if (Array.isArray(text) && text.length > 0) {
        let data = text.map(item => item.signName).join(',')
        return data
      } else {
        return ''
      }
    }
  },
  {
    title: '签到计次',
    dataIndex: 'signCount',
    width: 100,
    key: 'signCount',
    scopedSlots: { customRender: 'num' }
  }
]

//经营费用流水统计表
export const cashJourneyFirstColumns = [
  {
    title: '校区名称',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 150
  },
  {
    title: '项目名称',
    dataIndex: 'feeName',
    key: 'feeName',
    width: 120
  },
  {
    title: '经营归类',
    dataIndex: 'operateName',
    width: 100,
    key: 'operateName',
    ellipsis: true
  },
  {
    title: '总金额',
    dataIndex: 'price',
    width: 100,
    key: 'price',

    isTotal: true
  },
  {
    title: '分摊金额',
    dataIndex: 'splitPrice',
    width: 100,
    key: 'splitPrice',
    scopedSlots: { customRender: 'costPricePrice' }
  },
  {
    title: '分摊月份',
    dataIndex: 'splitDate',
    width: 100,
    key: 'splitDate',
    customRender: (text, record) => {
      return text.slice(0, 7)
    }
  },
  {
    title: '付款账户',
    dataIndex: 'bankNo',
    width: 180,
    key: 'bankNo',
    ellipsis: true
  },
  {
    title: '付款日期',
    dataIndex: 'paymentDate',
    width: 100,
    key: 'paymentDate'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    key: 'remark',
    ellipsis: true
  },
  {
    title: '操作人',
    dataIndex: 'operateUser',
    width: 100,
    key: 'operateUser'
  }
]
//财务收支流水统计表
export const financeIncomeFirstColumns = [
  {
    title: '校区名称',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 150
  },
  {
    title: '项目名称',
    dataIndex: 'feeName',
    key: 'feeName',
    width: 120
  },
  {
    title: '财务归类',
    dataIndex: 'operateName',
    width: 100,
    key: 'operateName',
    ellipsis: true
  },
  {
    title: '总金额',
    dataIndex: 'price',
    width: 100,
    key: 'price',

    isTotal: true
  },
  {
    title: '分摊金额',
    dataIndex: 'splitPrice',
    width: 100,
    key: 'splitPrice',
    scopedSlots: { customRender: 'costPricePrice' }
  },
  {
    title: '分摊月份',
    dataIndex: 'splitDate',
    width: 100,
    key: 'splitDate',
    customRender: (text, record) => {
      return text.slice(0, 7)
    }
  },
  {
    title: '付款账户',
    dataIndex: 'bankNo',
    width: 180,
    key: 'bankNo',
    ellipsis: true
  },
  {
    title: '付款日期',
    dataIndex: 'paymentDate',
    width: 100,
    key: 'paymentDate'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    key: 'remark',
    ellipsis: true
  },
  {
    title: '操作人',
    dataIndex: 'operateUser',
    width: 100,
    key: 'operateUser'
  }
]
//财务收支流水统计表
export const deptFeePreFirstColumns = [
  {
    title: '分摊部门',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 150
  },
  {
    title: '分摊金额',
    dataIndex: 'splitPrice',
    width: 100,
    key: 'splitPrice',
    isTotal: true,
    scopedSlots: { customRender: 'costPricePrice' }
  },
  {
    title: '项目名称',
    dataIndex: 'feeName',
    key: 'feeName',
    width: 120
  },
  {
    title: '费用归类',
    dataIndex: 'operateName',
    width: 100,
    key: 'operateName',
    ellipsis: true
  },
  {
    title: '提交部门',
    dataIndex: 'submitDept',
    width: 100,
    key: 'submitDept'
  },
  {
    title: '总金额',
    dataIndex: 'price',
    width: 100,
    key: 'price'
  },
  {
    title: '分摊月份',
    dataIndex: 'splitDate',
    width: 100,
    key: 'splitDate',
    customRender: (text, record) => {
      return text.slice(0, 7)
    }
  },
  {
    title: '付款账户',
    dataIndex: 'bankNo',
    width: 180,
    key: 'bankNo',
    ellipsis: true
  },
  {
    title: '付款日期',
    dataIndex: 'paymentDate',
    width: 140,
    key: 'paymentDate'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
    key: 'remark',
    ellipsis: true
  },
  {
    title: '操作人',
    dataIndex: 'operateUser',
    width: 100,
    key: 'operateUser'
  }
]
//学员统计
export const studentStatisticColumns = [
  {
    title: '学员名称',
    dataIndex: 'stuName',
    key: 'stuName',
    width: 150
  },
  {
    title: '学员手机号',
    dataIndex: 'stuPhone',
    width: 100,
    key: 'stuPhone'
  },
  {
    title: '人群',
    dataIndex: 'stuType',
    key: 'stuType',
    width: 120,
    customRender: (text, record) => {
      return text == 'A' ? '成人' : text == 'B' ? '少儿' : ''
    }
  },
  {
    title: '身份证号',
    dataIndex: 'stuIdcard',
    width: 100,
    key: 'stuIdcard',
    ellipsis: true
  },
  {
    title: '生日',
    dataIndex: 'stuBirthday',
    width: 100,
    key: 'stuBirthday'
  },
  {
    title: '顾问',
    dataIndex: 'adviserName',
    width: 100,
    key: 'adviserName'
  },
  {
    title: '年龄',
    dataIndex: 'userAge',
    width: 100,
    key: 'userAge'
  },
  {
    title: '年龄段',
    dataIndex: 'ageStart',
    width: 180,
    key: 'ageStart',
    customRender: (text, record) => {
      if (record.ageStart && record.ageEnd) {
        return record.ageStart + '-' + record.ageEnd
      } else {
        return ''
      }
    }
  },
  {
    title: '省市',
    dataIndex: 'userArea',
    width: 140,
    key: 'userArea'
  },
  {
    title: '来源一级',
    dataIndex: 'source',
    width: 100,
    key: 'source',
    ellipsis: true
  },
  {
    title: '来源二级',
    dataIndex: 'secondSource',
    width: 100,
    key: 'secondSource'
  },

  {
    title: '是否报名',
    dataIndex: 'isApply',
    width: 180,
    key: 'isApply'
  },
  {
    title: '是否开卡',
    dataIndex: 'isOpenCard',
    width: 140,
    key: 'isOpenCard'
  },
  {
    title: '办卡数量',
    dataIndex: 'sumNum',
    width: 100,
    key: 'sumNum',
    ellipsis: true
  },
  {
    title: '退卡数量',
    dataIndex: 'returnCardNum',
    width: 100,
    key: 'returnCardNum'
  },
  {
    title: '结业卡数量',
    dataIndex: 'operateCardNum',
    width: 180,
    key: 'operateCardNum',
    ellipsis: true
  },
  {
    title: '体验卡数量',
    dataIndex: 'experienceNum',
    width: 140,
    key: 'experienceNum'
  },
  {
    title: '合同金额（总）',
    dataIndex: 'stuOriginalPrice',
    width: 100,
    key: 'stuOriginalPrice',
    ellipsis: true
  },
  {
    title: '优惠金额（总）',
    dataIndex: 'stuDiscount',
    width: 100,
    key: 'stuDiscount'
  },

  {
    title: '报名金额（总）',
    dataIndex: 'stuTotalprice',
    width: 180,
    key: 'stuTotalprice',
    ellipsis: true
  },
  {
    title: '已缴金额（总）',
    dataIndex: 'finPrice',
    width: 140,
    key: 'finPrice'
  },
  {
    title: '手续费（总）',
    dataIndex: 'serviceCharge',
    width: 100,
    key: 'serviceCharge',
    ellipsis: true
  },
  {
    title: '到账金额（总）',
    dataIndex: 'arrivalPrnce',
    width: 100,
    key: 'arrivalPrnce'
  },
  {
    title: '是否缴清',
    dataIndex: 'payoffStatus',
    width: 180,
    key: 'payoffStatus',
    ellipsis: true,
    customRender: (text, record) => {
      return text == 'Y' ? '是' : text == 'N' ? '否' : ''
    }
  },
  {
    title: '欠缴金额（总）',
    dataIndex: 'arrearagePrnce',
    width: 140,
    key: 'arrearagePrnce'
  },
  {
    title: '分馆',
    dataIndex: 'schoolName',
    width: 100,
    key: 'schoolName',
    ellipsis: true
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    width: 100,
    key: 'danceName'
  }
]
//卡种统计
export const cardStatisticColumns = [
  {
    title: '汇总',
    dataIndex: 'generalDeptName'
  },
  {
    title: '区域',
    dataIndex: 'deptName'
  },
  {
    title: '办卡分馆',
    dataIndex: 'schoolName'
  },
  {
    title: '办卡日期',
    dataIndex: 'createDate',
    customRender: (text, record) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    ellipsis: true
  },
  {
    title: '卡号',
    dataIndex: 'cardno'
  },
  {
    title: '卡状态',
    dataIndex: 'cardStatus',
    customRender: (text, record) => {
      if (text === 'A') {
        return '未使用'
      } else if (text === 'B') {
        return '使用中'
      } else if (text === 'C') {
        return '停课'
      } else if (text === 'D') {
        return '退卡'
      } else if (text === 'E') {
        return '结业'
      } else if (text === 'F') {
        return '撤销'
      } else if (text === 'G') {
        return '结转'
      }
    }
  },
  {
    title: '是否开卡',
    dataIndex: 'isOpenCard'
  },
  {
    title: '是否新报',
    dataIndex: 'isNew'
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName'
  },
  {
    title: '学员手机号',
    dataIndex: 'stuPhone'
  },
  {
    title: '上课分馆',
    dataIndex: 'className'
  },
  {
    title: '合同收入',
    dataIndex: 'originalPrice'
  },
  {
    title: '优惠金额',
    dataIndex: 'discount'
  },
  {
    title: '报名收入',
    dataIndex: 'totalprice'
  },
  {
    title: '到账金额',
    dataIndex: 'paidprice'
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    customRender: text => {
      return text ? '已缴清' : '未缴清'
    }
  },
  {
    title: '卡消耗',
    dataIndex: 'cardConsume'
  },
  {
    title: '上次签到时间',
    dataIndex: 'lastclassdate',
    customRender: (text, record) => {
      return text ? moment(text).format('YYYY-MM-DD HH:mm') : ''
    }
  },
  {
    title: '未消耗天数',
    dataIndex: 'unConsumeDay'
  },
  {
    title: '大班型',
    dataIndex: 'typeName'
  },
  {
    title: '小班型',
    dataIndex: 'smallTypeName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '人群',
    dataIndex: 'stuType',
    customRender: (text, record) => {
      return text === 'B' ? '少儿' : text === 'A' ? '成人' : text === 'C' ? '通用' : ''
    }
  },
  {
    title: '来源一级',
    dataIndex: 'source',
    ellipsis: true
  },
  {
    title: '来源二级',
    dataIndex: 'secondSource',
    ellipsis: true
  },
  {
    title: '有效截止日期',
    dataIndex: 'stuEndDate'
  }
]

export const incomeStatisticColumns = [
  {
    title: '汇总',
    dataIndex: 'parentDeptName1'
  },
  {
    title: '区域',
    dataIndex: 'parentDeptName2'
  },
  {
    title: '分馆',
    dataIndex: 'parentDeptName3'
  },
  {
    title: '操作日期',
    dataIndex: 'createDate',
    customRender: (text, record) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '缴费日期',
    dataIndex: 'tradeDate',
    customRender: (text, record) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '资源录入日期',
    dataIndex: 'stuUserCreateDate',
    customRender: (text, record) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '缴费金额',
    dataIndex: 'price'
  },
  {
    title: '资源来源',
    dataIndex: 'source'
  },
  {
    title: '资源渠道',
    dataIndex: 'channelName',
    ellipsis: true
  },
  {
    title: '支付方式',
    dataIndex: 'modeOfPayment'
  },
  {
    title: '缴费类型',
    dataIndex: 'type'
  },
  {
    title: '手续费',
    dataIndex: 'serviceCharge'
  },
  {
    title: '到账金额',
    dataIndex: 'paidPrice'
  },
  {
    title: '到账日期',
    dataIndex: 'confirmDate',
    customRender: (text, record) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName'
  },
  {
    title: '学员手机号',
    dataIndex: 'stuPhone'
  },
  {
    title: '人群',
    dataIndex: 'stuType'
  }
]

export const privateClassStatisticsColumns = [
  {
    title: '地区',
    dataIndex: 'area'
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    ellipsis: true
  },
  {
    title: '联系方式',
    dataIndex: 'stuPhone'
  },
  {
    title: '学员人群',
    dataIndex: 'stuType',
    customRender: (text, record) => {
      return text == 'A' ? '成人' : text == 'B' ? '少儿' : ''
    }
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo'
  },
  {
    title: '学员总课时',
    dataIndex: 'totalCount'
  },
  {
    title: '所属顾问',
    dataIndex: 'orgUserAdviser'
  },
  {
    title: '开卡时间',
    dataIndex: 'startDate',
    customRender: (text, record) => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '班级',
    dataIndex: 'className',
    ellipsis: true
  },
  {
    title: '班级状态',
    dataIndex: 'state',
    customRender: (text, record) => {
      return text === 'A' ? '计划中' : text === 'B' ? '开课中' : text === 'C' ? '已结业' : text === 'D' ? '停课' : ''
    }
  },
  {
    title: '分摊分馆',
    dataIndex: 'deptName'
  },
  {
    title: '分摊比例',
    dataIndex: 'splitRatio',
    customRender: (text, record) => {
      return text ? text + '%' : ''
    }
  },
  {
    title: '学员总课时（分摊）',
    dataIndex: 'splitRatioCount'
  },
  {
    title: '已上课时数',
    dataIndex: 'all'
  },
  // {
  //   title: '当月上课时数',
  //   dataIndex: 'now'
  // },
  {
    title: '剩余课时数',
    dataIndex: 'totalNotUseCount'
  }
]

export const refundStatisticColumns = [
  {
    title: '区域',
    dataIndex: 'parDeptName'
  },
  {
    title: '付款分馆',
    dataIndex: 'deptName'
  },
  {
    title: '业绩分馆',
    dataIndex: 'achDeptName'
  },
  {
    title: '提交日期',
    dataIndex: 'createDate'
  },
  {
    title: '付款日期',
    dataIndex: 'tradeDate'
  },
  {
    title: '来源一级',
    dataIndex: 'source'
  },
  {
    title: '来源二级',
    dataIndex: 'channelName',
    width: 300
  },
  {
    title: '卡种',
    dataIndex: 'eduCardName',
    width: 300
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo'
  },
  {
    title: '人群',
    dataIndex: 'crowdType',
    customRender: (text, record) => {
      return text === 'B' ? '少儿' : text === 'A' ? '成人' : text === 'C' ? '通用' : ''
    }
  },
  {
    title: '年龄段',
    dataIndex: 'ageStart',
    customRender: (text, record) => {
      if (record.ageStart && record.ageEnd) {
        return record.ageStart + '-' + record.ageEnd
      } else {
        return ''
      }
    }
  },
  {
    title: '老师',
    dataIndex: 'teacherName'
  },
  {
    title: '上课时间',
    dataIndex: 'lastClassDate',
    customRender: (text, record) => {
      return text
    }
  },
  {
    title: '是否开卡',
    dataIndex: 'openCard'
  },
  {
    title: '班型（大）',
    dataIndex: 'eduTypeName'
  },
  {
    title: '班型（小）',
    dataIndex: 'eduClassTypeName'
  },
  {
    title: '舞种',
    dataIndex: 'eduDanceName'
  },
  {
    title: '办卡日期',
    dataIndex: 'cardCreateDate'
  },
  {
    title: '办卡金额',
    dataIndex: 'cardValue'
  },
  {
    title: '上课情况',
    dataIndex: 'classSit'
  },
  {
    title: '开卡日期',
    dataIndex: 'cardStartDate'
  },
  {
    title: '开卡天数',
    dataIndex: 'activDay'
  },
  {
    title: '扣除课耗',
    dataIndex: 'consumePrice'
  },
  {
    title: '学籍管理费',
    dataIndex: 'extraPrice'
  },
  {
    title: '扣费合计',
    dataIndex: 'totalRefund'
  },
  {
    title: '退费金额',
    dataIndex: 'userEnrollPrice'
  },
  {
    title: '退费原因',
    dataIndex: 'reason'
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName'
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone'
  },
  {
    title: '退费单号',
    dataIndex: 'procinstNo'
  }
]
