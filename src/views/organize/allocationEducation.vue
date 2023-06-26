<template>
  <div class="stu-leave-wrapper">
    <perm-box perm="organize:allocation:education:view">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
      <a-card :bordered="false">
        <div class="btn-wrapper">
          <perm-box perm="organize:allocation:education:save">
            <a-button icon="plus-circle" type="primary" @click="add()">新增</a-button>
          </perm-box>
        </div>
        <s-table ref="table" size="default" :columns="allocationColunm" :data="loadData" rowKey="id">
          <span slot="action" slot-scope="text, record">
            <perm-box perm="organize:allocation:education:save">
              <a href="#" @click="edit(record)">修改</a>
            </perm-box>
            <perm-box perm="organize:allocation:education:del">
              <a href="#" @click="remove(record)">删除</a>
            </perm-box>
          </span>
        </s-table>
      </a-card>
    </perm-box>
    <AllocationAddEdit ref="allocationAddEdit" @refresh="_refreshTable" :title="title"></AllocationAddEdit>
  </div>
</template>
<script>
import { pageEduUserAllocation, removeEduUserAllocationById } from '@/api/organize'
import { listArea, listEduDance } from '@/api/common'
import { allocationColunm } from './organizeConst'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import AllocationAddEdit from './modules/EduAllocationAddEdit'
export default {
  components: {
    AllocationAddEdit,
    SearchComPro,
    STable,
    PermBox
  },

  data() {
    return {
      searchParams: [
        {
          type: 'chooseModal',
          key: 'educator',
          label: '选择负责人',
          placeholder: '请选择负责人'
        },
        {
          type: 'select',
          key: 'orgDeptId',
          label: '选择地区',
          placeholder: '请选择地区',
          apiOption: {
            api: listArea,
            string: 'deptName',
            value: 'id'
          }
        },
        {
          type: 'select',
          key: 'eduDanceId',
          label: '选择查看数据舞种',
          placeholder: '请选择查看数据舞种',
          mode: 'default',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        }
      ],
      allocationColunm,
      queryParam: {},
      loadData: parameter => {
        return pageEduUserAllocation(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      title: ''
    }
  },

  methods: {
    add() {
      this.title = '新增'
      this.$refs.allocationAddEdit.open()
    },
    edit(record) {
      this.title = '编辑'
      this.$refs.allocationAddEdit.open()
      this.$nextTick(() => {
        this.$refs.allocationAddEdit.backindData(record)
      })
    },
    remove(record) {
      let params = record.id
      this.$confirm({
        title: '系统提示',
        content: '确认要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeEduUserAllocationById(params).then(() => {
            this.$notification['success']({
              message: '系统通知',
              description: '删除成功'
            })
            this._refreshTable()
          })
        }
      })
    },
    searchSubmit(data) {
      this.queryParam = data
      this._refreshTable()
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.stu-leave-wrapper {
  .btn-wrapper {
    margin-bottom: 20px;
  }
}
</style>
