<template>
  <div class="type-wrapper">
    <a-card :bordered="false">
      <div class="btnGroup" style="margin-bottom: 20px;">
        <perm-box perm='education:type:save'>
          <a-button type="primary" icon="plus-circle" @click="openModal()">新增</a-button>
        </perm-box>
      </div>
      <div class="table-wrapper">
        <a-table ref="table"
                 :columns="roleColumns"
                 :dataSource="typeList"
                 :pagination='false'
                 rowKey="id">
          <span slot="state" slot-scope="text,record">
            <perm-box :text="record.state=='Y'?'启用':'禁用'" perm='education:type:status'>
              <a-switch @change='changeStatus($event,record)' v-model="record.state=='Y'?true:false">
                <a-icon type="check" slot="checkedChildren"/>
                <a-icon type="close" slot="unCheckedChildren"/>
              </a-switch>
            </perm-box>
          </span>
          <span slot="action" slot-scope="text,record">
            <perm-box perm='education:type:save'>
              <a href="javascript:;" @click="openModal(record)">编辑</a>
            </perm-box>
            <perm-box perm='education:type:del'>
              <a href="javascript:;" @click="remove(record)">删除</a>
            </perm-box>
          </span>
        </a-table>
      </div>
    </a-card>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
             v-model="saveModalVisible"
             :title="modalName"
             @ok="sendForm()"
             okText="提交">
      <a-spin :spinning="spinning">
        <a-form :form="saveForm">
          <!-- 类型名称 -->
          <a-form-item label="类型名称" v-bind="formItemLayout">
            <a-input
              v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入类型名称' }]}]"/>
          </a-form-item>
          <!-- 教研排序  -->
          <a-form-item label="教研排序" v-bind="formItemLayout">
            <a-input-number
              style="width: 90%;"
              :min="0"
              :max="999999999"
              v-decorator="['order']"/>
            <a-tooltip>
              <template slot='title'>
                数字越大越靠前
              </template>
              <a-icon type="exclamation-circle" style="font-size: 20px;line-height: 40px;float: right;" />
            </a-tooltip>
          </a-form-item>
          <!-- 其他排序  -->
          <a-form-item label="其他排序" v-bind="formItemLayout">
            <a-input-number
              style="width: 90%;"
              :min="0"
              :max="999999999"
              v-decorator="['otherOrder']"/>
            <a-tooltip>
              <template slot='title'>
                数字越大越靠前
              </template>
              <a-icon type="exclamation-circle" style="font-size: 20px;line-height: 40px;float: right;" />
            </a-tooltip>
          </a-form-item>
          <!-- 描述 -->
          <a-form-item label="描述" v-bind="formItemLayout">
            <a-input placeholder="请输入描述 (100字以内)"
                     v-decorator="['desc',{rules:[{validator:$verify.lenth}]}]"/>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
  import {
    listEduType,
    saveEduType,
    removeEduType,
    enableType
  } from '@/api/education'
  import PermBox from '@/components/PermBox'

  const roleColumns = [
    {
      title: '类型名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '备注',
      dataIndex: 'desc',
      key: 'desc'
    },
    {
      title: '教研排序',
      dataIndex: 'order',
      key: 'order'
    },
    {
      title: '其他排序',
      dataIndex: 'otherOrder',
      key: 'otherOrder'
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      scopedSlots: { customRender: 'state' }
    },
    {
      title: '操作',
      key: 'action',
      width: '150px',
      scopedSlots: { customRender: 'action' }
    }
  ]
  export default {
    name: 'type',
    components: {
      PermBox
    },
    data() {
      return {
        roleColumns,
        formItemLayout: this.$tools.formItemLayout,
        typeList: [],
        modalName: '类型信息',
        saveModalVisible: false,
        spinning: false,
        formValues: {}
      }
    },
    beforeCreate() {
      this.saveForm = this.$form.createForm(this)
    },
    created() {
      this.getTypeList()
    },
    methods: {
      getTypeList() {
        listEduType().then(res => this.typeList = res.data)
      },
      openModal(data) {
        !data ? this.add() : this.edit(data)
      },
      initModalForm() {
        return new Promise((resolve, reject) => {
          this.formValues = {}
          this.saveForm.resetFields()
          resolve()
        })
      },
      add() {
        this.modalName = '新增类型'
        this.initModalForm().then(() => {
          this.saveModalVisible = true
        })
      },
      edit(data) {
        const { name, order, otherOrder, desc } = data
        this.modalName = '编辑类型'
        this.saveModalVisible = true
        this.spinning = true
        this.formValues.id = data.id
        this.$nextTick(() => {
          this.saveForm.setFieldsValue({ name, order, otherOrder, desc })
          this.spinning = false
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
            removeEduType(data.id).then(res => {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this.getTypeList()
            })
          }
        })
      },
      changeStatus(checked, data) {
        const _this = this
        if (!checked) {
          this.$confirm({
            title: '系统提示',
            content: '确认禁用该条数据吗?',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              _this.changeTypeState(data, checked)
            },
            onCancel() {
            }
          })
        } else {
          this.changeTypeState(data, checked)
        }
      },
      changeTypeState(data, checked) {
        var params = { state: checked ? 'Y' : 'N' }
        enableType(data.id, params).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.getTypeList()
        })
      },
      sendForm() {
        this.saveForm.validateFields((err, values) => {
          if (!err) {
            let formValues = Object.assign(values, this.formValues) || {}

            saveEduType(formValues).then(res => {
              this.$notification['success']({
                message: '系统通知',
                description: '提交成功'
              })
              this.saveModalVisible = false
              this.getTypeList()
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang=less>
</style>
