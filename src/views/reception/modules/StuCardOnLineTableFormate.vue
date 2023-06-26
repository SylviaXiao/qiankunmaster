<template>
  <div>
    <s-table ref="table" :columns="sc_solumns" :data="sc_loadData" rowKey="id">
      <span slot="action" slot-scope="text, record">
        <a href="#" @click="copyClassUrlHandle(record)" v-if="record.status === 'B'">复制上课链接</a>
      </span>
    </s-table>
  </div>
</template>

<script>
import { PermBox, STable } from '@/components'
import { listStudentInfoEduClassUrl } from '@/api/recep'

const sc_solumns = [
  {
    title: '卡种名称',
    dataIndex: 'cardName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName'
  },
  {
    title: '卡种类型',
    dataIndex: 'eduTypeName'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: text => {
      return text === 'A' ? '未使用' : text === 'B' ? '已使用' : text === 'C' ? '已废弃' : text === 'D' ? '确认废弃' : ''
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]
export default {
  name: 'stuCards',
  components: {
    PermBox,
    STable
  },
  props: {
    queryParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      sc_solumns,
      sc_loadData: parameter => {
        let queryParams = JSON.parse(JSON.stringify(this.queryParams))
        return listStudentInfoEduClassUrl(Object.assign(parameter, queryParams)).then(res => {
          return res
        })
      }
    }
  },
  watch: {
    stuId(nv) {
      if (nv) {
        // 拿到studentId以后请求数据渲染列表
        this._refreshTable()
      }
    }
  },
  methods: {
    // 复制上课码
    copyClassUrlHandle(record) {
      this.$tools.handleCopy(record.url)
    },
    _refreshTable() {
      this.$refs.table.refresh()
      this.$emit('refreshTable', this.queryParams.invitationType)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  text-align: right;
  width: 100px;
}
</style>
