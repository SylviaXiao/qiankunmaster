<template>
  <div class="channel-wrapper">
    <a-card :bordered="false" class="noPadding">
      <perm-box perm="system:channel:view">
        <perm-box perm='system:channel:save' >
          <a-button icon='plus-circle' type="primary" @click="editChannel('', '一级渠道','add',)" style="margin-bottom:10px;">新增渠道</a-button>
        </perm-box>
        <a-table :pagination="false" rowKey="id" :columns="columns" :data-source="tableData" bordered :loading="tableLoading" >
          <!-- childrenColumnName="xx" -->
          <span slot="action" slot-scope="text, record" style="overflow: hidden;">
            <!-- <template v-if="record.DEEP === 1"> -->
            <perm-box perm="system:channel:save">
              <a href="javascript:;" class="mr15" @click="editChannel(record, record.DEEP === 1?'二级渠道':'三级渠道','add')" v-if="record.DEEP !== 3" >{{record.DEEP === 1?'添加二级渠道':'添加三级渠道'}}</a>
              <a href="javascript:;" class="mr15" @click="editChannel(record, record.DEEP === 1?'一级渠道':record.DEEP === 2?'二级渠道':'三级渠道')">修改</a>
            </perm-box>
            <perm-box perm="system:channel:del">
              <a href="javascript:;" class="mr15" @click="removeChannel(record)" v-if="!record.children">删除</a>
            </perm-box>
            <!-- </template> -->
          <!-- </span> -->
          <!-- <a-table rowKey="id" slot="expandedRowRender" slot-scope="text" :columns="innerColumns" :data-source="text.children" :pagination="false" > -->
            <!-- <span slot="innerAction" slot-scope="textInner, record"> -->
              <!-- <template v-if="record.DEEP === 2">
              <perm-box perm="system:channel:save" >
                <a href="javascript:;" class="mr15" @click="editChannel(record,'三级渠道', 'add')">添加三级渠道</a>
              </perm-box>
              <perm-box perm="system:channel:save">
                <a href="javascript:;" class="mr15" @click="editChannel(record, record.DEEP === 2?'二级渠道':'三级渠道')">修改</a>
              </perm-box>
              <perm-box perm="system:channel:del">
                <a href="javascript:;" class="mr15" @click="removeChannel(record)" v-if="!record.children">删除</a>
              </perm-box>
              </template> -->
            </span>
          <!-- </a-table> -->
        </a-table>
      </perm-box>
    </a-card>
    <ChannelAddEdit :title="addEditTitle" :id="ChannelId" :handleType="handleType" :parentId="parentId" @refresh="refresh" ref="addEdit" ></ChannelAddEdit>
  </div>
</template>
<script>
import { listChannel, removeSysChannel, saveSysChannel } from '@/api/system'
import PermBox from '@/components/PermBox'
import ChannelAddEdit from './modules/ChannelAddEdit.vue'
const columns = [
  {
    title: '一级渠道名称',
    dataIndex: 'name'
  },
  {
    title: '关联客服',
    dataIndex: 'userList',
    ellipsis: true,
    customRender: (text, record) => {
      return text.map(item=>item.name).join(',')
    }
  },
  {
    title: '排序',
    dataIndex: 'order',
    width:100
  },
  {
    title: '描述',
    dataIndex: 'desc',
    width:200

  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
const innerColumns = [
  {
    title: '二级渠道名称',
    dataIndex: 'name'
  },
  {
    title: '关联客服',
    dataIndex: 'userList',
    ellipsis: true,
    customRender: (text, record) => {
      return text.map(item=>item.name).join(',')
    }
  },
  {
    title: '排序',
    dataIndex: 'order'
  },
  {
    title: '描述',
    dataIndex: 'desc'
  },
  {
    title: '操作',
    key: 'innerAction',
    scopedSlots: { customRender: 'innerAction' }
  }
]
export default {
  name: 'channel',
  data() {
    return {
      columns,
      innerColumns,
      addEditTitle: '',
      // 处理第几列的标记位
      handleType: '',
      firstChannel: [],
      secondChannel: [],
      thirdChannel: [],
      editId: '',
      ChannelId: '',

      //添加功能需要的secParentId
      secParentId: '',
      thiParentId: '',
      tableData: [],
      parentId: null,
      tableLoading: false,
    }
  },
  components: {
    PermBox,
    ChannelAddEdit
  },
  created() {
    //首先加载列表1
    this.loadChannelList()
  },
  methods: {
    //加载列表一
    loadChannelList() {
      this.tableLoading = true
      listChannel()
        .then(res => {
          if (res.code === 200 && res.data) {
            this.tableData = res.data
            this.tableLoading = false

            // console.log(res.data)
            // this.firstChannel = res.data
          }
        })
        .catch(err => {})
    },

    editChannel(record,text, type) {
        this.parentId = null
        this.ChannelId = null
        this.addEditTitle = `${type==='add'?'添加':'修改'}${text}`
      if(record) {
        this.parentId = type =='add'?record.id:record.parentId
        if(type !=='add') {
          this.$nextTick(() => {
            if(!text.includes('添加一级')) {
              this.ChannelId = record.id
            }
            this.$refs.addEdit.backingData(record)
          })
        }
      }
      this.$refs.addEdit.openModal()
    },
    removeChannel(record, type) {
      let _this = this
      this.handleType = type
      if (record.id) {
        let params = record.id
        this.$confirm({
          title: '系统提示',
          content: '确定删除该数据吗',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            _this.removeChannelApi(params)
          },
          onCancel() {}
        })
      }
    },
    removeChannelApi(params) {
      removeSysChannel(params)
        .then(res => {
          if (res.code === 200) {
            this.$notification['success']({
              message: '系统通知',
              description: '已删除该数据'
            })
            // this.clearOthers(params)
            this.refresh()
          }
        })
        .catch(err => {})
    },
    refresh() {
        this.loadChannelList()

    },
    _popoverEmpty() {
      //啥也不干
    }
  }
}
</script>

<style scoped lang="less">
.channel-wrapper {
  min-width: 800px;
  .btnGroup {
    margin: 10px 0;
  }
  .first-wrapper {
    height: 500px;
  }
  tr.ant-table-expanded-row td > .ant-table-wrapper {
    margin: -13px -5px -13px;
  }
}
</style>
