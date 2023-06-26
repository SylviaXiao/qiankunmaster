import moment from 'moment'
export const adviserColumns = [
  {
    title: '录入日期',
    dataIndex: 'createDate',
    scopedSlots: { customRender: 'userCopy' },
    key: 'createDate',
    width: 170,
    fixed: 'left'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    scopedSlots: { customRender: 'userName' },
    key: 'userName',
    width: 140,
    fixed: 'left'
  },
  {
    title: 'QQ号',
    dataIndex: 'userQQ',
    key: 'userQQ',
    width: 140
  },
  {
    title: '微信号',
    dataIndex: 'userWechat',
    key: 'userWechat',
    width: 200
  },
  {
    title: '手机号码',
    dataIndex: 'userPhone',
    key: 'userPhone',
    width: 140
  },

  {
    title: '来源省市',
    dataIndex: 'userArea',
    key: 'userArea',
    width: 200
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName',
    width: 100
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    key: 'typeName',
    customRender: (text, record) => {
      if (!text) {
        return '不限'
      } else {
        return text
      }
    },
    width: 100
  },
  // {
  //   title: '班型',
  //   dataIndex: 'classTypeName',
  //   key: 'classTypeName',
  //   width: 200
  // },
  {
    title: '资源来源',
    dataIndex: 'userSource',
    key: 'userSource',
    width: 200
  },
  {
    title: '摘要备注',
    dataIndex: 'userRemark',
    key: 'userRemark',
    ellipsis: true,
    width: 300
  },
  // {
  //   title: '报名卡种',
  //   dataIndex: 'firstCardName',
  //   key: 'firstCardName',
  //   width: 150
  // },
  // {
  //   title: '报名金额',
  //   dataIndex: 'firstCardPaidPrice',
  //   key: 'firstCardPaidPrice',
  //   width: 100
  // },
  {
    title: '最后跟进时间',
    dataIndex: 'endDate',
    key: 'endDate',
    width: 150,
    scopedSlots: { customRender: 'endDate' }
  },
  {
    title: '标签',
    dataIndex: 'stuTags',
    key: 'stuTags',
    width: 140,
    scopedSlots: { customRender: 'stuTags' },
    ellipsis: true
  },
  {
    title: '报名日期',
    dataIndex: 'registrationDate',
    key: 'registrationDate',
    width: 140,
    customRender: (text, record) => {
      return text ? text.slice(0, 10) : ''
    }
  },
  {
    title: '客户年龄',
    dataIndex: 'userAge',
    key: 'userAge',
    width: 140
  },
  {
    title: '客户年龄段',
    dataIndex: 'bracketAgeStart',
    key: 'bracketAgeStart',
    width: 140,
    customRender: (text, record) => {
      let { bracketAgeStart, bracketAgeEnd } = record
      if (bracketAgeStart) {
        return bracketAgeStart + '-' + bracketAgeEnd
      } else {
        return ''
      }
    },
    ellipsis: true
  },
  {
    title: '学舞目的',
    dataIndex: 'dancePurpose',
    key: 'dancePurpose',
    width: 140,
    ellipsis: true
  },
  {
    title: '学舞时间',
    dataIndex: 'learningDanceTime',
    key: 'learningDanceTime',
    width: 140,
    customRender: (text, record) => {
      return text
    },
    ellipsis: true
  },

  {
    title: '舞蹈类型',
    dataIndex: 'likeDanceType',
    key: 'likeDanceType',
    width: 140,
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: 90,
    fixed: 'right'
  }
]
export const invalidColumns = [
  {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    width: 170
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    scopedSlots: { customRender: 'userName' },
    key: 'userName',
    width: 140
  },
  {
    title: '手机号',
    dataIndex: 'userPhone',
    key: 'userPhone',
    width: 120
  },
  {
    title: '微信',
    dataIndex: 'userWechat',
    key: 'userWechat',
    width: 120
  },
  {
    title: 'QQ',
    dataIndex: 'userQQ',
    key: 'userQQ',
    width: 120
  },
  {
    title: '资源来源',
    dataIndex: 'userSource',
    key: 'userSource',
    width: 140
  },
  {
    title: '最后跟进时间',
    dataIndex: 'endDate',
    key: 'endDate',
    width: 160
  },
  // {
  //   title: '最后跟进顾问',
  //   dataIndex: 'adviser',
  //   key: 'adviser',
  //   width: 140
  // },
  {
    title: '已失效天数',
    dataIndex: 'expireDays',
    key: 'expireDays',
    customRender: (text, record) => {
      if (!record.updateDate) {
        return 0
      } else {
        let data = new Date().getTime() - new Date(record.updateDate).getTime()
        return (data / 1000 / 60 / 60 / 24).toFixed(0)
      }
    },
    width: 100
  },
  {
    title: '操作人',
    dataIndex: 'setValidUser',
    key: 'setValidUser',
    width: 100,
    customRender: (text, record) => {
      return text || '无'
    }
  }
]
export const foregroundColumns = [
  {
    title: '录入日期',
    dataIndex: 'createDate',
    key: 'createDate',
    scopedSlots: { customRender: 'userCopy' },
    width: 170,
    fixed: 'left'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
    scopedSlots: { customRender: 'userName' },
    width: 140,
    fixed: 'left'
  },
  {
    title: 'QQ号',
    dataIndex: 'userQQ',
    width: 140,
    key: 'userQQ'
  },
  {
    title: '微信号',
    dataIndex: 'userWechat',
    width: 200,
    key: 'userWechat'
  },
  {
    title: '手机号码',
    dataIndex: 'userPhone',
    key: 'userPhone',
    width: 140
  },

  {
    title: '来源省市',
    dataIndex: 'userArea',
    width: 200,
    key: 'userArea'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    width: 100,
    key: 'danceName'
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    width: 100,
    key: 'typeName',
    customRender: (text, record) => {
      if (!text) {
        return '不限'
      } else {
        return text
      }
    }
  },
  // {
  //   title: '班型',
  //   dataIndex: 'classTypeName',
  //   key: 'classTypeName',
  //   width: 100
  // },
  {
    title: '资源来源',
    dataIndex: 'userSource',
    width: 120,
    key: 'userSource'
  },
  {
    title: '资源状态',
    dataIndex: 'channelStatus',
    key: 'channelStatus',
    width: 100,
    customRender: (text, record) => {
      return !record.adviserName || record.adviserName == null ? '未分配' : '已分配'
    }
  },
  {
    title: '分配分馆',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 180
  },
  {
    title: '分单分馆',
    dataIndex: 'spitDeptName',
    key: 'spitDeptName',
    width: 180,
    ellipsis: true
  },
  // {
  //   title: '摘要备注',
  //   dataIndex: 'userRemark',
  //   key: 'userRemark'
  // },
  // {
  //   title: '到访/预约',
  //   dataIndex: 'userVisit/userAudition ',
  //   key: 'userVisit/userAudition ',
  //   customRender: (text, record) => {
  //     //是否到访（Y:已到访,N:未到访）
  //     // 试学状态（Y:已体验,N:已预约,W:未预约）
  //     const { userVisit, userAudition } = record
  //     return `${userVisit == 'Y' ? '已到访' : '未到访'}/${userAudition == 'Y' ? '已体验' : userAudition == 'N' ? '已预约' : '未预约'}`
  //   }
  // },
  // {
  //   title: '最后跟进时间',
  //   dataIndex: 'endDate',
  //   key: 'endDate',
  //   scopedSlots: { customRender: 'endDate' }
  // },
  {
    title: '跟进顾问',
    dataIndex: 'adviserName',
    width: 100,
    key: 'adviserName'
  },
  {
    title: '标签',
    dataIndex: 'stuTags',
    key: 'stuTags',
    width: 140,
    scopedSlots: { customRender: 'stuTags' },
    ellipsis: true
  },
  {
    title: '报名日期',
    dataIndex: 'registrationDate',
    key: 'registrationDate',
    width: 140,
    customRender: (text, record) => {
      return text ? text.slice(0, 10) : ''
    }
  },
  {
    title: '客户年龄',
    dataIndex: 'userAge',
    key: 'userAge',
    width: 140
  },
  {
    title: '客户年龄段',
    dataIndex: 'bracketAgeStart',
    key: 'bracketAgeStart',
    width: 140,
    customRender: (text, record) => {
      let { bracketAgeStart, bracketAgeEnd } = record
      if (bracketAgeStart) {
        return bracketAgeStart + '-' + bracketAgeEnd
      } else {
        return ''
      }
    },
    ellipsis: true
  },
  {
    title: '学舞目的',
    dataIndex: 'dancePurpose',
    key: 'dancePurpose',
    width: 140,
    ellipsis: true
  },
  {
    title: '学舞时间',
    dataIndex: 'learningDanceTime',
    key: 'learningDanceTime',
    width: 140,
    customRender: (text, record) => {
      return text
    },
    ellipsis: true
  },

  {
    title: '舞蹈类型',
    dataIndex: 'likeDanceType',
    key: 'likeDanceType',
    width: 140,
    ellipsis: true
  },
  // {
  //   title: '报名卡种',
  //   dataIndex: 'firstCardName',
  //   width: 150,
  //   key: 'firstCardName'
  // },
  // {
  //   title: '报名金额',
  //   dataIndex: 'firstCardPaidPrice',
  //   width: 100,
  //   key: 'firstCardPaidPrice'
  // },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: 150,
    fixed: 'right'
  }
]
export const serviceColumns = [
  {
    title: '录入日期',
    dataIndex: 'createDate',
    key: 'createDate',
    scopedSlots: { customRender: 'userCopy' },
    width: 170,
    fixed: 'left'
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    scopedSlots: { customRender: 'userName' },
    key: 'userName',
    width: 140,
    fixed: 'left'
  },
  {
    title: 'QQ号',
    dataIndex: 'userQQ',
    key: 'userQQ',
    width: 140
  },
  {
    title: '微信号',
    dataIndex: 'userWechat',
    width: 200,
    key: 'userWechat'
  },
  {
    title: '手机号码',
    dataIndex: 'userPhone',
    width: 140,
    key: 'userPhone'
  },

  {
    title: '来源省市',
    dataIndex: 'userArea',
    width: 200,
    key: 'userArea'
  },
  {
    title: '资源渠道',
    dataIndex: 'resChannelName',
    width: 350,
    key: 'resChannelName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    width: 100,
    key: 'danceName'
  },
  {
    title: '类型',
    dataIndex: 'typeName',
    width: 100,
    key: 'typeName',
    customRender: (text, record) => {
      if (text === 'null') {
        return '不限'
      } else {
        return text
      }
    }
  },
  // {
  //   title: '班型',
  //   dataIndex: 'classTypeName',
  //   key: 'classTypeName',
  //   width: 100
  // },

  {
    title: '资源状态',
    dataIndex: 'channelStatus',
    width: 100,
    key: 'channelStatus',
    customRender: (text, record) => {
      return !record.adviserName || record.adviserName == null ? '未分配' : '已分配'
    }
  },
  // {
  //   title: '摘要备注',
  //   dataIndex: 'userRemark',
  //   key: 'userRemark'
  // },

  {
    title: '分配分馆',
    dataIndex: 'schoolName',
    width: 120,
    key: 'schoolName'
  },
  {
    title: '分单分馆',
    dataIndex: 'spitDeptName',
    key: 'spitDeptName',
    width: 180,
    ellipsis: true
  },
  // {
  //   title: '到访/预约',
  //   dataIndex: 'userVisit/userAudition ',
  //   key: 'userVisit/userAudition ',
  //   customRender: (text, record) => {
  //     //是否到访（Y:已到访,N:未到访）
  //     // 试学状态（Y:已体验,N:已预约,W:未预约）
  //     const { userVisit, userAudition } = record
  //     return `${userVisit == 'Y' ? '已到访' : '未到访'}/${userAudition == 'Y' ? '已体验' : userAudition == 'N' ? '已预约' : '未预约'}`
  //   }
  // },
  // {
  //   title: '最后跟进时间',
  //   dataIndex: 'endDate',
  //   key: 'endDate',
  //   scopedSlots: { customRender: 'endDate' }
  // },
  {
    title: '客服人员',
    dataIndex: 'userSource',
    width: 120,
    key: 'userSource',
    scopedSlots: { customRender: 'userSource' }
  },
  {
    title: '跟进顾问',
    dataIndex: 'adviserName',
    width: 120,
    key: 'adviserName'
  },
  {
    title: '标签',
    dataIndex: 'stuTags',
    key: 'stuTags',
    width: 140,
    scopedSlots: { customRender: 'stuTags' },
    ellipsis: true
  },
  {
    title: '报名日期',
    dataIndex: 'registrationDate',
    key: 'registrationDate',
    width: 140,
    customRender: (text, record) => {
      return text ? text.slice(0, 10) : ''
    }
  },
  {
    title: '客户年龄',
    dataIndex: 'userAge',
    key: 'userAge',
    width: 140
  },
  {
    title: '客户年龄段',
    dataIndex: 'bracketAgeStart',
    key: 'bracketAgeStart',
    width: 140,
    customRender: (text, record) => {
      let { bracketAgeStart, bracketAgeEnd } = record
      if (bracketAgeStart) {
        return bracketAgeStart + '-' + bracketAgeEnd
      } else {
        return ''
      }
    },
    ellipsis: true
  },
  {
    title: '学舞目的',
    dataIndex: 'dancePurpose',
    key: 'dancePurpose',
    width: 140,
    ellipsis: true
  },
  {
    title: '学舞时间',
    dataIndex: 'learningDanceTime',
    key: 'learningDanceTime',
    width: 140,
    customRender: (text, record) => {
      return text
    },
    ellipsis: true
  },

  {
    title: '舞蹈类型',
    dataIndex: 'likeDanceType',
    key: 'likeDanceType',
    width: 140,
    ellipsis: true
  },
  {
    title: '运营人员',
    dataIndex: 'channelName',
    width: 100,
    key: 'channelName'
  },
  // {
  //   title: '报名卡种',
  //   dataIndex: 'firstCardName',
  //   key: 'firstCardName'
  // },
  // {
  //   title: '报名金额',
  //   dataIndex: 'firstCardPaidPrice',
  //   width: 100,
  //   key: 'firstCardPaidPrice'
  // },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    width: 90,
    fixed: 'right'
  }
]

