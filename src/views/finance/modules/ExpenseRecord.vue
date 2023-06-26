<template>
  <div>
    <a-modal
      :title="type === 1 ? '缴费记录' : '退费记录'"
      :maskClosable="$store.state.modalMaskClickEnable"
      :destroyOnClose="true"
      :visible="visible"
      :width="800"
      @cancel="close"
    >
      <div style="margin-top: -16px">
        <a-table
          ref="table"
          :columns="type === 1 ? paymentColumns : refundColumns"
          :dataSource="dataList"
          :rowKey="record => record.id"
          :pagination="false"
        ></a-table>
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
  import { getStudentCardFin } from '@/api/reception/student'

  const dateRender = (text, record) => {
    return text ? moment(text).format('YYYY-MM-DD') : ''
  }
  const paymentColumns = [
    {
      title: '缴费时间',
      dataIndex: 'tradeDate',
      customRender: dateRender
    },
    {
      title: '缴费金额',
      dataIndex: 'price'
    },
    {
      title: '应收金额',
      dataIndex: 'totalPrice'
    },
    {
      title: '缴费分馆',
      dataIndex: 'deptName'
    },
    {
      title: '支付方式',
      dataIndex: 'dictValue'
    },
    {
      title: '缴费类型',
      dataIndex: 'type',
      customRender: text => {
        return text === 'A' ? '全款' : text === 'B' ? '定金' : text === 'C' ? '补缴' : text === 'D' ? '退款' : ''
      }
    },
    {
      title: '缴费卡号',
      dataIndex: 'stuCardNo'
    }
  ]
  const refundColumns = [
    {
      title: '退费时间',
      dataIndex: 'tradeDate',
      customRender: dateRender
    },
    {
      title: '卡金额',
      dataIndex: 'cardValue'
    },
    {
      title: '退费金额',
      dataIndex: 'price'
    },
    {
      title: '上课分馆',
      dataIndex: 'deptName'
    },
    {
      title: '提交分馆',
      dataIndex: 'subDeptName'
    },
    {
      title: '退费卡号',
      dataIndex: 'stuCardNo'
    },
    {
      title: '退费卡种',
      dataIndex: 'stuCardName'
    },
    {
      title: '状态',
      dataIndex: 'approveStatus',
      customRender: text => {
        return text === 'A' ? '待审核' : text === 'B' ? '审批中' : text === 'C' ? '通过' : text === 'D' ? '驳回' : text === 'E' ? '待上传附件' : ''
      }
    }
  ]

  export default {
    data() {
      return {
        visible: false,
        type: 1, //1.缴费记录 2.退费记录
        paymentColumns,
        refundColumns,
        dataList: []
      }
    },
    created() {
    },
    methods: {
      open(id) {
        this.visible = true
        this.initList(id)
      },
      close() {
        this.visible = false
        this.dataList = []
      },
      // 缴费/退费记录
      initList({ studentCardId, type }) {
        this.type = type
        getStudentCardFin({ stuCardId: studentCardId })
          .then(res => {
            this.dataList = type === 1 ? res?.data?.finList : res?.data?.refund
          })
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
</style>
