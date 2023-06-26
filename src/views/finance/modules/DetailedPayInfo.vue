<template>
  <div style="width:100%;overflow-x:auto;">
    <div style="min-width:700px;">
      <div style="margin-bottom:15px; display: flex;justify-content: space-between;">
        <div class="file-list" style="display: flex; flex-flow: nowrap row;">
          <span class="label" style="display: flex; flex-flow: row nowrap;">
            <perm-box perm="finance:info:update:attachment" v-if="detailInfo">
              <a-button style="margin-right: 10px" @click="editDetailedInfo(detailInfo)">上传附件</a-button>
            </perm-box>
          </span>
          <Attachment :files="fileList" />
        </div>
        <div>
          <a-button @click="printHandle">打印</a-button>
        </div>
      </div>
      <CusTableHtml ref="cusTableHtml" title="退费申请表" :cusHtml="dataHtml" :cusCss="dataHtmlCss" :cusHtmlPrint="dataHtmlPrint"></CusTableHtml>
      <!-- <CusTable ref="cusTable" :tableData="cusTableData"></CusTable> -->
      <a-modal
        :maskClosable="$store.state.modalMaskClickEnable"
        :destroyOnClose="true"
        title="修改详情"
        width="1000px"
        :confirmLoading="confirmLoading"
        v-model="editInfoModal"
        @ok="saveEditInfo"
        @cancel="cancelHandel"
      >
        <a-form :form="editForm">
          <template v-if="!hasCardId">
            <a-form-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="户名">
              <a-input :rows="4" v-model="bankUserName" />
            </a-form-item>
            <a-form-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="开户行">
              <a-input :rows="4" v-model="bank" />
            </a-form-item>
            <a-form-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="关系">
              <a-input :rows="4" v-model="userRelate" />
            </a-form-item>
            <a-form-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="关系备注">
              <a-input :rows="4" v-model="userRelateRemark" />
            </a-form-item>
            <a-form-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="卡号">
              <a-input :rows="4" v-model="bankNo" />
            </a-form-item>
            <a-form-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="备注">
              <a-textarea :rows="4" v-model="bankRemark" />
            </a-form-item>
            <a-divider orientation="left"><span :style="{ color: 'rgba(1,1,1,.3)' }">附件</span></a-divider>
          </template>
          <!-- 退费明细表,修改详情部分 -->
          <!-- <DetailedPayInfoDrawback ref="detailedPayInfoDrawback" v-else :drawbackEditInfo="drawbackEditInfo"></DetailedPayInfoDrawback> -->
          <a-form-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="附件">
            <upload-sth ref="uploadsth" :multiple="true" :required="false" btn-text="附件上传" filePath="reason"></upload-sth>
          </a-form-item>
          <a-form-item v-bind="{ labelCol: { span: 4 }, wrapperCol: { span: 16 } }" label="已上传附件">
            <div class="uploadedFile" v-for="(item, idx) in newUploadFiles" :key="idx">
              <span style="display: flex;flex-flow: row nowrap;justify-content: space-between;">
                <span>{{ item.fileName }}</span>
                <span style="margin-left: 15px;" class="close" @click="deleteFile(item)"><a-icon type="close" style="font-size: 10px;"/></span>
              </span>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
      <div style="overflow:hidden;height:0;">
        <div id="printHtml"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { refundCardAll, drawback, previousRefundCard } from '@/api/recep'
