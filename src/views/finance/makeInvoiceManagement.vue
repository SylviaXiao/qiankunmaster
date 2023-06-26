<template>
  <div class="stu-leave-wrapper">
    <perm-box perm="finance:invoice:view">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit"
          :searchParams="searchParams"></search-com-pro>
      </a-card>
      <a-card :bordered="false">
        <div class="btn-wrapper">
          <div style="display: flex;align-items: center;justify-content: space-between;">
            <a-space>
              <!-- 待开票 -->
              <template v-if="invoiceStatus === 'A'">
                <perm-box perm="finance:invoice:save">
                  <a-button icon="plus-circle" type="primary" @click="handleAdd">新增</a-button>
                </perm-box>
                <!-- 补录入口暂不显示 -->
                <!-- <perm-box perm="finance:invoice:edit">
                  <a-button icon="plus-circle" type="primary" @click="addFinance()">补录</a-button>
                </perm-box> -->
                <perm-box perm="finance:invoice:down">
                  <a-button type="primary" @click="handleBatchExport">批量导出</a-button>
                </perm-box>
                <perm-box perm="finance:invoice:noInvoice">
                  <a-button type="primary" :disabled="!hasSelections" @click="handleDelay(null)">批量暂不开票</a-button>
                </perm-box>
                <perm-box perm="finance:invoice:up">
                  <a-button type="primary" @click="handleBatchImport">批量导入发票</a-button>
                </perm-box>
              </template>
              <template v-if="invoiceStatus === 'B'">
                <perm-box perm="finance:invoice:zipDown">
                  <a-button type="primary" :disabled="!hasSelections" @click="handleDownloadZip">批量下载附件</a-button>
                </perm-box>
              </template>
              <a-button @click="updateTable">刷新</a-button>
            </a-space>
            <div style="text-align:right; margin: 10px 0;">
              <a-radio-group v-model="invoiceStatus" button-style="solid" @change="onInvoiceStatusChange">
                <perm-box perm="finance:invoice:statusA">
                  <a-radio-button value="A">待开票</a-radio-button>
                </perm-box>
                <perm-box perm="finance:invoice:statusB">
                  <a-radio-button value="B">已开票</a-radio-button>
                </perm-box>
                <perm-box perm="finance:invoice:statusC">
                  <a-radio-button value="C">已反馈</a-radio-button>
                </perm-box>
                <perm-box perm="finance:invoice:statusD">
                  <a-radio-button value="D">已撤销</a-radio-button>
                </perm-box>
                <!-- <a-radio-button value="E">已作废</a-radio-button> -->
                <perm-box perm="finance:invoice:statusF">
                  <a-radio-button value="F">暂不开票</a-radio-button>
                </perm-box>
              </a-radio-group>
            </div>
          </div>
        </div>
        <s-table ref="table" size="default" :columns="InvoiceManagementTable" :data="loadData" rowKey="finInvoiceId"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectionChange }">
          <span slot="userNameTitle">
            <!-- 待开票 -->
            <template v-if="invoiceStatus === 'A'">
              提交人
            </template>
            <!-- 已开票 -->
            <template v-else-if="invoiceStatus === 'B'">
              操作人
            </template>
            <!-- 已反馈 -->
            <template v-else-if="invoiceStatus === 'C'">
              操作人
            </template>
            <!-- 暂不开票 -->
            <template v-else-if="invoiceStatus === 'F'">
              暂停人
            </template>
            <template v-else>
              提交人
            </template>
          </span>
          <span slot="userName" slot-scope="text, record">
            <!-- 待开票 -->
            <template v-if="invoiceStatus === 'A'">
              {{ record.userName }}
            </template>
            <!-- 已开票 -->
            <template v-else-if="invoiceStatus === 'B'">
              {{ record.upOrgUserName }}
            </template>
            <!-- 已反馈 -->
            <template v-else-if="invoiceStatus === 'C'">
              {{ record.upOrgUserName }}
            </template>
            <!-- 暂不开票 -->
            <template v-else-if="invoiceStatus === 'F'">
              {{ record.userName }}
            </template>
            <template v-else>
              {{ record.userName }}
            </template>
          </span>
          <span slot="action" slot-scope="text, record">
            <!-- 待开票 -->
            <template v-if="invoiceStatus === 'A'">
              <perm-box perm="finance:invoice:up">
                <a @click="handleUpload(record)">上传发票</a>
              </perm-box>
              <perm-box perm="finance:invoice:revoke">
                <a @click="handleRovoke(record)">撤销</a>
              </perm-box>
              <perm-box perm="finance:invoice:del">
                <a @click="handleDelete(record)">删除</a>
              </perm-box>
              <perm-box perm="finance:invoice:noInvoice">
                <a @click="handleDelay(record)">暂不开票</a>
              </perm-box>
            </template>

            <!-- 已开票 -->
            <template v-if="invoiceStatus === 'B'">
              <perm-box perm="finance:invoice:view">
                <a @click="handleDetail(record)">查看</a>
              </perm-box>
              <perm-box perm="finance:invoice:feed">
                <a @click="handleFeedback(record)">反馈</a>
              </perm-box>
              <perm-box perm="finance:invoice:discarded">
                <a @click="handleDiscard(record)">作废</a>
              </perm-box>

            </template>

            <!-- 已确认（已反馈） -->
            <template v-if="invoiceStatus === 'C'">
              <perm-box perm="finance:invoice:view">
                <a @click="handleDetail(record)">查看</a>
              </perm-box>
              <perm-box perm="finance:invoice:feed">
                <a @click="handleFeedback(record)">补传反馈</a>
              </perm-box>
            </template>

            <!-- 已撤销 -->
            <template v-if="invoiceStatus === 'D'">
              <perm-box perm="finance:invoice:view">
                <a @click="handleUpdate(record)">修改</a>
              </perm-box>
              <perm-box perm="finance:invoice:del">
                <a @click="handleDelete(record)">删除</a>
              </perm-box>

            </template>

            <!-- 暂不开票 -->
            <template v-if="invoiceStatus === 'F'">
              <perm-box perm="finance:invoice:up">
                <a @click="handleUpload(record)">上传发票</a>
              </perm-box>
              <perm-box perm="finance:invoice:noInvoice">
                <a @click="handleRecover(record)">恢复</a>
              </perm-box>
            </template>
          </span>
        </s-table>
      </a-card>
    </perm-box>
    <invoiceFinance ref="invoiceFinance" :studentInfo="studentInfo" @updateTable="updateTable" />
    <!-- <ChooseStu ref="choosestu" :multiple="false" @getBackData="getStuData" :invoiceList="true" :noArea="true" :branch="true" :studentNumber="true"></ChooseStu> -->
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="800" title="上传附件" :visible="visibleRefund"
      :confirmLoading="confirmLoading" @ok="handleRefundSubmit" @cancel="visibleRefund = false">
      <a-row class="msgShow">
        <a-col :span="12"> 学员姓名：{{ uploadMsg.stuName }} </a-col>
        <a-col :span="12"> 手机号码：{{ uploadMsg.stuPhone }} </a-col>
      </a-row>
      <a-row class="msgShow" v-if="invoiceType !== 'A'">
        <a-col :span="12"> 可开票金额：{{ uploadMsg.financePrice }} 元</a-col>
        <a-col :span="12">
          该学员退费金额：<span style="font-weight:bold;color:red;">{{ uploadMsg.refundPrice }}</span> 元</a-col>
      </a-row>
      <a-row class="msgShow" v-else>
        <!-- {{uploadMsg}} -->
        <a-col :span="12"> 开票日期：{{ uploadMsg.applyDate }} </a-col>
        <a-col :span="12">
          需开票金额：<span style="font-weight:bold;color:red;">{{ uploadMsg.price }}</span> 元</a-col>
      </a-row>
      <a-table v-if="invoiceType !== 'A'" :columns="columns" :dataSource="uploadMsg.financeList"
        :rowKey="(record, index) => index" :pagination="false" bordered style="padding-bottom:30px;">
      </a-table>
      <div style="display:flex;justify-content: space-between;" class="msgShow" v-if="invoiceType !== 'A'">
        <div></div>
        <div style="font-size:15px;">
          需开票金额：<span style="font-weight:bold;color:red;">{{ invoiceTotal }}</span>元
        </div>
      </div>
      <a-row class="msgShow">
        <a-col :span="12"> 开票方式：{{ uploadMsg.method ? '企业' : '个人' }} </a-col>
        <a-col :span="12"> 开票类型：{{ uploadMsg.type === 'A' ? '普票' : '专票' }} </a-col>
      </a-row>
      <a-row class="msgShow">
        <a-col :span="12"> 发票抬头：{{ uploadMsg.title || '' }} </a-col>
      </a-row>
      <a-row class="msgShow">
        <a-col :span="12"> {{ uploadMsg.method === 'false' ? '身份证号：' : '税号：' }}{{ uploadMsg.ideNumber }} </a-col>
      </a-row>
      <a-row class="msgShow">
        <a-col :span="12"> 发票内容：{{ uploadMsg.content }} </a-col>
      </a-row>
      <template v-if="uploadMsg.method === 'true'">
        <a-row class="msgShow">
          <a-col :span="12"> 开票地址：{{ uploadMsg.address }} </a-col>
        </a-row>
        <a-row class="msgShow">
          <a-col :span="12"> 开户账号：{{ uploadMsg.bankNumber }} </a-col>
        </a-row>
        <a-row class="msgShow">
          <a-col :span="12"> 开票电话：{{ uploadMsg.phone }} </a-col>
        </a-row>
      </template>
      <a-row class="msgShow">
        <a-col :span="12"> 备注：{{ uploadMsg.remark }} </a-col>
      </a-row>
      <a-spin :spinning="refundSpin">
        <a-form :form="editForm">
          <a-divider orientation="left">
            <span :style="{ color: 'rgba(1,1,1,.3)' }">附件</span>
          </a-divider>
          <a-form-item v-bind="{ labelCol: { span: 3 }, wrapperCol: { span: 16 } }" label="附件">
            <upload-sth ref="uploadsth" :multiple="true" :required="false" btn-text="附件上传" filePath="reason"></upload-sth>
            <div class="uploadedFile" v-for="(item, idx) in newUploadFiles" :key="idx">
              <span style="display: flex;flex-flow: row nowrap;justify-content: space-between;">
                <span>{{ item.fileName }}</span>
                <span style="margin-left: 15px;" class="close" @click="deleteFile(item)"><a-icon type="close"
                    style="font-size: 10px;" /></span>
              </span>
            </div>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :width="800" title="查看" :visible="attachmentShow"
      :confirmLoading="checkLoading" @ok="UpdateAttachments" @cancel="attachmentShowClose">
      <a-row class="msgShow">
        <a-col :span="12"> 学员姓名：{{ uploadMsg.stuName }} </a-col>
        <a-col :span="12"> 手机号码：{{ uploadMsg.stuPhone }} </a-col>
      </a-row>
      <a-row class="msgShow">
        <a-col :span="12"> 可开票金额：{{ uploadMsg.financePrice }} 元</a-col>
        <a-col :span="12">
          该学员退费金额：<span style="font-weight:bold;color:red;">{{ uploadMsg.refundPrice }}</span> 元</a-col>
      </a-row>
      <a-table :columns="columns" :dataSource="uploadMsg.financeList" :rowKey="(record, index) => index"
        :pagination="false" bordered style="padding-bottom:30px;">
      </a-table>
      <div style="display:flex;justify-content: space-between;" class="msgShow">
        <div></div>
        <div style="font-size:15px;">
          需开票金额：<span style="font-weight:bold;color:red;">{{ invoiceTotal }}</span>元
        </div>
      </div>
      <a-row class="msgShow">
        <a-col :span="12"> 开票方式：{{ uploadMsg.method ? '企业' : '个人' }} </a-col>
        <a-col :span="12"> 开票类型：{{ uploadMsg.type === 'A' ? '普票' : '专票' }} </a-col>
      </a-row>
      <a-row class="msgShow">
        <a-col :span="12"> 发票抬头：{{ uploadMsg.title || '' }} </a-col>
      </a-row>
      <a-row class="msgShow">
        <a-col :span="12"> {{ uploadMsg.method === 'false' ? '身份证号：' : '税号：' }}{{ uploadMsg.ideNumber }} </a-col>
      </a-row>
      <a-row class="msgShow">
        <a-col :span="12"> 发票内容：{{ uploadMsg.content }} </a-col>
      </a-row>
      <template v-if="uploadMsg.method === 'true'">
        <a-row class="msgShow">
          <a-col :span="12"> 开票地址：{{ uploadMsg.address }} </a-col>
        </a-row>
        <a-row class="msgShow">
          <a-col :span="12"> 开户账号：{{ uploadMsg.bankNumber }} </a-col>
        </a-row>
        <a-row class="msgShow">
          <a-col :span="12"> 开票电话：{{ uploadMsg.phone }} </a-col>
        </a-row>
      </template>
      <a-row class="msgShow">
        <a-col :span="12"> 备注：{{ uploadMsg.remark }} </a-col>
      </a-row>
      <Attachment :files="attachments" :delectOpen="true" ref="Attachment" @finalFiles="finalFiles"></Attachment>
      <perm-box perm="finance:invoice:approve">
        <a-form :form="editForm">
          <a-divider orientation="left">
            <span :style="{ color: 'rgba(1,1,1,.3)' }">重新上传附件</span>
          </a-divider>
          <a-form-item v-bind="{ labelCol: { span: 3 }, wrapperCol: { span: 16 } }" label="附件">
            <upload-sth ref="uploadsth" :multiple="true" :required="false" btn-text="附件上传" filePath="reason"
              @uploadFilesNum="uploadFilesNum"></upload-sth>
            <div class="uploadedFile" v-for="(item, idx) in newUploadFiles" :key="idx">
              <span style="display: flex;flex-flow: row nowrap;justify-content: space-between;">
                <span>{{ item.fileName }}</span>
                <span style="margin-left: 15px;" class="close" @click="deleteFile(item)"><a-icon type="close"
                    style="font-size: 10px;" /></span>
              </span>
            </div>
          </a-form-item>
        </a-form>
      </perm-box>
    </a-modal>
    <!-- 批量导入发票 -->
    <ImportInvoices ref="importInvoices" @ok="updateTable" />
    <!-- 上传发票 -->
    <UploadInvoices ref="uploadInvoices" @ok="updateTable" />
    <!-- 新增/修改发票 -->
    <AddinvoiceSetAmodal ref="AddinvoiceSetAmodal" @updateTable="updateTable" />
    <!-- 查看发票详情 -->
    <CheckInvoiceDetail ref="checkInvoiceDetail" />
    <!-- 反馈 -->
    <InvoiceFeedback ref="invoiceFeedback" @ok="updateTable" />
  </div>
