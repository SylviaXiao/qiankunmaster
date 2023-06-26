export const detailedColumns = [
  {
    title: '操作日期',
    key: 'createDate',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'tradeDate' }
  },
  {
    title: '学号',
    key: 'stuNo',
    dataIndex: 'stuNo'
  },
  {
    title: '姓名',
    key: 'stuName',
    dataIndex: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号',
    key: 'stuPhobankNone',
    dataIndex: 'stuPhone'
  },
  {
    title: '缴费类型',
    dataIndex: 'type',
    key: 'type',
    customRender: text => {
      return text === 'A' ? '全款' : text === 'B' ? '定金' : text === 'C' ? '补缴' : text === 'D' ? '退款' : ''
    }
  },
  {
    title: '缴费日期',
    key: 'tradeDate',
    dataIndex: 'tradeDate',
    scopedSlots: { customRender: 'tradeDate' }
  },
  {
    title: '支付方式',
    dataIndex: 'dictValue',
    key: 'dictValue'
  },
  {
    title: '收款金额',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '手续费',
    dataIndex: 'serviceCharge',
    key: 'serviceCharge',
    customRender: text => {
      return Number(text).toFixed(2)
    }
  },
  {
    title: '到账金额',
    scopedSlots: { customRender: 'actualCost' }
  },
  {
    title: '所属分馆',
    dataIndex: 'deptName',
    key: 'deptName'
  },
  {
    title: '顾问业绩',
    dataIndex: 'achPrice',
    key: 'achPrice',
    scopedSlots: { customRender: 'achPrice' }
  },
  {
    title: '导师业绩',
    dataIndex: 'teaPrice',
    key: 'teaPrice',
    scopedSlots: { customRender: 'teaPrice' }
  },
  {
    title: '前台姓名',
    dataIndex: 'recordName',
    key: 'recordName'
  },
  {
    title: '确认人',
    dataIndex: 'confirmName',
    key: 'confirmName'
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]
export const payDetailColumns = [
  {
    title: '提交日期',
    key: 'createDate',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'createDate' }
  },
  {
    title: '学号',
    key: 'stuNo',
    dataIndex: 'stuNo'
  },
  {
    title: '姓名',
    key: 'stuName',
    dataIndex: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号',
    key: 'stuPhone',
    dataIndex: 'stuPhone'
  },
  //  {
  //    title: '银行卡卡号',
  //    key: 'bankNo',
  //    dataIndex: 'bankNo'
  //  },
  //  {
  //    title: '开户行',
  //    key: 'bankName',
  //    dataIndex: 'bankName'
  //  },
  {
    title: '缴费类型',
    dataIndex: 'type',
    key: 'type',
    customRender: (text, record) => {
      return text === 'A'
        ? '全款'
        : text === 'B'
        ? '定金'
        : text === 'C'
        ? '补缴'
        : text === 'D' && record.refundType === 'A'
        ? '退款'
        : text === 'D' && record.refundType === 'B'
        ? '二次退款'
        : ''
    }
  },
  {
    title: '退费金额',
    scopedSlots: { customRender: 'actualCost' }
  },
  {
    title: '上课分馆',
    dataIndex: 'deptName',
    key: 'deptName'
  },
  {
    title: '提交分馆',
    dataIndex: 'subDeptName',
    key: 'subDeptName'
  },
  {
    title: '顾问业绩',
    dataIndex: 'achPrice',
    key: 'achPrice',
    scopedSlots: { customRender: 'achPrice' }
  },
  {
    title: '导师业绩',
    dataIndex: 'teaPrice',
    key: 'teaPrice',
    scopedSlots: { customRender: 'teaPrice' }
  },
  {
    title: '前台姓名',
    dataIndex: 'recordName',
    key: 'recordName'
  },
  {
    title: '审核状态',
    dataIndex: 'approveStatus',
    key: 'approveStatus',
    customRender: text => {
      return text === 'B' ? '审批中' : text === 'C' ? '通过' : text === 'D' ? '驳回' : text === 'E' ? '待上传附件' : ''
    }
  },
  // {
  //   title: '审批步骤',
  //   dataIndex: 'reufundMap',
  //   customRender: (text, record) => {
  //     const { content, reviewer, state } = text || {}
  //     if (content && reviewer && state) {
  //       const stateText = state == -1 ? '驳回' : state == 0 ? '待审批' : state == 1 ? '审批中' : state == 2 ? '通过' : state == 3 ? '撤回' : state == 5 ? '确定' : ''
  //       return `${content}${stateText}-${reviewer}`
  //     }
  //     return record.stepName || ''
  //   }
  // },
  {
    title: '单号',
    dataIndex: 'procinstNo',
    key: 'procinstNo'
  },
  {
    title: '付款时间',
    dataIndex: 'tradeDate',
    key: 'tradeDate',
    scopedSlots: { customRender: 'tradeDate' }
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]
export const achiAdvColumns = [
  {
    title: '业绩所属人工号',
    dataIndex: 'userNo',
    key: 'userNo'
  },
  {
    title: '业绩所属人姓名',
    dataIndex: 'userName',
    key: 'userName'
  },

  {
    title: '业绩状态',
    key: 'state',
    dataIndex: 'state',
    customRender: text => {
      return text === 'Y' ? '已确认' : text === 'N' ? '未确认' : ''
    }
  },

  {
    title: '业绩百分比',
    dataIndex: 'percent',
    key: 'percent',
    customRender: text => {
      return `${text}%`
    }
  },

  {
    title: '备注',
    key: 'remark',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  }
]
export const achiSerColumns = [
  {
    title: '业绩所属人工号',
    dataIndex: 'userNo',
    key: 'userNo'
  },
  {
    title: '业绩所属人姓名',
    dataIndex: 'userName',
    key: 'userName2'
  },

  {
    title: '业绩状态',
    key: 'state',
    dataIndex: 'state',
    customRender: text => {
      return text === 'Y' ? '已确认' : text === 'N' ? '未确认' : ''
    }
  },

  {
    title: '业绩百分比',
    dataIndex: 'percent',
    key: 'percent',
    customRender: text => {
      return `${text}%`
    }
  },

  {
    title: '备注',
    key: 'remark',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  }
]

