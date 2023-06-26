export const infoColumns = [
  {
    title: '考级时间',
    dataIndex: 'siteDate',
    key: 'siteDate',
    customRender: (text, record) => {
      return text.slice(0, 10)
    }
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '考级名称',
    dataIndex: 'gradeName',
    key: 'gradeName'
  },
  {
    title: '承办单位',
    dataIndex: 'organizerName',
    key: 'organizerName'
  },
  {
    title: '地区',
    dataIndex: 'areaName',
    key: 'areaName'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    customRender: (text, record) => (text === 'A' ? '成人' : text === 'B' ? '少儿' : '')
  },
  {
    title: '提交人数',
    dataIndex: 'studentNum',
    key: 'studentNum'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export const addressColumns = [
  {
    title: '承办单位',
    dataIndex: 'organizerName',
    key: 'organizerName'
  },
  {
    title: '描述',
    dataIndex: 'organizerDesc',
    key: 'organizerDesc'
  },
  {
    title: '排序',
    dataIndex: 'organizerOrder',
    key: 'organizerOrder'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export const columnsCer = [
  {
    title: '姓名',
    dataIndex: 'cerName',
    width: '12%',
    scopedSlots: {
      customRender: 'cerName'
    }
  },
  {
    title: '身份证号码',
    dataIndex: 'cerIdCard',
    width: '15%',
    scopedSlots: {
      customRender: 'cerIdCard'
    }
  },
  {
    title: '性别',
    dataIndex: 'cerSex',
    width: '14%',
    scopedSlots: {
      customRender: 'cerSex'
    }
  },
  {
    title: '生日',
    dataIndex: 'cerBirthday',
    width: '21%',
    scopedSlots: {
      customRender: 'cerBirthday'
    }
  },
  {
    title: '成绩',
    dataIndex: 'cerScore',
    width: '15%',
    scopedSlots: {
      customRender: 'cerScore'
    }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '8%',
    scopedSlots: {
      customRender: 'operation'
    }
  }
]
export const columnsChoose = [
  {
    title: '姓名',
    dataIndex: 'stuName'
  },
  {
    title: '电话',
    dataIndex: 'stuPhone'
  },
  {
    title: '身份证号码',
    dataIndex: 'stuIdCard'
  },
  {
    title: '性别',
    dataIndex: 'stuSex',
    customRender: (text, record) => (text === 'A' ? '男' : text === 'B' ? '女' : '')
  },
  {
    title: '生日',
    dataIndex: 'stuBirthday',
    scopedSlots: {
      customRender: 'stuBirthday'
    }
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
export const formBigLayout = {
  labelCol: {
    sm: {
      span: 3
    }
  },
  wrapperCol: {
    sm: {
      span: 19
    }
  }
}
export const cerRankList = [
  { string: '1级', value: '1级' },
  { string: '2级', value: '2级' },
  { string: '3级', value: '3级' },
  { string: '4级', value: '4级' },
  { string: '5级', value: '5级' },
  { string: '6级', value: '6级' },
  { string: '7级', value: '7级' },
  { string: '8级', value: '8级' },
  { string: '9级', value: '9级' },
  { string: '10级', value: '10级' },
  { string: '11级', value: '11级' },
  { string: '12级', value: '12级' }
]