</template>
<script>
import { pageFinShop, removeFinShop } from '@/api/finance/finance'
import AddinvoiceSetAmodal from '@/components/AddinvoiceSetAmodal/AddinvoiceSetAmodal'
import invoiceFinance from './modules/invoiceFinance'
import { pageInvoice, removeInvoice, approveInvoice, getInvoiceAttachments, getInvoiceDetail, getFinanceInvoice, getInvoiceList, invoiceCheckStatus, revokeInvoice, deleteInvoices, exportInvoices, discardInvoice, downloadZipInvoices } from '@/api/invoice/invoice'
import { listArea, listEduDance } from '@/api/common'
import { InvoiceManagementTable } from './finance'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
// import ChooseStu from '@/components/ChooseStu'
import UploadSth from '@/components/UploadSth'
import { Attachment } from '@/components'
import { getSchoolList } from '@/api/education/card'
import ImportInvoices from './components/importInvoices.vue'
import UploadInvoices from './components/uploadInvoices.vue'
import CheckInvoiceDetail from './components/checkInvoiceDetail.vue'
import InvoiceFeedback from './components/invoiceFeedback.vue'
import { listEduType, treeEduClassType } from '@/api/common'
export default {
  components: {
    SearchComPro,
    STable,
    PermBox,
    AddinvoiceSetAmodal,
    // ChooseStu,
    Attachment,
    UploadSth,
    invoiceFinance,
    ImportInvoices,
    UploadInvoices,
    CheckInvoiceDetail,
    InvoiceFeedback
  },

  data() {
    return {
      columns: [
        {
          title: '缴费日期',
          key: 'createDate',
          dataIndex: 'createDate',
          scopedSlots: { customRender: 'createDate' },
          customRender: (text, record) => {
            return text.split(' ')[0]
          }
        },
        {
          title: '缴费金额',
          key: 'price',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '缴费方式',
          key: 'type',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          customRender: (text, record) => {
            return text === 'A' ? '全款' : 'B' ? '定金' : 'C' ? '补缴' : ''
          }
        },
        {
          title: '支付方式',
          key: 'dictValue',
          dataIndex: 'dictValue',
          scopedSlots: { customRender: 'dictValue' }
        },
        {
          title: '已开票金额',
          key: 'invoicePrice',
          dataIndex: 'invoicePrice',
          scopedSlots: { customRender: 'invoicePrice' },
          customRender: (text, record) => {
            return text || 0
          }
        },
        {
          title: '需开票金额',
          key: 'needInvoicePrice',
          dataIndex: 'needInvoicePrice',
          scopedSlots: { customRender: 'needInvoicePrice' },
          customRender: (text, record) => {
            return text || 0
          }
        },
        {
          title: '剩余开票金额',
          key: 'surplus',
          dataIndex: 'surplus',
          scopedSlots: { customRender: 'surplus' },
          customRender: (text, record) => {
            return record.price - (record.invoicePrice + record.needInvoicePrice) || 0
          }
        }
        // {
        //   title: '操作',
        //   key: 'action',
        //   dataIndex: 'action',
        //   scopedSlots: { customRender: 'action' }
        // },
      ],
      searchParams: [
        {
          type: 'text',
          key: 'studentInfo',
          label: '学员信息',
          placeholder: '学员姓名/手机号'
        },
        {
          type: 'treeSelect',
          key: 'deptIds',
          isShow: !this.$store.getters.school_id,
          label: '申请分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          mutiple: true,
          selectFather: true,
          treeCheckable: true,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'select',
          key: 'eduTypeIds',
          isShow: true,
          label: '类型',
          placeholder: '请选择类型',
          apiOption: {
            api: listEduType,
            string: 'name',
            value: 'id'
          }
        },
        {
          type: 'date',
          key: 'Date',
          label: '申请时间',
          placeholder: '请选择时间',
          format: 'YYYY-MM-DD'
        },
        {
          type: 'arrText',
          key: 'price',
          selectKey: 'type',
          arrPlaceholder: '请输入',
          label: '金额',
          placeholder: '请输入',
          staticArr: [
            {
              string: '大于',
              value: 'A'
            },
            {
              string: '等于',
              value: 'C'
            },
            {
              string: '小于',
              value: 'B'
            },
          ]
        },
      ],
      InvoiceManagementTable,
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      loadData: parameter => {
        let params = { ...parameter, ...this.queryParam }
        params.status = this.invoiceStatus
        return getInvoiceList(params).then(res => {
          return res
        })
      },
      studentInfo: {},
      //上传
      visibleRefund: false,
      refundSpin: false,
      confirmLoading: false,
      drawbackEditInfo: {},
      newUploadFiles: [],
      financeId: '',
      attachmentShow: false,
      attachments: [],
      finalAttachments: [], //删除后的附件
      showAddModeFlag: false,
      checkLoading: false,
      filesNum: 0,
      invoiceStatus: 'A',
      uploadMsg: {},
      invoiceType: ''
    }
  },
  beforeCreate() {
    this.editForm = this.$form.createForm(this)
  },
  computed: {
    hasSelections() {
      return this.selectedRowKeys?.length > 0
    },
    invoiceTotal() {
      let total = 0
      if (this.uploadMsg.financeList) {
        total = this.uploadMsg.financeList
          .map(item => item.needInvoicePrice)
          .reduce((a, b) => {
            return a + b
          }, 0)
      }
      return total
    }
  },
  methods: {
    updateTable() {
      this.$refs.table.loadData()
    },
    onInvoiceStatusChange() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.updateTable()
    },
    onSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 批量导出
    handleBatchExport() {
      this.$confirm({
        title: '系统提示',
        content: '是否确认批量导出',
        onOk: () => {
          this.$message.info('正在导出，请稍后')
          const params = this.queryParam
          params.status = this.invoiceStatus
          exportInvoices(params).then(res => {
            this.$tools.exportExcel(res, `发票`)
            this.$message.success('导出完成')
          })
        }
      })
    },
    // 批量导入发票
    handleBatchImport() {
      this.$refs.importInvoices.open()
    },
    // 上传发票
    handleUpload(record) {
      this.$refs.uploadInvoices.open(record)
    },
    // 撤销发票
    handleRovoke(record) {
      this.$confirm({
        title: '系统提示',
        content: '是否确认撤销',
        onOk: () => {
          const params = { finInvoiceId: record.finInvoiceId }
          revokeInvoice(params).then(res => {
            this.$notification.success({
              message: '系统通知',
              description: res.msg
            })
            this.updateTable()
          })
        }
      })
    },
    // 查看发票详情
    handleDetail(record) {
      this.$refs.checkInvoiceDetail.open(record)
    },
    // 批量删除发票
    handleDelete(record) {
      this.$confirm({
        title: '系统提示',
        content: '是否确认删除',
        onOk: () => {
          const params = { finInvoiceIds: record.finInvoiceId }
          deleteInvoices(params).then(res => {
            this.$notification.success({
              message: '系统通知',
              description: res.msg
            })
            this.updateTable()
          })
        }
      })
    },
    // 批量（单个）暂不开票 
    handleDelay(record = null) {
      this.commonCheckStatus(record, 'F')
    },
    // 批量（单个）暂不开票
    handleRecover(record = null) {
      this.commonCheckStatus(record, 'A')
    },
    // 暂不开票和恢复开票同一个接口
    commonCheckStatus(record, status) {
      const text = status == 'F' ? '暂不开票' : status == 'A' ? '恢复开票' : ''
      this.$confirm({
        title: '系统提示',
        content: `是否确认${text}`,
        onOk: () => {
          let params = {
            finInvoiceIds: '',
            status
          }
          if (record) {
            const { finInvoiceId } = record
            params.finInvoiceIds = finInvoiceId
          } else {
            let ids = []
            for (const item of this.selectedRows) {
              const { finInvoiceId } = item
              ids.push(finInvoiceId)
            }
            params.finInvoiceIds = ids.join(',')
          }
          invoiceCheckStatus(params).then(res => {
            this.updateTable()
            this.$notification.success({
              message: '系统通知',
              description: res.msg
            })
          })
        }
      })
    },
    // 新增发票
    handleAdd() {
      this.handleUpdate(null)
    },
    // 修改发票信息
    handleUpdate(record) {
      this.$refs.AddinvoiceSetAmodal.open(record)
    },
    // 批量下载附件（zip格式）
    handleDownloadZip() {
      this.$confirm({
        title: '系统提示',
        content: '是否确认批量下载附件',
        onOk: () => {
          this.$message.info('正在导出，请稍后')
          let invoiceIds = []
          for (const item of this.selectedRows) {
            invoiceIds.push(item.finInvoiceId)
          }
          downloadZipInvoices({ invoiceIds: invoiceIds.join(',') }).then(res => {
            this.$tools.downloadZip(res, `发票`)
            this.$message.success('导出完成')
          })
        }
      })
    },
    // 反馈
    handleFeedback(record) {
      this.$refs.invoiceFeedback.open(record)
    },
    // 作废
    handleDiscard(record) {
      this.$confirm({
        title: '系统提示',
        content: '是否确认作废',
        onOk: () => {
          const params = { finInvoiceId: record.finInvoiceId }
          discardInvoice(params).then(res => {
            this.$notification.success({
              message: '系统通知',
              description: res.msg
            })
            this.updateTable()
          })
        }
      })
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
            this.updateTable()
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
            this.updateTable()
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
      this.updateTable()
    },
    deleteFile(item) {
      this.newUploadFiles.remove(item)
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
          this.updateTable()
          this.$refs.uploadsth.reset()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.financeId = ''
          this.confirmLoading = false
        })
    },
    upload(record) {
      this.financeId = record.id
      this.invoiceType = record.invoiceType
      getFinanceInvoice(record.stuId, { invoiceId: record.id }).then(res => {
        if (res.code === 200) {
          this.uploadMsg = { ...record, ...res.data }
          this.visibleRefund = true
        }
      })
      // this.uploadMsg = record
    },
    check(record) {
      this.financeId = record.id
      getFinanceInvoice(record.stuId, { invoiceId: record.id }).then(res => {
        if (res.code === 200) {
          this.uploadMsg = { ...record, ...res.data }
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
        }
      })
    },
    // getStuData(data) {
    //   this.$refs.AddinvoiceSetAmodal.title = '新增'
    //   let arr = ['stuName', 'stuPhone', 'stuId']
    //   arr.forEach(item => (this.studentInfo[item] = data[item]))
    //   this.studentInfo.invoicePrice = data.price
    //   this.$nextTick(() => {
    //     this.$refs.AddinvoiceSetAmodal.invoiceSetModal = true
    //     this.$refs.AddinvoiceSetAmodal.getStudentInfo()
    //   })
    // },
    edit(record) {
      if (record.invoiceType === 'A') {
        this.addFinance(record)
      } else {
        this.add(record)
      }
    },
    addFinance(record) {
      if (record) {
        this.$refs.invoiceFinance.title = '编辑'
        this.$refs.invoiceFinance.MsgShow(record)
      }
      this.$refs.invoiceFinance.invoiceSetModal = true
    },
    // add(record) {
    //   if (record) {
    //     this.$refs.AddinvoiceSetAmodal.title = '编辑'
    //     this.$refs.AddinvoiceSetAmodal.MsgShow(record)
    //   }
    //   this.$refs.AddinvoiceSetAmodal.invoiceSetModal = true
    // },
    searchSubmit(data) {
      this.queryParam = data
      this.updateTable()
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

.msgShow {
  margin-bottom: 30px;
}
</style>
