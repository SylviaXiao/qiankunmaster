<template>
  <div v-if="masterClassId" class="master-class-info-stu">
    <div class="btn-group">
      <perm-box perm="student:masterclass:save">
        <a-button icon="plus-circle" type="primary" @click="addEditMasterClassStu('add')">新增</a-button>
      </perm-box>
    </div>
    <div class="table-wrapper">
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="stuMasterClassId">
        <span slot="name" slot-scope="text, record">
          <span>{{ text }}</span>
          <span style="margin-left:5px;">
            <a-tag v-if="record.teacherId">导师</a-tag>
            <a-tag v-if="record.stuId">学员</a-tag>
          </span>
        </span>
        <span slot="phone" slot-scope="text, record">
          {{ text }}
        </span>
        <span slot="date" slot-scope="text, record">
          {{ text | filterDate }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <perm-box perm="student:masterclass:save">
              <a href="javascript:;" @click="addEditMasterClassStu('edit', record)">编辑</a>
            </perm-box>
          </template>
          <template>
            <perm-box perm="student:masterclass:del">
              <a href="javascript:;" @click="removeStuMasterClass(record)">删除</a>
            </perm-box>
          </template>
        </span>
      </s-table>
    </div>
    <MasterClassInfoStuAddEdit
      :masterClassId="masterClassId"
      :title="addEditTitle"
      ref="masterClassInfoStuAddEdit"
      @refresh="refresh"
    ></MasterClassInfoStuAddEdit>
  </div>
</template>

<script>
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    scopedSlots: { customRender: 'phone' }
  },
  {
    title: '缴费金额',
    dataIndex: 'price',
    key: 'price'
  },
  {
    title: '报名时间',
    dataIndex: 'date',
    key: 'date',
    scopedSlots: { customRender: 'date' }
  },
  {
    title: '经办人',
    dataIndex: 'userName',
    key: 'userName'
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
import { pageStuMasterClass, removeStuMasterClass, saveStuMasterClass } from '@/api/recep'
import MasterClassInfoStuAddEdit from './MasterClassInfoStuAddEdit'
import PermBox from '@/components/PermBox'
export default {
  components: {
    MasterClassInfoStuAddEdit,
    STable,
    PermBox
  },
  props: {
    masterClassId: String
  },
  watch: {
    masterClassId(nv) {
      if (nv) {
        this.$nextTick(() => {
          this.refresh()
        })
      }
    }
  },
  data() {
    return {
      addEditTitle: '',
      columns,
      loadData: parameter => {
        return pageStuMasterClass(Object.assign(parameter, { masterClassId: this.masterClassId })).then(res => {
          return res
        })
      }
    }
  },
  methods: {
    addEditMasterClassStu(type, record) {
      if (type === 'add') {
        this.addEditTitle = '添加新学生'
        this.$refs.masterClassInfoStuAddEdit.open()
      }
      if (type === 'edit') {
        this.addEditTitle = '学员编辑'
        this.$refs.masterClassInfoStuAddEdit.open()
        this.$nextTick(() => {
          this.$refs.masterClassInfoStuAddEdit.backindData(record)
        })
      }
    },
    removeStuMasterClass(record) {
      const _this = this
      const params = record.stuMasterClassId
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeStuMasterClass(params).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.refresh()
          })
        }
      })
    },
    refresh() {
      this.$refs.table.refresh()
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
