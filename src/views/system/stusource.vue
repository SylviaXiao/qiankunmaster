<template>
  <div class="stusource-wrapper">
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 15px;">
        <perm-box perm='system:dict:save'>
          <a-button icon='plus-circle' type="primary" @click="openModal">新增</a-button>
        </perm-box>
      </div>
      <a-table :columns="columns"
               :dataSource='stusourceList'
               :pagination='false'
               :loading='tableLoading'
               rowKey='id'>
      <span slot='action' slot-scope="text, record">
            <perm-box perm='system:dict:save'>
              <a href="javascript:;" @click="openModal(record)">编辑</a>
            </perm-box>
            <perm-box perm='system:dict:del'>
              <a href="javascript:;" @click="remove(record)">删除</a>
            </perm-box>
          </span>
      </a-table>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
             :title="modalTitle"
             v-model="stusourceModal"
             @ok="sendForm()"
             okText='提交'>
      <a-form :form='stusourceForm'>
        <a-form-item
          label="名称" :labelCol="{span:4}" :wrapperCol="{span:18}">
          <a-input
            placeholder='请输入招生来源名称'
            v-decorator="['sourceName', {rules: [{ required: true, message: '请输入招生来源名称' }]}]"
          />
        </a-form-item>
      </a-form>


    </a-modal>
  </div>
</template>

<script>
  import { getSysStuSourceList, removeSysStuSource, saveSysStuSource } from '@/api/system'
  import PermBox from '@/components/PermBox'

  const columns = [
    {
      title: '名称',
      dataIndex: 'sourceName'
    },
    {
      title: '操作',
      key: 'action',
      width: '150px',
      scopedSlots: { customRender: 'action' }
    }
  ]
  export default {
    name: 'stusource',
    components: {
      PermBox
    },
    data() {
      return {
        columns,
        stusourceList: [],
        tableLoading: false,
        formValues: {},
        stusourceModal: false,
        modalTitle: '保存招生来源'
      }
    },
    beforeCreate() {
      this.stusourceForm = this.$form.createForm(this)
    },
    created() {
      this.tableLoad()
    },
    methods: {
      tableLoad() {
        this.tableLoading = true
        getSysStuSourceList().then(res => this.stusourceList = res.data).finally(() => this.tableLoading = false)
      },
      initForm() {
        const { stusourceForm: { resetFields } } = this
        return new Promise(resolve => {
          resetFields()
          this.formValues = {}
          resolve()
        })
      },
      openModal(record) {
        const { initForm, databack } = this
        initForm().then(() => {
          console.log(this.modalTitle)
          record ? databack(record) : ''
        }).finally(() => this.stusourceModal = true)
      },
      databack(record) {
        const { $nextTick, stusourceForm: { setFieldsValue } } = this
        this.formValues.id = record.id
        this.$nextTick(() => {
          setFieldsValue({ sourceName: record.sourceName })
        })
      },
      remove(record) {
        const { $confirm, $notification, tableLoad } = this
        $confirm({
          title: '系统提示',
          content: '确认删除该条数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            removeSysStuSource(record.id).then(res => {
              $notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            }).finally(() => tableLoad())
          }
        })
      },
      sendForm() {
        const { stusourceForm: { validateFields }, formValues, tableLoad } = this
        validateFields((err, values) => {
          if (!err) {
            const data = Object.assign(formValues, values)
            saveSysStuSource(data).then(res => {
              this.stusourceModal = false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            }).finally(() => tableLoad())
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
