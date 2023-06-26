<template>
  <div class="stu-leave-wrapper">
    <!--<div class="btn-wrapper">
      <perm-box perm="finance:invoice:save">
        <a-button icon="plus-circle" type="primary" @click="$emit('openaddinvoice','A')">新增</a-button>
      </perm-box>
      <perm-box perm="finance:invoice:edit">
        <a-button icon="plus-circle" type="primary" @click="$emit('openaddinvoice','B')">新增</a-button>
      </perm-box>
    </div>-->
    <a-table ref="table" :pagination="false" :columns="columns" :rowKey="record => record.finInvoiceId" :dataSource="dataSource" :loading="loading">
      <span slot="action" slot-scope="text, record">
        <!-- 已开票 || 已反馈 可查看附件 -->
        <perm-box perm="finance:invoice:view">
          <a v-if="record.status == 'B' || record.status == 'C'" @click="handleDetail(record)">查看</a>
        </perm-box>
      </span>
    </a-table>
    <a-modal
      :maskClosable="$store.state.modalMaskClickEnable"
      :width="800"
      title="查看"
      :visible="attachmentShow"
      :confirmLoading="checkLoading"
      @ok="UpdateAttachments"
      @cancel="attachmentShowClose"
    >
      <Attachment :files="attachments" :delectOpen="true" ref="Attachment" @finalFiles="finalFiles"></Attachment>
      <perm-box perm="finance:invoice:approve">
        <a-form :form="editForm">
          <a-divider orientation="left">
            <span :style="{ color: 'rgba(1,1,1,.3)' }">重新上传附件</span>
          </a-divider>
          <a-form-item v-bind="{ labelCol: { span: 3 }, wrapperCol: { span: 16 } }" label="附件">
            <upload-sth ref="uploadsth" :multiple="true" :required="false" btn-text="附件上传" filePath="reason" @uploadFilesNum="uploadFilesNum"></upload-sth>
            <div class="uploadedFile" v-for="(item, idx) in newUploadFiles" :key="idx">
              <span style="display: flex;flex-flow: row nowrap;justify-content: space-between;">
                <span>{{ item.fileName }}</span>
                <span style="margin-left: 15px;" class="close" @click="deleteFile(item)"><a-icon type="close" style="font-size: 10px;"/></span>
              </span>
            </div>
          </a-form-item>
        </a-form>
      </perm-box>
    </a-modal>
    <!-- 查看发票详情 -->
    <CheckInvoiceDetail ref="checkInvoiceDetail" />
  </div>
