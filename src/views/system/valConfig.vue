<template>
  <div>
    <a-card :bordered="false" :style="{ margin: '20px 0' }">
      <search-com-pro :style="{ padding: '10px 0' }" @searchSubmit="searchSubmit" :searchParams="searchParams"></search-com-pro>
    </a-card>
    <a-card :border="false">
      <div class="btnGroup mb20">
        <perm-box perm="sys:valconf:save">
          <a-button icon="plus-circle" type="primary" @click="openSave()">新增</a-button>
        </perm-box>
      </div>
      <s-table ref="table" :columns="columns" :data="loadData" rowKey="id">
      <span slot="action" slot-scope="text, record">
        <perm-box perm="sys:valconf:save">
          <a href="javascript:;" @click="openSave(record)">编辑</a>
        </perm-box>
        <perm-box perm="sys:valconf:del">
          <a href="javascript:;" @click="remove(record)">删除</a>
        </perm-box>
      </span>
      </s-table>

      <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="saveTitle" v-model="saveModal" okText="保存" cancelText="取消" @ok="handleOk" @cancel="handleCancel">
        <a-form :form="form">
          <!-- key -->
          <a-form-item label="key" v-bind="formItemLayout">
            <a-input placeholder="请输入key" v-decorator="['key', { rules: [{ required: true, message: '请输入key' }] }]" />
          </a-form-item>
          <!-- 名称 -->
          <a-form-item label="名称" v-bind="formItemLayout">
            <a-input placeholder="请输入名称" v-decorator="['name', { rules: [{ required: true, message: '请输入名称' }] }]" />
          </a-form-item>
          <!-- 名称 -->
          <a-form-item label="描述" v-bind="formItemLayout">
            <a-input placeholder="请输入描述" v-decorator="['text']" />
          </a-form-item>
          <!-- 排序 -->
          <a-form-item label="排序" v-bind="formItemLayout">
            <a-input-number placeholder="请输入排序" v-decorator="['order', { rules: [{ required: true, message: '请输入排序' }] }]" style="width: 100%" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
  import { pageSysValConf, saveSysValConf, delSysValConf } from '@/api/common'
  import { PermBox, STable, SearchComPro } from '@/components'

  const columns = [
    {
      title: 'key',
      dataIndex: 'key'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '描述',
      dataIndex: 'text'
    },
    {
      title: '排序',
      dataIndex: 'order'
    },
    {
      title: '操作',
      key: 'action',
      width: '250px',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const formItemLayout = {
    labelCol: {
      xs: { span: 4 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 18 },
      sm: { span: 18 }
    }
  }

  export default {
    components: {
      PermBox,
      STable,
      SearchComPro
    },
    data() {
      return {
        columns,
        formItemLayout,
        searchParams: [
          {
            type: 'text',
            key: 'key',
            label: 'key',
            placeholder: '请输入key'
          },
        ],
        queryParam: {},
        loadData: parameter => {
          return pageSysValConf(Object.assign(parameter, this.queryParam)).then(res => {
            return res
          })
        },
        saveTitle: '',
        saveModal: false,
        recordId: null
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    created() {
    },
    methods: {
      //搜索功能
      searchSubmit(data) {
        this.queryParam = data
        this._refreshTable()
      },
      openSave(record) {
        if (record) {
          this.saveTitle = '修改续卡分类'
          this.$nextTick(() => {
            this.recordId = record.id
            this.form.setFieldsValue(record)
          })
        } else {
          this.saveTitle = '新增续卡分类'
          this.$nextTick(() => {
            this.recordId = null
            this.form.setFieldsValue({ order: 0 })
          })
        }
        this.saveModal = true
      },
      handleOk() {
        const {
          form: { validateFields },
          $notification,
          _refreshTable,
          handleCancel
        } = this
        validateFields()
          .then(value => {
            return Object.assign(value, { id: this.recordId })
          })
          .then(saveSysValConf)
          .then(res => {
            if (res.code == 200) {
              $notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              handleCancel()
              _refreshTable()
            }
          })
      },
      handleCancel() {
        this.form.resetFields()
        this.saveModal = false
      },
      remove(record) {
        this.$confirm({
          title: '系统提示',
          content: '确认删除该条数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            delSysValConf(record.id).then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this._refreshTable()
            })
          }
        })
      },
      _refreshTable() {
        this.$refs.table.refresh()
      },
    }
  }
</script>

<style scoped lang="less">
</style>
