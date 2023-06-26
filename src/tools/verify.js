import { verifyUserPhone, verifyContacts } from '@/api/organize'
import { verifyUpdateStudent } from '@/api/recep'
import { verifyTeaPhone } from '@/api/common'

export const RegEx = {
  phone: /^1[3456789]\d{9}$/,
  isNum: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
  isInt: /^[0-9]*$/,
  idCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
  birthDate: /^(?:19\d{2}|20(?:[0-1]\d|9[0-9]|2[0-3]))(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])$/,
  birthDateNew: /^(?:19\d{2}|20(?:[0-1]\d|9[0-9]))(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])$/
}

class Verify {
  static userPhone(rule, value, callback, usedNum) {

    if (value && RegEx.phone.test(value)) {
      if (usedNum && value == usedNum) {
        callback()
      } else {
        userPhone(value)
          .catch(err => {
            callback('该手机号码已存在')
          })
          .finally(() => {
            callback()
          })
      }
    } else {
      callback('请输入正确的手机号码')
    }
  }

  static teaPhone(rule, value, callback, usedNum) {
    if (value && RegEx.phone.test(value)) {
      if (usedNum && value == usedNum) {
        callback()
      } else {
        teaPhone(value)
          .catch(err => {
            callback('该手机号码已存在')
          })
          .finally(() => {
            callback()
          })
      }
    } else {
      callback('请输入正确的手机号码')
    }
  }

  static stuPhone(rule, value, callback, usedNum) {
    if (value && RegEx.phone.test(value)) {
      if (usedNum && value == usedNum) {
        callback()
      } else {
        stuPhone(value)
          .catch(err => {
            callback('该手机号码已存在')
          })
          .finally(() => {
            callback()
          })
      }
    } else {
      callback('请输入正确的手机号码')
    }
  }

  static phone(rule, value, callback, type = 'edit') {
    if (!value) {
      callback()
    } else {
      if (!RegEx.phone.test(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        if (type == 'edit') {
          callback()
        } else {
          verifyUserPhone({ userPhone: value })
            .catch(err => {
              callback(new Error('该手机号已存在'))
            })
            .finally(() => {
              callback()
            })
        }
      }
    }
  }

  // 复制上面的,改了一个接口
  static yixiangPhone(type, oldVal, rule, value, callback, formData, template) {
    // throttle().then(() => {
    const { field } = rule
    let msg = field == 'userPhone' ? '手机号码' : field == 'userQQ' ? 'QQ号码' : '微信号码'
    if (!value) {
      callback()
    } else {
      value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
      if (type == 'edit' && oldVal[field] == value) {
        callback()
        return false
      }
      if (field == 'userQQ') {
        if (!RegEx.isNum.test(value)) {
          // callback('QQ号码必须为数字')
          callback(new Error(`QQ号码必须为数字`))
          return false
        }
      }
      if (field !== 'userPhone') {
        throttle().then(() => {
          verifyContacts(formData)
            .catch(err => {
              callback(new Error(`该信息已存在`))
            })
            .finally(() => {
              callback()
            })
        })
      } else {
        if (formData) {
          formData[field] = formData[field].replace(/^\s\s*/, '').replace(/\s\s*$/, '')
          value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
        }
        if (!( /^1[3456789]\d{9,10}$/).test(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          verifyContacts(formData)
            .catch(err => {
              callback(new Error(`该信息已存在`))
            })
            .finally(() => {
              callback()
            })
        }

      }

    }
    //   callback()
    // })

  }

  static isNum(rule, value, callback) {
    if (!value) {
      callback()
    } else {
      let valueRep = value.toString().replace(/\s/g, '')
      if (!RegEx.isNum.test(valueRep)) {
        callback('必须为数字')
      } else {
        callback()
      }
    }
    //,{rules:[{validator:$verify.isNum}]}
    //
    // if (value && !RegEx.isNum.test(value)) {
    //   callback('必须为数字')
    // } else {
    //   callback()
    // }
  }

  static isInt(rule, value, callback) {
    if (!value) {
      callback()
    } else {
      let valueRep = value.toString().replace(/\s/g, '')
      if (!RegEx.isInt.test(valueRep)) {
        callback('必须为整数')
      } else {
        callback()
      }
    }
  }

  static idCard(rule, value, callback, require = false) {
    let verify = (value && !RegEx.idCard.test(value))
    if (require) {
      verify = !RegEx.idCard.test(value)
    }

    if (verify) {
      callback('身份证格式错误')
    } else {
      callback()
    }
  }

  static lenth(rule, value, callback) {
    //,{rules:[{validator:$verify.lenth}]}
    if (value && value.length > 100) {
      callback('内容请控制在100字以内')
    } else {
      callback()
    }
  }

  static birthDate(rule, value, callback, require = false) {
    let verify = (value && !RegEx.birthDate.test(value))
    if (require) {
      verify = !RegEx.birthDate.test(value)
    }

    if (verify) {
      callback('出生年月日格式错误')
    } else {
      callback()
    }
  }

}


export default Verify


function userPhone(num) {
  return verifyUserPhone({ userPhone: num })
}

function teaPhone(num) {
  return verifyTeaPhone({ phone: num })
}

function stuPhone(num) {
  return verifyUpdateStudent({ stuPhone: num })
}

let timer = null

function throttle() {
  return new Promise((resolve, reject) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      resolve()
    }, 400)
  })
}
