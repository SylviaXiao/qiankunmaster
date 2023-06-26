<template>
  <a-modal
    title="选择卡种"
    :maskClosable="$store.state.modalMaskClickEnable"
    :width="1000"
    v-model="cardVisible"
    @ok="handleOk"
    @cancel="close"
  >
    <s-table
      ref="table"
      :columns="columns"
      :data="cardData"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: multiple ? 'checkbox' : 'radio' }"
      rowKey="id"
    >
      <span slot="totalPrice" slot-scope="text, record">
        {{ record.paidPrice | fixTofloat }}/{{ record.totalPrice | fixTofloat }}/{{ record.originalPrice | fixTofloat }}
      </span>
      <span slot="payoff" slot-scope="text, record">
        <template v-if="text">结清</template>
        <template v-else-if="record.status === 'D' || record.status === 'E' || record.status === 'F'"></template>
        <template v-else>
          <span style="color:red">{{ (record.paidPrice - record.totalPrice) | fixTofloat }}</span>
        </template>
      </span>
    </s-table>
  </a-modal>
</template>

<script>
import { pageStudentCard } from '@/api/recep'
import STable from '@/components/Table'

const columns = [
  {
    title: '学员姓名',
    dataIndex: 'stuName'
  },
  {
    title: '上课分馆',
    dataIndex: 'deptName'
  },
  {
    title: '办卡分馆',
    dataIndex: 'createDeptName'
  },
  {
    title: '卡号',
    dataIndex: 'stuCardNo'
  },
  {
    title: '卡种名称',
    dataIndex: 'cardName'
  },
  {
    title: '类型',
    dataIndex: 'typeName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '班级',
    dataIndex: 'className'
  },
  {
    title: '实收/应收/原价',
    dataIndex: 'totalPrice',
    scopedSlots: { customRender: 'totalPrice' }
  },
  {
    title: '是否缴清',
    dataIndex: 'payoff',
    scopedSlots: { customRender: 'payoff' }
  },
  {
    title: '卡状态',
    dataIndex: 'status',
    customRender: (text, record) => {
      return text === 'A'
        ? '未使用'
        : text === 'B'
          ? '使用中'
          : text === 'C'
            ? '停课'
            : text === 'D'
              ? '退卡'
              : text === 'E'
                ? '结业'
                : text === 'F'
                  ? '撤销'
                  : text === 'G'
                    ? '结转'
                  : ''
    }
  },
]
export default {
  name: 'GetCard',
  props: {
    multiple: {//多选，默认关闭
      type: Boolean,
      default: false
    }
  },
  components: {
    STable
  },
  data() {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      columns,
      cardVisible: false,
      queryParam: {},
      cardData: parameter => {
        return pageStudentCard(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
    }
  },
  methods: {
    open(params) {
      this.queryParam = params
      this.$refs.table && this.$refs.table.refresh()
      this.cardVisible = true
    },
    close() {
      this.resetAll()
      this.cardVisible = false
    },
    resetAll() {
      this.queryParam = {}
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleOk() {
      const length = this.selectedRows.length
      if (length == 0) {
        return this.$notification['error']({
          message: '系统通知',
          description: '请选择一条信息'
        })
      }

      const backData = this.multiple ? this.selectedRows : this.selectedRows[0]
      this.$emit('getBackData', backData)
      this.close()
    },
  }
}
</script>

<style scoped>
.searchGroup {
  outline: none;
}
</style>
