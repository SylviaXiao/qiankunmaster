<template>
  <a-card :border="false">
    <div class="btnGroup">
      <perm-box perm="organize:position:save">
        <a-button icon="plus-circle" type="primary" @click="openModal()">新增</a-button>
      </perm-box>
    </div>
    <a-table :columns="columns" :dataSource="positionList" rowKey="id" :pagination="false" :loading="tableLoading">
      <span slot="status" slot-scope="text, record">
        <perm-box :text="record.positionStatus == 'Y' ? '启用' : '禁用'" perm="organize:position:status">
          <a-switch :checked="record.positionStatus === 'Y'" @change="changeStatus($event, record)">
            <a-icon type="check" slot="checkedChildren" />
            <a-icon type="close" slot="unCheckedChildren" />
          </a-switch>
        </perm-box>
      </span>
      <span slot="action" slot-scope="text, record">
        <perm-box perm="organize:position:save">
          <a href="javascript:;" @click="openModal(record)">编辑</a>
        </perm-box>
        <perm-box perm="organize:position:del">
          <a href="javascript:;" @click="remove(record)">删除</a>
        </perm-box>
      </span>
    </a-table>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable" :title="modalTitle" v-model="positionModal" okText="保存" cancelText="取消" @ok="saveOrgPos">
      <a-form :form="form">
        <!-- 职位名称 -->
        <a-form-item label="职位名称" v-bind="formItemLayout">
          <a-input placeholder="请输入职位名称" v-decorator="['positionName', { rules: [{ required: true, message: '请输入职位名称' }] }]" />
        </a-form-item>
        <!-- 数据范围-->
        <a-form-item label="数据范围" v-bind="formItemLayout">
          <a-select :allowClear="true" v-decorator="['positionScope', { rules: [{ required: true, message: '请选择数据范围' }] }]">
            <a-select-option :allowClear="true" value="A">所有</a-select-option>
            <a-select-option :allowClear="true" value="B">仅自己</a-select-option>
            <a-select-option :allowClear="true" value="C">当前部门</a-select-option>
            <a-select-option :allowClear="true" value="D">当前和子部门</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 角色-->
        <a-form-item label="默认角色" v-bind="formItemLayout">
          <a-select :allowClear="true" v-decorator="['roleId', { rules: [{ required: false, message: '请选择角色' }] }]">
            <a-select-option :value="role.id" v-for="(role, roleIdx) in roleList" :key="roleIdx">{{ role.roleName }} </a-select-option>
          </a-select>
        </a-form-item>
        <!-- 排序 -->
        <a-form-item label="排序" v-bind="formItemLayout">
          <a-input placeholder="请输入排序" v-decorator="['positionOrder', { rules: [{ required: true, message: '请输入排序' }] }]" />
        </a-form-item>
        <!-- 职位描述 -->
        <a-form-item label="职位描述" v-bind="formItemLayout">
          <a-textarea
            :autosize="{ minRows: 2, maxRows: 6 }"
            placeholder="请输入职位描述 (一百字以内)"
            v-decorator="['positionDesc', { rules: [{ validator: $verify.lenth }] }]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { listOrgPosition, saveOrgPosition, removeOrgPosition, changePosState, listOrgRoleNew } from '@/api/organize'
import PermBox from '@/components/PermBox'

const columns = [
  {
    title: '职位名称',
    dataIndex: 'positionName'
  },
  {
    title: '数据范围',
    dataIndex: 'positionScope',
    customRender: text => {
      let showText = ''
      switch (text) {
        case 'A':
          showText = '所有'
          break
        case 'B':
          showText = '仅自己'
          break
        case 'C':
          showText = '当前部门'
          break
        case 'D':
          showText = '当前和子部门'
          break
      }
      return showText
    }
  },
  {
    title: '职位描述',
    dataIndex: 'positionDesc'
  },
  {
    title: '默认角色',
    dataIndex: 'orgRole',
    customRender: text => {
      return text ? text.roleName : ''
    }
  },
  {
    title: '排序',
    dataIndex: 'positionOrder'
  },
  {
    title: '职位状态',
    dataIndex: 'positionStatus',
    key: 'status',
    scopedSlots: { customRender: 'status' }
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
const fieldNameList = ['positionName', 'positionOrder', 'positionDesc', 'positionScope']

export default {
  name: 'position',
  components: {
    PermBox
  },
  data() {
    return {
      columns,
      formItemLayout,
      fieldNameList,
      positionList: [],
      roleList: [],
      modalTitle: '',
      positionModal: false,
      tableLoading: false,
      formValues: {}
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  created() {
    this.getDataSource()
  },
  methods: {
    getDataSource() {
      this.tableLoading = true
      listOrgPosition().then(res => {
        this.positionList = res.data
        setTimeout((this.tableLoading = false), 400)
      })
    },
    getRoleList() {
      listOrgRoleNew().then(res => (this.roleList = res.data))
    },
    openModal(data) {
      this.getRoleList()
      if (data) {
        this.formValues.id = data.id
        this.modalTitle = '修改职位'
        this.$nextTick(() => {
          this.form.setFieldsValue({ ['roleId']: data.orgRoleId })
        })
        fieldNameList.forEach(item => {
          this.$nextTick(() => {
            this.form.setFieldsValue({ [item]: data[item] })
          })
        })
      } else {
        this.formValues = {}
        this.modalTitle = '添加职位'
        fieldNameList.forEach(item => {
          this.$nextTick(() => {
            this.form.setFieldsValue({ [item]: '' })
          })
        })
        this.$nextTick(() => {
          this.form.setFieldsValue({ ['positionScope']: 'B' })
        })
      }
      this.positionModal = true
    },
    saveOrgPos() {
      const {
        form: { validateFields },
        formValues,
        $notification,
        getDataSource
      } = this
      validateFields()
        .then(value => {
          return Object.assign(formValues, value)
        })
        .then(saveOrgPosition)
        .then(res => {
          $notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.positionModal = false
          getDataSource()
        })
    },
    remove(data) {
      const _this = this
      this.$confirm({
        title: '系统提示',
        content: '确认删除该条数据吗?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          removeOrgPosition(data.id).then(res => {
            _this.$notification['success']({
              message: '系统通知',
              description: '操作成功'
            })
            _this.getDataSource()
          })
        }
      })
    },
    changeStatus(checked, data) {
      const status = {
        enabled: checked
      }
      const _this = this
      if (!checked) {
        this.$confirm({
          title: '系统提示',
          content: '确认禁用该条数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            _this.changePosStatus(status, data)
          },
          onCancel() {}
        })
      } else {
        this.changePosStatus(status, data)
      }
    },
    changePosStatus(status, data) {
      changePosState(data.id, status).then(res => {
        this.$notification['success']({
          message: '系统通知',
          description: '操作成功'
        })
        this.getDataSource()
      })
    }
  }
}
</script>

<style scoped lang="less">
@import 'btn';
</style>