</template>
<script>
import PermBox from '@/components/PermBox'
import { listStuLeave, removeStuLeave, manualEndLeave, listLeaveFile } from '@/api/reception/student'
import { listStuInvoiceLog, removeInvoice, approveInvoice, getInvoiceAttachments, getInvoiceDetail, getInvoiceList } from '@/api/invoice/invoice'
import { Attachment } from '@/components'
import UploadSth from '@/components/UploadSth'
import CheckInvoiceDetail from '@/views/finance/components/checkInvoiceDetail.vue'
export default {
  components: {
    PermBox,
    Attachment,
    UploadSth,
    CheckInvoiceDetail
  },
  props: {
    stuId: String,
    stuPhone: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      spinning: true,
      title: '学员请假',
      columns: [
        {
          title: '分馆',
          align: 'center',
          dataIndex: 'deptName'
        },
        {
          title: '学员姓名',
          width: 140,
          align: 'center',
          dataIndex: 'stuName'
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'stuPhone'
        },
        {
          title: '申请时间',
          align: 'center',
          dataIndex: 'createDate'
        },
        {
          title: '开票抬头',
          align: 'center',
          dataIndex: 'title'
        },
        {
          title: '开票方式',
          align: 'center',
          dataIndex: 'method',
          customRender: (text, record) => {
            return text ? '企业' : '个人'
          }
        },
        {
          title: '开票类型',
          align: 'center',
          dataIndex: 'type',
          customRender: (text, record) => {
            return text === 'A' ? '普票' : text === 'B' ? '专票' : ''
          }
        },
        {
          title: '申请开票金额',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '包含班型',
          align: 'center',
          dataIndex: 'eduTypeName'
        },
        {
          title: '税号或身份证号',
          align: 'center',
          dataIndex: 'number'
        },
        {
          title: '发票内容',
          align: 'center',
          dataIndex: 'content'
        },
        {
          title: '提交人',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '操作',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataSource: [],
      loading: false,
      //上传
      visibleRefund: false,
      refundSpin: false,
      confirmLoading: false,
      drawbackEditInfo: {},
      newUploadFiles: [],
      financeId: '',
      attachmentShow: false,
      attachments: [],
      showAddModeFlag: false,
      finalAttachments: [], //删除后的附件
      checkLoading: false,
      filesNum: 0
    }
  },
  beforeCreate() {
    this.editForm = this.$form.createForm(this)
  },
  watch: {
    stuId(nv) {
      if (nv) {
        this.loadData(nv)
      }
    }
  },
  created() {
    this.loadData(this.stuId)
  },
  methods: {
    // addFinance (record) {
    //   if (record) {
    //     this.$refs.invoiceFinance.title = '编辑'
    //     this.$refs.invoiceFinance.MsgShow(record)
    //   }
    //   this.$refs.invoiceFinance.invoiceSetModal = true
    // },
    // 查看发票详情
    handleDetail(record) {
      this.$refs.checkInvoiceDetail.open(record)
    },
    //接受新上传文件的总数量
    uploadFilesNum(num) {
      this.filesNum = num
    },
    //提交查看弹窗修改后附件
    UpdateAttachments() {
      this.$refs.Attachment.finalAttach()
      if (this.filesNum === 0 && !this.finalAttachments.length) {
        this.$notification['error']({
          message: '系统通知',
          description: '请上传附件'
        })
        return
      }
      this.checkLoading = true
      console.log(this.filesNum !== 0)
      if (this.filesNum !== 0) {
        this.$refs.uploadsth
          .multipleHandleUpload()
          .then(res => {
            let arr = [...this.finalAttachments, res.split(',')].join(',')
            return approveInvoice({
              finInvoiceId: this.financeId,
              attachment: arr
            })
          })
          .then(() => {
            this.$notification.success({
              message: '系统通知',
              description: '提交成功'
            })
            this.loadData(this.stuId)()
            this.$refs.uploadsth.reset()
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.checkLoading = false
            this.attachmentShowClose()
          })
      } else {
        approveInvoice({
          finInvoiceId: this.financeId,
          attachment: this.finalAttachments.join(',')
        })
          .then(() => {
            this.$notification.success({
              message: '系统通知',
              description: '提交成功'
            })
            this.loadData(this.stuId)
            this.$refs.uploadsth.reset()
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            this.checkLoading = false
            this.attachmentShowClose()
          })
      }
    },
    //删除后的文件数组
    finalFiles(files) {
      this.finalAttachments = files.map(item => {
        return item.id
      })
    },
    //查看弹窗关闭
    attachmentShowClose() {
      if (this.$refs.uploadsth) {
        this.$refs.uploadsth.reset()
      }
      this.$refs.Attachment.resetFiles()
      this.attachmentShow = false
      this.finalAttachments = []
      this.filesNum = 0
      this.financeId = ''
      this.attachments = []
      this.loadData(this.stuId)
    },
    loadData(stuId) {
      console.log(stuId)
      this.loading = true
      getInvoiceList({studentInfo: this.stuPhone, page: 0, limit: 0})
        .then(res => {
          console.log(res)
          this.dataSource = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    edit(record) {
      this.$emit('editInvoice', record)
    },
    handleRefundSubmit() {
      let params = {}
      this.confirmLoading = true
      this.$refs.uploadsth
        .multipleHandleUpload()
        .then(res => {
          return approveInvoice({
            finInvoiceId: this.financeId,
            attachment: res
          })
        })
        .then(() => {
          this.$notification.success({
            message: '系统通知',
            description: '提交成功'
          })
          this.visibleRefund = false
          this.loadData(this.stuId)
          this.$refs.uploadsth.reset()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    remove(record) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '是否删除该条数据',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeInvoice(record.id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            _this.loadData(_this.stuId)
          })
        }
      })
    },
    check(record) {
      this.financeId = record.id

      getInvoiceAttachments({
        finInvoiceId: record.id
      }).then(data => {
        if (data.code == 200) {
          if (data.data.length) {
            this.attachments = data.data
            this.attachmentShow = true
          }
        }
      })
    },
    //撤销
    revocation(record) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '是否撤销该条数据',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          getInvoiceDetail({
            finInvoiceId: record.id,
            status: 'D'
          }).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '撤销成功'
            })
            _this.loadData(_this.stuId)
          })
        }
      })
    },
    //确认
    affirm(record) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '是否确认该条数据',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          getInvoiceDetail({
            finInvoiceId: record.id,
            status: 'C'
          }).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '确认成功'
            })
            _this.loadData(_this.stuId)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-wrapper {
  .btn-wrapper {
    margin-bottom: 20px;
  }
}
</style>
