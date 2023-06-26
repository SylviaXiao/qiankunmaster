const tools = {
  isOverdue(date) {
    return !!date ? new Date(date).isOverdue() : false
  },
  isOverTimes(item) {
    if (!item.totalCount || item.totalCount == 0 || item.signed == 'Y') {
      return false
    }
    return Number(item.usedCount) === Number(item.totalCount)
  }
}
export default tools