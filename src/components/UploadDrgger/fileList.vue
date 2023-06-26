<template>
  <div style='text-align:left;'>
    <div v-for="item in fileListNew" :key="item.fileId">
      <span> {{ item.name }}</span>
      <a href="javascript:;" class="img mr10 ml10" v-if="isImg(item.type)" @click="openPreviewModal(item)">预览</a>
      <a href="javascript:;" class="action " @click="downloadAttach(item)">下载</a>
<!--       <a-icon type="delete" @click="handleRemove(item)" />-->
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
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Pdf
  },
  data() {
    return {
      fileListNew: [],
      previewUrl: '',
      imgType: '',
      reverse: 0,
      previewSrc: null,
      type: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.initFileList(val)
      },
      deep: true
    }
  },
  created() {
    this.initFileList(this.value)
  },
  methods: {
    initFileList(val){
      if (Array.isArray(val) && val.length > 0) {
        this.fileListNew = val.map(item => {
          let typeName = item.name.split('.')
          return { name: item.name, fileId: item.fileId, type: typeName[typeName.length-1] }
        })
      } else {
        this.fileListNew = []
      }
    },
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
              that.fileList.splice(index, 1)
            }
          })
          // removeFile({ targetId: file.fileId })
          that.$emit('changeValue', that.fileList)
        },
        onCancel() {}
      })
    },
    reverseImg() {
      this.reverse = this.reverse + 90
    },
    changeImg(type) {
      let arr = ['png', 'jpeg', 'pdf','jpg']
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
      let arr =  ['png', 'jpeg', 'pdf','jpg']
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
