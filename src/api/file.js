import { axios } from '@/utils/request'
import QS from 'qs'

const api = {
  signFile: '/framework/file/sign', //文件鉴权
  loadFile: '/framework/file/preUpload', //文件上传

  sign: '/framework/file/sign', //文件鉴权
  preUpload: '/framework/file/preUpload', //文件上传
  wx_sign: '/framework/file/wx_sign', //微信小程序文件鉴权
  changeAva: '/organize/user/changeAvatar',
  // changeAva:'/organize/user/changeAvatar',
  // recognizeFace:'/framework/file/recognize',
  recognizeFace: '/student/signinlog/recognize', //面部识别

  previewFile:'/framework/file/view',
  downloadFiles:'/framework/file/down'

}

export function loadFile(params) {
  return axios({
    url: `${api.loadFile}`,
    method: 'get',
    params: params
  })
}

export function previewFile(params) {
  return axios({
    url: `${api.previewFile}`,
    method: 'get',
    params: params
  })
}

export function downloadFiles(params) {
  return axios({
    url: `${api.downloadFiles}`,
    method: 'get',
    params: params
  })
}

export function signFile() {
  return axios({
    url: `${api.signFile}`,
    method: 'get'
  })
}

export function preUpload(params) {
  return axios({
    url: `${api.preUpload}`,
    method: 'get',
    params: params
  })
}

export function sign() {
  return axios({
    url: `${api.sign}`,
    method: 'get'
  })
}

export function wx_sign(params) {
  return axios({
    url: `${api.wx_sign}`,
    method: 'get',
    params: params
  })
}

export function changeAva(params) {
  return axios({
    url: `${api.changeAva}`,
    method: 'post',
    data: QS.stringify({ id: params })
  })
}

export function recognizeFace(params) {
  return axios({
    url: api.recognizeFace,
    method: 'post',
    data: QS.stringify(params)
  })
}
