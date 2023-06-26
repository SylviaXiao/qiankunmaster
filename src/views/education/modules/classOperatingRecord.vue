<template>
  <div class="operating-record-wrapper">
    <a-table :columns="columns" :dataSource="classRecod" :pagination="false" rowKey="logId">
      <span slot="stuName" slot-scope="text, record">
        {{ record.type == 'B' ? record.targetStuName : record.stuName }}
      </span>
      <div slot="usedCount" slot-scope="text, record">
        <span>{{ record.usedCount }}/{{ record.totalCount === 0 ? '不限' : record.totalCount }}</span>
      </div>
      <span slot="parseDate" slot-scope="text">
        <span>{{ $tools.tailor.getDate(text) }}</span>
      </span>
      <span slot="endDate" slot-scope="text">
        <span>{{ handleEndDate(text) }}</span>
      </span>
      <span slot="attachment" slot-scope="text, record">
        <a href="javascript:;" @click="downloadAttach(record)">{{ '附件' }}</a>
      </span>
    </a-table>
    <download-list ref="download"></download-list>
  </div>
</template>

<script>
import moment from 'moment'
import PermBox from '@/components/PermBox'
import DownloadList from '@/components/DownloadList/DownloadList.vue'

const columns = [
  {
    title: '姓名',
    dataIndex: 'stuName'
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
    title: '使用/总次数',
    scopedSlots: { customRender: 'usedCount' }
  },
  {
    title: '激活时间',
    dataIndex: 'startDate',
    scopedSlots: { customRender: 'parseDate' }
  },
  {
    title: '有效期截止',
    dataIndex: 'endDate',
    scopedSlots: { customRender: 'endDate' }
  },
  {
    title: '入班时间',
    dataIndex: 'joinDate',
    scopedSlots: { customRender: 'parseDate' }
  },
  {
    title: '最后一次上课时间',
    dataIndex: 'dancePlanDate',
    scopedSlots: { customRender: 'parseDate' }
  },
  {
    title: '退班/结业时间',
    dataIndex: 'outDate',
    scopedSlots: { customRender: 'parseDate' }
  },
  {
    title: '类型',
    dataIndex: 'type',
    customRender: (text, record) => {
      //（A:结业,B:退班）
      switch (text) {
        case 'A':
          return '结业'
          break
        case 'B':
          return '退班'
          break
        default:
          '入班'
      }
    }
  },
  {
    title: '消耗金额',
    dataIndex: 'deductPrice',
    customRender: (text, record) => {
      return text > 0 || record.outDate ? text : ''
    }
  },
  {
    title: '备注',
    dataIndex: 'logRemark'
  }
]
export default {
  name: 'operatingRecord',
  props: {
    loadData: {
      type: Function
    }
  },
  components: {
    DownloadList,
    PermBox
  },
  data() {
    return {
      columns,
      classRecod: []
    }
  },
  created() {
    this.getTable()
  },
  methods: {
    handleEndDate(data) {
      return data
        ? moment(data)
            .subtract(1, 'seconds')
            .format('YYYY-MM-DD HH:mm')
        : ''
    },
    downloadAttach(data) {
      const { logId } = data
      this.$refs.download.open(logId)
    },
    getTable() {
      this.loadData().then(res => {
        this.classRecod = res.data
      })
    }
  }
}
</script>

<style scoped></style>
