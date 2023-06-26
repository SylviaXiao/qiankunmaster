export const formatDate = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1,                 //月份
    'd+': this.getDate(),                    //日
    'h+': this.getHours(),                   //小时
    'm+': this.getMinutes(),                 //分
    's+': this.getSeconds(),                 //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds()             //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export const roleColumns = [
  {
    title: '上课时间',
    dataIndex: 'duration',
    key: 'duration',
    width:100,
    scopedSlots: { customRender: 'duration' },
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className',
    scopedSlots: { customRender: 'className' },

  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName',
    width:200,
  },
  {
    title: '上课导师',
    dataIndex: 'teachers',
    key: 'teachers',
    scopedSlots: { customRender: 'teachers' },
    width:200,
  },
  {
    title: '顾问',
    dataIndex: 'masterName',
    key: 'masterName',
    width:200,
  },
  {
    title: '教室',
    dataIndex: 'roomName',
    key: 'roomName',
    width:200,
  },
  {
    title: '已签/上课数/总数',
    dataIndex: 'stuLogCount',
    scopedSlots: { customRender: 'stuLogCount' },
    key: 'stuLogCount',
    width:200,
  },
  {
    title: '操作',
    key: 'action',
    width:100,
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
    title: '学号',
    dataIndex: 'stuNo',
    key: 'stuNo'
  },
  {
    title: '联系电话',
    dataIndex: 'stuPhone',
    key: 'stuPhone'
  }
]

export const defaultLayout = {
  labelCol: {
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    sm: {
      span: 14
    }
  }
}
export const defaultLayout2 = {
  labelCol: {
    sm: {
      span: 4
    }
  },
  wrapperCol: {
    sm: {
      span: 14
    }
  }
}
export const bigLayout = {
  labelCol: {
    sm: {
      span: 6
    }
  },
  wrapperCol: {
    sm: {
      span: 18
    }
  }
}
