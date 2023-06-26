<template>
  <div class="upload-warpper">
    <div class="upload">
      <span class="required-class" v-if="required">{{ btnText }}:</span>
      <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload" @change="handleChange">
        <a-button>
          <a-icon type="upload" />
          {{ btnText }}
        </a-button>
      </a-upload>
    </div>
  </div>
</template>

<script>
// import { autoUpload } from '@/tools/oss'
import { autoUploadErp } from '@/utils/upload'
export default {
  props: {
    required: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: '上传'
    },
    size: {
      type: Number,
      default: 114
    },
    filePath: {
      type: String,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      uploading: false,
      localSrc: '',
      changeSrc: null
    }
  },
  methods: {
    //发生变化上传数组数量
    handleChange(file) {
      this.$emit('uploadFilesNum', file.fileList.length)
      // console.log(file)
      this.$emit('uploadFilesNum1', file.fileList)
    },
    handleRemove(file) {
      this.multiple ? this.fileList.remove(file) : (this.fileList = [])
      this.$emit('uploadFilesNum', this.fileList.length)
    },
    beforeUpload(file) {
      this.multiple ? this.fileList.push(file) : (this.fileList = [file])
      return false
    },
    handleUpload() {
      const { fileList } = this
      if (this.required) {
        if (fileList.length) {
          return this._upload()
        } else {
          this.$notification['error']({
            message: '系统通知',
            description: '请上传附件'
          })
          return Promise.reject('请上传附件')
        }
      } else {
        if (fileList.length) {
          return this._upload()
        } else {
          return Promise.resolve('')
        }
      }
    },
    mapList() {},
    multipleHandleUpload() {
      const { fileList, setUpload } = this
      const list = []
      return new Promise((resolve, reject) => {
        if (this.required) {
          if (fileList.length) {
            fileList.forEach((item, idx) => {
              setTimeout(() => {
                list.push(autoUploadErp(item, this.filePath))
                if (list.length === fileList.length) {
                  setUpload(list).then(arr => {
                    resolve(arr.join(','))
                  })
                }
              }, idx * 500)
            })
          } else {
            this.$notification['error']({
              message: '系统通知',
              description: '请上传附件'
            })
            reject('请上传附件')
          }
        } else {
          if (fileList.length) {
            fileList.forEach((item, idx) => {
              setTimeout(() => {
                list.push(autoUploadErp(item, this.filePath))
                if (list.length === fileList.length) {
                  setUpload(list).then(arr => {
                    resolve(arr.join(','))
                  })
                }
              }, idx * 500)
            })
          } else {
            resolve(null)
          }
        }
      })
    },
    setUpload(item) {
      return Promise.all([...item])
    },
    _upload() {
      const { fileList } = this
      this.uploading = true
      return autoUploadErp(fileList[0], this.filePath)
        .then(res => {
          console.log(res)
          return res
        })
        .finally(() => {
          this.uploading = false
        })
    },
    reset() {
      this.fileList = []
    }
  }
}
</script>

<style scoped lang="less">
.upload-warpper {
  position: relative;

  .upload {
    margin-top: 5px;
  }

  .required-class {
    margin-right: 6px;
    position: absolute;
    left: -77px;
    top: 5px;

    &:before {
      display: inline-block;
      margin-right: 4px;
      content: '*';
      font-family: SimSun;
      line-height: 1;
      font-size: 14px;
      color: #f5222d;
    }
  }
}
</style>
