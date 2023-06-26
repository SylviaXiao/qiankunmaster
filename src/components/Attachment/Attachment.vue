<template>
  <div>
    <div v-for="(item, idx) in fileList" :key="idx">
      <span>{{ item.fileName }}</span>
      <span style="margin-left: 15px;">
        <a href="javascript:;" style="margin-right: 5px;" v-if="item.show" @click="openPreviewModal(item)">预览</a>
        <a href="javascript:;" @click="downloadAttach(item)">下载</a>
        <perm-box perm="finance:invoice:approve">
        <a href="javascript:;" @click="delectFiles(item,idx)" v-if="delectOpen">删除</a>
        </perm-box>
      </span>
    </div>
    <f-modal
      ref="previewModal"
      id="AttachmentViewer"
      :open-loading="true"
      title="预览照片"
      @initValue="initPreviewModal"
      @closeModal="closeModalHandle"
      :showFooter="false"
    >
      <div>
        <a-button href="javascript:;" @click="rotatePic">旋转</a-button>
      </div>
      <div>
        <img :src="previewSrc" :style="`transform:rotate(${rotateValue}deg)`" width="100%" />
      </div>
    </f-modal>
  </div>
</template>

<script>
import { previewFile, downloadFiles } from '@/api/file'
import PermBox from '@/components/PermBox'
export default {
  name: 'Attachment',
  props: {
    files : {
      type: Array,
      default: []
    },
    delectOpen: {
      type: Boolean,
      default: false
    }
  },
  components:{
    PermBox
  },
  data() {
    return {
      previewSrc: null,
      fileId: null,
      rotateValue: 0,
      fileList: []
    }
  },
  watch: {
    files (o,n) {
      this.resetFiles()
    }
  },
  mounted() {
    this.resetFiles()
  },
  methods: {
    finalAttach() {
      this.$emit('finalFiles',this.fileList)
    },
    resetFiles () {
      this.fileList = JSON.parse(JSON.stringify(this.files))
    },
    //删除
    delectFiles (val,index) {
      console.log(val,index)
      this.fileList.splice(index,1)
      
    },
    rotatePic() {
      this.rotateValue += 90
    },
    downloadAttach(data) {
      const { id } = data
      downloadFiles({ fileId: id }).then(res => {
        this.downloadBySrc(res.data)
      })
    },
    downloadBySrc(src, fileName = 'test') {
      console.log('src =>', src)
      const a = document.createElement('a')
      a.download = `${fileName}`
      a.href = src
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(a.href)
    },
    openPreviewModal(record) {
      const { id } = record
      this.fileId = id
      this.previewSrc = null
      this.$refs.previewModal.open()
    },
    initPreviewModal() {
      const { fileId } = this
      previewFile({ fileId })
        .then(res => {
          console.log(res)
          this.previewSrc = res.data
        })
        .finally(() => {
          this.$refs.previewModal.spinning = false
        })
    },
    closeModalHandle() {
      this.rotateValue = 0
    }
  }
}
</script>
