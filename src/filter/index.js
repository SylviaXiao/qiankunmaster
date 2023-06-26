import moment from 'moment'
export const filters = {
  filterDate(value) {
    return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') : ''
  },
  fixTofloat(value) {
    return value ? parseFloat(value).toFixed(2) : 0
  },
  // 缴费类型filter
  filterPayType(value) {
    if (value === 'A') {
      return '全款'
    } else if (value === 'B') {
      return '定金'
    } else if (value === 'C') {
      return '补缴'
    } else if (value === 'D') {
      return '退款'
    }
    return ''
  },
  subStringDate(v) {
    if (v) {
      return v.substring(0, 10)
    } else {
      return ''
    }
  },
  filterCardStatus(status) {
    if (status === 'A') {
      return '未使用'
    } else if (status === 'B') {
      return '使用中'
    } else if (status === 'C') {
      return '停课'
    } else if (status === 'D') {
      return '退卡'
    } else if (status === 'E') {
      return '结业'
    } else if (status === 'F') {
      return '撤销'
    }
  }
}
