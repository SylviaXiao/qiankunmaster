//table遍历数组
export const roleColumns = [
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName'
  },
  {
    title: '卡种分类',
    dataIndex: 'cardTypeName',
    key: 'cardTypeName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '班型',
    dataIndex: 'ectName',
    key: 'ectName'
  },
  {
    title: '人群',
    dataIndex: 'crowdType',
    key: 'crowdType',
    customRender: (text, record) => {
      return text === 'B' ? '少儿' : text === 'A' ? '成人' : text === 'C' ? '通用' : ''
    }
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    customRender: (text, record) => {
      return text === 'A' ? '单色' : text === 'B' ? '优鸽' : '通用'
    }
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
    title: '试课卡',
    dataIndex: 'trialCard',
    key: 'trialCard',
    customRender: (text, record) => {
      return text==='Y' ? '是' : '否'
    }
  },
  {
    title: '售卖方式',
    dataIndex: 'saleMode',
    key: 'saleMode',
    customRender: (text, record) => {
      return text == 0 ? '通用' : text == 1 ? '线上' : text == 2 ? '线下' : ''
    }
  },
  {
    title: '金额',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '有效期(天)',
    dataIndex: 'validDay',
    key: 'validDay'
  },
  {
    title: '单节课时(分)',
    dataIndex: 'duration',
    key: 'duration'
  },
  {
    title: '可用次数',
    dataIndex: 'availableCount',
    key: 'availableCount'
  },
  {
    title: '基础次数',
    dataIndex: 'basicCount',
    key: 'basicCount'
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    slots: { title: '状态' },
    scopedSlots: { customRender: 'state' }
  },
  {
    title: '授权分馆',
    dataIndex: 'cardDeptNum',
    key: 'cardDeptNum'
  },
  {
    title: '操作',
    key: 'action',
    width: '200px',
    scopedSlots: { customRender: 'action' }
  }
]
export const formItemLayout = {
  labelCol: {
    xs: { span: 4 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 }
  }
}
export const formItemLayoutH = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 16 }
  }
}
export const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
