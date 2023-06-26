import tools from '@/tools/common.js'
export const columnsTea = [
  {
    title: '导师',
    dataIndex: 'teacherName',
    key: 'teacherName',
    width: '33%',
    scopedSlots: { customRender: 'teacherName' }
  },
  {
    title: '顾问',
    dataIndex: 'adviserName',
    key: 'adviserName',
    width: '33%',
    scopedSlots: { customRender: 'adviserName' }
  },
  {
    title: '助教',
    dataIndex: 'asTeacherName',
    key: 'asTeacherName',
    width: '33%',
    scopedSlots: { customRender: 'asTeacherName' }
  }
]
export const columnsOnlineTea = [
  {
    title: '导师',
    dataIndex: 'teacherName',
    key: 'teacherName',
    width: '33%',
    scopedSlots: { customRender: 'teacherName' }
  },
  {
    title: '助教',
    dataIndex: 'asTeacherName',
    key: 'asTeacherName',
    width: '33%',
    scopedSlots: { customRender: 'asTeacherName' }
  }
]

export const columnsStu = [
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    scopedSlots: { customRender: 'avatar' }
  },
  {
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo'
  },
  {
    title: '姓名',
    dataIndex: 'stuName',
    key: 'stuName'
  },
  {
    title: '手机号码',
    dataIndex: 'stuPhone',
    key: 'stuPhone'
  },
  {
    title: '有效期至',
    dataIndex: 'endValidDate',
    key: 'endValidDate',
    customRender: (text, record) => {
      return `${tools.tailor.getDate(text) || '无'}`
    }
  },
  {
    title: '次数/总数',
    dataIndex: 'usedCount',
    key: 'usedCount',
    customRender: (text, record) => {
      return `${record.usedCount}次/${record.totalCount || '不限次数'}`
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export const defaultTeaArr = [
  {
    teaType: 'A'
  },
  {
    teaType: 'B'
  },
  {
    teaType: 'C'
  }
]
