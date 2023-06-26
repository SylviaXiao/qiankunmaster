<template>
  <a-modal :width="1200" title="上传发票" :visible="visible" :confirmLoading="confirmLoading" @ok="handleUpload"
    @cancel="close">
    <h3 class="text-bold">开票信息</h3>
    <a-row v-if="finInvoice" style="font-size: 16px;line-height: 26px;">
      <a-col :span="6">学员姓名：{{ finInvoice.stuName }}</a-col>
      <a-col :span="6">手机号：{{ finInvoice.stuPhone }}</a-col>
      <a-col :span="6">申请分馆：{{ finInvoice.deptName }}</a-col>
      <a-col :span="6">申请时间：{{ finInvoice.createDate }}</a-col>
      <a-col :span="6">开票方式：{{ finInvoice.method ? '企业' : '个人' }}</a-col>
      <a-col :span="6">开票类型：{{ finInvoice.type === 'A' ? '普票' : finInvoice.type === 'B' ? '专票' : '' }}</a-col>
      <a-col :span="6">开票抬头：{{ finInvoice.title }}</a-col>
      <a-col :span="6">税号或身份证号：{{ finInvoice.ideNumber }}</a-col>
      <a-col v-if="finInvoice.address" :span="6">开票地址：{{ finInvoice.address }}</a-col>
      <a-col v-if="finInvoice.phone" :span="6">发票电话：{{ finInvoice.phone }}</a-col>
      <a-col v-if="finInvoice.bankNumber" :span="6">开户账号：{{ finInvoice.bankNumber }}</a-col>
      <a-col v-if="finInvoice.bank" :span="6">开户行：{{ finInvoice.bank }}</a-col>
    </a-row>
    <div class="my-20">
      <a-table :columns="columns" :dataSource="tableList" :rowKey="(record, index) => index" :pagination="false" bordered
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectionChange }"> </a-table>
    </div>


    <!-- 上传发票 -->
    <a-modal :width="1200" title="上传发票" :visible="uploadVisible" okText="确认上传" @ok="handleOk"
      @cancel="uploadVisible = false">
      <a-table :columns="uploadColumns" :dataSource="uploadList" :rowKey="(record, index) => index" :pagination="false"
        bordered>
        <span slot="nowPrice" slot-scope="text, record, index">
          <!-- 本次开票价小于等于缴费金额-往期开票金额 -->
          <a-input-number v-model="record.nowPrice" style="width:100%" :precision="2" :min="0"
            :max="record.infoPrice" @blur="calInvoiceData" />
        </span>
        <!-- <span slot="surplus" slot-scope="text, record">
          {{ calSurplus(record) }}
        </span> -->
      </a-table>
      <div class="flex space-between mt-10">
        <div>申请开票金额合计：{{ infoPriceTotal }}</div>
        <div>本次实际开票金额： <span style="color:red;font-size: 18px;">{{ currentInvoiceTotal }}</span></div>
      </div>
      <div class="mt-20">
        <a-form-model :model="form" :labelCol="{ span: 4 }" :wrapperCol="{ span: 16 }">
          <a-row>
            <a-col :span="12">
              <a-form-model-item label="开票公司">
                <a-select v-model="form.companyId" show-search option-filter-prop="children"
                  :filter-option="filterOption">
                  <a-select-option v-for="( item, index ) in  companyOptions " :key="index" :value="item.id">{{
                    item.companyName
                  }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="上传附件">
                <a-upload v-if="form.companyId" ref="upload" :remove="onFilesRemove" :customRequest="customRequest">
                  <a-button> <a-icon type="upload" /> 上传文件</a-button>
                  <div>支持格式：.pdf, .ofd, .png, .jpg, .jpeg</div>
                </a-upload>
                <div v-else>请先选择开票公司</div>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-modal>
  </a-modal>
</template>

<script>

import { autoUploadErp } from '@/utils/upload'
import { uploadGetInvoiceInfo, uploadOneInvoice, getCompanyList } from '@/api/invoice/invoice'
import Decimal from "decimal.js"

const columns = [
  {
    title: '缴费日期',
    width: 180,
    align: 'center',
    dataIndex: 'tradeDate',
  },
  {
    title: '缴费金额',
    width: 110,
    align: 'center',
    dataIndex: 'price',
  },
  {
    title: '包含班型',
    width: 120,
    align: 'center',
    dataIndex: 'eduTypeName',
  },
  {
    title: '申请开票金额',
    width: 100,
    align: 'center',
    dataIndex: 'infoPrice',
  },
  {
    title: '往期已开票金额',
    width: 110,
    align: 'center',
    dataIndex: 'actualPrice',
  },
  {
    title: '缴费类型',
    width: 100,
    align: 'center',
    dataIndex: 'type',
    customRender: (text, record) => {
      return text === 'A' ? '全款' : 'B' ? '定金' : 'C' ? '补缴' : ''
    }
  },
  {
    title: '支付方式',
    width: 100,
    align: 'center',
    dataIndex: 'dictValue',
  },
  {
    title: '到账银行',
    width: 120,
    align: 'center',
    dataIndex: 'bankNo',
  },
  {
    title: '收款分馆',
    width: 120,
    align: 'center',
    dataIndex: 'deptName',
  },
]

const uploadColumns = [
  {
    title: '缴费日期',
    width: 160,
    align: 'center',
    dataIndex: 'tradeDate',
  },
  {
    title: '缴费类型',
    width: 110,
    align: 'center',
    dataIndex: 'type',
    customRender: (text, record) => {
      return text === 'A' ? '全款' : 'B' ? '定金' : 'C' ? '补缴' : ''
    }
  },
  {
    title: '支付方式',
    width: 100,
    align: 'center',
    dataIndex: 'dictValue',
  },
  {
    title: '到账银行',
    width: 120,
    align: 'center',
    dataIndex: 'bankNo',
  },
  {
    title: '收款分馆',
    width: 110,
    align: 'center',
    dataIndex: 'deptName',
  },
  {
    title: '缴费金额',
    width: 110,
    align: 'center',
    dataIndex: 'price',
  },
  {
    title: '申请开票金额',
    width: 110,
    align: 'center',
    dataIndex: 'infoPrice',
  },
  {
    title: '往期已开票金额',
    width: 110,
    align: 'center',
    dataIndex: 'actualPrice',
  },
  {
    title: '本次开票金额',
    align: 'center',
    scopedSlots: { customRender: 'nowPrice' }
  },
]

export default {
  name: 'uploadInvoices',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      record: null,
      columns,
      tableList: [],
      selectedRowKeys: [],
      selectedRows: [],
      finInvoice: null,

      // 上传发票部分
      uploadVisible: false,
      uploadColumns,
      uploadList: [],
      companyOptions: [], // 开票公司下拉列表
      form: {
        companyId: null,
        attachment: null,
      },
      infoPriceTotal: 0, // 申请开票总金额
      currentInvoiceTotal: 0, // 本次实际开票金额合计
    }
  },
  computed: {

  },
  methods: {
    reset() {
      this.finInvoice = null
      this.form = {
        companyId: null,
        attachment: null,
      }
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    open(record) {
      this.record = record
      this.visible = true
      this.reset()
      this.queryInfo()
    },
    close() {
      this.visible = false
    },
    onSelectionChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 获取回显信息
    queryInfo() {
      const params = { finInvoiceId: this.record.finInvoiceId }
      uploadGetInvoiceInfo(params).then(res => {
        const { finInvoice, finMapList, deptName, stuName, stuPhone } = res.data
        this.finInvoice = { ...finInvoice, deptName, stuName, stuPhone }
        this.tableList = finMapList
      })
    },

    // 上传发票
    handleUpload() {
      if (!(this.selectedRowKeys.length > 0)) {
        return this.$message.warn('请选勾选')
      }
      this.uploadVisible = true
      this.uploadList = [...this.selectedRows]
      this.calInvoiceData()
      this.queryCompanyOptions()
    },
    queryCompanyOptions() {
      getCompanyList({ page: 0, limit: 0 }).then(res => {
        this.companyOptions = res.data || []
      })
    },
    // 计算当前开票金额总计
    calInvoiceData() {
      let infoPriceTotal = Decimal(0)
      let currentInvoiceTotal = Decimal(0)
      for (const item of this.uploadList) {
        const { infoPrice, nowPrice = 0 } = item
        infoPriceTotal = infoPriceTotal.add(Decimal(infoPrice))
        currentInvoiceTotal = currentInvoiceTotal.add(Decimal(nowPrice || 0))
      }
      this.infoPriceTotal = infoPriceTotal.toNumber()
      this.currentInvoiceTotal = currentInvoiceTotal.toNumber()
    },
    // 计算本次开票金额最大值
    calMaxNowPrice(record) {
      const { price, actualPrice } = record
      // 缴费金额-往期开票金额
      let max = Decimal(price).sub(Decimal(actualPrice))
      return max.toNumber()
    },
    onFilesRemove() {
      this.form.attachment = null
    },
    // 上传发票信息
    async customRequest(e) {
      const { file, onProgress, onSuccess, onError } = e
      autoUploadErp(file, 'e-invoice').then(res => {
        this.form.attachment = res
        this.$message.success('发票PDF上传完成')
        onSuccess()
      }).catch(error => {
        this.$message.error('发票上传失败，请重新上传')
        onError(error)
        console.error('发票上传失败 ', error, file.name)
      })

    },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    },
    // 最终上传
    handleOk() {
      if (!this.form.companyId) {
        return this.$message.warn('请选择开票公司')
      }
      if (!this.form.attachment) {
        return this.$message.warn('请等待文件上传完成，再提交')
      }

      if (!this.currentInvoiceTotal) {
        return this.$message.warn('本次实际开票金额必须大于0')
      }
      this.confirmLoading = true
      let invoiceInfoList = []
      let unselectIds = []
      for (let index = 0; index < this.tableList.length; index++) {
        let item = this.tableList[index]
        if (this.selectedRowKeys.includes(index)) {
          if (!item.nowPrice) {
            this.$message.warn('本次开票金额需要大于0')
            break
          }
          let uploadItem = {
            actualPrice: item.nowPrice,
            invoiceInfoId: item.invoiceInfoId
          }
          invoiceInfoList.push(uploadItem)
        } else {
          unselectIds.push(item.finInvoiceId)
        }
      }
      const params = {
        attachment: this.form.attachment,
        companyId: this.form.companyId,
        finInvoiceId: this.record.finInvoiceId,
        invoiceInfoList,
        unselectIds,
      }
      uploadOneInvoice(params).then(res => {
        this.$notification.success({
          message: '系统通知',
          description: res.msg
        })
        this.$emit('ok')
        this.uploadVisible = false
        this.visible = false
      }).finally(() => {
        this.confirmLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped></style>