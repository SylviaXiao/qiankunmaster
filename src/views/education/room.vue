<template>
  <a-card :bordered='false'>
    <div class="searchGroup">

    </div>
    <div class="btnGroup">
      <perm-box perm='education:room:save'>
        <a-button icon='plus-circle' type="primary" @click="openModal()">新增</a-button>
      </perm-box>
    </div>
    <a-table :columns="columns" :dataSource="roomList" :pagination='false' rowKey="id">
     <span slot='roomState' slot-scope="text, record">
          <perm-box :text="record.state=='Y'?'启用':'禁用'" perm='education:room:status'>
            <a-switch @change='changeStatus($event,record)' v-model="record.state=='Y'?true:false">
                <a-icon type="check" slot="checkedChildren"/>
                <a-icon type="close" slot="unCheckedChildren"/>
            </a-switch>
          </perm-box>
       <!--         <a-switch @change='changeStatus($event,record)' v-model="record.state=='Y'?true:false"/>-->
      </span>
      <span slot='action' slot-scope="text, record">
        <perm-box perm='education:room:save'>
            <a href="javascript:;" @click="openModal(record)">编辑</a>
          </perm-box>
          <perm-box perm='education:room:del'>
            <a href="javascript:;" @click="remove(record)">删除</a>
          </perm-box>
      </span>
    </a-table>
    <a-modal :maskClosable="$store.state.modalMaskClickEnable"
             :title="modalTitle"
             v-model="modalVisible"
             okText="保存"
             cancelText="取消"
             @ok='sendForm()'
    >
      <a-spin :spinning="spinning">
        <a-form :form="form">
          <!-- 教室名称 -->
          <a-form-item
            label="教室名称" v-bind="formItemLayout">
            <a-input
              placeholder="请输入教室名称"
              v-decorator="[
                'roomName',
                {rules: [{ required: true, message: '请输入教室名称' }]}
              ]"
            />
          </a-form-item>
          <!-- 舞种描述 -->
          <a-form-item
            label="容纳人数" v-bind="formItemLayout">
            <a-input
              placeholder="请输入容纳人数"
              v-decorator="[
                'roomNum',
                {rules: [{ required: true, message: '请输入容纳人数' },{validator: this.verifyNum}]}
              ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </a-card>
</template>

<script>
  import PermBox from '@/components/PermBox'
  import { getRoomList, saveRoom, removeRoom, changeRoomState } from '@/api/education'

  const columns = [
    {
      title: '教室名称',
      dataIndex: 'roomName'
    },
    {
      title: '所属分馆',
      dataIndex: 'deptName'
    },
    {
      title: '容纳人数',
      dataIndex: 'roomNum',
      width: '200px'
    },
    {
      title: '启用/禁用',
      dataIndex: 'state',
      width: '200px',
      scopedSlots: { customRender: 'roomState' }
    },
    {
      title: '操作',
      key: 'action',
      width: '150px',
      scopedSlots: { customRender: 'action' }
    }
  ]
  export default {
    name: 'room',
    components: {

      PermBox
    },
    data() {
      return {
        columns,
        formItemLayout: this.$tools.formItemLayout,
        searchGroupLayout: this.$tools.searchGroupLayout,
        roomList: [],
        modalTitle: '教室信息',
        modalVisible: false,
        spinning: false,
        formValues: {}
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
    },
    created() {
      this.getRoomList()
    },
    methods: {
      verifyNum(rule, value, callback) {
        this.$verify.isNum(rule, value, callback)
      },
      getRoomList() {
        getRoomList().then(res => {
          this.roomList = res.data
        })
      },
      openModal(data) {
        data ? this.edit(data) : this.add()
        this.modalVisible = true
      },
      add() {
        this.spinning = false
        this.modalTitle = '新增教室'
        this.formValues = {}
        this.form.resetFields()
        // console.log('add')
      },
      edit(data) {
        this.modalTitle = '修改教室'
        this.formValues.id = data.id
        this.spinning = true
        this.$nextTick(() => {
          this.form.setFieldsValue({ ['roomName']: data.roomName })
          this.form.setFieldsValue({ ['roomNum']: data.roomNum })
          this.spinning = false
        })
        //console.log('edit')
      },
      remove(data) {
        const _this = this
        this.$confirm({
          title: '系统提示',
          content: '确认删除该条数据吗?',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            removeRoom(data.id).then(res => {
              _this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              _this.getRoomList()
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
              _this.changeRoomState(data, checked)
            },
            onCancel() {
            }
          })
        } else {
          this.changeRoomState(data, checked)
        }
      },
      changeRoomState(data, checked) {
        var params = { state: checked ? 'Y' : 'N' }
        changeRoomState(data.id, params).then(res => {
          this.$notification['success']({
            message: '系统通知',
            description: '操作成功'
          })
          this.getRoomList()
        })

      },
      sendForm() {
        this.form.validateFields((err, values) => {
          if (!err) {
            const formValue = Object.assign(this.formValues, values)
            // return
            saveRoom(formValue).then(res => {
              this.modalVisible = false
              this.$notification['success']({
                message: '系统通知',
                description: '操作成功'
              })
              this.getRoomList()
            })
          }
        })

      }
    }
  }
</script>

<style scoped lang=less>
  @import "../organize/btn";

</style>
