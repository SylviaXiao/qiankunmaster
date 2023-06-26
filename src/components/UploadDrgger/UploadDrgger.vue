<template>
  <div>
    <div class="upload-warpper">
      <a-upload-dragger
        name="file"
        accept=""
        :showUploadList="false"
        :fileList="fileList"
        :beforeUpload="beforeUpload"
        :customRequest="customRequest"
        @change="handleChange"
        @reject="handleReject"
        :multiple="multiple"
      >
        <template>
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">
            单击或拖动文件到此区域以上传
          </p>
          <p class="ant-upload-hint">支持{{ accept.join('、') }}等格式的图片</p>
        </template>
      </a-upload-dragger>
    </div>
    <div v-for="item in fileListNew" :key="item.fileId">
      <span> {{ item.name }}</span>
      <a href="javascript:;" class="img ml20 " v-if="typeList.includes(item.type)" @click="openPreviewModal(item)">预览</a>
      <a href="javascript:;" class="action ml20 mr10" @click="downloadAttach(item)">下载</a>
       <a-icon type="delete"  @click="handleRemove(item)" />
    </div>
    <f-modal ref="previewModal" :open-loading="true" title="预览照片" @initValue="initPreviewModal" :showFooter="false">
      <div style="position:relative;">
        <div style="text-align:right;" class="mb20">
          <a-button v-if="imgType != 'pdf'" class="ml20" type="primary" @click="reverseImg">
            旋转
          </a-button>
        </div>
        <div v-if="imgType == 'pdf'"><Pdf :url="previewSrc"></Pdf></div>
        <div v-else style="width:100%;display: flex;justify-content: center;align-items: center;">
          <img :src="previewSrc" class="reverseImg" :style="`transform:rotate(${reverse}deg);`" ref="previewImg" />
        </div>
        <div
          style="display: flex;justify-content: space-between;width: calc(100% + 225px);position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);"
          class="mt20"
        >
          <a-icon type="left" style="font-size: 80px; color: #fff;" @click="changeImg('pre')" />
          <a-icon type="right" style="font-size: 80px;color: #fff;" @click="changeImg('next')" />
        </div>
      </div>
    </f-modal>
  </div>
</template>

<script>
import { autoUploadErp } from '@/utils/upload'
import { previewFile, downloadFiles } from '@/api/file'
import Pdf from './Pdf'
import { PermBox, SearchComPro, STable, UploadDrgger } from '@/components'
import ContinueRecord from '@/views/education/modules/continueRecord'
export default {
  props: {
    multiple: { type: Boolean, default: false },
    value: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Pdf
  },
  watch: {
    value: {
      handler(val) {
        if (Array.isArray(val) && val.length > 0) {
          this.fileListNew = val.map(item => {
            let typeName = item.name.split('.')
            return { name: item.name, fileId: item.fileId, type: typeName[typeName.length-1] }
          })
        } else {
          this.fileListNew = []
        }
      },
      deep: true
    }
  },
  data() {
    return {
      typeList:['png', 'jpeg', 'pdf' , 'jpg'],
      accept: ['.jpg', '.jpeg', '.png'],
      fileList: [],
      fileListNew: [],
      previewUrl: '',
      imgType: '',
      reverse: 0,
      previewSrc: null,
      type: ''
    }
  },
  methods: {
    handleRemove(file) {
      let that = this
      this.$confirm({
        title: '系统提示',
        content: '确定删除吗',
        onOk() {
          that.fileList.forEach((item, index) => {
            if (item.fileId == file.fileId) {
              that.fileList.splice(index, 1)
            }
          })
          that.fileListNew.forEach((item, index) => {
            if (item.fileId == file.fileId) {
              that.fileListNew.splice(index, 1)
            }
          })
          // removeFile({ targetId: file.fileId })
          that.$emit('uploadSuccess', that.fileListNew)
        },
        onCancel() {}
      })
    },
    reverseImg() {
      this.reverse = this.reverse + 90
    },
    changeImg(type) {
      let arr =['png', 'jpeg', 'pdf','jpg']
      let files = this.fileListNew.filter(item => {
        return arr.includes(item.type)
      })
      if (files.length < 2) {
        return
      }
      let idx = 0
      files.forEach((item, index) => {
        if (item.fileId == this.fileId) {
          idx = index
        }
      })
      // console.log(2, type)
      if (type == 'pre') {
        if (idx == 0) {
          this.$notification['error']({
            message: '系统通知',
            description: '已经是第一张了'
          })
          return
        }
        idx = idx - 1
      }
      if (type == 'next') {
        if (idx == files.length - 1) {
          this.$notification['error']({
            message: '系统通知',
            description: '已经是最后一张了'
          })
          return
        }
        idx = idx + 1
      }
      this.reverse = 0
      this.openPreviewModal(files[idx])
    },
    isImg(data) {
      this.type = data
      let arr = ['png', 'jpeg', 'pdf','jpg']

      if (arr.includes(this.type)) {
        return true
      } else {
        return false
      }
    },
    openPreviewModal(record) {
      this.imgType = record.type
      const { fileId } = record
      this.fileId = fileId
      this.previewSrc = null
      this.$refs.previewModal.open()
    },
    initPreviewModal() {
      const { fileId } = this
      previewFile({ fileId })
        .then(res => {
          this.previewSrc = res.data
        })
        .finally(() => {
          this.$refs.previewModal.spinning = false
        })
    },
    // 是否可以上传
    hasFile(fileList) {
      let flag = true
      return true
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
        .finally(() => {})
    },
    handleReject(fileList) {
      this.hasFile(fileList)
    },
    handleChange(info) {
      const status = info?.file?.status
      const name = info?.file?.xhr?.name
      const fileId = info?.file?.response?.fileId
      if (status === 'done') {
        this.fileListNew.push({
          fileId,
          name,
          type: name.split('.')[1]
        })
        this.$emit('uploadSuccess', this.fileListNew)
      }
    },
    downloadAttach(data) {
      const { fileId } = data
      downloadFiles({ fileId: fileId }).then(res => {
        this.downloadBySrc(res.data)
      })
    },
    downloadBySrc(src, fileName = 'test') {
      const a = document.createElement('a')
      a.download = `${fileName}`
      a.href = src
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(a.href)
    },
    initImage(fileId) {
      return previewFile({ fileId }).then(res => {
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
.reverseImg {
  width: 100%;
}
</style>
