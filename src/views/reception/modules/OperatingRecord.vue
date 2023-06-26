<template>
  <div>
    <div class="top-wrap">
      <h3>学员卡信息</h3>
      <a-table
        ref="table"
        :columns="col1"
        :dataSource="cardList"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'checkbox' }"
        rowKey="cardId"
        :pagination="false"
      >
      </a-table>
    </div>
    <div class="mt-20 pb-40">
      <div class="flex flex-between">
        <h3>学员卡操作明细记录</h3>
        <a-button type="primary" @click="handleReset">重置</a-button>
      </div>
      <div class="my-10">
        <span class="card-text" v-if="selectedAllCards">全部</span>
        <template v-else>
          <span class="card-text ml-8" v-for="(item, index) in this.selectedRows" :key="index">{{ item.cardNo }}</span>
        </template>
      </div>
      <a-table
        ref="logTable"
        :loading="logLoading"
        :columns="col2"
        :dataSource="logList"
        :rowKey="(record, index) => index"
        expandRowByClick
        :expandedRowKeys="expandedRowKeys"
        @expandedRowsChange="handleExpandedRowsChange"
      >
        <span slot="beforeChangeTitle" style="cursor: pointer;" @click="expandAllRowKeys">
          <a-icon type="plus-square" class="expand-text" /><span class="ml-4">变更前</span>
        </span>
        <span slot="afterChangeTitle" style="cursor: pointer;" @click="expandAllRowKeys">
          <a-icon type="plus-square" class="expand-text" /><span class="ml-4">变更后</span>
        </span>

        <span slot="intro" slot-scope="text, record" class="flex flex-between">
          <div v-if="record.oldCardNo && record.oldCardNo.length > 0" class="flex-col">
            <div v-for="(card, index) in record.oldCardNo" :key="index">[{{ card }}]</div>
          </div>
          <div class="mx-10 text-weight-b flex-1">{{ getCardBizType(record.explainType) }}</div>
          <div v-if="record.newCardNo && record.newCardNo.length > 0" class="flex-col">
            <div v-for="(card, index) in record.newCardNo" :key="index">[{{ card }}]</div>
          </div>
        </span>

        <span slot="beforeChange" slot-scope="text, record">
          <div v-if="text && text.length > 0">
            <!-- <a-icon type="plus-square" class="expand-text" /> -->
            <div style="line-height:24px;" v-for="(card, index) in text" :key="index">{{ card }}</div>
          </div>
        </span>

        <span slot="afterChange" slot-scope="text, record">
          <div v-if="text && text.length > 0">
            <!-- <a-icon type="plus-square" class="expand-text" /> -->
            <div style="line-height:24px;" v-for="(card, index) in text" :key="index">{{ card }}</div>
          </div>
        </span>

        <div v-if="getInnerData(record) && getInnerData(record).length > 0" slot="expandedRowRender" slot-scope="record, index" style="margin: 0">
          <a-table :columns="innerCol" :dataSource="getInnerData(record)" :rowKey="(record, index) => index" :pagination="false"></a-table>
          {{ record.description }}
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import { PermBox, STable } from '@/components'
import { getCardByStuId, getCardLogByCardId } from '@/api/recep'
import { getCardBizType } from '@/dictionary/reception'

const col1 = [
  {
    title: '卡号',
    dataIndex: 'cardNo'
  },
  {
    title: '卡种',
    dataIndex: 'cardTypeName'
  },
  {
    title: '卡价值',
    dataIndex: 'cardPrice'
  },
  {
    title: '消耗',
    dataIndex: 'usedCount',
    customRender: (val, record) => {
      const { usedCount, totalCount } = record
      return `${usedCount}/${totalCount}`
    }
  },
  {
    title: '余额',
    dataIndex: 'balance'
  }
]

const col2 = [
  {
    title: '操作日期',
    align: 'center',
    dataIndex: 'createDate',
    scopedSlots: { title: 'createDate' }
  },
  {
    title: '业务类型',
    align: 'center',
    dataIndex: 'explainType',
    customRender: val => {
      return getCardBizType(val)
    }
  },
  {
    title: '业务类型说明',
    align: 'center',
    dataIndex: 'intro',
    scopedSlots: { customRender: 'intro' }
  },
  {
    width: 120,
    title: '交易金额',
    align: 'center',
    dataIndex: 'changePrice'
  },
  {
    // title: '变更前',
    align: 'center',
    dataIndex: 'beforeChange',
    scopedSlots: { title: 'beforeChangeTitle', customRender: 'beforeChange' }
  },
  {
    // title: '变更后',
    align: 'center',
    dataIndex: 'afterChange',
    scopedSlots: { title: 'afterChangeTitle', customRender: 'afterChange' }
  },
  {
    title: '操作分馆',
    align: 'center',
    dataIndex: 'deptName'
  },
  {
    title: '操作人',
    align: 'center',
    dataIndex: 'userName'
  }
]

