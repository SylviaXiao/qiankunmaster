import moment from 'moment'

export const roleColumns = [
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    width: 60,
    scopedSlots: {
      customRender: 'avatar'
    }
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo',
    scopedSlots: {
      customRender: 'stuNo'
    }
  },
  {
    title: '学员名称',
    dataIndex: 'stuName',
    key: 'stuName',
    scopedSlots: {
      customRender: 'stuName'
    }
  },
  {
    title: '联系电话',
    dataIndex: 'stuPhone',
    key: 'stuPhone'
  },
  {
    title: '人群分类',
    dataIndex: 'stuType',
    key: 'stuType',
    customRender: text => {
      if (text === 'A') {
        return '成人'
      } else if (text === 'B') {
        return '少儿'
      } else {
        return ''
      }
    }
  },
  {
    title: '身份证号',
    dataIndex: 'stuIdcard',
    key: 'stuIdcard'
  },
  {
    title: '生日',
    dataIndex: 'stuBirthday',
    key: 'stuBirthday',
    customRender: text => {
      text ? (text = moment(text, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')) : (text = null)
      return text
    }
  },
  {
    title: '省市',
    dataIndex: 'stuArea',
    key: 'stuArea'
  },
  {
    title: '顾问',
    dataIndex: 'adviserName',
    key: 'adviserName'
  },

  // {
  //   title: '上次跟进时间',
  //   dataIndex: 'createDate',
  //   key: 'createDate',
  //   scopedSlots: {
  //     customRender: 'createDate'
  //   }
  // },
  // {
  //   title: '下次跟进时间',
  //   dataIndex: 'logDate',
  //   key: 'logDate'
  // },
  // {
  //   title: '状态',
  //   dataIndex: 'stuState',
  //   key: 'stuState',
  //   customRender: text => {
  //     text = text === 'A' ? '正常' : text === 'B' ? '停课' : text === 'C' ? '退班' : ''
  //     return text
  //   }
  // },
  {
    title: '操作',
    key: 'action',
    width: 200,
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export const cardColumns = [
  {
    title: '上课分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    fixed: 'left'
  },
  {
    title: '办卡分馆',
    dataIndex: 'createDeptName',
    key: 'createDeptName',
    fixed: 'left'
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo',
    fixed: 'left',
    scopedSlots: { customRender: 'stuCardNo' }
  },
  {
    title: '卡种',
    dataIndex: 'cardName',
    key: 'cardName',
    fixed: 'left',
    scopedSlots: { customRender: 'cardName' }
  },
  {
    title: '班级',
    dataIndex: 'className',
    scopedSlots: { customRender: 'className' }
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    key: 'typeName'
  },
  {
    title: '舞蹈种类',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '卡类型',
    dataIndex: 'experience',
    key: 'experience',
    customRender: (text, record) => {
      return text ? '体验卡' : '正式卡'
    }
  },
  {
    title: '卡状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: {
      customRender: 'status',
      filterDropdown: 'filterDropdown',
      filterIcon: 'filterIcon'
    },
    customRender: text => {
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
    title: '卡属性',
    dataIndex: 'ctype',
    customRender: (text, record) => {
      return text === 'A' ? '正常' : text === 'B' ? '赠卡' : text === 'C' ? '老卡' : ''
    }
  },
  {
    title: '办卡日期',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'createDate' }
  },
  {
    title: '激活时间',
    dataIndex: 'startDate',
    key: 'startDate',
    scopedSlots: {
      customRender: 'startDate'
    }
  },
  {
    title: '有效期截止',
    dataIndex: 'endDate',
    key: 'endDate',
    scopedSlots: {
      customRender: 'endDate'
    }
  },
  {
    title: '实收/应收/原价',
    dataIndex: 'totalPrice',
    scopedSlots: { customRender: 'totalPrice' }
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    scopedSlots: { customRender: 'payoff' }
  },
  {
    title: '使用/总次数',
    scopedSlots: {
      customRender: 'availableCount'
    },
    key: 'availableCount'
  },
  {
    title: '续卡状态',
    dataIndex: 'finCardStatus',
    customRender:val => {
      return val === 'A' ? '未确认' : val === 'B' ? '已确认' : val === 'C' ? '已作废' : val
    }
  },
  {
    title: '操作',
    fixed: 'right',
    scopedSlots: {
      customRender: 'action'
    },
    key: 'action'
  }
]
export const cardColumnsSimple = [
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo',
    scopedSlots: { customRender: 'stuCardNo' }
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName'
  },
  {
    title: '班级',
    dataIndex: 'className',
    scopedSlots: { customRender: 'className' }
  },
  {
    title: '班型',
    dataIndex: 'typeName',
    key: 'typeName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '办卡日期',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'createDate' }
  },
  {
    title: '激活时间',
    dataIndex: 'startDate',
    key: 'startDate',
    scopedSlots: {
      customRender: 'startDate'
    }
  },
  {
    title: '有效期截止',
    dataIndex: 'endDate',
    key: 'endDate',
    scopedSlots: {
      customRender: 'endDate'
    }
  },
  {
    title: '实用/总次数',
    scopedSlots: {
      customRender: 'availableCount'
    },
    key: 'availableCount'
  }
]
export const accountColumns = [
  {
    title: '缴费日期',
    dataIndex: 'paidDate',
    key: 'paidDate'
  },
  {
    title: '缴费退费',
    dataIndex: 'price1',
    key: 'price1',
    customRender: (text, record) => {
      const type = record.type
      let value = ''
      if (record.price) {
        value = record.price
      }
      return type === 'A' || type === 'C' || type === 'D' ? value : ''
    }
  },
  {
    title: '办卡退卡',
    dataIndex: 'price2',
    key: 'price2',
    customRender: (text, record) => {
      const type = record.type
      let value = ''
      if (record.price) {
        value = record.price
      }
      return type === 'B' || type === 'F' || type === 'E' ? value : ''
    }
  },
  {
    title: '可用余额',
    dataIndex: 'balance',
    key: 'balance'
  },
  {
    title: '缴费方式',
    dataIndex: 'payType',
    key: 'payType'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '经手人',
    dataIndex: 'userName',
    key: 'userName'
  }
]
export const studentOutputColumns = [
  {
    title: '录入日期',
    dataIndex: 'createDate',
    key: 'createDate',
    customRender: (text, record) => {
      return text.split(' ')[0]
    }
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '手机号',
    dataIndex: 'stuPhone',
    key: 'stuPhone'
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: '地区',
    dataIndex: 'stuArea',
    key: 'stuArea'
  },
  {
    title: '身份',
    dataIndex: 'identity',
    key: 'identity',
    ellipsis: true
  },
  {
    title: '住宿',
    dataIndex: 'stay',
    key: 'stay',
    customRender: (text, record) => {
      return text === 'A' ? '住宿' : text === 'B' ? '不住宿' : ''
    }
  },
  {
    title: '性格',
    dataIndex: 'character',
    key: 'character'
  },
  {
    title: '学舞目的',
    dataIndex: 'objective',
    key: 'objective',
    ellipsis: true
  },
  {
    title: '身体情况',
    dataIndex: 'healthy',
    key: 'healthy'
  },
  {
    title: '经济情况',
    dataIndex: 'economic',
    key: 'economic'
  },
  // {
  //   title: '是否交别班定金',
  //   dataIndex: 'deposit',
  //   key: 'deposit',
  //   customRender: (text, record) => {
  //     return text ? '是' : '否'
  //   }
  // },
  // {
  //   title: '定金金额',
  //   dataIndex: 'depositMoney',
  //   key: 'depositMoney'
  // },
  {
    title: '卡种',
    dataIndex: 'cardName',
    key: 'cardName'
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    key: 'payoff',
    scopedSlots: { customRender: 'payoff' }
  },
  {
    title: '是否为转卡学员',
    dataIndex: 'transferCard',
    key: 'transferCard',
    customRender: (text, record) => {
      return text ? '是' : '否'
    }
  },
  {
    title: '预定班次',
    dataIndex: 'scheduledShift',
    key: 'scheduledShift',
    ellipsis: true
  },
  {
    title: '是否连报',
    dataIndex: 'continuousReport',
    key: 'continuousReport',
    customRender: (text, record) => {
      return text ? '是' : '否'
    }
  },
  {
    title: '连报详情',
    dataIndex: 'continuousReportDetail',
    key: 'continuousReportDetail',
    ellipsis: true
  },
  {
    title: '上课模式',
    dataIndex: 'classMode',
    key: 'classMode',
    ellipsis: true
  },
  {
    title: '输出分馆',
    dataIndex: 'outDeptName',
    key: 'outDeptName'
  },
  {
    title: '接收分馆',
    dataIndex: 'inDeptName',
    key: 'inDeptName'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true
  },
  {
    title: '顾问',
    dataIndex: 'adviser',
    key: 'adviser'
  },
  {
    title: '确认状态',
    dataIndex: 'confirm',
    key: 'confirm',
    customRender: (text, record) => {
      return text === 'Y' ? '已确认' : text === 'N' ? '未确认' : ''
    }
  },
  {
    title: '卡状态',
    dataIndex: 'status',
    key: 'status',
    customRender: (text, record) => {
      return text === 'A'
        ? '未使用'
        : text === 'B'
          ? '使用中'
          : text === 'C'
            ? '停课'
            : text === 'D'
              ? '退卡'
              : text === 'E'
                ? '结业'
                : text === 'F'
                  ? '撤销'
                  : text === 'G'
                    ? '结转'
                  : ''
    }
  },
]
