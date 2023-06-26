<template>
  <div class="upload-warpper">
    <div class="img" v-if="value.length > 0">
      <div class=" previewImg" v-for="(item, index) in value" :key="index">
        <img :src="item.url" alt="" />
        <a-icon type="close-circle" theme="filled" style="font-size:16px;" class="deleteImg" @click="handleRemove(item, index)" />
      </div>
      <!-- <div class="mr10 previewImg" v-for="(item, index) in value" :key="index" :style="{ backgroundImage: `url(${item.url})` }"></div> -->
    </div>
    <div class="img" v-else>
      <div class="previewImg" v-for="(item, index) in fileList" :key="index">
        <img :src="item.url" alt="" />
        <a-icon type="close-circle" theme="filled" style="font-size:16px;" class="deleteImg" @click="handleRemove(item, index)" />
      </div>
    </div>
    <div class="upload_img">
      <a-upload
        :fileList="fileList"
        list-type="picture-card"
        :showUploadList="false"
        :customRequest="customRequest"
        :beforeUpload="beforeUpload"
        @change="handleChange"
      >
        <a-icon type="plus" />
        <div class="ant-upload-text">
          上传
        </div>
      </a-upload>
      <!-- <a-upload-dragger
        name="file"
        :accept="accept.join(',')"
        :showUploadList="false"
        :fileList="fileList"
        :beforeUpload="beforeUpload"
        :customRequest="customRequest"
        @change="handleChange"
        @reject="handleReject"
      >
        <template>
          <a-icon type="plus" />
          <div class="ant-upload-text">
            {{ btnText }}
          </div>
        </template>
      </a-upload-dragger> -->
    </div>
  </div>
</template>

<script>
import { autoUploadNOLimit } from '@/utils/upload'
import { commonViewUpload } from '@/api/common'

export default {
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    btnText: {
      type: String,
      default: '上传'
    },
    value: {
      type: Array,
      default: () => []
    },
    filePath: {
      type: String,
      default: ''
    }
  },
  watch: {},
  data() {
    return {
      accept: ['.jpg', '.jpeg', '.png'],
      fileList: []
    }
  },
  methods: {
    handleRemove(file, index) {
      let that = this
      this.$confirm({
        title: '系统提示',
        content: '确定删除吗',
        onOk() {
          if (file.id) {
            if (that.fileList.length > 0) {
              that.fileList.forEach((item, index) => {
                if (item.id == file.id) {
                  that.fileList.splice(index, 1)
                }
              })
            }
          }
          that.$emit('uploadSuccess', that.fileList)
        },
        onCancel() {}
      })
    },

    clearImg() {
      this.fileList = []
    },
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
      const {
        fileList: [file]
      } = this
      const { onProgress, onSuccess, onError } = e
      autoUploadNOLimit(file, this.filePath, ev => {
        const percent = ((ev.loaded / ev.total) * 100) | 0
        onProgress({ percent }, file)
      })
        .then(res => {
          onSuccess({ fileId: res }, file)
        })
        .catch(error => {
          onError(error)
        })
        .finally(() => {})
    },
    handleReject(fileList) {
      this.hasFile(fileList)
    },
    handleChange(info) {
      const status = info?.file?.status
      const fileId = info?.file?.response?.fileId
      if (status === 'done') {
        this.initImage(fileId).finally(() => {})
      }
    },
    initImage(fileId) {
      return commonViewUpload({ fileId }).then(res => {
        if (res.code == 200) {
          this.fileList.forEach(item => {
            if (item.response && item.response.fileId == fileId) {
              item.url = res.data
              item.id = fileId
            }
          })
          this.$forceUpdate()
          this.$emit('uploadSuccess', this.fileList)
        }
      })
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
.upload-warpper {
  display: flex;
  flex-wrap: wrap;
  .upload_img {
    width: 120px;
    height: 120px;
    // border: 1px solid #eee;
    // text-align: center;
    // line-height: 132px;
  }
  .img {
    height: 120px;
    .previewImg {
      position: relative;
      height: 100%;
      background-position: center;
      background-size: cover;
      margin-right: 10px;
      img {
        height: 100%;
      }
      .deleteImg {
        position: absolute;
        cursor: pointer;
        top: -8px;
        right: -8px;
      }
    }
  }

  /deep/.ant-upload.ant-upload-drag .ant-upload {
    padding: 0;
  }
}
</style>