//门店收入
export const storeRevenueColunm = [
  {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    scopedSlots: { customRender: 'createDate' }
  },
  {
    title: '分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    scopedSlots: { customRender: 'deptName' }
  },
  {
    title: '收入项',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '支付方式',
    dataIndex: 'dictValue',
    key: 'dictValue'
  },
  {
    title: '手续费',
    dataIndex: 'serviceCharge',
    key: 'serviceCharge'
  },
  {
    title: '收支金额(元)',
    dataIndex: 'price',
    key: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '到账金额(元)',
    dataIndex: 'accountPrice',
    key: 'accountPrice',
    customRender: (text, record) => {
      let price = record.price - record.serviceCharge
      return price.toString().indexOf('.') != -1 ? price.toFixed(2) : price
    },
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export const formLayout = {
  labelCol: {
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    sm: {
      span: 16
    }
  }
}

export const InvoiceManagementTable = [
  {
    title: '分馆',
    align: 'center',
    width: 120,
    dataIndex: 'deptName'
  },
  {
    title: '学员姓名',
    width: 120,
    align: 'center',
    dataIndex: 'stuName'
  },
  {
    title: '手机号',
    align: 'center',
    width: 120,
    ellipsis: true,
    dataIndex: 'stuPhone'
  },
  {
    title: '申请时间',
    align: 'center',
    width: 120,
    dataIndex: 'createDate'
  },
  {
    title: '开票抬头',
    align: 'center',
    width: 160,
    ellipsis: true,
    dataIndex: 'title'
  },
  {
    title: '开票方式',
    align: 'center',
    width: 80,
    ellipsis: true,
    dataIndex: 'method',
    customRender: (text, record) => {
      return text ? '企业' : '个人'
    }
  },
  {
    title: '开票类型',
    align: 'center',
    width: 80,
    ellipsis: true,
    dataIndex: 'type',
    customRender: (text, record) => {
      return text === 'A' ? '普票' : text === 'B' ? '专票' : ''
    }
  },
  {
    title: '申请开票金额',
    align: 'center',
    width: 120,
    ellipsis: true,
    dataIndex: 'price'
  },
  {
    title: '实际开票金额',
    align: 'center',
    width: 120,
    ellipsis: true,
    dataIndex: 'actualToatlPrice',
    customRender: (val, record) => {
      return val || '/'
    }
  },

  {
    title: '包含班型',
    align: 'center',
    width: 160,
    ellipsis: true,
    dataIndex: 'eduTypeName'
  },
  {
    title: '税号或身份证号',
    align: 'center',
    width: 160,
    ellipsis: true,
    dataIndex: 'ideNumber'
  },
  {
    title: '发票内容',
    align: 'center',
    width: 120,
    ellipsis: true,
    dataIndex: 'content'
  },
  {
    title: '开票公司',
    align: 'center',
    width: 160,
    ellipsis: true,
    customRender: (val, record) => {
      return record.companyName || '/'
    }
  },
  {
    // title: '提交人',
    align: 'center',
    width: 80,
    ellipsis: true,
    dataIndex: 'userName',
    slots: {
      title: 'userNameTitle'
    },
    scopedSlots: { customRender: 'userName' }
  },
  {
    title: '所属顾问',
    width: 100,
    align: 'center',
    ellipsis: true,
    customRender: (val, record) => {
      return record.orgUserAdviserName || '/'
    }
  },
  {
    title: '操作',
    fixed: 'right',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export const InvoiceCancelManagementTable = [
  {
    title: '分馆',
    align: 'center',
    dataIndex: 'deptName'
  },
  {
    title: '学员姓名',
    width: 140,
    align: 'center',
    dataIndex: 'stuName'
  },
  {
    title: '手机号',
    align: 'center',
    dataIndex: 'stuPhone'
  },
  {
    title: '申请时间',
    align: 'center',
    dataIndex: 'createDate'
  },
  {
    title: '开票抬头',
    align: 'center',
    dataIndex: 'title'
  },
  {
    title: '开票方式',
    align: 'center',
    dataIndex: 'method',
    customRender: (text, record) => {
      return text ? '企业' : '个人'
    }
  },
  {
    title: '开票类型',
    align: 'center',
    dataIndex: 'type',
    customRender: (text, record) => {
      return text === 'A' ? '普票' : text === 'B' ? '专票' : ''
    }
  },
  {
    title: '申请开票金额',
    align: 'center',
    dataIndex: 'price'
  },
  {
    title: '实际开票金额',
    align: 'center',
    dataIndex: 'actualToatlPrice',
    customRender: (val, record) => {
      return val || '/'
    }
  },
  {
    title: '包含班型',
    align: 'center',
    dataIndex: 'eduTypeName'
  },
  {
    title: '税号或身份证号',
    align: 'center',
    dataIndex: 'number'
  },
  {
    title: '发票内容',
    align: 'center',
    dataIndex: 'content'
  },
  {
    title: '提交人',
    align: 'center',
    dataIndex: 'userName'
  },
  {
    title: '状态',
    align: 'center',
    customRender: val => {
      return '已作废'
    }
  },
]

export const CancelList = [
  {
    title: '分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    scopedSlots: { customRender: 'deptName' }
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName',
    key: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    key: 'stuPhone',
    scopedSlots: { customRender: 'stuPhone' }
  },
  {
    title: '申请发票时间',
    dataIndex: 'applyDate',
    key: 'applyDate'
  },
  {
    title: '开票抬头',
    dataIndex: 'title',
    scopedSlots: { customRender: 'title' }
  },
  {
    title: '开票类型',
    dataIndex: 'type',
    key: 'type',
    customRender: (text, record) => {
      return text === 'A' ? '普票' : text === 'B' ? '专票' : ''
    }
  },
  {
    title: '开票方式',
    dataIndex: 'method',
    key: 'method',
    customRender: (text, record) => {
      return text === false ? '个人' : text === true ? '企业' : ''
    }
  },
  {
    title: '开票金额',
    dataIndex: 'price',
    key: 'price',
    scopedSlots: {
      customRender: 'price'
    }
  },
  {
    title: '税号或身份证号',
    dataIndex: 'ideNumber',
    key: 'ideNumber',
    scopedSlots: { customRender: 'ideNumber' }
  },
  {
    title: '开户行',
    dataIndex: 'bank',
    key: 'bank',
    scopedSlots: { customRender: 'bank' }
  },
  {
    title: '开户账号',
    dataIndex: 'bankNumber',
    key: 'bankNumber',
    scopedSlots: { customRender: 'bankNumber' }
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    scopedSlots: { customRender: 'address' }
  },
  {
    title: '电话',
    dataIndex: 'phone',
    scopedSlots: { customRender: 'phone' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '开票状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    customRender: (text, record) => {
      return text === 'A' ? '待开票' : text === 'B' ? '已开票' : text === 'C' ? '已确认' : text === 'D' ? '已撤销' : text === 'E' ? '已作废' : ''
    }
  }
]
export const wageColunm = [
  {
    title: '职位',
    dataIndex: 'positionName',
    key: 'positionName',
    scopedSlots: { customRender: 'positionName' }
  },
  {
    title: '底薪',
    dataIndex: 'formalSal',
    key: 'formalSal',
    scopedSlots: { customRender: 'formalSal' }
  },
  {
    title: '保底工资',
    dataIndex: 'leastSal',
    key: 'leastSal',
    scopedSlots: { customRender: 'leastSal' }
  },
  {
    title: '提成类型',
    dataIndex: 'subType',
    key: 'subType',
    scopedSlots: { customRender: 'subType' },
    customRender: (text, record) => {
      return text === 'A' ? '分馆' : text === 'B' ? '个人' : ''
    }
  },
  {
    title: '业绩类型',
    dataIndex: 'performanceType',
    key: 'performanceType',
    customRender: (text, record) => {
      return text ? text.replace('A', '新报').replace('B', '续报') : ''
    }
  },
  {
    title: '提成比例',
    dataIndex: 'salcommisions',
    key: 'salcommisions',
    scopedSlots: { customRender: 'salcommisions' }
  },
  {
    title: '早班补贴',
    dataIndex: 'morAllowance',
    key: 'morAllowance',
    scopedSlots: { customRender: 'morAllowance' }
  },
  {
    title: '适用分馆',
    dataIndex: 'mapQueryList',
    key: 'mapQueryList',
    scopedSlots: { customRender: 'mapQueryList' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export const bankListColunm = [
  {
    title: '开户行',
    dataIndex: 'positionName',
    key: 'positionName',
    scopedSlots: { customRender: 'positionName' }
  },
  {
    title: '卡号前6位',
    dataIndex: 'formalSal',
    key: 'formalSal',
    scopedSlots: { customRender: 'formalSal' }
  },
  {
    title: '状态',
    dataIndex: 'leastSal',
    key: 'leastSal',
    scopedSlots: { customRender: 'leastSal' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
