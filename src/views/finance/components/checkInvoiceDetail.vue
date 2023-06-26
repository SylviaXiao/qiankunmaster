<template>
  <a-modal :width="1100" title="查看详情" :visible="visible" @ok="visible = false" @cancel="visible = false">
    <a-table :columns="columns" :dataSource="tableList" :rowKey="(record, index) => index" :pagination="false" bordered>
      <span slot="nowPrice" slot-scope="text, record, index">
        <!-- 本次开票价小于等于缴费金额-往期开票金额 -->
        <a-input-number v-model="record.nowPrice" style="width:100%" :precision="2" :min="0" :max="calMaxNowPrice(record)"
          @blur="calInvoiceData" />
      </span>
      <!-- <span slot="surplus" slot-scope="text, record">
          {{ calSurplus(record) }}
        </span> -->
    </a-table>
    <div class="flex space-between mt-10">
      <div>申请开票金额合计：{{ priceTotal }}</div>
      <div>本次实际开票金额： <span style="color:red;font-size: 18px;">{{ currentInvoiceTotal }}</span></div>
    </div>
    <a-divider></a-divider>
    <div class="mt-20">
      <a-form-model :model="form" :labelCol="{ span: 4 }" :wrapperCol="{ span: 16 }">
        <a-row v-for="(item, index) in attachmentList" :key="index">
          <a-col :span="12">
            <a-form-model-item :label="`上传附件${index + 1}`">
              <a-space>
                <span>{{ item.fileName }}</span>
                <a @click="handlePreview(item)">预览</a>
                <a @click="handleDownload(item)">下载</a>
              </a-space>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

  </a-modal>
</template>

<script>
import { uploadGetInvoiceInfo, getInvoiceAttachment } from '@/api/invoice/invoice'
import { downloadFiles, previewFile } from '@/api/file'
import Decimal from "decimal.js"
const columns = [
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
    title: '申请开票金额',
    width: 110,
    align: 'center',
    dataIndex: 'infoPrice',
  },
  {
    title: '本次实际开票金额',
    width: 110,
    align: 'center',
    dataIndex: 'actualPrice',
  },
]
export default {
  name: 'checkInvoiceDetail',
  components: {

  },
  data() {
    return {
      visible: false,
      columns,
      tableList: [],
      record: null,
      form: {},
      attachmentList: [],
      priceTotal: 0, // 申请开票总金额
      currentInvoiceTotal: 0, // 本次实际开票金额合计
    }
  },
  computed: {
  },
  methods: {
    reset() {
      this.tableList = []
      this.attachmentList = []
    },
    open(record) {
      this.record = record
      this.visible = true
      this.reset()
      this.queryInfo()
    },
    // 获取回显信息
    queryInfo() {
      const params = { finInvoiceId: this.record.finInvoiceId }
      uploadGetInvoiceInfo(params).then(res => {
        const { finInvoice, finMapList } = res.data
        this.tableList = finMapList
        this.calInvoiceData()
      })
      this.queryAttachment()
    },
    // 获取发票信息
    queryAttachment() {
      const params = { finInvoiceId: this.record.finInvoiceId }
      getInvoiceAttachment(params).then(res => {
        this.attachmentList = res.data
      })
    },
    // 计算当前开票金额总计
    calInvoiceData() {
      let priceTotal = Decimal(0)
      let currentInvoiceTotal = Decimal(0)
      for (const item of this.tableList) {
        const { price, actualPrice = 0 } = item
        priceTotal = priceTotal.add(Decimal(price))
        currentInvoiceTotal = currentInvoiceTotal.add(Decimal(actualPrice))
      }
      this.priceTotal = priceTotal.toNumber()
      this.currentInvoiceTotal = currentInvoiceTotal.toNumber()
    },
    handlePreview(item) {
      previewFile({ fileId: item.id }).then(res => {
        window.open(res.data)
      })
    },
    handleDownload(item) {
      const { id, fileName } = item
      downloadFiles({ fileId: id }).then(res => {
        const a = document.createElement('a')
        a.download = fileName
        a.href = res.data
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(a.href)
      })
    }
  }
}
</script>

<style lang="less" scoped></style>