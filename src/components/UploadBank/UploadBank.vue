<template>
  <div class="upload-warpper">
    <a-upload-dragger
      name="file"
      :accept="accept.join(',')"
      :showUploadList="false"
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      :customRequest="customRequest"
      @change="handleChange"
      @reject="handleReject"
    >
      <template v-if="!previewUrl">
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox"/>
        </p>
        <p class="ant-upload-text">
          单击或拖动文件到此区域以上传
        </p>
        <p class="ant-upload-hint">
          支持{{accept.join('、')}}等格式的图片
        </p>
      </template>
      <template v-else>
        <div class="previewImg" :style="{backgroundImage: `url(${previewUrl})`}"></div>
      </template>
    </a-upload-dragger>
  </div>
</template>

<script>
  import { autoUploadErp } from '@/utils/upload'
  import { checkCardImage } from '@/api/common'
  import { previewFile } from '@/api/file'

  export default {
    props: {},
    data() {
      return {
        accept: ['.jpg', '.jpeg', '.png'],
        fileList: [],
        previewUrl: ''
      }
    },
    methods: {
      // 是否可以上传
      hasFile(fileList) {
        let flag = true
        for (const file of fileList) {
          const index = file.name.lastIndexOf('.')
          if (!this.accept.includes(file.name.substring(index))) {
            flag = false
            this.$notification['error']({
              message: '系统通知',
              description: `请选择${this.accept.join('、')}格式的图片`
            })
            break
          }
        }
        return flag
      },
      beforeUpload(file) {
        if (this.hasFile([file])) {
          this.fileList = [file]
        } else {
          return false
        }
      },
      customRequest(e) {
        const { fileList: [file] } = this
        const { onProgress, onSuccess, onError } = e
        autoUploadErp(file, 'reason', ev => {
          const percent = ((ev.loaded / ev.total) * 100) | 0
          onProgress({ percent }, file)
        })
          .then(res => {
            onSuccess({ fileId: res }, file)
          })
          .catch(error => {
            onError(error)
          })
          .finally(() => {
          })
      },
      handleReject(fileList) {
        this.hasFile(fileList)
      },
      handleChange(info) {
        const status = info?.file?.status
        const fileId = info?.file?.response?.fileId
        if (status === 'done') {
          this.initImage(fileId)
            .finally(() => {
              this.checkBankNo()
                .then(res => {
                  if (res.code == 200) {
                    this.$emit('uploadSuccess', {
                      fileId,
                      bankNo: res.data.cardNo,
                      url: this.previewUrl
                    })
                  }
                })
            })
        }
      },
      checkBankNo() {
        return checkCardImage({ url: this.previewUrl })
      },
      initImage(fileId) {
        return previewFile({ fileId })
          .then(res => {
            if (res.code == 200) {
              this.previewUrl = res.data
            }
          })
      },
      clearImage() {
        this.previewUrl = ''
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .upload-warpper {
    width: 255px;
    height: 162px;

    .previewImg {
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
    }

    /deep/.ant-upload.ant-upload-drag .ant-upload {
      padding: 0;
    }
  }
</style>
