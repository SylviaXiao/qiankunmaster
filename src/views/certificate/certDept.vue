<template>
  <div class="testAddress-wrapper">
    <a-card :bordered="false">
      <div class="btn-wrapper">
        <perm-box perm="cer:area:save">
          <a-button type="primary" icon="plus-circle" @click.native="handleAddStu">新增</a-button>
        </perm-box>
      </div>
      <div class="table-wrapper">
        <perm-box perm="cer:area:view">
          <a-table ref="table" :pagination="false" :columns="addressColumns" :rowKey="record => record.id" :dataSource="dataSource" :loading="loading">
            <span slot="action" slot-scope="text, record">
              <perm-box perm="cer:area:save">
                <a href="#" @click="handleEdit(record)">修改</a>
              </perm-box>
              <perm-box perm="cer:area:del">
                <a href="#" @click="handleRemove(record)">删除</a>
              </perm-box>
            </span>
          </a-table>
        </perm-box>
      </div>
    </a-card>
    <certDeptAddEdit :title="addEditTitle" :record="recordStu" ref="certDeptAddEdit" @refresh="_refreshTable"></certDeptAddEdit>
  </div>
</template>
<script>
import { STable, SearchCom } from '@/components'
import PermBox from '@/components/PermBox'
import certDeptAddEdit from './modules/certDeptAddEdit'

import { listCerOrganizer, removeCerArea } from '@/api/certificate/certificate'
const addressColumns = [
  {
    title: '城市',
    dataIndex: 'areaName',
    key: 'areaName'
  },

  {
    title: '排序',
    dataIndex: 'areaOrder',
    key: 'areaOrder'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      //table相关
      addressColumns,
      dataSource: null,
      loading: false,
      // CertAddEdit参数
      addEditTitle: '',
      recordStu: null
    }
  },
  components: {
    SearchCom,
    PermBox,
    STable,
    certDeptAddEdit
  },
  mounted() {
    this.loadTable()
  },
  methods: {
    handleAddEditOk() {},
    handleAddEditCancel() {
      this.visibleAddEdit = false
    },
    handleAddStu() {
      this.addEditTitle = '新增'
      this.recordStu = {}
      this.$refs.certDeptAddEdit.openModal()
    },
    handleEdit(record) {
      this.addEditTitle = '修改'
      this.recordStu = record
      this.$refs.certDeptAddEdit.openModal()
      this.$refs.certDeptAddEdit.backindData(record)
    },
    handleRemove(record) {
      let _this = this
      let params = {
        cerOrganizerId: record.id
      }
      this.$confirm({
        title: '系统提示',
        content: '确认要删除吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this._removeSiteApi(params)
        }
      })
    },
    loadTable() {
      this.loading = true
      listCerOrganizer(this.classId)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.dataSource = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    _removeSiteApi(params) {
      removeCerArea(params)
        .then(res => {
          if (res.code === 200) {
            this._refreshTable()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    _refreshTable() {
      this.loadTable()
    }
  }
}
</script>

<style scoped lang="less">
.testAddress-wrapper {
  .btn-wrapper {
    margin: 20px 0;
  }
}
</style>
