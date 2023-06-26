<template>
  <div class="testAddress-wrapper">
    <a-card :bordered="false">
      <div class="btn-wrapper">
        <perm-box perm="cer:organizer:save">
          <a-button type="primary" icon="plus-circle" @click.native="handleAddStu">新增</a-button>
        </perm-box>
      </div>
      <div class="table-wrapper">
        <perm-box perm="cer:organizer:view">
          <a-table ref="table" :pagination="false" :columns="addressColumns" :rowKey="record => record.id" :dataSource="dataSource" :loading="loading">
            <span slot="action" slot-scope="text, record">
              <perm-box perm="cer:organizer:save">
                <a href="#" @click="handleEdit(record)">修改</a>
              </perm-box>
              <perm-box perm="cer:organizer:del">
                <a href="#" @click="handleRemove(record)">删除</a>
              </perm-box>
            </span>
          </a-table>
        </perm-box>
      </div>
    </a-card>
    <AddressEditAdd :title="addEditTitle" :record="recordStu" ref="AddressEditAdd" @refresh="_refreshTable"></AddressEditAdd>
  </div>
</template>
<script>
import { STable, SearchCom } from '@/components'
import PermBox from '@/components/PermBox'
import AddressEditAdd from './modules/AddressEditAdd'
import { addressColumns } from './certificate.js'
import { listSiteById, removeSiteById } from '@/api/certificate/certificate'
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
    AddressEditAdd
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
      this.addEditTitle = '添加考点'
      this.recordStu = {}
      this.$refs.AddressEditAdd.openModal()
    },
    handleEdit(record) {
      this.addEditTitle = '修改考点'
      this.recordStu = record
      this.$refs.AddressEditAdd.openModal()
      this.$refs.AddressEditAdd.backindData(record)
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
      listSiteById(this.classId)
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
      removeSiteById(params)
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