export const bindColumns = [
  {
    title: '卡种名称',
    dataIndex: 'cardName',
    key: 'cardName',
    scopedSlots: { customRender: 'cardName' }
  },
  {
    title: '班型',
    dataIndex: 'classTypeName',
    width: 200,
    key: 'classTypeName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '码状态',
    dataIndex: 'status',
    key: 'status',
    customRender: (text, record) => {
      const { status } = record
      let val = null
      console.log(status)
      switch (status) {
        case 'A':
          val = '未使用'
          break
        case 'B':
          val = '已使用'
          break
        case 'C':
          val = '已作废'
          break
      }
      return val
    }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },

    fixed: 'right'
  }
]
//学舞时间
export const danceTimeList = [
  {
    value: '白天上午',
    string: '白天上午'
  },
  {
    value: '白天下午',
    string: '白天下午'
  },
  {
    value: '晚上',
    string: '晚上'
  },
  {
    value: '周末',
    string: '周末'
  },
  {
    value: '节假日',
    string: '节假日'
  }
]
export const danceTimeListOthers = [
  {
    value: '白天上午',
    string: '白天上午'
  },
  {
    value: '白天下午',
    string: '白天下午'
  },
  {
    value: '晚上',
    string: '晚上'
  },
  {
    value: '周末',
    string: '周末'
  },
  {
    value: '节假日',
    string: '节假日'
  },
  {
    value: '其他',
    string: '其他'
  }
]
//学舞类型
export const danceTypeList = [
  {
    value: '动感',
    string: '动感'
  },
  {
    value: '性感',
    string: '性感'
  },
  {
    value: '酷帅',
    string: '酷帅'
  },
  {
    value: '仙',
    string: '仙'
  },
  {
    value: '柔美',
    string: '柔美'
  }
]
//学舞目的
export const danceAimList = [
  {
    value: '兴趣爱好',
    string: '兴趣爱好'
  },
  {
    value: '自我提升',
    string: '自我提升'
  },
  {
    value: '改善身体',
    string: '改善身体'
  },
  {
    value: '从事舞蹈职业',
    string: '从事舞蹈职业'
  },
  {
    value: '创业',
    string: '创业'
  }
]
export const danceAimListOthers = [
  {
    value: '兴趣爱好',
    string: '兴趣爱好'
  },
  {
    value: '自我提升',
    string: '自我提升'
  },
  {
    value: '改善身体',
    string: '改善身体'
  },
  {
    value: '从事舞蹈职业',
    string: '从事舞蹈职业'
  },
  {
    value: '创业',
    string: '创业'
  },
  {
    value: '其他',
    string: '其他 '
  }
]
