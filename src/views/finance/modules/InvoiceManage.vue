<template>
  <div>
    <a-modal title="开票管理" :maskClosable="$store.state.modalMaskClickEnable" :destroyOnClose="true" :visible="visible"
      :width="1200" @cancel="close">
      <div style="margin-top: -16px">
        <a-divider orientation="left">开票管理</a-divider>
        <div style="text-align:right; margin: 10px 0;">
          <a-radio-group @change="initInvoiceList" :default-value="invoiceStatus" button-style="solid"
            v-model="invoiceStatus">
            <a-radio-button value="A">
              待开票
            </a-radio-button>
            <a-radio-button value="B">
              已开票
            </a-radio-button>
          </a-radio-group>
        </div>
        <a-table ref="table" :columns="invoiceColumns" :dataSource="invoiceList" :rowKey="record => record.id"
          :pagination="false"></a-table>
        <a-divider orientation="left">发票作废管理</a-divider>
        <a-table ref="table" :columns="invoiceColumns" :dataSource="invoiceCancelList"
          :rowKey="record => record.id" :pagination="false"></a-table>
      </div>
      <template slot="footer">
        <template>
          <a-button @click="close">关闭</a-button>
        </template>
      </template>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { getInvoiceList, pageInvoiceCancel } from '@/api/invoice/invoice'

const dateRender = (text, record) => {
  return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
}
const invoiceColumns = [
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
    title: '实际开票金额',
    align: 'center',
    dataIndex: 'actualToatlPrice',
    customRender: (val, record) => {
      return val || '/'
    }
  },

  {
    title: '包含班型',
    align: 'center',
    dataIndex: 'eduTypeName'
  },
  {
    title: '税号或身份证号',
    align: 'center',
    dataIndex: 'ideNumber'
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
]
const invalidInvoiceColumns = [
  {
    title: '申请分馆',
    dataIndex: 'deptName'
  },
  {
    title: '学员姓名',
    dataIndex: 'stuName'
  },
  {
    title: '提交申请日期',
    dataIndex: 'createDate',
    customRender: dateRender
  },
  {
    title: '作废日期',
    dataIndex: 'cancelDate',
    customRender: dateRender
  },
  {
    title: '作废金额',
    dataIndex: 'price'
  },
  {
    title: '作废状态',
    dataIndex: 'status',
    customRender: (text, record) => {
      return text === true ? '已确认' : text === false ? '未确认' : ''
    }
  }
]

export default {
  components: {
  },
  data() {
    return {
      visible: false,
      phone: '',
      invoiceStatus: 'A',
      invoiceColumns,
      invoiceList: [],
      invalidInvoiceColumns,
      invoiceCancelList: []
    }
  },
  created() {
  },
  methods: {
    open(phone) {
      this.visible = true
      this.phone = phone
      this.invoiceStatus = 'A'
      this.initInvoiceList()
      this.initInvoiceCancelList()
    },
    close() {
      this.visible = false
      this.phone = ''
      this.invoiceList = []
      this.invoiceCancelList = []
    },
    initInvoiceList() {
      getInvoiceList({ page: 0, limit: 0, status: this.invoiceStatus, studentInfo: this.phone })
        .then(res => {
          this.invoiceList = res.data || []
        })
    },
    initInvoiceCancelList() {
      getInvoiceList({ page: 0, limit: 0, status: 'E', studentInfo: this.phone })
        .then(res => {
          this.invoiceCancelList = res.data || []
        })
    }
  }
}
</script>

<style scoped lang="less" type="text/less"></style>
