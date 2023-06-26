import store from '@/store'
import router from '@/router'

export function hasBtnPerm(Vm, el) {
  return new Promise((resolve, reject) => {
    const pathForPerm = new Array()
    store.getters.roles.permissionList[0] == '*' ? Vm.superAdmin = true : Vm.superAdmin = false
    const btnObj = new Object()
    store.getters.roles.permissionList.forEach(item => {
      btnObj[item] = item
      // const newStr = item.replace(/:/g, '/')
      // if (claCount(newStr, '/') == 2) {
      //   pathForPerm.push(newStr)
      // }
    })

    // let newPast = '', btn = '', btnObj = new Object()
    // pathForPerm.forEach(str => {
    //   newPast = str.slice(0, str.lastIndexOf('/'))
    //   btn = str.slice(str.lastIndexOf('/') + 1)
    //   if (newPast == Vm.$route.fullPath.slice(1)) {
    //     btnObj[btn] = btn
    //   }
    // })
    Vm.btnPerm = btnObj
    resolve()
  })
}


function claCount(str, ele) {
  let count = 0,
    pos = str.indexOf(ele)
  while (pos !== -1) {
    count++
    pos = str.indexOf(ele, pos + 1)
  }
  return count
}