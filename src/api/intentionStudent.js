import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
//   deptTree: '/organize/dept/listOrgDeptTree',
//   userById: '/organize/user/pageOrgUser',
//   listOrgMenuTree: '/organize/menu/listOrgMenuTree',
//   saveOrgMenu: '/organize/menu/saveOrgMenu',
//   removeOrgMenu: '/organize/menu/removeOrgMenu',
//   listOrgRole: '/organize/role/listOrgRole',
getAuthList:'/student/audition/listStuAudition',
removeStuUser: '/student/user/removeStuUser',
saveStuUser: '/student/user/saveStuUser',
saveTryStuUser:'/student/audition/saveAudition',//试听学员信息保存
saveTry:'student/audition/saveStuAuditionById',
getStuUserById: '/student/receptionist/getStuUserById',//详情
saveStuUserStatus:'/student/user/saveStuUserStatus/',//更改客户状态
pageStuUsserLog:'/listStuUserLog',//查询沟通时间轴
verifyUserPhone:'/student/receptionist/verifyUserPhone',//手机号码验证
listSysDict:'/system/dict/listSysDict',//支付方式
//   removeOrgDept: '/organize/dept/removeOrgDept',
//   listOrgPosition: '/organize/position/listOrgPosition',
//   saveOrgUser: '/organize/user/saveOrgUser',
//   getUserInfo: '/organize/user/getOrgUser',
//   saveOrgPosition: '/organize/position/saveOrgPosition',
//   removeOrgPosition: '/organize/position/removeOrgPosition',
//   getSysDictList: '/system/dict/getSysDictList',
//   saveSysDict: '/system/dict/saveSysDict',
//   removeSysDict: '/system/dict/removeSysDict/'
pageStuUser:'/student/user/pageSchoolStuUser',
saveToStudent:'/student/user/convert2Student',//转正式
toAuditionNo:'/student/user/toAuditionNo',//转预约试听
toAuditionYo:'/student/user/toAuditionYo',//转已试听
saveStuUserLog:'/saveStuUserLog',//新增沟通记录
}

export function pageStuUser(params) {
  return axios({
    url: api.pageStuUser,
    method: 'get',
    params: params
  })
}
//获取招生来源列表
export function listSysDict(params) {
  return axios({
    url: `${api.listSysDict}/${params}`,
    method: 'get',
  })
}
// 查询试听详情
export function getAuthList(params) {
  return axios({
    url: `${api.getAuthList}/${params}`,
    method: 'get',
  })
}
//
export function saveToStudent(params) {
    return axios({
      url: `${api.saveToStudent}/${params}`,
      method: 'post',

    })
  }
  // 验证手机
  export function verifyUserPhone(params) {
    return axios({
      url: `${api.verifyUserPhone}/${params}`,
      method: 'post',

    })
  }
  // 更改客户状态
  export function saveStuUserStatus(params) {
    return axios({
      url: `${api.saveStuUserStatus}/${params}`,
      method: 'post',

    })
  }
  // 试听修改
  export function saveTry(params) {
    return axios({
      url: `${api.saveTry}/${params.id}/${params.auditionType}`,
      method: 'post',

    })
  }
  //
  export function toAuditionNo(params) {
    return axios({
      url: `${api.toAuditionNo}/${params}`,
      method: 'post',

    })
  }
  export function toAuditionYo(params) {
    return axios({
      url: `${api.toAuditionYo}/${params}`,
      method: 'post',

    })
  }
// export function getUserList(params) {
//   return axios({
//     url: api.userById,
//     method: 'get',
//     params: params
//   })
// }

export function getPermissionTree(params) {
  return axios({
    url: api.listOrgMenuTree,
    method: 'get',
    params: params
  })
}

export function saveTryStuUser(params) {
  return axios({
    url: `${api.saveTryStuUser}/${params.userId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}

// export function removeOrgMenu(params) {
//   return axios({
//     url: `${api.removeOrgMenu}/${params}`,
//     method: 'delete'
//   })
// }

// export function getOrgRole(params) {
//   return axios({
//     url: api.listOrgRole,
//     method: 'get',
//     params: params
//   })
// }

export function removeStuUser(params) {
  return axios({
    url: `${api.removeStuUser}/${params}`,
    method: 'delete'
  })
}
//新增保存
export function saveStuUser(params) {
  return axios({
    url: api.saveStuUser,
    method: 'post',
    data: QS.stringify(params)
  })
}
//新增沟通
export function saveStuUserLog(params) {
  return axios({
    url: `${api.saveStuUserLog}/${params.stuId}`,
    method: 'post',
    data: QS.stringify(params)
  })
}
export function getStuUserById(params) {
  return axios({
    url: `${api.getStuUserById}/${params}`,
    method: 'get'
  })
}
// 查询沟通时间轴
export function pageStuUsserLog(params) {
  return axios({
    url: `${api.pageStuUsserLog}/${params}`,
    method: 'get',

  })
}

// export function saveOrgDept(params) {
//   return axios({
//     url: api.saveOrgDept,
//     method: 'post',
//     data: QS.stringify(params)
//   })
// }

// export function removeOrgDept(params) {
//   return axios({
//     url: `${api.removeOrgDept}/${params}`,
//     method: 'delete'
//   })
// }

// export function listOrgPosition(params) {
//   return axios({
//     url: api.listOrgPosition,
//     method: 'get',
//     params: params
//   })
// }

// export function saveOrgUser(params) {
//   return axios({
//     url: api.saveOrgUser,
//     method: 'post',
//     data: QS.stringify(params)
//   })
// }

// export function getUserInfo(params) {
//   return axios({
//     url: `${api.getUserInfo}/${params}`,
//     method: 'get'
//   })
// }

// export function saveOrgPosition(params) {
//   return axios({
//     url: api.saveOrgPosition,
//     method: 'post',
//     data: QS.stringify(params)
//   })
// }

// export function removeOrgPosition(params) {
//   return axios({
//     url: `${api.removeOrgPosition}/${params}`,
//     method: 'delete'
//   })
// }

// export function getSysDictList(params) {
//   return axios({
//     url: api.getSysDictList,
//     method: 'get',
//     params: params
//   })
// }

// export function saveSysDict(params) {
//   return axios({
//     url: api.saveSysDict,
//     method: 'post',
//     data: QS.stringify(params)
//   })
// }

// export function removeSysDict(params) {
//   return axios({
//     url: `${api.removeSysDict}/${params}`,
//     method: 'delete'
//   })
//}

// 资源删除记录
export const getResourceDeleteList = params => axios.get(`/student/user/pageDeleteStuUser`, {params})