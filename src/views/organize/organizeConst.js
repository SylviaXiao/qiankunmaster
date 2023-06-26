export const allocationColunm = [
  {
    title: '负责人',
    dataIndex: 'userName',
    key: 'userName',
    scopedSlots: { customRender: 'userName' }
  },
  {
    title: '地区',
    dataIndex: 'deptName',
    key: 'deptName',
    scopedSlots: { customRender: 'deptName' }
  },
  {
    title: '人群',
    dataIndex: 'trCrowd',
    customRender: (text, record) => {
      const dataMap = [{ id: '1', name: '成人' }, { id: '2', name: '少儿' }]
      let data = text ? text.split(',') : []
      return dataMap.filter(d => data.includes(d.id))?.map(d => d.name)?.join(',')
    }
  },
  {
    title: '查看数据舞种',
    dataIndex: 'eduDanceName',
    key: 'eduDanceName'
  },
  {
    title: '打分推送舞种',
    dataIndex: 'eduDanceAllocName',
    key: 'eduDanceAllocName'
  },

  {
    title: '职位',
    dataIndex: 'positionName',
    key: 'positionName',
    scopedSlots: { customRender: 'positionName' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export const allocationFinColunm = [
  {
    title: '负责人',
    dataIndex: 'userName',
    key: 'userName',
    scopedSlots: { customRender: 'userName' }
  },
  {
    title: '分馆',
    dataIndex: 'schools',
    key: 'schools'
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
