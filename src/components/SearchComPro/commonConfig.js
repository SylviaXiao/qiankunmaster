import moment from 'moment'
import store from '@/store'
export const dateConfig = {
  /**
   * 前台限制，如果是1-3号，则可以查看当天之前所有数据，如果当天是4号以及之后，则只能看当月
   * @param {*} tableCurrent 时间选择器显示的时间
   */
  disableLastMonthAfter3(tableCurrent) {
    let isReception = store.getters.isReception
    // 如果不是前台，则没有限制，否则限制查询条件
    if (!isReception) return false
    let today = moment()
    let month = today.get('month') // 上月
    let day = today.get('date') // 当天

    // 前台看不到前个月的数据，比如现在是9月，无论什么情况也看不到7月以及7月之前的

    // 4号之前可以看上月
    if (day < 4) {
      return tableCurrent.isBefore(today.subtract(1, 'months').startOf('month'))
    }
    // 4号及以后只能看当月
    return tableCurrent.isBefore(today.startOf('month'))
  },
  /**
   * 禁止查询2022年10月01日前的数据
   */
  disableBefore20221001(tableCurrent) {
    return tableCurrent.isBefore(moment('2022-10-01'))
  }
}
