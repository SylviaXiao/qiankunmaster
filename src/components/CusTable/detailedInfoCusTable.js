import tools from '@/tools/common'
export const formatCusTabelData = data => {
  let hidePermission = tools.checkPerm('student:card:refund-all') // 前台和管理员是true , 财务是false   true要隐藏
  if (tools.checkSuperPerm()) {
    hidePermission = false
  }

  const {
    studentCard,
    cardNo,
    cardStatus,
    cardUsed,
    cardTotalCount,
    cardUsedCount,
    dance,
    classType,
    studentName,
    studentPhone,
    enrollDate,
    incomeAchievements = [],
    refundAchievements = [],
    refundNewCards = [],
    // achievements,
    // finTeachers,
    source,
    curator,
    refundReason,
    refundRemark,
    refundPrice,
    isTransferCard,
    transferCardLog,
    consumeCardPrice,
    consumePriceByValidDay, // 扣除课耗有效期
    consumePriceByUsedCount, // 扣除课耗次数
    consumeCardPriceRule, // 扣除课耗规则
    refundInfo,
    originalPrice,
    allPayInfo,
    schoolName,
    cardDetail,
    cardLog,
    totalPayPrice,
    totalOriginalRefundPrice,
    totalRefundPrice
  } = data
  // const achievementsFinTeachers = [...achievements, ...finTeachers]
  const achievementsFinTeachers = []
  const { bank, bankNo, bankUserName, remark, userRelate, userRelateRemark, extraPrice, extraPriceRule, extraPriceDefault, payType } = refundInfo
  const columnsCard = [
    {
      title: '上课分馆',
      dataIndex: 'deptName',
      key: 'deptName'
    },
    {
      title: '办卡分馆',
      dataIndex: 'createDeptName',
      key: 'createDeptName'
    },
    {
      title: '卡号',
      dataIndex: 'stuCardNo',
      key: 'stuCardNo',
      scopedSlots: { customRender: 'stuCardNo' }
    },
    {
      title: '卡种',
      dataIndex: 'cardName',
      key: 'cardName'
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
      title: '卡状态',
      dataIndex: 'status',
      key: 'status',
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
    }
  ]
  const columnsCardLog = [
    {
      title: '操作日期',
      dataIndex: 'logDate',
      width: 250
    },
    {
      title: '卡号',
      dataIndex: 'stuCardNo'
    },
    {
      title: '卡种名称',
      dataIndex: 'cardName'
    },
    {
      title: '转入/转出',
      dataIndex: 'in',
      customRender: (text, record) => {
        if (record.isClassLog) {
          //（A:结业,B:退班）
        } else {
          //（B:转卡,D:退卡）
          const { type, originalClassName, stuName, targetClassName, targetStuName } = record
          if (type == 'B') {
            return `${stuName} 转给 ${targetStuName}`
          } else {
            return '-'
          }
        }
      }
    },
    {
      title: '入班时间',
      dataIndex: 'joinDate',
      scopedSlots: { customRender: 'parseDate' }
    },
    {
      title: '退班/结业时间',
      dataIndex: 'outDate',
      scopedSlots: { customRender: 'parseDate' }
    },
    {
      title: '类型',
      dataIndex: 'type',
      customRender: (text, record) => {
        if (record.isClassLog) {
          //（A:结业,B:退班）
          if (text) {
            switch (text) {
              case 'A':
                return '结业'
                break
              case 'B':
                return '退班'
                break
              default:
                '-'
            }
          } else {
            return '入班'
          }
        } else {
          //（B:转卡,D:退卡）
          switch (text) {
            case 'A':
              return '改卡'
              break
            case 'B':
              return '转卡'
              break
            case 'C':
              return '撤销'
              break
            case 'D':
              return '退卡'
              break
            default:
              '-'
          }
        }
      }
    },
    {
      title: '金额',
      dataIndex: 'price'
    },
    {
      title: '备注',
      dataIndex: 'logRemark'
    }
  ]

  const columnsPrice = [
    {
      title: '缴费日期',
      dataIndex: 'date'
    },
    {
      title: '缴费类型',
      dataIndex: 'type',
      customRender: (text, record) => {
        if (text === 'A') return '全款'
        if (text === 'B') return '定金'
        if (text === 'C') return '补缴'
        if (text === 'D') return '退款'
        return ''
      }
    },
    {
      title: '支付类型',
      dataIndex: 'payType'
    },
    {
      title: '缴费金额',
      dataIndex: 'price'
    }
  ]
  return [
    {
      type: 'row',
      children: [
        {
          type: 'label',
          text: '学员姓名',
          width: 6
        },
        {
          text: studentName ?? '/',
          width: 6
        },
        {
          type: 'label',
          text: '联系方式',
          width: 6
        },
        {
          text: studentPhone ?? '/',
          width: 6
        }
      ]
    },
    {
      type: 'row',
      children: [
        {
          type: 'label',
          text: '报名时间',
          width: 6
        },
        {
          text: (enrollDate => {
            return enrollDate ? enrollDate.substring(0, 10) : ''
          })(enrollDate),
          width: 6
        },
        {
          type: 'label',
          text: '卡状态',
          width: 6
        },
        {
          text: (cardUsed => {
            return cardUsed ? '已使用' : '未使用'
          })(cardUsed),
          width: 6
        }
      ]
    },
    {
      empty: true,
      type: 'row',
      children: [
        {
          type: 'label',
          text: '学员卡号',
          width: 6
        },
        {
          text: cardNo ?? '/',
          width: 6,
          showIcon: !hidePermission,
          title: '学员卡信息',
          columnsCard: columnsCard,
          dataArrCard: cardDetail ? [cardDetail] : [],
          columnsCardLog: columnsCardLog,
          dataArrCardLog: cardLog
        },
        {
          type: 'label',
          text: '上课情况',
          width: 6
        },
        {
          text: `${cardUsedCount ?? ''}/${cardTotalCount || '不限'}`,
          width: 6
        }
      ]
    },
    {
      type: 'row',
      empty: true,
      children: [
        {
          type: 'label',
          text: '是否转卡',
          width: 6
        },
        {
          text: (() => {
            if (isTransferCard) {
              return `是, ${transferCardLog.stuName} 转给 ${transferCardLog.targetStuName}`
            } else {
              return '否'
            }
          })(),
          width: 18
        }
      ]
    },
    {
      type: 'row',
      empty: true,
      children: [
        {
          type: 'label',
          text: '舞种',
          width: 6
        },
        {
          text: dance ?? '/',
          width: 6
        },
        {
          type: 'label',
          text: '班型',
          width: 6
        },
        {
          text: classType ?? '/',
          width: 6
        }
      ]
    },
    {
      type: 'row',
      children: [
        {
          type: 'label',
          text: '缴费金额',
          width: 6
        },
        {
          text: originalPrice + '元',
          width: 6,
          showIcon: !hidePermission,
          title: '缴费明细',
          column: columnsPrice,
          data: allPayInfo,
          other: { totalPayPrice, totalOriginalRefundPrice }
        },
        {
          type: 'label',
          text: '退费金额',
          width: 6
        },
        {
          text: refundPrice + '元',
          width: 6
        }
      ]
    },
    {
      type: 'row',
      empty: true,
      children: [
        {
          type: 'label',
          text: '高转低退差额',
          width: 6
        },
        {
          type: 'row',
          width: 18,
          children:
            refundNewCards && refundNewCards.length
              ? refundNewCards.map(item => {
                  const text = `卡种名称:${item.cardName},实缴金额:${item.cardPrice}元`
                  return {
                    type: 'row',
                    children: [{ width: 24, text }]
                  }
                })
              : []
        }
      ]
    },
    {
      type: 'row',
      children: [
        {
          type: 'label',
          text: '扣除学籍管理费',
          width: 6
        },
        {
          red: (() => {
            if (extraPriceDefault > extraPrice && !hidePermission) return true
            return false
          })(),
          text: extraPrice + '元',
          width: 6
        },
        {
          type: 'label',
          text: '扣除课耗',
          width: 6
        },
        {
          red: (() => {
            if (Math.max(consumePriceByUsedCount ?? 0, consumePriceByValidDay ?? 0) > consumeCardPrice && !hidePermission) return true
            return false
          })(),
          text: consumeCardPrice + '元',
          width: 6
        }
      ]
    },
    {
      empty: true,
      hide: hidePermission,
      type: 'row',
      children: [
        {
          type: 'label',
          text: '扣除学籍管理费默认值',
          width: 6
        },
        {
          text: (extraPriceDefault ?? 0) + '元',
          width: 6
        },
        {
          type: 'label',
          text: '扣除课耗默认值',
          width: 6
        },
        {
          text: `有效期:${consumePriceByValidDay || 0}元,\n次数:${consumePriceByUsedCount || 0}元`,
          width: 6
        }
      ]
    },
    {
      empty: true,
      type: 'row',
      children: [
        {
          type: 'label',
          text: '扣除学籍管理费计算方式',
          width: 6
        },
        {
          text: extraPriceRule ?? '',
          width: 6
        },
        {
          type: 'label',
          text: '扣除课耗计算方式',
          width: 6
        },
        {
          text: consumeCardPriceRule ?? '',
          width: 6
        }
      ]
    },
    {
      empty: true,
      type: 'row',
      children: [
        {
          type: 'label',
          text: '原支付方式',
          width: 6
        },
        {
          text: payType ?? '',
          width: 18
        }
      ]
    },
    {
      type: 'row',
      children: [
        {
          type: 'label',
          text: '退费原因',
          width: 6
        },
        {
          text: refundReason ?? '/',
          width: 6
        },
        {
          type: 'label',
          text: '备注',
          width: 6
        },
        {
          text: refundRemark ?? '/',
          width: 6
        }
      ]
    },
    {
      type: 'row',
      empty: true,
      children: [
        {
          type: 'label',
          text: '实际上课校区',
          width: 6
        },
        {
          text: schoolName ?? '/',
          width: 18
        }
      ]
    },
    {
      type: 'row',
      hide: hidePermission,
      empty: true,
      children: [
        {
          type: 'label',
          text: '缴费分单情况',
          width: 6
        },
        {
          width: 18,
          children:
            incomeAchievements && incomeAchievements.length > 0
              ? incomeAchievements.map(item => {
                  return {
                    type: 'row',
                    children: [
                      {
                        width: 8,
                        redLi: item.serviceStatus === 'N',
                        text: `缴费日期 : ${item.enrollDate && item.enrollDate.substring(0, 10)}\n缴费金额 : ${item.cardPrice}\n资源来源 : ${item.sourceName || item.source}`
                      },
                      {
                        width: 16,
                        children: [...item.achievements, ...item.finTeachers].map(it => {
                          if (it.adviserId) {
                            const { deptName, adviserName, cardAchievementPrice, remark, adviserStatus } = it
                            return {
                              type: 'row',
                              children: [
                                {
                                  width: 24,
                                  redLi: adviserStatus === 'N',
                                  text: (deptName || '') + ';姓名:' + (adviserName || '') + '   ;金额:' + (cardAchievementPrice || '') + '   ;备注:' + (remark || '')
                                }
                              ]
                            }
                          }
                          if (it.teacherId) {
                            const { teacherName, cardAchievementPrice, teacherRatio, teacherRemark, teacherStatus } = it
                            return {
                              type: 'row',
                              children: [
                                {
                                  width: 24,
                                  redLi: teacherStatus === 'N',
                                  text:
                                    '导师:' +
                                    (teacherName || '') +
                                    ';金额:' +
                                    (cardAchievementPrice || '') +
                                    '   ;比例:' +
                                    (teacherRatio ? teacherRatio + '%' : '') +
                                    '   ;备注:' +
                                    (teacherRemark || '')
                                }
                              ]
                            }
                          }
                        })
                      }
                    ]
                  }
                })
              : []
        }
      ]
    },
    {
      type: 'row',
      empty: true,
      children: [
        {
          type: 'label',
          text: '退费分单情况',
          width: 6
        },
        {
          width: 18,
          children:
            refundAchievements && refundAchievements.length > 0
              ? refundAchievements.map(item => {
                  return {
                    type: 'row',
                    children: [
                      {
                        width: 8,
                        text: `退费日期 : ${item.enrollDate && item.enrollDate.substring(0, 10)}\n退费金额 : ${item.enrollPrice}\n资源来源 : ${item.source}`
                      },
                      {
                        width: 16,
                        children: [...item.achievements, ...item.finTeachers].map(it => {
                          if (it.adviserId) {
                            const { deptName, adviserName, price, remark, adviserStatus } = it
                            return {
                              type: 'row',
                              children: [
                                {
                                  width: 24,
                                  redLi: adviserStatus === 'N',
                                  text: (deptName || '') + ';姓名:' + (adviserName || '') + '   ;金额:' + (price || '') + '   ;备注:' + (remark || '')
                                }
                              ]
                            }
                          }
                          if (it.teacherId) {
                            const { teacherName, teacherPrice, teacherRatio, teacherRemark, teacherStatus } = it
                            return {
                              type: 'row',
                              children: [
                                {
                                  width: 24,
                                  redLi: teacherStatus === 'N',
                                  text:
                                    '导师:' +
                                    (teacherName || '') +
                                    ';金额:' +
                                    (teacherPrice || '') +
                                    '   ;比例:' +
                                    (teacherRatio ? teacherRatio + '%' : '') +
                                    '   ;备注:' +
                                    (teacherRemark || '')
                                }
                              ]
                            }
                          }
                        })
                      }
                    ]
                  }
                })
              : []
        }
      ]
    },
    {
      type: 'row',
      children: [
        {
          type: 'label',
          text: '转账方式',
          width: 6
        },
        {
          width: 18,
          children: [
            {
              type: 'row',
              children: [
                {
                  type: 'label',
                  text: '收款人户名',
                  width: 8
                },
                {
                  text: bankUserName,
                  width: 16
                }
              ]
            },
            {
              type: 'row',
              children: [
                {
                  type: 'label',
                  text: '开户行',
                  width: 8
                },
                {
                  text: bank,
                  width: 16
                }
              ]
            },
            {
              type: 'row',
              children: [
                {
                  type: 'label',
                  text: '银行卡号',
                  width: 8
                },
                {
                  text: bankNo,
                  width: 16
                }
              ]
            },
            {
              type: 'row',
              children: [
                {
                  type: 'label',
                  text: '与收款人关系',
                  width: 8
                },
                {
                  text: userRelate,
                  width: 16
                }
              ]
            },
            {
              type: 'row',
              children: [
                {
                  type: 'label',
                  text: '备注',
                  width: 8
                },
                {
                  text: userRelateRemark,
                  width: 16
                }
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'row',
      children: [
        {
          type: 'label',
          text: '顾问签字',
          width: 6
        },
        {
          text: ' ',
          width: 6
        },
        {
          type: 'label',
          text: '馆长签字',
          width: 6
        },
        {
          text: curator,
          width: 6
        }
      ]
    },
    {
      type: 'row',
      children: [
        {
          type: 'label',
          text: '学员/家长签字',
          width: 6
        },
        {
          text: ' ',
          width: 6
        },
        {
          type: 'label',
          text: '退费日期',
          width: 6
        },
        {
          text: (() => {
            return refundInfo.createDate ? refundInfo.createDate.substring(0, 10) : ''
          })(),
          width: 6
        }
      ]
    }
  ]
}
