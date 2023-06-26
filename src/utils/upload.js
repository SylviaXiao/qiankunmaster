// 重构上传测试用
import { preUpload, wx_sign } from '@/api/file'
import { commonPreUpload, commonWx_sign } from '@/api/common'
import { axios } from '@/utils/request'

export const UPLOAD_URL = 'https://danse-erp-file.oss-cn-hangzhou.aliyuncs.com'

// 1,preUploadFn 2,wx_sign
export function autoUploadErp(file, type, onUploadProgress = null) {
  let axiosParams = new FormData()
  let fileId = ''
  return preUploadFn(file, type)
    .then(res => {
      if (res.publicRead) {
        axiosParams.append('x-oss-object-acl', 'public-read')
      }
      axiosParams.append('key', res.fileName)
      fileId = res.fileId
      return res.fileDir
    })
    .then(fileDir => {
      return wx_sign({
        dir: fileDir
      })
    })
    .then(res => {
      axiosParams.append('policy', res.data.policy)
      axiosParams.append('OSSAccessKeyId', res.data.accessid)
      axiosParams.append('signature', res.data.signature)
      axiosParams.append('success_action_status', '200')
      axiosParams.append('file', file)
      return axiosParams
    })
    .then(params => {
      return axios({
        url: UPLOAD_URL,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: params,
        method: 'post',
        timeout: 0,
        onUploadProgress
      })
    })
    .then(() => {
      return fileId
    })
    .catch(err => {
      new Error(err)
    })
}

export function preUploadFn(file, type) {
  let params = {
    fileName: file.name,
    img: file.type.indexOf('image/') == -1 ? false : true,
    type: type
  }
  return preUpload(params).then(res => {
    const result = res.data
    const storeAs = result.storeAs
    const publicRead = result['public-read']
    const fileData = {
      fileDir: storeAs.fileDir,
      fileName: `${storeAs.fileDir}/${storeAs.filePathName}`,
      fileId: storeAs.id,
      publicRead: publicRead
    }
    return fileData
  })
}

export function autoUploadNOLimit(file, type, onUploadProgress = null) {
  let axiosParams = new FormData()
  let fileId = ''
  return preUploadCommon(file, type)
    .then(res => {
      if (res.publicRead) {
        axiosParams.append('x-oss-object-acl', 'public-read')
      }
      axiosParams.append('key', res.fileName)
      fileId = res.fileId
      return res.fileDir
    })
    .then(fileDir => {
      return commonWx_sign({
        dir: fileDir
      })
    })
    .then(res => {
      axiosParams.append('policy', res.data.policy)
      axiosParams.append('OSSAccessKeyId', res.data.accessid)
      axiosParams.append('signature', res.data.signature)
      axiosParams.append('success_action_status', '200')
      axiosParams.append('file', file)
      return axiosParams
    })
    .then(params => {
      return axios({
        url: UPLOAD_URL,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: params,
        method: 'post',
        timeout: 0,
        onUploadProgress
      })
    })
    .then(() => {
      return fileId
    })
    .catch(err => {
      new Error(err)
    })
}
export function preUploadCommon(file, type) {
  let params = {
    fileName: file.name,
    img: file.type.indexOf('image/') == -1 ? false : true,
    type: type
  }
  return commonPreUpload(params).then(res => {
    const result = res.data
    const storeAs = result.storeAs
    const publicRead = result['public-read']
    const fileData = {
      fileDir: storeAs.fileDir,
      fileName: `${storeAs.fileDir}/${storeAs.filePathName}`,
      fileId: storeAs.id,
      publicRead: publicRead
    }
    return fileData
  })
}
