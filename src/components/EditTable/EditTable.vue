<template>
  <div class="edit-table-wrapper">
    <div class="table-content">
      <div class="add-btn">
        <a-button type="primary" icon="plus-circle" @click="plusTableArr" :disabled="eidtTable">新增</a-button>
      </div>
      <div class="table-item">
        <a-table
          :pagination="false"
          :columns="tableColumns"
          :dataSource="tableArr"
          :loading="tableLoading"
          bordered
          :rowKey="rowKey => rowKey[tableRowKey] || rowKey.key"
        >
          <template v-for="(columnsItem, idx) in tableColumns" :slot="columnsItem.dataIndex" slot-scope="text, record">
            <span :key="idx">
              <span class="isEditing" v-if="columnsItem.input && record.isEditing">
                <template v-if="columnsItem.input === 'input'">
                  <a-input v-model="params[columnsItem.dataIndex]" />
                </template>
                <template v-if="columnsItem.input === 'custom'">
                  <slot :name="`${columnsItem.dataIndex}-custom`" :data="text"></slot>
                </template>
                <template v-if="columnsItem.input == 'adviser'">
                  <a-input v-model="params[columnsItem.dataIndex]" :read-only="true" @click="selectUser(columnsItem.dataIndex)" />
                </template>
                <template v-if="columnsItem.input == 'time'">
                  <a-date-picker v-model="params[columnsItem.dataIndex]" show-time type="date" placeholder="请选择时间" />
                </template>
              </span>
              <span class="notEditing" v-else>{{ text }}</span>
            </span>
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="isEditing" v-if="record.isEditing">
              <a href="javascript:;" @click="saveTableItem(record)">确定</a>
              <a href="javascript:;" @click="cancelTableItem(record)">取消</a>
            </div>
            <div class="notEditing" v-else>
              <a href="javascript:;" @click="editTableItem(record)" v-if="hasEditAction && !eidtTable">编辑</a>
              <a href="javascript:;" @click="deleteTableItem(record)">删除</a>
              <slot name="customActive" :record="record"></slot>
            </div>
          </template>
          <slot name="custom"></slot>
        </a-table>
      </div>
    </div>
    <i-modal ref="imodal" :userType="usertype" @getBackData="getUser"></i-modal>
  </div>
</template>

<script>
const defaultActionItem = {
  title: '操作',
  dataIndex: 'action',
  scopedSlots: { customRender: 'action' }
}
import IModal from '@/components/InnerModal'
export default {
  name: 'EditTable',
  props: {
    columnsOptions: {
      type: Array,
      default: () => []
    },
    tableArr: {
      type: Array,
      default: () => []
    },
    eidtParams: {
      type: Object,
      default: () => {}
    },
    tableRowKey: {
      type: String,
      default: 'id'
    },
    hasEditAction: {
      type: Boolean,
      default: true
    },
    eduTypeId: {
      type: String,
      default: ''
    },
    // 兼容选择导师的接口 
    usertype: {
      type: String,
      default: 'master,curator,desk-admin,desk-reception'
    },
  },
  components: {
    IModal
  },
  data() {
    return {
      defaultItem: {},
      tableColumns: [],
      tableLoading: false,
      eidtTable: false,
      params: {},
      // usertype: 'master,curator,desk-admin,desk-reception',
      selectPramas: ''
    }
  },
  mounted() {},
  created() {
    this.setOptionsByColumns()
  },
  methods: {
    getUser(data) {
      this.params[this.selectPramas] = data.name
      this.params[this.selectPramas + 'Id'] = data.id
      this.$forceUpdate()
    },
    selectUser(key) {
      this.selectPramas = key
      this.$refs.imodal.open()
    },
    //通过col-options生成数据
    setOptionsByColumns() {
      const {
        columnsOptions,
        columnsOptions: { length }
      } = this
      if (length == 0) return
      columnsOptions.map(item => {
        this.defaultItem[item.dataIndex] = ''
        item['scopedSlots'] = { customRender: item.dataIndex }
      })
      this.defaultItem['key'] = 'not'
      this.defaultItem['isEditing'] = true
      this.cancelTableItem()
      this.tableColumns = [...columnsOptions, defaultActionItem]
    },
    //点击添加按钮添加表格数据
    plusTableArr() {
      const { tableArr, defaultItem, setOptionsByColumns } = this
      this.setOptionsByColumns()
      this.eidtTable = true
      this.params = {}
      console.log(777, this.params, defaultItem)
      this.tableArr.unshift(JSON.parse(JSON.stringify(defaultItem)))
    },
    //确定 => 保存
    saveTableItem(record) {
      this.$emit('saved', Object.assign(record, this.params))
    },
    //取消
    cancelTableItem() {
      this.clearInput()
      this.params = {}
      this.eidtTable = false
      this.$emit('cancel')
    },
    //编辑 => 打开编辑框
    editTableItem(record, idx) {
      // const { id } = record
      const { tableRowKey } = this
      const id = record[tableRowKey]

      this.tableArr.map(item => {
        if (item[tableRowKey] === id) {
          item.isEditing = true
          this.params = item
        }
      })
      this.eidtTable = true
    },
    //删除
    deleteTableItem(record) {
      this.$emit('delete', record)
    },
    //清除input
    clearInput() {
      const { tableRowKey } = this
      this.tableArr.map((item, idx) => {
        !item[tableRowKey] ? this.tableArr.splice(idx, 1) : item.isEditing ? (item.isEditing = false) : ''
      })
      this.params = this.eidtParams
    },
    //重置defaultItem
    initDefaultItem() {
      const { defaultItem } = this
      for (let k in defaultItem) {
      }
    },
    //重置按钮eidtTable
    initAddBtn() {
      this.eidtTable = false
    }
  }
}
</script>

<style scoped lang="less">
.edit-table-wrapper {
  .table-content {
    .add-btn {
      margin-bottom: 15px;
    }

    .table-item {
      max-height: 500px;
      overflow: auto;
    }

    .isEditing,
    .notEditing {
      a {
        margin-right: 15px;
      }
    }
  }
}
</style>