const innerCol = [
  {
    title: ' ',
    align: 'center',
    dataIndex: 'changeType',
    customRender: val => {
      let content = '·'
      if (val === 'A') {
        content += '变更前'
      } else if (val === 'B') {
        content += '变更后'
      }
      return content
    }
  },
  {
    title: '学员姓名',
    align: 'center',
    dataIndex: 'stuName'
  },
  {
    title: '人群',
    align: 'center',
    dataIndex: 'stuType'
  },
  {
    title: '上课分馆',
    align: 'center',
    dataIndex: 'schoolDept'
  },
  {
    title: '大班型',
    align: 'center',
    dataIndex: 'typeName'
  },
  {
    title: '小班型',
    align: 'center',
    dataIndex: 'classType'
  },
  {
    title: '舞种',
    align: 'center',
    dataIndex: 'danceName'
  },
  {
    title: '卡价值',
    align: 'center',
    dataIndex: 'cardPrice',
    customRender: val => {
      return isFinite(val) ? val : '/'
    }
  },
  {
    title: '扣除课耗',
    align: 'center',
    dataIndex: 'courseConsume',
    customRender: val => {
      return isFinite(val) ? val : '/'
    }
  },
  {
    title: '剩余金额',
    align: 'center',
    dataIndex: 'balance',
    customRender: val => {
      return isFinite(val) ? val : '/'
    }
  },
  {
    title: '抵扣金额',
    align: 'center',
    dataIndex: 'carryOverPrice',
    customRender: val => {
      return isFinite(val) ? val : '/'
    }
  },
  {
    title: '补缴金额',
    align: 'center',
    dataIndex: 'paymentPrice',
    customRender: val => {
      return isFinite(val) ? val : '/'
    }
  }
]
export default {
  name: 'OperatingRecord',
  props: {
    stuId: {
      type: String,
      default: ''
    }
  },
  components: {
    PermBox,
    STable
  },
  data() {
    return {
      selectedRowKeys: [],
      selectedRows: [],
      col1,
      // TODO: STable的:showPagination="false"会报错
      cardList: [],
      col2,
      logList: [],
      cardIds: null,
      logLoading: false,
      defaultExpandAllRows: true,
      expandedRowKeys: [],
      innerCol
    }
  },
  computed: {
    selectedAllCards() {
      return this.selectedRows?.length > 0 && this.selectedRows.length == this.cardList?.length
    }
  },
  created() {
    this.queryCardList()
  },
  methods: {
    handleReset() {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.logList = []
    },
    getCardBizType(val) {
      return getCardBizType(val)
    },
    // 学员卡信息
    queryCardList() {
      getCardByStuId({ studentId: this.stuId }).then(res => {
        this.cardList = res.data
      })
    },
    // 学员卡操作明细记录
    queryLogList() {
      if (!(this.selectedRows?.length > 0)) return
      let cardIds = []
      this.selectedRows.forEach(record => {
        cardIds.push(record.cardId)
      })
      cardIds = cardIds.join(',')
      this.logLoading = true
      getCardLogByCardId({ cardIds })
        .then(res => {
          this.logList = res.data
        })
        .finally(() => {
          this.logLoading = false
        })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.queryLogList()
    },
    // 学员卡操作明细记录展开内容
    getInnerData(record) {
      const { detail } = record
      return detail
    },

    handleExpandedRowsChange(expandedRowKeys) {
      this.expandedRowKeys = expandedRowKeys
    },
    expandAllRowKeys() {
      if (this.expandedRowKeys.length < this.logList.length) {
        let rowKeys = []
        for (let i = 0; i < this.logList.length; i++) {
          rowKeys.push(i)
        }
        this.expandedRowKeys = rowKeys
      } else {
        this.expandedRowKeys = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.card-text {
  color: HotPink;
}
.expand-text {
  color: blue;
  // cursor: pointer;
}
</style>
