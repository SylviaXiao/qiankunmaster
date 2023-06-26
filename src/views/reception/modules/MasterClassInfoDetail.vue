<template>
  <div v-if="masterClassId" class="master-class-info-stu">
    <div class="btn-group">
      <perm-box perm="education:masterclassspending:save">
        <a-button icon="plus-circle" type="primary" @click="addEditMasterClassDetail('add')">新增</a-button>
      </perm-box>
    </div>
    <div class="table-wrapper">
      <a-table ref="table" :columns="columns" :dataSource="loadData" rowKey="id">
        <span slot="action" slot-scope="text, record">
          <template>
            <perm-box perm="education:masterclassspending:save">
              <a href="javascript:;" @click="addEditMasterClassDetail('edit', record)">编辑</a>
            </perm-box>
          </template>
          <template>
            <perm-box perm="education:masterclassspending:del">
              <a href="javascript:;" @click="removeStuMasterClass(record)">删除</a>
            </perm-box>
          </template>
        </span>
      </a-table>
    </div>
    <MasterClassInfoDetailAddEdit
      :masterClassId="masterClassId"
      :title="addEditTitle"
      ref="masterClassInfoDetailAddEdit"
      @refresh="refresh"
    ></MasterClassInfoDetailAddEdit>
  </div>
</template>

<script>
const columns = [
  {
    title: '项目名称',
    dataIndex: 'item',
    key: 'item',
    scopedSlots: { customRender: 'item' }
  },
  {
    title: '支出时间',
    dataIndex: 'spendingDate',
    key: 'spendingDate',
    scopedSlots: { customRender: 'spendingDate' }
  },
  {
    title: '支出金额',
    dataIndex: 'spendingPrice',
    key: 'spendingPrice',
    scopedSlots: { customRender: 'spendingPrice' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
import { STable } from '@/components'
import { saveClassSpending, removeMasterClassSpending, listClassSpending } from '@/api/recep'
import MasterClassInfoDetailAddEdit from './MasterClassInfoDetailAddEdit'
import PermBox from '@/components/PermBox'
export default {
  components: {
    MasterClassInfoDetailAddEdit,
    STable,
    PermBox
  },
  props: {
    masterClassId: String
  },
  data() {
    return {
      addEditTitle: '',
      columns,
      loadData: []
    }
  },
  methods: {
    addEditMasterClassDetail(type, record) {
      if (type === 'add') {
        this.addEditTitle = '添加新的支出项目'
        this.$refs.masterClassInfoDetailAddEdit.open()
      }
      if (type === 'edit') {
        this.addEditTitle = '编辑'
        this.$refs.masterClassInfoDetailAddEdit.open()
        this.$nextTick(() => {
          this.$refs.masterClassInfoDetailAddEdit.backindData(record)
        })
      }
    },
    removeStuMasterClass(record) {
      const _this = this
      const params = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeMasterClassSpending(params).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.refresh()
          })
        }
      })
    },
    loadDataFn() {
      listClassSpending({ masterClassId: this.masterClassId }).then(res => {
        this.loadData = res.data
      })
    },
    refresh() {
      this.loadDataFn()
    }
  }
}
</script>

<style lang="less" scoped>
.master-class-info-stu {
  .table-wrapper {
    margin-top: 10px;
  }
}
</style>
