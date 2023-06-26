<template>
  <div class="download-list-wrapper">
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
             v-model="visible"
             title="下载列表"
             width="400px"
             :footer="null">
      <div v-if="hasList">
        <div class="files-wrapper" v-if="fileList.length>0">
          <div class="file-item" v-for="(item,idx) in fileList" :key="idx">
            <div class="file-name ellipsis">{{item.fileName}}</div>
            <div>
              <a href="javascript:;" class="action" v-if="item.show" @click="openPreviewModal(item)">预览</a>
              <a href="javascript:;" class="action" @click="downloadAttach(item)">下载</a>
            </div>
          </div>
        </div>
        <div class="files-wrapper" v-else>
          <div class="text-center">
            暂无附件
          </div>
        </div>
      </div>
      <div v-if="!hasList">
        <div class="files-wrapper" v-if="files.length>0">
          <div class="file-item" v-for="(item,idx) in files" :key="idx">
            <div class="file-name ellipsis">{{item.fileName}}</div>
            <div>
              <a href="javascript:;" class="action" v-if="item.show" @click="openPreviewModal(item)">预览</a>
              <a href="javascript:;" class="action" @click="downloadAttach(item)">下载</a>
            </div>
          </div>
        </div>
        <div class="files-wrapper" v-else>
          <div class="text-center">
            暂无附件
          </div>
        </div>
      </div>
      <f-modal ref="previewModal" :open-loading="true" title="预览照片" @initValue="initPreviewModal" :showFooter="false">
        <img :src="previewSrc" ref="previewImg" width="752px">
      </f-modal>
    </a-modal>
  </div>
</template>

<script>
  import { listCardChangeLogFile, listChangeLogFile } from '@/api/education.js'
  import { previewFile, downloadFiles } from '@/api/file'

  export default {
    name: 'DownloadList',
    props: {
      logId: null,
      fileList:{type:Array,default:()=>[]},
      hasList:{type:Boolean,default:false}
    },
    data() {
      return {
        visible: false,
        files: [],
        previewSrc:null,
      }
    },
    methods: {
      openWithCb(fn) {
        this.visible = true
        fn().then((res) => {
          this.files = res.data
        })
      },
      open(logId) {
        this.getStuFiles(logId).then(() => {
          this.visible = true
        })
      },
      openInten(logId) {
        this.getIntenFiles(logId).then(() => {
          this.visible = true
        })
      },
      getStuFiles(logId) {
        return listCardChangeLogFile(logId).then(res => {
          this.files = res.data
        })
      },
      openModal(){
        this.visible = true
      },
      //意向学员附件
      getIntenFiles(logId) {
        return listChangeLogFile(logId).then(res => {
          this.files = res.data
        })
      },
      downloadFiles(data) {
        const { fileDir, filePathName, fileName } = data
        const url = `${fileDir}/${filePathName}`
        console.log(url)
        downLoadFiles(url, fileName)
      },
      close() {
        this.visible = false
      },
      downloadAttach(data) {
        const {id } = data
        downloadFiles({fileId:id}).then(res=>{
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
      openPreviewModal(record){
        const { id } = record
        this.fileId = id
        this.previewSrc = null
        this.$refs.previewModal.open()
      },
      initPreviewModal(){
        const {fileId} = this
        previewFile({fileId}).then(res=>{
          this.previewSrc = res.data
        }).finally(()=>{
          this.$refs.previewModal.spinning = false
        })
      },
    }
  }
</script>

<style scoped lang=less>
  @import '~@/assets/style/index';
  .files-wrapper {
    max-height: 700px;
    overflow-y: auto;
  }
  .file-item{
    min-width: 200px;
  }
  .file-item {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    line-height: 40px;
    border-bottom: 1px solid #dddddd;
    padding: 0 5px;
  }
  .action{
    margin: 0 5px;
  }

  .text-center {
    text-align: center;
  }

</style>
