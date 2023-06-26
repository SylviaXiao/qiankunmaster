
/**
 * 学员卡操作日志业务类型
 */
export const cardBizType = {
    'A': '信息变更',
    'B': '卡种变更',
    'C': '合并',
    'D': '拆分',
    'E': '撤销',
    'F': '退卡',
    'G': '结算',
    'H': '购卡',
    'I': '结业',
    'J': '分馆变更',
    'K': '学员变更'
}

export function getCardBizType(type) {
    return cardBizType[type] || type
}