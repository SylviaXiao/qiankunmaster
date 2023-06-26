export const formItemLayout = {
  labelCol: {
    lg: { span: 6 },
    md: { span: 6 },
    xs: { span: 8 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 12 },
    md: { span: 12 },
    xs: { span: 14 },
    sm: { span: 12 }
  }
}

export const columnsReg = [
  {
    title: '编号',
    dataIndex: 'stuCardNo',
    key: 'stuCardNo'
  },
  {
    title: '姓名',
    dataIndex: 'stuName',
    key: 'stuName'
  },
  {
    title: '电话',
    dataIndex: 'stuPhone',
    key: 'stuPhone'
  },
  {
    title: '办卡状态',
    dataIndex: 'stuState',
    key: 'stuState',
    customRender: (text, record) => text === 'A'?'办卡':text === 'B'? '激活':text === 'C'?'停课': text === 'E'?'结业': text === 'F'
      ? '撤销'
      : text === 'G'
        ? '结转':''
  }
]
