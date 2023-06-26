<template>
  <div class="master-class">
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"> </search-com-pro>
    </a-card>
    <a-card :bordered="false">
      <div class="table-wrapper">
        <div class="btn-group">
          <perm-box perm="education:masterclass:save">
            <a-button icon="plus-circle" type="primary" @click="addEditMasterClass('add')">新增</a-button>
          </perm-box>
        </div>
        <perm-box perm="education:masterclass:view">
          <s-table ref="table" :columns="columns" :data="loadData" rowKey="masterClassId">
            <span slot="className" slot-scope="text, record">
              <router-link :to="{ path: `/reception/masterClassList/classInfo/${record.masterClassId}` }">{{ text }}</router-link>
            </span>
            <span slot="startDate" slot-scope="text, record">
              <span>{{ record.startDate | filterDate }}</span>
              <span v-if="record.startDate"> 至 </span>
              <span>{{ record.endDate | filterDate }}</span>
            </span>
            <span slot="action" slot-scope="text, record">
              <template>
                <perm-box perm="education:masterclass:save">
                  <a href="javascript:;" @click="addEditMasterClass('edit', record)">编辑</a>
                </perm-box>
              </template>
              <template>
                <perm-box perm="education:masterclass:save">
                  <a href="javascript:;" @click="removeMasterClass(record)">删除</a>
                </perm-box>
              </template>
            </span>
          </s-table>
        </perm-box>
      </div>
    </a-card>
    <MasterClassAddEdit @refresh="_refreshTable" :title="addEditTitle" ref="masterClassAddEdit"></MasterClassAddEdit>
  </div>
</template>

<script>
const columns = [
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className',
    scopedSlots: { customRender: 'className' }
  },
  {
    title: '导师姓名',
    dataIndex: 'bigMasterName',
    key: 'bigMasterName'
  },
  {
    title: '舞种',
    dataIndex: 'danceName',
    key: 'danceName'
  },
  {
    title: '上课时间',
    dataIndex: 'startDate',
    key: 'startDate',
    scopedSlots: { customRender: 'startDate' }
  },
  {
    title: '上课地点',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '联系人',
    dataIndex: 'contact',
    key: 'contact'
  },
  {
    title: '联系电话',
    dataIndex: 'contactPhone',
    key: 'contactPhone'
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
import { STable, SearchComPro } from '@/components'
import PermBox from '@/components/PermBox'
import MasterClassAddEdit from './modules/MasterClassAddEdit'
import { listEduDance } from '@/api/common'
import { pageMasterClass, removeMasterClass } from '@/api/recep'
export default {
  components: {
    MasterClassAddEdit,
    PermBox,
    STable,
    SearchComPro
  },
  data() {
    return {
      columns,
      loadData: parameter => {
        return pageMasterClass(Object.assign(parameter, this.queryParam)).then(res => {
          return res
        })
      },
      addEditTitle: '大师课',
      //搜索
      searchParams: [
        {
          type: 'text',
          key: 'name',
          label: '班级名称',
          placeholder: '请输入班级名称'
        },
        {
          type: 'select',
          key: 'danceId',
          label: '舞种',
          placeholder: '请选择舞种',
          apiOption: {
            api: listEduDance,
            string: 'name',
            value: 'id'
          }
        }
      ]
    }
  },
  methods: {
    searchSubmit(data) {
      this.queryParam = data
      if (this.queryParam.name) this.queryParam.name = encodeURI(this.queryParam.name.replace(' ',''))
      this._refreshTable()
    },
    addEditMasterClass(type, record) {
      if (type === 'add') {
        this.addEditTitle = '新增大师课'
        this.$refs.masterClassAddEdit.open()
      }
      if (type === 'edit') {
        this.addEditTitle = '大师课编辑'
        this.$refs.masterClassAddEdit.open()
        this.$nextTick(() => {
          this.$refs.masterClassAddEdit.backindData(record)
        })
      }
    },
    removeMasterClass(record) {
      const _this = this
      const params = record.masterClassId
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          removeMasterClass(params).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this._refreshTable()
          })
        }
      })
    },
    _refreshTable() {
      this.$refs.table.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
.master-class {
  .search-card {
    margin: 20px 0;

    .search-group {
    }
  }

  .table-wrapper {
    .btn-group {
      margin-bottom: 20px;
    }
  }
}
</style>
