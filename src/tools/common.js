import moment from 'moment'
import store from '@/store'
import $message from 'ant-design-vue/es/message'

const tools = {
  formItemLayout: {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 18 },
      sm: { span: 18 }
    }
  },
  formItemLayout2: {
    labelCol: {
      xs: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 14 }
    }
  },
  formItemLayout3: {
    labelCol: {
      xs: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 18 }
    }
  },
  searchGroupLayout: {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 18 },
      sm: { span: 18 }
    }
  },
  aLineItem: {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 20 }
    }
  },
  tailor: {
    getTime(value) {
      return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').format('HH:mm') : ''
    },
    getDate(value) {
      return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') : ''
    },
    getDateTime(value) {
      return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') : ''
    },
    getMonth(value) {
      return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM') : ''
    },
    getStrDate(value) {
      return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDD') : ''
    },
    getDateTimes(value) {
      return value ? moment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm') : ''
    },
    compareToday(value, type = 'days') {
      let t1 = this.getDate(value),
        t2 = this.getDate(moment())
      //返回日期与当前日期的时间差
      return moment(t1).diff(t2, type)
    },
    dateToMoment(value) {
      return value ? moment(value) : null
    },
    getNow() {
      return moment(new Date())
    },
    getNowFormat() {
      return moment(new Date()).format('YYYY-MM-DD')
    },
    // 限制选择时间范围,不能选之前的天 :disabledDate="disabledDate"
    disabledDate(current) {
      return current && current < moment().endOf('day')
    }
  },
  // 去除对象里为'',null的属性
  delUndefined(obj) {
    let result = {}
    for (let k in obj) {
      if (obj[k] || obj[k] == 0) {
        result[k] = obj[k]
      }
    }
    return result
  },
  isSuper() {
    let permList = store.getters.roles.permissionList
    return permList.indexOf('*') !== -1
  },
  //检测权限是否通过
  checkPerm(str) {
    let permList = store.getters.roles.permissionList
    if (permList.indexOf('*') !== -1) {
      return true
    }
    if (str.indexOf('||') !== -1) {
      let permArr = str.split('||')
      return permArr.some(item => {
        return permList.indexOf(item.trim()) !== -1
      })
    }
    // 有"&&"的情况
    if (str.indexOf('&&') !== -1) {
      let permArr = str.split('&&')
      return permArr.every(item => {
        return permList.indexOf(item.trim()) !== -1
      })
    }
    // 什么都没有的情况
    if (str.indexOf('||') === -1 && str.indexOf('&&') === -1) {
      let permStr = str
      return permList.indexOf(permStr) !== -1
    }
  },
  // 
  hasPerm(str) {
    return this.checkPerm(str)
  },

  // 检查是否为超级管理员
  checkSuperPerm() {
    let permList = store.getters.roles.permissionList
    if (permList.indexOf('*') !== -1) {
      return true
    }
  },
  // 去掉树形结构null值
  transNullToArr(data) {
    data.length > 0 &&
      data.forEach((obj, index) => {
        if (obj.hasOwnProperty('children') && !obj.children) {
          obj.children = []
        }
        if (obj.hasOwnProperty('children') && obj.children.length > 0) {
          this.transNullToArr(obj.children)
        }
      })
  },

  //复制

  handleCopy(text) {
    return new Promise((resolve, reject) => {
      let copyUrl = document.createElement('input') //创建一个input框获取需要复制的文本内容
      copyUrl.value = text
      let appDiv = document.getElementById('app')
      appDiv.appendChild(copyUrl)
      copyUrl.select()
      if (document.execCommand('Copy')) {
        copyUrl.remove()
        $message.success('复制成功')
        resolve(true)
      } else {
        copyUrl.remove()
        $message.error('复制失败,请手动复制')
        reject(false)
      }
    })
  },
  //下载
  downloadWithBlob(url, fileName) {
    var eleLink = document.createElement('a')
    eleLink.download = fileName
    eleLink.style.display = 'none'
    // var blob = new Blob([url])
    // eleLink.href = URL.createObjectURL(blob)
    eleLink.href = url
    let appDiv = document.getElementById('app')
    appDiv.appendChild(eleLink)
    eleLink.click()
    appDiv.removeChild(eleLink)
  },
  // 导出excel
  exportExcel(data, fileName = '导出文件') {
    if (!data) {
      console.warn('无下载内容')
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = e => {
      const a = document.createElement('a')
      a.download = `${fileName}.xlsx`
      a.href = e.target.result
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(a.href)
      document.body.removeChild(a)
    }
  },
  // 下载压缩包
  downloadZip(data, fileName = '导出文件') {
    if (!data) {
      console.warn('无下载内容')
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = e => {
      const a = document.createElement('a')
      a.download = `${fileName}.zip`
      a.href = e.target.result
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(a.href)
      document.body.removeChild(a)
    }
  },

  $getFormData(obj) {
    // 参数序列化
    let formData = new FormData()
    Object.keys(obj).forEach(key => {
      formData.append(key, obj[key])
    })
    return formData
  }
}

Date.prototype.isOverdue = function() {
  let nowDate = new Date()
  return this.getTime() <= nowDate.getTime()
  // return (this.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)
}

Date.prototype.format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return fmt
}

Array.prototype.indexOf = function(val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i
  }
  return -1
}
Array.prototype.remove = function(val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}
Array.prototype.equals = function(array) {
  if (!array) return false

  for (let i = 0, l = array.length; i < l; i++) {
    if (this[i] != array[i]) {
      return false
    }
  }
  return true
}
Array.prototype.unique = function(arr) {
  return Array.from(new Set(this))
}
Array.prototype.rewrite = function(obj) {
  //{key:id,label:name}
  this.map(item => {
    for (let k in obj) {
      item[k] = item[obj[k]]
    }
    if (item.chilrden) {
      item.chilrden.rewrite(obj)
    }
  })
}

// var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");

export default tools
