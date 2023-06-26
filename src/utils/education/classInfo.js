import moment from 'moment'
export const roleColumns = [
  {
    title: '学员名称',
    dataIndex: 'stuName',
    key: 'stuName',
    scopedSlots: { customRender: 'stuName' }
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo',
    scopedSlots: { customRender: 'stuCardNo' }
  },
  {
    title: '卡名称',
    dataIndex: 'cardName',
    key: 'cardName'
  },
  {
    title: '联系电话',
    dataIndex: 'stuPhone',
    key: 'stuPhone'
  },
  {
    title: '使用/总次数',
    dataIndex: 'usedCount',
    key: 'usedCount',
    scopedSlots: { customRender: 'usedCount' }
  },
  {
    title: '首次上课时间',
    dataIndex: 'activationDate',
    key: 'activationDate'
  },
  {
    title: '最后一次上课时间',
    dataIndex: 'lastClassDate',
    key: 'lastClassDate'
  },
  {
    title: '有效期截止',
    dataIndex: 'endDate',
    key: 'endDate',
    customRender: text => {
      return text ? moment(text).subtract(1, 'seconds').format('YYYY-MM-DD HH:mm'): ''
    }
  },
  {
    title: '卡状态',
    dataIndex: 'status',
    key: 'status',
    customRender: text => {
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
  {
    title: '实收/应收/原价',
    scopedSlots: {
      customRender: 'availableCount'
    },
    key: 'availableCount'
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    scopedSlots: { customRender: 'payoff' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export const addStudentColumns = [
  {
    title: '学员名称',
    dataIndex: 'stuName',
    key: 'stuName'
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName'
  },
  {
    title: '联系电话',
    dataIndex: 'stuPhone',
    key: 'stuPhone'
  }
]
export const classPlanColumnsY = [
  {
    title: '上课日期',
    dataIndex: 'startDate',
    key: 'startDate',
    customRender: text => {
      return text.substr(0, 10)
    }
  },
  {
    title: '上课时间',
    dataIndex: 'duration',
    key: 'duration',
    scopedSlots: {
      customRender: 'duration'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    // customRender: text => {
    //   return text.substr(0, 10)
    // }
  },
  {
    title: '排课分馆',
    dataIndex: 'roomSchoolName',
    key: 'roomSchoolName',
    width: 200
  },
  {
    title: '教室',
    dataIndex: 'roomName',
    key: 'roomName'
  },
  {
    title: '计划上课导师',
    dataIndex: 'teachers',
    key: 'teachers',
    scopedSlots: { customRender: 'teachers' }
  },
  {
    title: '签到导师',
    dataIndex: 'signTeachers',
    key: 'signTeachers'
  },
  // {
  //   title: '上课状态',
  //   dataIndex: 'status',
  //   key: 'status',
  //   customRender: text => {
  //     // text = text === 'N'?'未上课':'已上课'
  //     // Y:已上课，N：未上课，A：停课
  //     return text == 'Y' ? '已上课' : text == 'N' ? '未上课' : '停课'

  //   }
  // },
  {
    title: '薪酬类型',
    dataIndex: 'salTypeName',
    key: 'salTypeName'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

export const classPlanColumnsT = [
  {
    title: '上课日期',
    dataIndex: 'startDate',
    key: 'startDate',
    customRender: text => {
      return text.substr(0, 10)
    }
  },
  {
    title: '上课时间',
    dataIndex: 'duration',
    key: 'duration'
  },
  {
    title: '教室',
    dataIndex: 'roomName',
    key: 'roomName'
  },
  {
    title: '上课状态',
    dataIndex: 'planStatus',
    key: 'planStatus',
    customRender: text => {
      return text == 'Y' ? '已上课' : text == 'N' ? '未上课' : '停课'
    }
  },
  {
    title: '薪酬类型',
    dataIndex: 'salTypeName',
    key: 'salTypeName'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {
      customRender: 'action'
    }
  }
]

export const classPlanColumnsN = [
  {
    title: '上课日期',
    dataIndex: 'startDate',
    key: 'startDate',
    customRender: text => {
      return text.substr(0, 10)
    }
  },
  {
    title: '上课时间',
    dataIndex: 'duration',
    key: 'duration'
  },
  {
    title: '教室',
    dataIndex: 'roomName',
    key: 'roomName'
  },
  {
    title: '上课状态',
    dataIndex: 'status',
    key: 'status',
    customRender: text => {
      return text == 'Y' ? '已上课' : text == 'N' ? '未上课' : '停课'
    }
  },
  {
    title: '薪酬类型',
    dataIndex: 'salTypeName',
    key: 'salTypeName'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
