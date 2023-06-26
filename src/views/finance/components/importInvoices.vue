<template>
  <div>
    <a-modal :width="800" title="批量导入发票" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk"
      @cancel="close">
      <a-form-model :model="form" :labelCol="{ span: 4 }" :wrapperCol="{ span: 16 }">
        <a-form-model-item label="开票公司">
          <a-select v-model="form.companyId" show-search option-filter-prop="children" :filter-option="filterOption">
            <a-select-option v-for="( item, index ) in  companyOptions " :key="index" :value="item.id">{{ item.companyName
            }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="标题">
          <a-upload v-if="form.companyId" ref="upload" accept=".zip" :remove="onFilesRemove"
            :customRequest="customRequest">
            <a-button> <a-icon type="upload" /> 上传文件</a-button>
            <div class="mt-8">支持格式：.zip</div>
            <div>文件夹名字任意</div>
            <div>发票文件标准格式：张三+13612345678.pdf</div>
          </a-upload>
          <div v-else>请先选择开票公司</div>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal :width="800" title="" :visible="completeVisible" @ok="completeVisible = false"
      @cancel="completeVisible = false">
      <div class="flex-col align-center">
        <a-icon style="font-size: 40px;" type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
        <h2 class="mt-16">导入成功</h2>
      </div>
      <a-divider></a-divider>
      <h2>未匹配清单：</h2>
      <div v-for="(item, index) in this.mismatchList" :key="index">
      {{ `${item.split('---')[1]} - ${item.split('---')[0]}` }}
      </div>
    </a-modal>
  </div>
</template>

<script>
import { autoUploadErp } from '@/utils/upload'
import { uploadInvoices, getCompanyList } from '@/api/invoice/invoice'
import JSZip from 'jszip'

export default {
  name: 'importInvoices',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      companyOptions: [], // 开票公司下拉列表
      form: {
        companyId: null,
        fileList: [],
      },
      uploadedFiles: 0,
      totalFiles: 0,
      completeVisible: false,
      mismatchList: []
    }
  },
  computed: {
  },
  methods: {
    reset() {
      this.form = {
        companyId: null,
        fileList: [],
      }
      this.resetUploadCount()
    },
    resetUploadCount() {
      this.uploadedFiles = 0
      this.totalFiles = 0
    },
    open() {
      this.visible = true
      this.reset()
      this.queryCompanyOptions()
    },
    close() {
      this.visible = false
    },
    queryCompanyOptions() {
      getCompanyList({ page: 0, limit: 0 }).then(res => {
        this.companyOptions = res.data || []
      })
    },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    },
    onFilesRemove() {
      this.form.fileList = []
    },
    // 上传发票信息
    async customRequest(e) {
      const { file: originZipFile, onProgress, onSuccess, onError } = e
      this.resetUploadCount()
      const zip = new JSZip()
      // 解决文件乱码问题
      let iconv = require('iconv-lite')
      const zipData = await zip.loadAsync(originZipFile, {
        decodeFileName: (bytes) => {
          return iconv.decode(bytes, 'gbk')
        }
      })
      const promiseList = []
      zipData.forEach((relativePath, zipFile) => {
        // fix: 过滤 mac osx 系统压缩的副作用
        if (!relativePath.startsWith("__MACOSX")) {
          // 判断是否是目录
          if (!zipFile.dir) {
            this.totalFiles++
            // '/'去除文件夹路径前缀(如 发票测试/丁XX+180XXXXXX37.pdf，去除发票测试文件夹名字)
            let fileName = relativePath.split('/').pop()
            // '[0]'去除文件后缀(如.pdf)
            let splitInfo = fileName.split('.')[0].split('+')
            let item = {
              name: splitInfo[0].trim(),
              phone: splitInfo[1].trim(),
              companyId: this.form.companyId,
              attachment: null,
              blobFile: null
            }
            this.form.fileList.push(item)
            let getBlobPromise = zip.file(zipFile.name).async('blob').then(res => {
              // let blobFile = new File([res], `${Date.now()}+${fileName}`)
              let blobFile = new File([res], fileName)
              item.blobFile = blobFile
            })
            promiseList.push(getBlobPromise)
          }
        }
      })

      Promise.all(promiseList).then(res => {
        for (const item of this.form.fileList) {
          const { blobFile } = item
          autoUploadErp(blobFile, 'e-invoice').then(res => {
            item.attachment = res
            this.uploadedFiles++
            if (this.uploadedFiles == this.totalFiles) {
              this.$message.success('发票PDF上传完成')
              onSuccess()
            } else {
              let percent = this.uploadedFiles / this.totalFiles
              onProgress({ percent }, blobFile)
              // this.$message.info(`当前进度${this.uploadedFiles}/${this.totalFiles}`)
            }
          }).catch(error => {
            this.$message.error('发票上传失败，请重新上传')
            this.resetUploadCount()
            onError(error)
            console.error('发票上传失败 ', error, blobFile.name)
          })
        }
      })
    },
    // 导入发票
    handleOk() {
      if (!this.form.companyId) {
        return this.$message.warn('请选择开票公司')
      }
      if (this.uploadedFiles === 0 || (this.uploadedFiles < this.totalFiles)) {
        return this.$message.info('请等待文件上传完成，再提交')
      }
      this.form.fileList.map(item => {
        delete item.blobFile
      })
      this.confirmLoading = true
      const params = this.form.fileList
      uploadInvoices(params).then(res => {
        if (res.data?.length > 0) {
          this.displayMismatchList(res.data)
        } else {
          this.$notification.success({
            message: '系统通知',
            description: '批量导入发票成功'
          })
          this.$emit('ok')
          this.visible = false
        }
      })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    // 显示未匹配名单
    displayMismatchList(list) {
      this.mismatchList = list
      this.visible = false
      this.completeVisible = true
    }
  }
}
</script>

<style lang="less" scoped></style>