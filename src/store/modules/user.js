import Vue from 'vue'
import { login, getInfo, logout, getMenu } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { generatorDynamicRouter } from '@/config/router.config'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    menuList: [],
    userId: '',
    school_id: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_MENU: (state, menuList) => {
      state.menuList = menuList
    },
    SET_USERID: (state, id) => {
      state.userId = id
    },
    SET_SCHOOL: (state, schoolId) => {
      state.school_id = schoolId
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data.token
          const { pwdLevel } = response.data
          if (pwdLevel < 1) {
            reject(response.data)
            return
          }
          Vue.ls.set(ACCESS_TOKEN, result, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {

        let roles = {}
        getInfo().then(response => {
          const result = response.data
          if (result.perms && result.perms.length > 0) {
            roles.permissionList = result.perms
          }
          if (result.schools) {
            Vue.ls.set('userSchoolId', JSON.stringify(result.schools))
          } else {
            Vue.ls.remove('userDefaultId')
            Vue.ls.remove('userSchoolId')
          }
          commit('SET_USERID', result.user.id)
          commit('SET_SCHOOL', result.schools && result.schools.length > 0 && result.schools[0].deptId || null)
          commit('SET_ROLES', roles)
          commit('SET_INFO', result)
          commit('SET_NAME', { name: result.user.userName, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)
          resolve(roles)
        }).catch(error => {
          reject(error)
        })
      })
    },
    //获取菜单及个人信息
    GetMenu({ commit }) {
      return new Promise((resolve, reject) => {
        let roles = new Object()
        roles.permissionList = new Array()
        generatorDynamicRouter().then(result => {
          commit('SET_MENU', result)
          getInfo().then(res => {
            const result = res.data
            if (result.schools && !Vue.ls.get('userSchoolId')) {
              Vue.ls.set('userSchoolId', JSON.stringify(result.schools))
            }

            // if (result.menus) {
            //   result.menus.forEach(item => {
            //     roles.permissionList.push(item.perm)
            //   })
            // } else {
            //   roles.permissionList = ['*']
            // }
            // roles.permissionList = ['*']

            roles.permissionList = result.perms
            commit('SET_ROLES', roles)
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.user.userName, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            resolve(roles)
          })
          // roles.permissionList = ['*']

        })

      })
    },
    //设置roles
    SetRoles({ commit }) {
      return new Promise((resolve, reject) => {
        let roles = {}
        roles.permissionList = ['*']
        commit('SET_ROLES', roles)
        resolve(roles)
      })
    },


// 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_ROUTERS', [])
        Vue.ls.remove(ACCESS_TOKEN)
        Vue.ls.remove('userDefaultId')
        Vue.ls.remove('userSchoolId')
        Vue.ls.remove('STUDENT_INFO_CARD_LIST_PARAM')
        resolve()
        // logout(state.token).then(() => {
        //   resolve()
        // }).catch(() => {
        //   resolve()
        // })
      })
    },

    // 分馆赋值
    SetDept({ commit, state }) {
      return new Promise(resolve => {
        const school_id = Vue.ls.get('userDefaultId')
        commit('SET_SCHOOL', school_id)
        resolve(school_id)
      })
    }

  }
}

export default user
