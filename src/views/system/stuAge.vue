<template>
  <div class="stusource-wrapper">
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 15px;">
        <perm-box perm="system:age-bracket:save">
          <a-button icon="plus-circle" type="primary" @click="openModal">新增</a-button>
        </perm-box>
      </div>
      <a-table :columns="columns" :dataSource="stusourceList" :pagination="false" :loading="tableLoading" rowKey="id">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="system:age-bracket:save">
            <a href="javascript:;" @click="openModal(record)">编辑</a>
          </perm-box>
          <perm-box perm="system:age-bracket:del">
            <a href="javascript:;" @click="remove(record)">删除</a>
          </perm-box>
        </span>
      </a-table>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="modalTitle" v-model="stusourceModal" @ok="sendForm()" okText="提交">
      <a-form :form="stusourceForm">
        <a-form-item label="开始年龄" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }">
          <a-input-number
            placeholder="请输入开始年龄"
            style="width:100%;"
            v-decorator="['ageStart', { rules: [{ required: true, message: '请输入开始年龄' }] }]"
          />
        </a-form-item>
        <a-form-item label="结束年龄" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }">
          <a-input-number
            placeholder="请输入结束年龄"
            style="width:100%;"
            v-decorator="['ageEnd', { rules: [{ required: true, message: '请输入结束年龄' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { ageBracketList, ageBracketRemove, ageBracketSave } from '@/api/system'
import PermBox from '@/components/PermBox'

const columns = [
  {
    title: '客户年龄段',
    dataIndex: 'ageStart',
    customRender: (text, record) => {
      let { ageStart, ageEnd } = record
      return ageStart + '-' + ageEnd
    }
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
      modalTitle: '新增客户年龄段'
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
      ageBracketList()
        .then(res => (this.stusourceList = res.data))
        .finally(() => (this.tableLoading = false))
    },
    initForm() {
      const {
        stusourceForm: { resetFields }
      } = this
      return new Promise(resolve => {
        resetFields()
        this.formValues = {}
        resolve()
      })
    },
    openModal(record) {
      const { initForm, databack } = this
      initForm()
        .then(() => {
          console.log(this.modalTitle)
          if (record) {
            this.modalTitle = '新增客户年龄段'
          } else {
            this.modalTitle = '修改客户年龄段'
          }
          record ? databack(record) : ''
        })
        .finally(() => (this.stusourceModal = true))
    },
    databack(record) {
      const {
        $nextTick,
        stusourceForm: { setFieldsValue }
      } = this
      this.formValues.id = record.id
      this.$nextTick(() => {
        setFieldsValue({ ageStart: record.ageStart, ageEnd: record.ageEnd })
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
          ageBracketRemove(record.id)
            .then(res => {
              $notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            })
            .finally(() => tableLoad())
        }
      })
    },
    sendForm() {
      const {
        stusourceForm: { validateFields },
        formValues,
        tableLoad
      } = this
      validateFields((err, values) => {
        if (!err) {
          console.log(values)
          let { ageStart, ageEnd } = values
          if (ageEnd <= ageStart) {
            this.$notification['error']({
              message: '系统通知',
              description: '结束时间必须大于开始时间'
            })
            return
          }
          const data = Object.assign(formValues, values)
          ageBracketSave(data)
            .then(res => {
              this.stusourceModal = false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
            })
            .finally(() => tableLoad())
        }
      })
    }
  }
}
</script>

<style scoped></style>
