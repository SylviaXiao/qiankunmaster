import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import tools from '@/tools/common'
import { UPLOAD_URL } from '@/utils/upload'

import QS from 'qs'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import Modal from 'ant-design-vue/es/modal'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { functions } from 'lodash'

const defaultConfig = {
  retryDelay: 1500
}
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_URL, // api base_url
  timeout: 120000 // 请求超时时间
})
const echartService = axios.create({
  baseURL: process.env.VUE_APP_REPORT_URL,
  timeout: 120000 // 请求超时时间
})
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
const err = error => {
  // console.log(error)
  if (error) {
    const { config, code, message } = error
    if (code === 'ECONNABORTED' || message === 'Network Error') {
      // 请求超时
      notification.error({
        message: '错误提示',
        description: '请求超时！'
      })
    } else if (message === 'Request failed with status code 404') {
      notification.error({
        message: '错误提示',
        description: '请求地址不存在'
      })
    }

    const token = Vue.ls.get(ACCESS_TOKEN)
    const result = error.data
    if (result) {
      console.log(result)
      if (result.code == 500 || result.code == 401 || result.code == 204 || result.code == 404 || result.code == 400) {
        notification.error({
          message: '错误提示',
          description: error.data.msg
        })
      } else if (result.code == 402) {
        console.log(router.history.current.name)
        const {
          history: {
            current: { name }
          }
        } = router

        if (name && name !== 'login') {
          Modal.confirm({
            title: '警告',
            content: `登陆过期,是否跳转登陆页面?`,
            okText: '前往登陆',
            cancelText: '我再待会',
            onOk() {
              if (token) {
                store.dispatch('Logout').then(() => {
                  setTimeout(() => {
                    window.location.reload()
                  }, 500)
                })
              }
            },
            onCancel() {
              console.log('Cancel')
            }
          })
        }
      } else {
        notification.error({
          message: '请求错误',
          description: '即将前往登录页面'
        })
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
      }
    }
  }
  return Promise.reject(error.data || '')
}
const request = config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  let school_id = Vue.ls.get('userDefaultId')
  if (config.ignoreSchoolId) {
    school_id = ''
  }
  if (token) {
    config.headers['auth_token'] = token // 让每个请求携带自定义 token
    config.headers['authorization'] = token // 让每个请求携带自定义 token
  }
  if (school_id && config.url !== UPLOAD_URL) {
    if (config.method == 'post') {
      // const customContentType = config.headers['Content-Type']
      // const postContentType = config.headers.post['Content-Type']
      if (config.data) {
        // axios默认配置表单提交，为了兼容，当接口使用json提交附带school_id时，不改变提交参数的方式
        if (Object.prototype.toString.call(config.data) === '[object Object]') {
          config.data.school_id = school_id
        } else if (config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('multipart/form-data') != -1) {
          config.data.append('school_id', school_id)
        } else if (config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('Application/json') != -1) {
          config.data.school_id = school_id
        } else {
          !config.data.school_id ? (config.data = `${config.data}&school_id=${school_id}`) : ''
        }
      } else {
        if (config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('multipart/form-data') != -1) {
          config.data.append('school_id', school_id)
        } else {
          config.data = `school_id=${school_id}`
        }
      }
      // config.data ? config.data = `${config.data}&school_id=${school_id}` : config.data = `school_id=${school_id}`
    } else if (config.method == 'get' || config.method == 'delete') {
      if (config.params) {
        if (!config.params.school_id) {
          config.params = {
            school_id: school_id,
            ...config.params
          }
        }
      } else {
        config.params = {
          school_id: school_id
        }
      }
    }
  }
  //是否使用formData格式
  if (config.data && config.data.unFormData) {
    config.data = tools.$getFormData(config.data)
  }
  return config
}
service.interceptors.request.use(request, err)
echartService.interceptors.request.use(request, err)
const response = res => {
  const {
    config: { url },
    headers
  } = res
  if (headers['set-auth_token'] || headers['Set-auth_token']) {
    Vue.ls.set(ACCESS_TOKEN, headers['set-auth_token'] || headers['Set-auth_token'], 7 * 24 * 60 * 60 * 1000)
  }
  if (res.data.code == 200 || url === UPLOAD_URL) {
    return Promise.resolve(res.data)
  } else if (res.data.type) {
    return Promise.resolve(res.data)
  } else if (res.data instanceof ArrayBuffer) {
    return Promise.resolve(res.data)
  } else {
    return err(res)
  }
}
service.interceptors.response.use(response, err)
echartService.interceptors.response.use(response, err)
const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}
export { installer as VueAxios, service as axios, echartService as echartAxios }
