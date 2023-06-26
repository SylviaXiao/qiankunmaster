<template>
  <div class="dictPay-wrapper">
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 15px;">
        <perm-box perm="system:dict:save">
          <a-button icon="plus-circle" type="primary" @click="openModal()">新增</a-button>
        </perm-box>
      </div>
      <a-table :columns="columns" :dataSource="stusourceList" :pagination="false" :loading="tableLoading" rowKey="id">
        <span slot="action" slot-scope="text, record">
          <perm-box perm="system:dict:save">
            <a href="javascript:;" @click="openModal(record)">编辑</a>
          </perm-box>
          <perm-box perm="system:dict:del">
            <a href="javascript:;" @click="remove(record)">删除</a>
          </perm-box>
          <!-- <perm-box perm="system:dict:del"> -->
          <a href="javascript:;" @click="showStuCardModifyRecord(record)">变更记录</a>
          <!-- </perm-box> -->
        </span>
      </a-table>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="modalTitle" v-model="stusourceModal" @ok="sendForm()" okText="提交">
      <a-form :form="dictpayForm">
        <a-form-item label="名称" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }">
          <a-input placeholder="请输入支付类型名称" v-decorator="['dictValue', { rules: [{ required: true, message: '请输入支付类型名称' }] }]" />
        </a-form-item>
        <a-form-item label="手续费" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }">
          <a-input addonAfter="%" placeholder="请输入手续费" v-decorator="['extendValue', { rules: [{ validator: this.$verify.isNum }] }]" />
        </a-form-item>
        <a-form-item label="最大手续费" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }">
          <a-input addonAfter="元" placeholder="请输入最大手续费" v-decorator="['maxValue', { rules: [{ validator: this.$verify.isNum }] }]" />
        </a-form-item>
        <a-form-item label="生效日期" placeholder="请选择生效日期" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }">
          <a-date-picker
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
            v-decorator="['effectiveDate', { rules: [{ required: true, message: '请选择生效日期' }] }]"
          />
        </a-form-item>

        <a-form-item label="状态" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }">
          <a-radio-group :options="deptStatusOptions" v-decorator="['status', { rules: [{ required: true, message: '请选择状态' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :destroyOnClose="true" :width="800" title="变更记录" :footer="null" v-model="stuCardModifyRecordVisual">
      <div>
        <table>
          <tr>
            <td>变更人</td>
            <td>手续费</td>
            <td>手续费上限</td>
            <td>变更时间</td>
            <td>生效时间</td>
          </tr>
          <template v-if="stuCardModifyRecord.length">
            <tr v-for="(item, index) in stuCardModifyRecord" :key="index">
              <td>{{ item.userName }}</td>
              <td>{{ item.beforeExtendValue }}</td>
              <td>{{ item.beforeMaxValue }}</td>
              <td>
                {{ item.createDate || '' }}
              </td>
              <td>
                {{ item.beforeEffectiveDate }}
              </td>
            </tr>
          </template>
        </table>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getAllSysDictList, removeSysDict, saveSysDict, queryChangeLog } from '@/api/system'
import PermBox from '@/components/PermBox'

const deptStatusOptions = [{ label: '启用', value: 'Y' }, { label: '禁用', value: 'N' }]
const columns = [
  {
    title: '名称',
    dataIndex: 'dictValue'
  },
  {
    title: '手续费',
    dataIndex: 'extendValue',
    customRender: (text, record) => {
      return `${text}%`
    }
  },
  {
    title: '最大手续费',
    dataIndex: 'maxValue',
    customRender: (text, record) => {
      return `${text}元`
    }
  },
  {
    title: '生效日期',
    dataIndex: 'effectiveDate',
    customRender: (text, record) => {
      return text.slice(0, 10)
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: (text, record) => {
      return text == 'Y' ? '启用 ' : text == 'N' ? '禁用' : ''
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
  name: 'dictPay',
  components: {
    PermBox
  },
  data() {
    return {
      //变更记录
      stuCardModifyRecordVisual: false,
      stuCardModifyRecord: [],
      deptStatusOptions,
      columns,
      stusourceList: [],
      tableLoading: false,
      formValues: {},
      stusourceModal: false,
      modalTitle: '保存支付类型'
    }
  },
  beforeCreate() {
    this.dictpayForm = this.$form.createForm(this)
  },
  created() {
    this.tableLoad()
  },
  methods: {
    async showStuCardModifyRecord(record) {
      let res = await queryChangeLog(record.id)
      if (Array.isArray(res.data) && res.data.length > 0) {
        this.stuCardModifyRecord = res.data
      } else {
        this.stuCardModifyRecord = []
      }
      this.stuCardModifyRecordVisual = true
    },
    tableLoad() {
      this.tableLoading = true
      getAllSysDictList()
        .then(res => (this.stusourceList = res.data))
        .finally(() => (this.tableLoading = false))
    },
    initForm() {
      const {
        dictpayForm: { resetFields }
      } = this
      return new Promise(resolve => {
        resetFields()
        this.formValues = {}
        resolve()
      })
    },
    openModal(record) {
      const { initForm, databack } = this
      initForm().then(() => {
        this.stusourceModal = true
        databack(record)
      })

      //  .finally(() => (this.stusourceModal = true))
    },
    databack(record) {
      const {
        dictpayForm: { setFieldsValue }
      } = this
      if (record) {
        this.formValues.id = record.id
        this.$nextTick(() => {
          setFieldsValue({ dictValue: record.dictValue })
          setFieldsValue({ extendValue: record.extendValue })
          setFieldsValue({ maxValue: record.maxValue })
          setFieldsValue({ effectiveDate: record.effectiveDate })
          setFieldsValue({ status: record.status })
          this.$forceUpdate()
        })
      } else {
        this.$nextTick(() => {
          setFieldsValue({ status: 'Y' })
          this.$forceUpdate()
        })
      }
    },
    remove(record) {
      const { $confirm, $notification, tableLoad } = this
      $confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeSysDict(record.id)
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
        dictpayForm: { validateFields },
        formValues,
        tableLoad
      } = this
      validateFields((err, values) => {
        if (!err) {
          const data = Object.assign(formValues, values)
          saveSysDict(data)
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

<style scoped>
td {
  border: 1px solid #ddd;
  line-height: 30px;
  width: 300px;
  text-align: center;
}
</style>
