import api from './index'
import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return axios({
    url: 'common/login',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha(parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getMenu() {
  return axios({
    url: '/organize/menu/listUserOrgMenuTree',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getInfo() {
  return axios({
    url: '/organize/account/getCurrentUser',
    method: 'get'
  })
}

export function logout() {
  return axios({
    url: '/organize/account/logout',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getOrgUser(params) {
  return axios({
    url: `/organize/user/getOrgUser/${params}`,
    method: 'get'
  })
}
