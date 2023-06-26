import Vue from 'vue'
import store from '@/store'

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const perm = Vue.directive('perm', {
  inserted: function(el, binding, vnode) {
    // const actionName = binding.arg
    let permList = store.getters.roles.permissionList
    let str = binding.value

    let hasPerm = false

    // 管理员
    if (permList.indexOf('*') !== -1) {
      hasPerm = true
    }
    if (str.indexOf('||') !== -1) {
      let permArr = str.split('||')
      hasPerm = permArr.some(item => {
        return permList.indexOf(item.trim()) !== -1
      })
    }
    // 有"&&"的情况
    if (str.indexOf('&&') !== -1) {
      let permArr = str.split('&&')
      hasPerm = permArr.every(item => {
        return permList.indexOf(item.trim()) !== -1
      })
    }

    // 
    if (str.indexOf('||') === -1 && str.indexOf('&&') === -1) {
      let permStr = str
      hasPerm = permList.indexOf(permStr) !== -1
    }

    if (!hasPerm) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }

    // const roles = store.getters.roles
    // const elVal = vnode.context.$route.meta.menu
    // const permissionId = elVal instanceof String && [elVal] || elVal
    // roles.permissions.forEach(p => {
    //   if (!permissionId.includes(p.permissionId)) {
    //     return
    //   }
    //   if (p.actionList && !p.actionList.includes(actionName)) {
    //     el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    //   }
    // })
  }
})

export default perm