import { refundDetail } from '@/api/finance/finance'
import { updateAttachment, saveRefundAttachment } from '@/api/finance/finance'
import { previewFile, downloadFiles } from '@/api/file'
import { UploadSth, Attachment } from '@/components'
import { formatCusTabelData } from '@/components/CusTable/detailedInfoCusTable'
import DetailedPayInfoDrawback from './DetailedPayInfoDrawback'
import CusTable from '@/components/CusTable/CusTable'
import CusTableHtml from '@/components/CusTable/CusTableHtml'
// import html2canvas from 'html2canvas'
// import printJs from 'print-Js'
export default {
  props: {
    dataInfo: {
      type: Object,
      default: null
    }
  },
  components: {
    DetailedPayInfoDrawback,
    CusTable,
    UploadSth,
    Attachment,
    CusTableHtml
  },
  data() {
    return {
      detailInfo: {},
      dataHtml: '', // 表格html文件
      dataHtmlCss: '', // 表格css文件
      dataHtmlPrint: '', // 表格打印html文件
      fileList: [],
      cusTableData: [],
      previewSrc: null,
      newUploadFiles: [],
      confirmLoading: false,
      editInfoModal: false,
      rotateValue: 0,
      //修改开户行和备注
      bankRemark: '',
      bankUserName: '',
      bank: '',
      bankNo: '',
      userRelate: '',
      userRelateRemark: '',
      //修改卡回显
      drawbackEditInfo: {},
      // 兼容老数据的标记为
      hasCardId: false,
      bankRemark: '',
      bankUserName: '',
      bank: '',
      bankNo: '',
      userRelate: '',
      userRelateRemark: ''
    }
  },
  watch: {
    dataInfo(nv) {
      if (nv) {
        this.loadInfo()
      }
    }
  },
  beforeCreate() {
    this.editForm = this.$form.createForm(this)
  },
  mounted() {
    this.loadInfo()
  },
  methods: {
    printHandle() {
      this.$refs.cusTableHtml.print()
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
          this.previewSrc = res.data
        })
        .finally(() => {
          this.$refs.previewModal.spinning = false
        })
    },
    closeModalHandle() {
      this.rotateValue = 0
    },
    editDetailedInfo(detailInfo) {
      this.editInfoModal = true
      const { attachments, cardId } = detailInfo
      if (cardId) {
        this.hasCardId = true
        this.$nextTick(() => {
          this.newUploadFiles = [].concat(attachments)
          previousRefundCard(cardId)
            .then(res => {
              this.drawbackEditInfo = res.data
            })
            .then(() => {
              this.$nextTick(() => {
                // 退费明细表,回显
                // this.$refs.detailedPayInfoDrawback.backindData()
              })
            })
        })
      } else {
        this.hasCardId = false
        const {
          refundRemark,
          refundInfo: { bankUserName, bank, bankNo, userRelate, userRelateRemark },
          attachments
        } = detailInfo
        this.$nextTick(() => {
          this.newUploadFiles = [].concat(attachments)
          this.bankRemark = refundRemark
          this.bankUserName = bankUserName
          this.bank = bank
          this.bankNo = bankNo
          this.userRelate = userRelate
          this.userRelateRemark = userRelateRemark
          this.editInfoModal = true
        })
      }
    },
    deleteFile(item) {
      this.newUploadFiles.remove(item)
    },
    cancelHandel() {
      this.editInfoModal = false
    },
    saveEditInfo() {
      if (!this.hasCardId) {
        const refundId = this.refundId
        this.$refs.uploadsth
          .multipleHandleUpload()
          .then(res => {
            const old = []
            this.newUploadFiles.map(item => {
              old.push(item.id)
            })
            const params = {
              remark: this.bankRemark,
              bankUserName: this.bankUserName,
              bank: this.bank,
              bankNo: this.bankNo,
              userRelate: this.userRelate,
              userRelateRemark: this.userRelateRemark,
              attachment: res ? `${old.join(',')},${res}` : old.join(','),
              refundId
            }
            this.confirmLoading = true
            return params
          })
          .then(params => {
            updateAttachment(params).then(res => {
              this.$notification.success({
                message: '系统通知',
                description: '提交成功'
              })
              this.refreshAll()
              this.editInfoModal = false
            })
          })
          .finally(() => (this.confirmLoading = false))
      } else {
        let params = {}
        this.$refs.uploadsth
          .multipleHandleUpload()
          .then(res => {
            const old = []
            this.newUploadFiles.map(item => {
              old.push(item.id)
            })
            params.attachments = res ? `${old.join(',')},${res}` : old.join(',')
            params.stuCardId = this.drawbackEditInfo.cardId
            return params
          })
          // 退费明细表 提交参数合并
          // .then(this.$refs.detailedPayInfoDrawback.getAllData)
          // .then(drawbackInfo => {
          //   params.stuCardId = this.drawbackEditInfo.cardId
          //   Object.assign(params, drawbackInfo)
          //   return params
          // })

          .then(params => {
            console.log(params, 111)
            saveRefundAttachment({ financeId: this.drawbackEditInfo.finance.id, attachment: params.attachments }).then(res => {
              if (res.code === 200) {
                this.$notification.success({
                  message: '系统通知',
                  description: '提交成功'
                })
                this.refreshAll()
                this.editInfoModal = false
              }
            })
          })
          .finally(() => (this.confirmLoading = false))
          .catch(err => {
            console.log(err)
          })
          .finally((this.confirmLoading = false))
      }
    },
    loadInfo() {
      refundDetail(this.dataInfo.id).then(res => {
        this.detailInfo = res.data
        this.dataHtml = res.data.refundDetailView
        this.dataHtmlCss = res.data.refundDetailViewCss
        this.dataHtmlPrint = res.data.refundDetailView_Print
        this.fileList = res.data.attachments
        this.refundId = res.data.refundInfo.id
        this.cusTableData = formatCusTabelData(res.data)
      })
    },
    refreshAll() {
      this.$emit('refresh')
      this.loadInfo()
    }
  }
}
</script>

<style>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
