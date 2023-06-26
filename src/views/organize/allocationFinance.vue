<template>
  <div class="stu-leave-wrapper">
    <perm-box perm="organize:allocation:finance:view">
      <a-card :bordered="false" :style="{ margin: '20px 0' }">
        <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
      </a-card>
      <a-card :bordered="false">
        <div class="btn-wrapper">
          <perm-box perm="organize:allocation:finance:save">
            <a-button icon="plus-circle" type="primary" @click="add()">新增</a-button>
          </perm-box>
        </div>
        <s-table ref="table" size="default" :columns="allocationFinColunm" :data="loadData" rowKey="id">
          <span slot="action" slot-scope="text, record">
            <perm-box perm="organize:allocation:finance:save">
              <a href="#" @click="edit(record)">修改</a>
            </perm-box>
            <perm-box perm="organize:allocation:finance:del">
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
import { pageFinUserAllocation, removeFinUserAllocation } from '@/api/organize'
import { getSchoolList } from '@/api/education/card'
import { allocationFinColunm } from './organizeConst'
import PermBox from '@/components/PermBox'
import STable from '@/components/Table'
import SearchComPro from '@/components/SearchComPro'
import AllocationAddEdit from './modules/FinAllocationAddEdit'
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
          type: 'treeSelect',
          isShow: !!!this.$store.getters.school_id,
          key: 'orgDeptId',
          label: '选择分馆',
          placeholder: '请选择分馆',
          expandAll: true,
          selectFather: false,
          treeOps: {
            api: getSchoolList,
            label: 'deptName',
            value: 'id',
            children: 'children'
          }
        },
        {
          type: 'chooseModal',
          key: 'finance',
          label: '选择负责人',
          placeholder: '请选择负责人'
        }
      ],
      allocationFinColunm,
      queryParam: {},
      loadData: parameter => {
        return pageFinUserAllocation(Object.assign(parameter, this.queryParam)).then(res => {
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
      this.$refs.allocationAddEdit.openSelect()
    },
    edit(record) {
      this.title = '编辑'
      this.$refs.allocationAddEdit.open()
      this.$nextTick(() => {
        this.$refs.allocationAddEdit.backindData(record)
      })
    },
    remove(record) {
      let _this = this
      let params = record.orgUserId
      this.$confirm({
        title: '系统提示',
        content: '确认要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeFinUserAllocation(params).then(() => {
            _this._refreshTable()
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
